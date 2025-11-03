'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  Edit3,
  Target,
  Zap,
  Package,
  Lightbulb,
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import useProjectStore from '@/store/useProjectStore';
import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';
import NotificationModalPlan from '@/components/NotificationModalPlan';
import useBusinessIdeaStore from '@/store/useBusinessIdea';
import { generateBusinessIdea } from '@/ai/flows/analysisBusinessIdea';

// === HELPER: Parse & Format ===
const parseProductsServices = (text) => {
  if (!text) return {};
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const data = {
    ide: '',
    jenis: '',
    deskripsi: '',
    fitur: '',
    manfaat: '',
    harga: '',
    biayaModal: '',
    biayaBahanBaku: '',
    hargaJual: '',
    margin: '',
  };
  for (const line of lines) {
    if (line.startsWith('Jenis:')) data.jenis = line.replace('Jenis:', '').trim();
    else if (line.startsWith('Deskripsi:')) data.deskripsi = line.replace('Deskripsi:', '').trim();
    else if (line.startsWith('Fitur')) data.fitur = line;
    else if (line.startsWith('Manfaat')) data.manfaat = line;
    else if (line.startsWith('Harga:')) data.harga = line;
    else if (line.startsWith('Biaya Modal:')) data.biayaModal = line;
    else if (line.startsWith('Biaya Bahan Baku:')) data.biayaBahanBaku = line;
    else if (line.startsWith('Harga Jual:')) data.hargaJual = line;
    else if (line.startsWith('Margin:')) data.margin = line;
    else if (!data.ide) data.ide = line;
  }
  return data;
}
// === CONFETTI ANIMATION ===
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

// // === HELPER: Parse & Format Products & Services ===
// const parseProductsServices = (text) => {
//   const lines = text.split('\n').map((l) => l.trim()).filter((l) => l);
//   let ide = '',
//     jenis = '',
//     deskripsi = '',
//     fitur = '',
//     manfaat = '',
//     harga = '',
//     biayaModal = '',
//     biayaBahanBaku = '',
//     hargaJual = '',
//     margin = '',
//     uniqueAdvantage = '',
//     keyMetrics = '',
//     channel = '';
//   for (const line of lines) {
//     if (line.startsWith('Jenis:')) jenis = line.replace('Jenis:', '').trim();
//     else if (line.startsWith('Deskripsi:')) deskripsi = line.replace('Deskripsi:', '').trim();
//     else if (line.startsWith('Fitur')) fitur = line;
//     else if (line.startsWith('Manfaat')) manfaat = line;
//     else if (line.startsWith('Harga:')) harga = line;
//     else if (line.startsWith('Biaya Modal:')) biayaModal = line;
//     else if (line.startsWith('Biaya Bahan Baku:')) biayaBahanBaku = line;
//     else if (line.startsWith('Harga Jual:')) hargaJual = line;
//     else if (line.startsWith('Margin:')) margin = line;
//     else if (line.startsWith('Keunggulan Unik:')) uniqueAdvantage = line;
//     else if (line.startsWith('Angka Penting:')) keyMetrics = line;
//     else if (line.startsWith('Cara Jualan:')) channel = line;
//     else if (!ide) ide = line;
//   }
//   return {
//     ide,
//     jenis,
//     deskripsi,
//     fitur,
//     manfaat,
//     harga,
//     biayaModal,
//     biayaBahanBaku,
//     hargaJual,
//     margin,
//     uniqueAdvantage,
//     keyMetrics,
//     channel,
//   };
// };

const formatProductsServices = ({
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
}) => {
  const parts = [ide];
  if (jenis) parts.push(`Jenis: ${jenis}`);
  if (deskripsi) parts.push(`Deskripsi: ${deskripsi}`);
  if (fitur) parts.push(fitur);
  if (manfaat) parts.push(manfaat);
  if (harga) parts.push(harga);
  if (biayaModal) parts.push(biayaModal);
  if (biayaBahanBaku) parts.push(biayaBahanBaku);
  if (hargaJual) parts.push(hargaJual);
  if (margin) parts.push(margin);
  if (uniqueAdvantage) parts.push(uniqueAdvantage);
  if (keyMetrics) parts.push(keyMetrics);
  if (channel) parts.push(channel);
  return parts.join('\n');
};

