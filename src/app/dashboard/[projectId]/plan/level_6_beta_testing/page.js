'use client';

import { useState, useEffect, useRef } from 'react'; // Tambahkan useRef
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  Users,
  Goal,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trash2,
  BarChart3,
  CheckCircle,
  BookOpen,
  Edit3,
  AlertTriangle,
  Award,
  Lightbulb,
  ChevronUp,
  ChevronDown,
  Zap,
} from 'lucide-react';

import useProjectStore from '@/store/useProjectStore';
import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';
import NotificationModalPlan from '@/components/NotificationModalPlan';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// === CONFETTI ANIMATION (DIIMPOR DARI LEVEL 2) ===
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
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]" />;
};

// === PROGRESS BAR (DISAMAKAN DENGAN LEVEL 2, TANPA TULISAN "LANJUT KE LEVEL") ===
const PhaseProgressBar = ({ currentXp, totalXp }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const calculatedProgress = totalXp > 0
      ? Math.min(100, Math.floor((currentXp / totalXp) * 100))
      : 0;
    setProgress(calculatedProgress);
  }, [currentXp, totalXp]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 w-full">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-bold text-[#5b5b5b]">
          XP Fase Plan: {currentXp} / {totalXp}
        </span>
        <span className="text-xs font-bold text-[#f02d9c]">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-[#f0f0f0] rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full bg-[#f02d9c] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* ❌ DIHAPUS: Tidak ada teks "Lanjut ke Level..." */}
    </div>
  );
};

const satisfactionLabels = ['Sangat Tidak Puas', 'Tidak Puas', 'Netral', 'Puas', 'Sangat Puas'];
const range5 = [1, 2, 3, 4, 5];

