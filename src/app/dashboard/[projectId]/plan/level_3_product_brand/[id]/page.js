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
  Loader2
} from 'lucide-react';

import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';
import useProjectStore from '@/store/useProjectStore';
import NotificationModalPlan from '@/components/NotificationModalPlan';
import Confetti from '@/components/Confetti';
import useBrandIdentityStore from '@/store/useBrandIdentity';
import useAuthStore from '@/store/useAuthStore';

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

const getContrastTextColor = (hex) => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#') || hex.length < 7) {
    return '#111827';
  }
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#111827' : '#ffffff';
  } catch (e) {
    return '#111827';
  }
};

export default function Level3Page() {
  const { id, projectId } = useParams();
  const brandIdentityId = id && id !== 'null' && id !== 'undefined' ? id : null;
  const router = useRouter();
  const { isAuthenticated, loadSession, isHydrated } = useAuthStore();

  const { planLevels, updateLevelStatus } = useProjectStore();
  const { brandIdentity, getBrandIdentity, updateBrandIdentity, logoPreview, setLogoPreview, updateLogo } = useBrandIdentityStore();

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      if (!projectId || projectId === 'null' || projectId === 'undefined') {
        router.push('/dashboard');
        return;
      }
      if (!brandIdentityId) {
        router.push(`/dashboard/${projectId}/plan`);
        return;
      }
      getBrandIdentity(projectId);
    }
  }, [isHydrated, isAuthenticated, projectId, brandIdentityId, router]);

  const getLevelEntityId = (order) => {
    const level = planLevels?.find(
      (l) => l?.project?._id === projectId && l?.order === order
    );
    return level?.entities?.[0]?.entity_ref || null;
  };

  const [showNotification, setShowNotification] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notificationData, setNotificationData] = useState({
    pesan: '',
    keterangan: '',
    xpGained: 0,
    badgeName: '',
  });

  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [palette, setPalette] = useState(['#F6E8D6']);
  const [activePickerIndex, setActivePickerIndex] = useState(0);
  const MAX_COLORS = 6;
  // const [logoPreview, setLogoPreview] = useState('');
  const logoUploadRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    if (brandIdentity) {
      setBrandName(brandIdentity.brandName || '');
      setTagline(brandIdentity.tagline || '');
      setLogoPreview(brandIdentity.logoPreview || '');

      let validPalette = brandIdentity.palette || [];
      if (!Array.isArray(validPalette)) validPalette = [];
      validPalette = validPalette
        .filter(color => typeof color === 'string')
        .map(color => color.startsWith('#') ? color : `#${color}`)
        .filter(color => /^#[0-9A-Fa-f]{6}$/.test(color));
      if (validPalette.length === 0) validPalette = ['#F6E8D6'];
      setPalette(validPalette);
      setActivePickerIndex(0);
    }
  }, [brandIdentity]);

  const currentXp = planLevels
    .filter((l) => l.completed)
    .reduce((acc, l) => acc + (l.xp || 0), 0);
  const totalXp = planLevels.reduce((acc, l) => acc + (l.xp || 0), 0);
  const level3 = planLevels.find((l) => l.order === 3);

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

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !brandIdentityId) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Format gambar tidak didukung. Gunakan JPG, PNG, atau GIF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar terlalu besar. Maksimal 5MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);

    const formData = new FormData();
    formData.append('file', file);

    await updateLogo(brandIdentityId, formData)
  };

  const handleSave = async () => {
    if (!level3) {
      alert('Level 3 tidak ditemukan.');
      return;
    }
    if (!brandIdentityId) {
      alert('ID Brand Identity tidak valid. Muat ulang halaman.');
      return;
    }

    const validPalette = palette
      .filter(color => color && typeof color === 'string')
      .map(color => (color.startsWith('#') ? color : `#${color}`))
      .filter(color => /^#[0-9A-Fa-f]{6}$/.test(color));

    if (validPalette.length === 0) {
      alert('Palet warna tidak valid. Gunakan format hex (#RRGGBB).');
      return;
    }

    const data = {
      brandName,
      tagline,
      palette: validPalette,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(`concept-${projectId}`, JSON.stringify(data));
    await updateBrandIdentity(brandIdentityId, data);
    await updateLevelStatus(level3._id, { completed: true });

    setIsEditing(false)
    if (currentLevel?.completed == false) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setNotificationData({
        keterangan: 'Perbaiki dan sempurnakan ide bisnismu di level selanjutnya dalam bentul model bisnis Lean Canvas!',
        xpGained: level3.xp || 0,
        badgeName: level3.badge || '',
      });
      setShowNotification(true);
    } else {
      setNotificationData({
        pesan: 'Konsep brand berhasil disimpan!',
        keterangan: 'Perbaiki dan sempurnakan ide bisnismu di level selanjutnya dalam bentul model bisnis Lean Canvas!'
      });
      setShowNotification(true);
    }
  };

  const brandInitials = getInitials(brandName);

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
    { label: 'Level 3: Concept Development' },
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-[#f02d9c]" />
      </div>
    );
  }

  const prevLevelId = getLevelEntityId(2);
  const nextLevelId = getLevelEntityId(4);

  // ✅ Cari level 3 untuk status completed
  const currentLevel = planLevels.find(l => l.order === 3);

  return (
    <div className="min-h-screen bg-white font-sans">
      {showConfetti && <Confetti />}

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
          <h1 className="ml-2 font-bold text-[#5b5b5b] text-base">Level 3: Concept Development</h1>
        </header>
      )}

      <div className="flex mt-6">
        <PlanSidebar
          projectId={projectId}
          currentLevelId={3}
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
                  {!isMobile && (
                    <h1 className="text-xl sm:text-2xl font-bold text-[#f02d9c] mb-4 sm:mb-6">
                      Level 3: Concept Development
                    </h1>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      {isEditing ? (
                        <div className="space-y-4">
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
                                        onError={(e) => {
                                          e.currentTarget.src = '';
                                        }}
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
                              {palette.length < MAX_COLORS && (
                                <button
                                  onClick={addColor}
                                  className="mt-2 text-xs text-[#f02d9c] font-medium hover:underline"
                                >
                                  + Tambah Warna
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* BRAND PREVIEW: DUKUNG >1 WARNA */
                        <div className="border border-gray-300 rounded-xl p-4 bg-white">
                          <h3 className="font-bold text-[#5b5b5b] mb-3 flex items-center gap-2">
                            <Eye size={16} /> Brand Preview
                          </h3>
                          {/* Grid 2x3 - Layout Magazine Style */}
                          <div className="grid grid-cols-2 gap-3">
                            {/* Kolom 1: Logo & Tagline */}
                            <div>
                              <h4 className="font-bold text-[#5b5b5b] text-sm mb-2">CARD</h4>
                              <div className="flex flex-col items-center p-3 rounded-lg"
                                 style={{
                                  backgroundColor: palette[0] || '#F6E8D6',
                                  color: getContrastTextColor(palette[0] || '#F6E8D6'),
                                }}
                              >
                              <div
                                className="w-16 h-16 rounded-full p-3 mb-3 flex items-center justify-center"
                                style={{
                                  backgroundColor: '#FFFFFF',
                                  color: getContrastTextColor(palette[0] || '#F6E8D6'),
                                }}
                              >
                                {logoPreview ? (
                                  <img
                                    src={logoPreview}
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <span className="text-xl font-bold">{brandInitials}</span>
                                )}
                              </div>
                              <p className="font-bold text-center">{brandName || 'Nama Brand'}</p>
                              <p className="text-xs mt-1 opacity-90 text-center">{tagline || 'Tagline Anda'}</p>
                              </div>
                            </div>

                            {/* Kolom 2: Palet Warna */}
                            <div className="p-3 bg-white rounded-lg">
                              <h4 className="font-bold text-[#5b5b5b] text-sm mb-2">COLOR PALETTE</h4>
                              <div className="flex gap-2 mb-2">
                                {palette.slice(0, 3).map((color, i) => (
                                  <div
                                    key={i}
                                    className="w-8 h-8 rounded"
                                    style={{ backgroundColor: color }}
                                    title={`Warna ${i + 1}: ${color.toUpperCase()}`}
                                  />
                                ))}
                              </div>
                              <div className="flex gap-2">
                                {palette.slice(3, 6).map((color, i) => (
                                  <div
                                    key={i}
                                    className="w-8 h-8 rounded"
                                    style={{ backgroundColor: color }}
                                    title={`Warna ${i + 4}: ${color.toUpperCase()}`}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Kolom 3: Logo */}
                            <div className="p-3 bg-white rounded-lg">
                              <h4 className="font-bold text-[#5b5b5b] text-sm mb-2">LOGO</h4>
                                {logoPreview ? (
                                  <img
                                    src={logoPreview}
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <span className="text-xl font-bold">{brandInitials}</span>
                                )}
                            </div>

                            {/* Kolom 4: Gradient Bar */}
                            <div className="p-3 bg-white rounded-lg">
                              <h4 className="font-bold text-[#5b5b5b] text-sm mb-2">GRADIENT</h4>
                              <div
                                className="h-4 rounded-md"
                                style={{
                                  background: `linear-gradient(90deg, ${palette[0] || '#F6E8D6'}, ${palette[1] || '#D9C9B6'}, ${palette[2] || '#A89F91'})`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mt-6 justify-center">
                        <button
                          onClick={() => {
                            if (prevLevelId) {
                              router.push(`/dashboard/${projectId}/plan/level_2_rww/${prevLevelId}`);
                            } else {
                              router.push(`/dashboard/${projectId}/plan`);
                            }
                          }}
                          className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-1"
                        >
                          <ChevronLeft size={16} />
                          Prev
                        </button>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="px-4 py-2.5 bg-white text-[#f02d9c] font-medium rounded-lg border border-[#f02d9c] hover:bg-[#fdf6f0] flex items-center gap-1"
                        >
                          {isEditing ? <Eye size={16} /> : <Edit3 size={16} />}
                          {isEditing ? 'Lihat Preview' : 'Edit'}
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2.5 bg-[#f02d9c] text-white font-medium rounded-lg hover:bg-pink-600 flex items-center gap-1"
                        >
                          <CheckCircle size={16} />
                          Simpan
                        </button>
                        {/* ✅ Tombol Next: aktif jika Level 3 completed */}
                        {currentLevel?.completed ? (
                          <button
                            onClick={() => {
                                router.push(`/dashboard/${projectId}/plan/level_4_lean_canvas/${nextLevelId}`);
                            }}
                            className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg hover:bg-[#7abfc0] flex items-center gap-1"
                          >
                            { nextLevelId ? (
                            <>
                            Next <ChevronRight size={16} /> 
                            </>
                            ) : (
                              <>
                              <Loader2 className="w-6 h-6 animate-spin text-[#0a5f61]" />
                              </>
                            ) }
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 cursor-not-allowed"
                          >
                            Next <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap size={16} className="text-[#f02d9c]" />
                          <span className="font-bold text-[#5b5b5b]">Progress Fase Plan</span>
                        </div>
                        <PhaseProgressBar currentXp={currentXp} totalXp={totalXp} />
                      </div>

                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Award size={16} className="text-[#f02d9c]" />
                          <span className="font-bold text-[#5b5b5b]">Pencapaian</span>
                        </div>
                        {level3 ? (
                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-1.5 bg-[#f02d9c] text-white px-3 py-1.5 rounded-full text-xs font-bold">
                              <Lightbulb size={12} /> +{level3.xp} XP
                            </div>
                            <div className="flex items-center gap-1.5 bg-[#8acfd1] text-[#0a5f61] px-3 py-1.5 rounded-full text-xs font-bold">
                              <Award size={12} /> {level3.badge}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-[#5b5b5b]">Data level belum tersedia.</p>
                        )}
                        <p className="mt-3 text-xs text-[#5b5b5b]">
                          Kumpulkan XP & badge untuk naik pangkat dari Zero ke CEO!
                        </p>
                      </div>

                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen size={16} className="text-[#f02d9c]" />
                          <span className="font-bold text-[#5b5b5b]">Petunjuk</span>
                        </div>
                        <div className="space-y-2">
                          {[
                            'Isi nama brand dan tagline',
                            'Upload logo (opsional)',
                            'Pilih atau sesuaikan palet warna',
                            'Gunakan tombol “Lihat Preview” untuk melihat hasil',
                            'Klik “Simpan” untuk lanjut ke Level 4',
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
                          <div className="px-2.5 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
                            <Lightbulb size={12} /> Tujuan: Bangun identitas visual yang konsisten
                          </div>
                          <div className="px-2.5 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center gap-1">
                            <Award size={12} /> Tips: Gunakan maksimal 3–6 warna
                          </div>
                        </div>
                      </div>

                      {/* Resources */}
                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen size={16} className="text-[#f02d9c]" />
                          <span className="font-bold text-[#5b5b5b]">Resources</span>
                        </div>
                        <ul className="text-sm text-[#5b5b5b] space-y-2">
                          <li>
                            <span className="font-medium text-[#0a5f61]">Bacaan:</span>
                          </li>
                          <li className="ml-3">
                            <a
                              href="https://venngage.com/blog/brand-identity/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline"
                            >
                              How to Build a Strong Brand Identity (Venngage)
                            </a>
                          </li>
                          <li className="ml-3">
                            <a
                              href="https://www.canva.com/learn/color-theory/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline"
                            >
                              Color Theory for Beginners (Canva Design School)
                            </a>
                          </li>
                          <li className="mt-2">
                            <span className="font-medium text-[#0a5f61]">Tools:</span>
                          </li>
                          <li className="ml-3">
                            <a
                              href="https://www.canva.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline"
                            >
                              Canva – Desain logo & identitas visual
                            </a>
                          </li>
                          <li className="ml-3">
                            <a
                              href="https://www.figma.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline"
                            >
                              Figma – Desain kolaboratif & prototyping
                            </a>
                          </li>
                          <li className="ml-3">
                            <a
                              href="https://www.remove.bg/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline"
                            >
                              Remove.bg – Hapus latar belakang gambar otomatis
                            </a>
                          </li>
                          <li className="ml-3">
                            <a
                              href="https://coolors.co/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline"
                            >
                              Coolors – Generator palet warna profesional
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
        pesan={notificationData.pesan}
        keterangan={notificationData.keterangan}
        xpGained={notificationData.xpGained}
        badgeName={notificationData.badgeName}
        onClose={() => {
          setShowNotification(false);
          router.push(`/dashboard/${projectId}/plan/level_4_lean_canvas/${nextLevelId}`);
        }} 
      />
    </div>
  );
}