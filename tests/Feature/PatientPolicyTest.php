<?php

namespace Tests\Feature;

use App\Models\Patient;
use App\Models\Payer;
use App\Models\User;
use Tests\TestCase;

class PatientPolicyTest extends TestCase
{
    public function test_user_can_add_a_patient_policy_and_only_one_stays_primary(): void
    {
        $user = User::factory()->create();
        $patient = Patient::factory()->create();
        $payer = Payer::factory()->create();

        $response = $this->actingAs($user)->postJson(
            "/api/patients/{$patient->id}/policies",
            [
                'payer_id' => $payer->id,
                'policy_no' => 'POL-001',
                'is_primary' => true,
            ]
        );

        $response->assertCreated()
            ->assertJsonPath('data.policy_no', 'POL-001');

        $this->assertDatabaseHas('patient_policies', [
            'patient_id' => $patient->id,
            'policy_no' => 'POL-001',
            'is_primary' => true,
        ]);
    }
}