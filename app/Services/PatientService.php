<?php

namespace App\Services;

use App\Models\Patient;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PatientService
{
    public function __construct(
        private readonly AuditService $auditService
    ) {
    }

    public function paginate(array $filters): LengthAwarePaginator
    {
        $perPage = (int) ($filters['per_page'] ?? 15);

        $perPage = max(1, min($perPage, 100));

        return Patient::query()

            ->when(
                $filters['search'] ?? null,
                function ($query, $search) {
                    $search = trim($search);

                    $query->where(function ($query) use ($search) {
                        $query
                            ->where(
                                'medical_record_no',
                                'like',
                                "%{$search}%"
                            )
                            ->orWhere(
                                'full_name',
                                'like',
                                "%{$search}%"
                            )
                            ->orWhere(
                                'nik',
                                'like',
                                "%{$search}%"
                            )
                            ->orWhere(
                                'phone',
                                'like',
                                "%{$search}%"
                            );
                    });
                }
            )

            ->when(
                $filters['gender'] ?? null,
                fn ($query, $gender) =>
                    $query->where('gender', $gender)
            )

            ->orderByDesc('id')

            ->paginate($perPage)

            ->withQueryString();
    }

    public function create(array $data): Patient
    {
        return DB::transaction(function () use ($data) {

            $lastPatient = Patient::withTrashed()
                ->lockForUpdate()
                ->orderByDesc('id')
                ->first();

            $nextNumber = ($lastPatient?->id ?? 0) + 1;

            $data['medical_record_no'] =
                'RM' .
                str_pad(
                    (string) $nextNumber,
                    6,
                    '0',
                    STR_PAD_LEFT
                );

            if (auth()->check()) {
                $data['created_by'] = auth()->id();
            }

            $patient = Patient::create($data);

            $this->auditService->log(
                action: 'PATIENT_CREATE',
                model: $patient,
                new: [
                    'medical_record_no' =>
                        $patient->medical_record_no,

                    'full_name' =>
                        $patient->full_name,

                    'gender' =>
                        $patient->gender,
                ],
            );

            return $patient;
        });
    }

    public function update(
        Patient $patient,
        array $data
    ): Patient {
        return DB::transaction(
            function () use ($patient, $data) {

                $oldValues = $patient->only(
                    array_keys($data)
                );

                $patient->update($data);

                $oldChanged = [];
                $newChanged = [];

                foreach ($data as $key => $value) {

                    if (!$patient->wasChanged($key)) {
                        continue;
                    }

                    $oldChanged[$key] =
                        $oldValues[$key] ?? null;

                    $newChanged[$key] =
                        $patient->getAttribute($key);
                }

                if ($newChanged !== []) {
                    $this->auditService->log(
                        action: 'PATIENT_UPDATE',
                        model: $patient,
                        old: $oldChanged,
                        new: $newChanged,
                    );
                }

                return $patient->refresh();
            }
        );
    }

    public function delete(Patient $patient): void
    {
        DB::transaction(function () use ($patient) {

            $this->auditService->log(
                action: 'PATIENT_DELETE',
                model: $patient,
                old: [
                    'medical_record_no' =>
                        $patient->medical_record_no,

                    'full_name' =>
                        $patient->full_name,
                ],
            );

            $patient->delete();
        });
    }
}