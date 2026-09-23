import React, { useState } from 'react';
import { api } from '../../api/http';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  registrationId: number | null;
  patientName: string;
}

export function BpjsVerificationModal({ isOpen, onClose, registrationId, patientName }: Props) {
  const [cardNo, setCardNo] = useState('0001234567890');
  const [loading, setLoading] = useState(false);
  const [verifiedData, setVerifiedData] = useState<any | null>(null);
  const [sepResult, setSepResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !registrationId) return null;

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api<{ data: any }>(`/api/registrations/${registrationId}/bpjs/verify`, {
        method: 'POST',
        body: JSON.stringify({ card_no: cardNo }),
      });
      setVerifiedData(res.data);
    } catch (err: any) {
      setError(err.message || 'Verifikasi nomor kartu gagal.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSep = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api<{ data: any }>(`/api/registrations/${registrationId}/bpjs/sep`, {
        method: 'POST',
        body: JSON.stringify({
          card_no: cardNo,
          patient_name: patientName,
        }),
      });
      setSepResult(res.data);
    } catch (err: any) {
      setError(err.message || 'Gagal menerbitkan SEP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b px-5 py-3.5 bg-blue-50">
          <h2 className="text-sm font-bold text-blue-900 flex items-center gap-2">
            <span>🛡</span> Verifikasi Kepesertaan BPJS & Terbit SEP
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {error && <div className="p-2.5 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}

          <div>
            <label className="font-semibold block mb-1 text-slate-700">Nomor Kartu BPJS / NIK</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cardNo}
                onChange={(e) => setCardNo(e.target.value)}
                placeholder="Masukkan 13 digit nomor BPJS"
                className="flex-1 rounded border border-slate-300 p-2 font-mono"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading && !verifiedData ? 'Mengecek...' : 'Cek Status'}
              </button>
            </div>
          </div>

          {verifiedData && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-slate-700">Status Kartu:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                  {verifiedData.participant_status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                <p>Nama: <strong>{verifiedData.participant_name}</strong></p>
                <p>Hak Kelas: <strong>{verifiedData.class_type}</strong></p>
                <p className="col-span-2">Faskes Tingkat 1: <strong>{verifiedData.registered_facility}</strong></p>
              </div>

              {!sepResult ? (
                <div className="pt-2 border-t mt-2">
                  <button
                    type="button"
                    onClick={handleCreateSep}
                    disabled={loading}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs"
                  >
                    {loading ? 'Menerbitkan...' : 'Terbitkan SEP Rawat Jalan'}
                  </button>
                </div>
              ) : (
                <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 space-y-1">
                  <p className="font-bold text-xs">✓ SEP Berhasil Diterbitkan!</p>
                  <p className="font-mono text-xs">Nomor SEP: {sepResult.sep_no}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded font-medium hover:bg-slate-300"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
