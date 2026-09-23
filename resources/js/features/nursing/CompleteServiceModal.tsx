import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  encounterId: number;
  patientName: string;
  onSuccess: () => void;
}

export function CompleteServiceModal({ isOpen, onClose, encounterId, patientName, onSuccess }: Props) {
  const [exitType, setExitType] = useState('PULANG');
  const [exitCondition, setExitCondition] = useState('MEMBAIK');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const payload: any = {
      exit_type: exitType,
      exit_condition: exitCondition,
      notes: notes.trim() || null,
    };

    if (exitType === 'KONTROL_ULANG') {
      if (!followUpDate) {
        setErrorMsg('Tanggal kontrol wajib diisi!');
        setLoading(false);
        return;
      }
      payload.follow_up = {
        appointment_date: followUpDate,
        notes: followUpNotes.trim() || null,
      };
    }

    try {
      const res = await fetch(`/api/encounters/${encounterId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(resData.message || 'Gagal menyelesaikan pelayanan.');
      }
    } catch {
      setErrorMsg('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-sm font-bold text-slate-800">Selesaikan Pelayanan Pasien</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        <p className="text-slate-600">
          Pasien: <strong className="text-slate-900">{patientName}</strong>
        </p>

        {errorMsg && (
          <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status / Cara Keluar</label>
            <select
              value={exitType}
              onChange={(e) => setExitType(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none"
            >
              <option value="PULANG">Pulang (Selesai Pelayanan)</option>
              <option value="KONTROL_ULANG">Jadwalkan Kontrol Ulang</option>
              <option value="RUJUK_LANJUT">Rujuk Lanjut (Faskes Tingkat Lanjut)</option>
              <option value="RAWAT_INAP">Alih Rawat Inap (Opname)</option>
              <option value="MENINGGAL">Meninggal Dunia</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kondisi Saat Keluar</label>
            <select
              value={exitCondition}
              onChange={(e) => setExitCondition(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2"
            >
              <option value="MEMBAIK">Membaik</option>
              <option value="SEMBUH">Sembuh</option>
              <option value="TETAP">Belum Sembuh / Tetap</option>
              <option value="BURUK">Memburuk</option>
            </select>
          </div>

          {/* Conditional field jika butuh kontrol ulang */}
          {exitType === 'KONTROL_ULANG' && (
            <div className="bg-teal-50/50 p-3 rounded-lg border border-teal-200 space-y-2">
              <label className="block font-semibold text-teal-900">Rencana Tanggal Kontrol</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full border border-slate-300 bg-white rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Catatan instruksi kontrol (misal: bawa hasil lab)"
                value={followUpNotes}
                onChange={(e) => setFollowUpNotes(e.target.value)}
                className="w-full border border-slate-300 bg-white rounded-lg p-2 mt-1"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Edukasi pasien / pesan dokter & perawat..."
              className="w-full border border-slate-300 rounded-lg p-2 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Selesaikan Pelayanan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}