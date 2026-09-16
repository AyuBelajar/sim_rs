<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientPolicyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // sudah dijaga middleware auth:sanctum
    }

    public function rules(): array
    {
        return [
            'payer_id' => ['required', 'exists:payers,id'],
            'policy_no' => ['required', 'string', 'max:100'],
            'member_name' => ['nullable', 'string', 'max:150'],
            'insurance_class' => ['nullable', 'string', 'max:50'],
            'valid_from' => ['nullable', 'date'],
            'valid_until' => ['nullable', 'date', 'after_or_equal:valid_from'],
            'is_primary' => ['boolean'],
            'status' => ['nullable', 'string', 'max:30'],
            'notes' => ['nullable', 'string'],
        ];
    }
}