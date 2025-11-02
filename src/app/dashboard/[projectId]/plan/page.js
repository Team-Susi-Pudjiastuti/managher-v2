'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useProjectStore from '@/store/useProjectStore';
import Breadcrumb from '@/components/Breadcrumb';

import { 
  Lightbulb, CheckCircle, Palette, FileText, Box, Users, Rocket,
  Lock, Check, Sparkle 
} from 'lucide-react';

const PLAN_LEVELS = [
  { 
    id: 1, 
    title: "Ide Generator", 
    phase: "plan", 
    xp: 10, 
    icon: Lightbulb, 
    path: "level_1_idea", 
    badge: "AI Innovator",
    description: "Temukan ide produk yang relevan dan layak berdasarkan minat/bidang Anda.",
    guide: [
      "Isi minat/bidang (misal: kuliner)",
      "Klik \"Generate\" untuk dapat 3 ide",
      "Pilih salah satu ide yang paling menarik",
      "Tinjau atau edit detail produk & pelanggan",
      "Klik \"Simpan\" untuk lanjut ke Level 2"
    ],
    goal: "Temukan ide yang relevan & layak",
    tip: "Fokus pada satu pelanggan dulu",
    resources: ["Strategyzer VPC Guide", "Miro VPC Template"]
  },
  { 
    id: 2, 
    title: "RWW Analysis", 
    phase: "plan", 
    xp: 10, 
    icon: CheckCircle, 
    path: "level_2_rww", 
    badge: "Validator Pro",
    description: "Validasi ide Anda dengan analisis R-W-W (Real, Win, Worth It).",
    guide: [
      "Jawab pertanyaan Real: Apakah masalah ini nyata?",
      "Jawab pertanyaan Win: Apakah kita bisa menang?",
      "Jawab pertanyaan Worth It: Apakah worth it secara bisnis?",
      "Gunakan template RWW untuk struktur jawaban",
      "Klik \"Simpan\" untuk lanjut ke Level 3"
    ],
    goal: "Validasi ide dengan RWW framework",
    tip: "Jangan terlalu optimis — jujur dalam evaluasi",
    resources: ["RWW Framework Guide", "Lean Startup Canvas"]
  },
  { 
    id: 3, 
    title: "Brand Identity", 
    phase: "plan", 
    xp: 10, 
    icon: Palette, 
    path: "level_3_product_brand", 
    badge: "Brand Builder",
    description: "Bangun identitas merek yang kuat dan konsisten untuk produk Anda.",
    guide: [
      "Tentukan nama brand dan tagline",
      "Pilih warna, font, dan gaya visual",
      "Buat deskripsi brand singkat (value proposition)",
      "Uji konsistensi dengan target audiens",
      "Klik \"Simpan\" untuk lanjut ke Level 4"
    ],
    goal: "Ciptakan identitas brand yang meyakinkan",
    tip: "Konsistensi lebih penting daripada keindahan",
    resources: ["Brand Identity Checklist", "Canva Brand Kit Template"]
  },
  { 
    id: 4, 
    title: "Lean Canvas", 
    phase: "plan", 
    xp: 10, 
    icon: FileText, 
    path: "level_4_lean_canvas", 
    badge: "Canvas Master",
    description: "Susun Lean Canvas untuk merangkum model bisnis Anda secara ringkas.",
    guide: [
      "Isi blok: Problem, Solution, Key Metrics, Unique Value Proposition",
      "Identifikasi customer segments dan channels",
      "Tentukan cost structure dan revenue streams",
      "Review ulang agar semua blok saling terhubung",
      "Klik \"Simpan\" untuk lanjut ke Level 5"
    ],
    goal: "Susun Lean Canvas lengkap dan kohesif",
    tip: "Fokus pada blok yang paling tidak pasti dulu",
    resources: ["Lean Canvas Template", "Business Model Canvas Guide"]
  },
  { 
    id: 5, 
    title: "MVP", 
    phase: "plan", 
    xp: 10, 
    icon: Box, 
    path: "level_5_MVP", 
    badge: "MVP Maker",
    description: "Rancang Minimum Viable Product (MVP) untuk menguji asumsi pasar.",
    guide: [
      "Identifikasi fitur inti yang wajib ada di MVP",
      "Hilangkan fitur yang tidak esensial",
      "Rancang prototipe sederhana (sketsa / wireframe)",
      "Tentukan metrik keberhasilan MVP",
      "Klik \"Simpan\" untuk lanjut ke Level 6"
    ],
    goal: "Rancang MVP yang fokus dan bisa diuji",
    tip: "MVP bukan versi murah — tapi versi paling sederhana yang bisa memberi nilai",
    resources: ["MVP Design Guide", "Figma MVP Template"]
  },
  { 
    id: 6, 
    title: "Beta Testing", 
    phase: "plan", 
    xp: 10, 
    icon: Users, 
    path: "level_6_beta_testing", 
    badge: "Tester Hero",
    description: "Uji MVP Anda dengan pengguna beta untuk mendapatkan feedback awal.",
    guide: [
      "Rekrut 5-10 pengguna beta dari target market",
      "Siapkan panduan penggunaan MVP",
      "Kumpulkan feedback melalui survei atau wawancara",
      "Catat pain point dan insight baru",
      "Klik \"Simpan\" untuk lanjut ke Level 7"
    ],
    goal: "Dapatkan feedback nyata dari pengguna beta",
    tip: "Jangan defend produk — dengarkan dengan rendah hati",
    resources: ["Beta Testing Checklist", "User Feedback Form Template"]
  },
  { 
    id: 7, 
    title: "Persiapan Launching", 
    phase: "plan", 
    xp: 10, 
    icon: Rocket, 
    path: "level_7_launch", 
    badge: "Launch Ready",
    description: "Siapkan strategi peluncuran produk agar sukses di pasar.",
    guide: [
      "Tentukan tanggal launch dan target awal",
      "Siapkan materi promosi (social media, email, landing page)",
      "Atur tim support dan FAQ",
      "Buat rencana kontinjensi jika ada masalah",
      "Klik \"Simpan\" untuk menyelesaikan Fase Plan"
    ],
    goal: "Siapkan strategi launching yang matang",
    tip: "Launch bukan akhir — tapi awal dari iterasi",
    resources: ["Launch Playbook", "Marketing Calendar Template"]
  },
];

