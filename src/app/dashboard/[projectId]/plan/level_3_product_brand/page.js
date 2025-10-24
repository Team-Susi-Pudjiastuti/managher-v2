'use client';

import { useState } from 'react';

export default function ConceptDevelopment() {
  // State untuk Dokumen Konsep Produk
  const [productName, setProductName] = useState('Kamera Travel Ringan Pro');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('Kamera ringan dengan AI untuk traveler pemula.');
  const [features, setFeatures] = useState(['Bobot hanya 200 gram']);
  const [benefits, setBenefits] = useState(['Bisa dibawa ke mana saja tanpa capek']);
  const [targetAudience, setTargetAudience] = useState('Traveler muda usia 18–35 tahun yang suka konten visual');

  // State untuk Uji Minat Calon Pelanggan
  const [respondents, setRespondents] = useState([
    { name: 'Bu Siti', interest: 3, comment: 'Cocok buat saya yang sering jalan-jalan' }
  ]);

  // State untuk Identitas Brand
  const [brandName, setBrandName] = useState('SnapEase');
  const [slogan, setSlogan] = useState('Capture Every Moment, Effortlessly');
  const [valueProp, setValueProp] = useState('Apa yang membuat brand-mu unik? Untuk siapa? Apa manfaat utamanya?');
  const [colorPalette, setColorPalette] = useState(['#F43F5E', '#F9FAFB', '#1F2937']);
  const [logoUrl, setLogoUrl] = useState('');

  // Fungsi tambah fitur & manfaat
  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const addBenefit = () => {
    setBenefits([...benefits, '']);
  };

  // Fungsi update fitur/manfaat
  const updateFeature = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  // Fungsi tambah responden
  const addRespondent = () => {
    setRespondents([...respondents, { name: '', interest: 3, comment: '' }]);
  };

  // Fungsi update responden
  const updateRespondent = (index, field, value) => {
    const newRespondents = [...respondents];
    newRespondents[index][field] = value;
    setRespondents(newRespondents);
  };

  // Hitung rata-rata minat
  const avgInterest = respondents.length > 0
    ? (respondents.reduce((sum, r) => sum + r.interest, 0) / respondents.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Bangun Konsep & Identitas Brand-mu</h1>
        <p className="text-gray-600 mt-2">
          Jelaskan produkmu, uji minat pelanggan, lalu bangun identitas brand yang kuat.
        </p>
      </div>

      {/* Layout 4 Kolom */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* KOL 1: FORM IDE - Dokumen Konsep Produk + Uji Minat */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dokumen Konsep Produk */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-pink-400">
            <h2 className="text-lg font-semibold text-pink-600 mb-4">1. Dokumen Konsep Produk</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Contoh: Kamera Travel Ringan Pro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Pilih kategori</option>
                  <option value="Teknologi">Teknologi</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Kesehatan">Kesehatan</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Singkat (1–2 kalimat)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Kamera ringan dengan AI untuk traveler pemula."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                rows="2"
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fitur Utama
                </label>
                <button
                  onClick={addFeature}
                  className="text-xs text-pink-600 hover:text-pink-800"
                >
                  + Tambah Fitur
                </button>
              </div>
              {features.map((feature, index) => (
                <input
                  key={index}
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder={`Contoh: Bobot hanya 200 gram`}
                  className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              ))}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Manfaat Utama
                </label>
                <button
                  onClick={addBenefit}
                  className="text-xs text-pink-600 hover:text-pink-800"
                >
                  + Tambah Manfaat
                </button>
              </div>
              {benefits.map((benefit, index) => (
                <input
                  key={index}
                  type="text"
                  value={benefit}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                  placeholder={`Contoh: Bisa dibawa ke mana saja tanpa capek`}
                  className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Pelanggan
              </label>
              <textarea
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Contoh: Traveler muda usia 18–35 tahun yang suka konten visual"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                rows="2"
              />
            </div>
          </div>

          {/* Uji Minat Calon Pelanggan */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-pink-400">
            <h3 className="font-semibold text-gray-800 mb-2">Uji Minat Calon Pelanggan (*Concept Testing*)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ajukan konsep produkmu ke minimal 3 orang dari target pelanggan. Mintalah mereka menilai minat mereka (1–5) dan berikan komentar.
            </p>

            {respondents.map((respondent, index) => (
              <div key={index} className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nama responden
                    </label>
                    <input
                      type="text"
                      value={respondent.name}
                      onChange={(e) => updateRespondent(index, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Minat (1–5)
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">1 = Tidak Minat</span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={respondent.interest}
                        onChange={(e) => updateRespondent(index, 'interest', parseInt(e.target.value))}
                        className="w-full mx-2 accent-pink-500"
                      />
                      <span className="text-xs text-gray-600">5 = Sangat Minat</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Komentar (opsional)
                  </label>
                  <textarea
                    value={respondent.comment}
                    onChange={(e) => updateRespondent(index, 'comment', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    rows="2"
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={addRespondent}
                className="text-xs text-pink-600 hover:text-pink-800"
              >
                + Tambah Responden
              </button>
              {respondents.length > 0 && (
                <button
                  onClick={() => setRespondents([])}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Hapus Semua
                </button>
              )}
            </div>
          </div>
        </div>

        {/* KOL 2: FORM BRAND - Identitas Brand */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-pink-400">
          <h2 className="text-lg font-semibold text-pink-600 mb-4">2. Identitas Brand</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Brand
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Contoh: SnapEase"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="Contoh: Capture Every Moment, Effortlessly"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value Proposition
            </label>
            <textarea
              value={valueProp}
              onChange={(e) => setValueProp(e.target.value)}
              placeholder="Apa yang membuat brand-mu unik? Untuk siapa? Apa manfaat utamanya?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              rows="3"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palet Warna Utama
            </label>
            <div className="flex space-x-2">
              {colorPalette.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    const newColors = [...colorPalette];
                    newColors[index] = prompt('Masukkan kode warna HEX (contoh: #FF5733)', color) || color;
                    setColorPalette(newColors);
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo (Optional)
            </label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="URL gambar logo (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Contoh: https://example.com/logo.png
            </p>
          </div>
        </div>

        {/* KOL 3: PREVIEW IDE - Preview Konsep Produk */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-pink-400">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📄 Preview Konsep Produk
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <strong>Nama Produk:</strong> {productName}
            </div>
            <div>
              <strong>Kategori:</strong> {category || '—'}
            </div>
            <div>
              <strong>Deskripsi:</strong> {description}
            </div>
            <div>
              <strong>Fitur:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                {features.map((f, i) => (
                  <li key={i}>{f || '—'}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Manfaat:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                {benefits.map((b, i) => (
                  <li key={i}>{b || '—'}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Target Pelanggan:</strong> {targetAudience}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <strong>Hasil Uji Minat (*Concept Testing*)</strong>
              <div className="text-xs text-gray-600 mt-1">
                {respondents.length} responden • Rata-rata minat: {avgInterest}/5
              </div>
            </div>
          </div>
        </div>

        {/* KOL 4: PREVIEW BRAND - Preview Identitas Brand */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-pink-400">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🎨 Preview Identitas Brand
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <strong>Nama Brand:</strong> {brandName}
            </div>
            <div>
              <strong>Slogan:</strong> {slogan}
            </div>
            <div>
              <strong>Value Proposition:</strong> {valueProp}
            </div>
            <div>
              <strong>Palet Warna:</strong>
              <div className="flex space-x-2 mt-2">
                {colorPalette.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            </div>
            {logoUrl && (
              <div>
                <strong>Logo:</strong>
                <div className="mt-2">
                  <img src={logoUrl} alt="Logo" className="h-12 w-auto border border-gray-200 rounded" />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Tombol Simpan & Lanjut */}
      <div className="mt-8 text-center">
        <button
          className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition duration-200"
        >
          Simpan & Lanjut ke Level Berikutnya
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        © 2025 ManagHer — Empowering Women Entrepreneurs 💖
      </div>
    </div>
  );
}