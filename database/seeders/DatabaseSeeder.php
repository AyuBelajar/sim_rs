<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            HospitalUnitSeeder::class,
            PayerSeeder::class,
            StaffDoctorSeeder::class,
            DoctorScheduleSeeder::class,
            HealthcareFacilitySeeder::class,
            MedicalServiceCatalogSeeder::class,
        ]);

        if (app()->environment('local')) {
            $this->call([
                DevelopmentPatientSeeder::class,
                DevelopmentUserSeeder::class,
            ]);
        }
    }
}