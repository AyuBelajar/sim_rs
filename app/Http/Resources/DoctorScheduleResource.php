<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'schedule_date' => $this->schedule_date->format('Y-m-d'),
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'doctor' => [
                'id' => $this->doctor->id,
                'full_name' => $this->doctor->staff->full_name,
                'specialization' => $this->doctor->specialization,
            ],
            'hospital_unit' => [
                'id' => $this->hospitalUnit->id,
                'name' => $this->hospitalUnit->name,
            ],
            'quotas' => $this->quotas->map(fn ($q) => [
                'id' => $q->id,
                'channel' => $q->channel,
                'payer_group' => $q->payer_group,
                'quota_total' => $q->quota_total,
                'quota_used' => $q->quota_used,
                'is_full' => $q->is_full,
            ]),
        ];
    }
}