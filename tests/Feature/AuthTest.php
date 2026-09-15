<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@simrs.local',
            'password' => bcrypt('password123'),
            'role' => 'ADMIN',
            'is_active' => true,
        ]);

        $response = $this->postJson(
            '/api/auth/login',
            [
                'email' => 'admin@simrs.local',
                'password' => 'password123',
            ]
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.user.email',
                'admin@simrs.local'
            )
            ->assertJsonPath(
                'data.user.role',
                'ADMIN'
            );

        $this->assertNotEmpty(
            $response->json('data.token')
        );
    }

    public function test_wrong_password_is_rejected(): void
    {
        User::factory()->create([
            'email' => 'admin@simrs.local',
            'password' => bcrypt('password123'),
            'role' => 'ADMIN',
            'is_active' => true,
        ]);

        $this->postJson(
            '/api/auth/login',
            [
                'email' => 'admin@simrs.local',
                'password' => 'salahpassword',
            ]
        )->assertStatus(422);
    }

    public function test_guest_cannot_access_protected_route(): void
    {
        $this->getJson('/api/patients')
            ->assertUnauthorized();
    }

    public function test_admin_can_access_patient_api(): void
    {
        $user = User::factory()->create([
            'role' => 'ADMIN',
            'is_active' => true,
        ]);

        $token = $user
            ->createToken('test')
            ->plainTextToken;

        $this
            ->withToken($token)
            ->getJson('/api/patients')
            ->assertOk();
    }

    public function test_front_office_can_access_patient_api(): void
    {
        $user = User::factory()->create([
            'role' => 'FRONT_OFFICE',
            'is_active' => true,
        ]);

        $token = $user
            ->createToken('test')
            ->plainTextToken;

        $this
            ->withToken($token)
            ->getJson('/api/patients')
            ->assertOk();
    }

    public function test_doctor_cannot_access_patient_administration(): void
    {
        $user = User::factory()->create([
            'role' => 'DOCTOR',
            'is_active' => true,
        ]);

        $token = $user
            ->createToken('test')
            ->plainTextToken;

        $this
            ->withToken($token)
            ->getJson('/api/patients')
            ->assertForbidden();
    }
}