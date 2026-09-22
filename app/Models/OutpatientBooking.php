<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OutpatientBooking extends Model
{
    protected $fillable = [
        'booking_code', 'patient_id', 'doctor_schedule_id', 'hospital_unit_id',
        'doctor_id', 'payer_id', 'patient_policy_id', 'visit_date', 'visit_time',
        'booking_source', 'status', 'mobile_jkn_checked_in', 'jkn_queue_no',
        'draft_sep_no', 'notes', 'created_by',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'mobile_jkn_checked_in' => 'boolean',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctorSchedule()
    {
        return $this->belongsTo(DoctorSchedule::class);
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