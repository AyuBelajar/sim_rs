<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DoctorResource;
use App\Models\DoctorProfile;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index(Request $request)
    {
        $doctors = DoctorProfile::query()
            ->with(['staff.unitAssignments.hospitalUnit'])
            ->whereHas('staff', fn ($q) => $q->where('is_active', true))
            ->when($request->hospital_unit_id, function ($q, $unitId) {
                $q->whereHas('staff.unitAssignments', fn ($sub) => $sub->where('hospital_unit_id', $unitId));
            })
            ->when($request->search, function ($q, $search) {
                $q->whereHas('staff', fn ($sub) => $sub->where('full_name', 'like', "%{$search}%"));
            })
            ->get();

        return DoctorResource::collection($doctors);
    }
}