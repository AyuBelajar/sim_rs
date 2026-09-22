import React, { useState, useEffect } from 'react';

// Tipe data pasien antrean
interface PatientQueueItem {
  registration_id: number;
  no_antrean: string;
  no_rm: string;
  nama: string;
  umur: number;
  jenis_kelamin: string;
  penjamin: 'BPJS' | 'Umum';
  poli: string;
  status: 'Menunggu' | 'Dilayani' | 'Selesai';
}

// Data awal / mock antrean jika backend queue belum dipasang
const DEFAULT_QUEUE: PatientQueueItem[] = [
  {
    registration_id: 1,
    no_antrean: 'A-01',
    no_rm: '005548',
    nama: 'WAWAN GUNAWAN',
    umur: 63,
    jenis_kelamin: 'Laki-laki',
    penjamin: 'BPJS',
    poli: 'Poli Penyakit Dalam',
    status: 'Menunggu',
  },
  {
    registration_id: 2,
    no_antrean: 'A-02',
    no_rm: '006120',
    nama: 'SITI NURHALIZA',
    umur: 34,
    jenis_kelamin: 'Perempuan',
    penjamin: 'BPJS',
    poli: 'Poli Penyakit Dalam',
    status: 'Menunggu',
  },
  {
    registration_id: 3,
    no_antrean: 'A-03',
    no_rm: '007891',
    nama: 'BUDI SANTOSO',
    umur: 45,
    jenis_kelamin: 'Laki-laki',
    penjamin: 'Umum',
    poli: 'Poli Penyakit Dalam',
    status: 'Menunggu',
  },
];

