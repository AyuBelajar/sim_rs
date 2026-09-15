<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nursing_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_encounter_id')->constrained('outpatient_encounters')->cascadeOnDelete();
            $table->longText('anamnesis')->nullable();
            $table->foreignId('assessed_by')->nullable()->constrained('staff')->nullOnDelete();
            $table->timestamp('assessed_at')->useCurrent()->index();
            $table->timestamps();
        });

        Schema::create('nursing_documentations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_encounter_id')->constrained('outpatient_encounters')->cascadeOnDelete();
            $table->string('documentation_type', 20)->index(); // SOAPIER, ADIME, SBAR
            $table->json('content');
            $table->foreignId('authored_by')->nullable()->constrained('staff')->nullOnDelete();
            $table->timestamp('recorded_at')->useCurrent()->index();
            $table->timestamps();
        });

        Schema::create('nursing_diagnoses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_encounter_id')->constrained('outpatient_encounters')->cascadeOnDelete();
            $table->string('sdki_code', 30)->nullable()->index();
            $table->text('diagnosis');
            $table->string('status', 30)->default('ACTIVE')->index();
            $table->foreignId('created_by')->nullable()->constrained('staff')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('nursing_care_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nursing_diagnosis_id')->constrained('nursing_diagnoses')->cascadeOnDelete();
            $table->longText('slki_outcomes')->nullable();
            $table->longText('siki_interventions')->nullable();
            $table->longText('implementation')->nullable();
            $table->longText('evaluation')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('staff')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nursing_care_plans');
        Schema::dropIfExists('nursing_diagnoses');
        Schema::dropIfExists('nursing_documentations');
        Schema::dropIfExists('nursing_assessments');
    }
};
