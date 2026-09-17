<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'medical_record_no', 'title', 'full_name', 'nickname', 'nik', 'gender',
        'birth_place', 'birth_date', 'blood_type', 'phone', 'email', 'religion',
        'education', 'occupation', 'marital_status', 'employee_status',
        'registered_service', 'special_notes', 'photo_path', 'created_by',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    public function policies()
    {
        return $this->hasMany(PatientPolicy::class);
    }

    public function registrations()
    {
        return $this->hasMany(OutpatientRegistration::class);
    }

    public function getAgeAttribute(): int
    {
        return $this->birth_date ? $this->birth_date->age : 0;
    }
}