export function NursingPage() {
  const [queue, setQueue] = useState<PatientQueueItem[]>(DEFAULT_QUEUE);
  const [selectedPatient, setSelectedPatient] = useState<PatientQueueItem>(DEFAULT_QUEUE[0]);

  const [formData, setFormData] = useState({
    keluhan_utama: '',
    riwayat_alergi: '',
    tekanan_darah: '120/80',
    detak_jantung: '80',
    suhu_badan: '36.5',
    nafas: '20',
    tinggi_badan: '165',
    berat_badan: '60',
    tingkat_kesadaran: 'Compos Mentis',
    skala_nyeri: '0',
    risiko_jatuh: 'Rendah',
    catatan_soap: '',
  });

  const [notif, setNotif] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ambil antrean real dari backend jika endpoint sudah tersedia
  useEffect(() => {
    fetch('/api/nursing/queue')
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData && resData.data && resData.data.length > 0) {
          setQueue(resData.data);
          setSelectedPatient(resData.data[0]);
        }
      })
      .catch(() => {
        // Fallback memakai default queue jika endpoint belum aktif
      });
  }, []);

  // Saat perawat klik tombol "Layani" pada baris antrean
  const handleSelectPatient = (patient: PatientQueueItem) => {
    setSelectedPatient(patient);
    setNotif('');
    setIsError(false);
    // Reset form untuk pasien baru
    setFormData({
      keluhan_utama: '',
      riwayat_alergi: '',
      tekanan_darah: '120/80',
      detak_jantung: '80',
      suhu_badan: '36.5',
      nafas: '20',
      tinggi_badan: '165',
      berat_badan: '60',
      tingkat_kesadaran: 'Compos Mentis',
      skala_nyeri: '0',
      risiko_jatuh: 'Rendah',
      catatan_soap: '',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotif('Menyimpan data Askep...');
    setIsError(false);

    const payload = {
      registration_id: selectedPatient.registration_id,
      keluhan_utama: formData.keluhan_utama.trim() || null,
      riwayat_alergi: formData.riwayat_alergi.trim() || null,
      tekanan_darah: formData.tekanan_darah.trim() || null,
      detak_jantung: formData.detak_jantung ? parseInt(formData.detak_jantung, 10) : null,
      suhu_badan: formData.suhu_badan ? parseFloat(formData.suhu_badan) : null,
      nafas: formData.nafas ? parseInt(formData.nafas, 10) : null,
      tinggi_badan: formData.tinggi_badan ? parseFloat(formData.tinggi_badan) : null,
      berat_badan: formData.berat_badan ? parseFloat(formData.berat_badan) : null,
      tingkat_kesadaran: formData.tingkat_kesadaran || null,
      skala_nyeri: formData.skala_nyeri !== '' ? parseInt(formData.skala_nyeri, 10) : 0,
      risiko_jatuh: formData.risiko_jatuh || null,
      catatan_soap: formData.catatan_soap.trim() || null,
    };

    try {
      const res = await fetch('/api/nursing/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let resData: any = {};
      try {
        resData = await res.json();
      } catch {
        resData = {};
      }

      if (res.ok) {
        setIsError(false);
        setNotif(`Askep untuk ${selectedPatient.nama} berhasil disimpan!`);
        // Update status pasien di antrean lokal menjadi "Dilayani"
        setQueue((prevQueue) =>
          prevQueue.map((item) =>
            item.registration_id === selectedPatient.registration_id
              ? { ...item, status: 'Dilayani' }
              : item
          )
        );
      } else {
        setIsError(true);
        const detail =
          resData.message ||
          (resData.errors ? Object.values(resData.errors).flat().join(', ') : 'Gagal menyimpan data.');
        setNotif(`Gagal: ${detail}`);
      }
    } catch {
      setIsError(true);
      setNotif('Terjadi kesalahan koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Pelayanan Askep Rawat Jalan</h1>
        <p className="text-xs text-slate-500">Pemeriksaan vital sign & skrining awal sebelum pasien diperiksa dokter</p>
      </div>

      {/* Main Grid: Kolom Antrean + Kolom Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* PANEL KIRI: DAFTAR ANTREAN PASIEN (4 Kolom) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Antrean Poli Hari Ini</h2>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {queue.length} Pasien
            </span>
          </div>

          <div className="space-y-2">
            {queue.map((item) => {
              const isSelected = item.registration_id === selectedPatient.registration_id;
              return (
                <div
                  key={item.registration_id}
                  className={`p-3 rounded-lg border transition text-xs flex flex-col gap-2 ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded text-[10px] mr-1.5">
                        {item.no_antrean}
                      </span>
                      <span className="font-mono text-slate-500 text-[10px]">{item.no_rm}</span>
                      <h3 className="font-bold text-slate-800 text-sm mt-0.5">{item.nama}</h3>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                        item.penjamin === 'BPJS'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.penjamin}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>{item.jenis_kelamin} • {item.umur} Thn</span>
                    <button
                      type="button"
                      onClick={() => handleSelectPatient(item)}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        isSelected
                          ? 'bg-teal-600 text-white cursor-default'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSelected ? 'Sedang Diisi' : 'Layani'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL KANAN: FORMULIR ASKEP (8 Kolom) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
          
          {/* Header Identitas Pasien Terpilih */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  No. RM: {selectedPatient.no_rm}
                </span>
                <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-1.5 rounded font-bold">
                  Antrean {selectedPatient.no_antrean}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedPatient.nama}</h3>
              <p className="text-slate-600 text-[11px]">
                {selectedPatient.jenis_kelamin} • {selectedPatient.umur} Tahun • Penjamin {selectedPatient.penjamin}
              </p>
            </div>
            <div className="text-left md:text-right border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
              <span className="text-[10px] text-slate-500 block">Poli / Klinik Tujuan:</span>
              <span className="font-semibold text-slate-800">{selectedPatient.poli}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Anamnesa */}
            <div className="space-y-2">
              <label className="block font-semibold text-slate-700">Keluhan Utama Pasien</label>
              <textarea
                name="keluhan_utama"
                rows={2}
                value={formData.keluhan_utama}
                onChange={handleChange}
                placeholder="Keluhan atau gejala yang dirasakan pasien hari ini..."
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">Riwayat Alergi (Obat / Makanan)</label>
              <input
                type="text"
                name="riwayat_alergi"
                value={formData.riwayat_alergi}
                onChange={handleChange}
                placeholder="Tidak ada alergi / Alergi Paracetamol / dsb."
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Tanda-tanda Vital */}
            <div>
              <span className="block font-semibold text-teal-800 mb-2">Tanda-Tanda Vital (TTV)</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                <div>
                  <label className="text-slate-500 block text-[10px]">Tekanan Darah</label>
                  <input
                    type="text"
                    name="tekanan_darah"
                    value={formData.tekanan_darah}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px]">Nadi (bpm)</label>
                  <input
                    type="number"
                    name="detak_jantung"
                    value={formData.detak_jantung}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px]">Suhu (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="suhu_badan"
                    value={formData.suhu_badan}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px]">Nafas (x/mnt)</label>
                  <input
                    type="number"
                    name="nafas"
                    value={formData.nafas}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px]">Tinggi (cm)</label>
                  <input
                    type="number"
                    name="tinggi_badan"
                    value={formData.tinggi_badan}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block text-[10px]">Berat (kg)</label>
                  <input
                    type="number"
                    name="berat_badan"
                    value={formData.berat_badan}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>
            </div>

            {/* Skrining Tambahan */}
            <div>
              <span className="block font-semibold text-teal-800 mb-2">Skrining Fungsional & Keselamatan</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Tingkat Kesadaran</label>
                  <select
                    name="tingkat_kesadaran"
                    value={formData.tingkat_kesadaran}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Compos Mentis">Compos Mentis (Sadar Penuh)</option>
                    <option value="Apatis">Apatis</option>
                    <option value="Somnolen">Somnolen</option>
                    <option value="Sopor">Sopor</option>
                    <option value="Koma">Koma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Skala Nyeri (0 - 10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    name="skala_nyeri"
                    value={formData.skala_nyeri}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    placeholder="0 (Tidak nyeri)"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Risiko Jatuh</label>
                  <select
                    name="risiko_jatuh"
                    value={formData.risiko_jatuh}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Rendah">Risiko Rendah</option>
                    <option value="Sedang">Risiko Sedang</option>
                    <option value="Tinggi">Risiko Tinggi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Catatan Perawat */}
            <div>
              <label className="block font-semibold text-slate-700">Catatan Evaluasi / SOAP Sederhana</label>
              <textarea
                name="catatan_soap"
                rows={2}
                value={formData.catatan_soap}
                onChange={handleChange}
                placeholder="Catatan observasi atau tindakan mandiri perawat..."
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            {notif && (
              <p
                className={`p-2.5 rounded-lg text-center font-medium ${
                  isError
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-teal-50 text-teal-700 border border-teal-200'
                }`}
              >
                {notif}
              </p>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                {loading ? 'Menyimpan...' : `Simpan Askep (${selectedPatient.nama})`}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}