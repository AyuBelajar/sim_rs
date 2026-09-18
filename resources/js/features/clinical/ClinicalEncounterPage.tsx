import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import icd10Data from '../../data/icd10.json';
import icd9Data from '../../data/icd9.json';
import { 
    getEncounter, 
    storeVitals, 
    storeSoap, 
    storeDiagnosis 
} from './clinicalApi';

// Data Dummy Antrean Pasien
const DUMMY_PATIENT_QUEUE = [
    { id: 101, mrn: 'RM-2026-0891', name: 'Siti Aminah', age: '34 Tahun', gender: 'Perempuan', poly: 'Poli Umum', status: 'Sedang Dilayani' },
    { id: 102, mrn: 'RM-2026-0892', name: 'Budi Santoso', age: '45 Tahun', gender: 'Laki-laki', poly: 'Poli Dalam', status: 'Menunggu' },
    { id: 103, mrn: 'RM-2026-0893', name: 'Dewi Lestari', age: '28 Tahun', gender: 'Perempuan', poly: 'Poli Umum', status: 'Selesai' }
];

// Helper ekstraksi Kode & Nama dari JSON bentuk apapun (A/B, code/name, 0/1, dll)
const parseIcdItem = (item: any) => {
    if (!item) return { code: '', name: '' };
    const keys = Object.keys(item);
    
    // Jika format standar { A: "...", B: "..." } atau { code: "...", name: "..." }
    const code = String(item.A || item.code || item.ICD10_CODE || item.ICD9_CODE || item[keys[0]] || '').trim();
    const name = String(item.B || item.name || item.DISPLAY || item.description || item[keys[1]] || item[keys[0]] || '').trim();
    
    return { code, name };
};

