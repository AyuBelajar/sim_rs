<?php

namespace App\Services;

use App\Models\Patient;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PatientService
{
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

            return Patient::create($data);
        });
    }

    public function update(
        Patient $patient,
        array $data
    ): Patient {
        $patient->update($data);

        return $patient->refresh();
    }

    public function delete(Patient $patient): void
    {
        $patient->delete();
    }
}