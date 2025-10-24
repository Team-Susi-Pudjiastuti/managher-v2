'use client';

import { useState } from 'react';

export default function RWW() {
  const [respondenName, setRespondenName] = useState('Bu Siti');
  const [hubungan, setHubungan] = useState('Calon pelanggan');
  const [responses, setResponses] = useState([]);

  // State untuk slider pertanyaan
  const [q1, setQ1] = useState(3);
  const [q2, setQ2] = useState(4);
  const [q3, setQ3] = useState(2);
  const [q4, setQ4] = useState(3);
  const [q5, setQ5] = useState(4);
  const [q6, setQ6] = useState(5);
  const [q7, setQ7] = useState(4);
  const [q8, setQ8] = useState(3);
  const [q9, setQ9] = useState(4);

  // State untuk kolom jelaskan (opsional)
  const [q1Note, setQ1Note] = useState('');
  const [q2Note, setQ2Note] = useState('');
  const [q3Note, setQ3Note] = useState('');
  const [q4Note, setQ4Note] = useState('');
  const [q5Note, setQ5Note] = useState('');
  const [q6Note, setQ6Note] = useState('');
  const [q7Note, setQ7Note] = useState('');
  const [q8Note, setQ8Note] = useState('');
  const [q9Note, setQ9Note] = useState('');

  const handleAddResponden = () => {
    const newResponse = {
      id: Date.now(),
      name: respondenName,
      relationship: hubungan,
      real: (q1 + q2 + q3) / 3,
      win: (q4 + q5 + q6) / 3,
      worth: (q7 + q8 + q9) / 3,
      total: ((q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q9) / 9).toFixed(1),
      notes: {
        q1: q1Note,
        q2: q2Note,
        q3: q3Note,
        q4: q4Note,
        q5: q5Note,
        q6: q6Note,
        q7: q7Note,
        q8: q8Note,
        q9: q9Note,
      },
    };

    setResponses([...responses, newResponse]);

    // Reset form
    setRespondenName('');
    setHubungan('');
    setQ1(3);
    setQ2(4);
    setQ3(2);
    setQ4(3);
    setQ5(4);
    setQ6(5);
    setQ7(4);
    setQ8(3);
    setQ9(4);
    setQ1Note('');
    setQ2Note('');
    setQ3Note('');
    setQ4Note('');
    setQ5Note('');
    setQ6Note('');
    setQ7Note('');
    setQ8Note('');
    setQ9Note('');
  };

  const handleDeleteResponden = (id) => {
    setResponses(responses.filter(r => r.id !== id));
  };

  const calculateAverages = () => {
    if (responses.length === 0) return { real: 0, win: 0, worth: 0, total: 0 };

    const totalReal = responses.reduce((sum, r) => sum + r.real, 0);
    const totalWin = responses.reduce((sum, r) => sum + r.win, 0);
    const totalWorth = responses.reduce((sum, r) => sum + r.worth, 0);
    const totalOverall = responses.reduce((sum, r) => sum + parseFloat(r.total), 0);

    return {
      real: (totalReal / responses.length).toFixed(1),
      win: (totalWin / responses.length).toFixed(1),
      worth: (totalWorth / responses.length).toFixed(1),
      total: (totalOverall / responses.length).toFixed(1),
    };
  };

  const averages = calculateAverages();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Validasi Idemu dengan Teknik RWW</h1>
        <p className="text-gray-600 mt-2">
          Kumpulkan feedback dari calon pelanggan atau mentor menggunakan skala 1–5.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">

        {/* Tambah Data Responden */}
        <div className="mb-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
          <h2 className="text-lg font-semibold text-pink-700 mb-4">Tambah Data Responden</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Responden (Optional)
              </label>
              <input
                type="text"
                value={respondenName}
                onChange={(e) => setRespondenName(e.target.value)}
                placeholder="Contoh: Bu Siti"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hubungan
              </label>
              <input
                type="text"
                value={hubungan}
                onChange={(e) => setHubungan(e.target.value)}
                placeholder="Contoh: Calon pelanggan"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* REAL — Apakah masalah ini nyata? */}
          <div className="mb-6">
            <h3 className="font-semibold text-pink-600 mb-2">✅ REAL — Apakah masalah ini nyata?</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  1. Seberapa sering Anda mengalami masalah ini?
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">1 = Tidak Pernah</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={q1}
                    onChange={(e) => setQ1(parseInt(e.target.value))}
                    className="w-full mx-2 accent-pink-500"
                  />
                  <span className="text-xs text-gray-600">5 = Sangat Sering</span>
                </div>
                <textarea
                  value={q1Note}
                  onChange={(e) => setQ1Note(e.target.value)}
                  placeholder="Opsional: Jelaskan..."
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  2. Seberapa penting solusi ini bagi Anda?
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">1 = Tidak Penting</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={q2}
                    onChange={(e) => setQ2(parseInt(e.target.value))}
                    className="w-full mx-2 accent-pink-500"
                  />
                  <span className="text-xs text-gray-600">5 = Sangat Penting</span>
                </div>
                <textarea
                  value={q2Note}
                  onChange={(e) => setQ2Note(e.target.value)}
                  placeholder="Opsional: Jelaskan..."
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  3. Pernahkah Anda mencari solusi serupa sebelumnya?
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">1 = Tidak Pernah</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={q3}
                    onChange={(e) => setQ3(parseInt(e.target.value))}
                    className="w-full mx-2 accent-pink-500"
                  />
                  <span className="text-xs text-gray-600">5 = Sudah Sering</span>
                </div>
                <textarea
                  value={q3Note}
                  onChange={(e) => setQ3Note(e.target.value)}
                  placeholder="Opsional: Jelaskan..."
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* WIN — Apakah solusi ini unggul? */}
          <div className="mb-6">
            <h3 className="font-semibold text-yellow-600 mb-2">🏆 WIN — Apakah solusi ini unggul?</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  4. Seberapa unik solusi ini dibanding yang ada?
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">1 = Tidak Unik</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={q4}
                    onChange={(e) => setQ4(parseInt(e.target.value))}
                    className="w-full mx-2 accent-pink-500"
                  />
                  <span className="text-xs text-gray-600">5 = Sangat Unik</span>
                </div>
                <textarea
                  value={q4Note}
                  onChange={(e) => setQ4Note(e.target.value)}
                  placeholder="Opsional: Jelaskan..."
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  5. Apakah solusi ini lebih mudah digunakan?
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">1 = Tidak Mudah</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={q5}
                    onChange={(e) => setQ5(parseInt(e.target.value))}
                    className="w-full mx-2 accent-pink-500"
                  />
                  <span className="text-xs text-gray-600">5 = Sangat Mudah</span>
                </div>
                <textarea
                  value={q5Note}
                  onChange={(e) => setQ5Note(e.target.value)}
                  placeholder="Opsional: Jelaskan..."
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  6. Seberapa besar kepercayaan Anda terhadap kualitasnya?
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">1 = Tidak Percaya</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={q6}
                    onChange={(e) => setQ6(parseInt(e.target.value))}
                    className="w-full mx-2 accent-pink-500"
                  />
                  <span className="text-xs text-gray-600">5 = Sangat Percaya</span>
                </div>
                <textarea
                  value={q6Note}
                  onChange={(e) => setQ6Note(e.target.value)}
                  placeholder="Opsional: Jelaskan..."
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* WORTH — Apakah layak secara bisnis? */}
          <div className="mb-6">
            <h3 className="font-semibold text-blue-600 mb-2">💰 WORTH — Apakah layak secara bisnis?</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  7. Seberapa besar kemungkinan Anda membeli produk ini?
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">1 = Tidak Mau</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={q7}
                    onChange={(e) => setQ7(parseInt(e.target.value))}
                    className="w-full mx-2 accent-pink-500"
                  />
                  <span className="text-xs text-gray-600">5 = Pasti Beli</span>
                </div>
                <textarea
                  value={q7Note}
                  onChange={(e) => setQ7Note(e.target.value)}
                  placeholder="Opsional: Jelaskan..."
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  8. Apakah harganya sebanding dengan manfaatnya?
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">1 = Tidak Sebanding</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={q8}
                    onChange={(e) => setQ8(parseInt(e.target.value))}
                    className="w-full mx-2 accent-pink-500"
                  />
                  <span className="text-xs text-gray-600">5 = Sangat Sebanding</span>
                </div>
                <textarea
                  value={q8Note}
                  onChange={(e) => setQ8Note(e.target.value)}
                  placeholder="Opsional: Jelaskan..."
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  9. Seberapa besar Anda merekomendasikan bisnis ini?
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">1 = Tidak Rekomendasi</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={q9}
                    onChange={(e) => setQ9(parseInt(e.target.value))}
                    className="w-full mx-2 accent-pink-500"
                  />
                  <span className="text-xs text-gray-600">5 = Sangat Rekomendasi</span>
                </div>
                <textarea
                  value={q9Note}
                  onChange={(e) => setQ9Note(e.target.value)}
                  placeholder="Opsional: Jelaskan..."
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleAddResponden}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Tambah ke Tabel Responden
          </button>
        </div>

        {/* Daftar Responden */}
        {responses.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Daftar Responden ({responses.length})</h2>
              <button
                onClick={() => setResponses([])}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Hapus Semua
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Responden</th>
                    <th className="px-4 py-2 text-center">REAL</th>
                    <th className="px-4 py-2 text-center">WIN</th>
                    <th className="px-4 py-2 text-center">WORTH</th>
                    <th className="px-4 py-2 text-center">Total</th>
                    <th className="px-4 py-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((r) => (
                    <tr key={r.id} className="border-t border-gray-200 hover:bg-gray-100">
                      <td className="px-4 py-3">
                        <div>{r.name}</div>
                        <div className="text-xs text-gray-500">{r.relationship}</div>
                      </td>
                      <td className="px-4 py-3 text-center">{r.real.toFixed(1)}</td>
                      <td className="px-4 py-3 text-center">{r.win.toFixed(1)}</td>
                      <td className="px-4 py-3 text-center">{r.worth.toFixed(1)}</td>
                      <td className="px-4 py-3 text-center">{r.total}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDeleteResponden(r.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ringkasan Validasi Ide */}
        {responses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📊 Ringkasan Validasi Ide
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">{averages.real}</div>
                <div className="text-sm text-gray-600">Rata-rata REAL</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{averages.win}</div>
                <div className="text-sm text-gray-600">Rata-rata WIN</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{averages.worth}</div>
                <div className="text-sm text-gray-600">Rata-rata WORTH</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{averages.total}</div>
                <div className="text-sm text-gray-600">Rata-rata Total</div>
              </div>
            </div>

            {/* Rekomendasi */}
            <div className="text-center mb-6">
              {parseFloat(averages.total) >= 3.5 ? (
                <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                  ✅ IDE BAIK — SIAP DILANJUTKAN
                </div>
              ) : (
                <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">
                  ⚠️ PERLU PENYEMPURNAAN
                </div>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition">
                Salin Tautan Bagikan
              </button>
              <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition">
                Simpan & Lanjut ke Level Berikutnya
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}