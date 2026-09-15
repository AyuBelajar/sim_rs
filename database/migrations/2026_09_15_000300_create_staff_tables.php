<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->unique()->constrained('users')->nullOnDelete();
            $table->string('employee_no', 50)->unique();
            $table->string('full_name', 150);
            $table->string('profession', 50)->index(); // Dokter, Perawat, Petugas Admisi, dll.
            $table->string('str_no', 80)->nullable()->index();
            $table->string('sip_no', 80)->nullable()->index();
            $table->string('phone', 30)->nullable();
            $table->string('email')->nullable()->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('doctor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('staff_id')->unique()->constrained('staff')->cascadeOnDelete();
            $table->string('specialization', 120)->nullable()->index();
            $table->string('specialty_code', 50)->nullable()->index();
            $table->timestamps();
        });

        Schema::create('staff_unit_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('staff_id')->constrained('staff')->cascadeOnDelete();
            $table->foreignId('hospital_unit_id')->constrained('hospital_units')->cascadeOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->date('valid_from')->nullable();
            $table->date('valid_until')->nullable();
            $table->timestamps();
            $table->unique(['staff_id', 'hospital_unit_id'], 'staff_unit_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_unit_assignments');
        Schema::dropIfExists('doctor_profiles');
        Schema::dropIfExists('staff');
    }
};
