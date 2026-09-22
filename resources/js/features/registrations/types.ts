export type ArrivalMethod =
    | 'DATANG_SENDIRI'
    | 'RUJUKAN'
    | 'BOOKING_ONLINE'
    | 'KONTROL_ULANG'
    | 'KASUS_POLISI';

export type RegistrationStatus =
    | 'REGISTERED'
    | 'IN_SERVICE'
    | 'COMPLETED';

export type HospitalUnit = {
    id: number;
    code: string;
    name: string;
    unit_type: string;
};

export type Doctor = {
    id: number;
    display_name: string;
    specialization: string | null;
};

export type Payer = {
    id: number;
    name: string;
    category: 'UMUM' | 'BPJS' | 'ASURANSI' | 'KARYAWAN';
};

export type OutpatientRegistration = {
    id: number;
    registration_no: string;
    registration_date: string | null;
    registration_time: string | null;
    arrival_method: ArrivalMethod;
    counter_queue_no: string | null;
    sla_minutes: number | null;
    status: RegistrationStatus;
    is_package_service: boolean;
    has_cob: boolean;
    registration_fee: string;
    admin_fee: string;
    estimated_total: string;

    patient: {
        id: number;
        medical_record_no: string;
        full_name: string;
        nik: string | null;
        gender: 'LAKI_LAKI' | 'PEREMPUAN';
        birth_date: string | null;
        age: number | null;
    };

    hospital_unit: { id: number; name: string } | null;
    doctor: { id: number; display_name: string } | null;
    payer: { id: number; name: string; category: string } | null;
};

export type RegistrationPayload = {
    patient_id: number;
    hospital_unit_id: number;
    doctor_id: number;
    payer_id: number;
    arrival_method: ArrivalMethod;
    external_booking_code?: string | null;
    is_package_service?: boolean;
    has_cob?: boolean;
};

export type RegistrationStats = {
    total: number;
    registered: number;
    in_service: number;
    completed: number;
};

export type RegistrationListResponse = {
    data: OutpatientRegistration[];
    stats: RegistrationStats;

    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
    };
};

export type RegistrationResponse = {
    data: OutpatientRegistration;
};