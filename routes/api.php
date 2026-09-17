<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\HospitalUnitController;
use App\Http\Controllers\Api\OutpatientRegistrationController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\PatientPolicyController;
use App\Http\Controllers\Api\PayerController;
use Illuminate\Support\Facades\Route;

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

        Route::apiResource(
            'outpatient-registrations',
            OutpatientRegistrationController::class
        )->only(['index', 'store']);

        Route::get(
            'hospital-units',
            [HospitalUnitController::class, 'index']
        );

        Route::get(
            'doctors',
            [DoctorController::class, 'index']
        );
    });


    Route::get('payers', [PayerController::class, 'index']);
    Route::get('patients/{patient}/policies', [PatientPolicyController::class, 'index']);
    Route::post('patients/{patient}/policies', [PatientPolicyController::class, 'store']);

    
});