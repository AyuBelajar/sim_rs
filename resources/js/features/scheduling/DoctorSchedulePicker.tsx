import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Building2,
    CalendarDays,
    Clock3,
    Search,
    Stethoscope,
    TicketCheck,
    Users,
    X,
} from 'lucide-react';

import { Modal } from '../../components/ui/Modal';
import { api } from '../../api/http';


type Quota = {
    id: number;
    channel: 'ONLINE' | 'ONSITE';
    payer_group: 'BPJS' | 'NON_BPJS';
    quota_total: number;
    quota_used: number;
    is_full: boolean;
};


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

    quotas: Quota[];
};


type HospitalUnit = {
    id: number;
    name: string;
};


type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (
        schedule: DoctorSchedule,
    ) => void;
};


export function DoctorSchedulePicker({
    open,
    onClose,
    onSelect,
}: Props) {
    const [units, setUnits] =
        useState<HospitalUnit[]>([]);

    const [schedules, setSchedules] =
        useState<DoctorSchedule[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [unitId, setUnitId] =
        useState('');

    const [date, setDate] =
        useState(
            () =>
                new Date()
                    .toISOString()
                    .slice(0, 10),
        );

    const [search, setSearch] =
        useState('');


    // LOAD UNIT / POLI
    useEffect(() => {
        if (!open) {
            return;
        }

        api<{
            data: HospitalUnit[];
        }>('/api/hospital-units')
            .then((res) =>
                setUnits(res.data),
            )
            .catch(() => {
                // Filter unit tetap dapat
                // digunakan tanpa data unit.
            });
    }, [open]);


    // LOAD JADWAL
    useEffect(() => {
        if (!open) {
            return;
        }

        const controller =
            new AbortController();

        setLoading(true);
        setError(null);

        const params =
            new URLSearchParams();

        if (date) {
            params.set(
                'date',
                date,
            );
        }

        if (unitId) {
            params.set(
                'hospital_unit_id',
                unitId,
            );
        }

        api<{
            data: DoctorSchedule[];
        }>(
            `/api/doctor-schedules?${params.toString()}`,
            {
                signal:
                    controller.signal,
            },
        )
            .then((res) =>
                setSchedules(res.data),
            )
            .catch((err) => {
                if (
                    err?.name ===
                    'AbortError'
                ) {
                    return;
                }

                setError(
                    'Gagal memuat jadwal dokter.',
                );
            })
            .finally(() =>
                setLoading(false),
            );

        return () =>
            controller.abort();
    }, [
        open,
        date,
        unitId,
    ]);


    // SEARCH
    const filtered =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return schedules;
            }

            return schedules.filter(
                (schedule) =>
                    schedule.doctor
                        .full_name
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
                        ) ||
                    schedule.hospital_unit
                        .name
                        .toLowerCase()
                        .includes(
                            keyword,
                        ),
            );
        }, [
            schedules,
            search,
        ]);


    return (
        <Modal
            open={open}
            title="Pilih Dokter & Jadwal"
            onClose={onClose}
        >
            <div className="
                flex
                max-h-[calc(92vh-4rem)]
                flex-col
            ">
                {/* INTRO */}
                <div className="
                    border-b
                    border-slate-100
                    px-6
                    py-4
                ">
                    <p className="
                        text-sm
                        text-slate-500
                    ">
                        Pilih jadwal praktik
                        berdasarkan unit,
                        tanggal, dan
                        ketersediaan kuota.
                    </p>
                </div>


                {/* FILTER */}
                <div className="
                    border-b
                    border-slate-100
                    bg-slate-50/60
                    px-6
                    py-4
                ">
                    <div className="
                        grid
                        grid-cols-1
                        gap-3
                        md:grid-cols-3
                    ">
                        {/* UNIT */}
                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-semibold
                                text-slate-600
                            ">
                                Unit / Poli
                            </label>

                            <div className="
                                relative
                            ">
                                <Building2
                                    size={15}
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <select
                                    value={
                                        unitId
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setUnitId(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    className="
                                        h-10
                                        w-full
                                        appearance-none
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        pl-9
                                        pr-3
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        transition
                                        focus:border-[#5DDCC5]
                                        focus:ring-2
                                        focus:ring-[#5DDCC5]/20
                                    "
                                >
                                    <option value="">
                                        Semua Unit /
                                        Poli
                                    </option>

                                    {units.map(
                                        (
                                            unit,
                                        ) => (
                                            <option
                                                key={
                                                    unit.id
                                                }
                                                value={
                                                    unit.id
                                                }
                                            >
                                                {
                                                    unit.name
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                        </div>


                        {/* DATE */}
                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-semibold
                                text-slate-600
                            ">
                                Tanggal
                            </label>

                            <div className="
                                relative
                            ">
                                <CalendarDays
                                    size={15}
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <input
                                    type="date"
                                    value={
                                        date
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setDate(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    className="
                                        h-10
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        pl-9
                                        pr-3
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        transition
                                        focus:border-[#5DDCC5]
                                        focus:ring-2
                                        focus:ring-[#5DDCC5]/20
                                    "
                                />
                            </div>
                        </div>


                        {/* SEARCH */}
                        <div>
                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-semibold
                                text-slate-600
                            ">
                                Cari Jadwal
                            </label>

                            <div className="
                                relative
                            ">
                                <Search
                                    size={15}
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <input
                                    value={
                                        search
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setSearch(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    placeholder="Nama dokter atau unit..."
                                    className="
                                        h-10
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        pl-9
                                        pr-9
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-[#5DDCC5]
                                        focus:ring-2
                                        focus:ring-[#5DDCC5]/20
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
                                                14
                                            }
                                        />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {/* CONTENT */}
                <div className="
                    flex-1
                    overflow-y-auto
                    px-6
                    py-5
                ">
                    {/* LOADING */}
                    {loading && (
                        <div className="
                            flex
                            min-h-[300px]
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
                            min-h-[300px]
                            flex-col
                            items-center
                            justify-center
                            text-center
                        ">
                            <CalendarDays
                                size={28}
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
                                Jadwal gagal
                                dimuat
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-slate-400
                            ">
                                {error}
                            </p>
                        </div>
                    )}


                    {/* EMPTY */}
                    {!loading &&
                        !error &&
                        filtered.length ===
                            0 && (
                        <div className="
                            flex
                            min-h-[300px]
                            flex-col
                            items-center
                            justify-center
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
                                    size={
                                        21
                                    }
                                />
                            </div>

                            <p className="
                                mt-3
                                text-sm
                                font-semibold
                                text-slate-700
                            ">
                                Jadwal tidak
                                ditemukan
                            </p>

                            <p className="
                                mt-1
                                max-w-sm
                                text-xs
                                leading-5
                                text-slate-400
                            ">
                                Tidak ada
                                jadwal yang
                                sesuai dengan
                                unit, tanggal,
                                atau pencarian
                                yang dipilih.
                            </p>
                        </div>
                    )}


                    {/* SCHEDULES */}
                    {!loading &&
                        !error &&
                        filtered.length >
                            0 && (
                        <div className="
                            space-y-4
                        ">
                            <div className="
                                flex
                                items-center
                                justify-between
                            ">
                                <div>
                                    <p className="
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    ">
                                        Jadwal
                                        Tersedia
                                    </p>

                                    <p className="
                                        mt-0.5
                                        text-xs
                                        text-slate-400
                                    ">
                                        {
                                            filtered.length
                                        }
                                        {' '}
                                        jadwal
                                        ditemukan
                                    </p>
                                </div>

                                <span className="
                                    rounded-full
                                    bg-[#E8FCF7]
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-[#087C70]
                                ">
                                    {formatDate(
                                        date,
                                    )}
                                </span>
                            </div>


                            {filtered.map(
                                (
                                    schedule,
                                ) => {
                                    const total =
                                        getQuotaTotal(
                                            schedule.quotas,
                                        );

                                    const used =
                                        getQuotaUsed(
                                            schedule.quotas,
                                        );

                                    const remaining =
                                        Math.max(
                                            total -
                                                used,
                                            0,
                                        );

                                    const allQuotasFull =
                                        schedule
                                            .quotas
                                            .length >
                                            0 &&
                                        schedule.quotas.every(
                                            (
                                                quota,
                                            ) =>
                                                quota.is_full ||
                                                quota.quota_used >=
                                                    quota.quota_total,
                                        );

                                    return (
                                        <div
                                            key={
                                                schedule.id
                                            }
                                            className="
                                                overflow-hidden
                                                rounded-2xl
                                                border
                                                border-slate-200
                                                bg-white
                                                transition
                                                hover:border-[#AEEADF]
                                                hover:shadow-sm
                                            "
                                        >
                                            {/* DOCTOR HEADER */}
                                            <div className="
                                                flex
                                                flex-col
                                                gap-4
                                                border-b
                                                border-slate-100
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
                                                        h-11
                                                        w-11
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        bg-[#E8FCF7]
                                                        text-[#087C70]
                                                    ">
                                                        <Stethoscope
                                                            size={
                                                                19
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
                                                                'Dokter Umum'}
                                                        </p>

                                                        <div className="
                                                            mt-2
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            gap-x-4
                                                            gap-y-1
                                                            text-xs
                                                            text-slate-500
                                                        ">
                                                            <span className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                            ">
                                                                <Building2
                                                                    size={
                                                                        13
                                                                    }
                                                                />

                                                                {
                                                                    schedule
                                                                        .hospital_unit
                                                                        .name
                                                                }
                                                            </span>

                                                            <span className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                            ">
                                                                <Clock3
                                                                    size={
                                                                        13
                                                                    }
                                                                />

                                                                {formatTime(
                                                                    schedule.start_time,
                                                                )}
                                                                {' – '}
                                                                {formatTime(
                                                                    schedule.end_time,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    self-start
                                                    sm:self-auto
                                                ">
                                                    <span className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        bg-slate-100
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        text-slate-600
                                                    ">
                                                        <Users
                                                            size={
                                                                12
                                                            }
                                                        />

                                                        {
                                                            remaining
                                                        }
                                                        {' '}
                                                        tersedia
                                                    </span>
                                                </div>
                                            </div>


                                            {/* QUOTAS */}
                                            <div className="
                                                grid
                                                grid-cols-1
                                                gap-3
                                                bg-slate-50/60
                                                p-4
                                                sm:grid-cols-2
                                                lg:grid-cols-4
                                            ">
                                                <QuotaCard
                                                    title="Online Non-BPJS"
                                                    quota={findQuota(
                                                        schedule.quotas,
                                                        'ONLINE',
                                                        'NON_BPJS',
                                                    )}
                                                />

                                                <QuotaCard
                                                    title="Online BPJS"
                                                    quota={findQuota(
                                                        schedule.quotas,
                                                        'ONLINE',
                                                        'BPJS',
                                                    )}
                                                />

                                                <QuotaCard
                                                    title="Onsite Non-BPJS"
                                                    quota={findQuota(
                                                        schedule.quotas,
                                                        'ONSITE',
                                                        'NON_BPJS',
                                                    )}
                                                />

                                                <QuotaCard
                                                    title="Onsite BPJS"
                                                    quota={findQuota(
                                                        schedule.quotas,
                                                        'ONSITE',
                                                        'BPJS',
                                                    )}
                                                />
                                            </div>


                                            {/* ACTION */}
                                            <div className="
                                                flex
                                                flex-col
                                                gap-3
                                                border-t
                                                border-slate-100
                                                px-4
                                                py-3
                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                            ">
                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-xs
                                                    text-slate-400
                                                ">
                                                    <TicketCheck
                                                        size={
                                                            14
                                                        }
                                                    />

                                                    Total
                                                    {' '}
                                                    <span className="
                                                        font-semibold
                                                        text-slate-600
                                                    ">
                                                        {
                                                            used
                                                        }
                                                        /
                                                        {
                                                            total
                                                        }
                                                    </span>
                                                    {' '}
                                                    kuota
                                                    terisi
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        allQuotasFull
                                                    }
                                                    onClick={() => {
                                                        onSelect(
                                                            schedule,
                                                        );

                                                        onClose();
                                                    }}
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        bg-[#093C5D]
                                                        px-4
                                                        py-2
                                                        text-sm
                                                        font-semibold
                                                        text-white
                                                        transition
                                                        hover:bg-[#0C4D77]
                                                        disabled:cursor-not-allowed
                                                        disabled:bg-slate-200
                                                        disabled:text-slate-400
                                                    "
                                                >
                                                    {allQuotasFull
                                                        ? 'Kuota Penuh'
                                                        : 'Pilih Jadwal'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}


function findQuota(
    quotas: Quota[],
    channel: Quota['channel'],
    payerGroup:
        Quota['payer_group'],
): Quota | undefined {
    return quotas.find(
        (quota) =>
            quota.channel ===
                channel &&
            quota.payer_group ===
                payerGroup,
    );
}


function QuotaCard({
    title,
    quota,
}: {
    title: string;
    quota: Quota | undefined;
}) {
    if (!quota) {
        return (
            <div className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-3
            ">
                <p className="
                    text-xs
                    font-medium
                    text-slate-500
                ">
                    {title}
                </p>

                <p className="
                    mt-2
                    text-xs
                    text-slate-300
                ">
                    Kuota tidak tersedia
                </p>
            </div>
        );
    }

    const total =
        Number(
            quota.quota_total,
        ) || 0;

    const used =
        Number(
            quota.quota_used,
        ) || 0;

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

    const isFull =
        quota.is_full ||
        (total > 0 &&
            used >= total);

    return (
        <div className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-3
        ">
            <div className="
                flex
                items-start
                justify-between
                gap-2
            ">
                <p className="
                    text-xs
                    font-semibold
                    text-slate-600
                ">
                    {title}
                </p>

                {isFull && (
                    <span className="
                        rounded-full
                        bg-red-50
                        px-2
                        py-0.5
                        text-[10px]
                        font-semibold
                        text-red-600
                    ">
                        Penuh
                    </span>
                )}
            </div>

            <div className="
                mt-3
                flex
                items-end
                justify-between
                gap-2
            ">
                <div>
                    <p className="
                        text-base
                        font-bold
                        text-slate-800
                    ">
                        {used}/{total}
                    </p>

                    <p className="
                        text-[10px]
                        text-slate-400
                    ">
                        kuota terisi
                    </p>
                </div>

                <p className="
                    text-xs
                    font-medium
                    text-[#087C70]
                ">
                    {remaining}
                    {' '}
                    tersedia
                </p>
            </div>

            <div className="
                mt-3
                h-1.5
                overflow-hidden
                rounded-full
                bg-slate-100
            ">
                <div
                    className={
                        isFull
                            ? `
                                h-full
                                rounded-full
                                bg-red-400
                            `
                            : percentage >=
                              80
                            ? `
                                h-full
                                rounded-full
                                bg-amber-400
                            `
                            : `
                                h-full
                                rounded-full
                                bg-[#5DDCC5]
                            `
                    }
                    style={{
                        width:
                            `${percentage}%`,
                    }}
                />
            </div>
        </div>
    );
}


function getQuotaTotal(
    quotas: Quota[],
) {
    return quotas.reduce(
        (total, quota) =>
            total +
            (Number(
                quota.quota_total,
            ) || 0),
        0,
    );
}


function getQuotaUsed(
    quotas: Quota[],
) {
    return quotas.reduce(
        (total, quota) =>
            total +
            (Number(
                quota.quota_used,
            ) || 0),
        0,
    );
}


function formatTime(
    value: string,
) {
    if (!value) {
        return '-';
    }

    return value.slice(0, 5);
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