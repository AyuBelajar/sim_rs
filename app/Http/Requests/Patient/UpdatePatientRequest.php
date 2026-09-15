<?php

namespace App\Http\Requests\Patient;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $patient = $this->route('patient');

        return [
            'title' => [
                'sometimes',
                'nullable',
                'string',
                'max:20',
            ],

            'full_name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'nickname' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'nik' => [
                'sometimes',
                'nullable',
                'digits:16',
                Rule::unique('patients', 'nik')
                    ->ignore($patient?->id),
            ],

            'gender' => [
                'sometimes',
                'required',
                Rule::in([
                    'LAKI_LAKI',
                    'PEREMPUAN',
                ]),
            ],

            'birth_place' => [
                'sometimes',
                'nullable',
                'string',
                'max:150',
            ],

            'birth_date' => [
                'sometimes',
                'required',
                'date',
                'before_or_equal:today',
            ],

            'blood_type' => [
                'sometimes',
                'nullable',
                Rule::in([
                    'A',
                    'B',
                    'AB',
                    'O',
                ]),
            ],

            'phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:30',
            ],

            'email' => [
                'sometimes',
                'nullable',
                'email',
                'max:255',
            ],

            'religion' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'education' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'occupation' => [
                'sometimes',
                'nullable',
                'string',
                'max:150',
            ],

            'marital_status' => [
                'sometimes',
                'nullable',
                'string',
                'max:50',
            ],

            'employee_status' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'registered_service' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'special_notes' => [
                'sometimes',
                'nullable',
                'string',
            ],
        ];
    }
}