'use client';
import React, { useState, useEffect, useRef } from 'react'; // Tambahkan useRef
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  Lightbulb,
  Award,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Edit3,
  CheckCircle,
  Target,
  Trophy,
  DollarSign,
  Users,
  AlertTriangle,
  BarChart3,
  Eye,
  Zap,
  Package,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import useProjectStore from '@/store/useProjectStore';
import useRWWTestingStore from '@/store/useRWWTesting';
import useBusinessIdeaStore from '@/store/useBusinessIdea';
import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';
import NotificationModalPlan from '@/components/NotificationModalPlan';
import Confetti from '@/components/Confetti';


// === PROGRESS BAR  ===
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

// === HELPER: Parse & Format Products & Services ===
const parseProductsServices = (text) => {
  if (!text) return {};
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l);
  let ide = '',
    jenis = '',
    deskripsi = '',
    fitur = '',
    manfaat = '',
    harga = '',
    biayaModal = '',
    biayaBahanBaku = '',
    hargaJual = '',
    margin = '',
    uniqueAdvantage = '',
    keyMetrics = '',
    channel = '';
  for (const line of lines) {
    if (line.startsWith('Jenis:')) jenis = line.replace('Jenis:', '').trim();
    else if (line.startsWith('Deskripsi:')) deskripsi = line.replace('Deskripsi:', '').trim();
    else if (line.startsWith('Fitur')) fitur = line;
    else if (line.startsWith('Manfaat')) manfaat = line;
    else if (line.startsWith('Harga:')) harga = line;
    else if (line.startsWith('Biaya Modal:')) biayaModal = line;
    else if (line.startsWith('Biaya Bahan Baku:')) biayaBahanBaku = line;
    else if (line.startsWith('Harga Jual:')) hargaJual = line;
    else if (line.startsWith('Margin:')) margin = line;
    else if (line.startsWith('Keunggulan Unik:')) uniqueAdvantage = line;
    else if (line.startsWith('Angka Penting:')) keyMetrics = line;
    else if (line.startsWith('Cara Jualan:')) channel = line;
    else if (!ide) ide = line;
  }
  return {
    ide,
    jenis,
    deskripsi,
    fitur,
    manfaat,
    harga,
    biayaModal,
    biayaBahanBaku,
    hargaJual,
    margin,
    uniqueAdvantage,
    keyMetrics,
    channel,
  };
};

const parseModalDetails = (text) => {
  if (!text) return [];
  const clean = text.replace('Biaya Modal: ', '').trim();
  const match = clean.match(/\((.+)\)/);
  return match ? match[1].split(',').map((item) => item.trim()) : [clean];
};

const parseBahanBakuDetails = (text) => {
  if (!text) return [];
  const clean = text.replace('Biaya Bahan Baku: ', '').trim();
  const parts = clean.split('→')[0].split(',');
  return parts.map((part) => part.trim());
};

// === MAIN COMPONENT ===
const scaleLabels = ['Tidak Pernah', 'Pernah', 'Kadang', 'Sering', 'Sangat Sering'];
const range5 = [1, 2, 3, 4, 5];

export default function RWW() {
  const { id, projectId } = useParams();
  const router = useRouter();
  const projects = useProjectStore((state) => state.projects);
  const updateProject = useProjectStore((state) => state.updateProject);
  const { rwwTesting, getRWWTesting, updateRWWTesting, addRWWTesting } = useRWWTestingStore();
  const { getBusinessIdeas, businessIdeas} = useBusinessIdeaStore();
  const { planLevels, updateLevelStatus } = useProjectStore();

  console.log(planLevels)

  
  // --- Tambahkan state untuk confetti ---
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Top-level states
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    xpGained: 0,
    badgeName: '',
  });
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [q3, setQ3] = useState(null);
  const [q4, setQ4] = useState(null);
  const [q5, setQ5] = useState(null);
  const [q6, setQ6] = useState(null);
  const [q7, setQ7] = useState(null);
  const [q8, setQ8] = useState(null);
  const [q9, setQ9] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [responses, setResponses] = useState([]);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [respondenName, setRespondenName] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('');
  const [usia, setUsia] = useState('');
  const [aktivitas, setAktivitas] = useState('');

  // const businessIdeaId = planLevels?.[0].entities[0].entity_ref || null;

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkMobile);
      }
    };
  }, []);

