<?php

namespace App\Services;

use App\Models\OutpatientRegistration;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class OutpatientRegistrationService
{
    public function __construct(
        private readonly AuditService $auditService
    ) {
    }

    public function paginate(array $filters): LengthAwarePaginator
    {
        $perPage = max(1, min((int) ($filters['per_page'] ?? 10), 100));
        $date = $filters['date'] ?? Carbon::today()->toDateString();

        return OutpatientRegistration::query()
            ->with(['patient', 'hospitalUnit', 'doctor.staff', 'payer'])
            ->whereDate('registration_date', $date)
            ->when(
                $filters['search'] ?? null,
                function ($query, $search) {
                    $search = trim($search);
                    $query->whereHas('patient', function ($q) use ($search) {
                        $q->where('medical_record_no', 'like', "%{$search}%")
                            ->orWhere('full_name', 'like', "%{$search}%")
                            ->orWhere('nik', 'like', "%{$search}%");
                    });
                }
            )
            ->when(
                $filters['status'] ?? null,
                fn ($query, $status) => $query->where('status', $status)
            )
            ->latest('registration_time')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function todayStats(): array
    {
        $today = Carbon::today();
        $base = OutpatientRegistration::whereDate('registration_date', $today);

        return [
            'total' => (clone $base)->count(),
            'registered' => (clone $base)->where('status', OutpatientRegistration::STATUS_REGISTERED)->count(),
            'in_service' => (clone $base)->where('status', OutpatientRegistration::STATUS_IN_SERVICE)->count(),
            'completed' => (clone $base)->where('status', OutpatientRegistration::STATUS_COMPLETED)->count(),
        ];
    }

    public function create(array $data): OutpatientRegistration
    {
        return DB::transaction(function () use ($data) {
            $today = Carbon::today();
            $adminFee = 40000; // TODO: pindahkan ke tarif dinamis (medical_service_catalogs) saat modul tarif tersedia

            $countToday = OutpatientRegistration::whereDate('registration_date', $today)
                ->lockForUpdate()
                ->count();

            $counterCount = OutpatientRegistration::whereDate('registration_date', $today)
                ->where('counter_queue_no', 'like', 'A-%')
                ->lockForUpdate()
                ->count();

            $registration = OutpatientRegistration::create([
                ...$data,
                'registration_no' => 'REG-' . $today->format('Ymd') . '-' . str_pad((string) ($countToday + 1), 4, '0', STR_PAD_LEFT),
                'registration_date' => $today,
                'registration_time' => now()->format('H:i:s'),
                'service_type' => 'RAWAT_JALAN',
                'counter_queue_no' => 'A-' . str_pad((string) ($counterCount + 1), 3, '0', STR_PAD_LEFT),
                'sla_minutes' => 30,
                'registration_fee' => 0,
                'admin_fee' => $adminFee,
                'estimated_total' => $adminFee,
                'status' => OutpatientRegistration::STATUS_REGISTERED,
                'created_by' => auth()->id(),
            ]);

            $this->auditService->log(
                action: 'OUTPATIENT_REGISTRATION_CREATE',
                model: $registration,
                new: [
                    'registration_no' => $registration->registration_no,
                    'patient_id' => $registration->patient_id,
                ],
            );

            return $registration->load(['patient', 'hospitalUnit', 'doctor.staff', 'payer']);
        });
    }
}