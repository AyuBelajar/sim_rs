<?php

namespace Database\Seeders;

use App\Models\Payer;
use Illuminate\Database\Seeder;

class PayerSeeder extends Seeder
{
    public function run(): void
    {
        $payers = [
            [
                'code' => 'UMUM',
                'name' => 'Pasien Umum',
                'category' => 'UMUM',
            ],
            [
                'code' => 'BPJS',
                'name' => 'BPJS Kesehatan',
                'category' => 'BPJS',
            ],
            [
                'code' => 'ASURANSI',
                'name' => 'Asuransi Swasta',
                'category' => 'ASURANSI',
            ],
            [
                'code' => 'KARYAWAN',
                'name' => 'Penjamin Karyawan',
                'category' => 'KARYAWAN',
            ],
        ];

        foreach ($payers as $payer) {
            Payer::updateOrCreate(
                ['code' => $payer['code']],
                [
                    'name' => $payer['name'],
                    'category' => $payer['category'],
                    'is_active' => true,
                ]
            );
        }
    }
}