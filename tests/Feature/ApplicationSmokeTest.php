<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApplicationSmokeTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_endpoint_is_available(): void
    {
        $this->get('/up')
            ->assertOk();
    }

    public function test_login_endpoint_accepts_valid_user(): void
    {
        $user = User::factory()->create([
            'email' => 'qa-admin@test.local',
            'password' => Hash::make('password123'),
            'role' => 'ADMIN',
            'is_active' => true,
        ]);

        $response = $this->postJson(
            '/api/auth/login',
            [
                'email' => $user->email,
                'password' => 'password123',
            ]
        );

        $response
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'role',
                    ],
                ],
            ]);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/auth/me')
            ->assertUnauthorized();
    }

    public function test_authenticated_user_can_access_me(): void
    {
        $user = User::factory()->create([
            'role' => 'ADMIN',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath(
                'data.id',
                $user->id
            );
    }

    public function test_inactive_user_cannot_login(): void
    {
        $user = User::factory()->create([
            'email' => 'inactive@test.local',
            'password' => Hash::make('password123'),
            'role' => 'ADMIN',
            'is_active' => false,
        ]);

        $this->postJson(
            '/api/auth/login',
            [
                'email' => $user->email,
                'password' => 'password123',
            ]
        )->assertUnprocessable();
    }

    public function test_front_office_can_access_patient_module(): void
    {
        $user = User::factory()->create([
            'role' => 'FRONT_OFFICE',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/patients')
            ->assertOk();
    }

    public function test_doctor_cannot_access_patient_administration(): void
    {
        $user = User::factory()->create([
            'role' => 'DOCTOR',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/patients')
            ->assertForbidden();
    }

    public function test_admin_override_can_access_patient_module(): void
    {
        $user = User::factory()->create([
            'role' => 'ADMIN',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/patients')
            ->assertOk();
    }
}