<?php

use App\Models\HospitalUnit;
use App\Models\User;

test('user can list active hospital units', function () {
    $user = User::factory()->create();
    HospitalUnit::factory()->create(['is_active' => true, 'name' => 'Poli Umum']);
    HospitalUnit::factory()->create(['is_active' => false, 'name' => 'Poli Nonaktif']);

    $response = $this->actingAs($user)->getJson('/api/hospital-units');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'Poli Umum');
});