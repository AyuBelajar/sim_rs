<?php
// app/Http/Controllers/Api/HealthcareFacilityController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HealthcareFacilityResource;
use App\Models\HealthcareFacility;
use Illuminate\Http\Request;

class HealthcareFacilityController extends Controller
{
    public function index(Request $request)
    {
        $facilities = HealthcareFacility::query()
            ->where('is_active', true)
            ->when($request->search, fn ($q, $v) => $q->where('name', 'like', "%{$v}%"))
            ->orderBy('name')
            ->paginate(20);

        return HealthcareFacilityResource::collection($facilities);
    }
}