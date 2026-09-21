<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OutpatientRegistrationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'registration_no' => $this->registration_no,
            'registration_date' => $this->registration_date?->format('Y-m-d'),
            'registration_time' => $this->registration_time,
            'arrival_method' => $this->arrival_method,
            'counter_queue_no' => $this->counter_queue_no,
            'sla_minutes' => $this->sla_minutes,
            'status' => $this->status,
            'is_package_service' => $this->is_package_service,
            'has_cob' => $this->has_cob,
            'registration_fee' => $this->registration_fee,
            'admin_fee' => $this->admin_fee,
            'estimated_total' => $this->estimated_total,

            'patient' => $this->whenLoaded('patient', fn () => [
                'id' => $this->patient->id,
                'medical_record_no' => $this->patient->medical_record_no,
                'full_name' => $this->patient->full_name,
                'nik' => $this->patient->nik,
                'gender' => $this->patient->gender,
                'birth_date' => $this->patient->birth_date?->format('Y-m-d'),
                'age' => $this->patient->birth_date?->age,
            ]),

            'hospital_unit' => $this->whenLoaded('hospitalUnit', fn () => [
                'id' => $this->hospitalUnit->id,
                'name' => $this->hospitalUnit->name,
            ]),

            'doctor' => $this->whenLoaded('doctor', fn () => [
                'id' => $this->doctor->id,
                'display_name' => $this->doctor->display_name,
            ]),

            'payer' => $this->whenLoaded('payer', fn () => [
                'id' => $this->payer->id,
                'name' => $this->payer->name,
                'category' => $this->payer->category,
            ]),

            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}