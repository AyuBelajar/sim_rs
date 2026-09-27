<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('nursing_assessments');
        
        Schema::create('nursing_assessments', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke tabel pendaftaran rawat jalan
            $table->foreignId('registration_id')
                  ->constrained('outpatient_registrations')
                  ->cascadeOnDelete();
                  
            $table->string('petugas')->nullable();

            // Anamnesa & Keluhan
            $table->text('keluhan_utama')->nullable();
            $table->text('riwayat_alergi')->nullable();

            // Tanda-Tanda Vital (TTV)
            $table->string('tekanan_darah', 20)->nullable(); // contoh: 120/80
            $table->integer('detak_jantung')->nullable(); // bpm
            $table->decimal('suhu_badan', 4, 1)->nullable(); // Celcius
            $table->integer('nafas')->nullable(); // x/menit
            $table->decimal('tinggi_badan', 5, 1)->nullable(); // cm
            $table->decimal('berat_badan', 5, 1)->nullable(); // kg
        
            // Skrining Klinis & Triase
            $table->string('tingkat_kesadaran', 50)->nullable();
            $table->unsignedTinyInteger('skala_nyeri')->default(0)->nullable();
            $table->string('risiko_jatuh', 50)->nullable();
            $table->text('catatan_soap')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nursing_assessments');
    }
};