<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FollowUpAppointment;
use App\Models\NursingAssessment;
use App\Models\OutpatientEncounter;
use App\Models\OutpatientRegistration;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NursingController extends Controller
{
    /**
     * Ambil Antrean Pasien Rawat Jalan Hari Ini untuk Perawat
     */
    public function queue()
    {
        $registrations = OutpatientRegistration::with(['patient', 'hospitalUnit', 'payer'])
            ->whereDate('registration_date', today())
            ->whereIn('status', ['REGISTERED', 'IN_SERVICE'])
            ->orderBy('id', 'asc')
            ->get();

        $data = $registrations->map(function ($reg) {
            $age = $reg->patient?->birth_date 
                ? Carbon::parse($reg->patient->birth_date)->age 
                : 0;

            return [
                'registration_id' => $reg->id,
                'no_antrean'      => $reg->counter_queue_no ?? ('A-' . str_pad($reg->id, 2, '0', STR_PAD_LEFT)),
                'no_rm'           => $reg->patient?->medical_record_no ?? '-',
                'nama'            => $reg->patient?->full_name ?? 'Pasien Anonim',
                'umur'            => $age,
                'jenis_kelamin'   => ($reg->patient?->gender === 'PEREMPUAN') ? 'Perempuan' : 'Laki-laki',
                'penjamin'        => ($reg->payer?->category === 'BPJS') ? 'BPJS' : 'Umum',
                'poli'            => $reg->hospitalUnit?->name ?? 'Poli Umum',
                'status'          => ($reg->status === 'IN_SERVICE') ? 'Dilayani' : 'Menunggu',
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    /**
     * Ambil Asesmen Keperawatan berdasarkan Pendaftaran
     */
    public function getAssessment(OutpatientRegistration $registration)
    {
        $assessment = NursingAssessment::where('registration_id', $registration->id)->latest()->first();

        return response()->json([
            'success' => true,
            'data'    => $assessment,
        ]);
    }

    /**
     * Simpan / Perbarui Asesmen Awal Keperawatan
     */
    public function storeAssessment(Request $request, OutpatientRegistration $registration)
    {
        $validated = $request->validate([
            'petugas'           => ['nullable', 'string', 'max:150'],
            'keluhan_utama'     => ['required', 'string'],
            'riwayat_alergi'    => ['nullable', 'string'],
            'tekanan_darah'     => ['nullable', 'string', 'max:20'],
            'detak_jantung'     => ['nullable', 'numeric'],
            'suhu_badan'        => ['nullable', 'numeric'],
            'nafas'             => ['nullable', 'numeric'],
            'tinggi_badan'      => ['nullable', 'numeric'],
            'berat_badan'       => ['nullable', 'numeric'],
            'tingkat_kesadaran' => ['nullable', 'string', 'max:50'],
            'skala_nyeri'       => ['nullable', 'integer', 'between:0,10'],
            'risiko_jatuh'      => ['nullable', 'string', 'max:50'],
            'catatan_soap'      => ['nullable', 'string'],
        ]);

        $petugasName = $validated['petugas'] 
            ?? $request->user()?->staff?->full_name 
            ?? $request->user()?->name 
            ?? 'Perawat Rawat Jalan';

        $assessment = NursingAssessment::updateOrCreate(
            ['registration_id' => $registration->id],
            array_merge($validated, ['petugas' => $petugasName])
        );

        return response()->json([
            'success' => true,
            'message' => 'Asesmen keperawatan berhasil disimpan.',
            'data'    => $assessment,
        ], 201);
    }

    /**
     * Selesaikan Pelayanan Kunjungan dan Jadwalkan Kontrol Ulang (jika ada)
     */
    public function completeEncounter(Request $request, OutpatientEncounter $encounter)
    {
        $validated = $request->validate([
            'exit_type'                  => ['required', 'string'],
            'exit_condition'             => ['nullable', 'string'],
            'notes'                      => ['nullable', 'string'],
            'follow_up.appointment_date' => ['required_if:exit_type,KONTROL_ULANG', 'nullable', 'date'],
            'follow_up.notes'            => ['nullable', 'string'],
        ]);

        $staffId = $request->user()?->staff?->id ?? 1;

        $result = DB::transaction(function () use ($encounter, $validated, $staffId, $request) {
            // 1. Simpan rekam encounter completion
            $completion = $encounter->completion()->create([
                'exit_type'      => $validated['exit_type'],
                'exit_condition' => $validated['exit_condition'] ?? null,
                'notes'          => $validated['notes'] ?? null,
                'completed_by'   => $staffId,
                'completed_at'   => now(),
            ]);

            // 2. Tandai encounter & registration selesai
            $encounter->update([
                'status'   => 'COMPLETED',
                'ended_at' => now(),
            ]);

            if ($encounter->registration) {
                $encounter->registration->update(['status' => 'COMPLETED']);
            }

            // 3. Simpan rencana kontrol ulang jika jenis keluar KONTROL_ULANG
            if ($validated['exit_type'] === 'KONTROL_ULANG' && !empty($validated['follow_up'])) {
                FollowUpAppointment::create([
                    'outpatient_encounter_id' => $encounter->id,
                    'patient_id'              => $encounter->registration->patient_id,
                    'appointment_date'        => $validated['follow_up']['appointment_date'],
                    'notes'                   => $validated['follow_up']['notes'] ?? null,
                    'created_by'              => $request->user()?->id ?? 1,
                ]);
            }

            return $completion;
        });

        return response()->json([
            'success' => true,
            'message' => 'Pelayanan berhasil diselesaikan.',
            'data'    => $result,
        ], 200);
    }
}