<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistrationReferral extends Model
{
    protected $fillable = [
        'outpatient_registration_id', 'healthcare_facility_id', 'facility_name_snapshot',
        'facility_type_snapshot', 'facility_address_snapshot', 'referral_no',
        'referral_date', 'referral_diagnosis_code', 'notes',
    ];

    protected $casts = ['referral_date' => 'date'];

    public function registration()
    {
        return $this->belongsTo(OutpatientRegistration::class, 'outpatient_registration_id');
    }
}