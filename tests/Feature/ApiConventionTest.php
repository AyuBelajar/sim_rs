<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiConventionTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_api_request_returns_json_401(): void
    {
        $response = $this->getJson(
            '/api/patients'
        );

        $response
            ->assertStatus(401)
            ->assertJson([
                'message' =>
                    'Unauthenticated.',
            ]);
    }

    public function test_forbidden_role_returns_json_403(): void
    {
        $user = User::factory()->create([
            'role' => 'DOCTOR',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson(
            '/api/patients'
        );

        $response
            ->assertStatus(403)
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_missing_patient_returns_json_404(): void
    {
        $user = User::factory()->create([
            'role' => 'FRONT_OFFICE',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson(
            '/api/patients/999999999'
        );

        $response
            ->assertStatus(404)
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_validation_error_returns_standard_422_response(): void
    {
        $response = $this->postJson(
            '/api/auth/login',
            [
                'email' => '',
                'password' => '',
            ]
        );

        $response
            ->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors',
            ])
            ->assertJson([
                'message' =>
                    'Data yang diberikan tidak valid.',
            ]);
    }

    public function test_unknown_api_route_returns_json_404(): void
    {
        $response = $this->getJson(
            '/api/route-yang-tidak-ada'
        );

        $response
            ->assertStatus(404)
            ->assertJsonStructure([
                'message',
            ]);
    }
}