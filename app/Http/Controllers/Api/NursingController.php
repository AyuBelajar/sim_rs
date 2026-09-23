<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NursingAssessment;
use Illuminate\Http\Request;

class NursingController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'registration_id' => 'required|integer',
            'keluhan_utama' => 'nullable|string',
            'riwayat_alergi' => 'nullable|string',
            'tekanan_darah' => 'nullable|string',
            'detak_jantung' => 'nullable|integer',
            'suhu_badan' => 'nullable|numeric',
            'nafas' => 'nullable|integer',
            'tinggi_badan' => 'nullable|numeric',
            'berat_badan' => 'nullable|numeric',
            'catatan_soap' => 'nullable|string',
            'tingkat_kesadaran' => 'nullable|string',
            'skala_nyeri' => 'nullable|integer',
            'risiko_jatuh' => 'nullable|string',
        ]);

        $assessment = NursingAssessment::updateOrCreate(
            ['registration_id' => $data['registration_id']],
            $data
        );

        return response()->json([
            'message' => 'Data askep rawat jalan berhasil disimpan',
            'data' => $assessment,
        ], 200);
    }
}