<?php

namespace Database\Seeders;

use App\Models\HospitalUnit;
use App\Models\Staff;
use App\Models\StaffUnitAssignment;
use Illuminate\Database\Seeder;

class StaffUnitAssignmentSeeder extends Seeder
{
    public function run(): void
    {
        // Sesuaikan pasangan nama dokter -> kode unit
        // dengan data staff & hospital_units yang sudah ada di database kamu.
        $mapping = [
            'dr. Andi Pratama' => 'POL-UMUM',
            'dr. Budi Santoso' => 'POL-ANAK',
            'dr. Citra Dewi' => 'POL-PD',
            'dr. Dimas Putra' => 'POL-JTG',
        ];

        foreach ($mapping as $staffName => $unitCode) {
            $staff = Staff::where('full_name', 'like', "%{$staffName}%")->first();
            $unit = HospitalUnit::where('code', $unitCode)->first();

            if (! $staff || ! $unit) {
                continue;
            }

            StaffUnitAssignment::firstOrCreate(
                [
                    'staff_id' => $staff->id,
                    'hospital_unit_id' => $unit->id,
                ],
                [
                    'is_primary' => true,
                ]
            );
        }
    }
}