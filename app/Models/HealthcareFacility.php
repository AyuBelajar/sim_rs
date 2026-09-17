<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthcareFacility extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'bpjs_code',
        'name',
        'facility_type',
        'address',
        'phone',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}