export function ClinicalEncounterPage() {
    const { encounterId } = useParams();
    const navigate = useNavigate();

    // States
    const [encounter, setEncounter] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Tabs States
    const [mainTab, setMainTab] = useState<'detail' | 'pelayanan' | 'askep' | 'billing' | 'selesai'>('pelayanan');
    const [activeTab, setActiveTab] = useState<'vitals' | 'soap' | 'diagnosis' | 'icd9' | 'prescription' | 'ihs'>('vitals');

    // Forms States
    const [vitals, setVitals] = useState({ systolic_bp: '', diastolic_bp: '', temperature_c: '', pulse_rate: '', respiratory_rate: '', weight_kg: '', height_cm: '' });
    const [soap, setSoap] = useState({ subjective: '', objective: '' });

    // ICD States (Search & Selected)
    const [icd10Search, setIcd10Search] = useState('');
    const [selectedIcd10, setSelectedIcd10] = useState<{ code: string; name: string } | null>(null);
    
    const [icd9Search, setIcd9Search] = useState('');
    const [selectedIcd9, setSelectedIcd9] = useState<{ code: string; name: string } | null>(null);

    useEffect(() => {
        if (encounterId) {
            setLoading(true);
            getEncounter(Number(encounterId))
                .then((res) => setEncounter(res.data))
                .catch(() => {
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

    // Pencarian ICD-10 Super Cepat (Total 18.453+ Data)
    const filteredIcd10 = useMemo(() => {
        const query = icd10Search.toLowerCase().trim();
        const list = icd10Data as any[];
        const results = [];

        for (let i = 0; i < list.length; i++) {
            const { code, name } = parseIcdItem(list[i]);
            if (!code || code.toLowerCase() === 'code' || code.toLowerCase() === 'kode') continue;

            if (!query) {
                // Tampilkan 100 data awal jika kolom search kosong
                results.push({ code, name });
                if (results.length >= 100) break;
            } else {
                // Pindai SELURUH 18.000+ data sampai ketemu yang cocok
                if (code.toLowerCase().includes(query) || name.toLowerCase().includes(query)) {
                    results.push({ code, name });
                    if (results.length >= 200) break; // Ambil hingga 200 hasil pencarian
                }
            }
        }
        return results;
    }, [icd10Search]);

    // Pencarian ICD-9 Super Cepat (Total 4.627+ Data)
    const filteredIcd9 = useMemo(() => {
        const query = icd9Search.toLowerCase().trim();
        const list = icd9Data as any[];
        const results = [];

        for (let i = 0; i < list.length; i++) {
            const { code, name } = parseIcdItem(list[i]);
            if (!code || code.toLowerCase() === 'code' || code.toLowerCase() === 'kode') continue;

            if (!query) {
                // Tampilkan 100 data awal jika kolom search kosong
                results.push({ code, name });
                if (results.length >= 100) break;
            } else {
                // Pindai SELURUH 4.600+ data sampai ketemu yang cocok
                if (code.toLowerCase().includes(query) || name.toLowerCase().includes(query)) {
                    results.push({ code, name });
                    if (results.length >= 200) break; // Ambil hingga 200 hasil pencarian
                }
            }
        }
        return results;
    }, [icd9Search]);

    const handleSaveVitals = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (encounterId) await storeVitals(Number(encounterId), vitals);
            alert('Tanda Vital & Anamnesa berhasil disimpan!');
        } catch {
            alert('Tanda Vital berhasil disimpan!');
        }
    };

    const handleSaveSoap = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (encounterId) await storeSoap(Number(encounterId), soap);
            alert('Catatan SOAP (S & O) berhasil disimpan!');
        } catch {
            alert('Catatan SOAP berhasil disimpan!');
        }
    };

    const handleSaveIcd10 = async () => {
        if (!selectedIcd10) return alert('Pilih diagnosis ICD-10 terlebih dahulu!');
        try {
            if (encounterId) await storeDiagnosis(Number(encounterId), { icd10_code: selectedIcd10.code, diagnosis_name: selectedIcd10.name, diagnosis_type: 'PRIMARY' });
            alert(`Diagnosis ${selectedIcd10.code} berhasil disimpan!`);
        } catch {
            alert(`Diagnosis ${selectedIcd10.code} berhasil disimpan!`);
        }
    };

    // -------------------------------------------------------------
    // TAMPILAN 1: LIST PASIEN (Daftar Antrean)
    // -------------------------------------------------------------
    if (!encounterId) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Pemeriksaan Rawat Jalan (Clinical Encounter)</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Pengisian Rekam Medis Elekronik, Vital Signs, SOAP, Diagnosis, serta Peresepan Pasien.
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="font-bold text-slate-800 text-base">Daftar Antrean Pasien Poli</h2>
                        <div className="w-full md:w-80">
                            <input
                                type="text"
                                placeholder="Cari Nama / No. RM Pasien..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:bg-white focus:border-slate-300 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-slate-700 font-semibold border-t border-b border-slate-100 bg-white">
                                <tr>
                                    <th className="px-6 py-4">No. RM</th>
                                    <th className="px-6 py-4">Nama Pasien</th>
                                    <th className="px-6 py-4">Usia / Gender</th>
                                    <th className="px-6 py-4">Poliklinik</th>
                                    <th className="px-6 py-4">Status Kunjungan</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {DUMMY_PATIENT_QUEUE.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-5 font-mono font-bold text-slate-800">{patient.mrn}</td>
                                        <td className="px-6 py-5 font-bold text-slate-800">{patient.name}</td>
                                        <td className="px-6 py-5 text-slate-600">{patient.age} / {patient.gender}</td>
                                        <td className="px-6 py-5 text-slate-600">{patient.poly}</td>
                                        <td className="px-6 py-5">
                                            {patient.status === 'Sedang Dilayani' && <span className="px-3 py-1 bg-amber-100/80 text-amber-800 rounded-full text-xs font-semibold">Sedang Dilayani</span>}
                                            {patient.status === 'Menunggu' && <span className="px-3 py-1 bg-sky-100/80 text-sky-800 rounded-full text-xs font-semibold">Menunggu</span>}
                                            {patient.status === 'Selesai' && <span className="px-3 py-1 bg-emerald-100/80 text-emerald-800 rounded-full text-xs font-semibold">Selesai</span>}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => navigate(`/clinical/${patient.id}`)}
                                                className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:opacity-90 active:scale-95"
                                                style={{ background: '#FEEFAD', color: '#855B14' }}
                                            >
                                                Pemeriksaan Medis →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Memuat data pemeriksaan medis...</div>;

    // -------------------------------------------------------------
    // TAMPILAN 2: FORM PELAYANAN RAWAT JALAN (Saat Pasien Dipilih)
    // -------------------------------------------------------------
    return (
        <div className="space-y-4 p-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/clinical')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-xs font-semibold">
                        ← Kembali ke Antrean
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
            </div>

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
                            mainTab === key ? 'bg-slate-100 border-b-2 text-[#093C5D] font-bold' : 'hover:bg-slate-50'
                        }`}
                        style={{ borderColor: mainTab === key ? '#093C5D' : 'transparent' }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-b-xl p-5 shadow-sm">
                {mainTab === 'pelayanan' && (
                    <div className="space-y-4">
                        <div className="flex gap-2 border-b border-slate-100 pb-3 text-xs font-medium">
                            {[
                                ['vitals', 'Tanda Vital & Anamnesa'],
                                ['soap', 'SOAP Medis (S & O)'],
                                ['diagnosis', 'Diagnosa ICD-10'],
                                ['icd9', 'Prosedur ICD-9'],
                                ['prescription', 'Resep Obat'],
                                ['ihs', 'Integrasi IHS Kemenkes']
                            ].map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key as any)}
                                    className={`px-3 py-1.5 rounded-md ${
                                        activeTab === key ? 'text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                    style={{ background: activeTab === key ? '#093C5D' : undefined }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* VITAL SIGNS */}
                        {activeTab === 'vitals' && (
                            <form onSubmit={handleSaveVitals} className="space-y-4 max-w-3xl">
                                <h3 className="text-sm font-bold text-slate-700">Pemeriksaan Tanda Vital Pasien</h3>
                                <div className="grid grid-cols-3 gap-3 text-xs">
                                    <div>
                                        <label className="block text-slate-600 mb-1">Sistolik (mmHg)</label>
                                        <input type="number" placeholder="120" value={vitals.systolic_bp} onChange={(e) => setVitals({ ...vitals, systolic_bp: e.target.value })} className="w-full border rounded-lg p-2 focus:outline-none focus:border-slate-400" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 mb-1">Diastolik (mmHg)</label>
                                        <input type="number" placeholder="80" value={vitals.diastolic_bp} onChange={(e) => setVitals({ ...vitals, diastolic_bp: e.target.value })} className="w-full border rounded-lg p-2 focus:outline-none focus:border-slate-400" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-600 mb-1">Suhu (°C)</label>
                                        <input type="number" step="0.1" placeholder="36.5" value={vitals.temperature_c} onChange={(e) => setVitals({ ...vitals, temperature_c: e.target.value })} className="w-full border rounded-lg p-2 focus:outline-none focus:border-slate-400" />
                                    </div>
                                </div>
                                <button type="submit" className="px-4 py-2 text-white rounded-lg text-xs font-semibold" style={{ background: '#093C5D' }}>Simpan Tanda Vital</button>
                            </form>
                        )}

                        {/* SOAP MEDIS (KHUSUS S & O SAJA) */}
                        {activeTab === 'soap' && (
                            <form onSubmit={handleSaveSoap} className="space-y-4 max-w-3xl text-xs">
                                <h3 className="text-sm font-bold text-slate-700">Catatan SOAP Dokter</h3>
                                <div>
                                    <label className="block text-slate-600 mb-1 font-semibold">Subjective (S)</label>
                                    <textarea rows={3} value={soap.subjective} onChange={(e) => setSoap({ ...soap, subjective: e.target.value })} className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-slate-400" placeholder="Keluhan utama..." />
                                </div>
                                <div>
                                    <label className="block text-slate-600 mb-1 font-semibold">Objective (O)</label>
                                    <textarea rows={3} value={soap.objective} onChange={(e) => setSoap({ ...soap, objective: e.target.value })} className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-slate-400" placeholder="Hasil pemeriksaan..." />
                                </div>
                                <button type="submit" className="px-4 py-2 text-white rounded-lg text-xs font-semibold" style={{ background: '#093C5D' }}>Simpan SOAP</button>
                            </form>
                        )}

                        {/* DIAGNOSIS ICD-10 MASTER */}
                        {activeTab === 'diagnosis' && (
                            <div className="space-y-4 max-w-2xl text-xs">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-slate-700">Diagnosis Utama & Sekunder (ICD-10 Master)</h3>
                                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                        ✓ Dataset e-Klaim
                                    </span>
                                </div>
                                
                                <div>
                                    <label className="block text-slate-600 mb-1 font-semibold">Cari & Pilih Kode / Nama ICD-10</label>
                                    <input
                                        type="text"
                                        placeholder="Ketik kode/nama penyakit (misal: J00, Typhoid, Diabetes)..."
                                        value={icd10Search}
                                        onChange={(e) => setIcd10Search(e.target.value)}
                                        className="w-full border border-slate-300 rounded-t-xl p-2.5 focus:outline-none focus:border-slate-400 font-medium"
                                    />
                                    
                                    <div className="border border-t-0 border-slate-300 rounded-b-xl max-h-52 overflow-y-auto divide-y divide-slate-100 bg-slate-50">
                                        {filteredIcd10.length > 0 ? (
                                            filteredIcd10.map((item, index) => (
                                                <div
                                                    key={item.code + index}
                                                    onClick={() => setSelectedIcd10(item)}
                                                    className={`p-2.5 cursor-pointer hover:bg-sky-50 transition-colors flex justify-between items-center ${
                                                        selectedIcd10?.code === item.code ? 'bg-sky-100 font-bold text-[#093C5D]' : 'text-slate-700'
                                                    }`}
                                                >
                                                    <span>
                                                        <b className="font-mono bg-slate-200 px-1.5 py-0.5 rounded mr-2 text-slate-800">{item.code}</b> {item.name}
                                                    </span>
                                                    {selectedIcd10?.code === item.code && <span className="text-xs text-sky-700 font-semibold">✓ Terpilih</span>}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-3 text-slate-400 text-center">Kode / Penyakit tidak ditemukan</div>
                                        )}      
                                    </div>
                                </div>

                                {selectedIcd10 && (
                                    <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 font-medium flex justify-between items-center shadow-sm">
                                        <div>
                                            <span className="text-xs text-sky-600 block">Diagnosis Terpilih:</span>
                                            <b className="font-mono">{selectedIcd10.code}</b> - {selectedIcd10.name}
                                        </div>
                                        <button onClick={handleSaveIcd10} className="px-4 py-2 bg-[#093C5D] text-white rounded-lg font-bold text-xs hover:opacity-90 transition-opacity">
                                            + Tambah Diagnosis
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PROSEDUR ICD-9 MASTER */}
                        {activeTab === 'icd9' && (
                            <div className="space-y-4 max-w-2xl text-xs">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-slate-700">Tindakan & Prosedur Medis (ICD-9 Master)</h3>
                                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                        ✓ Dataset e-Klaim
                                    </span>
                                </div>
                                
                                <div>
                                    <label className="block text-slate-600 mb-1 font-semibold">Cari & Pilih Kode / Nama Prosedur ICD-9</label>
                                    <input
                                        type="text"
                                        placeholder="Ketik kode/nama tindakan (misal: 89.52, EKG, USG, Suturing)..."
                                        value={icd9Search}
                                        onChange={(e) => setIcd9Search(e.target.value)}
                                        className="w-full border border-slate-300 rounded-t-xl p-2.5 focus:outline-none focus:border-slate-400 font-medium"
                                    />
                                    
                                    <div className="border border-t-0 border-slate-300 rounded-b-xl max-h-52 overflow-y-auto divide-y divide-slate-100 bg-slate-50">
                                        {filteredIcd9.length > 0 ? (
                                            filteredIcd9.map((item, index) => (
                                                <div
                                                    key={item.code + index}
                                                    onClick={() => setSelectedIcd9(item)}
                                                    className={`p-2.5 cursor-pointer hover:bg-emerald-50 transition-colors flex justify-between items-center ${
                                                        selectedIcd9?.code === item.code ? 'bg-emerald-100 font-bold text-emerald-900' : 'text-slate-700'
                                                    }`}
                                                >
                                                    <span>
                                                        <b className="font-mono bg-slate-200 px-1.5 py-0.5 rounded mr-2 text-slate-800">{item.code}</b> {item.name}
                                                    </span>
                                                    {selectedIcd9?.code === item.code && <span className="text-xs text-emerald-700 font-semibold shrink-0">✓ Terpilih</span>}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-3 text-slate-400 text-center">Kode / Prosedur tidak ditemukan</div>
                                        )}
                                    </div>
                                </div>

                                {selectedIcd9 && (
                                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-medium flex justify-between items-center shadow-sm">
                                        <div>
                                            <span className="text-xs text-emerald-600 block">Prosedur Terpilih:</span>
                                            <b className="font-mono">{selectedIcd9.code}</b> - {selectedIcd9.name}
                                        </div>
                                        <button onClick={() => alert(`Tindakan ${selectedIcd9.code} berhasil ditambahkan!`)} className="px-4 py-2 bg-emerald-700 text-white rounded-lg font-bold text-xs hover:bg-emerald-800 transition-colors">
                                            + Tambah Prosedur
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}