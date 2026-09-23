import { useEffect, useState, type FormEvent } from 'react';

import { ApiError } from '../../api/http';
import { Modal } from '../../components/ui/Modal';
import { getHospitalUnits, getPayers } from '../registrations/registrationApi';
import type { HospitalUnit, Payer } from '../registrations/types';

import { createBooking, getDoctorSchedules } from './bookingApi';
import type { Booking, BookingPatient, BookingSource, DoctorSchedule } from './types';

type Props = {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
};

type Step = 'patient' | 'schedule' | 'details' | 'confirm' | 'success';

const SOURCE_OPTIONS: { value: BookingSource; label: string }[] = [
    { value: 'COUNTER', label: 'Counter' },
    { value: 'WEB', label: 'Web' },
    { value: 'MOBILE_JKN', label: 'Mobile JKN' },
];

function availableQuota(schedule: DoctorSchedule, source: BookingSource) {
    const channel = source === 'COUNTER' ? 'onsite' : 'online';
    const bpjs = schedule.quota[`${channel}_bpjs` as const];
    const nonBpjs = schedule.quota[`${channel}_non_bpjs` as const];

    const bpjsLeft = bpjs ? bpjs.quota_total - bpjs.quota_used : 0;
    const nonBpjsLeft = nonBpjs ? nonBpjs.quota_total - nonBpjs.quota_used : 0;
    const bpjsTotal = bpjs?.quota_total ?? 0;
    const nonBpjsTotal = nonBpjs?.quota_total ?? 0;

    return {
        left: Math.max(0, bpjsLeft) + Math.max(0, nonBpjsLeft),
        total: bpjsTotal + nonBpjsTotal,
    };
}

