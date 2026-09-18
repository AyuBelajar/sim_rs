import React, { useEffect, useState } from 'react';

// Dummy list antrean pasien rawat jalan untuk simulasi
const DUMMY_PATIENT_QUEUE = [
    { id: 101, registrationNo: 'RJ-20260917-001', name: 'Budi Santoso', mrNo: 'RM-00192', age: '45 Thn', poly: 'Poli Dalam', doctor: 'dr. Sava, Sp.PD', payer: 'BPJS Kesehatan', status: 'WAITING' },
    { id: 102, registrationNo: 'RJ-20260917-002', name: 'Siti Rahma', mrNo: 'RM-00215', age: '28 Thn', poly: 'Poli Umum', doctor: 'dr. Sava, Sp.PD', payer: 'Umum / Mandiri', status: 'WAITING' },
    { id: 103, registrationNo: 'RJ-20260917-003', name: 'Ahmad Dahlan', mrNo: 'RM-00301', age: '60 Thn', poly: 'Poli Dalam', doctor: 'dr. Sava, Sp.PD', payer: 'BPJS Kesehatan', status: 'IN_SERVICE' }
];

export function MedicalRecordPage() {
    // States Pasien & Encounter
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Navigasi Tab Utama & Sub Tab
    const [mainTab, setMainTab] = useState<'detail' | 'pelayanan' | 'askep' | 'billing' | 'selesai'>('pelayanan');
    const [activeTab, setActiveTab] = useState<'vitals' | 'soap' | 'diagnosis' | 'icd9' | 'prescription' | 'ihs'>('vitals');

    // Form States
    const [vitals, setVitals] = useState({ systolic_bp: '', diastolic_bp: '', temperature_c: '', pulse_rate: '', respiratory_rate: '', weight_kg: '', height_cm: '' });
    const [soap, setSoap] = useState({ subjective: '', objective: '', assessment: '', plan: '' });
    const [diagnosis, setDiagnosis] = useState({ icd10_code: '', diagnosis_name: '', diagnosis_type: 'PRIMARY' });
    const [icd9, setIcd9] = useState({ icd9_code: '', procedure_name: '' });
    const [prescription, setPrescription] = useState({ medicine_name: '', dosage: '', frequency: '3x1', quantity: '10' });

    // Handler Pilih Pasien
    const handleLayaniPasien = (patient: any) => {
        setLoading(true);
        setSelectedPatient(patient);
        setTimeout(() => setLoading(false), 300);
    };

    // Submits
    const handleSaveVitals = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Tanda Vital & Anamnesa berhasil disimpan!');
    };

    const handleSaveSoap = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Catatan SOAP berhasil disimpan!');
    };

    const handleSaveDiagnosis = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Diagnosis ICD-10 berhasil ditambahkan!');
    };

    const handleSavePrescription = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Resep obat berhasil ditambahkan!');
    };

    // -------------------------------------------------------------
    // TAMPILAN 1: LIST PASIEN RAWAT JALAN (Jika belum pilih pasien)
    // -------------------------------------------------------------
    if (!selectedPatient) {
        return (
            <div className="space-y-5 p-2">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Antrean Pelayanan Rawat Jalan</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Pilih pasien untuk memulai pelayanan rekam medis</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                            Lihat Data IHS (Kemenkes)
                        </button>
                        <button className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">
                            i-Care JKN
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="p-3">NO. REGISTRASI</th>
                                <th className="p-3">NO. RM</th>
                                <th className="p-3">NAMA PASIEN</th>
                                <th className="p-3">POLI / DOKTER</th>
                                <th className="p-3">PENJAMIN</th>
                                <th className="p-3">STATUS</th>
                                <th className="p-3 text-center">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {DUMMY_PATIENT_QUEUE.map((patient) => (
                                <tr 
                                    key={patient.id} 
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="p-3 font-medium text-slate-700">{patient.registrationNo}</td>
                                    <td className="p-3 text-slate-600 font-mono">{patient.mrNo}</td>
                                    <td className="p-3 font-semibold text-slate-800">{patient.name} <span className="text-slate-400 font-normal">({patient.age})</span></td>
                                    <td className="p-3 text-slate-600">{patient.poly}<br/><span className="text-slate-400">{patient.doctor}</span></td>
                                    <td className="p-3 text-slate-600">{patient.payer}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${patient.status === 'IN_SERVICE' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button 
                                            onClick={() => handleLayaniPasien(patient)} 
                                            className="px-3 py-1 text-white rounded-md text-xs font-medium transition-colors shadow-sm"
                                            style={{ background: '#326D8C' }}
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

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium text-sm">Memuat data pemeriksaan medis...</div>;

    // -------------------------------------------------------------
    // TAMPILAN 2: FORM PELAYANAN RAWAT JALAN (Saat melayani pasien)
    // -------------------------------------------------------------
    return (
        <div className="space-y-4 p-2">
            {/* Header Sticky Banner Pasien */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedPatient(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-xs font-semibold transition-colors">
                        ← Kembali
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-slate-800">Pemeriksaan Rawat Jalan - {selectedPatient.name}</h1>
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-extrabold">{selectedPatient.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            No. RM: <span className="font-mono text-slate-700">{selectedPatient.mrNo}</span> | Reg: <span className="font-mono text-slate-700">{selectedPatient.registrationNo}</span> | DPJP: {selectedPatient.doctor}
                        </p>
                    </div>
                </div>

                {/* Shortcut Quick Action Modul */}
                <div className="flex gap-1.5">
                    <button className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium">RM Pasien</button>
                    <button className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium">Surat Medis</button>
                    <button className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium">Cetak CPPT</button>
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
                            mainTab === key ? 'bg-slate-100 border-b-2 text-[#326D8C] font-bold' : 'hover:bg-slate-50'
                        }`}
                        style={{ borderColor: mainTab === key ? '#326D8C' : 'transparent' }}
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
                        <div className="flex gap-2 border-b border-slate-100 pb-3 text-xs font-medium overflow-x-auto">
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
                                    className={`px-3 py-1.5 rounded-md transition-colors ${
                                        activeTab === key ? 'text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                    style={{ background: activeTab === key ? '#326D8C' : undefined }}
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
                                        <input type="number" placeholder="120" value={vitals.systolic_bp} onChange={(e) => setVitals({ ...vitals, systolic_bp: e.target.value })} className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 mb-1">Diastolik (mmHg)</label>
                                        <input type="number" placeholder="80" value={vitals.diastolic_bp} onChange={(e) => setVitals({ ...vitals, diastolic_bp: e.target.value })} className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 mb-1">Suhu (°C)</label>
                                        <input type="number" step="0.1" placeholder="36.5" value={vitals.temperature_c} onChange={(e) => setVitals({ ...vitals, temperature_c: e.target.value })} className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 mb-1">Nadi (x/menit)</label>
                                        <input type="number" placeholder="80" value={vitals.pulse_rate} onChange={(e) => setVitals({ ...vitals, pulse_rate: e.target.value })} className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 mb-1">Pernapasan (x/menit)</label>
                                        <input type="number" placeholder="20" value={vitals.respiratory_rate} onChange={(e) => setVitals({ ...vitals, respiratory_rate: e.target.value })} className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]" />
                                    </div>
                                </div>
                                <button type="submit" className="px-4 py-2 text-white rounded-lg text-xs font-semibold shadow-sm" style={{ background: '#326D8C' }}>Simpan Tanda Vital</button>
                            </form>
                        )}

                        {/* Form Sub-Tab: SOAP */}
                        {activeTab === 'soap' && (
                            <form onSubmit={handleSaveSoap} className="space-y-3 max-w-3xl text-xs">
                                <h3 className="text-sm font-bold text-slate-700">Catatan SOAP Dokter</h3>
                                <div>
                                    <label className="block text-slate-600 mb-1 font-semibold">Subjective (S) - Keluhan Utama</label>
                                    <textarea rows={2} value={soap.subjective} onChange={(e) => setSoap({ ...soap, subjective: e.target.value })} className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]" placeholder="Keluhan yang dirasakan pasien..." />
                                </div>
                                <div>
                                    <label className="block text-slate-600 mb-1 font-semibold">Objective (O) - Hasil Pemeriksaan Fisik</label>
                                    <textarea rows={2} value={soap.objective} onChange={(e) => setSoap({ ...soap, objective: e.target.value })} className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]" placeholder="Pemeriksaan fisik / hasil penunjang..." />
                                </div>
                                <div>
                                    <label className="block text-slate-600 mb-1 font-semibold">Assessment (A) - Penilaian / Diagnosis Kerja</label>
                                    <textarea rows={2} value={soap.assessment} onChange={(e) => setSoap({ ...soap, assessment: e.target.value })} className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]" placeholder="Kesimpulan medis dokter..." />
                                </div>
                                <div>
                                    <label className="block text-slate-600 mb-1 font-semibold">Plan (P) - Rencana Terapi / Edukasi</label>
                                    <textarea rows={2} value={soap.plan} onChange={(e) => setSoap({ ...soap, plan: e.target.value })} className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]" placeholder="Rencana pengobatan / tindakan..." />
                                </div>
                                <button type="submit" className="px-4 py-2 text-white rounded-lg text-xs font-semibold shadow-sm" style={{ background: '#326D8C' }}>Simpan SOAP</button>
                            </form>
                        )}

                        {/* Form Sub-Tab: ICD-10 */}
                        {activeTab === 'diagnosis' && (
                            <form onSubmit={handleSaveDiagnosis} className="space-y-3 max-w-2xl text-xs">
                                <h3 className="text-sm font-bold text-slate-700">Input Diagnosis ICD-10</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-slate-600 mb-1">Kode ICD-10</label>
                                        <input value={diagnosis.icd10_code} onChange={(e) => setDiagnosis({ ...diagnosis, icd10_code: e.target.value })} placeholder="J00" className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-slate-600 mb-1">Nama Diagnosis</label>
                                        <input value={diagnosis.diagnosis_name} onChange={(e) => setDiagnosis({ ...diagnosis, diagnosis_name: e.target.value })} placeholder="Acute nasopharyngitis [common cold]" className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]" />
                                    </div>
                                </div>
                                <button type="submit" className="px-4 py-2 text-white rounded-lg text-xs font-semibold shadow-sm" style={{ background: '#326D8C' }}>+ Tambah Diagnosis</button>
                            </form>
                        )}

                        {/* Form Sub-Tab: ICD-9 */}
                        {activeTab === 'icd9' && (
                            <form onSubmit={(e) => { e.preventDefault(); alert('Prosedur ICD-9 disimpan!'); }} className="space-y-3 max-w-2xl text-xs">
                                <h3 className="text-sm font-bold text-slate-700">Input Prosedur ICD-9-CM</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-slate-600 mb-1">Kode ICD-9</label>
                                        <input value={icd9.icd9_code} onChange={(e) => setIcd9({ ...icd9, icd9_code: e.target.value })} placeholder="89.52" className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-slate-600 mb-1">Nama Prosedur</label>
                                        <input value={icd9.procedure_name} onChange={(e) => setIcd9({ ...icd9, procedure_name: e.target.value })} placeholder="Electrocardiogram" className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]" />
                                    </div>
                                </div>
                                <button type="submit" className="px-4 py-2 text-white rounded-lg text-xs font-semibold shadow-sm" style={{ background: '#326D8C' }}>+ Tambah Prosedur</button>
                            </form>
                        )}

                        {/* Form Sub-Tab: Resep */}
                        {activeTab === 'prescription' && (
                            <form onSubmit={handleSavePrescription} className="space-y-3 max-w-2xl text-xs">
                                <h3 className="text-sm font-bold text-slate-700">Peresepan Obat</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    <input placeholder="Nama Obat" value={prescription.medicine_name} onChange={(e) => setPrescription({ ...prescription, medicine_name: e.target.value })} className="col-span-2 border rounded-lg p-2" />
                                    <input placeholder="Aturan Pakai" value={prescription.frequency} onChange={(e) => setPrescription({ ...prescription, frequency: e.target.value })} className="border rounded-lg p-2" />
                                    <input placeholder="Jumlah" value={prescription.quantity} onChange={(e) => setPrescription({ ...prescription, quantity: e.target.value })} className="border rounded-lg p-2 text-center" />
                                </div>
                                <button type="submit" className="px-4 py-2 text-white rounded-lg text-xs font-semibold shadow-sm" style={{ background: '#326D8C' }}>+ Tambah Resep</button>
                            </form>
                        )}

                        {/* Form Sub-Tab: IHS Integrasi */}
                        {activeTab === 'ihs' && (
                            <div className="space-y-3 max-w-lg text-xs">
                                <h3 className="text-sm font-bold text-slate-700">Integrasi SatuSehat / IHS (Kemenkes)</h3>
                                <p className="text-slate-500">Kirimkan data pendaftaran, ICD-10, ICD-9, dan diet pasien ke platform IHS Kemenkes.</p>
                                <button onClick={() => alert('Data berhasil dikirim ke IHS Kemenkes!')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm">Kirim Data IHS</button>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: DETAIL PASIEN */}
                {mainTab === 'detail' && (
                    <div className="text-xs space-y-2 text-slate-600">
                        <h3 className="font-bold text-sm text-slate-800">Informasi Detail Pasien</h3>
                        <p>Status Peserta: <b>Prolanis & PRB (BPJS PCare)</b></p>
                        <p>Penjamin: <b>{selectedPatient.payer}</b></p>
                        <p>Catatan Booking: Pasien melakukan reservasi via Mobile JKN.</p>
                    </div>
                )}

                {/* TAB 3: ASKEP */}
                {mainTab === 'askep' && (
                    <div className="text-xs space-y-2 text-slate-600">
                        <h3 className="font-bold text-sm text-slate-800">Asuhan Keperawatan (Askep)</h3>
                        <p className="text-slate-500">Form pengisian triase perawat dan pengkajian awal keperawatan rawat jalan.</p>
                    </div>
                )}

                {/* TAB 4: BILLING */}
                {mainTab === 'billing' && (
                    <div className="text-xs space-y-2 text-slate-600">
                        <h3 className="font-bold text-sm text-slate-800">Billing & Tindakan</h3>
                        <p className="text-slate-500">Daftar tindakan medis dan tarif pelayanan pasien rawat jalan.</p>
                    </div>
                )}

                {/* TAB 5: SELESAI PELAYANAN */}
                {mainTab === 'selesai' && (
                    <div className="space-y-3 max-w-md text-xs">
                        <h3 className="font-bold text-sm text-slate-800">Form Selesai Pelayanan</h3>
                        <div>
                            <label className="block mb-1 font-medium text-slate-700">Selesai Pelayanan?</label>
                            <select className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]"><option>Ya</option><option>Tidak</option></select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-slate-700">Cara Keluar</label>
                            <select className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#326D8C]"><option>Pulang / Berobat Jalan</option><option>Kontrol Ulang</option><option>Rujuk</option></select>
                        </div>
                        <button onClick={() => { alert('Pelayanan Selesai!'); setSelectedPatient(null); }} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm">Simpan & Selesaikan</button>
                    </div>
                )}
            </div>
        </div>
    );
}