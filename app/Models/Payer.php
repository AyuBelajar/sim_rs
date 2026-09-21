<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payer extends Model
{
    protected $fillable = ['code', 'name', 'category', 'contact_phone', 'address', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];

    // category: UMUM | BPJS | ASURANSI | KARYAWAN — cocok dengan 4 pilihan radio di Gambar 6
}