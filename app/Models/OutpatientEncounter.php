<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OutpatientEncounter extends Model
{
    use HasFactory;

    protected $fillable = [
        'outpatient_registration_id',
        'doctor_id',
        'status',
        'started_at',
        'ended_at',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
        ];
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(
            OutpatientRegistration::class,
            'outpatient_registration_id'
        );
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(
            DoctorProfile::class,
            'doctor_id'
        );
    }
}