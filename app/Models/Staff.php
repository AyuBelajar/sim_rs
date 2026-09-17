<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    protected $fillable = [
        'user_id', 'employee_no', 'full_name', 'profession', 'str_no', 'sip_no',
        'phone', 'email', 'is_active',
    ];
    protected $casts = ['is_active' => 'boolean'];

    public function doctorProfile()
    {
        return $this->hasOne(DoctorProfile::class);
    }
}