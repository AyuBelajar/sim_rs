import { api } from '../../api/http';
 
import type {
    Booking,
    BookingListResponse,
    BookingPayload,
    BookingResponse,
    DoctorSchedule,
} from './types';
 
type BookingFilters = {
    search?: string;
    date?: string;
    status?: string;
    page?: number;
    perPage?: number;
};
 
export async function getBookings(filters: BookingFilters = {}) {
    const params = new URLSearchParams();
 
    if (filters.search) params.set('search', filters.search);
    if (filters.date) params.set('date', filters.date);
    if (filters.status) params.set('status', filters.status);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.perPage) params.set('per_page', String(filters.perPage));
 
    const query = params.toString();
 
    return api<BookingListResponse>(`/api/bookings${query ? `?${query}` : ''}`);
}
 
export async function createBooking(payload: BookingPayload) {
    return api<BookingResponse>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}
 
type ScheduleFilters = {
    date: string;
    hospitalUnitId?: number;
    doctorId?: number;
};
 
export async function getDoctorSchedules(filters: ScheduleFilters) {
    const params = new URLSearchParams();
 
    params.set('date', filters.date);
    if (filters.hospitalUnitId) params.set('hospital_unit_id', String(filters.hospitalUnitId));
    if (filters.doctorId) params.set('doctor_id', String(filters.doctorId));
 
    return api<{ data: DoctorSchedule[] }>(`/api/doctor-schedules?${params.toString()}`);
}