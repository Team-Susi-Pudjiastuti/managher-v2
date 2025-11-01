'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Menu,
  Target,
  BarChart3,
  Palette,
  FileText,
  Award,
  Rocket,
  Users,
  ClipboardCheck,
  Goal,
  Sparkles,
  Video,
  BookOpen,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Smartphone,
  Truck,
  CreditCard,
  MessageCircle,
  Store,
  Clock,
  CheckCircle
} from 'lucide-react';

import useProjectStore from '@/store/useProjectStore';
import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';

// Daftar item checklist
const CHECKLIST_ITEMS = [
  { id: 'social', label: 'Buat akun Instagram & WhatsApp bisnis', icon: Instagram },
  { id: 'photos', label: 'Siapkan foto produk yang menarik', icon: Smartphone },
  { id: 'payment', label: 'Siapkan metode pembayaran (QRIS, transfer)', icon: CreditCard },
  { id: 'offer', label: 'Tawarkan ke orang terdekat (teman/keluarga)', icon: MessageCircle },
  { id: 'delivery', label: 'Uji coba proses pengiriman/pengambilan', icon: Truck },
  { id: 'price', label: 'Tentukan harga & paket (misal: bundle hemat)', icon: Store },
  { id: 'feedback', label: 'Kumpulkan 3 testimoni awal', icon: Users },
  { id: 'schedule', label: 'Tentukan jam operasional & respons', icon: Clock }
];

