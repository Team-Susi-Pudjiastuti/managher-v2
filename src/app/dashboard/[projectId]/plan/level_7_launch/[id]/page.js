'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  Target,
  BarChart3,
  Palette,
  FileText,
  Award,
  Rocket,
  Lightbulb,
  Users,
  ClipboardCheck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Smartphone,
  Truck,
  CreditCard,
  MessageCircle,
  Store,
  Clock,
  CheckCircle,
  Zap,
  Loader2
} from 'lucide-react';

import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';
import NotificationModalPlan from '@/components/NotificationModalPlan';
import useProjectStore from '@/store/useProjectStore';
import useAuthStore from '@/store/useAuthStore';

// === CONFETTI ===
const Confetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiCount = 120;
    const gravity = 0.4;
    const colors = ['#f02d9c', '#8acfd1', '#fbe2a7', '#ff6b9d', '#4ecdc4'];

    const confettiPieces = Array.from({ length: confettiCount }, () => ({
      x: Math.random() * canvas.width,
      y: -10,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 6,
      speedY: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
    }));

    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let stillFalling = false;

      confettiPieces.forEach((piece) => {
        piece.y += piece.speedY;
        piece.x += piece.speedX;
        piece.speedY += gravity;
        piece.rotation += piece.rotationSpeed;
        if (piece.y < canvas.height) stillFalling = true;

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();
      });

      if (stillFalling) animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-9999" />;
};

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
      {progress >= 100 && <p className="text-[10px] text-[#7a7a7a] mt-1 text-right">Selesai!</p>}
    </div>
  );
};

// === CHECKLIST ITEMS ===
const CHECKLIST_ITEMS = [
  { id: 'social', label: 'Buat akun Instagram & WhatsApp bisnis', icon: Instagram },
  { id: 'photos', label: 'Siapkan foto produk yang menarik', icon: Smartphone },
  { id: 'payment', label: 'Siapkan metode pembayaran (QRIS, transfer)', icon: CreditCard },
  { id: 'offer', label: 'Tawarkan ke orang terdekat (teman/keluarga)', icon: MessageCircle },
  { id: 'delivery', label: 'Uji coba proses pengiriman/pengambilan', icon: Truck },
  { id: 'price', label: 'Tentukan harga & paket (misal: bundle hemat)', icon: Store },
  { id: 'feedback', label: 'Kumpulkan 3 testimoni awal', icon: Users },
  { id: 'schedule', label: 'Tentukan jam operasional & respons', icon: Clock },
];

// === CUSTOM ZUSTAND STORE (PER PROJECT) ===
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const createDefaultChecklist = () =>
  CHECKLIST_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: false }), {});

export const useLaunchChecklistStore = create(
  persist(
    (set, get) => ({
      checklistByProject: {},

      getChecklist: (projectId) => {
        return get().checklistByProject[projectId] || createDefaultChecklist();
      },

      setChecklistForProject: (projectId, checklist) => {
        set((state) => ({
          checklistByProject: {
            ...state.checklistByProject,
            [projectId]: checklist,
          },
        }));
      },

      toggleItem: (projectId, itemId) => {
        const current = get().getChecklist(projectId);
        const updated = { ...current, [itemId]: !current[itemId] };
        get().setChecklistForProject(projectId, updated);
      },

      initProject: (projectId) => {
        const current = get().checklistByProject;
        if (!current[projectId]) {
          get().setChecklistForProject(projectId, createDefaultChecklist());
        }
      },
    }),
    {
      name: 'launch-checklist-storage-v2',
      partialize: (state) => ({ checklistByProject: state.checklistByProject }),
    }
  )
);

