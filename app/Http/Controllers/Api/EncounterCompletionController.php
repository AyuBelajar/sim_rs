<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OutpatientEncounter;
use App\Models\FollowUpAppointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EncounterCompletionController extends Controller
{
    public function complete(Request $request, OutpatientEncounter $encounter)
    {
        $validated = $request->validate([
            'exit_type' => ['required', 'string', 'in:PULANG,KONTROL_ULANG,RUJUK_LANJUT,RAWAT_INAP,MENINGGAL'],
            'exit_method' => ['nullable', 'string'],
            'exit_condition' => ['nullable', 'string'], // contoh: MEMBAIK, SEMBUH, TETAP
            'notes' => ['nullable', 'string'],
            'follow_up' => ['nullable', 'array'],
            'follow_up.appointment_date' => ['required_if:exit_type,KONTROL_ULANG', 'nullable', 'date', 'after_or_equal:today'],
            'follow_up.hospital_unit_id' => ['nullable', 'integer'],
            'follow_up.doctor_id' => ['nullable', 'integer'],
            'follow_up.notes' => ['nullable', 'string'],
        ]);

        $completion = DB::transaction(function () use ($encounter, $validated, $request) {
            $staffId = $request->user()?->staff?->id ?? null;

            // 1. Simpan catatan penyelesaian encounter
            $comp = $encounter->completion()->create([
                'exit_type' => $validated['exit_type'],
                'exit_method' => $validated['exit_method'] ?? null,
                'exit_condition' => $validated['exit_condition'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'completed_by' => $staffId,
                'completed_at' => now(),
            ]);

            // 2. Update status encounter & registrasi secara atomik
            $encounter->update([
                'status' => 'COMPLETED',
                'ended_at' => now(),
            ]);

            if ($encounter->registration) {
                $encounter->registration->update(['status' => 'COMPLETED']);
            }

            // 3. Jika pasien butuh kontrol ulang, buat data janji temu kontrol
            if ($validated['exit_type'] === 'KONTROL_ULANG' && !empty($validated['follow_up']['appointment_date'])) {
                FollowUpAppointment::create([
                    'outpatient_encounter_id' => $encounter->id,
                    'patient_id' => $encounter->registration?->patient_id,
                    'appointment_date' => $validated['follow_up']['appointment_date'],
                    'hospital_unit_id' => $validated['follow_up']['hospital_unit_id'] ?? $encounter->registration?->hospital_unit_id,
                    'doctor_id' => $validated['follow_up']['doctor_id'] ?? $encounter->doctor_id,
                    'notes' => $validated['follow_up']['notes'] ?? null,
                    'created_by' => $request->user()?->id,
                ]);
            }

            return $comp;
        });

        return response()->json([
            'success' => true,
            'message' => 'Pelayanan berhasil diselesaikan.',
            'data' => $completion,
        ], 200);
    }
}