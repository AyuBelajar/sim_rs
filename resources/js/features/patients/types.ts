export type Gender =
    | 'LAKI_LAKI'
    | 'PEREMPUAN';

export type BloodType =
    | 'A'
    | 'B'
    | 'AB'
    | 'O';

export type Patient = {
    id: number;
    medical_record_no: string;

    title: string | null;
    full_name: string;
    nickname: string | null;

    nik: string | null;
    gender: Gender;

    birth_place: string | null;
    birth_date: string | null;
    age: number | null;

    blood_type: BloodType | null;

    phone: string | null;
    email: string | null;

    religion: string | null;
    education: string | null;
    occupation: string | null;
    marital_status: string | null;

    employee_status: string | null;
    registered_service: string | null;

    special_notes: string | null;

    created_at: string | null;
    updated_at: string | null;
};

export type PatientPayload = {
    title?: string | null;
    full_name: string;
    nickname?: string | null;
    nik?: string | null;

    gender: Gender;

    birth_place?: string | null;
    birth_date: string;

    blood_type?: BloodType | null;

    phone?: string | null;
    email?: string | null;

    religion?: string | null;
    education?: string | null;
    occupation?: string | null;
    marital_status?: string | null;

    employee_status?: string | null;
    registered_service?: string | null;

    special_notes?: string | null;
};

export type PatientResponse = {
    data: Patient;
};

export type PatientListResponse = {
    data: Patient[];

    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };

    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    };
};