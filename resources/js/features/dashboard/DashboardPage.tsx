import {
    Activity,
    ArrowRight,
    CalendarDays,
    Database,
    FileHeart,
    HeartPulse,
    LayoutGrid,
    ShieldCheck,
    Stethoscope,
    UserRoundPlus,
    Users,
} from 'lucide-react';

import {
    Link,
} from 'react-router-dom';

import {
    useAuth,
} from '../auth/AuthContext';

import {
    canAccessNavigation,
    navigationItems,
} from '../../config/navigation';

import { DoctorDashboard } from './DoctorDashboard';


const quickAccessConfig = {
    '/patients': {
        title: 'Data Pasien',
        description:
            'Kelola identitas dan data pasien.',
        icon: Users,
    },

    '/schedules': {
        title: 'Jadwal Dokter',
        description:
            'Lihat dan kelola jadwal praktik.',
        icon: CalendarDays,
    },

    '/admission/outpatient': {
        title: 'Pendaftaran Rawat Jalan',
        description:
            'Daftarkan pasien untuk pelayanan.',
        icon: UserRoundPlus,
    },

    '/clinical': {
        title: 'Pemeriksaan Rawat Jalan',
        description:
            'Kelola pemeriksaan dan SOAP pasien.',
        icon: Stethoscope,
    },

    '/medical-record': {
        title: 'Rekam Medis',
        description:
            'Lihat riwayat pelayanan pasien.',
        icon: FileHeart,
    },

    '/master-data': {
        title: 'Master Data',
        description:
            'Kelola data referensi SIMRS.',
        icon: Database,
    },
};


