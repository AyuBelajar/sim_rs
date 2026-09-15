<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payer extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category',
        'contact_phone',
        'address',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function patientPolicies(): HasMany
    {
        return $this->hasMany(PatientPolicy::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(OutpatientBooking::class);
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(OutpatientRegistration::class);
    }
}