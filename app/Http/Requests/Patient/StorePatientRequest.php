<?php

namespace App\Http\Requests\Patient;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => [
                'nullable',
                'string',
                'max:20',
            ],

            'full_name' => [
                'required',
                'string',
                'max:255',
            ],

            'nickname' => [
                'nullable',
                'string',
                'max:100',
            ],

            'nik' => [
                'nullable',
                'digits:16',
                'unique:patients,nik',
            ],

            'gender' => [
                'required',
                Rule::in([
                    'LAKI_LAKI',
                    'PEREMPUAN',
                ]),
            ],

            'birth_place' => [
                'nullable',
                'string',
                'max:150',
            ],

            'birth_date' => [
                'required',
                'date',
                'before_or_equal:today',
            ],

            'blood_type' => [
                'nullable',
                Rule::in([
                    'A',
                    'B',
                    'AB',
                    'O',
                ]),
            ],

            'phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'religion' => [
                'nullable',
                'string',
                'max:100',
            ],

            'education' => [
                'nullable',
                'string',
                'max:100',
            ],

            'occupation' => [
                'nullable',
                'string',
                'max:150',
            ],

            'marital_status' => [
                'nullable',
                'string',
                'max:50',
            ],

            'employee_status' => [
                'nullable',
                'string',
                'max:100',
            ],

            'registered_service' => [
                'nullable',
                'string',
                'max:100',
            ],

            'special_notes' => [
                'nullable',
                'string',
            ],
        ];
    }
}