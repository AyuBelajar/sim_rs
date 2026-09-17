<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'staff_id' => $this->staff_id,
            'full_name' => $this->staff->full_name,
            'specialization' => $this->specialization,
            'specialty_code' => $this->specialty_code,
            'sip_no' => $this->staff->sip_no,
            'units' => $this->staff->unitAssignments->map(fn ($a) => [
                'hospital_unit_id' => $a->hospital_unit_id,
                'unit_name' => $a->hospitalUnit->name,
                'is_primary' => $a->is_primary,
            ]),
        ];
    }
}