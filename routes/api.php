<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\PayerController;
use App\Http\Controllers\Api\PatientPolicyController;
use App\Http\Controllers\Api\HospitalUnitController;
use App\Http\Controllers\Api\HealthcareFacilityController;
use App\Http\Controllers\Api\MedicalServiceCatalogController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DoctorController;

Route::post(
    'auth/login',
    [AuthController::class, 'login']
);

Route::middleware('auth:sanctum')->group(function () {

    Route::get(
        'auth/me',
        [AuthController::class, 'me']
    );

    Route::post(
        'auth/logout',
        [AuthController::class, 'logout']
    );

    Route::middleware('role:FRONT_OFFICE')->group(function () {

        Route::apiResource(
            'patients',
            PatientController::class
        );
    });


    Route::get('payers', [PayerController::class, 'index']);
    Route::get('patients/{patient}/policies', [PatientPolicyController::class, 'index']);
    Route::post('patients/{patient}/policies', [PatientPolicyController::class, 'store']);

    Route::get('hospital-units', [HospitalUnitController::class, 'index']);
    Route::get('healthcare-facilities', [HealthcareFacilityController::class, 'index']);
    Route::get('medical-services', [MedicalServiceCatalogController::class, 'index']);
    Route::get('doctors', [DoctorController::class, 'index']);

    
});