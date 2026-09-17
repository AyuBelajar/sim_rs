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
        $query = DoctorProfile::with('staff');

        // Filter per poli bila diperlukan nanti (butuh tabel staff_unit_assignments):
        // if ($request->hospital_unit_id) { ... }

        return DoctorResource::collection($query->get());
    }
}