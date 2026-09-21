<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HospitalUnit extends Model
{
    protected $fillable = ['code', 'name', 'unit_type', 'location', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];

    public function scopePoli($query)
    {
        return $query->where('unit_type', 'POLI');
    }
}