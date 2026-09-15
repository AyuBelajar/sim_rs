<?php

namespace Database\Seeders;

use App\Models\HospitalUnit;
use Illuminate\Database\Seeder;

class HospitalUnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            [
                'code' => 'POL-UMUM',
                'name' => 'Poli Umum',
                'unit_type' => 'POLI',
                'location' => 'Lantai 1',
            ],
            [
                'code' => 'POL-ANAK',
                'name' => 'Poli Anak',
                'unit_type' => 'POLI',
                'location' => 'Lantai 1',
            ],
            [
                'code' => 'POL-PD',
                'name' => 'Poli Penyakit Dalam',
                'unit_type' => 'POLI',
                'location' => 'Lantai 1',
            ],
            [
                'code' => 'POL-JTG',
                'name' => 'Poli Jantung',
                'unit_type' => 'POLI',
                'location' => 'Lantai 2',
            ],
            [
                'code' => 'POL-OBGYN',
                'name' => 'Poli Obstetri dan Ginekologi',
                'unit_type' => 'POLI',
                'location' => 'Lantai 2',
            ],
            [
                'code' => 'POL-SARAF',
                'name' => 'Poli Saraf',
                'unit_type' => 'POLI',
                'location' => 'Lantai 2',
            ],
            [
                'code' => 'IGD',
                'name' => 'Instalasi Gawat Darurat',
                'unit_type' => 'IGD',
                'location' => 'Lantai Dasar',
            ],
            [
                'code' => 'LAB',
                'name' => 'Laboratorium',
                'unit_type' => 'LAB',
                'location' => 'Lantai 1',
            ],
            [
                'code' => 'RAD',
                'name' => 'Radiologi',
                'unit_type' => 'RADIOLOGI',
                'location' => 'Lantai 1',
            ],
        ];

        foreach ($units as $unit) {
            HospitalUnit::updateOrCreate(
                ['code' => $unit['code']],
                [
                    'name' => $unit['name'],
                    'unit_type' => $unit['unit_type'],
                    'location' => $unit['location'],
                    'is_active' => true,
                ]
            );
        }
    }
}