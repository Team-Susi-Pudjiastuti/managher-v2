'use client';

import { useState } from 'react';

export default function Home() {
  const [selectedInterest, setSelectedInterest] = useState('Makanan & Minuman');
  const [generatedIdeas, setGeneratedIdeas] = useState([
    {
      title: 'Gado-Gado Sehat',
      type: 'Produk Makanan Siap Saji',
      problem: 'Orang sibuk jarang makan sayur tapi butuh makanan cepat dan sehat.',
      solution: 'Mengolah gado-gado instan dengan sayuran segar dan saus kacang rendah gula.',
      target: 'Pekerja kantoran dan mahasiswa yang ingin makan sehat tanpa ribet.',
      description: 'Gado-gado kekinian siap saji dengan cita rasa tradisional dan kemasan praktis.',
      features: 'Sayur segar harian, bumbu homemade, tanpa MSG, bisa delivery.',
      benefit: 'Makan sehat jadi mudah, cepat, dan tetap lezat setiap hari.',
      price: 'Rp 25.000'
    },
    {
      title: 'Rujak Buah Premium',
      type: 'Jajanan Segar & Premium',
      problem: 'Rujak sering dianggap jajanan pinggir jalan dengan kebersihan kurang terjamin.',
      solution: 'Rujak buah higienis dalam kemasan eksklusif dengan sambal kacang khas.',
      target: 'Pecinta makanan segar dan pelanggan premium di kota besar.',
      description: 'Rujak sehat modern yang bisa dibawa ke kantor atau acara.',
      features: 'Buah premium, sambal fresh, kemasan elegan, bisa pre-order.',
      benefit: 'Nikmati sensasi segar khas Indonesia tanpa khawatir kebersihan.',
      price: 'Rp 30.000'
    },
    {
      title: 'Salad Nusantara',
      type: 'Makanan Sehat',
      problem: 'Salad biasa kurang cocok dengan lidah lokal Indonesia.',
      solution: 'Kombinasi sayur lokal dan buah tropis dengan saus khas Indonesia.',
      target: 'Kaum urban usia 18–35 yang peduli kesehatan dan segar.',
      description: 'Salad bergaya lokal dengan cita rasa asli dan segar.',
      features: 'Rasa lokal, bahan segar, dan saus khas Indonesia.',
      benefit: 'Camilan sehat yang tetap nikmat bagi lidah lokal.',
      price: 'Rp 28.000'
    }
  ]);

  const handleGenerate = () => {
    alert(`Ide produk untuk bidang "${selectedInterest}" telah dihasilkan!`);
  };

  return (
    <div className="min-h-screen bg-[#faf9fb] p-8 font-sans">

      {/* Layout Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 max-w-7xl mx-auto">

        {/* MAIN CONTENT */}
        <div>
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <span className="text-pink-500">💡</span>
              Generator Ide Produk Bisnis
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Pilih minatmu, dan temukan inspirasi produk nyata lengkap dengan detail bisnisnya!
            </p>
          </div>

          {/* Form Generate */}
          <div className="bg-white border border-pink-400 rounded-2xl shadow-sm p-6 mb-10 max-w-lg mx-auto">
            <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
              Bidang minatmu apa?
            </label>
            <select
              id="interest"
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="Makanan & Minuman">Makanan & Minuman</option>
              <option value="Fashion">Fashion</option>
              <option value="Teknologi">Teknologi</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Kesehatan">Kesehatan</option>
            </select>
            <button
              onClick={handleGenerate}
              className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              ✨ Generate Produk
            </button>
          </div>

          {/* Hasil Generate */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
              <span>🌸</span> Ide Produk untuk Kamu <span>🌸</span>
            </h2>
          </div>

          {/* Product Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedIdeas.map((idea, index) => (
              <div
                key={index}
                className="bg-white border border-pink-400 rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-pink-600 mb-3">{idea.title}</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Jenis:</strong> {idea.type}</p>
                  <p><strong>Problem:</strong> {idea.problem}</p>
                  <p><strong>Solusi:</strong> {idea.solution}</p>
                  <p><strong>Target:</strong> {idea.target}</p>
                  <p><strong>Fitur:</strong> {idea.features}</p>
                  <p><strong>Manfaat:</strong> {idea.benefit}</p>
                  <p><strong>Harga:</strong> {idea.price}</p>
                </div>
                <button className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200">
                  Gunakan Produk Ini
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TIPS & RESOURCE */}
        <aside className="bg-white border border-pink-400 rounded-2xl shadow-sm p-5 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💭 Tips & Resources</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-pink-50 rounded-lg border-l-4 border-pink-500">
              <h4 className="font-semibold text-pink-700">Tip #1</h4>
              <p className="text-gray-600">Fokus pada solusi masalah nyata, bukan hanya ide keren.</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-700">Tip #2</h4>
              <p className="text-gray-600">Uji pasar kecil dulu sebelum produksi massal.</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-700">Tip #3</h4>
              <p className="text-gray-600">Gunakan feedback pelanggan untuk iterasi produk.</p>
            </div>
            <div className="p-3 bg-teal-50 rounded-lg border-l-4 border-teal-500">
              <h4 className="font-semibold text-teal-700">Resource</h4>
              <p className="text-gray-600">Baca panduan “Startup dari Nol” di blog kami.</p>
              <a href="#" className="text-teal-500 underline text-xs mt-1 block">
                → Baca Selengkapnya
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}