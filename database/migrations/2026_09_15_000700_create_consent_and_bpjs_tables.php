<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('general_consents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->restrictOnDelete();
            $table->foreignId('outpatient_registration_id')->nullable()->constrained('outpatient_registrations')->nullOnDelete();
            $table->foreignId('patient_guardian_id')->nullable()->constrained('patient_guardians')->nullOnDelete();
            $table->string('guardian_name', 150)->nullable();
            $table->string('guardian_relationship', 50)->nullable();
            $table->string('guardian_nik', 20)->nullable();
            $table->string('guardian_signature_path')->nullable();
            $table->boolean('satu_sehat_consent')->nullable();
            $table->string('status', 30)->default('DRAFT')->index();
            $table->timestamp('signed_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('general_consent_witnesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('general_consent_id')->constrained('general_consents')->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('relationship', 80)->nullable();
            $table->string('signature_path')->nullable();
            $table->timestamps();
        });

        Schema::create('bpjs_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_registration_id')->constrained('outpatient_registrations')->cascadeOnDelete();
            $table->foreignId('patient_policy_id')->nullable()->constrained('patient_policies')->nullOnDelete();
            $table->string('participant_name', 150)->nullable();
            $table->string('card_no', 100)->nullable()->index();
            $table->string('participant_status', 50)->nullable();
            $table->string('registered_facility', 180)->nullable();
            $table->string('referral_no', 100)->nullable()->index();
            $table->string('visit_type', 80)->nullable();
            $table->string('status', 30)->default('PENDING')->index();
            $table->json('response_payload')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('bpjs_seps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_registration_id')->constrained('outpatient_registrations')->cascadeOnDelete();
            $table->string('sep_no', 100)->unique();
            $table->string('insurance_class', 50)->nullable();
            $table->string('payer_name', 150)->nullable();
            $table->decimal('coverage_ceiling', 15, 2)->nullable();
            $table->text('notes')->nullable();
            $table->string('status', 30)->default('DRAFT')->index();
            $table->timestamp('printed_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('pcare_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_registration_id')->unique()->constrained('outpatient_registrations')->cascadeOnDelete();
            $table->string('card_no', 100)->nullable()->index();
            $table->string('nik', 20)->nullable()->index();
            $table->string('visit_type', 80)->nullable();
            $table->foreignId('hospital_unit_id')->nullable()->constrained('hospital_units')->nullOnDelete();
            $table->foreignId('doctor_id')->nullable()->constrained('doctor_profiles')->nullOnDelete();
            $table->json('referral_data')->nullable();
            $table->json('visit_data')->nullable();
            $table->string('external_registration_no', 100)->nullable()->index();
            $table->string('status', 30)->default('DRAFT')->index();
            $table->json('response_payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pcare_registrations');
        Schema::dropIfExists('bpjs_seps');
        Schema::dropIfExists('bpjs_verifications');
        Schema::dropIfExists('general_consent_witnesses');
        Schema::dropIfExists('general_consents');
    }
};
