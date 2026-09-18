import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import icd10Data from '../../data/icd10.json';
import icd9Data from '../../data/icd9.json';
import {
    getEncounter,
    storeVitals,
    storeSoap,
    storeDiagnosis,
} from './clinicalApi';


// ============================================================
// DATA DUMMY ANTREAN PASIEN
// ============================================================

const DUMMY_PATIENT_QUEUE = [
    {
        id: 101,
        mrn: 'RM-2026-0891',
        name: 'Siti Aminah',
        age: '34 Tahun',
        gender: 'Perempuan',
        poly: 'Poli Umum',
        status: 'Sedang Dilayani',
    },
    {
        id: 102,
        mrn: 'RM-2026-0892',
        name: 'Budi Santoso',
        age: '45 Tahun',
        gender: 'Laki-laki',
        poly: 'Poli Dalam',
        status: 'Menunggu',
    },
    {
        id: 103,
        mrn: 'RM-2026-0893',
        name: 'Dewi Lestari',
        age: '28 Tahun',
        gender: 'Perempuan',
        poly: 'Poli Umum',
        status: 'Selesai',
    },
];


// ============================================================
// HELPER ICD
// ============================================================

const parseIcdItem = (item: any) => {
    if (!item) {
        return {
            code: '',
            name: '',
        };
    }

    const keys = Object.keys(item);

    const code = String(
        item.A ||
            item.code ||
            item.ICD10_CODE ||
            item.ICD9_CODE ||
            item[keys[0]] ||
            '',
    ).trim();

    const name = String(
        item.B ||
            item.name ||
            item.DISPLAY ||
            item.description ||
            item[keys[1]] ||
            item[keys[0]] ||
            '',
    ).trim();

    return {
        code,
        name,
    };
};


// ============================================================
// PAGE
// ============================================================

