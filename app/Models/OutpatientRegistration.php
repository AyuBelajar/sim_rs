<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OutpatientRegistration extends Model
{
    protected $fillable = [
        'registration_no', 'patient_id', 'hospital_unit_id', 'doctor_id', 'payer_id',
        'registration_date', 'registration_time', 'service_type', 'arrival_method',
        'counter_queue_no', 'external_booking_code', 'sla_minutes',
        'is_package_service', 'has_cob', 'registration_fee', 'admin_fee',
        'estimated_total', 'status', 'created_by',
    ];

    protected $casts = [
        'registration_date' => 'date',
        'is_package_service' => 'boolean',
        'has_cob' => 'boolean',
        'registration_fee' => 'decimal:2',
        'admin_fee' => 'decimal:2',
        'estimated_total' => 'decimal:2',
    ];

    public const STATUS_REGISTERED = 'REGISTERED';
    public const STATUS_IN_SERVICE = 'IN_SERVICE';
    public const STATUS_COMPLETED = 'COMPLETED';

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function hospitalUnit()
    {
        return $this->belongsTo(HospitalUnit::class);
    }

    public function doctor()
    {
        return $this->belongsTo(DoctorProfile::class, 'doctor_id');
    }

    public function payer()
    {
        return $this->belongsTo(Payer::class);
    }
}