useEffect(() => {
  const businessIdeaId = planLevels?.[0]?.entities?.[0]?.entity_ref;

  if (businessIdeaId) {
    getBusinessIdeas(businessIdeaId);
  }
}, [planLevels]);


  
  // Load RWW Testing data from database
  useEffect(() => {
    if (projectId) {
      getRWWTesting(projectId).then(data => {
        if (data && data.length > 0) {
          const parsed = data.map(r => {
            const realAvg = r.real.reduce((a, b) => a + b, 0) / 3;
            const winAvg = r.win.reduce((a, b) => a + b, 0) / 3;
            const worthAvg = r.worth.reduce((a, b) => a + b, 0) / 3;
            const total = ((realAvg + winAvg + worthAvg) / 3).toFixed(1);
            return {
              id: r._id,
              name: r.name,
              gender: r.gender,
              age: r.age,
              activity: r.activity,
              real: parseFloat(realAvg.toFixed(1)),
              win: parseFloat(winAvg.toFixed(1)),
              worth: parseFloat(worthAvg.toFixed(1)),
              total,
            };
          });
          setResponses(parsed);
        }
      });
    }
  }, [projectId, getRWWTesting]);

  // --- PROGRESS BAR LOGIC ---
  const totalLevels = planLevels.length;
  const completedLevels = planLevels?.filter((l) => l.completed).length || 0;
  const currentXp = planLevels[0]?.xp + planLevels[1]?.xp;
  const totalXp = totalLevels * planLevels[1]?.xp;

  const firstIncompleteLevel = planLevels?.find(l => !l.completed) || { id: 3 };
  
  <Confetti />

  const handleAddResponden = async () => {
    const allAnswered = [q1, q2, q3, q4, q5, q6, q7, q8, q9].every((val) => val !== null);
    if (!allAnswered) {
      alert('Mohon lengkapi semua penilaian (1–5) terlebih dahulu.');
      return;
    }

    const real = [q1, q2, q3];
    const win = [q4, q5, q6];
    const worth = [q7, q8, q9];

    const newRespondenData = {
      project: projectId,
      name: respondenName || '—',
      gender: jenisKelamin || '—',
      age: usia ? parseInt(usia, 10) : null,
      activity: aktivitas || '—',
      real,
      win,
      worth,
    };


    // Kirim ke backend
    await addRWWTesting(newRespondenData);

    // Reset form
    setRespondenName('');
    setJenisKelamin('');
    setUsia('');
    setAktivitas('');
    setQ1(null);
    setQ2(null);
    setQ3(null);
    setQ4(null);
    setQ5(null);
    setQ6(null);
    setQ7(null);
    setQ8(null);
    setQ9(null);

    // Refresh data dari backend
    const freshData = await getRWWTesting(projectId);
    setResponses(freshData.map(r => {
      const realAvg = r.real.reduce((a, b) => a + b, 0) / 3;
      const winAvg = r.win.reduce((a, b) => a + b, 0) / 3;
      const worthAvg = r.worth.reduce((a, b) => a + b, 0) / 3;
      const total = ((realAvg + winAvg + worthAvg) / 3).toFixed(1);
      return {
        id: r._id,
        name: r.name,
        gender: r.gender,
        age: r.age,
        activity: r.activity,
        real: parseFloat(realAvg.toFixed(1)),
        win: parseFloat(winAvg.toFixed(1)),
        worth: parseFloat(worthAvg.toFixed(1)),
        total,
      };
    }));
  };

  const calculateAverages = () => {
    if (responses.length === 0) return { real: 0, win: 0, worth: 0, total: 0 };
    const totalReal = responses.reduce((sum, r) => sum + r.real, 0);
    const totalWin = responses.reduce((sum, r) => sum + r.win, 0);
    const totalWorth = responses.reduce((sum, r) => sum + r.worth, 0);
    const totalOverall = responses.reduce((sum, r) => sum + parseFloat(r.total), 0);
    return {
      real: (totalReal / responses.length).toFixed(1),
      win: (totalWin / responses.length).toFixed(1),
      worth: (totalWorth / responses.length).toFixed(1),
      total: (totalOverall / responses.length).toFixed(1),
    };
  };

  const averages = calculateAverages();

  const getGenderSummary = () => {
    const genderMap = {};
    responses.forEach((r) => {
      if (r.gender && r.gender !== '—') {
        if (!genderMap[r.gender]) genderMap[r.gender] = [];
        genderMap[r.gender].push(parseFloat(r.total));
      }
    });
    return Object.entries(genderMap)
      .map(([gender, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return { gender, avg: parseFloat(avg.toFixed(1)) };
      })
      .filter((item) => item.avg >= 3.5);
  };

  const getAgeGroupSummary = () => {
    const ageGroups = {};
    responses.forEach((r) => {
      if (r.age && !isNaN(r.age)) {
        let group;
        if (r.age < 20) group = '<20';
        else if (r.age <= 25) group = '21–25';
        else if (r.age <= 30) group = '26–30';
        else if (r.age <= 40) group = '31–40';
        else group = '>40';
        if (!ageGroups[group]) ageGroups[group] = [];
        ageGroups[group].push(parseFloat(r.total));
      }
    });
    return Object.entries(ageGroups)
      .map(([range, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return { range, avg: parseFloat(avg.toFixed(1)) };
      })
      .filter((item) => item.avg >= 3.5);
  };

  const RatingBox = ({ value, onChange, labels = scaleLabels }) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {range5.map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onChange(num)}
          className={`w-14 h-14 flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all border-t border-l border-black`}
          style={{
            backgroundColor: value === num ? '#f02d9c' : '#ffffff',
            color: value === num ? '#ffffff' : '#5b5b5b',
            boxShadow: '2px 2px 0 0 #f02d9c',
          }}
        >
          <span className="font-bold">{num}</span>
          <span className="hidden sm:block mt-1 text-[10px]">{labels[num - 1]}</span>
        </button>
      ))}
    </div>
  );

  const handleSave = async () => {
    const dataToSave = {
      responses,
      averages,
      updatedAt: new Date().toISOString(),
    };
    
    // Save to database using RWW Testing store
    if (rwwTesting && rwwTesting.length > 0) {
      updateRWWTesting(rwwTesting[0]._id, {
        responses,
        averages,
        isValid: parseFloat(averages.total) >= 3.5
      });
    } else {
      addRWWTesting({
        projectId,
        responses,
        isValid: parseFloat(averages.total) >= 3.5
      });
    }
    await updateLevelStatus(planLevels[1]._id, { completed: true });
    
    // Also save to localStorage as backup
    if (typeof window !== 'undefined') {
      localStorage.setItem(`rww_data_${projectId}`, JSON.stringify(dataToSave));
    }
    
    const updatedLevels = Array.isArray(planLevels) ? [...planLevels] : [];
    if (!updatedLevels[1]) updatedLevels[1] = { id: 2, completed: false, data: {} };
    const isValid = parseFloat(averages.total) >= 3.5;
    updatedLevels[1] = {
      ...updatedLevels[1],
      completed: isValid,
      data: {
        ...(updatedLevels[1].data || {}),
        rww: dataToSave,
      },
    };
    if (typeof updateProject === 'function') {
      updateProject(projectId, { levels: updatedLevels });
    }

    // Tampilkan confetti & notifikasi jika valid
    if (isValid) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    setNotificationData({
      xpGained: planLevels[1].xp,
      badgeName: planLevels[1].badge || 'Validator Pro',
    });
    setShowNotification(true);
  };

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
    { label: 'Level 2: Validasi RWW' },
  ];

  const genderSummary = getGenderSummary();
  const ageGroupSummary = getAgeGroupSummary();

  return (
    <div className="min-h-screen bg-white font-[Poppins]">
      {/* Tampilkan Confetti jika kondisi terpenuhi */}
      {showConfetti && <Confetti />}

      <div className="px-3 sm:px-4 md:px-6 py-2 border-b border-gray-200 bg-white">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {isMobile && !mobileSidebarOpen && (
        <header className="p-3 flex items-center border-b border-gray-200 bg-white top-10 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={20} className="text-[#5b5b5b]" />
          </button>
          <h1 className="ml-2 font-bold text-[#5b5b5b] text-base">Level 2: Validasi RWW</h1>
        </header>
      )}

      <div className="flex mt-6">
        <PlanSidebar
          projectId={projectId}
          currentLevelId={2}
          isMobile={isMobile}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
        <main className="flex-1">
          <div className="py-8 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-2xl"></div>
                <div
                  className="relative bg-white rounded-2xl border-t border-l border-black p-5 md:p-7"
                  style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                >
                  <h1 className="text-2xl md:text-3xl font-bold text-[#f02d9c] mb-2 text-center">
                    Level 2: Validasi Ide dengan Teknik RWW
                  </h1>
                  <p className="text-[#5b5b5b] text-center mb-6 max-w-2xl mx-auto">
                    Kumpulkan masukan dari calon pengguna atau mentor menggunakan skala frekuensi: <strong>1–5</strong>.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Kolom Kiri: Preview Ide + Form */}
                    <div>
                      {/* ... (sama seperti file asli) */}
                      {!planLevels?.[0]?.completed ? (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            ❗ Belum ada data dari Level 1. Silakan lengkapi{' '}
                            <Link href={`/dashboard/${projectId}/plan/level_1_idea/${planLevels[0]?.project._id}`} className="text-[#f02d9c] underline">
                              Level 1
                            </Link>{' '}
                            terlebih dahulu.
                          </p>
                        </div>
                      ) : (
                        <div className="mb-6 p-3 bg-[#f8fbfb] rounded-xl border border-[#c2e9e8]">
                          <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-2">
                            <Eye size={16} /> 💡 Ide yang Akan Divalidasi
                          </h3>
                          {(() => {
                            return (
                              <>
                                {/* <ul className="text-[15px] text-[#5b5b5b] space-y-1.5">
                                  <li><span className="font-medium">Apa yang kamu jual?</span> {level1 || '-'}</li>
                                  {ps.jenis && <li><span className="font-medium">Jenis:</span> {ps.jenis}</li>}
                                  {ps.deskripsi && <li><span className="font-medium">Deskripsi:</span> {ps.deskripsi}</li>}
                                  {ps.fitur && <li><span className="font-medium">Fitur utama:</span> {ps.fitur}</li>}
                                  {ps.manfaat && <li><span className="font-medium">Manfaat:</span> {ps.manfaat}</li>}
                                  {ps.harga && <li><span className="font-medium">Harga:</span> {ps.harga}</li>}
                                </ul>
                                {(ps.biayaModal || ps.biayaBahanBaku || ps.hargaJual || ps.margin) && (
                                  <div className="mt-3">
                                    <button
                                      onClick={() => setIsFinanceOpen(!isFinanceOpen)}
                                      className="flex items-center gap-1 text-sm font-medium text-[#f02d9c]"
                                    >
                                      {isFinanceOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                      Lihat rincian keuangan
                                    </button>
                                    {isFinanceOpen && (
                                      <div className="mt-2 p-3 bg-white border border-dashed border-[#c2e9e8] rounded text-[15px] text-[#5b5b5b]">
                                        <h5 className="font-bold text-[#0a5f61] mb-2">Rincian Keuangan</h5>
                                        {ps.biayaModal && (
                                          <div className="mb-2">
                                            <p className="font-medium">Modal Awal:</p>
                                            <p>{ps.biayaModal.replace('Biaya Modal: ', '')}</p>
                                            <ul className="list-disc pl-4 mt-1 text-[14px]">
                                              {parseModalDetails(ps.biayaModal).map((item, i) => (
                                                <li key={i}>{item}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        {ps.biayaBahanBaku && (
                                          <div className="mb-2">
                                            <p className="font-medium">Biaya Bahan Baku:</p>
                                            <p>{ps.biayaBahanBaku.replace('Biaya Bahan Baku: ', '')}</p>
                                            <ul className="list-disc pl-4 mt-1 text-[14px]">
                                              {parseBahanBakuDetails(ps.biayaBahanBaku).map((item, i) => (
                                                <li key={i}>{item}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        {ps.hargaJual && (
                                          <p className="font-medium">Harga Jual: {ps.hargaJual.replace('Harga Jual: ', '')}</p>
                                        )}
                                        {ps.margin && (
                                          <p className="font-medium">Margin: {ps.margin.replace('Margin: ', '')}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )} */}
                                {businessIdeas?.uniqueValueProposition && (
                                  <div className="mt-3 pt-2 border-t border-[#e0f0f0]">
                                    <p className="font-medium text-[#0a5f61] text-sm">Apa yang bikin kamu beda?</p>
                                    <p className="text-[15px] text-[#5b5b5b] mt-1">
                                      {businessIdeas?.uniqueValueProposition.replace('Keunggulan Unik: ', '')}
                                    </p>
                                  </div>
                                )}
                                {businessIdeas?.keyMetrics && (
                                  <div className="mt-3 pt-2 border-t border-[#e0f0f0]">
                                    <p className="font-medium text-[#0a5f61] text-sm">Apa yang mau kamu ukur?</p>
                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                      {ps.keyMetrics
                                        .replace('Angka Penting: ', '')
                                        .split(',')
                                        .map((item, i) => (
                                          <span
                                            key={i}
                                            className="px-2.5 py-1 bg-white border border-[#c2e9e8] text-[14px] text-[#5b5b5b] rounded-full"
                                          >
                                            {item.trim()}
                                          </span>
                                        ))}
                                    </div>
                                  </div>
                                )}
                                {businessIdeas?.channel && (
                                  <div className="mt-3 pt-2 border-t border-[#e0f0f0]">
                                    <p className="font-medium text-[#0a5f61] text-sm">Di mana kamu jualan?</p>
                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                      {ps.channel
                                        .replace('Cara Jualan: ', '')
                                        .split(',')
                                        .map((item, i) => (
                                          <span
                                            key={i}
                                            className="px-2.5 py-1 bg-white border border-[#c2e9e8] text-[14px] text-[#5b5b5b] rounded-full"
                                          >
                                            {item.trim()}
                                          </span>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}

                      {/* FORM RWW */}
                      <div
                        className="mb-6 p-5 bg-white rounded-xl border-t border-l border-black"
                        style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                      >
                        <h2 className="text-lg font-bold mb-5">Tambah Data Responden</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
                            <input
                              type="text"
                              value={respondenName}
                              onChange={(e) => setRespondenName(e.target.value)}
                              placeholder="Contoh: Ahmad"
                              className="w-full px-3.5 py-2.5 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                              style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Jenis Kelamin</label>
                            <select
                              value={jenisKelamin}
                              onChange={(e) => setJenisKelamin(e.target.value)}
                              className="w-full px-3.5 py-2.5 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] bg-white"
                              style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            > 
                              <option value="">Pilih Jenis Kelamin</option>
                              <option value="Laki-laki">Laki-laki</option>
                              <option value="Perempuan">Perempuan</option>
                              <option value="Lainnya">Lainnya</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Usia</label>
                            <input
                              type="number"
                              value={usia}
                              onChange={(e) => setUsia(e.target.value)}
                              placeholder="Contoh: 25"
                              className="w-full px-3.5 py-2.5 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                              style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Aktivitas</label>
                            <select
                              value={aktivitas}
                              onChange={(e) => setAktivitas(e.target.value)}
                              placeholder="Contoh: Mahasiswa"
                              className="w-full px-3.5 py-2.5 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                              style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            >
                            <option value="">Pilih Aktivitas</option>
                            <option value="Mahasiswa">Mahasiswa</option>
                            <option value="Ibu rumah tangga">IRT</option>
                            <option value="Pekerja">Pekerja</option>
                            <option value="Lainnya">Lainnya</option>
                            <option value="Tidak mau memberi tau">Tidak mau memberi tau</option>
                            </select>
                          </div>
                        </div>

                        {/* REAL */}
                        <div className="mb-6 p-4 bg-[#fdf6f0] rounded-lg border border-[#f0d5c2]">
                          <h3 className="font-bold text-[#0a5f61] mb-4 flex items-center gap-2">
                            <Target size={16} /> REAL — Apakah masalah ini nyata?
                          </h3>
                          <div className="space-y-5">
                            {[1, 2, 3].map((q) => {
                              let questionText, value, setValue;
                              if (q === 1) {
                                questionText = 'Seberapa sering Anda mengalami masalah ini?';
                                value = q1;
                                setValue = setQ1;
                              } else if (q === 2) {
                                questionText = 'Seberapa penting solusi ini bagi Anda?';
                                value = q2;
                                setValue = setQ2;
                              } else {
                                questionText = 'Pernahkah Anda mencari solusi serupa sebelumnya?';
                                value = q3;
                                setValue = setQ3;
                              }
                              return (
                                <div key={q}>
                                  <label className="block text-sm font-medium mb-2">
                                    {q}. {questionText}
                                  </label>
                                  <RatingBox value={value} onChange={setValue} />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* WIN */}
                        <div className="mb-6 p-4 bg-[#f0f9f9] rounded-lg border border-[#c2e9e8]">
                          <h3 className="font-bold text-[#0a5f61] mb-4 flex items-center gap-2">
                            <Trophy size={16} /> WIN — Apakah solusi ini unggul?
                          </h3>
                          <div className="space-y-5">
                            {[4, 5, 6].map((q) => {
                              let questionText, value, setValue;
                              if (q === 4) {
                                questionText = 'Seberapa unik solusi ini dibanding yang ada?';
                                value = q4;
                                setValue = setQ4;
                              } else if (q === 5) {
                                questionText = 'Apakah solusi ini lebih mudah digunakan?';
                                value = q5;
                                setValue = setQ5;
                              } else {
                                questionText = 'Seberapa besar kepercayaan Anda terhadap kualitasnya?';
                                value = q6;
                                setValue = setQ6;
                              }
                              return (
                                <div key={q}>
                                  <label className="block text-sm font-medium mb-2">
                                    {q}. {questionText}
                                  </label>
                                  <RatingBox value={value} onChange={setValue} />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* WORTH */}
                        <div className="mb-6 p-4 bg-[#f8fbff] rounded-lg border border-[#d0e7f9]">
                          <h3 className="font-bold text-[#0a5f61] mb-4 flex items-center gap-2">
                            <DollarSign size={16} /> WORTH — Apakah layak secara bisnis?
                          </h3>
                          <div className="space-y-5">
                            {[7, 8, 9].map((q) => {
                              let questionText, value, setValue;
                              if (q === 7) {
                                questionText = 'Seberapa besar kemungkinan Anda membeli produk ini?';
                                value = q7;
                                setValue = setQ7;
                              } else if (q === 8) {
                                questionText = 'Apakah harganya sebanding dengan manfaatnya?';
                                value = q8;
                                setValue = setQ8;
                              } else {
                                questionText = 'Seberapa besar Anda merekomendasikan bisnis ini?';
                                value = q9;
                                setValue = setQ9;
                              }
                              return (
                                <div key={q}>
                                  <label className="block text-sm font-medium mb-2">
                                    {q}. {questionText}
                                  </label>
                                  <RatingBox value={value} onChange={setValue} />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <button
                          onClick={handleAddResponden}
                          className="w-full bg-[#f02d9c] text-white font-bold py-3 rounded-lg font-[Poppins] border-t border-l border-black hover:bg-[#fbe2a7] hover:text-[#333333] transition-colors"
                          style={{ boxShadow: '3px 3px 0 0 #8acfd1' }}
                        >
                          Tambah ke Tabel Responden
                        </button>
                      </div>

                      {/* Ringkasan & Tombol */}
                      {responses.length > 0 && (
                        <div className="mt-6">
                          <div
                            className="bg-white p-5 rounded-xl border-t border-l border-black"
                            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                          >
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                              <BarChart3 size={16} /> Ringkasan Validasi
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                              {[
                                { label: 'REAL', value: averages.real, color: '#f02d9c' },
                                { label: 'WIN', value: averages.win, color: '#f02d9c' },
                                { label: 'WORTH', value: averages.worth, color: '#f02d9c' },
                                { label: 'Total', value: averages.total, color: '#8acfd1' },
                              ].map((item, i) => (
                                <div
                                  key={i}
                                  className="text-center p-3 bg-white rounded-lg border-t border-l border-black"
                                  style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                                >
                                  <div className="text-xl font-bold" style={{ color: item.color }}>
                                    {item.value}
                                  </div>
                                  <div className="text-xs mt-1">{item.label}</div>
                                </div>
                              ))}
                            </div>
                            <div className="text-center mb-5">
                              {parseFloat(averages.total) >= 3.5 ? (
                                <span className="inline-flex items-center gap-1.5 bg-[#e8f5f4] text-[#0d8a85] px-4 py-2 rounded-full font-bold text-sm border border-[#8acfd1]">
                                  <CheckCircle size={16} />
                                  IDE VALID — LANJUT KE TAHAP BERIKUTNYA
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 bg-[#fff8e1] text-[#c98a00] px-4 py-2 rounded-full font-bold text-sm border border-[#fbe2a7]">
                                  <AlertTriangle size={16} />
                                  BUTUH PENYEMPURNAAN
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                              <Link
                                href={`/dashboard/${projectId}/plan/level_1_idea/${planLevels?.[0]?._id}`}
                                className="px-4 py-2 bg-white text-[#5b5b5b] font-medium rounded-lg border border-gray-300 flex items-center gap-1"
                              >
                                <ChevronLeft size={16} />
                                Prev
                              </Link>
                              <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 bg-white text-[#f02d9c] font-medium rounded-lg border border-[#f02d9c] flex items-center gap-1"
                              >
                                <Edit3 size={16} />
                                {isEditing ? 'Batal Edit' : 'Edit'}
                              </button>
                              <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-[#f02d9c] text-white font-medium rounded-lg border border-black flex items-center gap-1"
                              >
                                <CheckCircle size={16} />
                                Simpan
                              </button>
                              <Link
                                href={`/dashboard/${projectId}/plan/level_3_product_brand`}
                                className="px-4 py-2 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg border border-black flex items-center gap-1"
                              >
                                Next
                                <ChevronRight size={16} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Kolom Kanan */}
                    <div className="space-y-5">
                      {/* === PROGRESS BAR: DISAMAKAN DENGAN LEVEL 1 & 3 === */}
                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap size={16} className="text-[#f02d9c]" />
                          <span className="font-bold text-[#5b5b5b]">Progress Fase Plan</span>
                        </div>
                        <PhaseProgressBar
                          currentXp={currentXp}
                          totalXp={totalXp}
                          firstIncompleteLevel={firstIncompleteLevel}
                        />
                      </div>

                      {/* Pencapaian */}
                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Award size={16} className="text-[#f02d9c]" />
                          <span className="font-bold text-[#5b5b5b]">Pencapaian</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center gap-1.5 bg-[#f02d9c] text-white px-3 py-1.5 rounded-full text-xs font-bold">
                            <Lightbulb size={12} /> {planLevels[1]?.xp} XP
                          </div>
                          <div className="flex items-center gap-1.5 bg-[#8acfd1] text-[#0a5f61] px-3 py-1.5 rounded-full text-xs font-bold">
                            <Award size={12} /> {planLevels[1]?.badge}
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-[#5b5b5b]">
                          Kumpulkan XP & badge untuk naik pangkat dari Zero ke CEO!
                        </p>
                      </div>

                      {/* Petunjuk */}
                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen size={16} className="text-[#f02d9c]" />
                          <span className="font-bold text-[#5b5b5b]">Petunjuk</span>
                        </div>
                        <div className="space-y-2">
                          {[
                            'Gunakan teknik REAL-WIN-WORTH untuk memastikan ide bisnismu:',
                            '• REAL: Masalah yang diangkat benar-benar nyata',
                            '• WIN: Solusimu unggul dari alternatif yang ada',
                            '• WORTH: Pelanggan bersedia membayar karena nilai yang jelas',
                            'Wawancara minimal 5–10 responden berbeda (bukan teman dekat)',
                            'Fokus pada perilaku nyata, bukan opini (“Sudah pernah beli?” vs “Menarik?”)',
                            'Skor rata-rata ≥3.5 berarti ide layak dilanjutkan',
                            'Jika skor rendah, perbaiki dulu sebelum lanjut ke Level 3',
                          ].map((text, i) => (
                            <div key={i} className="text-sm text-[#5b5b5b]">
                              {text}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <h3 className="font-bold text-[#0a5f61] mb-3 flex items-center gap-2">
                          <BookOpen size={16} /> Resources Validasi Ide
                        </h3>
                        <ul className="text-sm space-y-1">
                          <li>
                            <a
                              href="https://www.youtube.com/watch?v=VlX9Kq2e5qU"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline"
                            >
                              Cara Validasi Ide dalam 15 Menit
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.strategyzer.com/blog/validate-your-ideas-before-you-build"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline"
                            >
                              Validate Before You Build (Strategyzer)
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://perempuaninovasi.id/workshop"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline"
                            >
                              Panduan Validasi Ide (Perempuan Inovasi)
                            </a>
                          </li>
                        </ul>
                      </div>

                      {/* Data Responden */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                        <h3 className="font-bold text-[#0a5f61] mb-3 flex items-center gap-2">
                          <Users size={16} /> Data Responden
                        </h3>
                        {responses.length === 0 ? (
                          <p className="text-sm text-[#7a7a7a] italic">Belum ada data responden.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 text-sm">
                              <thead className="bg-[#f02d9c] text-white">
                                <tr>
                                  <th className="py-2 px-3 border border-gray-300 text-left">Nama</th>
                                  <th className="py-2 px-3 border border-gray-300 text-left">JK</th>
                                  <th className="py-2 px-3 border border-gray-300 text-left">Usia</th>
                                  <th className="py-2 px-3 border border-gray-300 text-left">Aktivitas</th>
                                  <th className="py-2 px-3 border border-gray-300 text-center">Skor</th>
                                </tr>
                              </thead>
                              <tbody>
                                {responses.map((r) => (
                                  <tr key={r.id} className="odd:bg-white even:bg-[#f9f9f9]">
                                    <td className="py-2 px-3 border border-gray-300">{r.name}</td>
                                    <td className="py-2 px-3 border border-gray-300">{r.gender}</td>
                                    <td className="py-2 px-3 border border-gray-300">{r.age || '—'}</td>
                                    <td className="py-2 px-3 border border-gray-300">{r.activity}</td>
                                    <td className="py-2 px-3 border border-gray-300 text-center font-bold text-[#f02d9c]">
                                      {r.total}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {genderSummary.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                          <h3 className="font-bold text-[#0a5f61] mb-3">Skor ≥3.5 per Jenis Kelamin</h3>
                          <table className="min-w-full border border-gray-300 text-sm">
                            <thead className="bg-[#8acfd1] text-[#0a5f61]">
                              <tr>
                                <th className="py-2 px-3 border border-gray-300 text-left">Jenis Kelamin</th>
                                <th className="py-2 px-3 border border-gray-300 text-center">Rata-rata Skor</th>
                              </tr>
                            </thead>
                            <tbody>
                              {genderSummary.map((item, i) => (
                                <tr key={i} className="odd:bg-white even:bg-[#f9f9f9]">
                                  <td className="py-2 px-3 border border-gray-300">{item.gender}</td>
                                  <td className="py-2 px-3 border border-gray-300 text-center font-bold text-[#f02d9c]">
                                    {item.avg.toFixed(1)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {ageGroupSummary.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                          <h3 className="font-bold text-[#0a5f61] mb-3">Skor ≥3.5 per Kelompok Usia</h3>
                          <table className="min-w-full border border-gray-300 text-sm">
                            <thead className="bg-[#8acfd1] text-[#0a5f61]">
                              <tr>
                                <th className="py-2 px-3 border border-gray-300 text-left">Kelompok Usia</th>
                                <th className="py-2 px-3 border border-gray-300 text-center">Rata-rata Skor</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ageGroupSummary.map((item, i) => (
                                <tr key={i} className="odd:bg-white even:bg-[#f9f9f9]">
                                  <td className="py-2 px-3 border border-gray-300">{item.range}</td>
                                  <td className="py-2 px-3 border border-gray-300 text-center font-bold text-[#f02d9c]">
                                    {item.avg.toFixed(1)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
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
        xpGained={notificationData.xpGained}
        badgeName={notificationData.badgeName}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}