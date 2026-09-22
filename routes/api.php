<?php
 
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\DoctorScheduleController;
use App\Http\Controllers\Api\EncounterController;
use App\Http\Controllers\Api\HealthcareFacilityController;
use App\Http\Controllers\Api\HospitalUnitController;
use App\Http\Controllers\Api\MedicalServiceCatalogController;
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

        Route::apiResource('registrations', 
        OutpatientRegistrationController::class)
         ->only(['index', 'store']);

        Route::apiResource('bookings', BookingController::class)
        ->only(['index', 'store', 'update']);
        Route::post('bookings/{booking}/check-in', [BookingController::class, 'checkIn']);

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
 
    Route::get('healthcare-facilities', [HealthcareFacilityController::class, 'index']);
    Route::get('medical-services', [MedicalServiceCatalogController::class, 'index']);
 
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