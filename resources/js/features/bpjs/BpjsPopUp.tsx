import React, { useState } from 'react';

interface ParticipantData {
  card_no: string;
  participant_name: string;
  participant_status: string;
  registered_facility: string;
  class_type: string;
}

interface BpjsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSepGenerated?: (sepNo: string) => void;
  defaultCardNo?: string;
}

export function BpjsVerificationModal({
  isOpen,
  onClose,
  onSepGenerated,
  defaultCardNo = '0001234567890',
}: BpjsModalProps) {
  const [cardNo, setCardNo] = useState(defaultCardNo);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'CONNECTED' | 'FAILED'>('IDLE');
  const [participant, setParticipant] = useState<ParticipantData | null>(null);
  const [sepNumber, setSepNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (!cardNo.trim()) return;
    setStatus('LOADING');
    setErrorMessage('');
    setSepNumber(null);

    try {
      const response = await fetch('/api/bpjs/verify-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ card_no: cardNo }),
      });

      const result = await response.json();

      if (response.ok && result.data?.success) {
        setParticipant(result.data);
        setStatus('CONNECTED');
      } else {
        setStatus('FAILED');
        setErrorMessage(result.message || 'Kartu tidak aktif atau tidak ditemukan.');
      }
    } catch {
      setStatus('FAILED');
      setErrorMessage('Gagal menghubungi gateway BPJS.');
    }
  };

  const handleCreateSep = () => {
    const generatedSep = `SEP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;
    setSepNumber(generatedSep);
    if (onSepGenerated) {
      onSepGenerated(generatedSep);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 font-bold text-teal-600">
              BPJS
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Verifikasi Kepesertaan & SEP</h3>
              <p className="text-xs text-slate-500">Integrasi Gateway VClaim BPJS Kesehatan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Form Pengecekan */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Nomor Kartu BPJS / NIK
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cardNo}
                onChange={(e) => setCardNo(e.target.value)}
                placeholder="Masukkan 13 digit nomor kartu"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={status === 'LOADING'}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {status === 'LOADING' ? 'Mengecek...' : 'Cek Status'}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600">
              {errorMessage}
            </div>
          )}

          {/* Panel Hasil Verifikasi */}
          {participant && status === 'CONNECTED' && (
            <div className="space-y-3 rounded-xl border border-teal-100 bg-teal-50/50 p-4">
              <div className="flex items-center justify-between border-b border-teal-100 pb-2">
                <span className="text-xs font-semibold text-teal-900">Data Kepesertaan</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  {participant.participant_status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Nama:</span>
                  <p className="font-medium text-slate-800">{participant.participant_name}</p>
                </div>
                <div>
                  <span className="text-slate-500">Hak Kelas:</span>
                  <p className="font-medium text-slate-800">{participant.class_type}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Faskes Tingkat 1:</span>
                  <p className="font-medium text-slate-800">{participant.registered_facility}</p>
                </div>
              </div>

              {/* Status SEP */}
              <div className="mt-3 flex items-center justify-between border-t border-teal-100 pt-3">
                <div>
                  <span className="block text-[10px] text-slate-500">NOMOR SEP</span>
                  {sepNumber ? (
                    <span className="font-mono text-sm font-bold text-teal-800">{sepNumber}</span>
                  ) : (
                    <span className="text-xs italic text-slate-500">Belum terbit</span>
                  )}
                </div>

                {!sepNumber ? (
                  <button
                    type="button"
                    onClick={handleCreateSep}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                  >
                    Terbitkan SEP
                  </button>
                ) : (
                  <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
                    SEP Siap Digunakan
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Tutup
          </button>
          {sepNumber && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Simpan ke Pendaftaran
            </button>
          )}
        </div>
      </div>
    </div>
  );
}