export default function PlanLevelsPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const projects = useProjectStore((state) => state.projects);
  const [activeLevel, setActiveLevel] = useState(null); // <-- State untuk menampilkan detail level

  useEffect(() => {
    if (projectId) {
      const found = projects.find((p) => p.id === projectId);
      setProject(found);
    }
  }, [projectId, projects]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        Memuat...
      </div>
    );
  }

  const enrichedLevels = PLAN_LEVELS.map(level => {
    const existing = project?.levels?.find(l => l.id === level.id);
    return {
      ...level,
      completed: existing?.completed || false,
    };
  });

  const completedLevels = enrichedLevels.filter(l => l.completed);
  const currentXp = completedLevels.reduce((sum, l) => sum + l.xp, 0);
  const totalXp = PLAN_LEVELS.reduce((sum, l) => sum + l.xp, 0);
  const phaseProgress = Math.min(100, Math.floor((currentXp / totalXp) * 100));

  const firstIncompleteLevel = enrichedLevels.find(l => !l.completed);

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { label: 'Fase Plan' }
  ];

  const renderLevelBadge = (level) => {
    const isCompleted = level.completed;
    const isActive = level.id === firstIncompleteLevel?.id;

    let bgColor, textColor, borderColor, badgeBg;
    if (isCompleted) {
      bgColor = 'bg-[#fdf6f0]';
      textColor = 'text-slate-800';
      borderColor = 'border-[#f02d9c]/30';
      badgeBg = 'bg-[#8acfd1] text-white';
    } else if (isActive) {
      bgColor = 'bg-[#f02d9c]';
      textColor = 'text-white';
      borderColor = 'border-[#f02d9c]';
      badgeBg = 'bg-[#8acfd1] text-white';
    } else {
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-500';
      borderColor = 'border-gray-300';
      badgeBg = 'bg-gray-300 text-gray-700';
    }

    const Icon = level.icon;

    return (
      <div
        className={`w-[120px] h-[130px] rounded-lg border ${borderColor} ${bgColor} ${textColor} p-2 flex flex-col items-center justify-between`}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-[#f02d9c]">
          <Icon size={16} className="text-[#f02d9c]" />
        </div>
        <div className="text-center mt-1">
          <h4 className="font-bold text-xs">L{level.id}</h4>
          <p className="text-[10px] mt-0.5">{level.title}</p>
          <span className="block text-[8px] font-semibold mt-1">+{level.xp} XP</span>
        </div>
        {level.badge && (
          <span className={`mt-1 px-1.5 py-0.5 rounded text-[7px] font-bold whitespace-nowrap ${badgeBg}`}>
            {level.badge}
          </span>
        )}
      </div>
    );
  };

  const renderSidebar = (level) => {
    if (!level) return null;

    return (
      <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border-t border-l border-black shadow-[1px_1px_0_0_#f02d9c]">
        {/* Pencapaian */}
        <div className="mb-5 p-3 bg-[#fdf6f0] rounded-lg border border-[#f02d9c]/30">
          <h3 className="font-semibold text-sm text-[#5b5b5b] mb-2">Pencapaian</h3>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-2 py-1 bg-[#f02d9c] text-white text-xs rounded-full font-medium">
              +{level.xp} XP
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-[#8acfd1] text-white text-xs rounded-full font-medium">
              {level.badge}
            </span>
          </div>
          <p className="text-xs text-[#7a7a7a] mt-1">
            Kumpulkan XP & badge di setiap level untuk naik pangkat dari Zero ke CEO!
          </p>
        </div>

        {/* Petunjuk */}
        <div className="mb-5 p-3 bg-[#fdf6f0] rounded-lg border border-[#f02d9c]/30">
          <h3 className="font-semibold text-sm text-[#5b5b5b] mb-2 flex items-center gap-1">
            <FileText size={14} className="text-[#f02d9c]" />
            Petunjuk
          </h3>
          <ol className="space-y-1">
            {level.guide.map((step, index) => (
              <li key={index} className="flex items-start gap-1 text-xs">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f02d9c] text-white flex items-center justify-center text-[10px] font-bold">
                  {index + 1}
                </span>
                <span className="text-[#5b5b5b]">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3 space-y-1">
            <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
              <span className="mr-1">💡</span> Tujuan: {level.goal}
            </div>
            <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
              <span className="mr-1">✨</span> Tips: {level.tip}
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="p-3 bg-[#fdf6f0] rounded-lg border border-[#f02d9c]/30">
          <h3 className="font-semibold text-sm text-[#5b5b5b] mb-2 flex items-center gap-1">
            <Box size={14} className="text-[#f02d9c]" />
            Resources
          </h3>
          <ul className="space-y-1">
            {level.resources.map((resource, index) => (
              <li key={index} className="text-xs text-[#f02d9c] hover:text-[#f02d9c]/80 cursor-pointer">
                {resource}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-3 sm:px-4 md:px-6 py-2 border-b border-gray-200 bg-white">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="max-w-6xl mx-auto mt-6 p-3 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Progress & Levels List */}
        <div className="lg:col-span-2">
          <h1 className="text-xl sm:text-2xl font-bold text-[#5b5b5b] mb-4 sm:mb-6">Fase: Plan</h1>

          {/* Progress Bar */}
          <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-[#5b5b5b] text-sm sm:text-base">XP Fase Plan: {currentXp} / {totalXp}</span>
              <span className="font-bold text-[#f02d9c] text-sm sm:text-base">{phaseProgress}%</span>
            </div>
            <div className="w-full bg-[#f0f0f0] rounded-full h-2 sm:h-2.5 border border-[#e0e0e0]">
              <div
                className="h-2 sm:h-2.5 rounded-full bg-[#f02d9c] transition-all duration-500"
                style={{ width: `${phaseProgress}%` }}
              ></div>
            </div>
            <p className="text-xs sm:text-sm text-[#7a7a7a] mt-2">
              {phaseProgress < 100
                ? `Lanjutkan ke Level ${firstIncompleteLevel?.id || ''} untuk menyelesaikan fase ini`
                : 'Fase Plan telah selesai!'}
            </p>
          </div>

          {/* DAFTAR LEVEL */}
          <div className="space-y-4 sm:space-y-6">
            {enrichedLevels.map((level) => {
              const isCompleted = level.completed;
              const isUnlocked = level.id <= (firstIncompleteLevel?.id || Infinity);
              const isActive = level.id === firstIncompleteLevel?.id;

              return (
                <div key={level.id} className="relative">
                  <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-xl sm:rounded-2xl"></div>
                  <div
                    className="relative bg-white rounded-xl sm:rounded-2xl border-t border-l border-black p-3 sm:p-5"
                    style={{ boxShadow: '1px 1px 0 0 #f02d9c' }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <div className="shrink-0 hidden sm:block">
                        {renderLevelBadge(level)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#5b5b5b] text-base sm:text-lg">{level.title}</h3>
                        <p className="text-xs sm:text-sm text-[#7a7a7a] mt-1 flex items-start gap-1">
                          {isCompleted ? (
                            <>
                              <Check size={14} className="text-green-600 mt-0.5 shrink-0" />
                              <span>Sudah selesai</span>
                            </>
                          ) : isActive ? (
                            <>
                              <Sparkle size={14} className="text-[#f02d9c] mt-0.5 shrink-0" />
                              <span>Siap dikerjakan — klik "Buka" untuk mulai</span>
                            </>
                          ) : !isUnlocked ? (
                            <>
                              <Lock size={14} className="text-gray-500 mt-0.5 shrink-0" />
                              <span>Belum bisa diakses — selesaikan level sebelumnya</span>
                            </>
                          ) : (
                            <>
                              <Sparkle size={14} className="text-[#f02d9c] mt-0.5 shrink-0" />
                              <span>Buka untuk lanjutkan</span>
                            </>
                          )}
                        </p>
                      </div>

                      <div className="shrink-0 mt-2 sm:mt-0">
                        {isCompleted || isUnlocked ? (
                          <Link 
                            href={`/dashboard/${projectId}/plan/${level.path}`} 
                            className="group relative inline-block"
                            onClick={() => setActiveLevel(level)} // <-- Set active level on click
                          >
                            <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-full"></div>
                            <div
                              className="relative px-3 py-1 sm:px-4 sm:py-1.5 bg-white rounded-full border-t border-l border-black font-medium text-black text-xs sm:text-sm
                                group-hover:bg-[#f02d9c] group-hover:text-white
                                group-hover:translate-x-1 group-hover:translate-y-1
                                transition-all duration-200 whitespace-nowrap"
                              style={{ boxShadow: '1px 1px 0 0 #f02d9c' }}
                            >
                              Buka
                            </div>
                          </Link>
                        ) : (
                          <div className="group relative inline-block opacity-70 cursor-not-allowed">
                            <div className="absolute inset-0 translate-x-1 translate-y-1 bg-gray-300 rounded-full"></div>
                            <div
                              className="relative px-3 py-1 sm:px-4 sm:py-1.5 bg-white rounded-full border-t border-l border-gray-400 font-medium text-gray-500 text-xs sm:text-sm flex items-center gap-1"
                              style={{ boxShadow: '1px 1px 0 0 #d1d5db' }}
                            >
                              <Lock size={10} />
                              <span className="hidden sm:inline">Terkunci</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sidebar Detail */}
        <div className="lg:col-span-1">
          {activeLevel ? (
            renderSidebar(activeLevel)
          ) : (
            <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border-t border-l border-black shadow-[1px_1px_0_0_#f02d9c]">
              <div className="text-center py-8">
                <Sparkle size={24} className="mx-auto text-[#f02d9c] mb-2" />
                <p className="text-sm text-[#5b5b5b]">Pilih level di sebelah kiri untuk melihat detail petunjuk, pencapaian, dan resource.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}