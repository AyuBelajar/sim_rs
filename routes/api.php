<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\PayerController;
use App\Http\Controllers\Api\PatientPolicyController;
use App\Http\Controllers\Api\HospitalUnitController;
use App\Http\Controllers\Api\HealthcareFacilityController;
use App\Http\Controllers\Api\MedicalServiceCatalogController;
use App\Http\Controllers\Api\EncounterController; // 1. Import controller kamu di sini
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\DoctorScheduleController;
use App\Http\Controllers\Api\BpjsController;

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

    Route::get('doctor-schedules', [DoctorScheduleController::class, 'index']);
    Route::post('doctor-schedules', [DoctorScheduleController::class, 'store']);
    Route::patch('doctor-schedules/{schedule}/quotas/{quota}', [DoctorScheduleController::class, 'updateQuota']);

    // 2. Route Modul Clinical / Pemeriksaan Dokter (Tugas Sava)
    Route::post('registrations/{registration}/encounter/start', [EncounterController::class, 'start']);
    Route::get('encounters/{encounter}', [EncounterController::class, 'show']);
    Route::post('encounters/{encounter}/vitals', [EncounterController::class, 'storeVitals']);
    Route::post('encounters/{encounter}/soap', [EncounterController::class, 'storeSoap']);
    Route::post('encounters/{encounter}/diagnoses', [EncounterController::class, 'storeDiagnosis']);
    Route::post('encounters/{encounter}/procedures', [EncounterController::class, 'storeProcedure']);
    Route::post('encounters/{encounter}/prescriptions', [EncounterController::class, 'storePrescription']);
    
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('registrations/{registration}/bpjs/verify', [BpjsController::class, 'verify']);
    Route::post('registrations/{registration}/bpjs/sep', [BpjsController::class, 'createSep']);
});

Route::post('bpjs/verify-test', [App\Http\Controllers\Api\BpjsController::class, 'verifyTest']);