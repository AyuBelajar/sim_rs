<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NursingAssessment extends Model
{
    protected $fillable = [
        'registration_id',
        'petugas',
        'keluhan_utama',
        'riwayat_alergi',
        'tekanan_darah',
        'detak_jantung',
        'suhu_badan',
        'nafas',
        'tinggi_badan',
        'berat_badan',
        // Tambahan skrining klinis:
        'tingkat_kesadaran',
        'skala_nyeri',
        'risiko_jatuh',
        'catatan_soap',
    ];
}