<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuditServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_audit_service_can_record_an_action(): void
    {
        $user = User::factory()->create([
            'role' => 'ADMIN',
            'is_active' => true,
        ]);

        $this->actingAs($user);

        $service = app(AuditService::class);

        $service->log(
            action: 'TEST_ACTION',
            model: $user,
            old: [
                'role' => 'FRONT_OFFICE',
            ],
            new: [
                'role' => 'ADMIN',
            ],
        );

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'TEST_ACTION',
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
        ]);
    }

    public function test_sensitive_values_are_not_stored_in_audit_log(): void
    {
        $user = User::factory()->create([
            'role' => 'ADMIN',
            'is_active' => true,
        ]);

        $this->actingAs($user);

        app(AuditService::class)->log(
            action: 'SECURITY_TEST',
            model: $user,
            new: [
                'email' => $user->email,
                'password' => 'secret-password',
                'token' => 'secret-token',
            ],
        );

        $log = AuditLog::where(
            'action',
            'SECURITY_TEST'
        )->firstOrFail();

        $this->assertSame(
            $user->email,
            $log->new_values['email']
        );

        $this->assertArrayNotHasKey(
            'password',
            $log->new_values
        );

        $this->assertArrayNotHasKey(
            'token',
            $log->new_values
        );
    }

    public function test_successful_login_creates_auth_login_audit(): void
    {
        $user = User::factory()->create([
            'email' => 'audit-login@test.local',
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

        $response->assertOk();

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'AUTH_LOGIN',
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
        ]);
    }

    public function test_logout_creates_auth_logout_audit(): void
    {
        $user = User::factory()->create([
            'role' => 'ADMIN',
            'is_active' => true,
        ]);

        $token = $user
            ->createToken('audit-test')
            ->plainTextToken;

        $response = $this
            ->withHeader(
                'Authorization',
                'Bearer ' . $token
            )
            ->postJson('/api/auth/logout');

        $response->assertNoContent();

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'AUTH_LOGOUT',
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
        ]);
    }
}