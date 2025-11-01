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
} from 'lucide-react';

import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';
import useProjectStore from '@/store/useProjectStore';

export default function Level5Page() {
  const { projectId } = useParams();
  const router = useRouter();
  const projects = useProjectStore((state) => state.projects);
  const updateProject = useProjectStore((state) => state.updateProject);

  const [products, setProducts] = useState([
    { id: Date.now(), name: '', concept: '', price: '', previewUrl: '' }
  ]);
  const [isEditing, setIsEditing] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [project, setProject] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const fileInputRefs = useRef({});

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
      const saved = localStorage.getItem(`mvp-${projectId}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setProducts(
            data.map((item, i) => ({
              id: Date.now() + i,
              name: item.name || '',
              concept: item.concept || '',
              price: item.price || '',
              previewUrl: item.previewUrl || '',
            }))
          );
        } catch (e) {
          console.warn('Failed to parse saved Prototype data', e);
        }
      }
    }
  }, [projectId, projects]);

  const addProduct = () => {
    if (products.length >= 5) return;
    setProducts((prev) => [
      ...prev,
      { id: Date.now(), name: '', concept: '', price: '', previewUrl: '' }
    ]);
  };

  const updateProductName = (id, value) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, name: value } : p)));
  };

  const updateConcept = (id, value) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, concept: value } : p)));
  };

  const updatePrice = (id, value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, price: value } : p)));
    }
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
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, previewUrl: url } : p))
    );
  };

  const removeImage = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, previewUrl: '' } : p))
    );
  };

  const removeProduct = (id) => {
    if (products.length <= 1) {
      alert('Minimal harus ada 1 produk.');
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    const dataToSave = products.map((p) => ({
      name: p.name,
      concept: p.concept,
      price: p.price,
      previewUrl: p.previewUrl,
    }));

    localStorage.setItem(`mvp-${projectId}`, JSON.stringify(dataToSave));

    if (project) {
      const updatedLevels = [...(project.levels || [])];
      while (updatedLevels.length <= 4) {
        updatedLevels.push({ id: updatedLevels.length + 1, completed: false });
      }
      updatedLevels[4] = {
        id: 5,
        completed: products.some((p) => p.concept || p.previewUrl),
        mvp: dataToSave,
      };
      updateProject(projectId, { levels: updatedLevels });
    }

    alert('Prototype berhasil disimpan! ✅');
    setIsEditing(false);
  };

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
    { label: 'Level 5: Prototype' },
  ];

  if (!isMounted) {
    return <div className="min-h-screen bg-white p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="px-3 sm:px-4 md:px-6 py-2 border-b border-gray-200 bg-white">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {isMobile && !mobileSidebarOpen && (
        <header className="p-3 flex items-center border-b border-gray-200 bg-white sticky top-10 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={20} className="text-[#5b5b5b]" />
          </button>
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
                          {products.map((product) => (
                            <div
                              key={product.id}
                              className="border border-gray-300 rounded-xl p-4 bg-[#f0f9f9] relative"
                            >
                              {products.length > 1 && (
                                <button
                                  onClick={() => removeProduct(product.id)}
                                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white hover:bg-red-50 text-red-500 shadow-sm"
                                  title="Hapus produk"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}

                              <h3 className="font-bold text-[#f02d9c] mb-3 flex items-center gap-2">
                                <FileText size={16} />
                                Product Concept{' '}
                                {products.length > 1 ? `#${products.indexOf(product) + 1}` : ''}
                              </h3>

                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">
                                Nama Produk
                              </label>
                              <input
                                type="text"
                                value={product.name}
                                onChange={(e) => updateProductName(product.id, e.target.value)}
                                placeholder="Masukkan nama produk"
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c] mb-3"
                              />

                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">
                                Deskripsi Produk
                              </label>
                              <textarea
                                value={product.concept}
                                onChange={(e) => updateConcept(product.id, e.target.value)}
                                placeholder="Deskripsi Produk Anda (fitur, bentuk, manfaat)"
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                rows={3}
                              />

                              <label className="block text-xs font-medium text-[#5b5b5b] mt-3 mb-1 flex items-center gap-1">
                                <DollarSign size={14} />
                                Harga (Rp)
                              </label>
                              <input
                                type="text"
                                value={product.price}
                                onChange={(e) => updatePrice(product.id, e.target.value)}
                                placeholder="Contoh: 25000"
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c] mb-3"
                              />

                              <div className="mt-3">
                                <label className="block text-xs font-medium text-[#5b5b5b] mb-1 flex items-center gap-1">
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
                                          removeImage(product.id);
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

                          {products.length < 5 && (
                            <button
                              onClick={addProduct}
                              className="w-full px-3 py-2 bg-white border border-pink-500 text-pink-600 text-sm rounded-lg flex items-center justify-center gap-1 hover:bg-pink-50"
                            >
                              <Plus size={14} />
                              Tambah Produk
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {products.map((product, idx) => (
                            <div
                              key={product.id}
                              className="border border-gray-300 rounded-xl overflow-hidden"
                              style={{ backgroundColor: '#f0f2f5' }}
                            >
                              <div className="p-4" style={{ backgroundColor: '#fdf6f0' }}>
                                <h4 className="text-xs font-semibold text-[#5b5b5b] mb-2">
                                  Prototype Preview {products.length > 1 ? `#${idx + 1}` : ''}
                                </h4>
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
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
                          onClick={() => router.push(`/dashboard/${projectId}/plan/level_4_lean_canvas`)}
                          className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-1"
                        >
                          <ChevronLeft size={16} />
                          Prev
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/${projectId}/plan/level_6_beta_testing`)}
                          className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg border border-black hover:bg-[#7abfc0] flex items-center gap-1"
                        >
                          Next <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                        <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-2">
                          <Target size={16} />
                          Tujuan Level 5
                        </h3>
                        <ul className="text-sm text-[#5b5b5b] list-disc pl-5 space-y-1">
                          <li>Membangun versi paling sederhana dari produkmu (Prototype)</li>
                          <li>Memvisualisasikan bentuk fisik/digital Prototype</li>
                          <li>Menyiapkan aset untuk uji coba ke pelanggan awal</li>
                        </ul>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                        <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-2">
                          <Lightbulb size={16} />
                          Tips & Best Practice
                        </h3>
                        <ul className="text-sm text-[#5b5b5b] list-disc pl-5 space-y-1">
                          <li>
                            <strong>Prototype tidak harus sempurna</strong> — cukup untuk menguji ide utama
                          </li>
                          <li>
                            Gunakan <strong>Canva, Figma, atau foto HP</strong> untuk visual Prototype
                          </li>
                          <li>
                            Fokus pada <strong>1–2 fitur inti</strong> yang menyelesaikan masalah utama
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
                              href="https://miro.com/templates/lean-canvas/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline flex items-center gap-1"
                            >
                              Miro: Lean Canvas Template <ChevronRight size={12} />
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.canva.com/templates/EAFhWMaXv5c-pink-modern-fashion-business-plan-presentation/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline flex items-center gap-1"
                            >
                              Template Canva UMKM <ChevronRight size={12} />
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://perempuaninovasi.id/workshop"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline flex items-center gap-1"
                            >
                              Workshop Prototype untuk Pemula <ChevronRight size={12} />
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