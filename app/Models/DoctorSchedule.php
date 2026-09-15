<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DoctorSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'hospital_unit_id',
        'schedule_date',
        'start_time',
        'end_time',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'schedule_date' => 'date',
        ];
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(DoctorProfile::class, 'doctor_id');
    }

    public function hospitalUnit(): BelongsTo
    {
        return $this->belongsTo(HospitalUnit::class);
    }

    public function quotas(): HasMany
    {
        return $this->hasMany(DoctorScheduleQuota::class);
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