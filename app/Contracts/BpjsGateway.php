<?php

namespace App\Contracts;

interface BpjsGateway
{
    /**
     * Cek keaktifan peserta BPJS berdasarkan nomor kartu.
     */
    public function verifyParticipant(string $cardNo): array;

    /**
     * Buat Surat Eligibilitas Peserta (SEP).
     */
    public function createSep(array $payload): array;

    /**
     * Registrasi kunjungan ke PCare (jika faskes tingkat pertama/klinik).
     */
    public function registerPcare(array $payload): array;
}