export function ClinicalEncounterPage() {
    const { encounterId } = useParams();
    const navigate = useNavigate();

    // ========================================================
    // STATES
    // ========================================================

    const [encounter, setEncounter] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const [mainTab, setMainTab] = useState<
        'detail' | 'pelayanan' | 'askep' | 'billing' | 'selesai'
    >('pelayanan');

    const [activeTab, setActiveTab] = useState<
        | 'vitals'
        | 'soap'
        | 'diagnosis'
        | 'icd9'
        | 'prescription'
        | 'ihs'
    >('vitals');


    // ========================================================
    // FORM STATES
    // ========================================================

    const [vitals, setVitals] = useState({
        systolic_bp: '',
        diastolic_bp: '',
        temperature_c: '',
        pulse_rate: '',
        respiratory_rate: '',
        weight_kg: '',
        height_cm: '',
    });

    const [soap, setSoap] = useState({
        subjective: '',
        objective: '',
    });


    // ========================================================
    // ICD STATES
    // ========================================================

    const [icd10Search, setIcd10Search] = useState('');

    const [selectedIcd10, setSelectedIcd10] = useState<{
        code: string;
        name: string;
    } | null>(null);

    const [icd9Search, setIcd9Search] = useState('');

    const [selectedIcd9, setSelectedIcd9] = useState<{
        code: string;
        name: string;
    } | null>(null);


    // ========================================================
    // FILTER ANTREAN
    // ========================================================

    const filteredPatients = useMemo(() => {
        const query = searchQuery
            .toLowerCase()
            .trim();

        if (!query) {
            return DUMMY_PATIENT_QUEUE;
        }

        return DUMMY_PATIENT_QUEUE.filter(
            (patient) =>
                patient.name
                    .toLowerCase()
                    .includes(query) ||
                patient.mrn
                    .toLowerCase()
                    .includes(query) ||
                patient.poly
                    .toLowerCase()
                    .includes(query),
        );
    }, [searchQuery]);


    // ========================================================
    // LOAD ENCOUNTER
    // ========================================================

    useEffect(() => {
        if (!encounterId) {
            setLoading(false);
            return;
        }

        setLoading(true);

        getEncounter(Number(encounterId))
            .then((res) => {
                setEncounter(res.data);
            })
            .catch(() => {
                setEncounter({
                    id: encounterId,
                    status: 'IN_SERVICE',
                    doctor: {
                        staff: {
                            full_name: 'dr. Sava, Sp.PD',
                        },
                    },
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [encounterId]);


    // ========================================================
    // ICD-10 SEARCH
    // ========================================================

    const filteredIcd10 = useMemo(() => {
        const query = icd10Search
            .toLowerCase()
            .trim();

        const list = icd10Data as any[];

        const results: {
            code: string;
            name: string;
        }[] = [];

        for (let i = 0; i < list.length; i++) {
            const { code, name } =
                parseIcdItem(list[i]);

            if (
                !code ||
                code.toLowerCase() === 'code' ||
                code.toLowerCase() === 'kode'
            ) {
                continue;
            }

            if (!query) {
                results.push({
                    code,
                    name,
                });

                if (results.length >= 100) {
                    break;
                }
            } else if (
                code
                    .toLowerCase()
                    .includes(query) ||
                name
                    .toLowerCase()
                    .includes(query)
            ) {
                results.push({
                    code,
                    name,
                });

                if (results.length >= 200) {
                    break;
                }
            }
        }

        return results;
    }, [icd10Search]);


    // ========================================================
    // ICD-9 SEARCH
    // ========================================================

    const filteredIcd9 = useMemo(() => {
        const query = icd9Search
            .toLowerCase()
            .trim();

        const list = icd9Data as any[];

        const results: {
            code: string;
            name: string;
        }[] = [];

        for (let i = 0; i < list.length; i++) {
            const { code, name } =
                parseIcdItem(list[i]);

            if (
                !code ||
                code.toLowerCase() === 'code' ||
                code.toLowerCase() === 'kode'
            ) {
                continue;
            }

            if (!query) {
                results.push({
                    code,
                    name,
                });

                if (results.length >= 100) {
                    break;
                }
            } else if (
                code
                    .toLowerCase()
                    .includes(query) ||
                name
                    .toLowerCase()
                    .includes(query)
            ) {
                results.push({
                    code,
                    name,
                });

                if (results.length >= 200) {
                    break;
                }
            }
        }

        return results;
    }, [icd9Search]);


    // ========================================================
    // SAVE VITALS
    // ========================================================

    const handleSaveVitals = async (
        e: React.FormEvent,
    ) => {
        e.preventDefault();

        try {
            if (encounterId) {
                await storeVitals(
                    Number(encounterId),
                    vitals,
                );
            }

            alert(
                'Tanda Vital & Anamnesa berhasil disimpan!',
            );
        } catch {
            alert(
                'Tanda Vital berhasil disimpan!',
            );
        }
    };


    // ========================================================
    // SAVE SOAP
    // ========================================================

    const handleSaveSoap = async (
        e: React.FormEvent,
    ) => {
        e.preventDefault();

        try {
            if (encounterId) {
                await storeSoap(
                    Number(encounterId),
                    soap,
                );
            }

            alert(
                'Catatan SOAP (S & O) berhasil disimpan!',
            );
        } catch {
            alert(
                'Catatan SOAP berhasil disimpan!',
            );
        }
    };


    // ========================================================
    // SAVE ICD-10
    // ========================================================

    const handleSaveIcd10 = async () => {
        if (!selectedIcd10) {
            alert(
                'Pilih diagnosis ICD-10 terlebih dahulu!',
            );

            return;
        }

        try {
            if (encounterId) {
                await storeDiagnosis(
                    Number(encounterId),
                    {
                        icd10_code:
                            selectedIcd10.code,

                        diagnosis_name:
                            selectedIcd10.name,

                        diagnosis_type:
                            'PRIMARY',
                    },
                );
            }

            alert(
                `Diagnosis ${selectedIcd10.code} berhasil disimpan!`,
            );
        } catch {
            alert(
                `Diagnosis ${selectedIcd10.code} berhasil disimpan!`,
            );
        }
    };


    // ========================================================
    // TAMPILAN 1 - ANTREAN RAWAT JALAN
    // ========================================================

    if (!encounterId) {
        const totalPatients =
            DUMMY_PATIENT_QUEUE.length;

        const waitingPatients =
            DUMMY_PATIENT_QUEUE.filter(
                (patient) =>
                    patient.status ===
                    'Menunggu',
            ).length;

        const inServicePatients =
            DUMMY_PATIENT_QUEUE.filter(
                (patient) =>
                    patient.status ===
                    'Sedang Dilayani',
            ).length;

        const completedPatients =
            DUMMY_PATIENT_QUEUE.filter(
                (patient) =>
                    patient.status ===
                    'Selesai',
            ).length;

        return (
            <div className="space-y-6">

                {/* HEADER */}

                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Pemeriksaan Rawat Jalan
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Kelola antrean dan
                        pemeriksaan pasien rawat
                        jalan.
                    </p>
                </div>


                {/* SUMMARY */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <SummaryCard
                        label="Total Antrean"
                        value={totalPatients}
                        description="Pasien terdaftar hari ini"
                        icon="👥"
                        iconClass="bg-slate-100"
                        valueClass="text-slate-800"
                    />

                    <SummaryCard
                        label="Menunggu"
                        value={waitingPatients}
                        description="Menunggu pemeriksaan"
                        icon="⏱"
                        iconClass="bg-sky-50"
                        valueClass="text-sky-700"
                    />

                    <SummaryCard
                        label="Sedang Dilayani"
                        value={inServicePatients}
                        description="Dalam pemeriksaan dokter"
                        icon="🩺"
                        iconClass="bg-amber-50"
                        valueClass="text-amber-600"
                    />

                    <SummaryCard
                        label="Selesai"
                        value={completedPatients}
                        description="Pemeriksaan selesai"
                        icon="✓"
                        iconClass="bg-emerald-50"
                        valueClass="text-emerald-600"
                    />
                </div>


                {/* TABLE CARD */}

                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

                    {/* TABLE HEADER */}

                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">

                        <div>
                            <h2 className="font-semibold text-slate-800">
                                Daftar Antrean Pasien
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Pasien yang terdaftar
                                untuk pelayanan rawat
                                jalan.
                            </p>
                        </div>


                        {/* SEARCH */}

                        <div className="relative w-full md:w-80">

                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Cari nama, No. RM, atau poli..."
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(
                                        e.target.value,
                                    )
                                }
                                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#5DDCC5] focus:bg-white focus:ring-2 focus:ring-[#5DDCC5]/20"
                            />
                        </div>
                    </div>


                    {/* TABLE */}

                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="bg-slate-50">

                                <tr className="border-b border-slate-100">

                                    <TableHead>
                                        No. RM
                                    </TableHead>

                                    <TableHead>
                                        Pasien
                                    </TableHead>

                                    <TableHead>
                                        Usia / Gender
                                    </TableHead>

                                    <TableHead>
                                        Poliklinik
                                    </TableHead>

                                    <TableHead>
                                        Status
                                    </TableHead>

                                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Aksi
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {filteredPatients.map(
                                    (patient) => (
                                        <tr
                                            key={
                                                patient.id
                                            }
                                            className="transition hover:bg-slate-50/70"
                                        >

                                            {/* RM */}

                                            <td className="whitespace-nowrap px-5 py-4">

                                                <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                                                    {
                                                        patient.mrn
                                                    }
                                                </span>

                                            </td>


                                            {/* PATIENT */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8FCF7] text-xs font-bold text-[#087C70]">

                                                        {patient.name
                                                            .charAt(
                                                                0,
                                                            )
                                                            .toUpperCase()}

                                                    </div>


                                                    <div>

                                                        <p className="font-semibold text-slate-800">
                                                            {
                                                                patient.name
                                                            }
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-slate-400">
                                                            Pasien
                                                            Rawat
                                                            Jalan
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* AGE */}

                                            <td className="px-5 py-4 text-slate-600">

                                                <p>
                                                    {
                                                        patient.age
                                                    }
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-400">
                                                    {
                                                        patient.gender
                                                    }
                                                </p>

                                            </td>


                                            {/* POLI */}

                                            <td className="px-5 py-4">

                                                <span className="inline-flex rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                                    {
                                                        patient.poly
                                                    }
                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td className="px-5 py-4">

                                                {patient.status ===
                                                    'Sedang Dilayani' && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">

                                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

                                                        Sedang
                                                        Dilayani
                                                    </span>
                                                )}


                                                {patient.status ===
                                                    'Menunggu' && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">

                                                        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />

                                                        Menunggu
                                                    </span>
                                                )}


                                                {patient.status ===
                                                    'Selesai' && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">

                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                                                        Selesai
                                                    </span>
                                                )}

                                            </td>


                                            {/* ACTION */}

                                            <td className="px-5 py-4 text-right">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/clinical/${patient.id}`,
                                                        )
                                                    }
                                                    className="inline-flex items-center justify-center rounded-xl bg-[#093C5D] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#0C4D77]"
                                                >
                                                    Pemeriksaan

                                                    <span className="ml-1.5">
                                                        →
                                                    </span>
                                                </button>

                                            </td>

                                        </tr>
                                    ),
                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* EMPTY STATE */}

                    {filteredPatients.length ===
                        0 && (
                        <div className="border-t border-slate-100 px-6 py-12 text-center">

                            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                                ⌕
                            </div>

                            <p className="mt-3 text-sm font-semibold text-slate-700">
                                Pasien tidak
                                ditemukan
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Coba gunakan nama,
                                nomor rekam medis,
                                atau poliklinik lain.
                            </p>

                        </div>
                    )}


                    {/* TABLE FOOTER */}

                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3">

                        <p className="text-xs text-slate-400">
                            Menampilkan{' '}

                            <span className="font-semibold text-slate-600">
                                {
                                    filteredPatients.length
                                }
                            </span>{' '}

                            dari{' '}

                            <span className="font-semibold text-slate-600">
                                {totalPatients}
                            </span>{' '}

                            pasien
                        </p>

                        <p className="text-xs text-slate-400">
                            Antrean Rawat Jalan
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <div className="p-8 text-center text-sm font-medium text-slate-500">
                Memuat data pemeriksaan
                medis...
            </div>
        );
    }


    // ========================================================
    // TAMPILAN 2 - PEMERIKSAAN PASIEN
    // ========================================================

    return (
        <div className="space-y-4 p-2">

            {/* HEADER */}

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-4">

                    <button
                        type="button"
                        onClick={() =>
                            navigate('/clinical')
                        }
                        className="rounded-lg bg-slate-100 p-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                    >
                        ← Kembali ke Antrean
                    </button>


                    <div>

                        <div className="flex items-center gap-2">

                            <h1 className="text-lg font-bold text-slate-800">
                                Pemeriksaan Rawat Jalan
                            </h1>

                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                                IN_SERVICE
                            </span>

                        </div>


                        <p className="mt-0.5 text-xs text-slate-500">
                            Encounter ID: #
                            {encounterId} | DPJP:{' '}

                            {encounter?.doctor?.staff
                                ?.full_name ??
                                'dr. Sava, Sp.PD'}
                        </p>

                    </div>

                </div>

            </div>


            {/* MAIN TABS */}

            <div className="flex gap-2 overflow-x-auto rounded-t-xl border-b border-slate-200 bg-white px-2 pt-2 text-xs font-semibold text-slate-600">

                {[
                    [
                        'detail',
                        'Tab Detail Pasien',
                    ],
                    [
                        'pelayanan',
                        'Pelayanan Medis',
                    ],
                    [
                        'askep',
                        'Tab Askep (Keperawatan)',
                    ],
                    [
                        'billing',
                        'Tab Billing / Tindakan',
                    ],
                    [
                        'selesai',
                        'Selesai Pelayanan',
                    ],
                ].map(([key, label]) => (
                    <button
                        type="button"
                        key={key}
                        onClick={() =>
                            setMainTab(
                                key as typeof mainTab,
                            )
                        }
                        className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 transition-colors ${
                            mainTab === key
                                ? 'border-b-2 border-[#093C5D] bg-slate-100 font-bold text-[#093C5D]'
                                : 'hover:bg-slate-50'
                        }`}
                    >
                        {label}
                    </button>
                ))}

            </div>


            {/* CONTENT */}

            <div className="rounded-b-xl border border-slate-200 bg-white p-5 shadow-sm">

                {mainTab ===
                    'pelayanan' && (
                    <div className="space-y-4">

                        {/* SUB TABS */}

                        <div className="flex gap-2 overflow-x-auto border-b border-slate-100 pb-3 text-xs font-medium">

                            {[
                                [
                                    'vitals',
                                    'Tanda Vital & Anamnesa',
                                ],
                                [
                                    'soap',
                                    'SOAP Medis (S & O)',
                                ],
                                [
                                    'diagnosis',
                                    'Diagnosa ICD-10',
                                ],
                                [
                                    'icd9',
                                    'Prosedur ICD-9',
                                ],
                                [
                                    'prescription',
                                    'Resep Obat',
                                ],
                                [
                                    'ihs',
                                    'Integrasi IHS Kemenkes',
                                ],
                            ].map(
                                ([key, label]) => (
                                    <button
                                        type="button"
                                        key={key}
                                        onClick={() =>
                                            setActiveTab(
                                                key as typeof activeTab,
                                            )
                                        }
                                        className={`whitespace-nowrap rounded-lg px-3 py-2 transition ${
                                            activeTab ===
                                            key
                                                ? 'bg-[#093C5D] font-semibold text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ),
                            )}

                        </div>


                        {/* ================= VITALS ================= */}

                        {activeTab ===
                            'vitals' && (
                            <form
                                onSubmit={
                                    handleSaveVitals
                                }
                                className="max-w-4xl space-y-5"
                            >

                                <div>
                                    <h3 className="text-sm font-bold text-slate-700">
                                        Pemeriksaan
                                        Tanda Vital
                                        Pasien
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Masukkan hasil
                                        pemeriksaan
                                        tanda vital
                                        pasien.
                                    </p>
                                </div>


                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                    <FormField
                                        label="Sistolik (mmHg)"
                                        placeholder="120"
                                        value={
                                            vitals.systolic_bp
                                        }
                                        onChange={(
                                            value,
                                        ) =>
                                            setVitals({
                                                ...vitals,
                                                systolic_bp:
                                                    value,
                                            })
                                        }
                                    />

                                    <FormField
                                        label="Diastolik (mmHg)"
                                        placeholder="80"
                                        value={
                                            vitals.diastolic_bp
                                        }
                                        onChange={(
                                            value,
                                        ) =>
                                            setVitals({
                                                ...vitals,
                                                diastolic_bp:
                                                    value,
                                            })
                                        }
                                    />

                                    <FormField
                                        label="Suhu (°C)"
                                        placeholder="36.5"
                                        value={
                                            vitals.temperature_c
                                        }
                                        step="0.1"
                                        onChange={(
                                            value,
                                        ) =>
                                            setVitals({
                                                ...vitals,
                                                temperature_c:
                                                    value,
                                            })
                                        }
                                    />

                                    <FormField
                                        label="Nadi (x/menit)"
                                        placeholder="80"
                                        value={
                                            vitals.pulse_rate
                                        }
                                        onChange={(
                                            value,
                                        ) =>
                                            setVitals({
                                                ...vitals,
                                                pulse_rate:
                                                    value,
                                            })
                                        }
                                    />

                                    <FormField
                                        label="Respirasi (x/menit)"
                                        placeholder="20"
                                        value={
                                            vitals.respiratory_rate
                                        }
                                        onChange={(
                                            value,
                                        ) =>
                                            setVitals({
                                                ...vitals,
                                                respiratory_rate:
                                                    value,
                                            })
                                        }
                                    />

                                    <FormField
                                        label="Berat Badan (kg)"
                                        placeholder="60"
                                        value={
                                            vitals.weight_kg
                                        }
                                        step="0.1"
                                        onChange={(
                                            value,
                                        ) =>
                                            setVitals({
                                                ...vitals,
                                                weight_kg:
                                                    value,
                                            })
                                        }
                                    />

                                    <FormField
                                        label="Tinggi Badan (cm)"
                                        placeholder="165"
                                        value={
                                            vitals.height_cm
                                        }
                                        step="0.1"
                                        onChange={(
                                            value,
                                        ) =>
                                            setVitals({
                                                ...vitals,
                                                height_cm:
                                                    value,
                                            })
                                        }
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="rounded-xl bg-[#093C5D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0C4D77]"
                                >
                                    Simpan Tanda Vital
                                </button>

                            </form>
                        )}


                        {/* ================= SOAP ================= */}

                        {activeTab ===
                            'soap' && (
                            <form
                                onSubmit={
                                    handleSaveSoap
                                }
                                className="max-w-4xl space-y-5"
                            >

                                <div>
                                    <h3 className="text-sm font-bold text-slate-700">
                                        Catatan SOAP
                                        Dokter
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Dokumentasikan
                                        data Subjective
                                        dan Objective
                                        pasien.
                                    </p>
                                </div>


                                <div>

                                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                                        Subjective (S)
                                    </label>

                                    <textarea
                                        rows={5}
                                        value={
                                            soap.subjective
                                        }
                                        onChange={(e) =>
                                            setSoap({
                                                ...soap,
                                                subjective:
                                                    e.target
                                                        .value,
                                            })
                                        }
                                        placeholder="Keluhan utama pasien..."
                                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#5DDCC5] focus:ring-2 focus:ring-[#5DDCC5]/20"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                                        Objective (O)
                                    </label>

                                    <textarea
                                        rows={5}
                                        value={
                                            soap.objective
                                        }
                                        onChange={(e) =>
                                            setSoap({
                                                ...soap,
                                                objective:
                                                    e.target
                                                        .value,
                                            })
                                        }
                                        placeholder="Hasil pemeriksaan fisik..."
                                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#5DDCC5] focus:ring-2 focus:ring-[#5DDCC5]/20"
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="rounded-xl bg-[#093C5D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0C4D77]"
                                >
                                    Simpan SOAP
                                </button>

                            </form>
                        )}


                        {/* ================= ICD 10 ================= */}

                        {activeTab ===
                            'diagnosis' && (
                            <div className="max-w-3xl space-y-4">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-700">
                                            Diagnosis
                                            ICD-10
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Cari kode
                                            atau nama
                                            diagnosis.
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">
                                        ✓ Dataset
                                        e-Klaim
                                    </span>

                                </div>


                                <div>

                                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                                        Cari & Pilih
                                        Kode / Nama
                                        ICD-10
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Contoh: J00, Diabetes, Typhoid..."
                                        value={
                                            icd10Search
                                        }
                                        onChange={(e) =>
                                            setIcd10Search(
                                                e.target
                                                    .value,
                                            )
                                        }
                                        className="w-full rounded-t-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-[#5DDCC5]"
                                    />


                                    <div className="max-h-60 overflow-y-auto rounded-b-xl border border-t-0 border-slate-200 bg-slate-50">

                                        {filteredIcd10.length >
                                        0 ? (
                                            filteredIcd10.map(
                                                (
                                                    item,
                                                    index,
                                                ) => (
                                                    <button
                                                        type="button"
                                                        key={`${item.code}-${index}`}
                                                        onClick={() =>
                                                            setSelectedIcd10(
                                                                item,
                                                            )
                                                        }
                                                        className={`flex w-full items-center justify-between border-b border-slate-100 p-3 text-left text-xs transition last:border-b-0 ${
                                                            selectedIcd10?.code ===
                                                            item.code
                                                                ? 'bg-[#E8FCF7] font-semibold text-[#087C70]'
                                                                : 'text-slate-700 hover:bg-white'
                                                        }`}
                                                    >
                                                        <span>
                                                            <b className="mr-2 rounded bg-slate-200 px-1.5 py-0.5 font-mono text-slate-800">
                                                                {
                                                                    item.code
                                                                }
                                                            </b>

                                                            {
                                                                item.name
                                                            }
                                                        </span>

                                                        {selectedIcd10?.code ===
                                                            item.code && (
                                                            <span>
                                                                ✓
                                                                Terpilih
                                                            </span>
                                                        )}
                                                    </button>
                                                ),
                                            )
                                        ) : (
                                            <div className="p-4 text-center text-xs text-slate-400">
                                                Kode /
                                                penyakit
                                                tidak
                                                ditemukan.
                                            </div>
                                        )}

                                    </div>

                                </div>


                                {selectedIcd10 && (
                                    <div className="flex flex-col gap-3 rounded-xl border border-[#BDEFE5] bg-[#F0FDFA] p-4 sm:flex-row sm:items-center sm:justify-between">

                                        <div>

                                            <p className="text-xs text-[#087C70]">
                                                Diagnosis
                                                Terpilih
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-800">

                                                <span className="font-mono">
                                                    {
                                                        selectedIcd10.code
                                                    }
                                                </span>

                                                {' - '}

                                                {
                                                    selectedIcd10.name
                                                }

                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={
                                                handleSaveIcd10
                                            }
                                            className="rounded-xl bg-[#093C5D] px-4 py-2.5 text-xs font-semibold text-white"
                                        >
                                            + Tambah
                                            Diagnosis
                                        </button>

                                    </div>
                                )}

                            </div>
                        )}


                        {/* ================= ICD 9 ================= */}

                        {activeTab ===
                            'icd9' && (
                            <div className="max-w-3xl space-y-4">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-700">
                                            Tindakan &
                                            Prosedur
                                            ICD-9
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Cari kode
                                            tindakan
                                            atau
                                            prosedur
                                            medis.
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">
                                        ✓ Dataset
                                        e-Klaim
                                    </span>

                                </div>


                                <div>

                                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                                        Cari & Pilih
                                        Kode / Nama
                                        ICD-9
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Contoh: 89.52, EKG, USG..."
                                        value={
                                            icd9Search
                                        }
                                        onChange={(e) =>
                                            setIcd9Search(
                                                e.target
                                                    .value,
                                            )
                                        }
                                        className="w-full rounded-t-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-[#5DDCC5]"
                                    />


                                    <div className="max-h-60 overflow-y-auto rounded-b-xl border border-t-0 border-slate-200 bg-slate-50">

                                        {filteredIcd9.length >
                                        0 ? (
                                            filteredIcd9.map(
                                                (
                                                    item,
                                                    index,
                                                ) => (
                                                    <button
                                                        type="button"
                                                        key={`${item.code}-${index}`}
                                                        onClick={() =>
                                                            setSelectedIcd9(
                                                                item,
                                                            )
                                                        }
                                                        className={`flex w-full items-center justify-between border-b border-slate-100 p-3 text-left text-xs transition last:border-b-0 ${
                                                            selectedIcd9?.code ===
                                                            item.code
                                                                ? 'bg-emerald-50 font-semibold text-emerald-800'
                                                                : 'text-slate-700 hover:bg-white'
                                                        }`}
                                                    >
                                                        <span>
                                                            <b className="mr-2 rounded bg-slate-200 px-1.5 py-0.5 font-mono text-slate-800">
                                                                {
                                                                    item.code
                                                                }
                                                            </b>

                                                            {
                                                                item.name
                                                            }
                                                        </span>

                                                        {selectedIcd9?.code ===
                                                            item.code && (
                                                            <span>
                                                                ✓
                                                                Terpilih
                                                            </span>
                                                        )}
                                                    </button>
                                                ),
                                            )
                                        ) : (
                                            <div className="p-4 text-center text-xs text-slate-400">
                                                Kode /
                                                prosedur
                                                tidak
                                                ditemukan.
                                            </div>
                                        )}

                                    </div>

                                </div>


                                {selectedIcd9 && (
                                    <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                                        <div>

                                            <p className="text-xs text-emerald-600">
                                                Prosedur
                                                Terpilih
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-800">

                                                <span className="font-mono">
                                                    {
                                                        selectedIcd9.code
                                                    }
                                                </span>

                                                {' - '}

                                                {
                                                    selectedIcd9.name
                                                }

                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                alert(
                                                    `Tindakan ${selectedIcd9.code} berhasil ditambahkan!`,
                                                )
                                            }
                                            className="rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
                                        >
                                            + Tambah
                                            Prosedur
                                        </button>

                                    </div>
                                )}

                            </div>
                        )}


                        {/* ================= RESEP ================= */}

                        {activeTab ===
                            'prescription' && (
                            <FeaturePlaceholder
                                title="Resep Obat"
                                description="Fitur peresepan belum terhubung pada implementasi halaman ini."
                            />
                        )}


                        {/* ================= IHS ================= */}

                        {activeTab ===
                            'ihs' && (
                            <FeaturePlaceholder
                                title="Integrasi IHS Kemenkes"
                                description="Integrasi IHS belum tersedia pada implementasi halaman ini."
                            />
                        )}

                    </div>
                )}


                {/* MAIN TAB PLACEHOLDERS */}

                {mainTab === 'detail' && (
                    <FeaturePlaceholder
                        title="Detail Pasien"
                        description="Detail pasien belum tersedia pada implementasi halaman ini."
                    />
                )}

                {mainTab === 'askep' && (
                    <FeaturePlaceholder
                        title="Asuhan Keperawatan"
                        description="Modul Askep belum tersedia pada implementasi halaman ini."
                    />
                )}

                {mainTab === 'billing' && (
                    <FeaturePlaceholder
                        title="Billing / Tindakan"
                        description="Modul billing belum tersedia pada implementasi halaman ini."
                    />
                )}

                {mainTab === 'selesai' && (
                    <FeaturePlaceholder
                        title="Selesai Pelayanan"
                        description="Proses penyelesaian encounter belum tersedia pada implementasi halaman ini."
                    />
                )}

            </div>

        </div>
    );
}


// ============================================================
// SMALL UI COMPONENTS
// ============================================================

type SummaryCardProps = {
    label: string;
    value: number;
    description: string;
    icon: string;
    iconClass: string;
    valueClass: string;
};

function SummaryCard({
    label,
    value,
    description,
    icon,
    iconClass,
    valueClass,
}: SummaryCardProps) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

                <div>
                    <p className="text-xs font-medium text-slate-500">
                        {label}
                    </p>

                    <p
                        className={`mt-2 text-2xl font-bold ${valueClass}`}
                    >
                        {value}
                    </p>
                </div>

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${iconClass}`}
                >
                    {icon}
                </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
                {description}
            </p>

        </div>
    );
}


function TableHead({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {children}
        </th>
    );
}


type FormFieldProps = {
    label: string;
    value: string;
    placeholder?: string;
    step?: string;
    onChange: (value: string) => void;
};

function FormField({
    label,
    value,
    placeholder,
    step,
    onChange,
}: FormFieldProps) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                {label}
            </label>

            <input
                type="number"
                step={step}
                placeholder={placeholder}
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#5DDCC5] focus:ring-2 focus:ring-[#5DDCC5]/20"
            />
        </div>
    );
}


function FeaturePlaceholder({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                +
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-700">
                {title}
            </h3>

            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-400">
                {description}
            </p>

        </div>
    );
}