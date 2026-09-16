<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientPolicyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'policy_no' => $this->policy_no,
            'member_name' => $this->member_name,
            'insurance_class' => $this->insurance_class,
            'is_primary' => $this->is_primary,
            'status' => $this->status,
            'payer' => new PayerResource($this->whenLoaded('payer')),
        ];
    }
}