import { api } from '../../api/http';

export async function getEncounter(encounterId: number) {
    return api<{ data: any }>(`/api/encounters/${encounterId}`);
}

export async function storeVitals(encounterId: number, data: any) {
    return api(`/api/encounters/${encounterId}/vitals`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function storeSoap(encounterId: number, data: any) {
    return api(`/api/encounters/${encounterId}/soap`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function storeDiagnosis(encounterId: number, data: any) {
    return api(`/api/encounters/${encounterId}/diagnoses`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function storePrescription(encounterId: number, data: any) {
    return api(`/api/encounters/${encounterId}/prescriptions`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export default { getEncounter, storeVitals, storeSoap, storeDiagnosis, storePrescription };