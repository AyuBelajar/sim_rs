<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'medical_record_no',
        'title',
        'full_name',
        'nickname',
        'nik',
        'gender',
        'birth_place',
        'birth_date',
        'blood_type',
        'phone',
        'email',
        'religion',
        'education',
        'occupation',
        'marital_status',
        'employee_status',
        'registered_service',
        'special_notes',
        'photo_path',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function policies(): HasMany
    {
        return $this->hasMany(PatientPolicy::class);
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