<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctor_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained('doctor_profiles')->restrictOnDelete();
            $table->foreignId('hospital_unit_id')->constrained('hospital_units')->restrictOnDelete();
            $table->date('schedule_date')->index();
            $table->time('start_time');
            $table->time('end_time');
            $table->string('status', 30)->default('AVAILABLE')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->unique(['doctor_id', 'hospital_unit_id', 'schedule_date', 'start_time'], 'doctor_schedule_unique');
        });

        Schema::create('doctor_schedule_quotas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_schedule_id')->constrained('doctor_schedules')->cascadeOnDelete();
            $table->string('channel', 20)->index(); // ONLINE, ONSITE
            $table->string('payer_group', 20)->index(); // BPJS, NON_BPJS
            $table->unsignedInteger('quota_total')->default(0);
            $table->unsignedInteger('quota_used')->default(0);
            $table->timestamps();
            $table->unique(['doctor_schedule_id', 'channel', 'payer_group'], 'doctor_schedule_quota_unique');
        });

        Schema::create('outpatient_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code', 60)->unique();
            $table->foreignId('patient_id')->constrained('patients')->restrictOnDelete();
            $table->foreignId('doctor_schedule_id')->nullable()->constrained('doctor_schedules')->nullOnDelete();
            $table->foreignId('hospital_unit_id')->constrained('hospital_units')->restrictOnDelete();
            $table->foreignId('doctor_id')->constrained('doctor_profiles')->restrictOnDelete();
            $table->foreignId('payer_id')->nullable()->constrained('payers')->nullOnDelete();
            $table->foreignId('patient_policy_id')->nullable()->constrained('patient_policies')->nullOnDelete();
            $table->date('visit_date')->index();
            $table->time('visit_time')->nullable();
            $table->string('booking_source', 30)->default('COUNTER')->index(); // COUNTER, WEB, MOBILE_JKN
            $table->string('status', 30)->default('WAITING')->index();
            $table->boolean('mobile_jkn_checked_in')->default(false)->index();
            $table->string('jkn_queue_no', 80)->nullable();
            $table->string('draft_sep_no', 100)->nullable()->index();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('outpatient_bookings');
        Schema::dropIfExists('doctor_schedule_quotas');
        Schema::dropIfExists('doctor_schedules');
    }
};
