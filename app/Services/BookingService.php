<?php

namespace App\Services;

use App\Models\DoctorSchedule;
use App\Models\DoctorScheduleQuota;
use App\Models\OutpatientBooking;
use App\Models\Payer;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingService
{
    public function __construct(
        private readonly AuditService $auditService
    ) {
    }

    public function create(array $data, ?User $actor): OutpatientBooking
    {
        return DB::transaction(function () use ($data, $actor) {
            $schedule = DoctorSchedule::with(['doctor', 'hospitalUnit'])
                ->findOrFail($data['doctor_schedule_id']);

            $payer = Payer::findOrFail($data['payer_id']);
            $payerGroup = $payer->category === 'BPJS' ? 'BPJS' : 'NON_BPJS';
            $channel = $data['booking_source'] === 'COUNTER' ? 'ONSITE' : 'ONLINE';

            // lockForUpdate() WAJIB di sini — mencegah dua petugas booking slot sama secara bersamaan
            $quota = DoctorScheduleQuota::where('doctor_schedule_id', $schedule->id)
                ->where('channel', $channel)
                ->where('payer_group', $payerGroup)
                ->lockForUpdate()
                ->firstOrFail();

            if ($quota->quota_used >= $quota->quota_total) {
                throw ValidationException::withMessages([
                    'doctor_schedule_id' => ['Kuota dokter sudah penuh.'],
                ]);
            }

            $booking = OutpatientBooking::create([
                ...$data,
                'booking_code' => 'BK-' . now()->format('YmdHis') . '-' . random_int(100, 999),
                'hospital_unit_id' => $schedule->hospital_unit_id,
                'doctor_id' => $schedule->doctor_id,
                'visit_date' => $schedule->schedule_date,
                'visit_time' => $schedule->start_time,
                'status' => 'WAITING',
                'created_by' => $actor?->id,
            ]);

            $quota->increment('quota_used');

            $this->auditService->log(
                action: 'BOOKING_CREATE',
                model: $booking,
                new: [
                    'booking_code' => $booking->booking_code,
                    'patient_id' => $booking->patient_id,
                    'doctor_schedule_id' => $schedule->id,
                ],
            );

            return $booking->load(['patient', 'hospitalUnit', 'doctor.staff', 'payer']);
        });
    }

    public function checkIn(OutpatientBooking $booking): OutpatientBooking
    {
        $booking->update(['mobile_jkn_checked_in' => true]);
        return $booking->refresh();
    }
}