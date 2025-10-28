'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  Lightbulb,
  Award,
  BookOpen,
  Video,
  FileText,
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
} from 'lucide-react';
import useProjectStore from '@/store/useProjectStore';
import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';

const scaleLabels = ['Tidak Pernah', 'Pernah', 'Kadang', 'Sering', 'Sangat Sering'];
const range5 = [1, 2, 3, 4, 5];

export default function RWW() {
  const { projectId } = useParams();
  const router = useRouter();
  const projects = useProjectStore((state) => state.projects);
  const updateProject = useProjectStore((state) => state.updateProject);

  const [respondenName, setRespondenName] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('');
  const [usia, setUsia] = useState('');
  const [aktivitas, setAktivitas] = useState('');

  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [q3, setQ3] = useState(null);
  const [q4, setQ4] = useState(null);
  const [q5, setQ5] = useState(null);
  const [q6, setQ6] = useState(null);
  const [q7, setQ7] = useState(null);
  const [q8, setQ8] = useState(null);
  const [q9, setQ9] = useState(null);

  const [notes, setNotes] = useState({});

  const [isEditing, setIsEditing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [responses, setResponses] = useState([]);

  // Deteksi mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load data dari store dan localStorage
  useEffect(() => {
    if (!projectId) return;

    const found = projects.find((p) => p.id === projectId);
    setProject(found);

    const saved = localStorage.getItem(`rww_data_${projectId}`);
    if (saved) {
      try {
        const { responses: savedResponses } = JSON.parse(saved);
        setResponses(Array.isArray(savedResponses) ? savedResponses : []);
      } catch (e) {
        console.error('Gagal memuat data RWW dari localStorage:', e);
        setResponses([]);
      }
    }
  }, [projectId, projects]);

  const handleNoteChange = (key, value) => {
    setNotes((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddResponden = () => {
    const allAnswered = [q1, q2, q3, q4, q5, q6, q7, q8, q9].every((val) => val !== null);
    if (!allAnswered) {
      alert('Mohon lengkapi semua penilaian (1–5) terlebih dahulu.');
      return;
    }

    const newResponse = {
      id: Date.now(),
      name: respondenName || '—',
      gender: jenisKelamin || '—',
      age: usia || '—',
      activity: aktivitas || '—',
      real: (q1 + q2 + q3) / 3,
      win: (q4 + q5 + q6) / 3,
      worth: (q7 + q8 + q9) / 3,
      total: ((q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q9) / 9).toFixed(1),
      notes: {
        q1: notes.q1 || '',
        q2: notes.q2 || '',
        q3: notes.q3 || '',
        q4: notes.q4 || '',
        q5: notes.q5 || '',
        q6: notes.q6 || '',
        q7: notes.q7 || '',
        q8: notes.q8 || '',
        q9: notes.q9 || '',
      },
    };

    setResponses([...responses, newResponse]);

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
    setNotes({});
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

  const RatingBox = ({ value, onChange, labels = scaleLabels }) => (
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

  const handleSave = () => {
    const dataToSave = {
      responses,
      averages,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`rww_data_${projectId}`, JSON.stringify(dataToSave));

    // Simpan ke store juga
    const updatedLevels = [...(project?.levels || [])];
    if (!updatedLevels[1]) updatedLevels[1] = { id: 2, completed: false, data: {} };
    updatedLevels[1] = {
      ...updatedLevels[1],
      completed: parseFloat(averages.total) >= 3.5,
      data: { rww: dataToSave },
    };
    updateProject(projectId, { levels: updatedLevels });

    alert('Data RWW berhasil disimpan!');
  };

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
    { label: 'Level 2: Validasi RWW' },
  ];

  return (
    <div className="min-h-screen bg-white font-[Poppins]">
      {/* Breadcrumb */}
      <div className="px-3 sm:px-4 md:px-6 py-2 border-b border-gray-200 bg-white">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Mobile Header */}
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
        {/* Sidebar */}
        <PlanSidebar
          projectId={projectId}
          currentLevelId={2}
          isMobile={isMobile}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Main Content */}
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
                    {/* Kolom Kiri: Form RWW */}
                    <div>
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
                            <input
                              type="text"
                              value={aktivitas}
                              onChange={(e) => setAktivitas(e.target.value)}
                              placeholder="Contoh: Mahasiswa"
                              className="w-full px-3.5 py-2.5 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                              style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            />
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
                                  <textarea
                                    value={notes[`q${q}`] || ''}
                                    onChange={(e) => handleNoteChange(`q${q}`, e.target.value)}
                                    placeholder="Opsional: Jelaskan..."
                                    className="w-full mt-3 px-3 py-2 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                                    style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                                  />
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
                                  <textarea
                                    value={notes[`q${q}`] || ''}
                                    onChange={(e) => handleNoteChange(`q${q}`, e.target.value)}
                                    placeholder="Opsional: Jelaskan..."
                                    className="w-full mt-3 px-3 py-2 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                                    style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                                  />
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
                                  <textarea
                                    value={notes[`q${q}`] || ''}
                                    onChange={(e) => handleNoteChange(`q${q}`, e.target.value)}
                                    placeholder="Opsional: Jelaskan..."
                                    className="w-full mt-3 px-3 py-2 border-t border-l border-black rounded-lg font-[Poppins] text-[#5b5b5b] placeholder:text-[#7a7a7a] bg-white"
                                    style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                                  />
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

                      {/* Ringkasan & Navigasi */}
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

                            {/* Tombol Navigasi */}
                            <div className="flex flex-wrap gap-2 justify-center">
                              <Link
                                href={`/dashboard/${projectId}/level_1_idea`}
                                className="px-4 py-2 bg-white text-[#5b5b5b] font-medium rounded-lg border border-gray-300 flex items-center gap-1"
                              >
                                <ChevronLeft size={16} />
                                Preview
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

                    {/* Kolom Kanan: Edukasi */}
                    <div className="space-y-5">
                      {/* Tujuan Level */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                        <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-2">
                          <Lightbulb size={16} /> Tujuan Level 2 (Validasi RWW)
                        </h3>
                        <ul className="text-sm text-[#5b5b5b] list-disc pl-5 space-y-1">
                          <li>
                            Uji apakah masalah yang diangkat <strong>benar-benar nyata</strong> (REAL)
                          </li>
                          <li>
                            Validasi apakah solusimu <strong>lebih unggul</strong> dari alternatif (WIN)
                          </li>
                          <li>
                            Ukur kesiapan pasar untuk <strong>membayar</strong> (WORTH)
                          </li>
                          <li>
                            Kumpulkan <strong>bukti empiris</strong> sebelum investasi lebih lanjut
                          </li>
                        </ul>
                      </div>

                      {/* Tips & Trick */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                        <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-2">
                          <Award size={16} /> Tips Validasi Ide
                        </h3>
                        <ul className="text-sm text-[#5b5b5b] list-disc pl-5 space-y-1">
                          <li>
                            Wawancara minimal <strong>5–10 responden</strong> berbeda
                          </li>
                          <li>Hindari leading question — biarkan mereka bicara bebas</li>
                          <li>
                            Fokus pada <strong>perilaku nyata</strong>, bukan opini
                          </li>
                          <li>
                            Skor rata-rata <strong>≥3.5</strong> menunjukkan ide layak dilanjutkan
                          </li>
                        </ul>
                      </div>

                      {/* Resources */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                        <h3 className="font-bold text-[#0a5f61] mb-3 flex items-center gap-2">
                          <BookOpen size={16} /> Resources Validasi Ide
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-bold text-sm text-[#5b5b5b] mb-1 flex items-center gap-1">
                              <Video size={14} /> Video
                            </h4>
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
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#5b5b5b] mb-1 flex items-center gap-1">
                              <FileText size={14} /> Bacaan
                            </h4>
                            <ul className="text-sm space-y-1">
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
                        </div>
                      </div>

                      {/* Daftar Responden */}
                      {responses.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                          <h3 className="font-bold text-[#0a5f61] mb-3 flex items-center gap-2">
                            <Users size={16} /> Responden ({responses.length})
                          </h3>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {responses.map((r) => (
                              <div key={r.id} className="text-xs p-2 border border-gray-200 rounded bg-white">
                                <div className="font-medium text-[#0a5f61]">{r.name}</div>
                                <div className="text-[#5b5b5b]">
                                  {r.gender}, {r.age} tahun, {r.activity}
                                </div>
                                <div className="text-[#f02d9c] font-bold mt-1">Total: {r.total}</div>
                              </div>
                            ))}
                          </div>
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
    </div>
  );
}