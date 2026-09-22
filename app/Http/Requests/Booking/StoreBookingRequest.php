<?php

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_schedule_id' => ['required', 'exists:doctor_schedules,id'],
            'payer_id' => ['required', 'exists:payers,id'],
            'patient_policy_id' => ['nullable', 'exists:patient_policies,id'],
            'booking_source' => ['required', Rule::in(['COUNTER', 'WEB', 'MOBILE_JKN'])],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}