// === GENERATOR IDE (DIPERBAIKI) ===
const generateThreeIdeasFromInterest = (interest) => {
  const baseIdeas = [
    {
      interest: 'kuliner',
      customerJobs: 'Ibu bekerja usia 28–45 tahun ingin menyediakan makanan sehat untuk keluarga setiap hari',
      pains: 'Waktu terbatas, tidak sempat belanja & masak, takut anak kurang gizi, stres mengatur menu',
      gains: 'Anak sehat dan tumbuh optimal, hemat waktu, tidak perlu mikir masak, tenang secara mental',
      productsServices:
        'Meal Prep Box untuk Ibu Bekerja\n' +
        'Jenis: Layanan Langganan Makanan Sehat\n' +
        'Deskripsi: Kotak makanan siap saji mingguan dengan resep bergizi dari ahli nutrisi, bahan organik lokal\n' +
        'Fitur utama: Dikirim setiap Senin, siap saji dalam 5 menit, bisa atur alergi\n' +
        'Manfaat: Hemat 10 jam/minggu, anak lebih sehat, tidak perlu mikir menu\n' +
        'Harga: Rp299.000/minggu (5 menu)\n' +
        'Biaya Modal: Rp5.000.000 (kompor portable, wadah food-grade 100 pcs, branding awal)\n' +
        'Biaya Bahan Baku: Beras organik (Rp50.000), Ayam kampung (Rp80.000), Sayur lokal (Rp30.000), Bumbu & minyak (Rp20.000) → Total: Rp180.000/minggu\n' +
        'Harga Jual: Rp299.000/minggu\n' +
        'Margin: ±40%\n' +
        'Keunggulan Unik: Kita satu-satunya yang pakai bahan organik lokal DAN bisa atur alergi lewat WhatsApp\n' +
        'Angka Penting: Jumlah langganan aktif per minggu, Rating kepuasan pelanggan (1–5), Jumlah jam yang dihemat pelanggan\n' +
        'Cara Jualan: Instagram & TikTok (konten harian ibu sibuk), WhatsApp Business (untuk pesan & konsultasi), Rekomendasi dari komunitas ibu di Facebook',
      painRelievers:
        'Dikirim setiap Senin pagi → tidak perlu belanja\nSiap saji dalam 5 menit → tidak perlu masak\nBisa atur alergi/makanan pantangan → aman untuk anak',
      gainCreators:
        'Hemat 10 jam/minggu\nAnak-anak lebih sehat\nTidak perlu mikir menu\nHarga: Rp299.000/minggu (5 menu)',
    },
    {
      interest: 'fashion',
      customerJobs: 'Wanita muslim usia 20–35 tahun butuh outfit formal untuk acara spesial (nikahan, wisuda, dll)',
      pains: 'Beli outfit mahal tapi jarang dipakai, takut tidak sesuai ekspektasi, repot laundry & simpan',
      gains: 'Tampil percaya diri, hemat uang, tidak perlu khawatir soal penyimpanan, ramah lingkungan',
      productsServices:
        'Modest Wear Rental untuk Acara Formal\n' +
        'Jenis: Platform Sewa Pakaian\n' +
        'Deskripsi: Sewa hijab & dress formal berkualitas tinggi dengan opsi pengiriman & laundry gratis\n' +
        'Fitur utama: Sewa mulai Rp149rb, gratis pengiriman & pengembalian, coba virtual via AR\n' +
        'Manfaat: Tampil fresh tanpa beli baru, hemat 70%, ramah lingkungan\n' +
        'Harga: Rp149.000/3 hari\n' +
        'Biaya Modal: Rp10.000.000 (stok awal 50 outfit, gantungan, kemasan, sistem booking sederhana)\n' +
        'Biaya Bahan Baku: Rp0 (tidak ada produksi, hanya perawatan: laundry & steaming @Rp15.000/outfit)\n' +
        'Harga Jual: Rp149.000/3 hari\n' +
        'Margin: ±60% setelah skala\n' +
        'Keunggulan Unik: Bisa coba pakai virtual lewat AR sebelum sewa → minim risiko salah pilih\n' +
        'Angka Penting: Jumlah sewa/hari, Rating kepuasan, Persentase repeat customer\n' +
        'Cara Jualan: Instagram, TikTok, Website booking, Kolaborasi dengan influencer hijab',
      painRelievers:
        'Sewa mulai Rp149rb → jauh lebih murah daripada beli\nGratis pengiriman & pengembalian\nBisa coba virtual via AR → minim risiko salah pilih',
      gainCreators:
        'Tampil fresh di setiap acara tanpa beli baru\nHemat hingga 70% dibanding beli\nRamah lingkungan\nHarga: Rp149.000/3 hari',
    },
    {
      interest: 'edukasi anak',
      customerJobs: 'Orang tua ingin anak usia 7–12 tahun belajar coding secara menyenangkan dan mandiri',
      pains: 'Tidak punya waktu dampingi, kursus offline mahal, anak cepat bosan dengan metode kaku',
      gains: 'Anak paham logika pemrograman, bisa bikin game sederhana, lebih percaya diri di sekolah',
      productsServices:
        'Kelas Coding untuk Anak SD via WhatsApp\n' +
        'Jenis: Layanan Edukasi Digital\n' +
        'Deskripsi: Program belajar coding 12 minggu dengan video pendek, tantangan seru, dan hadiah digital\n' +
        'Fitur utama: Cukup 10 menit/hari, grup WhatsApp eksklusif, bisa pakai HP\n' +
        'Manfaat: Anak belajar mandiri, biaya terjangkau, dapat sertifikat digital\n' +
        'Harga: Rp99.000/program\n' +
        'Biaya Modal: Rp500.000 (pembuatan konten video, desain worksheet, sistem otomatisasi WhatsApp)\n' +
        'Biaya Bahan Baku: Rp0 (digital, tidak ada bahan fisik)\n' +
        'Harga Jual: Rp99.000/program\n' +
        'Margin: ±95%\n' +
        'Keunggulan Unik: Cukup pakai WhatsApp — tidak perlu aplikasi baru\n' +
        'Angka Penting: Jumlah siswa aktif, Persentase penyelesaian modul, Rating kepuasan orang tua\n' +
        'Cara Jualan: Grup WhatsApp komunitas, Instagram edukasi, Rekomendasi guru SD',
      painRelievers:
        'Cukup 10 menit/hari → tidak mengganggu jadwal\nGrup WhatsApp eksklusif dengan mentor → responsif\nTidak perlu laptop → bisa pakai HP orang tua',
      gainCreators:
        'Anak belajar mandiri tanpa perlu dampingan\nBiaya terjangkau\nDapat sertifikat digital\nHarga: Rp99.000/program',
    },
    {
      interest: 'jasa keuangan',
      customerJobs: 'Pemilik warung kopi/makanan usia 30–50 tahun ingin catat keuangan harian dengan mudah',
      pains: 'Tidak paham Excel, takut ribet, sering lupa catat, stok sering kehabisan tanpa sadar',
      gains: 'Tahu untung/rugi harian, siap laporan pajak, stok terpantau, tidur lebih tenang',
      productsServices:
        'Aplikasi Catatan Keuangan UMKM Warung\n' +
        'Jenis: Aplikasi Mobile\n' +
        'Deskripsi: Aplikasi pencatatan keuangan berbasis suara dengan antarmuka super sederhana, hanya butuh HP Android\n' +
        'Fitur utama: Cukup ucapkan transaksi, backup otomatis, notifikasi stok habis\n' +
        'Manfaat: Tidak perlu bisa baca/tulis lancar, laporan otomatis, siap laporan pajak\n' +
        'Harga: Rp49.000/bulan\n' +
        'Biaya Modal: Rp15.000.000 (pengembangan MVP, hosting awal, uji coba lapangan)\n' +
        'Biaya Bahan Baku: Rp50.000/bulan (server cloud, biaya API suara, maintenance)\n' +
        'Harga Jual: Rp49.000/bulan\n' +
        'Margin: ±80% setelah 500 pengguna aktif\n' +
        'Keunggulan Unik: Cukup bicara — tidak perlu ngetik\n' +
        'Angka Penting: Jumlah pengguna aktif, Rata-rata transaksi/hari, Retensi bulanan\n' +
        'Cara Jualan: WhatsApp UMKM, Grup Facebook pedagang, Demo langsung di pasar',
      painRelievers:
        'Cukup ucapkan: “Hari ini jual 50 kopi, modal 200rb” → otomatis jadi laporan\nBackup otomatis ke cloud\nNotifikasi saat stok hampir habis',
      gainCreators:
        'Tidak perlu bisa baca/tulis lancar\nLaporan harian & mingguan otomatis\nSiap untuk laporan pajak\nHarga: Rp49.000/bulan',
    },
  ];

  const normalized = interest.toLowerCase().trim();

  const matched = baseIdeas.find((idea) =>
    idea.interest.toLowerCase().includes(normalized) || normalized.includes(idea.interest.toLowerCase())
  );

  if (matched) {
    const others = baseIdeas.filter((i) => i !== matched);
    const shuffled = [...others].sort(() => 0.5 - Math.random());
    return [matched, ...shuffled.slice(0, 2)];
  } else {
    // Jika tidak cocok, tampilkan 3 ide acak — tanpa merusak array asli
    const shuffled = [...baseIdeas].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }
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
      {progress >= 100 && (
        <p className="text-[10px] text-[#7a7a7a] mt-1 text-right">Selesai!</p>
      )}
    </div>
  );
};

