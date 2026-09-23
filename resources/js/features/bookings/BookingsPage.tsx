import { useCallback, useEffect, useState, type FormEvent } from 'react';

import { ApiError } from '../../api/http';

import { getBookings } from './bookingApi';
import { BookingFormModal } from './BookingFormModal';
import type { Booking } from './types';

const STATUS_LABEL: Record<string, string> = {
    WAITING: 'Menunggu',
    REGISTERED: 'Selesai',
    CANCELLED: 'Dibatalkan',
};

const STATUS_CLASS: Record<string, string> = {
    WAITING: 'bg-amber-50 text-amber-700',
    REGISTERED: 'bg-emerald-50 text-emerald-700',
    CANCELLED: 'bg-slate-100 text-slate-500',
};

export function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [meta, setMeta] = useState<{ total: number; from: number | null; to: number | null } | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [status, setStatus] = useState('');

    const [formOpen, setFormOpen] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getBookings({
                search: search || undefined,
                date: date || undefined,
                status: status || undefined,
                perPage: 10,
            });
            setBookings(response.data);
            setMeta(response.meta);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Gagal mengambil data booking.');
        } finally {
            setLoading(false);
        }
    }, [search, date, status]);

    useEffect(() => {
        load();
    }, [load]);

    function handleSearch(event: FormEvent) {
        event.preventDefault();
        setSearch(searchInput.trim());
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Booking Rawat Jalan</h1>
                    <p className="mt-1 text-sm text-slate-500">Kelola jadwal kunjungan pasien rawat jalan.</p>
                </div>

                <button
                    onClick={() => setFormOpen(true)}
                    className="rounded-lg px-4 py-2.5 text-sm font-semibold"
                    style={{ background: '#FFDF82', color: '#093C5D' }}
                >
                    + Buat Booking
                </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Cari pasien atau kode booking"
                        className="flex-1 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm"
                    />
                    <button className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                        Cari
                    </button>
                </form>

                <div className="mt-4 grid grid-cols-2 gap-4 md:w-1/2">
                    <div>
                        <label className="text-xs font-medium text-slate-500">Tanggal Kunjungan</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-500">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        >
                            <option value="">Semua Status</option>
                            <option value="WAITING">Menunggu</option>
                            <option value="REGISTERED">Selesai</option>
                            <option value="CANCELLED">Dibatalkan</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                {meta && (
                    <p className="border-b border-slate-100 px-5 py-3 text-sm text-slate-500">
                        {meta.total} booking ditemukan
                    </p>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-slate-50">
                            <tr>
                                <th className="px-5 py-3 text-left font-medium text-slate-500">Kode Booking</th>
                                <th className="px-5 py-3 text-left font-medium text-slate-500">Pasien</th>
                                <th className="px-5 py-3 text-left font-medium text-slate-500">Dokter</th>
                                <th className="px-5 py-3 text-left font-medium text-slate-500">Jadwal</th>
                                <th className="px-5 py-3 text-left font-medium text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400">Memuat data...</td>
                                </tr>
                            ) : bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <tr key={booking.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                        <td className="px-5 py-4 font-medium text-slate-800">{booking.booking_code}</td>
                                        <td className="px-5 py-4">{booking.patient?.full_name ?? '-'}</td>
                                        <td className="px-5 py-4">{booking.doctor?.display_name ?? '-'}</td>
                                        <td className="px-5 py-4">{booking.visit_time ?? '-'}</td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded px-2 py-1 text-xs font-medium ${STATUS_CLASS[booking.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                                {STATUS_LABEL[booking.status] ?? booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-slate-400">Belum ada booking untuk tanggal ini.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <BookingFormModal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSaved={load}
            />
        </div>
    );
}
