<?php

namespace Database\Seeders;

use App\Models\HealthcareFacility;
use Illuminate\Database\Seeder;

class HealthcareFacilitySeeder extends Seeder
{
    public function run(): void
    {
        $facilities = [
            ['code' => 'PKM-001', 'bpjs_code' => '110123', 'name' => 'Puskesmas Sukolilo', 'facility_type' => 'Puskesmas', 'address' => 'Jl. Sukolilo No. 1, Surabaya', 'phone' => '031-1234567'],
            ['code' => 'KLN-001', 'bpjs_code' => '110456', 'name' => 'Klinik Sehat Sentosa', 'facility_type' => 'Klinik', 'address' => 'Jl. Kertajaya No. 20, Surabaya', 'phone' => '031-7654321'],
            ['code' => 'RS-002', 'bpjs_code' => '110789', 'name' => 'RS Bhayangkara Surabaya', 'facility_type' => 'RS Tipe B', 'address' => 'Jl. Ahmad Yani No. 116, Surabaya', 'phone' => '031-8290920'],
        ];

        foreach ($facilities as $facility) {
            HealthcareFacility::create(array_merge($facility, ['is_active' => true]));
        }
    }
}