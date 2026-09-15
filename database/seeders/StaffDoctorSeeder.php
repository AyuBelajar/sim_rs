<?php

namespace Database\Seeders;

use App\Models\DoctorProfile;
use App\Models\Staff;
use Illuminate\Database\Seeder;

class StaffDoctorSeeder extends Seeder
{
    public function run(): void
    {
        $doctors = [
            [
                'employee_no' => 'DR001',
                'full_name' => 'dr. Andi Pratama',
                'profession' => 'DOKTER',
                'str_no' => 'STR-DR-001',
                'sip_no' => 'SIP-DR-001',
                'specialization' => 'Dokter Umum',
                'specialty_code' => 'UMUM',
            ],
            [
                'employee_no' => 'DR002',
                'full_name' => 'dr. Budi Santoso, Sp.A',
                'profession' => 'DOKTER',
                'str_no' => 'STR-DR-002',
                'sip_no' => 'SIP-DR-002',
                'specialization' => 'Spesialis Anak',
                'specialty_code' => 'ANAK',
            ],
            [
                'employee_no' => 'DR003',
                'full_name' => 'dr. Citra Dewi, Sp.PD',
                'profession' => 'DOKTER',
                'str_no' => 'STR-DR-003',
                'sip_no' => 'SIP-DR-003',
                'specialization' => 'Spesialis Penyakit Dalam',
                'specialty_code' => 'PD',
            ],
            [
                'employee_no' => 'DR004',
                'full_name' => 'dr. Dimas Putra, Sp.JP',
                'profession' => 'DOKTER',
                'str_no' => 'STR-DR-004',
                'sip_no' => 'SIP-DR-004',
                'specialization' => 'Spesialis Jantung',
                'specialty_code' => 'JTG',
            ],
        ];

        foreach ($doctors as $doctorData) {
            $staff = Staff::updateOrCreate(
                [
                    'employee_no' => $doctorData['employee_no'],
                ],
                [
                    'full_name' => $doctorData['full_name'],
                    'profession' => $doctorData['profession'],
                    'str_no' => $doctorData['str_no'],
                    'sip_no' => $doctorData['sip_no'],
                    'is_active' => true,
                ]
            );

            DoctorProfile::updateOrCreate(
                [
                    'staff_id' => $staff->id,
                ],
                [
                    'specialization' => $doctorData['specialization'],
                    'specialty_code' => $doctorData['specialty_code'],
                ]
            );
        }
    }
}