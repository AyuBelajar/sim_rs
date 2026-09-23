export type BookingStatus = 'WAITING' | 'REGISTERED' | 'CANCELLED';
 
export type BookingSource = 'COUNTER' | 'WEB' | 'MOBILE_JKN';
 
export type QuotaInfo = {
    quota_total: number;
    quota_used: number;
} | null;
 
export type DoctorSchedule = {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    unit: { id: number; name: string };
    doctor: { id: number; name: string };
    quota: {
        online_non_bpjs: QuotaInfo;
        online_bpjs: QuotaInfo;
        onsite_non_bpjs: QuotaInfo;
        onsite_bpjs: QuotaInfo;
    };
};
 
export type BookingPatient = {
    id: number;
    medical_record_no: string;
    full_name: string;
    gender?: 'LAKI_LAKI' | 'PEREMPUAN';
    birth_date?: string | null;
    age?: number | null;
};
 
export type Booking = {
    id: number;
    booking_code: string;
    visit_date: string | null;
    visit_time: string | null;
    booking_source: BookingSource;
    status: BookingStatus;
    mobile_jkn_checked_in: boolean;
 
    patient: BookingPatient | null;
    hospital_unit: { id: number; name: string } | null;
    doctor: { id: number; display_name: string } | null;
 
    created_at: string | null;
};
 
export type BookingPayload = {
    patient_id: number;
    doctor_schedule_id: number;
    payer_id: number;
    booking_source: BookingSource;
    notes?: string | null;
};
 
export type BookingListResponse = {
    data: Booking[];
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
    };
};
 
export type BookingResponse = {
    data: Booking;
};