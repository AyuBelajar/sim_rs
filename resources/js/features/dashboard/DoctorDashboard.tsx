import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileHeart,
    Stethoscope,
    UserRound,
    Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
    userName?: string;
};

const patientQueue = [
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

export function DoctorDashboard({
    userName,
}: Props) {
    const totalPatients = patientQueue.length;

    const waitingPatients = patientQueue.filter(
        (patient) =>
            patient.status === 'Menunggu',
    ).length;

    const inServicePatients = patientQueue.filter(
        (patient) =>
            patient.status ===
            'Sedang Dilayani',
    ).length;

    const completedPatients = patientQueue.filter(
        (patient) =>
            patient.status === 'Selesai',
    ).length;

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#E8FCF7] px-3 py-1 text-xs font-semibold text-[#087C70]">
                        <Stethoscope size={14} />
                        Workspace Dokter
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Dashboard Dokter
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Selamat datang kembali,{' '}
                        <span className="font-semibold text-slate-700">
                            {userName ?? 'Doctor'}
                        </span>
                        . Berikut ringkasan pelayanan
                        Anda hari ini.
                    </p>
                </div>

                <Link
                    to="/clinical"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#093C5D] px-4 text-sm font-semibold text-white transition hover:bg-[#0C4D77]"
                >
                    <Stethoscope size={17} />
                    Buka Rawat Jalan
                </Link>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    label="Pasien Hari Ini"
                    value={totalPatients}
                    description="Total antrean pelayanan"
                    icon={Users}
                    iconClass="bg-slate-100 text-slate-700"
                />

                <SummaryCard
                    label="Menunggu"
                    value={waitingPatients}
                    description="Menunggu pemeriksaan"
                    icon={Clock3}
                    iconClass="bg-sky-50 text-sky-600"
                />

                <SummaryCard
                    label="Sedang Dilayani"
                    value={inServicePatients}
                    description="Dalam pemeriksaan"
                    icon={Stethoscope}
                    iconClass="bg-amber-50 text-amber-600"
                />

                <SummaryCard
                    label="Selesai"
                    value={completedPatients}
                    description="Pelayanan telah selesai"
                    icon={CheckCircle2}
                    iconClass="bg-emerald-50 text-emerald-600"
                />
            </div>

            {/* MAIN AREA */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
                {/* QUEUE */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                            <h2 className="text-sm font-bold text-slate-800">
                                Antrean Pasien Hari Ini
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-400">
                                Ringkasan pasien rawat
                                jalan yang perlu
                                ditangani.
                            </p>
                        </div>

                        <Link
                            to="/clinical"
                            className="hidden items-center gap-1 text-xs font-semibold text-[#087C70] hover:underline sm:flex"
                        >
                            Lihat Semua
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50">
                                <tr className="border-b border-slate-100">
                                    <TableHead>
                                        Pasien
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
                                {patientQueue.map(
                                    (patient) => (
                                        <tr
                                            key={
                                                patient.id
                                            }
                                            className="transition hover:bg-slate-50/70"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8FCF7] text-xs font-bold text-[#087C70]">
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
                                                            {
                                                                patient.mrn
                                                            }{' '}
                                                            •{' '}
                                                            {
                                                                patient.age
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                                    {
                                                        patient.poly
                                                    }
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge
                                                    status={
                                                        patient.status
                                                    }
                                                />
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    to={`/clinical/${patient.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#093C5D] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0C4D77]"
                                                >
                                                    Periksa
                                                    <ArrowRight
                                                        size={
                                                            13
                                                        }
                                                    />
                                                </Link>
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                        <p className="text-xs text-slate-400">
                            {totalPatients} pasien
                            terdaftar
                        </p>

                        <p className="text-xs font-medium text-slate-500">
                            Rawat Jalan
                        </p>
                    </div>
                </section>

                {/* RIGHT COLUMN */}
                <div className="space-y-5">
                    {/* SCHEDULE */}
                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-4">
                            <h2 className="text-sm font-bold text-slate-800">
                                Jadwal Praktik
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-400">
                                Akses jadwal praktik
                                dokter.
                            </p>
                        </div>

                        <div className="p-5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <CalendarDays
                                    size={20}
                                />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-slate-800">
                                Jadwal Dokter
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-400">
                                Lihat jadwal praktik,
                                poliklinik, dan
                                ketersediaan kuota
                                pelayanan.
                            </p>

                            <Link
                                to="/schedules"
                                className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition hover:border-[#8BE9D8] hover:bg-[#F3FFFC] hover:text-[#087C70]"
                            >
                                <CalendarDays
                                    size={15}
                                />
                                Lihat Jadwal
                            </Link>
                        </div>
                    </section>

                    {/* INFO */}
                    <section className="rounded-2xl border border-[#BDEFE5] bg-[#F3FFFC] p-5">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#087C70] shadow-sm">
                                <UserRound size={17} />
                            </div>

                            <div>
                                <p className="text-xs font-bold text-[#087C70]">
                                    Ruang Kerja Dokter
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Gunakan Rawat Jalan
                                    untuk melakukan
                                    pemeriksaan dan
                                    Rekam Medis untuk
                                    melihat riwayat
                                    pelayanan pasien.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* QUICK ACCESS */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="text-sm font-bold text-slate-800">
                        Akses Cepat
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                        Modul utama untuk aktivitas
                        pelayanan dokter.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-3">
                    <QuickAccessCard
                        to="/clinical"
                        title="Pemeriksaan Rawat Jalan"
                        description="Kelola antrean, pemeriksaan, SOAP, dan diagnosis pasien."
                        icon={Stethoscope}
                    />

                    <QuickAccessCard
                        to="/medical-record"
                        title="Rekam Medis"
                        description="Lihat riwayat dan arsip pelayanan medis pasien."
                        icon={FileHeart}
                    />

                    <QuickAccessCard
                        to="/schedules"
                        title="Jadwal Dokter"
                        description="Lihat jadwal praktik dan ketersediaan pelayanan."
                        icon={CalendarDays}
                    />
                </div>
            </section>

            {/* DEMO NOTICE */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs leading-5 text-amber-800">
                    Data ringkasan antrean pada
                    dashboard masih menggunakan data
                    demonstrasi Rawat Jalan. Data
                    akan dapat dihubungkan ke backend
                    ketika API antrean tersedia.
                </p>
            </div>
        </div>
    );
}

type IconComponent = React.ComponentType<{
    size?: number;
    className?: string;
}>;

function SummaryCard({
    label,
    value,
    description,
    icon: Icon,
    iconClass,
}: {
    label: string;
    value: number;
    description: string;
    icon: IconComponent;
    iconClass: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        {value}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon size={20} />
                </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
                {description}
            </p>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: string;
}) {
    if (status === 'Menunggu') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                Menunggu
            </span>
        );
    }

    if (status === 'Sedang Dilayani') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Sedang Dilayani
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Selesai
        </span>
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

function QuickAccessCard({
    to,
    title,
    description,
    icon: Icon,
}: {
    to: string;
    title: string;
    description: string;
    icon: IconComponent;
}) {
    return (
        <Link
            to={to}
            className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-[#8BE9D8] hover:bg-[#F3FFFC] hover:shadow-sm"
        >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8FCF7] text-[#087C70]">
                <Icon size={20} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-700">
                    {title}
                </p>

                <p className="mt-0.5 text-xs leading-5 text-slate-400">
                    {description}
                </p>
            </div>

            <ArrowRight
                size={17}
                className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#087C70]"
            />
        </Link>
    );
}