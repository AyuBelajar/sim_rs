<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Staff extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'employee_no',
        'full_name',
        'profession',
        'str_no',
        'sip_no',
        'phone',
        'email',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function doctorProfile(): HasOne
    {
        return $this->hasOne(DoctorProfile::class);
    }

    public function unitAssignments(): HasMany
    {
        return $this->hasMany(StaffUnitAssignment::class);
    }
}