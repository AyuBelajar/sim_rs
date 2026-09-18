import React, { useMemo, useState } from 'react';


// ============================================================
// TYPES
// ============================================================

interface PatientRecord {
    id: string;
    mrn: string;
    name: string;
    age: string;
    gender: string;
    poly: string;
    doctor: string;
    visitDate: string;
    diagnosis: string;

    vitals: {
        bp: string;
        pulse: string;
        temp: string;
    };

    soap: {
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
    };

    prescriptions: string[];
}


// ============================================================
// DUMMY ARCHIVED RECORDS
// ============================================================

const ARCHIVED_RECORDS: PatientRecord[] = [
    {
        id: 'ENC-001',
        mrn: 'RM-2026-0891',
        name: 'Siti Aminah',
        age: '34 Tahun',
        gender: 'Perempuan',
        poly: 'Poli Umum',
        doctor: 'dr. Sava, Sp.PD',
        visitDate: '18 September 2026',
        diagnosis:
            'J00 - Acute Nasopharyngitis (Common Cold)',

        vitals: {
            bp: '120/80 mmHg',
            pulse: '80 x/mnt',
            temp: '36.8 °C',
        },

        soap: {
            subjective:
                'Pasien mengeluhkan batuk dan pilek sejak 2 hari yang lalu.',
            objective:
                'Tenggorokan hiperemis (-), wheezing (-).',
            assessment:
                'ISPA ringan.',
            plan:
                'Istirahat cukup dan terapi simtomatik.',
        },

        prescriptions: [
            'Paracetamol 500mg 3x1',
            'Vitamin C 500mg 1x1',
        ],
    },

    {
        id: 'ENC-002',
        mrn: 'RM-2026-0892',
        name: 'Budi Santoso',
        age: '45 Tahun',
        gender: 'Laki-laki',
        poly: 'Poli Dalam',
        doctor: 'dr. Sava, Sp.PD',
        visitDate: '17 September 2026',
        diagnosis:
            'I10 - Essential (Primary) Hypertension',

        vitals: {
            bp: '145/90 mmHg',
            pulse: '84 x/mnt',
            temp: '36.5 °C',
        },

        soap: {
            subjective:
                'Kepala terasa berat di bagian tengkuk.',
            objective:
                'TD 145/90 mmHg.',
            assessment:
                'Hipertensi Grade 1.',
            plan:
                'Edukasi diet rendah garam dan antihipertensi.',
        },

        prescriptions: [
            'Amlodipine 5mg 1x1 (Malam)',
        ],
    },
];


// ============================================================
// PAGE
// ============================================================

