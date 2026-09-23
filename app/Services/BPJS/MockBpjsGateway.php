<?php

namespace App\Services\Bpjs;

use App\Contracts\BpjsGateway;

class MockBpjsGateway implements BpjsGateway
{
    /**
     * Mock data verifikasi kepesertaan.
     */
    public function verifyParticipant(string $cardNo): array
    {
        return [
            'success' => true,
            'card_no' => $cardNo,
            'participant_name' => 'PESERTA MOCK BPJS',
            'participant_status' => 'ACTIVE',
            'registered_facility' => 'Faskes Tingkat 1 Simulasi',
            'class_type' => 'KELAS 1',
            'verified_at' => now()->toIso8601String(),
        ];
    }

    /**
     * Mock pembuatan SEP otomatis.
     */
    public function createSep(array $payload): array
    {
        return [
            'success' => true,
            'sep_no' => 'SEP-' . now()->format('Ymd') . '-' . random_int(100000, 999999),
            'service_type' => 'Rawat Jalan',
            'created_at' => now()->toIso8601String(),
            'notes' => $payload['catatan'] ?? 'SEP berhasil diterbitkan melalui simulasi gateway.',
        ];
    }

    /**
     * Mock registrasi PCare.
     */
    public function registerPcare(array $payload): array
    {
        return [
            'success' => true,
            'registration_no' => 'PCARE-' . now()->format('YmdHis'),
            'registered_at' => now()->toIso8601String(),
        ];
    }
}