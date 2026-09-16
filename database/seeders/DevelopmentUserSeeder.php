<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DevelopmentUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            [
                'email' => 'admin@simrs.local',
            ],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password123'),
                'role' => 'ADMIN',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            [
                'email' => 'frontoffice@simrs.local',
            ],
            [
                'name' => 'Front Office',
                'password' => Hash::make('password123'),
                'role' => 'FRONT_OFFICE',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            [
                'email' => 'doctor@simrs.local',
            ],
            [
                'name' => 'Doctor',
                'password' => Hash::make('password123'),
                'role' => 'DOCTOR',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            [
                'email' => 'nurse@simrs.local',
            ],
            [
                'name' => 'Nurse',
                'password' => Hash::make('password123'),
                'role' => 'NURSE',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            [
                'email' => 'billing@simrs.local',
            ],
            [
                'name' => 'Billing',
                'password' => Hash::make('password123'),
                'role' => 'BILLING',
                'is_active' => true,
            ]
        );
    }
}