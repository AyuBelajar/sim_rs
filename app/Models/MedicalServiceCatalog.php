<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalServiceCatalog extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'category',
        'name',
        'unit',
        'default_tariff',
        'is_active',
    ];

    protected $casts = [
        'default_tariff' => 'decimal:2',
        'is_active' => 'boolean',
    ];
}