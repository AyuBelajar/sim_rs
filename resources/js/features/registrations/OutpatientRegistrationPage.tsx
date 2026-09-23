import { useCallback, useEffect, useState, type FormEvent } from 'react';

import { ApiError } from '../../api/http';
import { PatientFormModal } from '../patients/PatientFormModal';
import type { Patient } from '../patients/types';

import { getRegistrations } from './registrationApi';
import { RegistrationFormModal } from './RegistrationFormModal';
import { BpjsVerificationModal } from './BpjsVerifModal';
import { StatCard } from './StatCard';
import type { OutpatientRegistration, RegistrationStats } from './types';

export function OutpatientRegistrationPage() {
    const [data, setData] = useState<OutpatientRegistration[]>([]);
    const [stats, setStats] = useState<RegistrationStats | null>(null);
    const [meta, setMeta] = useState<{ total: number; from: number | null; to: number | null } | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');

    const [patientFormOpen, setPatientFormOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [registrationTarget, setRegistrationTarget] = useState<Patient | null>(null);

    // State untuk Modal BPJS Verifikasi & Terbit SEP
    const [bpjsModalOpen, setBpjsModalOpen] = useState(false);
    const [bpjsRegistrationId, setBpjsRegistrationId] = useState<number | null>(null);
    const [bpjsPatientName, setBpjsPatientName] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getRegistrations({ search: search || undefined, perPage: 10 });
            setData(response.data);
            setStats(response.stats);
            setMeta(response.meta);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Gagal mengambil data pendaftaran.');
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        load();
    }, [load]);

    function handleSearch(event: FormEvent) {
        event.preventDefault();
        setSearch(searchInput.trim());
    }

    // Handler saat pendaftaran sukses disimpan
    const handleRegistrationSaved = (savedRegistration?: any) => {
        setRegistrationTarget(null);
        load();

        // Cek apakah penjamin berkategori BPJS
        const isBpjs = savedRegistration?.payer?.category === 'BPJS' || 
                       savedRegistration?.payer?.name?.toUpperCase().includes('BPJS');

        if (isBpjs && savedRegistration?.id) {
            setBpjsRegistrationId(savedRegistration.id);
            setBpjsPatientName(savedRegistration.patient?.full_name || registrationTarget?.full_name || 'Pasien');
            setBpjsModalOpen(true);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Pendaftaran Rawat Jalan</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Kelola pendaftaran pasien baru, pasien lama, dan verifikasi kunjungan hari ini.
                </p>
            </div>

            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard value={stats.total} label="Total Hari Ini" accent="emerald" />
                    <StatCard value={stats.registered} label="Terdaftar" accent="slate" />
                    <StatCard value={stats.in_service} label="Dilayani" accent="amber" />
                    <StatCard value={stats.completed} label="Selesai" accent="green" />
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="font-semibold text-slate-800 mb-4">Cari Data Pasien</h2>
                <form onSubmit={handleSearch} className="flex gap-3">
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Cari berdasarkan No. RM, NIK, atau Nama"
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2"
                    />
                    <button
                        type="submit"
                        className="px-5 rounded-lg font-medium"
                        style={{ background: '#FFDF82', color: '#093C5D' }}
                    >
                        Cari
                    </button>
                </form>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={() => {
                        setEditingPatient(null);
                        setPatientFormOpen(true);
                    }}
                    className="px-6 py-3 rounded-lg font-semibold"
                    style={{ background: '#FFDF82', color: '#093C5D' }}
                >
                    + Pasien Baru
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3">{error}</div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
                {meta && <p className="px-5 pt-4 text-sm text-slate-500">{meta.total} pasien ditemukan</p>}

                <table className="w-full text-sm mt-2">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-y">
                        <tr>
                            <th className="p-3 text-left">No. RM</th>
                            <th className="p-3 text-left">Nama Pasien</th>
                            <th className="p-3 text-left">NIK</th>
                            <th className="p-3 text-left">Tgl. Lahir</th>
                            <th className="p-3 text-left">Jenis Kelamin</th>
                            <th className="p-3 text-left">Penjamin</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Dokter</th>
                            <th className="p-3 text-left">Poli</th>
                            <th className="p-3 text-left">Antrean</th>
                            <th className="p-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={11} className="text-center py-12 text-slate-400">Memuat data...</td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((reg) => (
                                <tr key={reg.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                    <td className="p-3 font-semibold text-blue-600">{reg.patient.medical_record_no}</td>
                                    <td className="p-3 font-medium">{reg.patient.full_name}</td>
                                    <td className="p-3">{reg.patient.nik ?? '-'}</td>
                                    <td className="p-3">{reg.patient.birth_date ?? '-'}</td>
                                    <td className="p-3">{reg.patient.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-600">
                                            {reg.payer?.category === 'BPJS' ? 'BPJS' : 'Non-BPJS'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-600">{reg.status}</span>
                                    </td>
                                    <td className="p-3">{reg.doctor?.display_name ?? '-'}</td>
                                    <td className="p-3">{reg.hospital_unit?.name ?? '-'}</td>
                                    <td className="p-3">{reg.counter_queue_no}</td>
                                    <td className="p-3 text-center">
                                        {reg.payer?.category === 'BPJS' && (
                                            <button
                                                onClick={() => {
                                                    setBpjsRegistrationId(reg.id);
                                                    setBpjsPatientName(reg.patient.full_name);
                                                    setBpjsModalOpen(true);
                                                }}
                                                className="px-2.5 py-1 text-xs font-medium rounded border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
                                            >
                                                Cek BPJS
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={11} className="text-center py-16 text-slate-400">Belum ada pendaftaran hari ini.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah/Edit Pasien */}
            <PatientFormModal
                open={patientFormOpen}
                patient={editingPatient}
                onClose={() => setPatientFormOpen(false)}
                onSaved={(patient) => {
                    setPatientFormOpen(false);
                    setRegistrationTarget(patient);
                    load();
                }}
            />

            {/* Modal Form Pendaftaran Rawat Jalan */}
            <RegistrationFormModal
                open={registrationTarget !== null}
                patient={registrationTarget}
                onBack={() => {
                    setEditingPatient(registrationTarget);
                    setRegistrationTarget(null);
                    setPatientFormOpen(true);
                }}
                onClose={() => setRegistrationTarget(null)}
                onSaved={handleRegistrationSaved}
            />

            {/* Modal Verifikasi BPJS & Terbit SEP (Tugas Vega) */}
            <BpjsVerificationModal
                isOpen={bpjsModalOpen}
                onClose={() => setBpjsModalOpen(false)}
                registrationId={bpjsRegistrationId}
                patientName={bpjsPatientName}
            />
        </div>
    );
}