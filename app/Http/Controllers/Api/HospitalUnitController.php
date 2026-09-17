<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HospitalUnitResource;
use App\Models\HospitalUnit;

class HospitalUnitController extends Controller
{
    public function index()
    {
        return HospitalUnitResource::collection(
            HospitalUnit::poli()->where('is_active', true)->orderBy('name')->get()
        );
    }
}