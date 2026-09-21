import { useEffect, useState, type FormEvent } from 'react';

import { ApiError } from '../../api/http';
import { Modal } from '../../components/ui/Modal';
import type { Patient } from '../patients/types';

import { createRegistration, getDoctors, getHospitalUnits, getPayers } from './registrationApi';
import type { ArrivalMethod, Doctor, HospitalUnit, Payer } from './types';

type Props = {
    open: boolean;
    patient: Patient | null;
    onBack: () => void;
    onClose: () => void;
    onSaved: () => void;
};

const PAYER_OPTIONS: { value: Payer['category']; label: string }[] = [
    { value: 'UMUM', label: 'Umum' },
    { value: 'BPJS', label: 'BPJS' },
    { value: 'ASURANSI', label: 'Asuransi' },
    { value: 'KARYAWAN', label: 'Karyawan' },
];

export function RegistrationFormModal({ open, patient, onBack, onClose, onSaved }: Props) {
    const [hospitalUnits, setHospitalUnits] = useState<HospitalUnit[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [payers, setPayers] = useState<Payer[]>([]);

    const [hospitalUnitId, setHospitalUnitId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [payerId, setPayerId] = useState('');
    const [arrivalMethod, setArrivalMethod] = useState<ArrivalMethod>('DATANG_SENDIRI');
    const [bookingCode, setBookingCode] = useState('');
    const [isPackage, setIsPackage] = useState(false);
    const [hasCob, setHasCob] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        setError(null);
        setHospitalUnitId('');
        setDoctorId('');
        setPayerId('');
        setArrivalMethod('DATANG_SENDIRI');
        setBookingCode('');
        setIsPackage(false);
        setHasCob(false);

        getHospitalUnits().then((res) => setHospitalUnits(res.data)).catch(() => {});
        getDoctors().then((res) => setDoctors(res.data)).catch(() => {});
        getPayers().then((res) => setPayers(res.data)).catch(() => {});
        // Payer belum punya endpoint list khusus kategori — pakai statis 4 kategori sesuai payers.category
        // Ganti bagian ini dengan panggilan GET /api/payers begitu endpoint list-nya tersedia untuk role ini.
    }, [open]);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!patient) return;

        setLoading(true);
        setError(null);

        try {
            await createRegistration({
                patient_id: patient.id,
                hospital_unit_id: Number(hospitalUnitId),
                doctor_id: Number(doctorId),
                payer_id: Number(payerId),
                arrival_method: arrivalMethod,
                external_booking_code: bookingCode || null,
                is_package_service: isPackage,
                has_cob: hasCob,
            });

            onSaved();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Gagal menyimpan pendaftaran.');
        } finally {
            setLoading(false);
        }
    }

    const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-50';

    if (!patient) return null;

    return (
        <Modal open={open} onClose={onClose} title={`Pendaftaran Rawat Jalan — ${patient.full_name}`}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-5">
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm">
                        <span className="font-semibold">{patient.medical_record_no}</span> · {patient.full_name} ·{' '}
                        {patient.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}
                    </div>

                    <div>
                        <label className="text-sm font-medium">Cara Masuk Pasien</label>
                        <select
                            className={inputClass}
                            value={arrivalMethod}
                            onChange={(e) => setArrivalMethod(e.target.value as ArrivalMethod)}
                        >
                            <option value="DATANG_SENDIRI">Datang Sendiri</option>
                            <option value="RUJUKAN">Rujukan</option>
                            <option value="BOOKING_ONLINE">Booking Online</option>
                            <option value="KONTROL_ULANG">Kontrol Ulang</option>
                            <option value="KASUS_POLISI">Kasus Polisi</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Poli *</label>
                            <select className={inputClass} value={hospitalUnitId} onChange={(e) => setHospitalUnitId(e.target.value)}>
                                <option value="">-- Pilih Poli --</option>
                                {hospitalUnits.map((u) => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Dokter *</label>
                            <select className={inputClass} value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                                <option value="">-- Pilih Dokter --</option>
                                {doctors.map((d) => (
                                    <option key={d.id} value={d.id}>{d.display_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                    <label className="text-sm font-medium">Pembayaran / Penjamin *</label>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                        {payers.map((payer) => (
                            <label
                                key={payer.id}
                                className={`border rounded-lg px-4 py-2.5 flex items-center gap-2 cursor-pointer text-sm ${
                                    payerId === String(payer.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="payer_id"
                                    checked={payerId === String(payer.id)}
                                    onChange={() => setPayerId(String(payer.id))}
                                />
                                {payer.name}
                            </label>
                        ))}
                    </div>
                </div>

                    <div>
                        <label className="text-sm font-medium">Kode Booking</label>
                        <input className={inputClass} value={bookingCode} onChange={(e) => setBookingCode(e.target.value)} placeholder="Opsional" />
                    </div>

                    <div className="flex gap-6 text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={isPackage} onChange={(e) => setIsPackage(e.target.checked)} />
                            Layanan Paket
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={hasCob} onChange={(e) => setHasCob(e.target.checked)} />
                            Data COB
                        </label>
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                    )}
                </div>

                <div className="border-t bg-slate-50 px-6 py-4 flex justify-end gap-2">
                    <button type="button" onClick={onBack} className="border rounded-lg px-4 py-2">
                        Kembali
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !hospitalUnitId || !doctorId || !payerId}
                        className="rounded-lg px-5 py-2 font-semibold disabled:opacity-60"
                        style={{ background: '#FFDF82', color: '#093C5D' }}
                    >
                        {loading ? 'Menyimpan...' : '✓ Daftarkan Pasien'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}