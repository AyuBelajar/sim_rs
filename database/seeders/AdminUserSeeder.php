<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@simrs.local'],
            [
                'name' => 'admin@simrs.local',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
    }
}