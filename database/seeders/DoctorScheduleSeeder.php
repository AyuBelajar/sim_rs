<?php

namespace Database\Seeders;

use App\Models\DoctorProfile;
use App\Models\DoctorSchedule;
use App\Models\DoctorScheduleQuota;
use App\Models\HospitalUnit;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DoctorScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $scheduleDefinitions = [
            [
                'doctor_code' => 'UMUM',
                'unit_code' => 'POL-UMUM',
                'start_time' => '08:00:00',
                'end_time' => '12:00:00',
            ],
            [
                'doctor_code' => 'ANAK',
                'unit_code' => 'POL-ANAK',
                'start_time' => '09:00:00',
                'end_time' => '13:00:00',
            ],
            [
                'doctor_code' => 'PD',
                'unit_code' => 'POL-PD',
                'start_time' => '08:00:00',
                'end_time' => '12:00:00',
            ],
            [
                'doctor_code' => 'JTG',
                'unit_code' => 'POL-JTG',
                'start_time' => '13:00:00',
                'end_time' => '16:00:00',
            ],
        ];

        foreach (range(0, 6) as $dayOffset) {
            $date = Carbon::today()->addDays($dayOffset);

            foreach ($scheduleDefinitions as $definition) {
                $doctor = DoctorProfile::where(
                    'specialty_code',
                    $definition['doctor_code']
                )->firstOrFail();

                $unit = HospitalUnit::where(
                    'code',
                    $definition['unit_code']
                )->firstOrFail();

                $schedule = DoctorSchedule::updateOrCreate(
                    [
                        'doctor_id' => $doctor->id,
                        'hospital_unit_id' => $unit->id,
                        'schedule_date' => $date->toDateString(),
                        'start_time' => $definition['start_time'],
                    ],
                    [
                        'end_time' => $definition['end_time'],
                        'status' => 'AVAILABLE',
                    ]
                );

                $quotas = [
                    [
                        'channel' => 'ONLINE',
                        'payer_group' => 'BPJS',
                        'quota_total' => 20,
                    ],
                    [
                        'channel' => 'ONLINE',
                        'payer_group' => 'NON_BPJS',
                        'quota_total' => 10,
                    ],
                    [
                        'channel' => 'ONSITE',
                        'payer_group' => 'BPJS',
                        'quota_total' => 15,
                    ],
                    [
                        'channel' => 'ONSITE',
                        'payer_group' => 'NON_BPJS',
                        'quota_total' => 15,
                    ],
                ];

                foreach ($quotas as $quota) {
                    DoctorScheduleQuota::updateOrCreate(
                        [
                            'doctor_schedule_id' => $schedule->id,
                            'channel' => $quota['channel'],
                            'payer_group' => $quota['payer_group'],
                        ],
                        [
                            'quota_total' => $quota['quota_total'],
                            'quota_used' => 0,
                        ]
                    );
                }
            }
        }
    }
}