export default function Level7Page() {
  const { projectId } = useParams();
  const router = useRouter();
  const projects = useProjectStore((state) => state.projects);
  const updateProject = useProjectStore((state) => state.updateProject);

  const [project, setProject] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [checklist, setChecklist] = useState({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (projectId) {
      const found = projects.find(p => p.id === projectId);
      setProject(found);
      if (found?.levels?.[6]?.data?.checklist) {
        setChecklist(found.levels[6].data.checklist);
      } else {
        const initial = {};
        CHECKLIST_ITEMS.forEach(item => {
          initial[item.id] = false;
        });
        setChecklist(initial);
      }
    }
  }, [projectId, projects]);

  const toggleChecklistItem = (id) => {
    const newChecklist = { ...checklist, [id]: !checklist[id] };
    setChecklist(newChecklist);

    const updatedLevels = [...(project?.levels || [])];
    // Pastikan level 7 (index 6) tersedia
    while (updatedLevels.length <= 6) {
      updatedLevels.push({ id: updatedLevels.length + 1, completed: false, data: {} });
    }
    updatedLevels[6] = {
      id: 7,
      completed: Object.values(newChecklist).every(Boolean),
      data: { checklist: newChecklist }
    };

    updateProject(projectId, { levels: updatedLevels });
  };

  const getLevelData = (levelIndex) => {
    return project?.levels?.[levelIndex]?.data || null;
  };

  const vpc = getLevelData(0); // Level 1
  const rww = getLevelData(1); // Level 2
  const brand = getLevelData(2); // Level 3
  const lean = getLevelData(3); // Level 4
  const mvp = getLevelData(4); // Level 5
  const beta = getLevelData(5); // Level 6

  const getVPCProductTitle = (ps) => {
    if (!ps) return '-';
    return ps.split('\n')[0] || '-';
  };

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
    { label: 'Level 7: Aset & Checklist Launching' }
  ];

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
                                onClick={() => toggleChecklistItem(item.id)}
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
                            {vpc ? getVPCProductTitle(vpc.productsServices) : 'Belum selesai'}
                          </p>
                        </div>
                        <div className="border border-gray-300 rounded-xl p-3 bg-[#fdf6f0]">
                          <h4 className="font-bold text-[#0a5f61] text-sm flex items-center gap-1">
                            <BarChart3 size={14} /> RWW Analysis
                          </h4>
                          <p className="text-xs text-[#5b5b5b] mt-1">
                            {rww ? 'Selesai' : 'Belum selesai'}
                          </p>
                        </div>
                        <div className="border border-gray-300 rounded-xl p-3 bg-[#fdf6f0]">
                          <h4 className="font-bold text-[#0a5f61] text-sm flex items-center gap-1">
                            <Palette size={14} /> Brand Identity
                          </h4>
                          <p className="text-xs text-[#5b5b5b] mt-1">
                            {brand?.brandName || 'Belum selesai'}
                          </p>
                        </div>
                        <div className="border border-gray-300 rounded-xl p-3 bg-[#fdf6f0]">
                          <h4 className="font-bold text-[#0a5f61] text-sm flex items-center gap-1">
                            <FileText size={14} /> Lean Canvas
                          </h4>
                          <p className="text-xs text-[#5b5b5b] mt-1">
                            {lean ? 'Ada masalah & solusi' : 'Belum selesai'}
                          </p>
                        </div>
                        <div className="border border-gray-300 rounded-xl p-3 bg-[#fdf6f0]">
                          <h4 className="font-bold text-[#0a5f61] text-sm flex items-center gap-1">
                            <Rocket size={14} /> MVP
                          </h4>
                          <p className="text-xs text-[#5b5b5b] mt-1">
                            {mvp?.mvpImageUrl ? 'Gambar tersedia' : 'Belum diunggah'}
                          </p>
                        </div>
                        <div className="border border-gray-300 rounded-xl p-3 bg-[#fdf6f0]">
                          <h4 className="font-bold text-[#0a5f61] text-sm flex items-center gap-1">
                            <Users size={14} /> Beta Testing
                          </h4>
                          <p className="text-xs text-[#5b5b5b] mt-1">
                            {beta?.testers ? `${beta.testers} tester` : 'Belum diuji'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/${projectId}/plan/level_6_beta_launch`)}
                        className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-1"
                      >
                        <ChevronLeft size={16} />
                        Prev
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/${projectId}`)}
                        className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg border border-black hover:bg-[#7abfc0] flex items-center gap-1"
                      >
                        Selesai
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Kolom Kanan */}
                  <div className="space-y-5">
                    <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                      <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-2">
                        <Goal size={16} />
                        Tujuan Level 7
                      </h3>
                      <ul className="text-sm text-[#5b5b5b] list-disc pl-5 space-y-1">
                        <li>Pastikan kesiapan operasional harian</li>
                        <li>Kurangi risiko gagal dengan langkah kecil</li>
                        <li>Siapkan fondasi untuk pelanggan pertama</li>
                      </ul>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                      <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-2">
                        <Award size={16} />
                        Tips untuk Solopreneur
                      </h3>
                      <ul className="text-sm text-[#5b5b5b] list-disc pl-5 space-y-1">
                        <li><strong>Jangan tunggu sempurna!</strong> Mulai dengan yang bisa kamu lakukan hari ini</li>
                        <li>Gunakan <strong>HP + Canva</strong> untuk foto & konten</li>
                        <li>Mulai dari <strong>5 orang terdekat</strong> untuk validasi</li>
                      </ul>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                      <h3 className="font-bold text-[#0a5f61] mb-3">
                        <BookOpen size={16} /> Resources</h3>
                      <ul className="text-sm text-[#5b5b5b] space-y-2">
                        <li>
                          <a href="https://miro.com/templates/value-proposition-canvas/" target="_blank" rel="noopener noreferrer" className="text-[#f02d9c] hover:underline flex items-center gap-1">
                            Miro VPC Template <ExternalLink size={12} />
                          </a>
                        </li>
                        <li>
                          <a href="https://www.canva.com/templates/EAFhWMaXv5c-pink-modern-fashion-business-plan-presentation/" target="_blank" rel="noopener noreferrer" className="text-[#f02d9c] hover:underline">
                            Template Canva UMKM
                          </a>
                        </li>
                        <li>
                          <a href="https://perempuaninovasi.id/workshop" target="_blank" rel="noopener noreferrer" className="text-[#f02d9c] hover:underline">
                            Workshop Perempuan Inovasi
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
    </div>
  );
}