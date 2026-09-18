import React, { useState } from 'react';

interface PatientRecord {
  id: string;
  mrn: string;
  name: string;
  age: string;
  gender: string;
  poly: string;
  doctor: string;
  visitDate: string;
  diagnosis: string;
  vitals: { bp: string; pulse: string; temp: string };
  soap: { subjective: string; objective: string; assessment: string; plan: string };
  prescriptions: string[];
}

const ARCHIVED_RECORDS: PatientRecord[] = [
  {
    id: 'ENC-001',
    mrn: 'RM-2026-0891',
    name: 'Siti Aminah',
    age: '34 Tahun',
    gender: 'Perempuan',
    poly: 'Poli Umum',
    doctor: 'dr. Sava, Sp.PD',
    visitDate: '18 September 2026',
    diagnosis: 'J00 - Acute Nasopharyngitis (Common Cold)',
    vitals: { bp: '120/80 mmHg', pulse: '80 x/mnt', temp: '36.8 °C' },
    soap: {
      subjective: 'Pasien mengeluhkan batuk dan pilek sejak 2 hari yang lalu.',
      objective: 'Tenggorokan hiperemis (-), wheezing (-).',
      assessment: 'ISPA ringan.',
      plan: 'Istirahat cukup dan terapi simtomatik.',
    },
    prescriptions: ['Paracetamol 500mg 3x1', 'Vitamin C 500mg 1x1'],
  },
  {
    id: 'ENC-002',
    mrn: 'RM-2026-0892',
    name: 'Budi Santoso',
    age: '45 Tahun',
    gender: 'Laki-laki',
    poly: 'Poli Dalam',
    doctor: 'dr. Sava, Sp.PD',
    visitDate: '17 September 2026',
    diagnosis: 'I10 - Essential (Primary) Hypertension',
    vitals: { bp: '145/90 mmHg', pulse: '84 x/mnt', temp: '36.5 °C' },
    soap: {
      subjective: 'Kepala terasa berat di bagian tengkuk.',
      objective: 'TD 145/90 mmHg.',
      assessment: 'Hipertensi Grade 1.',
      plan: 'Edukasi diet rendah garam dan antihipertensi.',
    },
    prescriptions: ['Amlodipine 5mg 1x1 (Malam)'],
  },
];

