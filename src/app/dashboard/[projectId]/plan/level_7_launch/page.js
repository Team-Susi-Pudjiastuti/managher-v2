'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
} from 'lucide-react';

import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';
import NotificationModalPlan from '@/components/NotificationModalPlan';
import useProjectStore from '@/store/useProjectStore';
import { useLaunchChecklistStore } from '@/store/useLaunchChecklistStore';

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

export default function Level7Page() {
  const { projectId } = useParams();
  const router = useRouter();

  const { planLevels, getLevels } = useProjectStore();
  const { checklist, fetchChecklist, toggleItem } = useLaunchChecklistStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (projectId && projectId !== 'undefined') {
      getLevels(projectId);
      fetchChecklist(projectId);
    }
  }, [projectId]);

  // Helper: Kembalikan level lengkap berdasarkan order
  const getLevel = (order) => {
    return planLevels.find((l) => l.order === order) || null;
  };

  const vpc = getLevel(1);
  const rww = getLevel(2);
  const brand = getLevel(3);
  const lean = getLevel(4);
  const mvp = getLevel(5);
  const beta = getLevel(6);

  // Status
  const vpcStatus = vpc?.data?.productsServices ? 'Selesai' : 'Belum selesai';
  const rwwStatus = rww?.data?.problem ? 'Selesai' : 'Belum selesai';
  const brandStatus = brand?.data?.brandName ? 'Selesai' : 'Belum selesai';
  const leanStatus = lean?.data?.problem ? 'Selesai' : 'Belum selesai';
  const mvpStatus = mvp?.data?.products?.length > 0 ? 'Ada produk' : 'Belum diisi';
  const betaStatus = beta?.data?.feedback?.length > 0 ? `${beta.data.feedback.length} feedback` : 'Belum diuji';

  const getVPCProductTitle = (ps) => {
    if (!ps) return '-';
    return ps.split('\n')[0] || '-';
  };

  // Progress XP
  const totalLevels = 7;
  const currentXp = planLevels.filter((l) => l.completed).length * 10;
  const totalXp = totalLevels * 10;

  const currentLevel = planLevels.find((l) => l.order === 7);
  const xpGained = currentLevel?.xp || 10;
  const badgeName = currentLevel?.badge || 'Launch Star';

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
    { label: 'Level 7: Aset & Checklist Launching' },
  ];

  const handleSelesaiClick = () => {
    const allDone = Object.values(checklist).every((v) => v);
    if (allDone) {
      setShowConfetti(true);
      setShowNotification(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } else {
      alert('Selesaikan semua checklist terlebih dahulu untuk melanjutkan.');
    }
  };

  const totalItems = CHECKLIST_ITEMS.length;
  const completedItems = Object.values(checklist).filter(Boolean).length;
  const progressPercentage = Math.round((completedItems / totalItems) * 100);

  if (!isMounted) {
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

      <div className="flex">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Kolom Kiri */}
                  <div className="space-y-6">
                    {/* Checklist */}
                    <div className="border border-gray-300 rounded-xl p-4 bg-[#f0f9f9]">
                      <h3 className="font-bold text-[#f02d9c] mb-3 flex items-center gap-2">
                        <ClipboardCheck size={16} />
                        Checklist Launching (Solopreneur Pemula)
                      </h3>
                      <ul className="space-y-2">
                        {CHECKLIST_ITEMS.map((item) => {
                          const Icon = item.icon;
                          const isChecked = checklist[item.id] || false;
                          return (
                            <li key={item.id} className="flex items-start gap-2 text-sm">
                              <button
                                onClick={() => toggleItem(projectId, item.id)}
                                className="mt-0.5 w-5 h-5 flex items-center justify-center border border-gray-400 rounded-sm bg-white hover:bg-[#f0f9f9]"
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-gray-300 rounded-xl p-3 bg-[#fdf6f0]">
                          <h4 className="font-bold text-[#0a5f61] text-sm flex items-center gap-1">
                            <Target size={14} /> VPC
                          </h4>
                          <p className="text-xs text-[#5b5b5b] mt-1">
                            {getLevel(1)?.completed ? 'Selesai' : 'Belum selesai'}
                          </p>
                        </div>
                        <div className="border border-gray-300 rounded-xl p-3 bg-[#fdf6f0]">
                          <h4 className="font-bold text-[#0a5f61] text-sm flex items-center gap-1">
                            <BarChart3 size={14} /> RWW Analysis
                          </h4>
                          <p className="text-xs text-[#5b5b5b] mt-1">
                            {getLevel(2)?.completed ? 'Selesai' : 'Belum selesai'}
                          </p>
                        </div>
                        <div className="border border-gray-300 rounded-xl p-3 bg-[#fdf6f0]">
                          <h4 className="font-bold text-[#0a5f61] text-sm flex items-center gap-1">
                            <Palette size={14} /> Brand Identity
                          </h4>
                          <p className="text-xs text-[#5b5b5b] mt-1">
                            {getLevel(3)?.completed ? 'Selesai' : 'Belum selesai'}
                          </p>
                        </div>
                        <div className="border border-gray-300 rounded-xl p-3 bg-[#fdf6f0]">
                          <h4 className="font-bold text-[#0a5f61] text-sm flex items-center gap-1">
                            <FileText size={14} /> Lean Canvas
                          </h4>
                          <p className="text-xs text-[#5b5b5b] mt-1">
                            {getLevel(4)?.completed ? 'Selesai' : 'Belum selesai'}
                          </p>
                        </div>
                        <div className="border border-gray-300 rounded-xl p-3 bg-[#fdf6f0]">
                          <h4 className="font-bold text-[#0a5f61] text-sm flex items-center gap-1">
                            <Rocket size={14} /> MVP
                          </h4>
                          <p className="text-xs text-[#5b5b5b] mt-1">
                            {getLevel(5)?.completed ? 'Selesai' : 'Belum diisi'}
                          </p>
                        </div>
                        <div className="border border-gray-300 rounded-xl p-3 bg-[#fdf6f0]">
                          <h4 className="font-bold text-[#0a5f61] text-sm flex items-center gap-1">
                            <Users size={14} /> Beta Testing
                          </h4>
                          <p className="text-xs text-[#5b5b5b] mt-1">
                            {getLevel(6)?.completed ? 'Selesai' : 'Belum diuji'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/${projectId}/plan/level_6_beta_testing`)}
                        className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-1"
                      >
                        <ChevronLeft size={16} />
                        Prev
                      </button>
                      <button
                        onClick={handleSelesaiClick}
                        className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg border border-black hover:bg-[#7abfc0] flex items-center gap-1"
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
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#f02d9c] text-white text-xs font-bold mt-0.5">
                              {i + 1}
                            </span>
                            {text}
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
                            href="https://miro.com/templates/value-proposition-canvas/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                          >
                            Miro VPC Template <ChevronRight size={12} />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://miro.com/templates/lean-canvas/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                          >
                            Miro Lean Canvas Template <ChevronRight size={12} />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://perempuaninovasi.id/workshop"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                          >
                            Workshop Perempuan Inovasi <ChevronRight size={12} />
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
    </div>
  );
}