<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_code' => $this->booking_code,
            'visit_date' => $this->visit_date?->format('Y-m-d'),
            'visit_time' => $this->visit_time,
            'booking_source' => $this->booking_source,
            'status' => $this->status,
            'mobile_jkn_checked_in' => $this->mobile_jkn_checked_in,

            'patient' => $this->whenLoaded('patient', fn () => [
                'id' => $this->patient->id,
                'medical_record_no' => $this->patient->medical_record_no,
                'full_name' => $this->patient->full_name,
            ]),

            'hospital_unit' => $this->whenLoaded('hospitalUnit', fn () => [
                'id' => $this->hospitalUnit->id,
                'name' => $this->hospitalUnit->name,
            ]),

            'doctor' => $this->whenLoaded('doctor', fn () => [
                'id' => $this->doctor->id,
                'display_name' => $this->doctor->display_name,
            ]),

            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}