import { api } from '../../api/http';

import type {
    Doctor,
    HospitalUnit,
    Payer,
    RegistrationListResponse,
    RegistrationPayload,
    RegistrationResponse,
} from './types';

type RegistrationFilters = {
    search?: string;
    status?: string;
    date?: string;
    page?: number;
    perPage?: number;
};

export async function getRegistrations(filters: RegistrationFilters = {}) {
    const params = new URLSearchParams();

    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.date) params.set('date', filters.date);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.perPage) params.set('per_page', String(filters.perPage));

    const query = params.toString();

    return api<RegistrationListResponse>(
        `/api/outpatient-registrations${query ? `?${query}` : ''}`,
    );
}

export async function createRegistration(payload: RegistrationPayload) {
    return api<RegistrationResponse>('/api/outpatient-registrations', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function getHospitalUnits() {
    return api<{ data: HospitalUnit[] }>('/api/hospital-units');
}

export async function getDoctors() {
    return api<{ data: Doctor[] }>('/api/doctors');
}