<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PatientPolicy extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'payer_id',
        'policy_no',
        'member_name',
        'insurance_class',
        'valid_from',
        'valid_until',
        'is_primary',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'valid_from' => 'date',
            'valid_until' => 'date',
            'is_primary' => 'boolean',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function payer(): BelongsTo
    {
        return $this->belongsTo(Payer::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(OutpatientBooking::class);
    }
}