export default function Level6Page() {
  const { projectId } = useParams();
  const router = useRouter();
  const projects = useProjectStore((state) => state.projects);
  const updateProject = useProjectStore((state) => state.updateProject);

  const [project, setProject] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    xpGained: 0,
    badgeName: '',
  });
  const [showConfetti, setShowConfetti] = useState(false); // ✨ Confetti state

  const [currentResponse, setCurrentResponse] = useState({
    name: '',
    gender: '',
    age: '',
    activity: '',
    satisfaction_rate: null,
    satisfaction_reason: '',
    suggestion: '',
    recommendation: '',
    comment: '',
  });

  const [allResponses, setAllResponses] = useState([]);

  // Deteksi mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load data
  useEffect(() => {
    if (!projectId) return;

    const found = projects.find((p) => p.id === projectId);
    setProject(found);

    const level2Data = found?.levels?.[1]?.data?.rww;
    if (level2Data?.responses) {
      const qualifiedRespondents = level2Data.responses
        .filter(r => parseFloat(r.total) >= 3.5)
        .map(r => ({
          id: Date.now() + Math.random(),
          name: r.name,
          gender: r.gender,
          age: r.age?.toString() || '',
          activity: r.activity,
          satisfaction_rate: null,
          satisfaction_reason: '',
          suggestion: '',
          recommendation: '',
          comment: '',
        }));
      setAllResponses(qualifiedRespondents);
    }

    const saved = localStorage.getItem(`beta_data_${projectId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const responses = Array.isArray(parsed.responses) ? parsed.responses : parsed;
        setAllResponses(responses || []);
      } catch (e) {
        console.error('Gagal load data beta dari localStorage', e);
        setAllResponses([]);
      }
    }
  }, [projectId, projects]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentResponse((prev) => ({ ...prev, [name]: value }));
  };

  const addNewResponse = () => {
    const { name, age } = currentResponse;
    if (!name || !age) {
      alert('Nama dan usia harus diisi.');
      return;
    }

    const newResp = { ...currentResponse, id: Date.now() };
    const updated = [...allResponses, newResp];
    setAllResponses(updated);
    localStorage.setItem(
      `beta_data_${projectId}`,
      JSON.stringify({ responses: updated, updatedAt: new Date().toISOString() })
    );
    setCurrentResponse({ name: '', gender: '', age: '', activity: '', satisfaction_rate: null, satisfaction_reason: '', suggestion: '', recommendation: '', comment: '' });
    alert('Responden berhasil ditambahkan!');
  };

  const deleteResponse = (id) => {
    const updated = allResponses.filter((r) => r.id !== id);
    setAllResponses(updated);
    localStorage.setItem(
      `beta_data_${projectId}`,
      JSON.stringify({ responses: updated, updatedAt: new Date().toISOString() })
    );
  };

  const satisfactionValues = allResponses
    .map((r) => (typeof r.satisfaction_rate === 'number' ? r.satisfaction_rate : null))
    .filter((v) => v !== null);
  const avgSatisfaction = satisfactionValues.length
    ? (satisfactionValues.reduce((sum, v) => sum + v, 0) / satisfactionValues.length).toFixed(1)
    : 0;
  const recommendCount = allResponses.filter((r) => r.recommendation === 'Ya').length;
  const recommendRate = allResponses.length
    ? Math.round((recommendCount / allResponses.length) * 100)
    : 0;
  const canLaunch = allResponses.length >= 5 && parseFloat(avgSatisfaction) >= 4.0 && recommendRate >= 70;

  const handleSave = () => {
    const dataToSave = {
      responses: allResponses,
      avgSatisfaction,
      recommendRate,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`beta_data_${projectId}`, JSON.stringify(dataToSave));
    const updatedLevels = [...(project?.levels || [])];
    if (!updatedLevels[5]) updatedLevels[5] = { id: 6, completed: false, data: {} };
    updatedLevels[5] = {
      ...updatedLevels[5],
      completed: canLaunch,
      data: allResponses,
    };
    updateProject(projectId, { levels: updatedLevels });

    setNotificationData({ xpGained: 10, badgeName: 'Beta Master' });
    setShowNotification(true);

    // ✨ Tampilkan confetti jika MVP siap launch
    if (canLaunch) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  // Chart data utilities (sama seperti asli — dipertahankan)
  const satisfactionDist = [0, 0, 0, 0, 0];
  allResponses.forEach(r => {
    if (typeof r.satisfaction_rate === 'number' && r.satisfaction_rate >= 1 && r.satisfaction_rate <= 5) {
      satisfactionDist[Math.floor(r.satisfaction_rate) - 1]++;
    }
  });
  const satisfactionChartData = satisfactionDist.map((count, i) => ({ score: i + 1, label: satisfactionLabels[i], count }));
  const ageBuckets = { '<18': 0, '18-24': 0, '25-34': 0, '35-44': 0, '45+': 0 };
  allResponses.forEach((r) => {
    const a = Number(r.age);
    if (!a) return;
    if (a < 18) ageBuckets['<18'] += 1;
    else if (a <= 24) ageBuckets['18-24'] += 1;
    else if (a <= 34) ageBuckets['25-34'] += 1;
    else if (a <= 44) ageBuckets['35-44'] += 1;
    else ageBuckets['45+'] += 1;
  });
  const ageChartData = Object.entries(ageBuckets).map(([k, v]) => ({ name: k, value: v }));
  const activityCounts = {};
  allResponses.forEach((r) => {
    const act = r.activity?.trim() || 'Lainnya';
    activityCounts[act] = (activityCounts[act] || 0) + 1;
  });
  const activityChartData = Object.entries(activityCounts).map(([name, value]) => ({ name, value }));
  const recChartData = ['Ya', 'Tidak', 'Mungkin'].map((opt) => ({
    name: opt,
    value: allResponses.filter((r) => r.recommendation === opt).length,
  }));
  const genderChartData = [
    { name: 'Laki-laki', value: allResponses.filter((r) => r.gender === 'Laki-laki').length, fill: '#4A90E2' },
    { name: 'Perempuan', value: allResponses.filter((r) => r.gender === 'Perempuan').length, fill: '#f02d9c' },
    { name: 'Lainnya', value: allResponses.filter((r) => r.gender === 'Lainnya').length, fill: '#C4C4C4' },
  ];

  const RatingBox = ({ value, onChange, labels = satisfactionLabels }) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {range5.map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onChange(num)}
          className={`w-14 h-14 flex flex-col items-center justify-center rounded-lg text-xs font-[Poppins] font-medium transition-all border-t border-l border-black`}
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

  // --- PROGRESS BAR LOGIC ---
  const totalLevels = 7;
  const completedLevels = project?.levels?.filter((l) => l.completed).length || 0;
  const currentXp = completedLevels * 10;
  const totalXp = totalLevels * 10;

  return (
    <div className="min-h-screen bg-white font-[Poppins]">
      {/* ✨ Tampilkan Confetti jika MVP siap launch */}
      {showConfetti && <Confetti />}

      <div className="px-3 sm:px-4 md:px-6 py-2 border-b border-gray-200 bg-white">
        <Breadcrumb items={[
          { href: `/dashboard/${projectId}`, label: 'Dashboard' },
          { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
          { label: 'Level 6: Beta Testing' },
        ]} />
      </div>

      {isMobile && !mobileSidebarOpen && (
        <header className="p-3 flex items-center border-b border-gray-200 bg-white top-10 z-30">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100" aria-label="Open menu">
            <Menu size={20} className="text-[#5b5b5b]" />
          </button>
          <h1 className="ml-2 font-bold text-[#5b5b5b] text-base">Level 6: Beta Testing</h1>
        </header>
      )}

      <div className="flex mt-6">
        <PlanSidebar
          projectId={projectId}
          currentLevelId={6}
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
                    Level 6: Beta Testing
                  </h1>
                  <p className="text-[#5b5b5b] text-center mb-6 max-w-2xl mx-auto">
                    Kumpulkan masukan dari pengguna nyata untuk menguji MVP-mu sebelum peluncuran resmi.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Kolom Kiri: Form & Ringkasan */}
                    <div>
                      {/* ... (form dan ringkasan tetap sama, tidak diubah) */}
                      <div
                        className="mb-6 p-5 bg-white rounded-xl border-t border-l border-black"
                        style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                      >
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <Users size={16} /> Tambah Data Responden
                        </h2>
                        {/* ... (form input tetap seperti asli) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
                            <input
                              type="text"
                              name="name"
                              value={currentResponse.name}
                              onChange={handleInputChange}
                              placeholder="Contoh: Ahmad"
                              className="w-full px-3.5 py-2.5 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                              style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Jenis Kelamin</label>
                            <select
                              name="gender"
                              value={currentResponse.gender}
                              onChange={handleInputChange}
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
                              name="age"
                              value={currentResponse.age}
                              onChange={handleInputChange}
                              min="13"
                              max="100"
                              placeholder="Contoh: 25"
                              className="w-full px-3.5 py-2.5 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                              style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Aktivitas</label>
                            <input
                              type="text"
                              name="activity"
                              value={currentResponse.activity}
                              onChange={handleInputChange}
                              placeholder="Contoh: Mahasiswa"
                              className="w-full px-3.5 py-2.5 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                              style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            />
                          </div>
                        </div>

                        {/* Kepuasan */}
                        <div className="mb-6 p-4 bg-[#fdf6f0] rounded-lg border border-[#f0d5c2]">
                          <h3 className="font-bold text-[#0a5f61] mb-4">
                            Tingkat Kepuasan Produk (1–5)
                          </h3>
                          <p className="text-sm text-[#5b5b5b] mb-2">
                            Pilih angka yang paling menggambarkan kepuasan responden terhadap produk.
                          </p>
                          <RatingBox
                            value={currentResponse.satisfaction_rate}
                            onChange={(val) => setCurrentResponse((prev) => ({ ...prev, satisfaction_rate: val }))}
                          />
                          <textarea
                            value={currentResponse.satisfaction_reason}
                            onChange={(e) => setCurrentResponse((prev) => ({ ...prev, satisfaction_reason: e.target.value }))}
                            placeholder="Alasan kepuasan..."
                            className="w-full mt-3 px-3 py-2 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                          />
                        </div>

                        {/* Saran & Rekomendasi */}
                        <div className="mb-6 p-4 bg-[#f8fbff] rounded-lg border border-[#d0e7f9]">
                          <h3 className="font-bold text-[#0a5f61] mb-4">Saran & Rekomendasi</h3>
                          <textarea
                            value={currentResponse.suggestion}
                            onChange={(e) => setCurrentResponse((prev) => ({ ...prev, suggestion: e.target.value }))}
                            placeholder="Saran perbaikan..."
                            rows={2}
                            className="w-full px-3 py-2 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white mb-3"
                            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                          />
                          <div className="mb-3">
                            <label className="block text-sm font-medium mb-2">Rekomendasi?</label>
                            <div className="flex gap-4">
                              {['Ya', 'Tidak', 'Mungkin'].map((opt) => (
                                <label key={opt} className="flex items-center gap-1 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="recommendation"
                                    value={opt}
                                    checked={currentResponse.recommendation === opt}
                                    onChange={handleInputChange}
                                    className="text-[#f02d9c]"
                                  />
                                  <span className="text-sm">{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <textarea
                            value={currentResponse.comment}
                            onChange={(e) => setCurrentResponse((prev) => ({ ...prev, comment: e.target.value }))}
                            placeholder="Komentar tambahan..."
                            rows={2}
                            className="w-full px-3 py-2 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                          />
                        </div>

                        <button
                          onClick={addNewResponse}
                          className="w-full bg-[#f02d9c] text-white font-bold py-3 rounded-lg font-[Poppins] border-t border-l border-black hover:bg-[#fbe2a7] hover:text-[#333333] transition-colors"
                          style={{ boxShadow: '3px 3px 0 0 #8acfd1' }}
                        >
                          Tambah ke Tabel Responden
                        </button>
                      </div>

                      {allResponses.length > 0 && (
                        <div className="mt-6">
                          <div
                            className="bg-white p-5 rounded-xl border-t border-l border-black"
                            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                          >
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                              <BarChart3 size={16} /> Ringkasan Beta Testing
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                              {[
                                { label: 'Kepuasan', value: avgSatisfaction, color: '#f02d9c' },
                                { label: 'Rekomendasi', value: `${recommendRate}%`, color: '#8acfd1' },
                                { label: 'Responden', value: allResponses.length, color: '#f02d9c' },
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
                              {canLaunch ? (
                                <span className="inline-flex items-center gap-1.5 bg-[#e8f5f4] text-[#0d8a85] px-4 py-2 rounded-full font-bold text-sm border border-[#8acfd1]">
                                  <CheckCircle size={16} />
                                  MVP SIAP DILUNCURKAN!
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
                                href={`/dashboard/${projectId}/plan/level_5_MVP`}
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
                                href={`/dashboard/${projectId}/plan/level_7_launch`}
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
                      {/* === PROGRESS BAR BARU === */}
                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap size={16} className="text-[#f02d9c]" />
                          <span className="font-bold text-[#5b5b5b]">Progress Fase Plan</span>
                        </div>
                        <PhaseProgressBar
                          currentXp={currentXp}
                          totalXp={totalXp}
                          // firstIncompleteLevel dihapus → TIDAK ADA TEXT "LANJUT KE LEVEL"
                        />
                      </div>

                      {/* Pencapaian, Petunjuk, Resources → tetap seperti asli */}
                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <h3 className="font-bold text-[#5b5b5b] mb-2 flex items-center gap-1">
                          <Award size={16} className="text-[#f02d9c]" />
                          Pencapaian
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1.5 bg-[#f02d9c] text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <Lightbulb size={12} /> +10 XP
                          </span>
                          <span className="px-3 py-1.5 bg-[#8acfd1] text-[#0a5f61] text-xs font-bold rounded-full flex items-center gap-1">
                            <Award size={12} /> Beta Master
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-[#5b5b5b]">
                          Kumpulkan XP & badge untuk naik pangkat dari Zero ke CEO!
                        </p>
                      </div>

                      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                        <h3 className="font-bold text-[#5b5b5b] mb-3 flex items-center gap-1">
                          <BookOpen size={16} className="text-[#f02d9c]" />
                          Petunjuk
                        </h3>
                        <div className="space-y-2">
                          {[
                            'Undang 5–15 orang dari target pasar untuk uji MVP',
                            'Catat tingkat kepuasan (skala 1–5) dan alasan mereka',
                            'Tanyakan apakah mereka merekomendasikan produkmu',
                            'Kumpulkan saran perbaikan spesifik',
                            'Simpan data untuk evaluasi sebelum launching',
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
                            <Lightbulb size={12} /> Tujuan: Validasi MVP dengan pengguna nyata
                          </span>
                          <span className="px-2.5 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center gap-1">
                            <Award size={12} /> Tips: Fokus pada feedback jujur, bukan pujian
                          </span>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl p-4 bg-white">
                        <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-1">
                          <BookOpen size={14} /> Resources
                        </h3>
                        <ul className="text-sm text-[#5b5b5b] space-y-1.5">
                          <li>
                            <a href="https://www.youtube.com/watch?v=VlX9Kq2e5qU" target="_blank" rel="noopener noreferrer" className="text-[#f02d9c] hover:underline inline-flex items-center gap-1">
                              Cara Validasi Ide dalam 15 Menit <ChevronRight size={12} />
                            </a>
                          </li>
                          <li>
                            <a href="https://www.strategyzer.com/blog/validate-your-ideas-before-you-build" target="_blank" rel="noopener noreferrer" className="text-[#f02d9c] hover:underline inline-flex items-center gap-1">
                              Validate Before You Build (Strategyzer) <ChevronRight size={12} />
                            </a>
                          </li>
                          <li>
                            <a href="https://perempuaninovasi.id/workshop" target="_blank" rel="noopener noreferrer" className="text-[#f02d9c] hover:underline inline-flex items-center gap-1">
                              Panduan Validasi Ide (Perempuan Inovasi) <ChevronRight size={12} />
                            </a>
                          </li>
                        </ul>
                      </div>

                      {/* Tabel + Visualisasi Data Responden → tetap seperti asli */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd] mt-5">
                        <h3 className="font-bold text-[#0a5f61] mb-3 flex items-center gap-2">
                          <Users size={16} /> Visualisasi Data Responden
                        </h3>
                        <div className="overflow-x-auto mb-4">
                          <table className="min-w-full border border-gray-300 text-sm">
                            <thead className="bg-[#f02d9c] text-white">
                              <tr>
                                <th className="py-2 px-3 border border-gray-300 text-left">Nama</th>
                                <th className="py-2 px-3 border border-gray-300 text-left">Jenis Kelamin</th>
                                <th className="py-2 px-3 border border-gray-300 text-left">Usia</th>
                                <th className="py-2 px-3 border border-gray-300 text-left">Aktivitas</th>
                                <th className="py-2 px-3 border border-gray-300 text-left">Kepuasan</th>
                                <th className="py-2 px-3 border border-gray-300 text-left">Saran</th>
                                <th className="py-2 px-3 border border-gray-300 text-left">Rekomendasi</th>
                                <th className="py-2 px-3 border border-gray-300 text-left">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {allResponses.map((r) => (
                                <tr key={r.id} className="odd:bg-white even:bg-[#f9f9f9]">
                                  <td className="py-2 px-3 border border-gray-300">{r.name}</td>
                                  <td className="py-2 px-3 border border-gray-300">{r.gender}</td>
                                  <td className="py-2 px-3 border border-gray-300">{r.age}</td>
                                  <td className="py-2 px-3 border border-gray-300">{r.activity}</td>
                                  <td className="py-2 px-3 border border-gray-300">{r.satisfaction_rate ?? '-'}</td>
                                  <td className="py-2 px-3 border border-gray-300 max-w-[120px] truncate">{r.suggestion || '-'}</td>
                                  <td className="py-2 px-3 border border-gray-300">{r.recommendation ?? '-'}</td>
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
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
                            <h4 className="text-sm font-bold mb-2 text-[#0a5f61]">Distribusi Kepuasan</h4>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={satisfactionChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="score" />
                                <YAxis allowDecimals={false} />
                                <Tooltip formatter={(value) => [value, 'Jumlah Responden']} />
                                <Bar dataKey="count" fill="#f02d9c" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
                            <h4 className="text-sm font-bold mb-2 text-[#0a5f61]">Distribusi Jenis Kelamin</h4>
                            <ResponsiveContainer width="100%" height={200}>
                              <PieChart>
                                <Pie
                                  dataKey="value"
                                  data={genderChartData}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={70}
                                  label
                                />
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
                            <h4 className="text-sm font-bold mb-2 text-[#0a5f61]">Distribusi Usia</h4>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={ageChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#f02d9c" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
                            <h4 className="text-sm font-bold mb-2 text-[#0a5f61]">Distribusi Rekomendasi</h4>
                            <ResponsiveContainer width="100%" height={220}>
                              <PieChart>
                                <Pie
                                  dataKey="value"
                                  data={recChartData}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={70}
                                  label
                                >
                                  <Cell key="cell-ya" fill="#4A90E2" />
                                  <Cell key="cell-tidak" fill="#f02d9c" />
                                  <Cell key="cell-mungkin" fill="#C4C4C4" />
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
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
        xpGained={notificationData.xpGained}
        badgeName={notificationData.badgeName}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}