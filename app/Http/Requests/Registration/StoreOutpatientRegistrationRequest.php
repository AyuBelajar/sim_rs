<?php

namespace App\Http\Requests\Registration;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOutpatientRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'exists:patients,id'],
            'hospital_unit_id' => ['required', 'exists:hospital_units,id'],
            'doctor_id' => ['required', 'exists:doctor_profiles,id'],
            'payer_id' => ['required', 'exists:payers,id'],
            'arrival_method' => ['required', Rule::in([
                'DATANG_SENDIRI', 'RUJUKAN', 'BOOKING_ONLINE', 'KONTROL_ULANG', 'KASUS_POLISI',
            ])],
            'external_booking_code' => ['nullable', 'string', 'max:60'],
            'is_package_service' => ['nullable', 'boolean'],
            'has_cob' => ['nullable', 'boolean'],
        ];
    }
}