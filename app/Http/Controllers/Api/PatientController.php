<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\StorePatientRequest;
use App\Http\Requests\Patient\UpdatePatientRequest;
use App\Http\Resources\PatientResource;
use App\Models\Patient;
use App\Services\PatientService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PatientController extends Controller
{
    public function __construct(
        private readonly PatientService $patientService
    ) {
    }

    public function index(Request $request)
    {
        $patients = $this->patientService->paginate(
            $request->only([
                'search',
                'gender',
                'per_page',
            ])
        );

        return PatientResource::collection($patients);
    }

    public function store(
        StorePatientRequest $request
    ) {
        $patient = $this->patientService->create(
            $request->validated()
        );

        return (new PatientResource($patient))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Patient $patient)
    {
        $patient->load([
            'policies.payer',
        ]);

        return new PatientResource($patient);
    }

    public function update(
        UpdatePatientRequest $request,
        Patient $patient
    ) {
        $patient = $this->patientService->update(
            $patient,
            $request->validated()
        );

        return new PatientResource($patient);
    }

    public function destroy(Patient $patient)
    {
        $this->patientService->delete($patient);

        return response()->noContent();
    }
}