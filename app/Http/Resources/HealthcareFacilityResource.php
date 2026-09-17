<?php
// app/Http/Resources/HealthcareFacilityResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HealthcareFacilityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'bpjs_code' => $this->bpjs_code,
            'name' => $this->name,
            'facility_type' => $this->facility_type,
            'address' => $this->address,
        ];
    }
}