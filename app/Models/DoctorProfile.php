<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DoctorProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'staff_id',
        'specialization',
        'specialty_code',
    ];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(DoctorSchedule::class, 'doctor_id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(OutpatientBooking::class, 'doctor_id');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(OutpatientRegistration::class, 'doctor_id');
    }

    public function encounters(): HasMany
    {
        return $this->hasMany(OutpatientEncounter::class, 'doctor_id');
    }
}