export function MedicalRecordPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [activePrintType, setActivePrintType] = useState<'SICK_LEAVE' | 'MEDICAL_SUMMARY' | null>(null);

  const filteredRecords = ARCHIVED_RECORDS.filter(
    (r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.mrn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Modal Cetak (CSS Print Rule) */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header Halaman */}
      <div className="no-print">
        <h1 className="text-2xl font-bold text-slate-800">Arsip Rekam Medis Elekronik</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pencarian dokumen riwayat medis pasien terintegrasi dari Pelayanan Rawat Jalan.
        </p>
      </div>

      {/* TAMPILAN 1: DAFTAR ARSIP REKAM MEDIS */}
      {!selectedRecord ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm no-print">
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="font-bold text-slate-800 text-base">Arsip Riwayat Kunjungan Pasien</h2>
            <div className="w-full md:w-80">
              <input
                type="text"
                placeholder="Cari Nama / No. RM Pasien..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:bg-white focus:border-slate-300 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-slate-700 font-semibold border-t border-b border-slate-100 bg-white">
                <tr>
                  <th className="px-6 py-4">Tgl. Kunjungan</th>
                  <th className="px-6 py-4">No. RM</th>
                  <th className="px-6 py-4">Nama Pasien</th>
                  <th className="px-6 py-4">Poliklinik / Dokter</th>
                  <th className="px-6 py-4">Diagnosis Utama</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-5 text-slate-600 font-medium">{record.visitDate}</td>
                    <td className="px-6 py-5 font-mono font-bold text-slate-800">{record.mrn}</td>
                    <td className="px-6 py-5 font-bold text-slate-800">{record.name}</td>
                    <td className="px-6 py-5 text-slate-600">{record.poly}<br/><span className="text-xs text-slate-400">{record.doctor}</span></td>
                    <td className="px-6 py-5 text-slate-700 font-medium">{record.diagnosis}</td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:opacity-90"
                        style={{ background: '#FEEFAD', color: '#855B14' }}
                      >
                        Lihat Arsip RM →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAMPILAN 2: DETAIL REKAM MEDIS (READ-ONLY) & CETAK SURAT */
        <div className="space-y-6 no-print">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
                >
                  ← Kembali
                </button>
                <h2 className="text-xl font-bold text-slate-800">Rekam Medis: {selectedRecord.name}</h2>
                <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  🔒 READ-ONLY
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                No. RM: <span className="font-mono font-semibold text-slate-700">{selectedRecord.mrn}</span> | Usia: {selectedRecord.age} | DPJP: {selectedRecord.doctor}
              </p>
            </div>

            {/* Tombol Cetak Surat */}
            <div className="flex gap-2">
              <button
                onClick={() => setActivePrintType('SICK_LEAVE')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm"
              >
                📄 Cetak Surat Ket. Sakit
              </button>
              <button
                onClick={() => setActivePrintType('MEDICAL_SUMMARY')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-700 text-white hover:bg-sky-800 transition-colors shadow-sm"
              >
                🖨️ Cetak Ringkasan CPPT
              </button>
            </div>
          </div>

          {/* Tampilan Konten Rekam Medis Read-Only */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="border-b pb-4">
              <h3 className="text-sm font-bold text-slate-800 mb-2">1. Tanda-Tanda Vital</h3>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">Tekanan Darah: <b>{selectedRecord.vitals.bp}</b></div>
                <div className="p-3 bg-slate-50 rounded-xl">Nadi: <b>{selectedRecord.vitals.pulse}</b></div>
                <div className="p-3 bg-slate-50 rounded-xl">Suhu Tubuh: <b>{selectedRecord.vitals.temp}</b></div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-sm font-bold text-slate-800 mb-2">2. Catatan SOAP Dokter</h3>
              <div className="space-y-2 text-xs">
                <p><b>Subjective (S):</b> {selectedRecord.soap.subjective}</p>
                <p><b>Objective (O):</b> {selectedRecord.soap.objective}</p>
                <p><b>Assessment (A):</b> {selectedRecord.soap.assessment}</p>
                <p><b>Plan (P):</b> {selectedRecord.soap.plan}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-2">3. Diagnosis & Terapi Obat</h3>
              <p className="text-xs mb-2"><b>Diagnosis:</b> {selectedRecord.diagnosis}</p>
              <div className="text-xs">
                <b>Resep Obat:</b>
                <ul className="list-disc ml-5 mt-1 text-slate-600">
                  {selectedRecord.prescriptions.map((rx, idx) => (
                    <li key={idx}>{rx}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PREVIEW SURAT & FORMAT CETAK (Kertas A4 untuk di-Print) */}
      {/* ========================================================================= */}
      {activePrintType && selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            
            {/* Action Bar Modal */}
            <div className="flex justify-between items-center no-print border-b pb-3">
              <h3 className="font-bold text-slate-800">Preview Dokumen Cetak</h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
                >
                  🖨️ Cetak Sekarang
                </button>
                <button
                  onClick={() => setActivePrintType(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* AREA LEMBAR KERTAS SURAT (ID: printable-area) */}
            <div id="printable-area" className="p-8 border border-slate-300 rounded-lg bg-white text-black font-serif text-sm leading-relaxed">
              
              {/* KOP SURAT RUMAH SAKIT */}
              <div className="text-center border-b-2 border-black pb-4 mb-6">
                <h2 className="text-xl font-bold uppercase tracking-wide">RUMAH SAKIT UTAMA SEHAT</h2>
                <p className="text-xs font-sans">Jl. Raya Kesehatan No. 10, Surabaya | Telp: (031) 555-1234</p>
              </div>

              {/* FORMAT SURAT KETERANGAN SAKIT */}
              {activePrintType === 'SICK_LEAVE' && (
                <div className="space-y-4">
                  <h3 className="text-center font-bold text-base underline uppercase">SURAT KETERANGAN SAKIT</h3>
                  <p className="text-center text-xs -mt-3">No: 108/SK/RSU/{selectedRecord.id}</p>

                  <p className="mt-6">Yang bertanda tangan di bawah ini menerangkan bahwa:</p>
                  
                  <div className="ml-6 space-y-1 font-sans text-xs">
                    <p><span className="w-32 inline-block">Nama Pasien</span>: <b>{selectedRecord.name}</b></p>
                    <p><span className="w-32 inline-block">No. Rekam Medis</span>: {selectedRecord.mrn}</p>
                    <p><span className="w-32 inline-block">Umur / Gender</span>: {selectedRecord.age} / {selectedRecord.gender}</p>
                  </div>

                  <p className="mt-4">
                    Berhubungan dengan keadaan sakitnya, pasien tersebut di atas memerlukan istirahat berobat selama <b>2 (dua) hari</b> terhitung sejak tanggal <b>{selectedRecord.visitDate}</b>.
                  </p>

                  <div className="mt-12 flex justify-end">
                    <div className="text-center font-sans text-xs">
                      <p>Surabaya, {selectedRecord.visitDate}</p>
                      <p className="mb-16">Dokter Pemeriksa,</p>
                      <p className="font-bold underline">{selectedRecord.doctor}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* FORMAT RINGKASAN REKAM MEDIS (CPPT) */}
              {activePrintType === 'MEDICAL_SUMMARY' && (
                <div className="space-y-4 font-sans text-xs">
                  <h3 className="text-center font-bold text-base underline uppercase font-serif">RINGKASAN REKAM MEDIS RAWAT JALAN</h3>
                  
                  <div className="grid grid-cols-2 gap-2 border p-3 rounded bg-slate-50">
                    <p><b>Nama:</b> {selectedRecord.name}</p>
                    <p><b>No. RM:</b> {selectedRecord.mrn}</p>
                    <p><b>Tgl. Periksa:</b> {selectedRecord.visitDate}</p>
                    <p><b>Poliklinik:</b> {selectedRecord.poly}</p>
                  </div>

                  <div className="border p-3 rounded space-y-2">
                    <p className="font-bold border-b pb-1">HASIL PEMERIKSAAN MEDIS</p>
                    <p><b>Vital Signs:</b> TD {selectedRecord.vitals.bp}, Nadi {selectedRecord.vitals.pulse}, Suhu {selectedRecord.vitals.temp}</p>
                    <p><b>Keluhan (S):</b> {selectedRecord.soap.subjective}</p>
                    <p><b>Pemeriksaan (O):</b> {selectedRecord.soap.objective}</p>
                    <p><b>Diagnosis (A):</b> {selectedRecord.diagnosis}</p>
                    <p><b>Rencana (P):</b> {selectedRecord.soap.plan}</p>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <div className="text-center">
                      <p>Dokter Penanggung Jawab,</p>
                      <p className="mb-12"></p>
                      <p className="font-bold underline">{selectedRecord.doctor}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}