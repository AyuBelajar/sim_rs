<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clinical\StorePrescriptionRequest;
use App\Http\Requests\Clinical\StoreSoapRequest;
use App\Http\Requests\Clinical\StoreVitalSignRequest;
use App\Models\OutpatientEncounter;
use App\Models\OutpatientRegistration;
use App\Services\ClinicalService;
use Illuminate\Http\Request;

class EncounterController extends Controller
{
    public function __construct(
        protected ClinicalService $clinicalService
    ) {}

    public function start(OutpatientRegistration $registration, Request $request)
    {
        $doctorId = $registration->doctor_id;
        $encounter = $this->clinicalService->startEncounter($registration, $doctorId);

        return response()->json(['data' => $encounter], 201);
    }

    public function show(OutpatientEncounter $encounter)
    {
        return response()->json([
            'data' => $encounter->load([
                'vitalSigns',
                'soapNotes',
                'diagnoses',
                'procedures',
                'prescriptions.items',
                'supportingOrders'
            ])
        ]);
    }

    public function storeVitals(StoreVitalSignRequest $request, OutpatientEncounter $encounter)
    {
        $vitals = $encounter->vitalSigns()->create([
            ...$request->validated(),
            'recorded_at' => now(),
            'recorded_by' => $request->user()?->staff?->id,
        ]);

        return response()->json(['data' => $vitals], 201);
    }

    public function storeSoap(StoreSoapRequest $request, OutpatientEncounter $encounter)
    {
        $soap = $encounter->soapNotes()->create([
            ...$request->validated(),
            'authored_by' => $request->user()?->staff?->id,
            'status' => 'FINAL',
            'recorded_at' => now(),
        ]);

        return response()->json(['data' => $soap], 201);
    }

    public function storeDiagnosis(Request $request, OutpatientEncounter $encounter)
    {
        $data = $request->validate([
            'icd10_code' => ['required', 'string', 'max:20'],
            'diagnosis_name' => ['required', 'string', 'max:255'],
            'diagnosis_type' => ['nullable', 'in:PRIMARY,SECONDARY'],
            'notes' => ['nullable', 'string'],
        ]);

        $diagnosis = $encounter->diagnoses()->create([
            ...$data,
            'diagnosis_type' => $data['diagnosis_type'] ?? 'PRIMARY',
            'diagnosed_by' => $request->user()?->staff?->id,
        ]);

        return response()->json(['data' => $diagnosis], 201);
    }

    public function storeProcedure(Request $request, OutpatientEncounter $encounter)
    {
        $data = $request->validate([
            'icd9_code' => ['nullable', 'string', 'max:20'],
            'procedure_name' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $procedure = $encounter->procedures()->create([
            ...$data,
            'performed_by' => $request->user()?->staff?->id,
            'performed_at' => now(),
        ]);

        return response()->json(['data' => $procedure], 201);
    }

    public function storePrescription(StorePrescriptionRequest $request, OutpatientEncounter $encounter)
    {
        $staffId = $request->user()?->staff?->id;
        $prescription = $this->clinicalService->createPrescription(
            $encounter,
            $request->validated(),
            $staffId
        );

        return response()->json(['data' => $prescription], 201);
    }
}