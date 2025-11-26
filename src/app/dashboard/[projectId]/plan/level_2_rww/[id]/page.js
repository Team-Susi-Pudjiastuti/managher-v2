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
  Loader2
} from 'lucide-react';
import useProjectStore from '@/store/useProjectStore';
import useRWWTestingStore from '@/store/useRWWTesting';
import useBusinessIdeaStore from '@/store/useBusinessIdeaStore';
import useAuthStore from '@/store/useAuthStore';
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

// === MAIN COMPONENT ===
const scaleLabels = ['Tidak Pernah', 'Pernah', 'Kadang', 'Sering', 'Sangat Sering'];
const range5 = [1, 2, 3, 4, 5];

export default function RWW() {
  const { id, projectId } = useParams();
  const router = useRouter();
  const { getRWWTesting, addRWWTesting } = useRWWTestingStore();
  const { getBusinessIdea, businessIdea} = useBusinessIdeaStore();
  const { planLevels, updateLevelStatus } = useProjectStore();
  const { isAuthenticated, loadSession, isHydrated } = useAuthStore();
  const nextPrevLevel = (num) => {
    const level = planLevels?.find(
      (l) => l?.project?._id === projectId && l?.order === num
    );
    return level?.entities?.[0]?.entity_ref || null;
  };

  
  // --- Tambahkan state untuk confetti ---
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Top-level states
  const [isMounted, setIsMounted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    xpGained: 0,
    badgeName: '',
  });
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [responses, setResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState({
    name: '', age: '', gender: '', activity: '',
    real: [], win: [], worth: [],
    totalScore: ''
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
      setIsMounted(true);
    }, []);

  useEffect(() => {
      loadSession();
    }, []);
  
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  useEffect(() => {
  // Jika ada data di form atau di tabel tapi belum disimpan → ada perubahan
  const hasFormInput = currentResponse.name || currentResponse.age || 
                       currentResponse.real.some(v => v !== null);
  const hasRespondents = currentResponse.name == !null;
  setHasUnsavedChanges(hasFormInput || hasRespondents);
}, [currentResponse, responses]);

  useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = 'Anda memiliki data yang belum disimpan. Yakin ingin keluar?';
      return e.returnValue;
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', handleBeforeUnload);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  };
}, [hasUnsavedChanges]);

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
  
  const businessIdeaId = planLevels?.[0]?.entities?.[0]?.entity_ref;
  useEffect(() => {

    if (businessIdeaId) {
      getBusinessIdea(businessIdeaId);
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
              realRaw: r.real,
              winRaw: r.win,
              worthRaw: r.worth,
              total,
            };
          });
          setResponses(parsed);
        }
      });
    }
  }, [projectId, getRWWTesting]);

  if (!businessIdea._id || !businessIdea.productsServices) {
    return(
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-[#f02d9c]" />
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-[#f02d9c]" />
      </div>
    );
  }


  // --- PROGRESS BAR LOGIC ---
  const currentXp = planLevels.filter(l => l.completed).reduce((acc, l) => acc + (l.xp || 0), 0);
  const totalXp = planLevels.reduce((acc, l) => acc + (l.xp || 0), 0);
  const currentLevel = planLevels.find(l => l.order === 3);
  const firstIncompleteLevel = planLevels?.find(l => !l.completed) || { id: 3 };
  
  <Confetti />

  const handleAddResponden = () => {
    const { name, age, gender, activity, real, win, worth } = currentResponse;
    const allAnswered = [name, gender, activity].every(val => val !== '') &&
                        real.length === 3 && win.length === 3 && worth.length === 3 &&
                        real.every(v => v !== null) &&
                        win.every(v => v !== null) &&
                        worth.every(v => v !== null);

    if (!allAnswered) {
      alert('Mohon lengkapi semua form.');
      return;
    }

    const realAvg = parseFloat((real.reduce((a, b) => a + b, 0) / 3).toFixed(1));
    const winAvg = parseFloat((win.reduce((a, b) => a + b, 0) / 3).toFixed(1));
    const worthAvg = parseFloat((worth.reduce((a, b) => a + b, 0) / 3).toFixed(1));
    const total = ((realAvg + winAvg + worthAvg) / 3).toFixed(1);

    const newResponder = {
      id: Date.now().toString(),
      name: name || '—',
      gender: gender || 'Tidak mau memberi tau',
      age: age ? parseInt(age, 10) : null,
      activity: activity || 'Tidak mau memberi tau',
      realRaw: [...real],
      winRaw: [...win],
      worthRaw: [...worth],
      real: realAvg,
      win: winAvg,
      worth: worthAvg,
      total,
    };

    setResponses(prev => [...prev, newResponder]);

    // Reset currentResponse
    setCurrentResponse({
      name: '', age: '', gender: '', activity: '',
      real: [], win: [], worth: [],
      totalScore: ''
    });
  };

  const deleteResponse = (idToDelete) => {
    setResponses(prev => prev.filter(r => r.id !== idToDelete));
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
      total: (totalOverall / responses.length).toFixed(1)
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
  if (responses.length === 0) {
    alert('Belum ada responden yang ditambahkan.');
    return;
  }

  // Siapkan data mentah untuk dikirim ke database
  const dataToSave = responses.map(r => ({
    name: r.name,
    age: r.age,
    gender: r.gender,
    activity: r.activity,
    real: r.realRaw,   // <-- array mentah
    win: r.winRaw,
    worth: r.worthRaw,
    totalScore: r.total
  }));

  const averages = {
    real: parseFloat((responses.reduce((sum, r) => sum + r.real, 0) / responses.length).toFixed(1)),
    win: parseFloat((responses.reduce((sum, r) => sum + r.win, 0) / responses.length).toFixed(1)),
    worth: parseFloat((responses.reduce((sum, r) => sum + r.worth, 0) / responses.length).toFixed(1)),
    total: parseFloat((responses.reduce((sum, r) => sum + parseFloat(r.total), 0) / responses.length).toFixed(1)),
  };

  const isValid = parseFloat(averages.total) >= 3.5;

    await addRWWTesting(
      projectId, dataToSave);
  

  // Lanjutkan seperti biasa...
  await updateLevelStatus(planLevels[1]._id, { completed: isValid });

  // Notifikasi, confetti, dll.
  if (isValid && currentLevel?.completed) {
    setShowNotification(true);
    setNotificationData({
      pesan: "Validasi berhasil disimpan!",
      keterangan: "Lanjut tetapkan identitas bisnismu supaya dikenal para customer!",
  });
  } else {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setShowNotification(true);
    setNotificationData({
      keterangan: "Lanjut tetapkan identitas bisnismu supaya dikenal para customer!",
      xpGained: planLevels[1].xp,
      badgeName: planLevels[1].badge || 'Validator Pro',
  });
  }
  setHasUnsavedChanges(false);
};

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
    { label: 'Level 2: Validasi RWW' },
  ];

  const genderSummary = getGenderSummary();
  const ageGroupSummary = getAgeGroupSummary();
  const ps = businessIdea.productsServices[0] || {};

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
                    Kumpulkan masukan dari calon customer menggunakan skala frekuensi: <strong>1–5</strong>.
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
                                {businessIdea.problem && (
                                  <div className="mt-3 pt-2 border-t border-[#e0f0f0]">
                                    <p className="font-medium text-[#0a5f61] text-sm">Apakah ini masalahmu?</p>
                                    <p className="text-[15px] text-[#5b5b5b] mt-1">
                                      {businessIdea.problem}
                                    </p>
                                  </div>
                                )}
                                
                                <ul className="text-[15px] text-[#5b5b5b] space-y-1.5">
                                  {businessIdea.solution && (
                                    <div className="mt-3 pt-2 border-t border-[#e0f0f0]">
                                    <p className="font-medium text-[#0a5f61] text-sm">Bagaimana dengan solusi ini?</p>
                                    {ps.title && <p className="font-bold mt-2">{ps.title}</p>}
                                    <p className="text-[15px] text-[#5b5b5b] mt-1">
                                      {businessIdea.solution}
                                    </p>
                                  </div>
                                )}
                                  {ps.jenis && <li><span className="font-medium">Jenis:</span> {ps.jenis}</li>}
                                  {ps.deskripsi && <li><span className="font-medium">Deskripsi:</span> {ps.deskripsi}</li>}
                                  {ps.fitur && <li><span className="font-medium">Fitur utama:</span> {ps.fitur}</li>}
                                  {ps.manfaat && <li><span className="font-medium">Manfaat:</span> {ps.manfaat}</li>}
                                  {ps.harga && <li><span className="font-medium">Harga:</span> {ps.harga}</li>}
                                </ul>
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
                              value={currentResponse.name}
                              onChange={(e) => setCurrentResponse(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Contoh: Ahmad"
                              className="w-full px-3.5 py-2.5 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                              style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Jenis Kelamin</label>
                            <select
                              value={currentResponse.gender}
                              onChange={(e) => setCurrentResponse(prev => ({ ...prev, gender: e.target.value }))}
                              className="w-full px-3.5 py-2.5 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] bg-white"
                              style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            > 
                              <option value="">Pilih Jenis Kelamin</option>
                              <option value="Laki-laki">Laki-laki</option>
                              <option value="Perempuan">Perempuan</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Usia</label>
                            <input
                              type="number"
                              value={currentResponse.age}
                              onChange={(e) => setCurrentResponse(prev => ({ ...prev, age: e.target.value }))}
                              placeholder="Contoh: 25"
                              className="w-full px-3.5 py-2.5 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                              style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Aktivitas</label>
                            <select
                              value={currentResponse.activity}
                              onChange={(e) => setCurrentResponse(prev => ({ ...prev, activity: e.target.value }))}
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
                            {[0, 1, 2].map((index) => {
                              const questions = [
                                'Seberapa sering Anda mengalami masalah ini?',
                                'Seberapa penting solusi ini bagi Anda?',
                                'Pernahkah Anda mencari solusi serupa sebelumnya?',
                              ];
                              const value = currentResponse.real[index] || null;
                              const handleChange = (num) => {
                                const newReal = [...currentResponse.real];
                                newReal[index] = num;
                                setCurrentResponse(prev => ({ ...prev, real: newReal }));
                              };
                              return (
                                <div key={index}>
                                  <label className="block text-sm font-medium mb-2">
                                    {index + 1}. {questions[index]}
                                  </label>
                                  <RatingBox value={value} onChange={handleChange} />
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
                            {[0, 1, 2].map((index) => {
                              const questions = [
                                'Seberapa unik solusi ini dibanding yang ada?',
                                'Apakah solusi ini lebih mudah digunakan?',
                                'Seberapa besar kepercayaan Anda terhadap kualitasnya?',
                              ];
                              const value = currentResponse.win[index] || null;
                              const handleChange = (num) => {
                                const newWin = [...currentResponse.win];
                                newWin[index] = num;
                                setCurrentResponse(prev => ({ ...prev, win: newWin }));
                              };
                              return (
                                <div key={index}>
                                  <label className="block text-sm font-medium mb-2">
                                    {index + 4}. {questions[index]}
                                  </label>
                                  <RatingBox value={value} onChange={handleChange} />
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
                            {[0, 1, 2].map((index) => {
                              const questions = [
                                'Seberapa besar kemungkinan Anda membeli produk ini?',
                                'Apakah harganya sebanding dengan manfaatnya?',
                                'Seberapa besar Anda merekomendasikan bisnis ini?',
                              ];
                              const value = currentResponse.worth[index] || null;
                              const handleChange = (num) => {
                                const newWorth = [...currentResponse.worth];
                                newWorth[index] = num;
                                setCurrentResponse(prev => ({ ...prev, worth: newWorth }));
                              };
                              return (
                                <div key={index}>
                                  <label className="block text-sm font-medium mb-2">
                                    {index + 7}. {questions[index]}
                                  </label>
                                  <RatingBox value={value} onChange={handleChange} />
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
                              {parseFloat(averages.total) >= 3.5 && responses.length >= 5 ? (
                                <>
                                <span className="inline-flex items-center gap-1.5 bg-[#e8f5f4] text-[#0d8a85] px-4 py-2 rounded-full font-bold text-sm border border-[#8acfd1]">
                                  <CheckCircle size={16} />
                                  IDE VALID — LANJUT KE TAHAP BERIKUTNYA
                                </span>
                                <div className="flex flex-wrap gap-2 justify-center mt-5">
                                  {nextPrevLevel(1) != null ? (

                                  <button
                                   onClick={async () => {
                                      if (hasUnsavedChanges) {
                                        const confirmed = window.confirm('Data belum disimpan. Tetap kembali?');
                                        if (!confirmed) return;
                                      }
                                      router.push(`/dashboard/${projectId}/plan/level_1_idea/${nextPrevLevel(1)}`);
                                    }}
                                    className="px-4 py-2 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 flex items-center gap-1"
                                  >
                                    <ChevronLeft size={16} />
                                    Prev
                                  </button>
                                  ) : (
                                  <button
                                   onClick={async () => {
                                      if (hasUnsavedChanges) {
                                        const confirmed = window.confirm('Data belum disimpan. Tetap kembali?');
                                        if (!confirmed) return;
                                      }
                                      router.push(`/dashboard/${projectId}/plan/level_1_idea/${nextPrevLevel(1)}`);
                                    }}
                                    className="px-4 py-2 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 flex items-center gap-1"
                                  >
                                    <ChevronLeft size={16} />
                                      <Loader2 className="w-6 h-6 animate-spin text-[#f02d9c]" />
                                  </button>
                                    
                                  )}
                                  {/* <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-4 py-2 bg-white text-[#f02d9c] font-medium rounded-lg border border-[#f02d9c] flex items-center gap-1"
                                  >
                                    <Edit3 size={16} />
                                    {isEditing ? 'Batal Edit' : 'Edit'}
                                  </button> */}
                                  <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-[#f02d9c] text-white font-medium rounded-lg flex items-center gap-1"
                                  >
                                    <CheckCircle size={16} />
                                    Simpan
                                  </button>
                                  <button
                                    onClick={async () => {
                                        if (hasUnsavedChanges) {
                                          const confirmed = window.confirm('Data belum disimpan. Simpan dulu data sebelum lanjut');
                                          if (!confirmed) return;
                                        }
                                        router.push(`/dashboard/${projectId}/plan/level_3_product_brand/${nextPrevLevel(3)}`);
                                      }}
                                    className="px-4 py-2 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg flex items-center gap-1"
                                  >
                                    Next
                                    <ChevronRight size={16} />
                                  </button>
                                </div>
                                </>
                              ) : (
                                <>
                                { responses.length < 5 && (
                                  <span className="inline-flex items-center gap-1.5 bg-[#fff8e1] text-[#c98a00] px-4 py-2 rounded-full font-bold text-sm border border-[#fbe2a7] mx-3">
                                  <AlertTriangle size={16} />
                                  CARI RESPONDEN LAGI
                                </span>
                                )}
                                <span className="inline-flex items-center gap-1.5 bg-[#fff8e1] text-[#c98a00] px-4 py-2 rounded-full font-bold text-sm border border-[#fbe2a7]">
                                  <AlertTriangle size={16} />
                                  BUTUH PENYEMPURNAAN
                                </span>
                                <div className="flex flex-wrap gap-2 justify-center mt-5 ">
                                  <button
                                    onClick={async () => {
                                      if (hasUnsavedChanges) {
                                        const confirmed = window.confirm('Data belum disimpan. Tetap kembali?');
                                        if (!confirmed) return;
                                      }
                                      router.push(`/dashboard/${projectId}/plan/level_1_idea/${nextPrevLevel(1)}`);
                                    }}
                                    className="px-4 py-2 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 flex items-center gap-1"
                                  >
                                    <ChevronLeft size={16} />
                                    Prev
                                  </button>
                                  <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-[#f02d9c] text-white font-medium rounded-lg flex items-center gap-1"
                                  >
                                    <CheckCircle size={16} />
                                    Simpan
                                  </button>
                                  
                                </div>
                                </>
                              )}
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
                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <h3 className="font-bold text-[#0a5f61] mb-3 flex items-center gap-2">
                          <BookOpen size={16} /> Resources Validasi Ide
                        </h3>
                        <ul className="text-sm space-y-1">
                                                    {/* Tahap 2: Validasi Pasar */}
                          <li>
                            <a
                              href="https://www.smetoolkit.org/indonesia/toolkit/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                            >
                              SME Toolkit Indonesia – Validasi Pasar untuk UMKM
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.youtube.com/watch?v=5QsFFO2DqR4"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                            >
                              YouTube: Cara Melakukan Survei dan Validasi Ide Produk
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.startupbootcamp.org/blog/market-validation/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                            >
                              Startupbootcamp: Panduan Validasi Pasar untuk Startup & UMKM
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
                                  <th className="py-2 px-3 border border-gray-300 text-center"></th>
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
                                    <td className="py-2 px-3 border border-gray-300">
                                    <button
                                      onClick={() => deleteResponse(r.id)} 
                                      className="px-2 py-1 bg-red-100 text-red-600 rounded-md text-xs"
                                    >
                                      Hapus
                                    </button>
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

      {currentLevel?.completed ? (
        <NotificationModalPlan
          isOpen={showNotification}
          type="success"
          pesan={notificationData.pesan}
          keterangan={notificationData.keterangan}
          xpGained={notificationData.xpGained}
          badgeName={notificationData.badgeName}
          onClose={() => {
            setShowNotification(false)
            router.push(`/dashboard/${projectId}/plan/level_3_product_brand/${nextPrevLevel(3)}`);
          }}
        />
      ) : (
        <NotificationModalPlan
          isOpen={showNotification}
          type="success"
          keterangan={notificationData.keterangan}
          xpGained={notificationData.xpGained}
          badgeName={notificationData.badgeName}
          onClose={() => {
            setShowNotification(false)
            router.push(`/dashboard/${projectId}/plan/level_3_product_brand/${nextPrevLevel(3)}`);
          }}
        />
      )}
    </div>
  );
}