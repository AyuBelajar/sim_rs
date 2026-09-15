<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HospitalUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'unit_type',
        'location',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function doctorSchedules(): HasMany
    {
        return $this->hasMany(DoctorSchedule::class);
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