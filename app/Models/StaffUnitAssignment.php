<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffUnitAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'staff_id',
        'hospital_unit_id',
        'is_primary',
        'valid_from',
        'valid_until',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'valid_from' => 'date',
        'valid_until' => 'date',
    ];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    public function hospitalUnit(): BelongsTo
    {
        return $this->belongsTo(HospitalUnit::class);
    }
}