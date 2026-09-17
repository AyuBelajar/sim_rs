<?php
// app/Http/Controllers/Api/MedicalServiceCatalogController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MedicalServiceCatalogResource;
use App\Models\MedicalServiceCatalog;
use Illuminate\Http\Request;

class MedicalServiceCatalogController extends Controller
{
    public function index(Request $request)
    {
        $services = MedicalServiceCatalog::query()
            ->where('is_active', true)
            ->when($request->category, fn ($q, $v) => $q->where('category', $v))
            ->orderBy('name')
            ->get();

        return MedicalServiceCatalogResource::collection($services);
    }
}