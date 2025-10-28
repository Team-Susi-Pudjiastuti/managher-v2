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
  CheckCircle,
  Menu,
} from 'lucide-react';

// Komponen UI
import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';

// Zustand Store
import useProjectStore from '@/store/useProjectStore';

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

  // Zustand
  const projects = useProjectStore((state) => state.projects);
  const updateProject = useProjectStore((state) => state.updateProject);

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
  const [isEditing, setIsEditing] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [project, setProject] = useState(null);

  // Sidebar mobile
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Init
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (projectId) {
      const found = projects.find((p) => p.id === projectId);
      setProject(found);
      const saved = localStorage.getItem(`concept-${projectId}`);
      if (saved) {
        const data = JSON.parse(saved);
        setBrandName(data.brandName || '');
        setTagline(data.tagline || '');
        setProductName(data.productName || '');
        setProductDesc(data.productDesc || '');
        setPrice(data.price || '');
        setPalette(data.palette || ['#F6E8D6']);
        setLogoPreview(data.logoPreview || '');
      }
    }
  }, [projectId, projects]);

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

  // Simpan ke localStorage & store
  const handleSave = () => {
    const data = {
      brandName,
      tagline,
      productName,
      productDesc,
      price,
      palette,
      logoPreview,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`concept-${projectId}`, JSON.stringify(data));

    // Simpan ke Zustand store
    if (project) {
      const updatedLevels = [...(project.levels || [])];
      if (!updatedLevels[2]) {
        updatedLevels[2] = { id: 3, completed: false }; // ✅ Perbaikan: hapus koma & objek kosong
      }
      updatedLevels[2] = {
        ...updatedLevels[2],
        completed: !!brandName && !!productName,
        data: { concept: data },
      };
      updateProject(projectId, { levels: updatedLevels });
    }

    alert('Konsep brand berhasil disimpan! ✅');
  };

  const brandInitials = getInitials(brandName);

  // Breadcrumb items
  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
    { label: 'Level 3: Concept Development' },
  ];

  if (!isMounted) {
    return <div className="min-h-screen bg-white p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Breadcrumb */}
      <div className="px-3 sm:px-4 md:px-6 py-2 border-b border-gray-200 bg-white">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Mobile Header */}
      {isMobile && !mobileSidebarOpen && (
        <header className="p-3 flex items-center border-b border-gray-200 bg-white sticky top-10 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={20} className="text-[#5b5b5b]" />
          </button>
          <h1 className="ml-2 font-bold text-[#5b5b5b] text-base">Level 3: Concept Development</h1>
        </header>
      )}

      <div className="flex">
        {/* Sidebar */}
        <PlanSidebar
          projectId={projectId}
          currentLevelId={3}
          isMobile={isMobile}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1">
          <div className="py-6 px-3 sm:px-4 md:px-6">
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
                                <label className="block text-xs font-medium text-[#5b5b5b] mb-1">
                                  Nama Brand
                                </label>
                                <input
                                  type="text"
                                  value={brandName}
                                  onChange={(e) => setBrandName(e.target.value)}
                                  className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                  placeholder="Contoh: Intan Bakery"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-[#5b5b5b] mb-1">
                                  Tagline
                                </label>
                                <input
                                  type="text"
                                  value={tagline}
                                  onChange={(e) => setTagline(e.target.value)}
                                  className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                  placeholder="Contoh: crafted with love & sweetness"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-[#5b5b5b] mb-1">
                                  Upload Logo Brand
                                </label>
                                <div
                                  className="mt-1 border-2 border-dashed border-[#7a7a7a] rounded-lg p-3 text-center cursor-pointer hover:border-[#f02d9c]"
                                  onClick={() => logoUploadRef.current?.click()}
                                >
                                  {logoPreview ? (
                                    <div className="relative w-full h-20 flex items-center justify-center">
                                      <img
                                        src={logoPreview}
                                        alt="Logo Preview"
                                        className="max-h-full max-w-full object-contain"
                                      />
                                    </div>
                                  ) : (
                                    <p className="text-sm text-[#5b5b5b]">
                                      Klik untuk upload (JPG/PNG/GIF, max 5MB)
                                    </p>
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

                          {/* Product Info */}
                          <div className="border border-gray-300 rounded-xl p-4 bg-[#f0f9f9]">
                            <h3 className="font-bold text-[#f02d9c] mb-3 flex items-center gap-2">
                              <Zap size={16} /> Product Info
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-[#5b5b5b] mb-1">
                                  Nama Produk
                                </label>
                                <input
                                  type="text"
                                  value={productName}
                                  onChange={(e) => setProductName(e.target.value)}
                                  className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                  placeholder="Contoh: Sourdough Intan"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-[#5b5b5b] mb-1">
                                  Deskripsi Singkat
                                </label>
                                <textarea
                                  value={productDesc}
                                  onChange={(e) => setProductDesc(e.target.value)}
                                  className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                  rows="3"
                                  placeholder="Contoh: Roti artisan dengan aroma gandum asli..."
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-[#5b5b5b] mb-1">
                                  Harga (opsional)
                                </label>
                                <input
                                  type="text"
                                  value={price}
                                  onChange={(e) => setPrice(e.target.value)}
                                  className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                  placeholder="Contoh: 150000"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Palette Editor */}
                          <div className="border border-gray-300 rounded-xl p-4 bg-white">
                            <h3 className="font-bold text-[#f02d9c] mb-3">Palette Editor</h3>
                            <p className="text-xs text-[#5b5b5b] mb-2">
                              Warna pertama digunakan untuk logo brand.
                            </p>
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
                              <div className="text-xs text-[#5b5b5b] mb-2">
                                Color Picker (aktif: warna {activePickerIndex + 1})
                              </div>
                              <div className="bg-white p-2 border border-gray-300 rounded">
                                <ChromePicker
                                  color={palette[activePickerIndex]}
                                  onChangeComplete={(col) => updateColor(activePickerIndex, col.hex)}
                                  disableAlpha
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Preview Mode */
<div className="p-4 border border-gray-300 rounded-xl bg-white shadow-sm">
  <h3 className="font-bold text-[#5b5b5b] mb-3 flex items-center gap-2">
    <Eye size={16} /> Brand & Product Preview
  </h3>

  <div className="border rounded-xl overflow-hidden" style={{ backgroundColor: '#f0f2f5' }}>
    {/* Brand Identity */}
    <div
      className="p-4 border-b border-gray-200"
      style={{
        backgroundColor: palette[1] || palette[0], 
        color: getContrastTextColor(palette[1] || palette[0]), 
      }}
    >
      <h4 className="text-xs font-semibold text-[#5b5b5b] mb-2">Brand Identity Preview</h4>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: 48,
            height: 48,
            backgroundColor: palette[0], // First color for logo background
            color: getContrastTextColor(palette[0]),
          }}
        >
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Logo"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-sm font-bold">{brandInitials}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{brandName || 'Nama Brand'}</p>
          <p className="text-xs text-[#5b5b5b] truncate">{tagline || 'Tagline Anda'}</p>
        </div>
      </div>
    </div>

    {/* Product Card */}
    <div
      className="p-4 border-b border-gray-200"
      style={{
        backgroundColor: palette[1] || palette[0], // Use second color for background, fallback to first
        color: getContrastTextColor(palette[1] || palette[0]), // Ensure text is readable
      }}
    >
      <h4 className="text-xs font-semibold mb-2">Product Preview</h4>
      <div className="flex items-start gap-3">
        {/* Logo tetap ukuran 48x48, tidak menyusut */}
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: 48,
            height: 48,
            backgroundColor: palette[0], // First color for logo background
            color: getContrastTextColor(palette[0]),
          }}
        >
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Logo"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-sm font-bold">{brandInitials}</span>
          )}
        </div>

        {/* Teks: bisa panjang, tapi tidak mengganggu layout */}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm">{productName || 'Nama Produk'}</p>
          <p className="text-xs mt-1 whitespace-pre-wrap break-words">
            {productDesc || 'Deskripsi produk...'}
          </p>
          {price && (
            <p className="text-xs font-medium mt-1">
              Rp {parseInt(price).toLocaleString('id-ID') || '0'}
            </p>
          )}
        </div>
      </div>
    </div>

    {/* Removed: Gambar Prototype Preview */}
    {/* The entire section for "Gambar Prototype" has been deleted as per request */}
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
                          onClick={() => router.push(`/dashboard/${projectId}/plan/level_2_rww`)}
                          className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-1"
                        >
                          <ChevronLeft size={16} />
                          Prev
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/${projectId}/plan/level_4_lean_canvas`)}
                          className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg border border-black hover:bg-[#7abfc0] flex items-center gap-1"
                        >
                          Next
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Kolom Kanan: Edukasi */}
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
                          <li>Warna logo harus kontras dengan latar belakang</li>
                          <li>
                            Tagline harus <strong>pendek, jelas, dan emosional</strong>
                          </li>
                          <li>
                            Upload gambar prototype yang <strong>representatif</strong> (kemasan, UI, atau produk
                            fisik)
                          </li>
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
        </main>
      </div>
    </div>
  );
}