<?php

namespace Database\Seeders;

use App\Models\MedicalServiceCatalog;
use Illuminate\Database\Seeder;

class MedicalServiceCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['code' => 'TND-001', 'category' => 'Tindakan', 'name' => 'Pemeriksaan Dokter Umum', 'unit' => 'kali', 'default_tariff' => 150000],
            ['code' => 'TND-002', 'category' => 'Tindakan', 'name' => 'Pemeriksaan Dokter Spesialis', 'unit' => 'kali', 'default_tariff' => 250000],
            ['code' => 'BHP-001', 'category' => 'BHP', 'name' => 'Sarung Tangan Medis', 'unit' => 'pasang', 'default_tariff' => 25000],
            ['code' => 'ADM-001', 'category' => 'Admin', 'name' => 'Biaya Pendaftaran', 'unit' => 'kali', 'default_tariff' => 40000],
        ];

        foreach ($services as $service) {
            MedicalServiceCatalog::create(array_merge($service, ['is_active' => true]));
        }
    }
}