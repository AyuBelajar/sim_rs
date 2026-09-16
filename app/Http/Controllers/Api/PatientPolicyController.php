<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientPolicyRequest;
use App\Http\Resources\PatientPolicyResource;
use App\Models\Patient;
use Illuminate\Support\Facades\DB;

class PatientPolicyController extends Controller
{
    public function index(Patient $patient)
    {
        return PatientPolicyResource::collection(
            $patient->policies()->with('payer')->get()
        );
    }

    public function store(StorePatientPolicyRequest $request, Patient $patient)
    {
        $policy = DB::transaction(function () use ($request, $patient) {
            $data = $request->validated();

            if ($data['is_primary'] ?? false) {
                $patient->policies()->update(['is_primary' => false]);
            }

            return $patient->policies()->create($data);
        });

        return (new PatientPolicyResource($policy->load('payer')))
            ->response()->setStatusCode(201);
    }
}