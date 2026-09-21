<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hapus tabel lama jika sudah ada agar migrasi baru bisa masuk
        Schema::dropIfExists('nursing_assessments');
        
        Schema::create('nursing_assessments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('registration_id'); // ID pasien/registrasi
            $table->string('petugas')->nullable();

            // Anamnesa & Keluhan
            $table->text('keluhan_utama')->nullable();
            $table->text('riwayat_alergi')->nullable();

            // Tanda-Tanda Vital (TTV)
            $table->string('tekanan_darah')->nullable(); // contoh: 120/80
            $table->integer('detak_jantung')->nullable(); // bpm
            $table->decimal('suhu_badan', 4, 1)->nullable(); // Celcius
            $table->integer('nafas')->nullable(); // x/menit
            $table->decimal('tinggi_badan', 5, 1)->nullable(); // cm
            $table->decimal('berat_badan', 5, 1)->nullable(); // kg
        
            // Tambahan skrining klinis
            $table->string('tingkat_kesadaran')->nullable();
            $table->integer('skala_nyeri')->nullable();
            $table->string('risiko_jatuh')->nullable();
            $table->text('catatan_soap')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nursing_assessments');
    }
};