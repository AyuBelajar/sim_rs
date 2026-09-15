<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('outpatient_encounters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_registration_id')->unique()->constrained('outpatient_registrations')->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained('doctor_profiles')->restrictOnDelete();
            $table->string('status', 30)->default('IN_SERVICE')->index();
            $table->timestamp('started_at')->nullable()->index();
            $table->timestamp('ended_at')->nullable()->index();
            $table->timestamps();
        });

        Schema::create('vital_signs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_encounter_id')->constrained('outpatient_encounters')->cascadeOnDelete();
            $table->unsignedSmallInteger('systolic_bp')->nullable();
            $table->unsignedSmallInteger('diastolic_bp')->nullable();
            $table->unsignedSmallInteger('pulse_rate')->nullable();
            $table->unsignedSmallInteger('respiratory_rate')->nullable();
            $table->decimal('temperature_c', 4, 1)->nullable();
            $table->decimal('spo2_percent', 5, 2)->nullable();
            $table->decimal('weight_kg', 6, 2)->nullable();
            $table->decimal('height_cm', 6, 2)->nullable();
            $table->decimal('bmi', 5, 2)->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('staff')->nullOnDelete();
            $table->timestamp('recorded_at')->useCurrent()->index();
            $table->timestamps();
        });

        Schema::create('soap_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_encounter_id')->constrained('outpatient_encounters')->cascadeOnDelete();
            $table->longText('subjective')->nullable();
            $table->longText('objective')->nullable();
            $table->longText('assessment')->nullable();
            $table->longText('plan')->nullable();
            $table->string('status', 20)->default('FINAL')->index();
            $table->foreignId('authored_by')->nullable()->constrained('staff')->nullOnDelete();
            $table->timestamp('recorded_at')->useCurrent()->index();
            $table->timestamps();
        });

        Schema::create('encounter_diagnoses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_encounter_id')->constrained('outpatient_encounters')->cascadeOnDelete();
            $table->string('icd10_code', 20)->index();
            $table->string('diagnosis_name', 255);
            $table->string('diagnosis_type', 30)->default('PRIMARY')->index();
            $table->text('notes')->nullable();
            $table->foreignId('diagnosed_by')->nullable()->constrained('staff')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('encounter_procedures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_encounter_id')->constrained('outpatient_encounters')->cascadeOnDelete();
            $table->string('icd9_code', 20)->nullable()->index();
            $table->string('procedure_name', 255);
            $table->text('notes')->nullable();
            $table->foreignId('performed_by')->nullable()->constrained('staff')->nullOnDelete();
            $table->timestamp('performed_at')->nullable()->index();
            $table->timestamps();
        });

        Schema::create('therapy_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_encounter_id')->constrained('outpatient_encounters')->cascadeOnDelete();
            $table->longText('notes');
            $table->foreignId('authored_by')->nullable()->constrained('staff')->nullOnDelete();
            $table->timestamp('recorded_at')->useCurrent();
            $table->timestamps();
        });

        Schema::create('supporting_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_no', 60)->unique();
            $table->foreignId('outpatient_encounter_id')->constrained('outpatient_encounters')->cascadeOnDelete();
            $table->string('examination_type', 50)->index(); // LAB, RADIOLOGI, USG, EKG, PA
            $table->foreignId('medical_service_catalog_id')->nullable()->constrained('medical_service_catalogs')->nullOnDelete();
            $table->string('examination_name', 180);
            $table->foreignId('referring_doctor_id')->nullable()->constrained('doctor_profiles')->nullOnDelete();
            $table->string('priority', 20)->default('ROUTINE')->index();
            $table->string('status', 30)->default('ORDERED')->index();
            $table->text('notes')->nullable();
            $table->timestamp('ordered_at')->useCurrent()->index();
            $table->timestamps();
        });

        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();
            $table->string('prescription_no', 60)->unique();
            $table->foreignId('outpatient_encounter_id')->constrained('outpatient_encounters')->cascadeOnDelete();
            $table->foreignId('prescriber_id')->nullable()->constrained('staff')->nullOnDelete();
            $table->string('status', 30)->default('DRAFT')->index();
            $table->text('notes')->nullable();
            $table->timestamp('prescribed_at')->useCurrent()->index();
            $table->timestamps();
        });

        Schema::create('prescription_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prescription_id')->constrained('prescriptions')->cascadeOnDelete();
            $table->foreignId('medical_service_catalog_id')->nullable()->constrained('medical_service_catalogs')->nullOnDelete();
            $table->string('medicine_name', 180);
            $table->string('dosage', 100)->nullable();
            $table->string('frequency', 100)->nullable();
            $table->string('route', 80)->nullable();
            $table->string('duration', 80)->nullable();
            $table->decimal('quantity', 10, 2)->default(1);
            $table->string('unit', 30)->nullable();
            $table->text('instructions')->nullable();
            $table->timestamps();
        });

        Schema::create('encounter_completions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_encounter_id')->unique()->constrained('outpatient_encounters')->cascadeOnDelete();
            $table->string('exit_type', 40)->index(); // PULANG, KONTROL_ULANG, DIRUJUK, RAWAT_INAP
            $table->string('exit_method', 60)->nullable();
            $table->string('exit_condition', 40)->nullable();
            $table->longText('notes')->nullable();
            $table->foreignId('completed_by')->nullable()->constrained('staff')->nullOnDelete();
            $table->dateTime('completed_at')->index();
            $table->timestamps();
        });

        Schema::create('follow_up_appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_encounter_id')->nullable()->constrained('outpatient_encounters')->nullOnDelete();
            $table->foreignId('patient_id')->constrained('patients')->restrictOnDelete();
            $table->foreignId('hospital_unit_id')->constrained('hospital_units')->restrictOnDelete();
            $table->foreignId('doctor_id')->nullable()->constrained('doctor_profiles')->nullOnDelete();
            $table->date('follow_up_date')->index();
            $table->time('estimated_time')->nullable();
            $table->string('status', 30)->default('SCHEDULED')->index();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('follow_up_appointments');
        Schema::dropIfExists('encounter_completions');
        Schema::dropIfExists('prescription_items');
        Schema::dropIfExists('prescriptions');
        Schema::dropIfExists('supporting_orders');
        Schema::dropIfExists('therapy_notes');
        Schema::dropIfExists('encounter_procedures');
        Schema::dropIfExists('encounter_diagnoses');
        Schema::dropIfExists('soap_notes');
        Schema::dropIfExists('vital_signs');
        Schema::dropIfExists('outpatient_encounters');
    }
};
