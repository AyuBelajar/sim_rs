<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OutpatientBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code',
        'patient_id',
        'doctor_schedule_id',
        'hospital_unit_id',
        'doctor_id',
        'payer_id',
        'patient_policy_id',
        'visit_date',
        'visit_time',
        'booking_source',
        'status',
        'mobile_jkn_checked_in',
        'jkn_queue_no',
        'draft_sep_no',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'visit_date' => 'date',
            'mobile_jkn_checked_in' => 'boolean',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctorSchedule(): BelongsTo
    {
        return $this->belongsTo(DoctorSchedule::class);
    }

    public function hospitalUnit(): BelongsTo
    {
        return $this->belongsTo(HospitalUnit::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(DoctorProfile::class, 'doctor_id');
    }

    public function payer(): BelongsTo
    {
        return $this->belongsTo(Payer::class);
    }

    public function patientPolicy(): BelongsTo
    {
        return $this->belongsTo(PatientPolicy::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function registration(): HasOne
    {
        return $this->hasOne(
            OutpatientRegistration::class,
            'booking_id'
        );
    }
}