export function MedicalRecordPage() {
    const [searchQuery, setSearchQuery] =
        useState('');

    const [
        selectedRecord,
        setSelectedRecord,
    ] = useState<PatientRecord | null>(null);

    const [
        activePrintType,
        setActivePrintType,
    ] = useState<
        'SICK_LEAVE' | 'MEDICAL_SUMMARY' | null
    >(null);


    // ========================================================
    // FILTER RECORDS
    // ========================================================

    const filteredRecords = useMemo(() => {
        const query = searchQuery
            .toLowerCase()
            .trim();

        if (!query) {
            return ARCHIVED_RECORDS;
        }

        return ARCHIVED_RECORDS.filter(
            (record) =>
                record.name
                    .toLowerCase()
                    .includes(query) ||
                record.mrn
                    .toLowerCase()
                    .includes(query) ||
                record.poly
                    .toLowerCase()
                    .includes(query) ||
                record.doctor
                    .toLowerCase()
                    .includes(query) ||
                record.diagnosis
                    .toLowerCase()
                    .includes(query),
        );
    }, [searchQuery]);


    // ========================================================
    // SUMMARY
    // ========================================================

    const uniquePatients = new Set(
        ARCHIVED_RECORDS.map(
            (record) => record.mrn,
        ),
    ).size;

    const uniquePolyclinics = new Set(
        ARCHIVED_RECORDS.map(
            (record) => record.poly,
        ),
    ).size;


    // ========================================================
    // PRINT
    // ========================================================

    const handlePrint = () => {
        window.print();
    };


    return (
        <div className="space-y-6">

            {/* =================================================
                PRINT CSS
            ================================================= */}

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }

                    #printable-area,
                    #printable-area * {
                        visibility: visible;
                    }

                    #printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 0;
                        margin: 0;
                        border: none !important;
                        box-shadow: none !important;
                    }

                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="no-print">

                <h1 className="text-2xl font-bold text-slate-800">
                    Arsip Rekam Medis Elektronik
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Pencarian dokumen riwayat medis
                    pasien dari pelayanan rawat jalan.
                </p>

            </div>


            {/* =================================================
                VIEW 1 - RECORD LIST
            ================================================= */}

            {!selectedRecord ? (
                <div className="space-y-6 no-print">

                    {/* SUMMARY */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                        <SummaryCard
                            label="Total Arsip"
                            value={
                                ARCHIVED_RECORDS.length
                            }
                            description="Riwayat kunjungan tersimpan"
                            icon="▤"
                            iconClass="bg-slate-100 text-slate-600"
                            valueClass="text-slate-800"
                        />

                        <SummaryCard
                            label="Total Pasien"
                            value={uniquePatients}
                            description="Pasien dengan rekam medis"
                            icon="♙"
                            iconClass="bg-[#E8FCF7] text-[#087C70]"
                            valueClass="text-[#087C70]"
                        />

                        <SummaryCard
                            label="Poliklinik"
                            value={uniquePolyclinics}
                            description="Poliklinik dalam arsip"
                            icon="✚"
                            iconClass="bg-sky-50 text-sky-700"
                            valueClass="text-sky-700"
                        />

                    </div>


                    {/* RECORD TABLE */}

                    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

                        {/* TABLE HEADER */}

                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">

                            <div>

                                <h2 className="font-semibold text-slate-800">
                                    Arsip Riwayat
                                    Kunjungan Pasien
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Pilih kunjungan untuk
                                    melihat detail rekam
                                    medis pasien.
                                </p>

                            </div>


                            {/* SEARCH */}

                            <div className="relative w-full md:w-96">

                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    placeholder="Cari nama, No. RM, poli, diagnosis..."
                                    value={
                                        searchQuery
                                    }
                                    onChange={(e) =>
                                        setSearchQuery(
                                            e.target
                                                .value,
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
                                            Tgl. Kunjungan
                                        </TableHead>

                                        <TableHead>
                                            No. RM
                                        </TableHead>

                                        <TableHead>
                                            Pasien
                                        </TableHead>

                                        <TableHead>
                                            Poliklinik /
                                            Dokter
                                        </TableHead>

                                        <TableHead>
                                            Diagnosis Utama
                                        </TableHead>

                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Aksi
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {filteredRecords.map(
                                        (record) => (
                                            <tr
                                                key={
                                                    record.id
                                                }
                                                className="transition hover:bg-slate-50/70"
                                            >

                                                {/* DATE */}

                                                <td className="whitespace-nowrap px-5 py-4">

                                                    <p className="font-medium text-slate-700">
                                                        {
                                                            record.visitDate
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {
                                                            record.id
                                                        }
                                                    </p>

                                                </td>


                                                {/* MRN */}

                                                <td className="whitespace-nowrap px-5 py-4">

                                                    <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                                                        {
                                                            record.mrn
                                                        }
                                                    </span>

                                                </td>


                                                {/* PATIENT */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8FCF7] text-xs font-bold text-[#087C70]">

                                                            {record.name
                                                                .charAt(
                                                                    0,
                                                                )
                                                                .toUpperCase()}

                                                        </div>


                                                        <div>

                                                            <p className="font-semibold text-slate-800">
                                                                {
                                                                    record.name
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 text-xs text-slate-400">
                                                                {
                                                                    record.age
                                                                }
                                                                {' • '}
                                                                {
                                                                    record.gender
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* POLY / DOCTOR */}

                                                <td className="px-5 py-4">

                                                    <span className="inline-flex rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                                        {
                                                            record.poly
                                                        }
                                                    </span>

                                                    <p className="mt-1.5 text-xs text-slate-400">
                                                        {
                                                            record.doctor
                                                        }
                                                    </p>

                                                </td>


                                                {/* DIAGNOSIS */}

                                                <td className="max-w-xs px-5 py-4">

                                                    <p className="text-xs font-medium leading-5 text-slate-700">
                                                        {
                                                            record.diagnosis
                                                        }
                                                    </p>

                                                </td>


                                                {/* ACTION */}

                                                <td className="whitespace-nowrap px-5 py-4 text-right">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedRecord(
                                                                record,
                                                            )
                                                        }
                                                        className="inline-flex items-center justify-center rounded-xl bg-[#093C5D] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#0C4D77]"
                                                    >
                                                        Lihat Arsip

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


                        {/* EMPTY SEARCH */}

                        {filteredRecords.length ===
                            0 && (
                            <div className="border-t border-slate-100 px-6 py-12 text-center">

                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                    ⌕
                                </div>

                                <p className="mt-3 text-sm font-semibold text-slate-700">
                                    Rekam medis tidak
                                    ditemukan
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Coba gunakan nama,
                                    nomor rekam medis,
                                    poliklinik, atau
                                    diagnosis lain.
                                </p>

                            </div>
                        )}


                        {/* FOOTER */}

                        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3">

                            <p className="text-xs text-slate-400">
                                Menampilkan{' '}

                                <span className="font-semibold text-slate-600">
                                    {
                                        filteredRecords.length
                                    }
                                </span>{' '}

                                dari{' '}

                                <span className="font-semibold text-slate-600">
                                    {
                                        ARCHIVED_RECORDS.length
                                    }
                                </span>{' '}

                                arsip
                            </p>


                            <p className="text-xs text-slate-400">
                                Rekam Medis
                                Elektronik
                            </p>

                        </div>

                    </div>

                </div>
            ) : (

                /* =============================================
                   VIEW 2 - DETAIL MEDICAL RECORD
                ============================================= */

                <div className="space-y-5 no-print">

                    {/* DETAIL HEADER */}

                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                            <div className="flex items-start gap-4">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedRecord(
                                            null,
                                        )
                                    }
                                    className="mt-0.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                                >
                                    ← Kembali
                                </button>


                                <div>

                                    <div className="flex flex-wrap items-center gap-2">

                                        <h2 className="text-xl font-bold text-slate-800">
                                            Rekam Medis
                                            Pasien
                                        </h2>

                                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                                            🔒 READ-ONLY
                                        </span>

                                    </div>


                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                        {
                                            selectedRecord.name
                                        }
                                    </p>


                                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">

                                        <span className="font-mono font-semibold text-slate-600">
                                            {
                                                selectedRecord.mrn
                                            }
                                        </span>

                                        <span>•</span>

                                        <span>
                                            {
                                                selectedRecord.age
                                            }
                                        </span>

                                        <span>•</span>

                                        <span>
                                            {
                                                selectedRecord.gender
                                            }
                                        </span>

                                        <span>•</span>

                                        <span>
                                            {
                                                selectedRecord.poly
                                            }
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* PRINT ACTIONS */}

                            <div className="flex flex-wrap gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setActivePrintType(
                                            'SICK_LEAVE',
                                        )
                                    }
                                    className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                                >
                                    📄 Cetak Surat
                                    Ket. Sakit
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setActivePrintType(
                                            'MEDICAL_SUMMARY',
                                        )
                                    }
                                    className="rounded-xl bg-[#093C5D] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0C4D77]"
                                >
                                    🖨 Cetak
                                    Ringkasan CPPT
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* VISIT INFORMATION */}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <InfoCard
                            label="Tanggal Kunjungan"
                            value={
                                selectedRecord.visitDate
                            }
                            icon="▣"
                        />

                        <InfoCard
                            label="Poliklinik"
                            value={
                                selectedRecord.poly
                            }
                            icon="✚"
                        />

                        <InfoCard
                            label="Dokter Penanggung Jawab"
                            value={
                                selectedRecord.doctor
                            }
                            icon="♙"
                        />

                    </div>


                    {/* VITAL SIGNS */}

                    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

                        <SectionHeader
                            number="01"
                            title="Tanda-Tanda Vital"
                            description="Hasil pemeriksaan tanda vital pasien pada kunjungan ini."
                        />


                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

                            <VitalCard
                                label="Tekanan Darah"
                                value={
                                    selectedRecord
                                        .vitals.bp
                                }
                                icon="♥"
                            />

                            <VitalCard
                                label="Nadi"
                                value={
                                    selectedRecord
                                        .vitals.pulse
                                }
                                icon="⌁"
                            />

                            <VitalCard
                                label="Suhu Tubuh"
                                value={
                                    selectedRecord
                                        .vitals.temp
                                }
                                icon="°"
                            />

                        </div>

                    </section>


                    {/* SOAP */}

                    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

                        <SectionHeader
                            number="02"
                            title="Catatan SOAP Dokter"
                            description="Dokumentasi pemeriksaan medis selama kunjungan pasien."
                        />


                        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">

                            <SoapCard
                                letter="S"
                                title="Subjective"
                                value={
                                    selectedRecord
                                        .soap.subjective
                                }
                            />

                            <SoapCard
                                letter="O"
                                title="Objective"
                                value={
                                    selectedRecord
                                        .soap.objective
                                }
                            />

                            <SoapCard
                                letter="A"
                                title="Assessment"
                                value={
                                    selectedRecord
                                        .soap.assessment
                                }
                            />

                            <SoapCard
                                letter="P"
                                title="Plan"
                                value={
                                    selectedRecord
                                        .soap.plan
                                }
                            />

                        </div>

                    </section>


                    {/* DIAGNOSIS & PRESCRIPTION */}

                    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

                        <SectionHeader
                            number="03"
                            title="Diagnosis & Terapi Obat"
                            description="Diagnosis utama dan resep yang tercatat pada kunjungan."
                        />


                        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

                            {/* DIAGNOSIS */}

                            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Diagnosis Utama
                                </p>

                                <div className="mt-3 rounded-xl border border-[#BDEFE5] bg-[#F0FDFA] p-4">

                                    <p className="text-sm font-semibold leading-6 text-slate-800">
                                        {
                                            selectedRecord.diagnosis
                                        }
                                    </p>

                                </div>

                            </div>


                            {/* PRESCRIPTIONS */}

                            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Resep Obat
                                </p>


                                <div className="mt-3 space-y-2">

                                    {selectedRecord
                                        .prescriptions
                                        .map(
                                            (
                                                prescription,
                                                index,
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3"
                                                >

                                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-xs font-bold text-sky-700">
                                                        Rx
                                                    </div>

                                                    <p className="pt-1 text-xs font-medium leading-5 text-slate-700">
                                                        {
                                                            prescription
                                                        }
                                                    </p>

                                                </div>
                                            ),
                                        )}

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* READ ONLY INFO */}

                    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm shadow-sm">
                            🔒
                        </div>

                        <div>

                            <p className="text-xs font-semibold text-slate-700">
                                Arsip Rekam Medis
                                Bersifat Read-Only
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-400">
                                Data pada halaman ini
                                ditampilkan sebagai
                                arsip kunjungan dan
                                tidak dapat diedit dari
                                halaman Rekam Medis.
                            </p>

                        </div>

                    </div>

                </div>
            )}


            {/* =================================================
                PRINT MODAL
            ================================================= */}

            {activePrintType &&
                selectedRecord && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

                    <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="no-print flex items-center justify-between border-b border-slate-100 px-6 py-4">

                            <div>

                                <h3 className="font-semibold text-slate-800">
                                    Preview Dokumen
                                    Cetak
                                </h3>

                                <p className="mt-0.5 text-xs text-slate-400">
                                    Periksa dokumen
                                    sebelum dicetak.
                                </p>

                            </div>


                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    onClick={
                                        handlePrint
                                    }
                                    className="rounded-xl bg-[#093C5D] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0C4D77]"
                                >
                                    🖨 Cetak
                                    Sekarang
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setActivePrintType(
                                            null,
                                        )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-500 transition hover:bg-slate-200"
                                >
                                    ✕
                                </button>

                            </div>

                        </div>


                        {/* DOCUMENT SCROLL AREA */}

                        <div className="max-h-[calc(92vh-73px)] overflow-y-auto bg-slate-100 p-5 sm:p-8">

                            {/* PRINTABLE AREA */}

                            <div
                                id="printable-area"
                                className="mx-auto min-h-[800px] max-w-2xl border border-slate-200 bg-white p-8 text-sm leading-relaxed text-black shadow-sm sm:p-10"
                            >

                                {/* LETTER HEAD */}

                                <div className="mb-7 border-b-2 border-black pb-4 text-center">

                                    <h2 className="text-xl font-bold uppercase tracking-wide">
                                        Rumah Sakit
                                        Utama Sehat
                                    </h2>

                                    <p className="mt-1 text-xs">
                                        Jl. Raya
                                        Kesehatan No.
                                        10, Surabaya |
                                        Telp: (031)
                                        555-1234
                                    </p>

                                </div>


                                {/* =================================
                                    SICK LEAVE LETTER
                                ================================= */}

                                {activePrintType ===
                                    'SICK_LEAVE' && (

                                    <div className="space-y-4 font-serif">

                                        <div className="text-center">

                                            <h3 className="text-base font-bold uppercase underline">
                                                Surat
                                                Keterangan
                                                Sakit
                                            </h3>

                                            <p className="mt-1 text-xs">
                                                No:
                                                108/SK/RSU/
                                                {
                                                    selectedRecord.id
                                                }
                                            </p>

                                        </div>


                                        <p className="mt-8">
                                            Yang bertanda
                                            tangan di
                                            bawah ini
                                            menerangkan
                                            bahwa:
                                        </p>


                                        <div className="ml-6 space-y-2 text-xs">

                                            <DocumentRow
                                                label="Nama Pasien"
                                                value={
                                                    selectedRecord.name
                                                }
                                                bold
                                            />

                                            <DocumentRow
                                                label="No. Rekam Medis"
                                                value={
                                                    selectedRecord.mrn
                                                }
                                            />

                                            <DocumentRow
                                                label="Umur / Gender"
                                                value={`${selectedRecord.age} / ${selectedRecord.gender}`}
                                            />

                                        </div>


                                        <p className="mt-6 text-justify">
                                            Berhubungan
                                            dengan keadaan
                                            sakitnya,
                                            pasien tersebut
                                            di atas
                                            memerlukan
                                            istirahat
                                            berobat selama{' '}

                                            <b>
                                                2 (dua)
                                                hari
                                            </b>{' '}

                                            terhitung sejak
                                            tanggal{' '}

                                            <b>
                                                {
                                                    selectedRecord.visitDate
                                                }
                                            </b>
                                            .
                                        </p>


                                        <div className="mt-14 flex justify-end">

                                            <div className="text-center text-xs">

                                                <p>
                                                    Surabaya,{' '}
                                                    {
                                                        selectedRecord.visitDate
                                                    }
                                                </p>

                                                <p className="mb-16 mt-1">
                                                    Dokter
                                                    Pemeriksa,
                                                </p>

                                                <p className="font-bold underline">
                                                    {
                                                        selectedRecord.doctor
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                    </div>
                                )}


                                {/* =================================
                                    MEDICAL SUMMARY
                                ================================= */}

                                {activePrintType ===
                                    'MEDICAL_SUMMARY' && (

                                    <div className="space-y-5 text-xs">

                                        <h3 className="text-center font-serif text-base font-bold uppercase underline">
                                            Ringkasan Rekam
                                            Medis Rawat
                                            Jalan
                                        </h3>


                                        {/* PATIENT INFORMATION */}

                                        <div className="grid grid-cols-1 gap-2 rounded border border-slate-300 bg-slate-50 p-4 sm:grid-cols-2">

                                            <p>
                                                <b>
                                                    Nama:
                                                </b>{' '}
                                                {
                                                    selectedRecord.name
                                                }
                                            </p>

                                            <p>
                                                <b>
                                                    No.
                                                    RM:
                                                </b>{' '}
                                                {
                                                    selectedRecord.mrn
                                                }
                                            </p>

                                            <p>
                                                <b>
                                                    Tgl.
                                                    Periksa:
                                                </b>{' '}
                                                {
                                                    selectedRecord.visitDate
                                                }
                                            </p>

                                            <p>
                                                <b>
                                                    Poliklinik:
                                                </b>{' '}
                                                {
                                                    selectedRecord.poly
                                                }
                                            </p>

                                        </div>


                                        {/* MEDICAL RESULT */}

                                        <div className="space-y-3 rounded border border-slate-300 p-4">

                                            <p className="border-b border-slate-300 pb-2 font-bold">
                                                HASIL
                                                PEMERIKSAAN
                                                MEDIS
                                            </p>


                                            <p>
                                                <b>
                                                    Vital
                                                    Signs:
                                                </b>{' '}
                                                TD{' '}
                                                {
                                                    selectedRecord
                                                        .vitals
                                                        .bp
                                                }
                                                , Nadi{' '}
                                                {
                                                    selectedRecord
                                                        .vitals
                                                        .pulse
                                                }
                                                , Suhu{' '}
                                                {
                                                    selectedRecord
                                                        .vitals
                                                        .temp
                                                }
                                            </p>


                                            <p>
                                                <b>
                                                    Keluhan
                                                    (S):
                                                </b>{' '}
                                                {
                                                    selectedRecord
                                                        .soap
                                                        .subjective
                                                }
                                            </p>


                                            <p>
                                                <b>
                                                    Pemeriksaan
                                                    (O):
                                                </b>{' '}
                                                {
                                                    selectedRecord
                                                        .soap
                                                        .objective
                                                }
                                            </p>


                                            <p>
                                                <b>
                                                    Diagnosis
                                                    (A):
                                                </b>{' '}
                                                {
                                                    selectedRecord.diagnosis
                                                }
                                            </p>


                                            <p>
                                                <b>
                                                    Rencana
                                                    (P):
                                                </b>{' '}
                                                {
                                                    selectedRecord
                                                        .soap
                                                        .plan
                                                }
                                            </p>


                                            <div>

                                                <b>
                                                    Terapi:
                                                </b>

                                                <ul className="ml-5 mt-1 list-disc space-y-1">

                                                    {selectedRecord
                                                        .prescriptions
                                                        .map(
                                                            (
                                                                rx,
                                                                index,
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        index
                                                                    }
                                                                >
                                                                    {
                                                                        rx
                                                                    }
                                                                </li>
                                                            ),
                                                        )}

                                                </ul>

                                            </div>

                                        </div>


                                        {/* SIGNATURE */}

                                        <div className="mt-10 flex justify-end">

                                            <div className="text-center">

                                                <p>
                                                    Dokter
                                                    Penanggung
                                                    Jawab,
                                                </p>

                                                <div className="h-14" />

                                                <p className="font-bold underline">
                                                    {
                                                        selectedRecord.doctor
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}


// ============================================================
// SMALL COMPONENTS
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


function InfoCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">

            <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-600">
                    {icon}
                </div>

                <div>

                    <p className="text-[11px] font-medium text-slate-400">
                        {label}
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-slate-700">
                        {value}
                    </p>

                </div>

            </div>

        </div>
    );
}


function SectionHeader({
    number,
    title,
    description,
}: {
    number: string;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8FCF7] text-[11px] font-bold text-[#087C70]">
                {number}
            </div>

            <div>

                <h3 className="text-sm font-semibold text-slate-800">
                    {title}
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                    {description}
                </p>

            </div>

        </div>
    );
}


function VitalCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: string;
}) {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

            <div className="flex items-center gap-2">

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs shadow-sm">
                    {icon}
                </div>

                <p className="text-[11px] font-medium text-slate-400">
                    {label}
                </p>

            </div>

            <p className="mt-3 text-sm font-bold text-slate-800">
                {value}
            </p>

        </div>
    );
}


function SoapCard({
    letter,
    title,
    value,
}: {
    letter: string;
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">

            <div className="flex items-center gap-2">

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#093C5D] text-[11px] font-bold text-white">
                    {letter}
                </div>

                <p className="text-xs font-semibold text-slate-700">
                    {title}
                </p>

            </div>

            <p className="mt-3 text-xs leading-6 text-slate-600">
                {value}
            </p>

        </div>
    );
}


function DocumentRow({
    label,
    value,
    bold = false,
}: {
    label: string;
    value: string;
    bold?: boolean;
}) {
    return (
        <p className="flex">

            <span className="inline-block w-36 shrink-0">
                {label}
            </span>

            <span className="mr-2">:</span>

            <span
                className={
                    bold ? 'font-bold' : ''
                }
            >
                {value}
            </span>

        </p>
    );
}