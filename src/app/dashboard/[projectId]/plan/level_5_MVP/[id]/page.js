'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Edit3,
  Target,
  Lightbulb,
  BookOpen,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Menu,
  Plus,
  ImageIcon,
  X,
  Camera,
  FileText,
  Trash2,
  DollarSign,
  Award,
  Zap,
} from 'lucide-react';

import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';
import NotificationModalPlan from '@/components/NotificationModalPlan';
import { usePrototypeStore } from '@/store/usePrototypeStore';
import useProjectStore from '@/store/useProjectStore';
import Confetti from '@/components/Confetti';

// === PROGRESS BAR ===
const PhaseProgressBar = ({ currentXp, totalXp }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const calculatedProgress = totalXp > 0 ? Math.min(100, Math.floor((currentXp / totalXp) * 100)) : 0;
    setProgress(calculatedProgress);
  }, [currentXp, totalXp]);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 w-full">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-bold text-[#5b5b5b]">
          XP Fase Plan: {currentXp} / {totalXp}
        </span>
        <span className="text-xs font-bold text-[#f02d9c]">{progress}%</span>
      </div>
      <div className="w-full bg-[#f0f0f0] rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full bg-[#f02d9c] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {progress >= 100 && (
        <p className="text-[10px] text-[#7a7a7a] mt-1 text-right">Selesai!</p>
      )}
    </div>
  );
};

