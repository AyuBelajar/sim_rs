<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\PatientPolicy;
use App\Models\Payer;
use Illuminate\Database\Seeder;

class DevelopmentPatientSeeder extends Seeder
{
    public function run(): void
    {
        $patient1 = Patient::updateOrCreate(
            [
                'medical_record_no' => 'RM000001',
            ],
            [
                'title' => 'Tn.',
                'full_name' => 'Budi Santoso',
                'nickname' => 'Budi',
                'nik' => '3578010101900001',
                'gender' => 'LAKI_LAKI',
                'birth_place' => 'Surabaya',
                'birth_date' => '1990-01-01',
                'blood_type' => 'O',
                'phone' => '081234567001',
                'religion' => 'Islam',
                'occupation' => 'Karyawan Swasta',
                'marital_status' => 'MENIKAH',
            ]
        );

        $patient2 = Patient::updateOrCreate(
            [
                'medical_record_no' => 'RM000002',
            ],
            [
                'title' => 'Ny.',
                'full_name' => 'Siti Aminah',
                'nickname' => 'Siti',
                'nik' => '3578020202920002',
                'gender' => 'PEREMPUAN',
                'birth_place' => 'Sidoarjo',
                'birth_date' => '1992-02-02',
                'blood_type' => 'A',
                'phone' => '081234567002',
                'religion' => 'Islam',
                'occupation' => 'Guru',
                'marital_status' => 'MENIKAH',
            ]
        );

        $bpjs = Payer::where('code', 'BPJS')->firstOrFail();

        PatientPolicy::updateOrCreate(
            [
                'patient_id' => $patient1->id,
                'payer_id' => $bpjs->id,
                'policy_no' => '0001234567890',
            ],
            [
                'member_name' => $patient1->full_name,
                'insurance_class' => 'KELAS_2',
                'is_primary' => true,
                'status' => 'ACTIVE',
            ]
        );
    }
}