export function DashboardPage() {
    const {
        user,
    } = useAuth();

if (user?.role === 'DOCTOR') {
    return (
        <DoctorDashboard
            userName={user.name}
        />
    );
}
    const accessibleMenus =
        user
            ? navigationItems.filter(
                (menu) =>
                    canAccessNavigation(
                        user.role,
                        menu.roles,
                    ),
            )
            : [];

    const quickAccessMenus =
        accessibleMenus
            .filter(
                (menu) =>
                    menu.to in
                    quickAccessConfig,
            )
            .slice(0, 6);

    const roleLabel =
        user?.role
            ?.replace(/_/g, ' ')
            ?? '-';

    return (
        <div className="
            space-y-6
        ">
            {/* PAGE HEADING */}
            <div>
                <h1 className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-900
                ">
                    Dashboard
                </h1>

                <p className="
                    mt-1
                    text-sm
                    text-slate-500
                ">
                    Selamat datang kembali,
                    {' '}
                    <span className="
                        font-medium
                        text-slate-700
                    ">
                        {user?.name}
                    </span>
                    .
                    {' '}
                    Berikut ringkasan akses
                    Sistem Informasi Manajemen
                    Rumah Sakit.
                </p>
            </div>

            {/* INFORMATION CARDS */}
            <div className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
                xl:grid-cols-4
            ">
                {/* SYSTEM */}
                <div className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                ">
                    <div className="
                        flex
                        items-start
                        justify-between
                    ">
                        <div>
                            <p className="
                                text-xs
                                font-medium
                                text-slate-500
                            ">
                                Status Sistem
                            </p>

                            <div className="
                                mt-2
                                flex
                                items-center
                                gap-2
                            ">
                                <span className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-emerald-500
                                " />

                                <span className="
                                    text-xl
                                    font-bold
                                    text-slate-800
                                ">
                                    Online
                                </span>
                            </div>
                        </div>

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-emerald-50
                            text-emerald-600
                        ">
                            <Activity
                                size={21}
                            />
                        </div>
                    </div>

                    <p className="
                        mt-4
                        text-xs
                        text-slate-400
                    ">
                        Sistem dapat diakses
                        dengan normal.
                    </p>
                </div>

                {/* USER ROLE */}
                <div className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                ">
                    <div className="
                        flex
                        items-start
                        justify-between
                    ">
                        <div>
                            <p className="
                                text-xs
                                font-medium
                                text-slate-500
                            ">
                                Hak Akses
                            </p>

                            <p className="
                                mt-2
                                text-xl
                                font-bold
                                text-slate-800
                            ">
                                {roleLabel}
                            </p>
                        </div>

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-50
                            text-blue-600
                        ">
                            <ShieldCheck
                                size={21}
                            />
                        </div>
                    </div>

                    <p className="
                        mt-4
                        text-xs
                        text-slate-400
                    ">
                        Menu disesuaikan dengan
                        role pengguna.
                    </p>
                </div>

                {/* MODULE */}
                <div className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                ">
                    <div className="
                        flex
                        items-start
                        justify-between
                    ">
                        <div>
                            <p className="
                                text-xs
                                font-medium
                                text-slate-500
                            ">
                                Modul Tersedia
                            </p>

                            <p className="
                                mt-2
                                text-xl
                                font-bold
                                text-slate-800
                            ">
                                {
                                    Math.max(
                                        accessibleMenus
                                            .length -
                                            1,
                                        0,
                                    )
                                }
                            </p>
                        </div>

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-violet-50
                            text-violet-600
                        ">
                            <LayoutGrid
                                size={21}
                            />
                        </div>
                    </div>

                    <p className="
                        mt-4
                        text-xs
                        text-slate-400
                    ">
                        Modul yang dapat Anda
                        akses saat ini.
                    </p>
                </div>

                {/* APPLICATION */}
                <div className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                ">
                    <div className="
                        flex
                        items-start
                        justify-between
                    ">
                        <div>
                            <p className="
                                text-xs
                                font-medium
                                text-slate-500
                            ">
                                Aplikasi
                            </p>

                            <p className="
                                mt-2
                                text-xl
                                font-bold
                                text-slate-800
                            ">
                                SIMRS
                            </p>
                        </div>

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-cyan-50
                            text-cyan-700
                        ">
                            <HeartPulse
                                size={21}
                            />
                        </div>
                    </div>

                    <p className="
                        mt-4
                        text-xs
                        text-slate-400
                    ">
                        Sistem Informasi
                        Manajemen Rumah Sakit.
                    </p>
                </div>
            </div>

            {/* MAIN DASHBOARD AREA */}
            <div className="
                grid
                grid-cols-1
                gap-5
                xl:grid-cols-[1fr_340px]
            ">
                {/* QUICK ACCESS */}
                <section className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                ">
                    <div className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-100
                        px-5
                        py-4
                    ">
                        <div>
                            <h2 className="
                                text-sm
                                font-bold
                                text-slate-800
                            ">
                                Akses Cepat
                            </h2>

                            <p className="
                                mt-0.5
                                text-xs
                                text-slate-400
                            ">
                                Buka modul yang
                                sering digunakan.
                            </p>
                        </div>
                    </div>

                    <div className="
                        grid
                        grid-cols-1
                        gap-3
                        p-5
                        md:grid-cols-2
                    ">
                        {quickAccessMenus.map(
                            (menu) => {
                                const config =
                                    quickAccessConfig[
                                        menu.to as keyof typeof quickAccessConfig
                                    ];

                                const Icon =
                                    config.icon;

                                return (
                                    <Link
                                        key={
                                            menu.to
                                        }
                                        to={
                                            menu.to
                                        }
                                        className="
                                            group
                                            flex
                                            items-center
                                            gap-4
                                            rounded-xl
                                            border
                                            border-slate-200
                                            p-4
                                            transition
                                            hover:border-[#8BE9D8]
                                            hover:bg-[#F3FFFC]
                                            hover:shadow-sm
                                        "
                                    >
                                        <div className="
                                            flex
                                            h-11
                                            w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-[#E8FCF7]
                                            text-[#087C70]
                                        ">
                                            <Icon
                                                size={
                                                    20
                                                }
                                            />
                                        </div>

                                        <div className="
                                            min-w-0
                                            flex-1
                                        ">
                                            <p className="
                                                text-sm
                                                font-semibold
                                                text-slate-700
                                            ">
                                                {
                                                    config.title
                                                }
                                            </p>

                                            <p className="
                                                mt-0.5
                                                text-xs
                                                text-slate-400
                                            ">
                                                {
                                                    config.description
                                                }
                                            </p>
                                        </div>

                                        <ArrowRight
                                            size={
                                                17
                                            }
                                            className="
                                                shrink-0
                                                text-slate-300
                                                transition
                                                group-hover:translate-x-1
                                                group-hover:text-[#087C70]
                                            "
                                        />
                                    </Link>
                                );
                            },
                        )}
                    </div>
                </section>

                {/* ACCOUNT INFORMATION */}
                <section className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                ">
                    <div className="
                        border-b
                        border-slate-100
                        px-5
                        py-4
                    ">
                        <h2 className="
                            text-sm
                            font-bold
                            text-slate-800
                        ">
                            Informasi Pengguna
                        </h2>

                        <p className="
                            mt-0.5
                            text-xs
                            text-slate-400
                        ">
                            Akun yang sedang
                            aktif.
                        </p>
                    </div>

                    <div className="
                        p-5
                    ">
                        <div className="
                            flex
                            items-center
                            gap-3
                        ">
                            <div className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-full
                                bg-[#093C5D]
                                text-sm
                                font-bold
                                text-white
                            ">
                                {user?.name
                                    ?.charAt(0)
                                    .toUpperCase() ??
                                    'A'}
                            </div>

                            <div className="
                                min-w-0
                            ">
                                <p className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                ">
                                    {user?.name}
                                </p>

                                <p className="
                                    mt-0.5
                                    text-xs
                                    text-slate-400
                                ">
                                    {roleLabel}
                                </p>
                            </div>
                        </div>

                        <div className="
                            my-5
                            border-t
                            border-slate-100
                        " />

                        <div className="
                            space-y-3
                            text-xs
                        ">
                            <div className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            ">
                                <span className="
                                    text-slate-400
                                ">
                                    Status
                                </span>

                                <span className="
                                    rounded-full
                                    bg-emerald-50
                                    px-2.5
                                    py-1
                                    font-semibold
                                    text-emerald-700
                                ">
                                    Aktif
                                </span>
                            </div>

                            <div className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            ">
                                <span className="
                                    text-slate-400
                                ">
                                    Role
                                </span>

                                <span className="
                                    font-semibold
                                    text-slate-600
                                ">
                                    {roleLabel}
                                </span>
                            </div>

                            <div className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            ">
                                <span className="
                                    text-slate-400
                                ">
                                    Sistem
                                </span>

                                <span className="
                                    font-semibold
                                    text-slate-600
                                ">
                                    SIMRS
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}