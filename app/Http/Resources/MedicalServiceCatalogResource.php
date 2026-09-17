<?php
// app/Http/Resources/MedicalServiceCatalogResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MedicalServiceCatalogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'category' => $this->category,
            'name' => $this->name,
            'unit' => $this->unit,
            'default_tariff' => $this->default_tariff,
        ];
    }
}