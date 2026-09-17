<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDoctorScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'doctor_id' => ['required', 'exists:doctor_profiles,id'],
            'hospital_unit_id' => ['required', 'exists:hospital_units,id'],
            'schedule_date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'notes' => ['nullable', 'string'],
            'quotas' => ['required', 'array', 'min:1'],
            'quotas.*.channel' => ['required', 'in:ONLINE,ONSITE'],
            'quotas.*.payer_group' => ['required', 'in:BPJS,NON_BPJS'],
            'quotas.*.quota_total' => ['required', 'integer', 'min:0'],
        ];
    }
}