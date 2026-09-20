<?php

namespace App\Http\Controllers\Api;

use App\Contracts\BpjsGateway;
use App\Http\Controllers\Controller;
use App\Models\OutpatientRegistration;
use Illuminate\Http\Request;

class BpjsController extends Controller
{
    public function __construct(
        protected BpjsGateway $bpjsGateway
    ) {}

    /**
     * Verifikasi kartu BPJS pasien
     */
    public function verify(OutpatientRegistration $registration, Request $request)
    {
        $cardNo = $request->input('card_no') ?? $registration->patient?->policies?->first()?->policy_number;

        if (!$cardNo) {
            return response()->json([
                'message' => 'Nomor kartu BPJS tidak ditemukan pada data pasien.'
            ], 422);
        }

        $result = $this->bpjsGateway->verifyParticipant($cardNo);

        return response()->json([
            'message' => 'Verifikasi BPJS berhasil',
            'data' => $result,
        ]);
    }

    /**
     * Terbitkan SEP (Surat Eligibilitas Peserta)
     */
    public function createSep(OutpatientRegistration $registration, Request $request)
    {
        $payload = $request->validate([
            'no_rujukan' => ['nullable', 'string'],
            'diagnosa_awal' => ['nullable', 'string'],
            'catatan' => ['nullable', 'string'],
        ]);

        $result = $this->bpjsGateway->createSep($payload);

        return response()->json([
            'message' => 'SEP berhasil diterbitkan',
            'data' => $result,
        ], 201);
    }

    /**
     * Endpoint Pengujian Langsung (Tanpa data registrasi di DB)
     */
    public function verifyTest(Request $request)
    {
        $cardNo = $request->input('card_no', '0001234567890');
        $result = $this->bpjsGateway->verifyParticipant($cardNo);

        return response()->json([
            'message' => 'Verifikasi BPJS berhasil (Mode Test)',
            'data' => $result,
        ]);
    }
}