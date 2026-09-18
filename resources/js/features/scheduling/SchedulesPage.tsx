import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Search,
    Stethoscope,
    TicketCheck,
    Users,
    X,
} from 'lucide-react';

import { api } from '../../api/http';
import { DoctorSchedulePicker } from './DoctorSchedulePicker';


type DoctorSchedule = {
    id: number;
    schedule_date: string;
    start_time: string;
    end_time: string;
    status: string;

    doctor: {
        id: number;
        full_name: string;
        specialization: string | null;
    };

    hospital_unit: {
        id: number;
        name: string;
    };

    quotas: {
        id: number;
        channel: string;
        payer_group: string;
        quota_total: number;
        quota_used: number;
    }[];
};


export function SchedulesPage() {
    const [schedules, setSchedules] =
        useState<DoctorSchedule[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [pickerOpen, setPickerOpen] =
        useState(false);

    const [selected, setSelected] =
        useState<DoctorSchedule | null>(
            null,
        );

    const [search, setSearch] =
        useState('');

    const [statusFilter, setStatusFilter] =
        useState('ALL');


    function loadSchedules() {
        setLoading(true);
        setError(null);

        api<{
            data: DoctorSchedule[];
        }>('/api/doctor-schedules')
            .then((res) =>
                setSchedules(res.data),
            )
            .catch(() =>
                setError(
                    'Gagal memuat jadwal dokter.',
                ),
            )
            .finally(() =>
                setLoading(false),
            );
    }


    useEffect(() => {
        loadSchedules();
    }, []);


    const filteredSchedules =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            return schedules.filter(
                (schedule) => {
                    const matchesSearch =
                        !keyword ||
                        schedule.doctor
                            .full_name
                            .toLowerCase()
                            .includes(
                                keyword,
                            ) ||
                        schedule.hospital_unit
                            .name
                            .toLowerCase()
                            .includes(
                                keyword,
                            ) ||
                        (
                            schedule.doctor
                                .specialization ??
                            ''
                        )
                            .toLowerCase()
                            .includes(
                                keyword,
                            );

                    const matchesStatus =
                        statusFilter ===
                            'ALL' ||
                        schedule.status ===
                            statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                },
            );
        }, [
            schedules,
            search,
            statusFilter,
        ]);


    const statuses = useMemo(
        () =>
            Array.from(
                new Set(
                    schedules
                        .map(
                            (
                                schedule,
                            ) =>
                                schedule.status,
                        )
                        .filter(Boolean),
                ),
            ),
        [schedules],
    );


    const summary = useMemo(() => {
        let totalQuota = 0;
        let usedQuota = 0;

        schedules.forEach(
            (schedule) => {
                schedule.quotas.forEach(
                    (quota) => {
                        totalQuota +=
                            Number(
                                quota.quota_total,
                            ) || 0;

                        usedQuota +=
                            Number(
                                quota.quota_used,
                            ) || 0;
                    },
                );
            },
        );

        const activeSchedules =
            schedules.filter(
                (schedule) =>
                    isActiveStatus(
                        schedule.status,
                    ),
            ).length;

        return {
            totalSchedules:
                schedules.length,
            activeSchedules,
            totalQuota,
            remainingQuota:
                Math.max(
                    totalQuota -
                        usedQuota,
                    0,
                ),
        };
    }, [schedules]);


    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
            ">
                <div>
                    <h1 className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-slate-900
                    ">
                        Jadwal Dokter
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-slate-500
                    ">
                        Lihat jadwal praktik
                        dokter dan ketersediaan
                        kuota pelayanan.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setPickerOpen(true)
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#FFDF82]
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-[#093C5D]
                        shadow-sm
                        transition
                        hover:bg-[#F8D36A]
                    "
                >
                    <CalendarDays
                        size={17}
                    />

                    Lihat Jadwal & Kuota
                </button>
            </div>


            {/* SUMMARY */}
            <div className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
            ">
                <SummaryCard
                    icon={
                        CalendarDays
                    }
                    label="Total Jadwal"
                    value={
                        summary.totalSchedules
                    }
                    description="Jadwal yang tersedia"
                />

                <SummaryCard
                    icon={
                        CheckCircle2
                    }
                    label="Jadwal Aktif"
                    value={
                        summary.activeSchedules
                    }
                    description="Jadwal berstatus aktif"
                />

                <SummaryCard
                    icon={Users}
                    label="Total Kuota"
                    value={
                        summary.totalQuota
                    }
                    description="Kapasitas seluruh kanal"
                />

                <SummaryCard
                    icon={
                        TicketCheck
                    }
                    label="Sisa Kuota"
                    value={
                        summary.remainingQuota
                    }
                    description="Kuota yang masih tersedia"
                />
            </div>


            {/* SELECTED SCHEDULE */}
            {selected && (
                <div className="
                    flex
                    flex-col
                    gap-4
                    rounded-2xl
                    border
                    border-[#BCEFE5]
                    bg-[#F0FFFB]
                    p-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">
                    <div className="
                        flex
                        items-start
                        gap-3
                    ">
                        <div className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#DDF9F3]
                            text-[#087C70]
                        ">
                            <Stethoscope
                                size={18}
                            />
                        </div>

                        <div>
                            <p className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-[#087C70]
                            ">
                                Jadwal Terpilih
                            </p>

                            <p className="
                                mt-1
                                text-sm
                                font-semibold
                                text-slate-800
                            ">
                                {
                                    selected
                                        .doctor
                                        .full_name
                                }
                            </p>

                            <p className="
                                mt-0.5
                                text-xs
                                text-slate-500
                            ">
                                {
                                    selected
                                        .hospital_unit
                                        .name
                                }
                                {' • '}
                                {formatDate(
                                    selected.schedule_date,
                                )}
                                {' • '}
                                {formatTime(
                                    selected.start_time,
                                )}
                                {' – '}
                                {formatTime(
                                    selected.end_time,
                                )}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setSelected(
                                null,
                            )
                        }
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            self-start
                            rounded-lg
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-slate-500
                            transition
                            hover:bg-white
                            hover:text-red-500
                            sm:self-auto
                        "
                    >
                        <X size={14} />
                        Batalkan Pilihan
                    </button>
                </div>
            )}


            {/* TABLE CARD */}
            <div className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            ">
                {/* TABLE HEADER */}
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
                        Daftar Jadwal Dokter
                    </h2>

                    <p className="
                        mt-0.5
                        text-xs
                        text-slate-400
                    ">
                        Cari dan lihat jadwal
                        praktik dokter yang
                        tersedia.
                    </p>
                </div>


                {/* FILTER */}
                <div className="
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-slate-100
                    p-4
                    md:flex-row
                    md:items-center
                ">
                    <div className="
                        relative
                        flex-1
                    ">
                        <Search
                            size={16}
                            className="
                                absolute
                                left-3.5
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            value={search}
                            onChange={(
                                event,
                            ) =>
                                setSearch(
                                    event
                                        .target
                                        .value,
                                )
                            }
                            placeholder="Cari dokter, spesialisasi, atau unit..."
                            className="
                                h-10
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                pl-10
                                pr-10
                                text-sm
                                text-slate-700
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-[#5DDCC5]
                                focus:ring-2
                                focus:ring-[#5DF8D8]/20
                            "
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearch(
                                        '',
                                    )
                                }
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                    hover:text-slate-700
                                "
                            >
                                <X
                                    size={
                                        15
                                    }
                                />
                            </button>
                        )}
                    </div>

                    <select
                        value={
                            statusFilter
                        }
                        onChange={(
                            event,
                        ) =>
                            setStatusFilter(
                                event
                                    .target
                                    .value,
                            )
                        }
                        className="
                            h-10
                            min-w-[170px]
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-3
                            text-sm
                            text-slate-600
                            outline-none
                            focus:border-[#5DDCC5]
                            focus:ring-2
                            focus:ring-[#5DF8D8]/20
                        "
                    >
                        <option value="ALL">
                            Semua Status
                        </option>

                        {statuses.map(
                            (status) => (
                                <option
                                    key={
                                        status
                                    }
                                    value={
                                        status
                                    }
                                >
                                    {formatLabel(
                                        status,
                                    )}
                                </option>
                            ),
                        )}
                    </select>

                    {!loading &&
                        !error && (
                        <p className="
                            whitespace-nowrap
                            text-xs
                            text-slate-400
                        ">
                            <span className="
                                font-semibold
                                text-slate-600
                            ">
                                {
                                    filteredSchedules
                                        .length
                                }
                            </span>
                            {' '}
                            dari
                            {' '}
                            {
                                schedules.length
                            }
                            {' '}
                            jadwal
                        </p>
                    )}
                </div>


                {/* LOADING */}
                {loading && (
                    <div className="
                        flex
                        min-h-[280px]
                        flex-col
                        items-center
                        justify-center
                        gap-3
                    ">
                        <div className="
                            h-7
                            w-7
                            animate-spin
                            rounded-full
                            border-2
                            border-slate-200
                            border-t-[#093C5D]
                        " />

                        <p className="
                            text-xs
                            text-slate-400
                        ">
                            Memuat jadwal
                            dokter...
                        </p>
                    </div>
                )}


                {/* ERROR */}
                {!loading &&
                    error && (
                    <div className="
                        flex
                        min-h-[280px]
                        flex-col
                        items-center
                        justify-center
                        px-6
                        text-center
                    ">
                        <CalendarDays
                            size={30}
                            className="
                                text-red-300
                            "
                        />

                        <p className="
                            mt-3
                            text-sm
                            font-semibold
                            text-slate-700
                        ">
                            Jadwal tidak
                            dapat dimuat
                        </p>

                        <p className="
                            mt-1
                            text-xs
                            text-slate-400
                        ">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={
                                loadSchedules
                            }
                            className="
                                mt-4
                                rounded-lg
                                border
                                border-slate-200
                                px-3
                                py-2
                                text-xs
                                font-semibold
                                text-slate-600
                                hover:bg-slate-50
                            "
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}


                {/* EMPTY */}
                {!loading &&
                    !error &&
                    schedules.length ===
                        0 && (
                    <EmptyState
                        title="Belum ada jadwal dokter"
                        description="Data jadwal dokter belum tersedia pada sistem."
                    />
                )}


                {/* SEARCH EMPTY */}
                {!loading &&
                    !error &&
                    schedules.length >
                        0 &&
                    filteredSchedules.length ===
                        0 && (
                    <EmptyState
                        title="Jadwal tidak ditemukan"
                        description="Tidak ada jadwal yang sesuai dengan pencarian atau filter."
                    />
                )}


                {/* TABLE */}
                {!loading &&
                    !error &&
                    filteredSchedules.length >
                        0 && (
                    <div className="
                        overflow-x-auto
                    ">
                        <table className="
                            w-full
                            text-sm
                        ">
                            <thead className="
                                bg-slate-50
                            ">
                                <tr className="
                                    border-b
                                    border-slate-200
                                ">
                                    {[
                                        'Tanggal',
                                        'Dokter',
                                        'Unit / Poli',
                                        'Jam Praktik',
                                        'Kuota',
                                        'Status',
                                    ].map(
                                        (
                                            head,
                                        ) => (
                                            <th
                                                key={
                                                    head
                                                }
                                                className="
                                                    whitespace-nowrap
                                                    px-5
                                                    py-3.5
                                                    text-left
                                                    text-xs
                                                    font-semibold
                                                    text-slate-500
                                                "
                                            >
                                                {
                                                    head
                                                }
                                            </th>
                                        ),
                                    )}
                                </tr>
                            </thead>

                            <tbody className="
                                divide-y
                                divide-slate-100
                            ">
                                {filteredSchedules.map(
                                    (
                                        schedule,
                                    ) => {
                                        const quota =
                                            getQuotaSummary(
                                                schedule,
                                            );

                                        return (
                                            <tr
                                                key={
                                                    schedule.id
                                                }
                                                className="
                                                    transition
                                                    hover:bg-slate-50/70
                                                "
                                            >
                                                <td className="
                                                    whitespace-nowrap
                                                    px-5
                                                    py-4
                                                ">
                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    ">
                                                        <CalendarDays
                                                            size={
                                                                15
                                                            }
                                                            className="
                                                                text-slate-400
                                                            "
                                                        />

                                                        <span className="
                                                            font-medium
                                                            text-slate-700
                                                        ">
                                                            {formatDate(
                                                                schedule.schedule_date,
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">
                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    ">
                                                        <div className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            bg-[#E8FCF7]
                                                            text-[#087C70]
                                                        ">
                                                            <Stethoscope
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            <p className="
                                                                font-semibold
                                                                text-slate-800
                                                            ">
                                                                {
                                                                    schedule
                                                                        .doctor
                                                                        .full_name
                                                                }
                                                            </p>

                                                            <p className="
                                                                mt-0.5
                                                                text-xs
                                                                text-slate-400
                                                            ">
                                                                {schedule
                                                                    .doctor
                                                                    .specialization ||
                                                                    'Dokter'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="
                                                    px-5
                                                    py-4
                                                    text-slate-600
                                                ">
                                                    {
                                                        schedule
                                                            .hospital_unit
                                                            .name
                                                    }
                                                </td>

                                                <td className="
                                                    whitespace-nowrap
                                                    px-5
                                                    py-4
                                                ">
                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-slate-600
                                                    ">
                                                        <Clock3
                                                            size={
                                                                15
                                                            }
                                                            className="
                                                                text-slate-400
                                                            "
                                                        />

                                                        {formatTime(
                                                            schedule.start_time,
                                                        )}
                                                        {' – '}
                                                        {formatTime(
                                                            schedule.end_time,
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="
                                                    min-w-[180px]
                                                    px-5
                                                    py-4
                                                ">
                                                    <QuotaSummary
                                                        total={
                                                            quota.total
                                                        }
                                                        used={
                                                            quota.used
                                                        }
                                                    />
                                                </td>

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">
                                                    <StatusBadge
                                                        status={
                                                            schedule.status
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading &&
                    !error &&
                    schedules.length >
                        0 && (
                    <div className="
                        border-t
                        border-slate-100
                        bg-slate-50/50
                        px-5
                        py-3.5
                        text-xs
                        text-slate-400
                    ">
                        Menampilkan
                        {' '}
                        <span className="
                            font-semibold
                            text-slate-600
                        ">
                            {
                                filteredSchedules
                                    .length
                            }
                        </span>
                        {' '}
                        jadwal dokter
                    </div>
                )}
            </div>


            <DoctorSchedulePicker
                open={pickerOpen}
                onClose={() =>
                    setPickerOpen(false)
                }
                onSelect={(
                    schedule:
                        DoctorSchedule,
                ) => {
                    setSelected(
                        schedule,
                    );

                    loadSchedules();
                }}
            />
        </div>
    );
}


function SummaryCard({
    icon: Icon,
    label,
    value,
    description,
}: {
    icon: typeof CalendarDays;
    label: string;
    value: number;
    description: string;
}) {
    return (
        <div className="
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
        ">
            <div>
                <p className="
                    text-xs
                    font-medium
                    text-slate-500
                ">
                    {label}
                </p>

                <p className="
                    mt-1
                    text-2xl
                    font-bold
                    text-slate-900
                ">
                    {value}
                </p>

                <p className="
                    mt-1
                    text-[11px]
                    text-slate-400
                ">
                    {description}
                </p>
            </div>

            <div className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[#E8FCF7]
                text-[#087C70]
            ">
                <Icon size={19} />
            </div>
        </div>
    );
}


function QuotaSummary({
    total,
    used,
}: {
    total: number;
    used: number;
}) {
    const remaining =
        Math.max(
            total - used,
            0,
        );

    const percentage =
        total > 0
            ? Math.min(
                  (used / total) *
                      100,
                  100,
              )
            : 0;

    return (
        <div>
            <div className="
                flex
                items-center
                justify-between
                gap-3
                text-xs
            ">
                <span className="
                    font-semibold
                    text-slate-700
                ">
                    {used}/{total}
                    {' '}
                    terisi
                </span>

                <span className="
                    text-slate-400
                ">
                    {remaining}
                    {' '}
                    tersedia
                </span>
            </div>

            <div className="
                mt-2
                h-1.5
                overflow-hidden
                rounded-full
                bg-slate-100
            ">
                <div
                    className="
                        h-full
                        rounded-full
                        bg-[#5DDCC5]
                    "
                    style={{
                        width:
                            `${percentage}%`,
                    }}
                />
            </div>
        </div>
    );
}


function StatusBadge({
    status,
}: {
    status: string;
}) {
    const active =
        isActiveStatus(status);

    return (
        <span
            className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-xs
                font-medium
                ${
                    active
                        ? `
                            bg-emerald-50
                            text-emerald-700
                        `
                        : `
                            bg-slate-100
                            text-slate-600
                        `
                }
            `}
        >
            {formatLabel(status)}
        </span>
    );
}


function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="
            flex
            min-h-[280px]
            flex-col
            items-center
            justify-center
            px-6
            text-center
        ">
            <div className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-slate-100
                text-slate-400
            ">
                <CalendarDays
                    size={21}
                />
            </div>

            <p className="
                mt-3
                text-sm
                font-semibold
                text-slate-700
            ">
                {title}
            </p>

            <p className="
                mt-1
                text-xs
                text-slate-400
            ">
                {description}
            </p>
        </div>
    );
}


function getQuotaSummary(
    schedule: DoctorSchedule,
) {
    return schedule.quotas.reduce(
        (result, quota) => ({
            total:
                result.total +
                (Number(
                    quota.quota_total,
                ) || 0),

            used:
                result.used +
                (Number(
                    quota.quota_used,
                ) || 0),
        }),
        {
            total: 0,
            used: 0,
        },
    );
}


function formatDate(
    value: string,
) {
    if (!value) {
        return '-';
    }

    const date =
        new Date(
            `${value}T00:00:00`,
        );

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return value;
    }

    return new Intl.DateTimeFormat(
        'id-ID',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        },
    ).format(date);
}


function formatTime(
    value: string,
) {
    if (!value) {
        return '-';
    }

    return value.slice(0, 5);
}


function formatLabel(
    value?: string | null,
) {
    if (!value) {
        return '-';
    }

    return value
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(
            /\b\w/g,
            (letter: string) =>
                letter.toUpperCase(),
        );
}


function isActiveStatus(
    status: string,
) {
    return [
        'ACTIVE',
        'AKTIF',
        'AVAILABLE',
        'OPEN',
    ].includes(
        status.toUpperCase(),
    );
}