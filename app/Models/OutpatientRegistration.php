<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OutpatientRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_no',
        'patient_id',
        'booking_id',
        'hospital_unit_id',
        'doctor_id',
        'doctor_schedule_id',
        'payer_id',
        'patient_policy_id',
        'cob_policy_id',
        'registration_date',
        'registration_time',
        'service_type',
        'arrival_method',
        'arrival_condition',
        'activity_type',
        'counter_queue_no',
        'service_queue_no',
        'external_booking_code',
        'sla_minutes',
        'is_package_service',
        'has_cob',
        'registration_fee',
        'admin_fee',
        'estimated_total',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'registration_date' => 'date',
            'sla_minutes' => 'integer',
            'is_package_service' => 'boolean',
            'has_cob' => 'boolean',
            'registration_fee' => 'decimal:2',
            'admin_fee' => 'decimal:2',
            'estimated_total' => 'decimal:2',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(
            OutpatientBooking::class,
            'booking_id'
        );
    }

    public function hospitalUnit(): BelongsTo
    {
        return $this->belongsTo(HospitalUnit::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(DoctorProfile::class, 'doctor_id');
    }

    public function doctorSchedule(): BelongsTo
    {
        return $this->belongsTo(DoctorSchedule::class);
    }

    public function payer(): BelongsTo
    {
        return $this->belongsTo(Payer::class);
    }

    public function patientPolicy(): BelongsTo
    {
        return $this->belongsTo(PatientPolicy::class);
    }

    public function cobPolicy(): BelongsTo
    {
        return $this->belongsTo(
            PatientPolicy::class,
            'cob_policy_id'
        );
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function encounter(): HasOne
    {
        return $this->hasOne(OutpatientEncounter::class);
    }
}