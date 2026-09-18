import {
    useEffect,
    useState,
} from 'react';

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
    const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    
    const [selected, setSelected] = useState<DoctorSchedule | null>(null);

    function loadSchedules() {
        setLoading(true);
        setError(null);

        api<{ data: DoctorSchedule[] }>('/api/doctor-schedules')
            .then((res) => setSchedules(res.data))
            .catch(() => setError('Gagal memuat jadwal dokter.'))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        loadSchedules();
    }, []);

    return (
        <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">
                        Jadwal Dokter
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Kelola jadwal dan kuota pelayanan dokter.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#093C5D]"
                >
                    Lihat Jadwal & Kuota
                </button>
            </div>

            {/* Kartu Ringkasan Jadwal Terpilih */}
            {selected && (
                <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-cyan-700 font-medium mb-0.5">
                            Jadwal Terpilih
                        </p>
                        <p className="text-sm text-slate-800">
                            {selected.doctor.full_name} — {selected.hospital_unit.name}
                        </p>
                        <p className="text-xs text-slate-500">
                            {selected.schedule_date} · {selected.start_time}–{selected.end_time}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelected(null)}
                        className="text-xs text-slate-400 hover:text-red-500"
                    >
                        ✕ Batal
                    </button>
                </div>
            )}

            {loading && (
                <p className="text-sm text-slate-400">
                    Memuat data...
                </p>
            )}

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

            {!loading && !error && schedules.length === 0 && (
                <p className="text-sm text-slate-400">
                    Belum ada jadwal dokter. Tambahkan lewat API dulu, atau tunggu form tambah jadwal dibuat.
                </p>
            )}

            {!loading && schedules.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm max-h-[500px] overflow-y-auto relative">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                {[
                                    'Tanggal',
                                    'Jam',
                                    'Unit',
                                    'Dokter',
                                    'Status',
                                ].map((head) => (
                                    <th
                                        key={head}
                                        className="sticky top-0 z-10 bg-slate-50 text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100"
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {schedules.map((schedule) => (
                                <tr
                                    key={schedule.id}
                                    className="border-b border-slate-50"
                                >
                                    <td className="px-4 py-3 text-slate-700">
                                        {schedule.schedule_date}
                                    </td>

                                    <td className="px-4 py-3 font-mono text-slate-600">
                                        {schedule.start_time} – {schedule.end_time}
                                    </td>

                                    <td className="px-4 py-3 text-slate-600">
                                        {schedule.hospital_unit.name}
                                    </td>

                                    <td className="px-4 py-3 text-slate-800">
                                        {schedule.doctor.full_name}
                                    </td>

                                    <td className="px-4 py-3 text-slate-500">
                                        {schedule.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Picker dengan update pada onSelect */}
            <DoctorSchedulePicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(schedule: DoctorSchedule) => {
                    setSelected(schedule);
                    loadSchedules(); 
                }}
            />
        </div>
    );
}