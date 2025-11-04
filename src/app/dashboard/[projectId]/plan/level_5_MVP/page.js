'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Edit3, Lightbulb, BookOpen, Eye, ChevronLeft, ChevronRight,
  CheckCircle, Menu, Plus, ImageIcon, X, Camera, FileText,
  Trash2, DollarSign, Award,
} from 'lucide-react';

import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';
import NotificationModalPlan from '@/components/NotificationModalPlan';
import { usePrototypeStore } from '@/store/usePrototypeStore';
import useProjectStore from '@/store/useProjectStore';

export default function Level5Page() {
  const { projectId } = useParams();
  const router = useRouter();

  const {
    planLevels,
    getLevels,
    updateLevelStatus,
  } = useProjectStore();

  const { products: storedProducts, loading: storeLoading, fetchProducts, saveProducts } = usePrototypeStore();

  const [products, setProducts] = useState([{ id: Date.now(), name: '', concept: '', price: '', previewUrl: '' }]);
  const [isEditing, setIsEditing] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const fileInputRefs = useRef({});
  const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (projectId && projectId !== 'undefined' && isMounted) {
      getLevels(projectId);
      fetchProducts(projectId);
    }
  }, [projectId, isMounted]);

  useEffect(() => {
    if (storedProducts.length > 0) {
      setProducts(storedProducts.map(p => ({
        id: generateId(),
        name: p.name || '',
        concept: p.description || '',
        price: p.price ? String(p.price) : '',
        previewUrl: p.image || '',
      })));
    }
  }, [storedProducts]);

  const currentLevel = planLevels.find(l => l.order === 5);
  const xpGained = currentLevel?.xp || 10;
  const badgeName = currentLevel?.badge || 'Product Maker';

  // === Fungsi CRUD ===
  const addProduct = () => {
    if (products.length < 5) {
      setProducts(prev => [...prev, { id: generateId(), name: '', concept: '', price: '', previewUrl: '' }]);
    }
  };

  const updateField = (id, field, value) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
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
    updateField(id, 'previewUrl', url);
  };

  const removeImage = (id) => updateField(id, 'previewUrl', '');
  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      alert('Minimal harus ada 1 produk.');
    }
  };

  const handleSave = async () => {
    try {
      const payload = products.map(p => ({
        name: p.name,
        description: p.concept,
        price: p.price ? parseFloat(p.price) : 0,
        image: p.previewUrl,
      }));

      await saveProducts(projectId, payload);
      if (currentLevel?._id) {
        await updateLevelStatus(currentLevel._id, { completed: true });
      }
      setShowNotification(true);
    } catch (err) {
      console.error('Simpan gagal:', err);
      alert('Gagal menyimpan. Coba lagi.');
    }
  };

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
    { label: 'Level 5: Prototype' },
  ];

  if (!isMounted || storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#f02d9c] font-medium">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="px-3 sm:px-4 md:px-6 py-2 border-b border-gray-200 bg-white">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {isMobile && !mobileSidebarOpen && (
        <header className="p-3 flex items-center border-b border-gray-200 bg-white sticky top-10 z-30">
          <button onClick={() => setMobileSidebarOpen(true)}><Menu size={20} /></button>
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

        <main className="flex-1 p-4 max-w-6xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-[#f02d9c] rounded-2xl"></div>
            <div
              className="relative bg-white rounded-2xl border-t border-l border-black p-5 md:p-6"
              style={{ boxShadow: '3px 3px 0 0 #f02d9c' }}
            >
              <h1 className="text-2xl font-bold text-[#f02d9c] mb-6">Level 5: Prototype</h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kolom Kiri: Form / Preview */}
                <div>
                  {isEditing ? (
                    <div className="space-y-5">
                      {products.map((product, idx) => (
                        <div
                          key={product.id}
                          className="relative bg-linear-to-br from-[#fdfcf8] to-[#f0f9f9] border border-[#fbe2a7] rounded-xl p-5"
                        >
                          {products.length > 1 && (
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-red-50 text-red-500 shadow-sm"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}

                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[#f02d9c] flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{idx + 1}</span>
                            </div>
                            <h3 className="font-bold text-[#f02d9c]">Product Concept</h3>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1.5">
                                Nama Produk
                              </label>
                              <input
                                value={product.name}
                                onChange={(e) => updateField(product.id, 'name', e.target.value)}
                                placeholder="Contoh: Skincare Alami"
                                className="w-full px-3.5 py-2.5 text-sm border border-[#fbe2a7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f02d9c]"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1.5">
                                Deskripsi Produk
                              </label>
                              <textarea
                                value={product.concept}
                                onChange={(e) => updateField(product.id, 'concept', e.target.value)}
                                placeholder="Jelaskan manfaat dan keunggulan produkmu"
                                className="w-full px-3.5 py-2.5 text-sm border border-[#fbe2a7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f02d9c]"
                                rows="3"
                              />
                            </div>

                            <div>
                              <label className="flex text-xs font-medium text-[#5b5b5b] mb-1.5 items-center gap-1">
                                <DollarSign size={14} /> Harga (Rp)
                              </label>
                              <input
                                value={product.price}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                    updateField(product.id, 'price', val);
                                  }
                                }}
                                placeholder="Contoh: 75000"
                                className="w-full px-3.5 py-2.5 text-sm border border-[#fbe2a7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f02d9c]"
                              />
                            </div>

                            <div>
                              <label className="flex text-xs font-medium text-[#5b5b5b] mb-1.5 items-center gap-1">
                                <Camera size={14} /> Upload Gambar Prototype
                              </label>
                              <div
                                className="mt-1 border-2 border-dashed border-[#fbe2a7] rounded-lg p-4 text-center cursor-pointer hover:border-[#f02d9c]"
                                onClick={() => fileInputRefs.current[product.id]?.click()}
                              >
                                {product.previewUrl ? (
                                  <div className="relative w-full h-32 flex items-center justify-center bg-white rounded">
                                    <img
                                      src={product.previewUrl}
                                      alt="Preview"
                                      className="max-h-full max-w-full object-contain"
                                    />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(product.id);
                                      }}
                                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <ImageIcon size={24} className="text-[#8acfd1] mx-auto mb-1" />
                                    <p className="text-sm text-[#5b5b5b]">Klik untuk upload (max 5MB)</p>
                                  </div>
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
                        </div>
                      ))}

                      {products.length < 5 && (
                        <button
                          onClick={addProduct}
                          className="w-full py-3 bg-white border-2 border-dashed border-[#f02d9c] text-[#f02d9c] font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-[#fdf6f0]"
                        >
                          <Plus size={18} /> Tambah Produk
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.map((p, i) => (
                        <div
                          key={p.id}
                          className="border border-[#fbe2a7] rounded-xl overflow-hidden bg-[#fdfcf8]"
                        >
                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="shrink-0 w-14 h-14 bg-white border border-[#fbe2a7] rounded-lg flex items-center justify-center">
                                {p.previewUrl ? (
                                  <img
                                    src={p.previewUrl}
                                    alt="Produk"
                                    className="w-full h-full object-contain p-1"
                                  />
                                ) : (
                                  <ImageIcon size={20} className="text-gray-400" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xs px-2 py-0.5 bg-[#fbe2a7] text-[#5b5b5b] rounded-full">
                                    #{i + 1}
                                  </span>
                                  <h4 className="text-sm font-bold text-[#f02d9c]">
                                    {p.name || 'Tanpa Nama'}
                                  </h4>
                                </div>
                                <p className="text-sm text-[#5b5b5b] mt-1 line-clamp-2">
                                  {p.concept || 'Belum ada deskripsi'}
                                </p>
                                {p.price && (
                                  <p className="text-sm font-semibold text-green-600 mt-1">
                                    Rp{Number(p.price).toLocaleString('id-ID')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Aksi Tombol */}
                  <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                    <button
                      onClick={handleSave}
                      className="px-5 py-2.5 bg-[#f02d9c] text-white font-medium rounded-xl border border-black hover:bg-pink-600 flex items-center gap-1.5"
                    >
                      <CheckCircle size={18} /> Simpan
                    </button>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-5 py-2.5 bg-white text-[#f02d9c] font-medium rounded-xl border border-[#f02d9c] hover:bg-[#fdf6f0] flex items-center gap-1.5"
                    >
                      {isEditing ? <Eye size={18} /> : <Edit3 size={18} />}
                      {isEditing ? 'Lihat Preview' : 'Edit'}
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/${projectId}/plan/level_4_lean_canvas`)}
                      className="px-5 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-xl border border-gray-300 hover:bg-gray-200 flex items-center gap-1.5"
                    >
                      <ChevronLeft size={18} /> Prev
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/${projectId}/plan/level_6_beta_testing`)}
                      className="px-5 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-xl border border-black hover:bg-[#7abfc0] flex items-center gap-1.5"
                    >
                      Next <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Kolom Kanan: Info Panel */}
                <div className="space-y-5">
                  <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-5">
                    <h3 className="font-bold text-[#5b5b5b] mb-3 flex items-center gap-2">
                      <Award size={20} className="text-[#f02d9c]" />
                      Pencapaian
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      <span className="px-3 py-1.5 bg-[#f02d9c] text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Lightbulb size={12} /> +{xpGained} XP
                      </span>
                      <span className="px-3 py-1.5 bg-[#8acfd1] text-[#0a5f61] text-xs font-bold rounded-full flex items-center gap-1">
                        <Award size={12} /> {badgeName}
                      </span>
                    </div>
                  </div>

                  <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-5">
                    <h3 className="font-bold text-[#5b5b5b] mb-3 flex items-center gap-2">
                      <BookOpen size={20} className="text-[#f02d9c]" />
                      Petunjuk
                    </h3>
                    <ul className="text-sm text-[#5b5b5b] space-y-2 list-disc pl-5">
                      <li>Buat versi sederhana produkmu untuk uji coba</li>
                      <li>Upload gambar (bisa foto langsung dari HP)</li>
                      <li>Isi harga & deskripsi secara jelas</li>
                      <li>Simpan untuk lanjut ke tahap Beta Testing</li>
                    </ul>
                    <div className="mt-4">
                      <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        💡 Tujuan: Validasi ide produk sebelum produksi massal
                      </span>
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