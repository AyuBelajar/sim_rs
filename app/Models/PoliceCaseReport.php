<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PoliceCaseReport extends Model
{
    protected $fillable = [
        'outpatient_registration_id', 'report_no', 'report_date',
        'institution_name', 'case_description',
    ];

    protected $casts = ['report_date' => 'date'];

    public function registration()
    {
        return $this->belongsTo(OutpatientRegistration::class, 'outpatient_registration_id');
    }
}
