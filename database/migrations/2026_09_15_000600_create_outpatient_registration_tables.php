<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('outpatient_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('registration_no', 60)->unique();
            $table->foreignId('patient_id')->constrained('patients')->restrictOnDelete();
            $table->foreignId('booking_id')->nullable()->constrained('outpatient_bookings')->nullOnDelete();
            $table->foreignId('hospital_unit_id')->constrained('hospital_units')->restrictOnDelete();
            $table->foreignId('doctor_id')->constrained('doctor_profiles')->restrictOnDelete();
            $table->foreignId('doctor_schedule_id')->nullable()->constrained('doctor_schedules')->nullOnDelete();
            $table->foreignId('payer_id')->constrained('payers')->restrictOnDelete();
            $table->foreignId('patient_policy_id')->nullable()->constrained('patient_policies')->nullOnDelete();
            $table->foreignId('cob_policy_id')->nullable()->constrained('patient_policies')->nullOnDelete();
            $table->date('registration_date')->index();
            $table->time('registration_time');
            $table->string('service_type', 40)->default('RAWAT_JALAN')->index();
            $table->string('arrival_method', 40)->index(); // DATANG_SENDIRI, RUJUKAN, BOOKING_ONLINE, KONTROL_ULANG, KASUS_POLISI
            $table->string('arrival_condition', 30)->nullable(); // STABIL, GAWAT, KRITIS, DARURAT
            $table->string('activity_type', 50)->nullable(); // KONSULTASI, PEMERIKSAAN_UMUM, etc.
            $table->string('counter_queue_no', 30)->nullable()->index();
            $table->string('service_queue_no', 30)->nullable()->index();
            $table->string('external_booking_code', 60)->nullable()->index();
            $table->unsignedInteger('sla_minutes')->nullable();
            $table->boolean('is_package_service')->default(false);
            $table->boolean('has_cob')->default(false);
            $table->decimal('registration_fee', 15, 2)->default(0);
            $table->decimal('admin_fee', 15, 2)->default(0);
            $table->decimal('estimated_total', 15, 2)->default(0);
            $table->string('status', 30)->default('REGISTERED')->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['registration_date', 'hospital_unit_id', 'doctor_id'], 'outpatient_reg_daily_index');
        });

        Schema::create('registration_referrals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_registration_id')->unique()->constrained('outpatient_registrations')->cascadeOnDelete();
            $table->foreignId('healthcare_facility_id')->nullable()->constrained('healthcare_facilities')->nullOnDelete();
            $table->string('facility_name_snapshot', 180)->nullable();
            $table->string('facility_type_snapshot', 80)->nullable();
            $table->text('facility_address_snapshot')->nullable();
            $table->string('referral_no', 100)->index();
            $table->date('referral_date')->nullable()->index();
            $table->string('referral_diagnosis_code', 30)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('police_case_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_registration_id')->unique()->constrained('outpatient_registrations')->cascadeOnDelete();
            $table->string('report_no', 100)->index();
            $table->date('report_date')->nullable();
            $table->string('institution_name', 180)->nullable();
            $table->text('case_description')->nullable();
            $table->timestamps();
        });

        Schema::create('registration_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_registration_id')->constrained('outpatient_registrations')->cascadeOnDelete();
            $table->string('verification_type', 40)->default('PATIENT_DATA')->index();
            $table->string('status', 30)->default('PENDING')->index();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('registration_cancellations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outpatient_registration_id')->unique()->constrained('outpatient_registrations')->cascadeOnDelete();
            $table->foreignId('requested_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('authorized_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('reason');
            $table->timestamp('authorized_at')->nullable();
            $table->dateTime('cancelled_at')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registration_cancellations');
        Schema::dropIfExists('registration_verifications');
        Schema::dropIfExists('police_case_reports');
        Schema::dropIfExists('registration_referrals');
        Schema::dropIfExists('outpatient_registrations');
    }
};
