import React, { useState, useEffect } from 'react';
import { api } from '../../api/http';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (registration: any) => void;
  patient: {
    id: number;
    medical_record_no: string;
    full_name: string;
    birth_date: string;
    gender: string;
  } | null;
}

export function RegistrationModal({ isOpen, onClose, onSuccess, patient }: Props) {
  const [payers, setPayers] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [registrationDate, setRegistrationDate] = useState(new Date().toISOString().split('T')[0]);
  const [registrationTime, setRegistrationTime] = useState(new Date().toTimeString().split(' ')[0]);
  const [arrivalMethod, setArrivalMethod] = useState<'DATANG_SENDIRI' | 'RUJUKAN' | 'KASUS_POLISI'>('DATANG_SENDIRI');
  const [payerId, setPayerId] = useState<number | ''>('');
  const [hospitalUnitId, setHospitalUnitId] = useState<number | ''>('');
  const [doctorId, setDoctorId] = useState<number | ''>('');
  const [referralFacilityId, setReferralFacilityId] = useState<number | ''>('');
  const [referralNo, setReferralNo] = useState('');

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        api<{ data: any[] }>('/api/payers'),
        api<{ data: any[] }>('/api/hospital-units'),
        api<{ data: any[] }>('/api/doctors'),
        api<{ data: any[] }>('/api/healthcare-facilities'),
      ])
        .then(([p, u, d, f]) => {
          setPayers(p.data || []);
          setUnits(u.data || []);
          setDoctors(d.data || []);
          setFacilities(f.data || []);
        })
        .catch((err) => setError('Gagal load master data: ' + err.message));
    }
  }, [isOpen]);

  if (!isOpen || !patient) return null;

  const selectedPayer = payers.find((p) => p.id === Number(payerId));
  const isBpjs = selectedPayer?.name?.toUpperCase().includes('BPJS');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: any = {
        patient_id: patient.id,
        hospital_unit_id: Number(hospitalUnitId),
        doctor_id: Number(doctorId),
        payer_id: Number(payerId),
        arrival_method: arrivalMethod,
        registration_date: registrationDate,
        registration_time: registrationTime,
      };
      if (arrivalMethod === 'RUJUKAN') {
        payload.referral = {
          healthcare_facility_id: Number(referralFacilityId),
          referral_no: referralNo,
        };
      }
      const res = await api<{ data: any }>('/api/registrations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      onSuccess(res.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan pendaftaran.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-3.5 bg-slate-50">
          <h2 className="text-base font-bold text-slate-800">Pendaftaran Rawat Jalan</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && <div className="p-2.5 text-xs rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}

          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900">
            <span className="font-bold text-sm block">{patient.full_name} ({patient.medical_record_no})</span>
            Tgl Lahir: {patient.birth_date} • Jenis Kelamin: {patient.gender}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Tanggal</label>
              <input type="date" value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)} className="w-full rounded border border-slate-300 p-2" required />
            </div>
            <div>
              <label className="font-semibold block mb-1">Jam</label>
              <input type="time" value={registrationTime} onChange={(e) => setRegistrationTime(e.target.value)} className="w-full rounded border border-slate-300 p-2" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Poli Tujuan *</label>
              <select value={hospitalUnitId} onChange={(e) => setHospitalUnitId(Number(e.target.value))} className="w-full rounded border border-slate-300 p-2" required>
                <option value="">Pilih Poli</option>
                {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Dokter *</label>
              <select value={doctorId} onChange={(e) => setDoctorId(Number(e.target.value))} className="w-full rounded border border-slate-300 p-2" required>
                <option value="">Pilih Dokter</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.staff?.full_name || d.name || `Dokter #${d.id}`}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Metode Pembayaran *</label>
              <select value={payerId} onChange={(e) => setPayerId(Number(e.target.value))} className="w-full rounded border border-slate-300 p-2" required>
                <option value="">Pilih Penjamin</option>
                {payers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Cara Masuk *</label>
              <select value={arrivalMethod} onChange={(e) => setArrivalMethod(e.target.value as any)} className="w-full rounded border border-slate-300 p-2" required>
                <option value="DATANG_SENDIRI">Datang Sendiri</option>
                <option value="RUJUKAN">Rujukan</option>
                <option value="KASUS_POLISI">Kasus Polisi</option>
              </select>
            </div>
          </div>

          {arrivalMethod === 'RUJUKAN' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Surat Rujukan</span>
              <div className="grid grid-cols-2 gap-2">
                <select value={referralFacilityId} onChange={(e) => setReferralFacilityId(Number(e.target.value))} className="w-full rounded border border-slate-300 p-2" required>
                  <option value="">Pilih Faskes Perujuk</option>
                  {facilities.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <input type="text" placeholder="No. Surat Rujukan" value={referralNo} onChange={(e) => setReferralNo(e.target.value)} className="w-full rounded border border-slate-300 p-2" required />
              </div>
            </div>
          )}

          {isBpjs && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
              ℹ Pasien didaftarkan dengan jaminan <strong>BPJS</strong>. Modal verifikasi & SEP akan otomatis terbuka setelah form ini disimpan.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 text-xs text-slate-600 bg-slate-100 rounded hover:bg-slate-200">Batal</button>
            <button type="submit" disabled={submitting} className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded hover:bg-teal-700 disabled:opacity-50">
              {submitting ? 'Menyimpan...' : 'Simpan Pendaftaran'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}