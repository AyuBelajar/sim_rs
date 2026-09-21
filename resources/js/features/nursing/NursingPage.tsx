import React, { useState } from 'react';

export function NursingPage() {
  const [formData, setFormData] = useState({
    registration_id: 1,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotif('Menyimpan data...');
    setIsError(false);

    const payload = {
      registration_id: Number(formData.registration_id),
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
        setNotif('Data Askep Rawat Jalan berhasil tersimpan!');
      } else {
        setIsError(true);
        if (res.status === 404) {
          setNotif('Gagal (404): Rute API tidak ditemukan. Periksa rute Laravel Anda.');
        } else if (res.status === 422) {
          const detail = resData.errors
            ? Object.values(resData.errors).flat().join(', ')
            : resData.message || 'Validasi data gagal';
          setNotif(`Gagal Validasi (422): ${detail}`);
        } else {
          setNotif(`Gagal (${res.status}): ${resData.message || 'Terjadi kesalahan sistem.'}`);
        }
      }
    } catch {
      setIsError(true);
      setNotif('Terjadi kesalahan koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-800">Pelayanan Askep Rawat Jalan</h2>
        <p className="text-xs text-slate-500">Pencatatan anamnesa awal, tanda vital, dan skrining risiko</p>
      </div>

      {/* Ringkasan Identitas Pasien */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] font-mono text-slate-500 block uppercase">No. Rekam Medis: 005548</span>
          <h3 className="text-base font-bold text-slate-900">WAWAN GUNAWAN</h3>
          <p className="text-slate-600">Laki-laki • 63 Tahun • BPJS Kesehatan</p>
        </div>
        <div className="text-left md:text-right border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
          <span className="text-[10px] text-slate-500 block">Poli / Klinik Tujuan:</span>
          <span className="font-semibold text-slate-800">Poli Penyakit Dalam</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Anamnesa */}
        <div className="space-y-2">
          <label className="block font-semibold text-slate-700">Keluhan Utama</label>
          <textarea
            name="keluhan_utama"
            rows={2}
            value={formData.keluhan_utama}
            onChange={handleChange}
            placeholder="Keluhan yang dirasakan pasien..."
            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700">Riwayat Alergi</label>
          <input
            type="text"
            name="riwayat_alergi"
            value={formData.riwayat_alergi}
            onChange={handleChange}
            placeholder="Tidak ada / Obat / Makanan"
            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 outline-none"
          />
        </div>

        {/* Tanda-tanda Vital */}
        <div>
          <span className="block font-semibold text-teal-800 mb-2">Tanda-Tanda Vital (TTV)</span>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-slate-500">Tekanan Darah</label>
              <input
                type="text"
                name="tekanan_darah"
                value={formData.tekanan_darah}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="text-slate-500">Nadi (bpm)</label>
              <input
                type="number"
                name="detak_jantung"
                value={formData.detak_jantung}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="text-slate-500">Suhu (°C)</label>
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
              <label className="text-slate-500">Nafas (x/mnt)</label>
              <input
                type="number"
                name="nafas"
                value={formData.nafas}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="text-slate-500">Tinggi (cm)</label>
              <input
                type="number"
                name="tinggi_badan"
                value={formData.tinggi_badan}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="text-slate-500">Berat (kg)</label>
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

        {/* Skrining Cepat Tambahan */}
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
            placeholder="Catatan tindakan atau observasi perawat..."
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
            {loading ? 'Menyimpan...' : 'Simpan Askep'}
          </button>
        </div>
      </form>
    </div>
  );
}