// === MAIN COMPONENT ===
export default function Level1Page() {
  const { id } = useParams();
  const router = useRouter();
  const { businessIdeas, getBusinessIdeas, updateBusinessIdeas } = useBusinessIdeaStore();
  const { planLevels, updateLevelStatus, projects } = useProjectStore();

  const [interest, setInterest] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [vpcData, setVpcData] = useState({
    marketPotential: '',
    problemSolved: '',
    solutionOffered: '',
    productsServices: '',
    unfairAdvantage: '',
    uniqueValueProposition: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notificationData, setNotificationData] = useState({
    message: '',
    xpGained: 0,
    badgeName: '',
  });

  const businessIdeaId = id;
  const projectId = businessIdeas.project || '';
  const levelId = planLevels[0]?._id || '';

  // Progress data
  const totalLevels = planLevels.length;
  const completedLevels = planLevels?.filter((l) => l.completed).length || 0;
  const currentXp = completedLevels * (planLevels.find((p) => p._id === levelId)?.xp || 0);
  const totalXp = totalLevels * (planLevels.find((p) => p._id === levelId)?.xp || 0);
  const firstIncompleteLevel = planLevels?.find((l) => !l.completed) || { id: 1 };

  const breadcrumbItems = [
  { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
  { href: `/dashboard/${projectId}/plan/${businessIdeaId}`, label: 'Level 1: Ide Generator' },
];

  const ps = parseProductsServices(vpcData.productsServices);

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


useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 1024);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);


  // Ambil data ide bisnis awal
  useEffect(() => {
    if (businessIdeaId) getBusinessIdeas(businessIdeaId);
  }, [businessIdeaId]);

  // === GENERATE DARI AI ===
  const handleGenerate = async () => {
    if (!interest.trim()) {
      alert('Silakan isi minat atau bidang terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    try {
      // 🔥 Panggil AI Flow
      const result = await generateBusinessIdea({ interest });
      const ideas = Array.isArray(result) ? result : [result];
      setGeneratedIdeas(ideas);

      // Simpan ke store juga
      if (businessIdeaId) {
        await updateBusinessIdeas(businessIdeaId, { generatedIdeas: ideas });
      }

      setSelectedIdea(null);
      setVpcData({
        marketPotential: '',
        problemSolved: '',
        solutionOffered: '',
        productsServices: '',
        unfairAdvantage: '',
        uniqueValueProposition: '',
      });
    } catch (error) {
      console.error('Error generating idea:', error);
      alert('Gagal menghasilkan ide bisnis.');
    } finally {
      setIsLoading(false);
    }
  };

  // === PILIH IDE ===
  const handleSelectIdea = async (idea) => {
    setSelectedIdea(idea.interest);
    setVpcData({
      marketPotential: idea.marketPotential,
      problemSolved: idea.problemSolved,
      solutionOffered: idea.solutionOffered,
      productsServices: idea.productsServices,
      unfairAdvantage: idea.unfairAdvantage,
      uniqueValueProposition: idea.uniqueValueProposition,
    });

    // Simpan pilihan ke store
    if (businessIdeaId) {
      await updateBusinessIdeas(businessIdeaId, {
        interest: idea.interest,
        ...idea,
      });
    }
  };

  // === EDIT DATA ===
  const handleVpcChange = (field, value) => {
    setVpcData((prev) => ({ ...prev, [field]: value }));
  };

  // === SIMPAN AKHIR ===
  const handleSave = async () => {
    if (!selectedIdea) {
      alert('Pilih salah satu ide terlebih dahulu.');
      return;
    }

    try {
      await updateBusinessIdeas(businessIdeaId, {
        interest: selectedIdea,
        ...vpcData,
      });
      await updateLevelStatus(levelId, { completed: true });
      setShowConfetti(true);

      setNotificationData({
        message: 'Ide berhasil disimpan!',
        xpGained: planLevels.find((p) => p._id === levelId)?.xp || 0,
        badgeName: planLevels.find((p) => p._id === levelId)?.badge || '',
      });
      setShowNotification(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      console.error('Error saving business idea:', err);
      alert('Gagal menyimpan ide bisnis.');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {showConfetti && <Confetti />}
      {/* Breadcrumb */}
      <div className="px-3 sm:px-4 md:px-6 py-2 border-b border-gray-200 bg-white">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Mobile Header */}
      {isMobile && !mobileSidebarOpen && (
        <header className="p-3 flex items-center border-b border-gray-200 bg-white sticky top-10 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={20} className="text-[#5b5b5b]" />
          </button>
          <h1 className="ml-2 font-bold text-[#5b5b5b] text-base">Level 1: Ide Generator</h1>
        </header>
      )}

      <div className="flex">
        <PlanSidebar
          businessIdeaId={businessIdeaId}
          currentLevelId={1}
          isMobile={isMobile}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        <main className="flex-1">
          <div className="p-3 sm:p-4 md:p-6 max-w-6xl mx-auto">
            <div className="relative">
              <div className="relative bg-white rounded-2xl border-2 border-[#f02d9c] p-4 sm:p-5 md:p-6">
                {!isMobile && (
                  <h1 className="text-xl sm:text-2xl font-bold text-[#f02d9c] mb-4 sm:mb-6">
                    Level 1: Ide Generator
                  </h1>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Form */}
                  <div>
                    <div className="mb-5">
                      <label className="block mb-2 font-medium text-[#5b5b5b] text-sm sm:text-base">
                        Minat/Bidang
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={interest}
                          onChange={(e) => setInterest(e.target.value)}
                          className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f02d9c] text-sm sm:text-base"
                          placeholder="Contoh: kuliner, fashion, edukasi anak..."
                        />
                        <button
                          type="button"
                          onClick={handleGenerate}
                          className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg hover:bg-[#7abfc0] whitespace-nowrap"
                        >
                          Generate
                        </button>
                      </div>
                    </div>

                    {generatedIdeas.length > 0 && !selectedIdea && (
                      
                      <div className="mb-5">
                        <h3 className="font-bold text-[#5b5b5b] mb-3">Pilih Salah Satu Ide:</h3>
                        <div className="grid grid-cols-1 gap-3">
                          {generatedIdeas.map((idea, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSelectIdea(idea)}
                              className="p-3 text-left border border-gray-300 rounded-lg hover:bg-[#fdf6f0] transition-colors"
                            >
                              <div className="font-medium text-[#0a5f61]">
                                {idea.productsServices.split('\n')[0]}
                              </div>
                              <div className="text-xs text-[#5b5b5b] mt-1">
                                {idea.productsServices.split('\n').slice(1, 3).join(' • ')}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {!selectedIdea && generatedIdeas.length === 0 && vpcData && Object.keys(vpcData).length > 0 && (
                      <div className="mb-5 p-4 border border-gray-300 rounded-xl bg-white shadow-sm">
                        <h3 className="font-bold text-[#5b5b5b] mb-3 flex items-center gap-2">
                          <Eye size={16} /> Pratinjau Produk & Brand (Tersimpan)
                        </h3>

                        {/* Profil Pelanggan */}
                        <div className="p-3 mb-3 bg-[#fdf6f0] rounded border border-[#f0d5c2]">
                          <h4 className="font-bold text-[#0a5f61] text-sm mb-2 flex items-center gap-1">
                            <Target size={14} /> Profil Pelanggan
                          </h4>
                          <ul className="text-xs text-[#5b5b5b] space-y-1">
                            <li><span className="font-medium">Tugas Pelanggan:</span> {businessIdeas.marketPotential || '-'}</li>
                            <li><span className="font-medium">Masalah:</span> {businessIdeas.problemSolved || '-'}</li>
                            <li><span className="font-medium">Keuntungan yang Diinginkan:</span> {businessIdeas.solutionOffered || '-'}</li>
                          </ul>
                        </div>

                        {/* Produk & Layanan */}
                        <div className="p-3 mb-3 bg-[#f0f9f9] rounded border border-[#c2e9e8]">
                          <h4 className="font-bold text-[#f02d9c] text-sm mb-2 flex items-center gap-1">
                            <Package size={14} /> Produk & Layanan
                          </h4>
                          <ul className="text-xs text-[#5b5b5b] space-y-1">
                            <li><span className="font-medium">Ide Produk:</span> {ps.ide || '-'}</li>
                            {ps.jenis && <li><span className="font-medium">Jenis:</span> {ps.jenis}</li>}
                            {ps.deskripsi && <li><span className="font-medium">Deskripsi:</span> {ps.deskripsi}</li>}
                            {ps.harga && <li><span className="font-medium">Harga:</span> {ps.harga}</li>}
                          </ul>
                        </div>

                        {/* Nilai Produk */}
                        <div className="p-3 bg-[#f0f9f9] rounded border border-[#c2e9e8]">
                          <h4 className="font-bold text-[#f02d9c] text-sm mb-2 flex items-center gap-1">
                            <Zap size={14} /> Nilai Produk
                          </h4>
                          <ul className="text-xs text-[#5b5b5b] space-y-1">
                            <li><span className="font-medium">Solusi Masalah:</span> {businessIdeas.unfairAdvantage || '-'}</li>
                            <li><span className="font-medium">Pencipta Keuntungan:</span> {businessIdeas.uniqueValueProposition || '-'}</li>
                          </ul>
                        </div>
                      </div>
                    )}


                    {selectedIdea && (
                      <>
                        {!isEditing ? (
                          <div className="mb-5 p-4 border border-gray-300 rounded-xl bg-white">
                            <h3 className="font-bold text-[#5b5b5b] mb-3 flex items-center gap-2">
                              <Eye size={16} /> Value Proposition Canvas (VPC)
                            </h3>
                            <div className="p-3 mb-3 bg-[#fdf6f0] rounded border border-[#f0d5c2]">
                              <h4 className="font-bold text-[#0a5f61] text-sm mb-2 flex items-center gap-1">
                                <Target size={14} /> Profil Pelanggan
                              </h4>
                              <ul className="text-[15px] text-[#5b5b5b] space-y-1.5">
                                <li>
                                  <span className="font-medium">Siapa yang kamu bantu?</span> {vpcData.customerJobs || '-'}
                                </li>
                                <li>
                                  <span className="font-medium">Apa masalahnya?</span> {vpcData.pains || '-'}
                                </li>
                                <li>
                                  <span className="font-medium">Apa yang dia pengin banget dapet?</span> {vpcData.gains || '-'}
                                </li>
                              </ul>
                            </div>
                            <div className="p-3 mb-3 bg-[#f8fbfb] rounded border border-[#c2e9e8]">
                              <h4 className="font-bold text-[#f02d9c] text-sm mb-2 flex items-center gap-1">
                                <Zap size={14} /> Nilai Produk
                              </h4>
                              <ul className="text-[15px] text-[#5b5b5b] space-y-1.5">
                                <li>
                                  <span className="font-medium">Apa yang kamu tawarkan buat bantu dia?</span>{' '}
                                  {vpcData.painRelievers || '-'}
                                </li>
                                <li>
                                  <span className="font-medium">Apa yang bikin dia seneng banget?</span>{' '}
                                  {vpcData.gainCreators || '-'}
                                </li>
                              </ul>
                            </div>
                            <div className="p-3 bg-[#f8fbfb] rounded border border-[#c2e9e8]">
                              <h4 className="font-bold text-[#f02d9c] text-sm mb-2 flex items-center gap-1">
                                <Package size={14} /> Produk & Layanan
                              </h4>
                              <ul className="text-[15px] text-[#5b5b5b] space-y-1.5">
                                <li>
                                  <span className="font-medium">Apa yang kamu jual?</span> {ps.ide || '-'}
                                </li>
                                {ps.jenis && <li><span className="font-medium">Jenis:</span> {ps.jenis}</li>}
                                {ps.deskripsi && <li><span className="font-medium">Deskripsi:</span> {ps.deskripsi}</li>}
                                {ps.fitur && <li><span className="font-medium">Fitur utama:</span> {ps.fitur}</li>}
                                {ps.manfaat && <li><span className="font-medium">Manfaat:</span> {ps.manfaat}</li>}
                                {ps.harga && <li><span className="font-medium">Harga:</span> {ps.harga}</li>}
                              </ul>
                              {ps.uniqueAdvantage && (
                                <div className="mt-3 pt-2 border-t border-[#e0f0f0]">
                                  <p className="font-medium text-[#0a5f61] text-sm">Apa yang bikin kamu beda?</p>
                                  <p className="text-[15px] text-[#5b5b5b] mt-1">
                                    {ps.uniqueAdvantage.replace('Keunggulan Unik: ', '')}
                                  </p>
                                </div>
                              )}
                              {ps.keyMetrics && (
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
                              {ps.channel && (
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
                              <div className="mt-4">
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
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="border border-gray-300 rounded-xl p-4 bg-[#fdf6f0]">
                              <h3 className="font-bold text-[#0a5f61] mb-3 flex items-center gap-2">
                                <Target size={16} /> Profil Pelanggan
                              </h3>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-[#5b5b5b] mb-1">
                                    Siapa yang kamu bantu?
                                  </label>
                                  <textarea
                                    value={vpcData.customerJobs}
                                    onChange={(e) => handleVpcChange('customerJobs', e.target.value)}
                                    className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                    rows="2"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Apa masalahnya?</label>
                                  <textarea
                                    value={vpcData.pains}
                                    onChange={(e) => handleVpcChange('pains', e.target.value)}
                                    className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                    rows="2"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-[#5b5b5b] mb-1">
                                    Apa yang dia pengin banget dapet?
                                  </label>
                                  <textarea
                                    value={vpcData.gains}
                                    onChange={(e) => handleVpcChange('gains', e.target.value)}
                                    className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                    rows="2"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="border border-gray-300 rounded-xl p-4 bg-[#f8fbfb]">
                              <h3 className="font-bold text-[#f02d9c] mb-3 flex items-center gap-2">
                                <Zap size={16} /> Nilai Produk
                              </h3>
                              <div className="mb-3">
                                <label className="block text-xs font-medium text-[#5b5b5b] mb-2">
                                  Apa yang kamu tawarkan buat bantu dia?
                                </label>
                                <textarea
                                  value={vpcData.painRelievers}
                                  onChange={(e) => handleVpcChange('painRelievers', e.target.value)}
                                  className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                  rows="3"
                                />
                              </div>
                              <div className="mb-3">
                                <label className="block text-xs font-medium text-[#5b5b5b] mb-2">
                                  Apa yang bikin dia seneng banget?
                                </label>
                                <textarea
                                  value={vpcData.gainCreators}
                                  onChange={(e) => handleVpcChange('gainCreators', e.target.value)}
                                  className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                  rows="3"
                                />
                              </div>
                              <div className="mb-3">
                                <label className="block text-xs font-medium text-[#5b5b5b] mb-2">Produk & Layanan</label>
                                <div className="space-y-2 text-xs">
                                  <input
                                    type="text"
                                    placeholder="Apa yang kamu jual?"
                                    value={ps.ide}
                                    onChange={(e) => {
                                      const newPs = { ...ps, ide: e.target.value };
                                      handleVpcChange('productsServices', formatProductsServices(newPs));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Jenis Produk"
                                    value={ps.jenis}
                                    onChange={(e) => {
                                      const newPs = { ...ps, jenis: e.target.value };
                                      handleVpcChange('productsServices', formatProductsServices(newPs));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <textarea
                                    placeholder="Deskripsi"
                                    value={ps.deskripsi}
                                    onChange={(e) => {
                                      const newPs = { ...ps, deskripsi: e.target.value };
                                      handleVpcChange('productsServices', formatProductsServices(newPs));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    rows="2"
                                  />
                                  <textarea
                                    placeholder="Fitur Utama"
                                    value={ps.fitur}
                                    onChange={(e) => {
                                      const newPs = { ...ps, fitur: e.target.value };
                                      handleVpcChange('productsServices', formatProductsServices(newPs));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    rows="2"
                                  />
                                  <textarea
                                    placeholder="Manfaat"
                                    value={ps.manfaat}
                                    onChange={(e) => {
                                      const newPs = { ...ps, manfaat: e.target.value };
                                      handleVpcChange('productsServices', formatProductsServices(newPs));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    rows="2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Harga"
                                    value={ps.harga ? ps.harga.replace('Harga: ', '') : ''}
                                    onChange={(e) => {
                                      const newPs = { ...ps, harga: e.target.value ? `Harga: ${e.target.value}` : '' };
                                      handleVpcChange('productsServices', formatProductsServices(newPs));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Keunggulan Unik"
                                    value={ps.uniqueAdvantage ? ps.uniqueAdvantage.replace('Keunggulan Unik: ', '') : ''}
                                    onChange={(e) => {
                                      const newPs = { ...ps, uniqueAdvantage: e.target.value ? `Keunggulan Unik: ${e.target.value}` : '' };
                                      handleVpcChange('productsServices', formatProductsServices(newPs));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Angka Penting"
                                    value={ps.keyMetrics ? ps.keyMetrics.replace('Angka Penting: ', '') : ''}
                                    onChange={(e) => {
                                      const newPs = { ...ps, keyMetrics: e.target.value ? `Angka Penting: ${e.target.value}` : '' };
                                      handleVpcChange('productsServices', formatProductsServices(newPs));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Cara Jualan"
                                    value={ps.channel ? ps.channel.replace('Cara Jualan: ', '') : ''}
                                    onChange={(e) => {
                                      const newPs = { ...ps, channel: e.target.value ? `Cara Jualan: ${e.target.value}` : '' };
                                      handleVpcChange('productsServices', formatProductsServices(newPs));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Biaya Modal"
                                    value={ps.biayaModal ? ps.biayaModal.replace('Biaya Modal: ', '') : ''}
                                    onChange={(e) => {
                                      const newPs = { ...ps, biayaModal: e.target.value ? `Biaya Modal: ${e.target.value}` : '' };
                                      handleVpcChange('productsServices', formatProductsServices(newPs));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <textarea
                                    placeholder="Biaya Bahan Baku"
                                    value={ps.biayaBahanBaku ? ps.biayaBahanBaku.replace('Biaya Bahan Baku: ', '') : ''}
                                    onChange={(e) => {
                                      const newPs = { ...ps, biayaBahanBaku: e.target.value ? `Biaya Bahan Baku: ${e.target.value}` : '' };
                                      handleVpcChange('productsServices', formatProductsServices(newPs));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    rows="3"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Harga Jual"
                                    value={ps.hargaJual ? ps.hargaJual.replace('Harga Jual: ', '') : ''}
                                    onChange={(e) => {
                                      const newPs = { ...ps, hargaJual: e.target.value ? `Harga Jual: ${e.target.value}` : '' };
                                      handleVpcChange('productsServices', formatProductsServices(newPs));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Margin"
                                    value={ps.margin ? ps.margin.replace('Margin: ', '') : ''}
                                    onChange={(e) => {
                                      const newPs = { ...ps, margin: e.target.value ? `Margin: ${e.target.value}` : '' };
                                      handleVpcChange('productsServices', formatProductsServices(newPs));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-4">
                          <button
                            onClick={handleSave}
                            className="px-4 py-2.5 bg-[#f02d9c] text-white font-medium rounded-lg hover:bg-[#f02d9c] active:bg-[#e02890] flex items-center gap-1"
                          >
                            <CheckCircle size={16} /> Simpan
                          </button>
                          <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2.5 bg-white text-[#f02d9c] font-medium rounded-lg border border-[#f02d9c] hover:bg-[#fdf6f0] flex items-center gap-1"
                          >
                            <Edit3 size={16} /> {isEditing ? 'Selesai Edit' : 'Edit'}
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/${projectId}`)}
                            className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-1"
                          >
                            <ChevronLeft size={16} /> Prev
                          </button>
                          <Link
                            href={`/dashboard/${projectId}/plan/level_2_rww`}
                            className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg hover:bg-[#7abfc0] flex items-center gap-1"
                          >
                            Next <ChevronRight size={16} />
                          </Link>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Column: Edukasi */}
                  <div className="space-y-5">
                    {/* Progress Bar sebagai Card */}
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

                    {/* Achievements */}
                    <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Award size={16} className="text-[#f02d9c]" />
                        <span className="font-bold text-[#5b5b5b]">Pencapaian</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 bg-[#f02d9c] text-white px-3 py-1.5 rounded-full text-xs font-bold">
                          <Lightbulb size={12} /> {planLevels.find((p) => p._id === levelId)?.xp || 0} XP
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#8acfd1] text-[#0a5f61] px-3 py-1.5 rounded-full text-xs font-bold">
                          <Award size={12} /> {planLevels.find((p) => p._id === levelId)?.badge || ''}
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-[#5b5b5b]">
                        Kumpulkan XP & badge untuk naik pangkat dari Zero ke CEO!
                      </p>
                    </div>

                    {/* Instructions */}
                    <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen size={16} className="text-[#f02d9c]" />
                        <span className="font-bold text-[#5b5b5b]">Petunjuk</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          'Isi minat/bidang (misal: kuliner)',
                          'Klik “Generate” untuk dapat 3 ide',
                          'Pilih salah satu ide yang paling menarik',
                          'Tinjau atau edit detail produk & pelanggan',
                          'Klik “Simpan” untuk lanjut ke Level 2',
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
                          <Lightbulb size={12} /> Tujuan: Temukan ide yang relevan & layak
                        </div>
                        <div className="px-2.5 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center gap-1">
                          <Award size={12} /> Tips: Fokus pada satu pelanggan dulu
                        </div>
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
                            href="https://www.strategyzer.com/canvas/value-proposition-canvas"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                          >
                            Strategyzer VPC Guide
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://miro.com/templates/value-proposition-canvas/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
                          >
                            Miro VPC Template
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
        xpGained={notificationData.xpGained}
        badgeName={notificationData.badgeName}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}