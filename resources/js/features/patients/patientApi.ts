import { api } from '../../api/http';

import type {
    PatientListResponse,
    PatientPayload,
    PatientResponse,
} from './types';

type PatientFilters = {
    search?: string;
    gender?: string;
    page?: number;
    perPage?: number;
};

export async function getPatients(
    filters: PatientFilters = {},
) {
    const params = new URLSearchParams();

    if (filters.search) {
        params.set(
            'search',
            filters.search,
        );
    }

    if (filters.gender) {
        params.set(
            'gender',
            filters.gender,
        );
    }

    if (filters.page) {
        params.set(
            'page',
            String(filters.page),
        );
    }

    if (filters.perPage) {
        params.set(
            'per_page',
            String(filters.perPage),
        );
    }

    const query = params.toString();

    return api<PatientListResponse>(
        `/api/patients${
            query ? `?${query}` : ''
        }`,
    );
}

export async function createPatient(
    payload: PatientPayload,
) {
    return api<PatientResponse>(
        '/api/patients',
        {
            method: 'POST',
            body: JSON.stringify(payload),
        },
    );
}

export async function updatePatient(
    id: number,
    payload: Partial<PatientPayload>,
) {
    return api<PatientResponse>(
        `/api/patients/${id}`,
        {
            method: 'PATCH',
            body: JSON.stringify(payload),
        },
    );
}

export async function deletePatient(
    id: number,
) {
    return api<void>(
        `/api/patients/${id}`,
        {
            method: 'DELETE',
        },
    );
}