// === MAIN COMPONENT ===
export default function Level7Page() {
  const { projectId } = useParams();
  const router = useRouter();

  const { planLevels, getLevels, updateLevelStatus } = useProjectStore();
  const { getChecklist, toggleItem, initProject } = useLaunchChecklistStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [localChecklist, setLocalChecklist] = useState({});

  const { isAuthenticated, loadSession, isHydrated } = useAuthStore();

  // Auth guard
  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  // Mounting
  useEffect(() => setIsMounted(true), []);

  // Responsiveness
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Load level & init checklist
  useEffect(() => {
    if (projectId && projectId !== 'undefined') {
      getLevels(projectId);
      initProject(projectId);
      const saved = getChecklist(projectId);
      setLocalChecklist(saved);
    }
  }, [projectId]);

  // Helper: get level by order
  const getLevel = (order) => {
    return planLevels.find((l) => l.order === order) || null;
  };

  // XP progress
  const currentXp = planLevels.filter((l) => l.completed).reduce((acc, l) => acc + (l.xp || 0), 0);
  const totalXp = planLevels.reduce((acc, l) => acc + (l.xp || 0), 0);
  const currentLevel = planLevels.find((l) => l.order === 7);
  const xpGained = currentLevel?.xp || 10;
  const badgeName = currentLevel?.badge || 'Launch Star';

  // Helper for link generation
  const nextPrevLevel = (num) => {
    const level = planLevels.find(l => l.order === num);
    return level?.entities[0]?.entity_ref || '';
  };

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
    { label: 'Level 7: Aset & Checklist Launching' },
  ];

  const handleSelesaiClick = () => {
    const allDone = Object.values(localChecklist).every((v) => v);
    if (allDone) {
      updateLevelStatus(currentLevel._id, { completed: true });
      if (currentLevel?.completed) {
        setShowNotification(true);
      } else {
        setShowConfetti(true);
        setShowNotification(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } else {
      alert('Selesaikan semua checklist terlebih dahulu untuk melanjutkan.');
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-[#f02d9c]" />
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
        <header className="p-3 flex items-center border-b border-gray-200 bg-white sticky top-12 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={20} className="text-[#5b5b5b]" />
          </button>
          <h1 className="ml-2 font-bold text-[#5b5b5b] text-base">Level 7: Aset & Launching</h1>
        </header>
      )}

      <div className="flex mt-6">
        <PlanSidebar
          projectId={projectId}
          currentLevelId={7}
          isMobile={isMobile}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        <main className="flex-1">
          <div className="p-3 sm:p-4 md:p-6 max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-2xl"></div>
              <div
                className="relative bg-white rounded-2xl border-t border-l border-black p-4 sm:p-5 md:p-6"
                style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
              >
                {!isMobile && (
                  <h1 className="text-xl sm:text-2xl font-bold text-[#f02d9c] mb-4 sm:mb-6">
                    Level 7: Aset & Checklist Launching
                  </h1>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Kolom Kiri */}
                  <div className="space-y-6">
                    {/* Checklist */}
                    <div className="border border-gray-300 rounded-xl p-4 bg-[#f0f9f9]">
                      <h3 className="font-bold text-[#f02d9c] mb-3 flex items-center gap-2">
                        <ClipboardCheck size={16} />
                        Checklist Launching
                      </h3>
                      <ul className="space-y-2">
                        {CHECKLIST_ITEMS.map((item) => {
                          const isChecked = localChecklist[item.id] || false;
                          return (
                            <li key={item.id} className="flex items-start gap-2 text-sm">
                              <button
                                onClick={() => {
                                  toggleItem(projectId, item.id);
                                  setLocalChecklist(prev => ({
                                    ...prev,
                                    [item.id]: !prev[item.id]
                                  }));
                                }}
                                className="mt-0.5 w-5 h-5 flex items-center justify-center border border-gray-400 rounded-sm bg-white hover:bg-[#f0f9f9] flex-shrink-0"
                                aria-label={`Toggle ${item.label}`}
                              >
                                {isChecked && <CheckCircle size={14} className="text-green-600" />}
                              </button>
                              <span className={isChecked ? 'line-through text-gray-500' : 'text-[#5b5b5b]'}>
                                {item.label}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Aset */}
                    <div>
                      <h3 className="font-bold text-[#5b5b5b] mb-3">Aset Hasil Level 1–6</h3>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2">
                        {[
                          { id: 1, label: 'VPC', icon: Target, completed: getLevel(1)?.completed, order: 1 },
                          { id: 2, label: 'RWW Analysis', icon: BarChart3, completed: getLevel(2)?.completed, order: 2 },
                          { id: 3, label: 'Brand Identity', icon: Palette, completed: getLevel(3)?.completed, order: 3 },
                          { id: 4, label: 'Lean Canvas', icon: FileText, completed: getLevel(4)?.completed, order: 4 },
                          { id: 5, label: 'Prototype', icon: Rocket, completed: getLevel(5)?.completed, order: 5 },
                          { id: 6, label: 'Beta Testing', icon: Users, completed: getLevel(6)?.completed, order: 6 },
                        ].map((item) => {
                          const Icon = item.icon;
                          const status = item.completed ? 'Selesai' : 'Belum selesai';
                          const entityRef = nextPrevLevel(item.order);
                          const href = entityRef
                            ? `/dashboard/${projectId}/plan/level_${item.order}_${item.label.toLowerCase().replace(/ /g, '_')}/${entityRef}`
                            : '#';
                          return (
                            <div key={item.id} className="border border-gray-300 rounded-xl p-3 bg-[#fdf6f0]">
                              <Link href={href}>
                                <h4 className="font-bold text-[#0a5f61] text-sm flex items-center gap-1 hover:underline">
                                  <Icon size={14} /> {item.label}
                                </h4>
                              </Link>
                              <p className="text-xs text-[#5b5b5b] mt-1">{status}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => router.push(`/dashboard/${projectId}/plan/level_6_beta_testing/${nextPrevLevel(6)}`)}
                        className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-1 min-w-[80px]"
                      >
                        <ChevronLeft size={16} />
                        Prev
                      </button>
                      <button
                        onClick={handleSelesaiClick}
                        className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg  hover:bg-[#7abfc0] flex items-center gap-1 min-w-[100px]"
                      >
                        Selesai
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Kolom Kanan */}
                  <div className="space-y-5">
                    {/* Progress Bar */}
                    <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap size={16} className="text-[#f02d9c]" />
                        <span className="font-bold text-[#5b5b5b]">Progress Fase Plan</span>
                      </div>
                      <PhaseProgressBar currentXp={currentXp} totalXp={totalXp} />
                    </div>

                    {/* Pencapaian */}
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

                    {/* Petunjuk */}
                    <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                      <h3 className="font-bold text-[#5b5b5b] mb-3 flex items-center gap-1">
                        <BookOpen size={16} className="text-[#f02d9c]" />
                        Petunjuk
                      </h3>
                      <div className="space-y-2">
                        {[
                          'Siapkan akun Instagram & WhatsApp bisnis',
                          'Uji coba proses pengiriman/pengambilan',
                          'Tentukan harga & paket (misal: bundle hemat)',
                          'Kumpulkan 3 testimoni awal',
                          'Tentukan jam operasional & respons',
                        ].map((text, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-[#5b5b5b]">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#f02d9c] text-white text-xs font-bold mt-0.5 flex-shrink-0">
                              {i + 1}
                            </span>
                            <span>{text}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-2.5 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
                          <Lightbulb size={12} /> Tujuan: Siapkan fondasi untuk pelanggan pertama
                        </span>
                        <span className="px-2.5 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center gap-1">
                          <Award size={12} /> Tips: Mulai dari 5 orang terdekat untuk validasi
                        </span>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-white">
                      <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-1">
                        <BookOpen size={14} /> Resources
                      </h3>
                      <ul className="text-sm text-[#5b5b5b] space-y-1.5">
                        <li>
                          <a
                            href="https://www.canva.com/templates/?category=Instagram%20post"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                          >
                            Template Konten Instagram (Canva) <ChevronRight size={12} />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.canva.com/templates/?category=product%20catalog"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                          >
                            Template Katalog Produk <ChevronRight size={12} />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://merchant.qris.id/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                          >
                            Daftar QRIS Resmi untuk Pembayaran <ChevronRight size={12} />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.photopea.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                          >
                            Edit Foto Produk Gratis (Photopea) <ChevronRight size={12} />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.instagram.com/business/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                          >
                            Panduan Optimasi Instagram Bisnis <ChevronRight size={12} />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.whatsapp.com/business/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                          >
                            WhatsApp Business – Fitur & Pengaturan Lengkap <ChevronRight size={12} />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://www.canva.com/templates/EADapCj8m3M-minimalist-review-testimonial-instagram-post/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                          >
                            Template Testimoni Pelanggan <ChevronRight size={12} />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {currentLevel?.completed ? (
        <NotificationModalPlan
          isOpen={showNotification}
          type="success"
          pesan="Fase Plan telah selesai!"
          keterangan="Setelah ide bisnismu berhasil dilaunching pantau perkembangan penjualan bisnismu di Fase Sell!"
          onClose={() => {
            setShowNotification(false);
            router.push(`/dashboard/${projectId}`);
          }}
        />
      ) : (
        <NotificationModalPlan
          isOpen={showNotification}
          type="success"
          xpGained={xpGained}
          badgeName={badgeName}
          onClose={() => {
            setShowNotification(false);
            router.push(`/dashboard/${projectId}`);
          }}
        />
      )}
    </div>
  );
}