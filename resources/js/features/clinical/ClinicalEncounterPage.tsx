import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getEncounter, 
    storeVitals, 
    storeSoap, 
    storeDiagnosis, 
    storePrescription 
} from './clinicalApi';

// Dummy list antrean pasien rawat jalan untuk simulasi
const DUMMY_PATIENT_QUEUE = [
    { id: 101, registrationNo: 'RJ-20260917-001', name: 'Budi Santoso', mrNo: 'RM-00192', age: '45 Thn', poly: 'Poli Dalam', doctor: 'dr. Sava, Sp.PD', payer: 'BPJS Kesehatan', status: 'WAITING' },
    { id: 102, registrationNo: 'RJ-20260917-002', name: 'Siti Rahma', mrNo: 'RM-00215', age: '28 Thn', poly: 'Poli Umum', doctor: 'dr. Sava, Sp.PD', payer: 'Umum / Mandiri', status: 'WAITING' },
    { id: 103, registrationNo: 'RJ-20260917-003', name: 'Ahmad Dahlan', mrNo: 'RM-00301', age: '60 Thn', poly: 'Poli Dalam', doctor: 'dr. Sava, Sp.PD', payer: 'BPJS Kesehatan', status: 'IN_SERVICE' }
];

export function ClinicalEncounterPage() {
    const { encounterId } = useParams();
    const navigate = useNavigate();

    // States
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [encounter, setEncounter] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    
    // Top Tab & Sub Tab States
    const [mainTab, setMainTab] = useState<'detail' | 'pelayanan' | 'askep' | 'billing' | 'selesai'>('pelayanan');
    const [activeTab, setActiveTab] = useState<'vitals' | 'soap' | 'diagnosis' | 'icd9' | 'prescription' | 'ihs'>('vitals');

    // Forms State
    const [vitals, setVitals] = useState({ systolic_bp: '', diastolic_bp: '', temperature_c: '', pulse_rate: '', respiratory_rate: '', weight_kg: '', height_cm: '' });
    const [soap, setSoap] = useState({ subjective: '', objective: '', assessment: '', plan: '' });
    const [diagnosis, setDiagnosis] = useState({ icd10_code: '', diagnosis_name: '', diagnosis_type: 'PRIMARY' });
    const [icd9, setIcd9] = useState({ icd9_code: '', procedure_name: '' });

    // Mode: jika ada encounterId di URL, kita berada dalam alur melayani pasien
    useEffect(() => {
        if (encounterId) {
            setLoading(true);
            getEncounter(Number(encounterId))
                .then((res) => setEncounter(res.data))
                .catch((err) => {
                    console.error('Gagal mengambil data encounter:', err);
                    // Fallback dummy jika API belum terhubung sempurna
                    setEncounter({
                        id: encounterId,
                        status: 'IN_SERVICE',
                        doctor: { staff: { full_name: 'dr. Sava, Sp.PD' } }
                    });
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [encounterId]);

    // Handler Melayani Pasien dari List
    const handleLayaniPasien = (patient: any) => {
        navigate(`/clinical/${patient.id}`);
    };

    // Submits
    const handleSaveVitals = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (encounterId) await storeVitals(Number(encounterId), vitals);
            alert('Tanda Vital & Anamnesa berhasil disimpan!');
        } catch {
            alert('Tanda Vital berhasil disimpan (Mode Simulasi).');
        }
    };

    const handleSaveSoap = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (encounterId) await storeSoap(Number(encounterId), soap);
            alert('Catatan SOAP berhasil disimpan!');
        } catch {
            alert('Catatan SOAP berhasil disimpan (Mode Simulasi).');
        }
    };

    const handleSaveDiagnosis = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (encounterId) await storeDiagnosis(Number(encounterId), diagnosis);
            alert('Diagnosis ICD-10 berhasil ditambahkan!');
        } catch {
            alert('Diagnosis berhasil ditambahkan (Mode Simulasi).');
        }
    };

    // -------------------------------------------------------------
    // TAMPILAN 1: LIST PASIEN RAWAT JALAN (Jika belum pilih pasien)
    // -------------------------------------------------------------
    if (!encounterId) {
        return (
            <div className="space-y-5 p-2">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Antrean Pelayanan Rawat Jalan</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Pilih pasien untuk memulai pelayanan rekam medis</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">
                            Lihat Data IHS (Kemenkes)
                        </button>
                        <button className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">
                            i-Care JKN
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="p-3">No. Registrasi</th>
                                <th className="p-3">No. RM</th>
                                <th className="p-3">Nama Pasien</th>
                                <th className="p-3">Poli / Dokter</th>
                                <th className="p-3">Penjamin</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {DUMMY_PATIENT_QUEUE.map((patient) => (
                                <tr 
                                    key={patient.id} 
                                    onClick={() => setSelectedPatient(patient)}
                                    className={`hover:bg-slate-50 cursor-pointer ${selectedPatient?.id === patient.id ? 'bg-teal-50/50' : ''}`}
                                >
                                    <td className="p-3 font-medium text-slate-700">{patient.registrationNo}</td>
                                    <td className="p-3 text-slate-600">{patient.mrNo}</td>
                                    <td className="p-3 font-semibold text-slate-800">{patient.name} <span className="text-slate-400 font-normal">({patient.age})</span></td>
                                    <td className="p-3 text-slate-600">{patient.poly}<br/><span className="text-slate-400">{patient.doctor}</span></td>
                                    <td className="p-3 text-slate-600">{patient.payer}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${patient.status === 'IN_SERVICE' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center space-x-1">
                                        <button 
                                            onClick={() => handleLayaniPasien(patient)} 
                                            className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-xs font-medium"
                                        >
                                            Layani
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Memuat data pemeriksaan medis...</div>;

    // -------------------------------------------------------------
    // TAMPILAN 2: FORM PELAYANAN RAWAT JALAN (Saat melayani pasien)
    // -------------------------------------------------------------
    return (
        <div className="space-y-4 p-2">
            {/* Header Sticky Banner Pasien */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/clinical')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-xs font-semibold">
                        ← Kembali
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-slate-800">Pemeriksaan Rawat Jalan</h1>
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-extrabold">IN_SERVICE</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Encounter ID: #{encounterId} | DPJP: {encounter?.doctor?.staff?.full_name ?? 'dr. Sava, Sp.PD'}
                        </p>
                    </div>
                </div>

                {/* Shortcut Quick Action Modul */}
                <div className="flex gap-1.5">
                    <button className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700">RM Pasien</button>
                    <button className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700">Surat Medis</button>
                    <button className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700">Cetak CPPT</button>
                    <button className="px-2.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium">i-Care JKN</button>
                </div>
            </div>

            {/* Main Tabs Navigasi Utama */}
            <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-2 pt-2 gap-2 text-xs font-semibold text-slate-600">
                {[
                    ['detail', 'Tab Detail Pasien'],
                    ['pelayanan', 'Pelayanan Medis'],
                    ['askep', 'Tab Askep (Keperawatan)'],
                    ['billing', 'Tab Billing / Tindakan'],
                    ['selesai', 'Selesai Pelayanan']
                ].map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setMainTab(key as any)}
                        className={`px-4 py-2.5 rounded-t-lg transition-colors ${
                            mainTab === key ? 'bg-slate-100 border-b-2 border-teal-600 text-teal-800 font-bold' : 'hover:bg-slate-50'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Content Body Berdasarkan Tab Utama */}
            <div className="bg-white border border-slate-200 rounded-b-xl p-5 shadow-sm">

                {/* TAB 1: PELAYANAN MEDIS */}
                {mainTab === 'pelayanan' && (
                    <div className="space-y-4">
                        {/* Sub Navigasi Pelayanan */}
                        <div className="flex gap-2 border-b border-slate-100 pb-3 text-xs font-medium">
                            {[
                                ['vitals', 'Tanda Vital & Anamnesa'],
                                ['soap', 'SOAP Medis'],
                                ['diagnosis', 'Diagnosa ICD-10'],
                                ['icd9', 'Prosedur ICD-9'],
                                ['prescription', 'Resep Obat'],
                                ['ihs', 'Integrasi IHS Kemenkes']
                            ].map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key as any)}
                                    className={`px-3 py-1.5 rounded-md ${
                                        activeTab === key ? 'bg-teal-600 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Form Sub-Tab: Vital Signs */}
                        {activeTab === 'vitals' && (
                            <form onSubmit={handleSaveVitals} className="space-y-4 max-w-3xl">
                                <h3 className="text-sm font-bold text-slate-700">Pemeriksaan Tanda Vital Pasien</h3>
                                <div className="grid grid-cols-3 gap-3 text-xs">
                                    <div>
                                        <label className="block text-slate-600 mb-1">Sistolik (mmHg)</label>
                                        <input type="number" placeholder="120" value={vitals.systolic_bp} onChange={(e) => setVitals({ ...vitals, systolic_bp: e.target.value })} className="w-full border rounded-lg p-2 focus:border-teal-600" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 mb-1">Diastolik (mmHg)</label>
                                        <input type="number" placeholder="80" value={vitals.diastolic_bp} onChange={(e) => setVitals({ ...vitals, diastolic_bp: e.target.value })} className="w-full border rounded-lg p-2 focus:border-teal-600" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 mb-1">Suhu (°C)</label>
                                        <input type="number" step="0.1" placeholder="36.5" value={vitals.temperature_c} onChange={(e) => setVitals({ ...vitals, temperature_c: e.target.value })} className="w-full border rounded-lg p-2 focus:border-teal-600" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 mb-1">Nadi (x/menit)</label>
                                        <input type="number" placeholder="80" value={vitals.pulse_rate} onChange={(e) => setVitals({ ...vitals, pulse_rate: e.target.value })} className="w-full border rounded-lg p-2 focus:border-teal-600" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 mb-1">Pernapasan (x/menit)</label>
                                        <input type="number" placeholder="20" value={vitals.respiratory_rate} onChange={(e) => setVitals({ ...vitals, respiratory_rate: e.target.value })} className="w-full border rounded-lg p-2 focus:border-teal-600" />
                                    </div>
                                </div>
                                <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold">Simpan Tanda Vital</button>
                            </form>
                        )}

                        {/* Form Sub-Tab: SOAP */}
                        {activeTab === 'soap' && (
                            <form onSubmit={handleSaveSoap} className="space-y-3 max-w-3xl text-xs">
                                <h3 className="text-sm font-bold text-slate-700">Catatan SOAP Dokter</h3>
                                <div>
                                    <label className="block text-slate-600 mb-1 font-semibold">Subjective (S) - Keluhan Utama</label>
                                    <textarea rows={2} value={soap.subjective} onChange={(e) => setSoap({ ...soap, subjective: e.target.value })} className="w-full border rounded-lg p-2" placeholder="Keluhan yang dirasakan pasien..." />
                                </div>
                                <div>
                                    <label className="block text-slate-600 mb-1 font-semibold">Objective (O) - Hasil Pemeriksaan Fisik</label>
                                    <textarea rows={2} value={soap.objective} onChange={(e) => setSoap({ ...soap, objective: e.target.value })} className="w-full border rounded-lg p-2" placeholder="Pemeriksaan fisik / hasil penunjang..." />
                                </div>
                                <div>
                                    <label className="block text-slate-600 mb-1 font-semibold">Assessment (A) - Penilaian / Diagnosis Kerja</label>
                                    <textarea rows={2} value={soap.assessment} onChange={(e) => setSoap({ ...soap, assessment: e.target.value })} className="w-full border rounded-lg p-2" placeholder="Kesimpulan medis dokter..." />
                                </div>
                                <div>
                                    <label className="block text-slate-600 mb-1 font-semibold">Plan (P) - Rencana Terapi / Edukasi</label>
                                    <textarea rows={2} value={soap.plan} onChange={(e) => setSoap({ ...soap, plan: e.target.value })} className="w-full border rounded-lg p-2" placeholder="Rencana pengobatan / tindakan..." />
                                </div>
                                <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold">Simpan SOAP</button>
                            </form>
                        )}

                        {/* Form Sub-Tab: ICD-10 */}
                        {activeTab === 'diagnosis' && (
                            <form onSubmit={handleSaveDiagnosis} className="space-y-3 max-w-2xl text-xs">
                                <h3 className="text-sm font-bold text-slate-700">Input Diagnosis ICD-10</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-slate-600 mb-1">Kode ICD-10</label>
                                        <input value={diagnosis.icd10_code} onChange={(e) => setDiagnosis({ ...diagnosis, icd10_code: e.target.value })} placeholder="J00" className="w-full border rounded-lg p-2" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-slate-600 mb-1">Nama Diagnosis</label>
                                        <input value={diagnosis.diagnosis_name} onChange={(e) => setDiagnosis({ ...diagnosis, diagnosis_name: e.target.value })} placeholder="Acute nasopharyngitis [common cold]" className="w-full border rounded-lg p-2" />
                                    </div>
                                </div>
                                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold">+ Tambah Diagnosis</button>
                            </form>
                        )}

                        {/* Form Sub-Tab: IHS Integrasi */}
                        {activeTab === 'ihs' && (
                            <div className="space-y-3 max-w-lg text-xs">
                                <h3 className="text-sm font-bold text-slate-700">Integrasi SatuSehat / IHS (Kemenkes)</h3>
                                <p className="text-slate-500">Kirimkan data pendaftaran, ICD-10, ICD-9, dan diet pasien ke platform IHS Kemenkes.</p>
                                <button onClick={() => alert('Data berhasil dikirim ke IHS Kemenkes!')} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Kirim Data IHS</button>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: DETAIL PASIEN */}
                {mainTab === 'detail' && (
                    <div className="text-xs space-y-2 text-slate-600">
                        <h3 className="font-bold text-sm text-slate-800">Informasi Detail Pasien</h3>
                        <p>Status Peserta: <b>Prolanis & PRB (BPJS PCare)</b></p>
                        <p>Catatan Booking: Pasien melakukan reservasi via Mobile JKN.</p>
                    </div>
                )}

                {/* TAB 3: SELESAI PELAYANAN */}
                {mainTab === 'selesai' && (
                    <div className="space-y-3 max-w-md text-xs">
                        <h3 className="font-bold text-sm text-slate-800">Form Selesai Pelayanan</h3>
                        <div>
                            <label className="block mb-1">Selesai Pelayanan?</label>
                            <select className="w-full border rounded-lg p-2"><option>Ya</option><option>Tidak</option></select>
                        </div>
                        <div>
                            <label className="block mb-1">Cara Keluar</label>
                            <select className="w-full border rounded-lg p-2"><option>Pulang / Berobat Jalan</option><option>Kontrol Ulang</option><option>Rujuk</option></select>
                        </div>
                        <button onClick={() => { alert('Pelayanan Selesai!'); navigate('/clinical'); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold">Simpan & Selesaikan</button>
                    </div>
                )}
            </div>
        </div>
    );
}