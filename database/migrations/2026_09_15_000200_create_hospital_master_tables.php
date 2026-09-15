<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hospital_units', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique();
            $table->string('name', 150);
            $table->string('unit_type', 50)->index(); // POLI, IGD, RAWAT_INAP, LAB, RADIOLOGI, etc.
            $table->string('location', 150)->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('payers', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique();
            $table->string('name', 150);
            $table->string('category', 30)->index(); // UMUM, BPJS, ASURANSI, KARYAWAN
            $table->string('contact_phone', 30)->nullable();
            $table->text('address')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('healthcare_facilities', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->nullable()->unique();
            $table->string('bpjs_code', 50)->nullable()->index();
            $table->string('name', 180);
            $table->string('facility_type', 50)->nullable()->index();
            $table->text('address')->nullable();
            $table->string('phone', 30)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('medical_service_catalogs', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('category', 40)->index(); // TINDAKAN, BHP, RESEP, PENUNJANG, ADMIN
            $table->string('name', 180);
            $table->string('unit', 30)->nullable();
            $table->decimal('default_tariff', 15, 2)->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_service_catalogs');
        Schema::dropIfExists('healthcare_facilities');
        Schema::dropIfExists('payers');
        Schema::dropIfExists('hospital_units');
    }
};