export function BookingFormModal({ open, onClose, onSaved }: Props) {
    const [step, setStep] = useState<Step>('patient');

    const [searchInput, setSearchInput] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<BookingPatient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<BookingPatient | null>(null);

    const [visitDate, setVisitDate] = useState('');
    const [hospitalUnits, setHospitalUnits] = useState<HospitalUnit[]>([]);
    const [hospitalUnitId, setHospitalUnitId] = useState('');
    const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
    const [loadingSchedules, setLoadingSchedules] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null);

    const [payers, setPayers] = useState<Payer[]>([]);
    const [payerId, setPayerId] = useState('');
    const [source, setSource] = useState<BookingSource>('COUNTER');
    const [notes, setNotes] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<Booking | null>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        setStep('patient');
        setSearchInput('');
        setSearchResults([]);
        setSelectedPatient(null);
        setVisitDate(new Date().toISOString().slice(0, 10));
        setHospitalUnitId('');
        setSchedules([]);
        setSelectedSchedule(null);
        setPayerId('');
        setSource('COUNTER');
        setNotes('');
        setError(null);
        setResult(null);

        getHospitalUnits().then((res) => setHospitalUnits(res.data)).catch(() => {});
        getPayers().then((res) => setPayers(res.data)).catch(() => {});
    }, [open]);

    async function handleSearchPatient(event: FormEvent) {
        event.preventDefault();

        if (!searchInput.trim()) {
            return;
        }

        setSearching(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/patients?search=${encodeURIComponent(searchInput.trim())}&per_page=5`,
                { headers: { Accept: 'application/json' } },
            );
            const json = await response.json();
            setSearchResults(json.data ?? []);
        } catch {
            setError('Gagal mencari pasien.');
        } finally {
            setSearching(false);
        }
    }

    async function loadSchedules() {
        if (!visitDate) {
            return;
        }

        setLoadingSchedules(true);
        setError(null);

        try {
            const response = await getDoctorSchedules({
                date: visitDate,
                hospitalUnitId: hospitalUnitId ? Number(hospitalUnitId) : undefined,
            });
            setSchedules(response.data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Gagal memuat jadwal dokter.');
        } finally {
            setLoadingSchedules(false);
        }
    }

    async function handleSubmit() {
        if (!selectedPatient || !selectedSchedule || !payerId) {
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await createBooking({
                patient_id: selectedPatient.id,
                doctor_schedule_id: selectedSchedule.id,
                payer_id: Number(payerId),
                booking_source: source,
                notes: notes || null,
            });

            setResult(response.data);
            setStep('success');
            onSaved();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Gagal membuat booking.');
        } finally {
            setSubmitting(false);
        }
    }

    const inputClass =
        'w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-50';

    const selectedPayer = payers.find((p) => String(p.id) === payerId) ?? null;

    return (
        <Modal open={open} onClose={onClose} title={step === 'success' ? 'Booking Berhasil Dibuat' : 'Buat Booking'}>
            <div className="p-6">
                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {step === 'patient' && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Cari pasien</label>
                            <form onSubmit={handleSearchPatient} className="mt-1.5 flex gap-2">
                                <input
                                    className={inputClass}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Nama pasien / No. RM / NIK"
                                />
                                <button
                                    type="submit"
                                    disabled={searching}
                                    className="shrink-0 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                                >
                                    {searching ? 'Mencari...' : 'Cari'}
                                </button>
                            </form>
                        </div>

                        {searchResults.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-slate-500">Hasil pencarian</p>

                                <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                                    {searchResults.map((patient) => (
                                        <label
                                            key={patient.id}
                                            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-slate-50"
                                        >
                                            <input
                                                type="radio"
                                                name="patient"
                                                checked={selectedPatient?.id === patient.id}
                                                onChange={() => setSelectedPatient(patient)}
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">{patient.full_name}</p>
                                                <p className="text-xs text-slate-500">
                                                    RM {patient.medical_record_no}
                                                    {patient.gender ? ` · ${patient.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}` : ''}
                                                    {patient.age != null ? ` · ${patient.age} tahun` : ''}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 'schedule' && (
                    <div className="space-y-5">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                            <span className="font-medium">{selectedPatient?.full_name}</span>
                            <span className="text-slate-500"> · RM {selectedPatient?.medical_record_no}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700">Tanggal Kunjungan</label>
                                <input
                                    type="date"
                                    className={`${inputClass} mt-1.5`}
                                    value={visitDate}
                                    onChange={(e) => setVisitDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">Unit</label>
                                <select
                                    className={`${inputClass} mt-1.5`}
                                    value={hospitalUnitId}
                                    onChange={(e) => setHospitalUnitId(e.target.value)}
                                >
                                    <option value="">Semua unit</option>
                                    {hospitalUnits.map((unit) => (
                                        <option key={unit.id} value={unit.id}>{unit.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={loadSchedules}
                            disabled={loadingSchedules || !visitDate}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                        >
                            {loadingSchedules ? 'Memuat...' : 'Tampilkan Jadwal'}
                        </button>

                        {schedules.length > 0 && (
                            <div className="overflow-hidden rounded-lg border border-slate-200">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-2.5 text-left font-medium text-slate-500">Dokter</th>
                                            <th className="px-4 py-2.5 text-left font-medium text-slate-500">Unit</th>
                                            <th className="px-4 py-2.5 text-left font-medium text-slate-500">Jam</th>
                                            <th className="px-4 py-2.5 text-left font-medium text-slate-500">Kuota</th>
                                            <th className="px-4 py-2.5 text-left font-medium text-slate-500">Pilih</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules.map((schedule) => {
                                            const quota = availableQuota(schedule, source);
                                            const full = quota.left <= 0;

                                            return (
                                                <tr key={schedule.id} className="border-b border-slate-100 last:border-0">
                                                    <td className="px-4 py-3 font-medium text-slate-800">{schedule.doctor.name}</td>
                                                    <td className="px-4 py-3 text-slate-600">{schedule.unit.name}</td>
                                                    <td className="px-4 py-3 text-slate-600">{schedule.start_time}–{schedule.end_time}</td>
                                                    <td className="px-4 py-3">
                                                        {full ? (
                                                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">Penuh</span>
                                                        ) : (
                                                            <span className="text-slate-600">{quota.left} / {quota.total}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="radio"
                                                            name="schedule"
                                                            disabled={full}
                                                            checked={selectedSchedule?.id === schedule.id}
                                                            onChange={() => setSelectedSchedule(schedule)}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {step === 'details' && selectedPatient && selectedSchedule && (
                    <div className="space-y-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Informasi Pasien</p>
                            <div className="mt-2 space-y-1 text-sm">
                                <div className="flex justify-between"><span className="text-slate-500">Nama</span><span className="font-medium text-slate-800">{selectedPatient.full_name}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">No. Rekam Medis</span><span className="font-medium text-slate-800">{selectedPatient.medical_record_no}</span></div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Jadwal Kunjungan</p>
                            <div className="mt-2 space-y-1 text-sm">
                                <div className="flex justify-between"><span className="text-slate-500">Unit</span><span className="font-medium text-slate-800">{selectedSchedule.unit.name}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Dokter</span><span className="font-medium text-slate-800">{selectedSchedule.doctor.name}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Tanggal</span><span className="font-medium text-slate-800">{selectedSchedule.date}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Jam</span><span className="font-medium text-slate-800">{selectedSchedule.start_time}</span></div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <label className="text-sm font-medium text-slate-700">Pembayaran / Penjamin</label>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                {payers.map((payer) => (
                                    <label
                                        key={payer.id}
                                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm ${
                                            payerId === String(payer.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payer"
                                            checked={payerId === String(payer.id)}
                                            onChange={() => setPayerId(String(payer.id))}
                                        />
                                        {payer.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <label className="text-sm font-medium text-slate-700">Sumber Booking</label>
                            <div className="mt-2 grid grid-cols-3 gap-2">
                                {SOURCE_OPTIONS.map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm ${
                                            source === option.value ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="source"
                                            checked={source === option.value}
                                            onChange={() => setSource(option.value)}
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <label className="text-sm font-medium text-slate-700">Catatan</label>
                            <textarea
                                rows={3}
                                className={`${inputClass} mt-1.5 resize-none`}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {step === 'confirm' && selectedPatient && selectedSchedule && (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500">Pastikan data kunjungan sudah sesuai.</p>

                        <div className="space-y-1 rounded-lg border border-slate-200 p-4 text-sm">
                            <div className="flex justify-between"><span className="text-slate-500">Pasien</span><span className="font-medium text-slate-800">{selectedPatient.full_name} ({selectedPatient.medical_record_no})</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Dokter</span><span className="font-medium text-slate-800">{selectedSchedule.doctor.name}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Unit</span><span className="font-medium text-slate-800">{selectedSchedule.unit.name}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Tanggal</span><span className="font-medium text-slate-800">{selectedSchedule.date}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Jam</span><span className="font-medium text-slate-800">{selectedSchedule.start_time}</span></div>
                            <div className="flex justify-between border-t border-slate-100 pt-2"><span className="text-slate-500">Penjamin</span><span className="font-medium text-slate-800">{selectedPayer?.name ?? '-'}</span></div>
                        </div>
                    </div>
                )}

                {step === 'success' && result && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Kode Booking</p>
                            <p className="mt-1 text-lg font-semibold text-slate-800">{result.booking_code}</p>
                        </div>

                        <div className="space-y-1 rounded-lg border border-slate-200 p-4 text-sm">
                            <div className="flex justify-between"><span className="text-slate-500">Pasien</span><span className="font-medium text-slate-800">{result.patient?.full_name}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Dokter</span><span className="font-medium text-slate-800">{result.doctor?.display_name}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Unit</span><span className="font-medium text-slate-800">{result.hospital_unit?.name}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Tanggal</span><span className="font-medium text-slate-800">{result.visit_date}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Jam</span><span className="font-medium text-slate-800">{result.visit_time}</span></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
                {step === 'patient' && (
                    <>
                        <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">Batal</button>
                        <button
                            type="button"
                            disabled={!selectedPatient}
                            onClick={() => setStep('schedule')}
                            className="rounded-lg px-5 py-2 text-sm font-semibold disabled:opacity-60"
                            style={{ background: '#FFDF82', color: '#093C5D' }}
                        >
                            Lanjut
                        </button>
                    </>
                )}

                {step === 'schedule' && (
                    <>
                        <button type="button" onClick={() => setStep('patient')} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">Kembali</button>
                        <button
                            type="button"
                            disabled={!selectedSchedule}
                            onClick={() => setStep('details')}
                            className="rounded-lg px-5 py-2 text-sm font-semibold disabled:opacity-60"
                            style={{ background: '#FFDF82', color: '#093C5D' }}
                        >
                            Lanjut
                        </button>
                    </>
                )}

                {step === 'details' && (
                    <>
                        <button type="button" onClick={() => setStep('schedule')} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">Kembali</button>
                        <button
                            type="button"
                            disabled={!payerId}
                            onClick={() => setStep('confirm')}
                            className="rounded-lg px-5 py-2 text-sm font-semibold disabled:opacity-60"
                            style={{ background: '#FFDF82', color: '#093C5D' }}
                        >
                            Lanjut
                        </button>
                    </>
                )}

                {step === 'confirm' && (
                    <>
                        <button type="button" onClick={() => setStep('details')} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">Kembali</button>
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={handleSubmit}
                            className="rounded-lg px-5 py-2 text-sm font-semibold disabled:opacity-60"
                            style={{ background: '#FFDF82', color: '#093C5D' }}
                        >
                            {submitting ? 'Menyimpan...' : 'Simpan Booking'}
                        </button>
                    </>
                )}

                {step === 'success' && (
                    <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium">Tutup</button>
                )}
            </div>
        </Modal>
    );
}
