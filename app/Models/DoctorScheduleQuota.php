<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoctorScheduleQuota extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_schedule_id',
        'channel',
        'payer_group',
        'quota_total',
        'quota_used',
    ];

    protected function casts(): array
    {
        return [
            'quota_total' => 'integer',
            'quota_used' => 'integer',
        ];
    }

    public function doctorSchedule(): BelongsTo
    {
        return $this->belongsTo(DoctorSchedule::class);
    }
}