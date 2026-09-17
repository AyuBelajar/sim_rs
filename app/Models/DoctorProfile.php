<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoctorProfile extends Model
{
    protected $fillable = ['staff_id', 'specialization', 'specialty_code'];

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }

    public function getDisplayNameAttribute(): string
    {
        $name = $this->staff->full_name ?? '-';
        return $this->specialty_code ? "{$name}, {$this->specialty_code}" : $name;
    }
}