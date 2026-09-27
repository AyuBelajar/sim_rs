import { api } from '../../api/http';

export interface NursingAssessmentData {
    id?: number;
    registration_id?: number;
    petugas?: string;
    keluhan_utama: string;
    riwayat_alergi?: string;
    tekanan_darah?: string;
    detak_jantung?: number | string;
    suhu_badan?: number | string;
    nafas?: number | string;
    tinggi_badan?: number | string;
    berat_badan?: number | string;
    tingkat_kesadaran?: string;
    skala_nyeri?: number | string;
    risiko_jatuh?: string;
    catatan_soap?: string;
}

export async function getNursingAssessment(registrationId: number): Promise<{ success: boolean; data: NursingAssessmentData | null }> {
    return api(`/api/registrations/${registrationId}/nursing/assessment`);
}

export async function saveNursingAssessment(
    registrationId: number,
    data: NursingAssessmentData
): Promise<{ success: boolean; message: string; data: NursingAssessmentData }> {
    return api(`/api/registrations/${registrationId}/nursing/assessment`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}