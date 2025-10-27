'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChromePicker } from 'react-color';
import {
  Edit3,
  Target,
  Zap,
  Lightbulb,
  Award,
  BookOpen,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

// Helper: get initials
const getInitials = (name) => {
  if (!name || name.trim() === '') return 'NB';
  return name
    .trim()
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

// Helper: contrast text
const getContrastTextColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#111827' : '#ffffff';
};

export default function Level3Page() {
  const { projectId } = useParams();
  const router = useRouter();

  // Form state
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [price, setPrice] = useState('');

  // Palette
  const [palette, setPalette] = useState(['#F6E8D6']);
  const [activePickerIndex, setActivePickerIndex] = useState(0);
  const MAX_COLORS = 6;

  // Logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const logoUploadRef = useRef(null);

  // UI state
  const [isEditing, setIsEditing] = useState(true); // mulai dalam mode edit
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Palette handlers
  const updateColor = (idx, hex) => {
    setPalette((prev) => prev.map((c, i) => (i === idx ? hex : c)));
  };

  const addColor = () => {
    if (palette.length >= MAX_COLORS) return;
    setPalette((prev) => [...prev, '#D9C9B6']);
    setActivePickerIndex(palette.length);
  };

  const removeColor = (idx) => {
    if (palette.length <= 1) return;
    setPalette((prev) => prev.filter((_, i) => i !== idx));
    setActivePickerIndex(Math.max(0, activePickerIndex - 1));
  };

  // Logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Format gambar tidak didukung. Gunakan JPG, PNG, atau GIF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar terlalu besar. Maksimal 5MB.');
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Simpan ke localStorage
  const handleSave = () => {
    const data = {
      brandName,
      tagline,
      productName,
      productDesc,
      price,
      palette,
      logoPreview // base64 string
    };
    localStorage.setItem(`concept-${projectId}`, JSON.stringify(data));
    alert('Konsep brand berhasil disimpan! ✅');
  };

  const brandInitials = getInitials(brandName);

  if (!isMounted) {
    return <div className="min-h-screen bg-white p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white font-sans p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-2xl"></div>
          <div
            className="relative bg-white rounded-2xl border-t border-l border-black p-4 sm:p-5 md:p-6"
            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
          >
            <h1 className="text-xl sm:text-2xl font-bold text-[#f02d9c] mb-4 sm:mb-6">
              Level 3: Concept Development
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Kolom Kiri: Form Input */}
              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    {/* Brand Info */}
                    <div className="border border-gray-300 rounded-xl p-4 bg-[#fdf6f0]">
                      <h3 className="font-bold text-[#0a5f61] mb-3 flex items-center gap-2">
                        <Target size={16} /> Brand Info
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Nama Brand</label>
                          <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                            placeholder="Contoh: Intan Bakery"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Tagline</label>
                          <input
                            type="text"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                            placeholder="Contoh: crafted with love & sweetness"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="border border-gray-300 rounded-xl p-4 bg-[#f0f9f9]">
                      <h3 className="font-bold text-[#f02d9c] mb-3 flex items-center gap-2">
                        <Zap size={16} /> Product Info
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Nama Produk</label>
                          <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                            placeholder="Contoh: Sourdough Intan"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Deskripsi Singkat</label>
                          <textarea
                            value={productDesc}
                            onChange={(e) => setProductDesc(e.target.value)}
                            className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                            rows="3"
                            placeholder="Contoh: Roti artisan dengan aroma gandum asli..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Harga (opsional)</label>
                          <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                            placeholder="Contoh: 150000"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Upload Gambar Prototype</label>
                          <div
                            className="mt-1 border-2 border-dashed border-[#7a7a7a] rounded-lg p-3 text-center cursor-pointer hover:border-[#f02d9c]"
                            onClick={() => logoUploadRef.current?.click()}
                          >
                            {logoPreview ? (
                              <div className="relative w-full h-20 flex items-center justify-center">
                                <img src={logoPreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                              </div>
                            ) : (
                              <p className="text-sm text-[#5b5b5b]">Klik untuk upload (JPG/PNG/GIF, max 5MB)</p>
                            )}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/gif"
                              onChange={handleLogoUpload}
                              ref={logoUploadRef}
                              className="hidden"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Palette Editor */}
                    <div className="border border-gray-300 rounded-xl p-4 bg-white">
                      <h3 className="font-bold text-[#f02d9c] mb-3">Palette Editor</h3>
                      <p className="text-xs text-[#5b5b5b] mb-2">Warna pertama digunakan untuk logo brand.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {palette.map((color, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <button
                              onClick={() => setActivePickerIndex(i)}
                              className="w-8 h-8 rounded-full border border-[#7a7a7a]"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs">{color.toUpperCase()}</span>
                            <button
                              onClick={() => removeColor(i)}
                              disabled={palette.length <= 1}
                              className="text-xs text-red-500 disabled:opacity-40"
                            >
                              Hapus
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2">
                        <div className="text-xs text-[#5b5b5b] mb-2">Color Picker (aktif: warna {activePickerIndex + 1})</div>
                        <div className="bg-white p-2 border border-gray-300 rounded">
                          <ChromePicker
                            color={palette[activePickerIndex]}
                            onChangeComplete={(col) => updateColor(activePickerIndex, col.hex)}
                            disableAlpha
                          />
                        </div>
                        <button
                          onClick={addColor}
                          disabled={palette.length >= MAX_COLORS}
                          className="mt-2 px-3 py-1.5 text-xs bg-[#f02d9c] text-white rounded disabled:opacity-50"
                        >
                          + Tambah Warna
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Preview Mode — Semua dalam satu card */
                  <div className="p-4 border border-gray-300 rounded-xl bg-white shadow-sm">
                    <h3 className="font-bold text-[#5b5b5b] mb-3 flex items-center gap-2">
                      <Eye size={16} /> Brand & Product Preview
                    </h3>

                    {/* Brand Identity */}
                    <div className="p-3 mb-3 bg-[#fdf6f0] rounded border border-[#f0d5c2]">
                      <h4 className="font-bold text-[#0a5f61] text-sm mb-2">Brand Identity</h4>
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center rounded-lg"
                          style={{
                            width: 40,
                            height: 40,
                            backgroundColor: palette[0],
                            color: getContrastTextColor(palette[0]),
                          }}
                        >
                          <span className="text-xs font-medium">{brandInitials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{brandName || 'Nama Brand'}</p>
                          <p className="text-xs text-[#5b5b5b]">{tagline || 'Tagline Anda'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Kartu Produk */}
                    <div className="p-3 mb-3 bg-[#f0f9f9] rounded border border-[#c2e9e8]">
                      <h4 className="font-bold text-[#f02d9c] text-sm mb-2">Kartu Produk</h4>
                      <div className="flex items-start gap-3">
                        <div
                          className="flex items-center justify-center rounded-lg"
                          style={{
                            width: 40,
                            height: 40,
                            backgroundColor: palette[0],
                            color: getContrastTextColor(palette[0]),
                          }}
                        >
                          <span className="text-xs font-medium">{brandInitials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{productName || 'Nama Produk'}</p>
                          <p className="text-xs text-[#5b5b5b] mt-1">{productDesc || 'Deskripsi produk...'}</p>
                          {price && (
                            <p className="text-xs font-medium text-[#f02d9c] mt-1">
                              Rp {parseInt(price).toLocaleString('id-ID') || '0'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Gambar Prototype */}
                    <div>
                      <h4 className="font-bold text-[#5b5b5b] text-sm mb-2">Gambar Prototype</h4>
                      {logoPreview ? (
                        <div className="w-full h-24 rounded border border-[#ddd] overflow-hidden">
                          <img src={logoPreview} alt="Prototype" className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-full h-24 rounded border-2 border-dashed border-[#7a7a7a] flex items-center justify-center">
                          <p className="text-sm text-[#7a7a7a] text-center">
                            Upload gambar prototype<br />untuk melihat preview
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tombol Aksi */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2.5 bg-[#f02d9c] text-white font-medium rounded-lg border border-black hover:bg-pink-600 flex items-center gap-1"
                  >
                    <CheckCircle size={16} />
                    Simpan
                  </button>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2.5 bg-white text-[#f02d9c] font-medium rounded-lg border border-[#f02d9c] hover:bg-[#fdf6f0] flex items-center gap-1"
                  >
                    <Edit3 size={16} />
                    {isEditing ? 'Lihat Preview' : 'Edit'}
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/${projectId}/plan/level2`)}
                    className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/${projectId}/plan/level4`)}
                    className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg border border-black hover:bg-[#7abfc0] flex items-center gap-1"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Kolom Kanan: Tujuan, Tips, Resources */}
              <div className="space-y-5">
                <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                  <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-2">
                    <Lightbulb size={16} />
                    Tujuan Level 3
                  </h3>
                  <ul className="text-sm text-[#5b5b5b] list-disc pl-5 space-y-1">
                    <li>Mengembangkan identitas visual brand yang konsisten</li>
                    <li>Mendefinisikan nama, tagline, dan positioning produk</li>
                    <li>Menyusun elemen dasar brand untuk digunakan di tahap selanjutnya</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                  <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-2">
                    <Award size={16} />
                    Tips & Best Practice
                  </h3>
                  <ul className="text-sm text-[#5b5b5b] list-disc pl-5 space-y-1">
                    <li>Gunakan <strong>1–2 warna utama</strong> untuk konsistensi brand</li>
                    <li>Warna logo harus kontras dengan latar belakang</li>
                    <li>Tagline harus <strong>pendek, jelas, dan emosional</strong></li>
                    <li>Upload gambar prototype yang <strong>representatif</strong> (kemasan, UI, atau produk fisik)</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                  <h3 className="font-bold text-[#0a5f61] mb-3 flex items-center gap-2">
                    <BookOpen size={16} />
                    Resources Resmi
                  </h3>
                  <ul className="text-sm text-[#5b5b5b] space-y-2">
                    <li>
                      <a
                        href="https://www.strategyzer.com/canvas/value-proposition-canvas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f02d9c] hover:underline flex items-center gap-1"
                      >
                        Strategyzer: Value Proposition Design <ChevronRight size={12} />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://miro.com/templates/value-proposition-canvas/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f02d9c] hover:underline flex items-center gap-1"
                      >
                        Miro: Value Proposition Canvas Template <ChevronRight size={12} />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://perempuaninovasi.id/workshop"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f02d9c] hover:underline flex items-center gap-1"
                      >
                        Workshop Branding untuk UMKM <ChevronRight size={12} />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}