export default function Level5Page() {
  const { projectId } = useParams();
  const router = useRouter();

  const { planLevels, getLevels } = useProjectStore();
  const {
    products,
    loading: productsLoading,
    fetchProducts,
    saveProducts,
  } = usePrototypeStore();

  const [isEditing, setIsEditing] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [localProducts, setLocalProducts] = useState([]);
  const nextPrevLevel = (num) => planLevels.find(l => l.project._id === projectId && l.order === num).entities[0].entity_ref

  const fileInputRefs = useRef({});

  // === Generate Unique ID ===
  const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

  // === Init ===
  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (projectId && projectId !== 'undefined' && isMounted) {
      getLevels(projectId);
      fetchProducts(projectId);
    }
  }, [projectId, isMounted]);

  // Sinkronisasi store → state lokal (untuk form interaktif)
  useEffect(() => {
    if (products.length > 0) {
      setLocalProducts(
        products.map((p) => ({
          id: p.id || generateId(), // Jika tidak ada id, buat baru
          name: p.name || '',
          concept: p.description || '',
          price: p.price ? String(p.price) : '',
          previewUrl: p.image || '',
        }))
      );
    } else {
      setLocalProducts([{ id: generateId(), name: '', concept: '', price: '', previewUrl: '' }]);
    }
  }, [products]);

  // === Progress & Level Data ===
  const totalLevels = planLevels.length;
  const currentXp = planLevels.filter(l => l.completed).reduce((acc, l) => acc + (l.xp || 0), 0);
  const totalXp = planLevels.reduce((acc, l) => acc + (l.xp || 0), 0);

  const currentLevel = planLevels.find((l) => l.order === 5);
  const xpGained = currentLevel?.xp || 10;
  const badgeName = currentLevel?.badge || 'Product Maker';

  // === Handle UI Actions (Form) ===
  const handleAddProduct = () => {
    if (localProducts.length >= 5) return;
    setLocalProducts((prev) => [
      ...prev,
      { id: generateId(), name: '', concept: '', price: '', previewUrl: '' },
    ]);
  };

  const handleUpdateField = (id, field, value) => {
    setLocalProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleImageUpload = (id, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Format gambar tidak didukung. Gunakan JPG, PNG, atau GIF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar terlalu besar. Maksimal 5MB.');
      return;
    }
    const url = URL.createObjectURL(file);
    handleUpdateField(id, 'previewUrl', url);
  };

  const handleRemoveImage = (id) => {
    handleUpdateField(id, 'previewUrl', '');
  };

  const handleRemoveProduct = (id) => {
    if (localProducts.length <= 1) {
      alert('Minimal harus ada 1 produk.');
      return;
    }
    setLocalProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = async () => {
    const isValid = localProducts.some((p) => p.concept.trim() || p.previewUrl);
    if (!isValid) {
      alert('Minimal isi deskripsi atau unggah gambar prototype.');
      return;
    }

    try {
      const payload = localProducts.map((p) => ({
        id: p.id,
        name: p.name.trim(),
        description: p.concept.trim(),
        price: p.price ? parseFloat(p.price) : 0,
        image: p.previewUrl, // Masih URL lokal, gambar akan hilang setelah refresh
      }));

      await saveProducts(projectId, payload);

      // Update level status via store
      if (currentLevel?._id) {
        const { updateLevelStatus } = useProjectStore.getState();
        await updateLevelStatus(currentLevel._id, { completed: true });
      }

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      setShowNotification(true);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Gagal menyimpan. Coba lagi.');
    }
  };

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
    { label: 'Level 5: Prototype' },
  ];

  if (!isMounted || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#f02d9c] font-medium">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {showConfetti && <Confetti />}

      <div className="px-3 sm:px-4 md:px-6 py-2 border-b border-gray-200 bg-white">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {isMobile && !mobileSidebarOpen && (
        <header className="p-3 flex items-center border-b border-gray-200 bg-white sticky top-10 z-30">
          <button onClick={() => setMobileSidebarOpen(true)}><Menu size={20} className="text-[#5b5b5b]" /></button>
          <h1 className="ml-2 font-bold text-[#5b5b5b] text-base">Level 5: Prototype</h1>
        </header>
      )}

      <div className="flex">
        <PlanSidebar
          projectId={projectId}
          currentLevelId={5}
          isMobile={isMobile}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
        <main className="flex-1">
          <div className="py-6 px-3 sm:px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-2xl" />
                <div
                  className="relative bg-white rounded-2xl border-t border-l border-black p-4 sm:p-5 md:p-6"
                  style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                >
                  <h1 className="text-xl sm:text-2xl font-bold text-[#f02d9c] mb-4 sm:mb-6">
                    Level 5: Prototype
                  </h1>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      {isEditing ? (
                        <div className="space-y-4">
                          {localProducts.map((product) => (
                            <div
                              key={product.id} // Key sudah unik karena generateId()
                              className="border border-gray-300 rounded-xl p-4 bg-[#f0f9f9] relative"
                            >
                              {localProducts.length > 1 && (
                                <button
                                  onClick={() => handleRemoveProduct(product.id)}
                                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white hover:bg-red-50 text-red-500 shadow-sm"
                                  title="Hapus produk"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                              <h3 className="font-bold text-[#f02d9c] mb-3 flex items-center gap-2">
                                <FileText size={16} />
                                Product Concept{' '}
                                {localProducts.length > 1 ? `#${localProducts.indexOf(product) + 1}` : ''}
                              </h3>
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">
                                Nama Produk
                              </label>
                              <input
                                type="text"
                                value={product.name}
                                onChange={(e) => handleUpdateField(product.id, 'name', e.target.value)}
                                placeholder="Masukkan nama produk"
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c] mb-3"
                              />
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">
                                Deskripsi Produk
                              </label>
                              <textarea
                                value={product.concept}
                                onChange={(e) => handleUpdateField(product.id, 'concept', e.target.value)}
                                placeholder="Deskripsi Produk Anda (fitur, bentuk, manfaat)"
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                rows={3}
                              />
                              <label className="flex text-xs font-medium text-[#5b5b5b] mt-3 mb-1 items-center gap-1">
                                <DollarSign size={14} />
                                Harga (Rp)
                              </label>
                              <input
                                type="text"
                                value={product.price}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                    handleUpdateField(product.id, 'price', val);
                                  }
                                }}
                                placeholder="Contoh: 25000"
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c] mb-3"
                              />
                              <div className="mt-3">
                                <label className="flex text-xs font-medium text-[#5b5b5b] mb-1 items-center gap-1">
                                  <Camera size={14} />
                                  Upload Gambar Prototype
                                </label>
                                <div
                                  className="mt-1 border-2 border-dashed border-[#7a7a7a] rounded-lg p-3 text-center cursor-pointer hover:border-[#f02d9c]"
                                  onClick={() => fileInputRefs.current[product.id]?.click()}
                                >
                                  {product.previewUrl ? (
                                    <div className="relative w-full h-32 flex items-center justify-center">
                                      <img
                                        src={product.previewUrl}
                                        alt="Preview"
                                        className="max-h-full max-w-full object-contain"
                                      />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveImage(product.id);
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-[#5b5b5b]">
                                      Klik untuk upload (JPG/PNG/GIF, max 5MB)
                                    </p>
                                  )}
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={(e) => handleImageUpload(product.id, e)}
                                    ref={(el) => (fileInputRefs.current[product.id] = el)}
                                    className="hidden"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          {localProducts.length < 5 && (
                            <button
                              onClick={handleAddProduct}
                              className="w-full px-3 py-2 bg-white border border-pink-500 text-pink-600 text-sm rounded-lg flex items-center justify-center gap-1 hover:bg-pink-50"
                            >
                              <Plus size={14} />
                              Tambah Produk
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {localProducts.map((product, idx) => (
                            <div
                              key={product.id} 
                              className="border border-gray-300 rounded-xl overflow-hidden"
                              style={{ backgroundColor: '#f0f2f5' }}
                            >
                              <div className="p-4" style={{ backgroundColor: '#fdf6f0' }}>
                                <h4 className="text-xs font-semibold text-[#5b5b5b] mb-2">
                                  Prototype Preview {localProducts.length > 1 ? `#${idx + 1}` : ''}
                                </h4>
                                <div className="flex items-start gap-3">
                                  <div className="shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    {product.previewUrl ? (
                                      <img
                                        src={product.previewUrl}
                                        alt="Prototype"
                                        className="w-full h-full object-contain"
                                      />
                                    ) : (
                                      <ImageIcon size={20} className="text-gray-500" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-[#f02d9c]">
                                      {product.name || 'Tanpa Nama'}
                                    </p>
                                    <p className="text-xs text-[#5b5b5b] mt-1 whitespace-pre-line line-clamp-2">
                                      {product.concept || 'Belum ada deskripsi'}
                                    </p>
                                    {product.price && (
                                      <p className="text-xs font-medium text-green-600 mt-1">
                                        Harga: Rp{Number(product.price).toLocaleString('id-ID')}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
                          {isEditing ? <Eye size={16} /> : <Edit3 size={16} />}
                          {isEditing ? 'Lihat Preview' : 'Edit'}
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/${projectId}/plan/level_4_lean_canvas/${nextPrevLevel(4)}`)}
                          className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-1"
                        >
                          <ChevronLeft size={16} />
                          Prev
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/${projectId}/plan/level_6_beta_testing/${nextPrevLevel(6)}`)}
                          className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg border border-black hover:bg-[#7abfc0] flex items-center gap-1"
                        >
                          Next <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    {/* KOLOM KANAN */}
                    <div className="space-y-5">
                      {/* PROGRESS BAR */}
                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap size={16} className="text-[#f02d9c]" />
                          <span className="font-bold text-[#5b5b5b]">Progress Fase Plan</span>
                        </div>
                        <PhaseProgressBar currentXp={currentXp} totalXp={totalXp} />
                      </div>

                      {/* PENCAPAIAN */}
                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <h3 className="font-bold text-[#5b5b5b] mb-2 flex items-center gap-1">
                          <Award size={16} className="text-[#f02d9c]" />
                          Pencapaian
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1.5 bg-[#f02d9c] text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <Lightbulb size={12} /> +{xpGained} XP
                          </span>
                          <span className="px-3 py-1.5 bg-[#8acfd1] text-[#0a5f61] text-xs font-bold rounded-full flex items-center gap-1">
                            <Award size={12} /> {badgeName}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-[#5b5b5b]">
                          Kumpulkan XP & badge untuk naik pangkat dari Zero ke CEO!
                        </p>
                      </div>

                      {/* PETUNJUK */}
                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <h3 className="font-bold text-[#5b5b5b] mb-3 flex items-center gap-1">
                          <BookOpen size={16} className="text-[#f02d9c]" />
                          Petunjuk
                        </h3>
                        <div className="space-y-2">
                          {[
                            'Isi nama produk dan deskripsi singkat',
                            'Tentukan harga jual (opsional)',
                            'Upload gambar prototype (JPG/PNG/GIF, max 5MB)',
                            'Klik “Simpan” untuk menyimpan konsep produk',
                            'Klik “Lihat Preview” untuk melihat hasil sebelum lanjut ke Level 6',
                          ].map((text, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-[#5b5b5b]">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#f02d9c] text-white text-xs font-bold mt-0.5">
                                {i + 1}
                              </span>
                              {text}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="px-2.5 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
                            <Lightbulb size={12} /> Tujuan: Buat versi sederhana produkmu untuk uji coba
                          </span>
                          <span className="px-2.5 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center gap-1">
                            <Award size={12} /> Tips: Gunakan Canva/Figma atau foto HP untuk visual
                          </span>
                        </div>
                      </div>

                      {/* RESOURCES */}
                      <div className="border border-gray-200 rounded-xl p-4 bg-white">
                        <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-1">
                          <BookOpen size={14} /> Resources
                        </h3>
                        <ul className="text-sm text-[#5b5b5b] space-y-1.5">
                          <li>
                            <a
                              href="https://miro.com/templates/lean-canvas/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                            >
                              Miro: Lean Canvas Template
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.canva.com/templates/EAFhWMaXv5c-pink-modern-fashion-business-plan-presentation/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                            >
                              Template Canva UMKM
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://perempuaninovasi.id/workshop"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                            >
                              Workshop Prototype untuk Pemula
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

      <NotificationModalPlan
        isOpen={showNotification}
        type="success"
        xpGained={xpGained}
        badgeName={badgeName}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}