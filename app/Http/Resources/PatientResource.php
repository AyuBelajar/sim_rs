<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'medical_record_no' =>
                $this->medical_record_no,

            'title' =>
                $this->title,

            'full_name' =>
                $this->full_name,

            'nickname' =>
                $this->nickname,

            'nik' =>
                $this->nik,

            'gender' =>
                $this->gender,

            'birth_place' =>
                $this->birth_place,

            'birth_date' =>
                $this->birth_date?->format('Y-m-d'),

            'age' =>
                $this->birth_date?->age,

            'blood_type' =>
                $this->blood_type,

            'phone' =>
                $this->phone,

            'email' =>
                $this->email,

            'religion' =>
                $this->religion,

            'education' =>
                $this->education,

            'occupation' =>
                $this->occupation,

            'marital_status' =>
                $this->marital_status,

            'employee_status' =>
                $this->employee_status,

            'registered_service' =>
                $this->registered_service,

            'special_notes' =>
                $this->special_notes,

            'policies' => $this->whenLoaded(
                'policies',
                function () {
                    return $this->policies->map(
                        function ($policy) {
                            return [
                                'id' =>
                                    $policy->id,

                                'policy_no' =>
                                    $policy->policy_no,

                                'member_name' =>
                                    $policy->member_name,

                                'insurance_class' =>
                                    $policy->insurance_class,

                                'is_primary' =>
                                    $policy->is_primary,

                                'status' =>
                                    $policy->status,

                                'payer' =>
                                    $policy->payer
                                        ? [
                                            'id' =>
                                                $policy->payer->id,

                                            'code' =>
                                                $policy->payer->code,

                                            'name' =>
                                                $policy->payer->name,

                                            'category' =>
                                                $policy->payer->category,
                                        ]
                                        : null,
                            ];
                        }
                    );
                }
            ),

            'created_at' =>
                $this->created_at?->toISOString(),

            'updated_at' =>
                $this->updated_at?->toISOString(),
        ];
    }
}