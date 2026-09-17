<?php
// app/Http/Controllers/Api/HospitalUnitController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HospitalUnitResource;
use App\Models\HospitalUnit;
use Illuminate\Http\Request;

class HospitalUnitController extends Controller
{
    public function index(Request $request)
    {
        $units = HospitalUnit::query()
            ->where('is_active', true)
            ->when($request->unit_type, fn ($q, $v) => $q->where('unit_type', $v))
            ->orderBy('name')
            ->get();

        return HospitalUnitResource::collection($units);
    }
}