import {
    useEffect,
    useState,
} from 'react';

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

function findQuota(
    quotas: Quota[],
    channel: Quota['channel'],
    payerGroup: Quota['payer_group'],
): Quota | undefined {
    return quotas.find(
        (quota) =>
            quota.channel === channel &&
            quota.payer_group === payerGroup,
    );
}

function QuotaCell({
    quota,
}: {
    quota: Quota | undefined;
}) {
    if (!quota) {
        return (
            <span className="text-slate-300 text-xs">
                —
            </span>
        );
    }

    const pct =
        quota.quota_total > 0
            ? quota.quota_used /
              quota.quota_total
            : 0;

    const color = quota.is_full
        ? 'bg-red-400'
        : pct >= 0.8
        ? 'bg-amber-400'
        : 'bg-green-400';

    return (
        <div className="flex flex-col items-center gap-0.5">
            <span className="font-mono text-xs text-slate-700">
                {quota.quota_used}/
                {quota.quota_total}
            </span>

            <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${color}`}
                    style={{
                        width: `${Math.min(
                            pct * 100,
                            100,
                        )}%`,
                    }}
                />
            </div>
        </div>
    );
}

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
        useState<string>('');

    const [date, setDate] = useState<string>(
        () =>
            new Date()
                .toISOString()
                .slice(0, 10),
    );

    const [search, setSearch] =
        useState<string>('');

    useEffect(() => {
        if (!open) {
            return;
        }

        api<{ data: HospitalUnit[] }>(
            '/api/hospital-units',
        )
            .then((res) =>
                setUnits(res.data),
            )
            .catch(() => {
                // dropdown filter tetap kosong kalau gagal, tidak fatal
            });
    }, [open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const controller =
            new AbortController();

        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        if (date) {
            params.set('date', date);
        }

        if (unitId) {
            params.set(
                'hospital_unit_id',
                unitId,
            );
        }

        api<{ data: DoctorSchedule[] }>(
            `/api/doctor-schedules?${params.toString()}`,
            { signal: controller.signal },
        )
            .then((res) =>
                setSchedules(res.data),
            )
            .catch((err) => {
                if (
                    err?.name === 'AbortError'
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

        return () => controller.abort();
    }, [open, date, unitId]);

    const filtered = schedules.filter(
        (schedule) => {
            if (!search) {
                return true;
            }

            const keyword =
                search.toLowerCase();

            return (
                schedule.doctor.full_name
                    .toLowerCase()
                    .includes(keyword) ||
                schedule.hospital_unit.name
                    .toLowerCase()
                    .includes(keyword)
            );
        },
    );

    return (
        <Modal
            open={open}
            title="Pilih Dokter & Jadwal"
            onClose={onClose}
        >
            <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    <select
                        value={unitId}
                        onChange={(event) =>
                            setUnitId(
                                event.target
                                    .value,
                            )
                        }
                        className="
                            border border-slate-200
                            rounded-lg px-3 py-2
                            text-sm
                        "
                    >
                        <option value="">
                            Semua Unit/Poli
                        </option>

                        {units.map((unit) => (
                            <option
                                key={unit.id}
                                value={unit.id}
                            >
                                {unit.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={date}
                        onChange={(event) =>
                            setDate(
                                event.target
                                    .value,
                            )
                        }
                        className="
                            border border-slate-200
                            rounded-lg px-3 py-2
                            text-sm
                        "
                    />

                    <input
                        placeholder="Cari nama dokter atau unit..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target
                                    .value,
                            )
                        }
                        className="
                            border border-slate-200
                            rounded-lg px-3 py-2
                            text-sm
                        "
                    />
                </div>

                {loading && (
                    <p className="text-sm text-slate-400 text-center py-6">
                        Memuat jadwal...
                    </p>
                )}

                {error && (
                    <p className="text-sm text-red-500 text-center py-6">
                        {error}
                    </p>
                )}

                {!loading &&
                    !error &&
                    filtered.length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-6">
                            Tidak ada jadwal
                            ditemukan.
                        </p>
                    )}

                {!loading &&
                    !error &&
                    filtered.length > 0 && (
                        <div className="overflow-x-auto rounded-lg border border-slate-100">
                            <table className="w-full text-xs">
                                <thead className="sticky top-0 z-10 bg-slate-50">
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        {[
                                            'Unit',
                                            'Dokter',
                                            'Jam',
                                            'Online Non-BPJS',
                                            'Online BPJS',
                                            'Onsite Non-BPJS',
                                            'Onsite BPJS',
                                            'Aksi',
                                        ].map(
                                            (
                                                head,
                                            ) => (
                                                <th
                                                    key={
                                                        head
                                                    }
                                                    className="
                                                        text-left px-3 py-2.5
                                                        font-semibold
                                                        text-slate-500
                                                        uppercase
                                                        tracking-wide
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

                                <tbody>
                                    {filtered.map(
                                        (
                                            schedule,
                                        ) => {
                                            const anyFull =
                                                schedule.quotas.some(
                                                    (
                                                        q,
                                                    ) =>
                                                        q.is_full,
                                                ) &&
                                                schedule.quotas.every(
                                                    (
                                                        q,
                                                    ) =>
                                                        q.is_full,
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        schedule.id
                                                    }
                                                    className="border-b border-slate-50 hover:bg-slate-50"
                                                >
                                                    <td className="px-3 py-2.5 font-medium text-slate-700">
                                                        {
                                                            schedule
                                                                .hospital_unit
                                                                .name
                                                        }
                                                    </td>

                                                    <td className="px-3 py-2.5 text-slate-800">
                                                        {
                                                            schedule
                                                                .doctor
                                                                .full_name
                                                        }
                                                    </td>

                                                    <td className="px-3 py-2.5 font-mono text-slate-600 whitespace-nowrap">
                                                        {
                                                            schedule.start_time
                                                        }
                                                        {
                                                            '–'
                                                        }
                                                        {
                                                            schedule.end_time
                                                        }
                                                    </td>

                                                    <td className="px-3 py-2.5 text-center">
                                                        <QuotaCell
                                                            quota={findQuota(
                                                                schedule.quotas,
                                                                'ONLINE',
                                                                'NON_BPJS',
                                                            )}
                                                        />
                                                    </td>

                                                    <td className="px-3 py-2.5 text-center">
                                                        <QuotaCell
                                                            quota={findQuota(
                                                                schedule.quotas,
                                                                'ONLINE',
                                                                'BPJS',
                                                            )}
                                                        />
                                                    </td>

                                                    <td className="px-3 py-2.5 text-center">
                                                        <QuotaCell
                                                            quota={findQuota(
                                                                schedule.quotas,
                                                                'ONSITE',
                                                                'NON_BPJS',
                                                            )}
                                                        />
                                                    </td>

                                                    <td className="px-3 py-2.5 text-center">
                                                        <QuotaCell
                                                            quota={findQuota(
                                                                schedule.quotas,
                                                                'ONSITE',
                                                                'BPJS',
                                                            )}
                                                        />
                                                    </td>

                                                    <td className="px-3 py-2.5">
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                anyFull
                                                            }
                                                            onClick={() => {
                                                                onSelect(
                                                                    schedule,
                                                                );

                                                                onClose();
                                                            }}
                                                            className="
                                                                px-3 py-1
                                                                rounded text-xs
                                                                font-medium
                                                                text-white
                                                                bg-[#093C5D]
                                                                disabled:opacity-40
                                                                disabled:cursor-not-allowed
                                                            "
                                                        >
                                                            Pilih
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
            </div>
        </Modal>
    );
}