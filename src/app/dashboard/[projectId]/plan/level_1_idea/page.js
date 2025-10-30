'use client';
import { useState, useEffect } from 'react';
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
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import useProjectStore from '@/store/useProjectStore';
import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';

// === HELPER: Parse & Format Products & Services ===
const parseProductsServices = (text) => {
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
    margin = '';
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
  };
};

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
  return parts.join('\n');
};

// === GENERATOR IDE DENGAN RINCIAN BIAYA ===
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
        'Margin: ±40%',
      painRelievers:
        'Dikirim setiap Senin pagi → tidak perlu belanja\nSiap saji dalam 5 menit → tidak perlu masak\nBisa atur alergi/makanan pantangan → aman untuk anak',
      gainCreators: 'Hemat 10 jam/minggu\nAnak-anak lebih sehat\nTidak perlu mikir menu\nHarga: Rp299.000/minggu (5 menu)',
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
        'Margin: ±60% setelah skala',
      painRelievers:
        'Sewa mulai Rp149rb → jauh lebih murah daripada beli\nGratis pengiriman & pengembalian\nBisa coba virtual via AR → minim risiko salah pilih',
      gainCreators: 'Tampil fresh di setiap acara tanpa beli baru\nHemat hingga 70% dibanding beli\nRamah lingkungan\nHarga: Rp149.000/3 hari',
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
        'Margin: ±95%',
      painRelievers:
        'Cukup 10 menit/hari → tidak mengganggu jadwal\nGrup WhatsApp eksklusif dengan mentor → responsif\nTidak perlu laptop → bisa pakai HP orang tua',
      gainCreators: 'Anak belajar mandiri tanpa perlu dampingan\nBiaya terjangkau\nDapat sertifikat digital\nHarga: Rp99.000/program',
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
        'Margin: ±80% setelah 500 pengguna aktif',
      painRelievers:
        'Cukup ucapkan: “Hari ini jual 50 kopi, modal 200rb” → otomatis jadi laporan\nBackup otomatis ke cloud\nNotifikasi saat stok hampir habis',
      gainCreators: 'Tidak perlu bisa baca/tulis lancar\nLaporan harian & mingguan otomatis\nSiap untuk laporan pajak\nHarga: Rp49.000/bulan',
    },
  ];
  const normalized = interest.toLowerCase().trim();
  const matched = baseIdeas.find(
    (idea) =>
      idea.interest.toLowerCase().includes(normalized) || normalized.includes(idea.interest.toLowerCase())
  );
  const others = baseIdeas.filter((i) => i !== matched);
  const randomOthers = others.sort(() => 0.5 - Math.random()).slice(0, 2);
  const result = matched ? [matched, ...randomOthers] : baseIdeas.sort(() => 0.5 - Math.random()).slice(0, 3);
  return result;
};

// === KOMPONEN PENJELASAN VPC ===
const VpcExplanation = () => {
  return (
    <div className="mb-5 p-4 border border-gray-300 rounded-xl bg-[#f8fafc] shadow-sm">
      <h3 className="font-bold text-[#0a5f61] mb-3 flex items-center gap-2">
        <Info size={16} /> Apa itu Value Proposition Canvas (VPC)?
      </h3>
      <p className="text-xs text-[#5b5b5b] mb-3">
        VPC adalah alat strategis dari <strong>Strategyzer</strong> dan <strong>Miro</strong> untuk memastikan produk Anda
        benar-benar dibutuhkan pelanggan.
      </p>
      <div className="space-y-3 text-xs text-[#5b5b5b]">
        <div>
          <span className="font-bold text-[#f02d9c]">Customer Profile</span> menjawab:
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>
              <strong>Customer Jobs:</strong> Tugas utama yang ingin diselesaikan pelanggan.
            </li>
            <li>
              <strong>Pains:</strong> Masalah/frustrasi yang mereka alami saat menyelesaikan tugas tersebut.
            </li>
            <li>
              <strong>Gains:</strong> Hasil positif yang mereka harapkan.
            </li>
          </ul>
        </div>
        <div>
          <span className="font-bold text-[#f02d9c]">Value Map</span> menjawab:
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>
              <strong>Products & Services:</strong> Apa yang Anda tawarkan.
            </li>
            <li>
              <strong>Pain Relievers:</strong> Cara produk Anda mengurangi <em>Pains</em>.
            </li>
            <li>
              <strong>Gain Creators:</strong> Cara produk Anda menciptakan <em>Gains</em>.
            </li>
          </ul>
        </div>
        <p className="mt-2">
          Tujuan akhir: <strong>mencapai Product-Market Fit</strong> — produk Anda benar-benar cocok dengan kebutuhan
          pasar.
        </p>
      </div>
    </div>
  );
};

// === KOMPONEN UTAMA ===
export default function Level1Page() {
  const { projectId } = useParams();
  const router = useRouter();
  const projects = useProjectStore((state) => state.projects);
  const updateProject = useProjectStore((state) => state.updateProject);
  const [interest, setInterest] = useState('');
  const [vpcData, setVpcData] = useState({
    customerJobs: '',
    pains: '',
    gains: '',
    productsServices: '',
    painRelievers: '',
    gainCreators: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [project, setProject] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false); // <-- State untuk dropdown keuangan

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (projectId) {
      const found = projects.find((p) => p.id === projectId);
      setProject(found);
      if (found?.levels?.[0]?.data) {
        const data = found.levels[0].data;
        setInterest(data.interest || '');
        setVpcData({
          customerJobs: data.customerJobs || '',
          pains: data.pains || '',
          gains: data.gains || '',
          productsServices: data.productsServices || '',
          painRelievers: data.painRelievers || '',
          gainCreators: data.gainCreators || '',
        });
        setSelectedIdea(data.interest || 'saved');
        setIsEditing(false);
      }
    }
  }, [projectId, projects]);

  const handleGenerate = () => {
    if (!interest.trim()) {
      alert('Silakan isi minat/bidang Anda terlebih dahulu.');
      return;
    }
    const ideas = generateThreeIdeasFromInterest(interest);
    setGeneratedIdeas(ideas);
    setSelectedIdea(null);
    setVpcData({
      customerJobs: '',
      pains: '',
      gains: '',
      productsServices: '',
      painRelievers: '',
      gainCreators: '',
    });
    setIsEditing(false);
  };

  const handleSelectIdea = (idea) => {
    setSelectedIdea(idea.interest);
    setVpcData({
      customerJobs: idea.customerJobs,
      pains: idea.pains,
      gains: idea.gains,
      productsServices: idea.productsServices,
      painRelievers: idea.painRelievers,
      gainCreators: idea.gainCreators,
    });
    setIsFinanceOpen(false); // reset dropdown saat ganti ide
    setIsEditing(false);
  };

  const handleVpcChange = (field, value) => {
    setVpcData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!selectedIdea) {
      alert('Pilih salah satu ide produk terlebih dahulu.');
      return;
    }
    const updatedLevels = [...(project?.levels || [])];
    updatedLevels[0] = {
      id: 1,
      completed: true,
      data: {
        interest: selectedIdea,
        ...vpcData,
      },
    };
    updateProject(projectId, { levels: updatedLevels });
    alert('VPC berhasil disimpan! ✅');
  };

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
    { label: 'Level 1: Ide Generator' },
  ];

  const ps = parseProductsServices(vpcData.productsServices);

  // Parsing rincian modal & biaya bahan baku untuk ditampilkan lebih rapi
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

  return (
    <div className="min-h-screen bg-white font-sans">
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
          <h1 className="ml-2 font-bold text-[#5b5b5b] text-base">Level 1: Ide Generator</h1>
        </header>
      )}
      <div className="flex mt-6">
        {/* Sidebar */}
        <PlanSidebar
          projectId={projectId}
          currentLevelId={1}
          isMobile={isMobile}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
        {/* Main Content */}
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
                    Level 1: Ide Generator
                  </h1>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Kolom Kiri: Input & Preview */}
                  <div>
                    {/* Input Minat */}
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
                          className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg border border-black hover:bg-[#7abfc0] whitespace-nowrap"
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                    {/* 3 Pilihan Ide */}
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
                    {/* Brand & Product Preview */}
                    {selectedIdea && !isEditing && (
                      <>
                        <div className="mb-5 p-4 border border-gray-300 rounded-xl bg-white shadow-sm">
                          <h3 className="font-bold text-[#5b5b5b] mb-3 flex items-center gap-2">
                            <Eye size={16} /> Brand & Product Preview
                          </h3>
                          {/* Product & Services */}
                          <div className="p-3 mb-3 bg-[#f0f9f9] rounded border border-[#c2e9e8]">
                            <h4 className="font-bold text-[#f02d9c] text-sm mb-2 flex items-center gap-1">
                              <Package size={14} /> Produk & Layanan
                            </h4>
                            <ul className="text-xs text-[#5b5b5b] space-y-1">
                              <li>
                                <span className="font-medium">Ide Produk:</span> {ps.ide || '-'}
                              </li>
                              {ps.jenis && (
                                <li>
                                  <span className="font-medium">Jenis:</span> {ps.jenis}
                                </li>
                              )}
                              {ps.deskripsi && (
                                <li>
                                  <span className="font-medium">Deskripsi:</span> {ps.deskripsi}
                                </li>
                              )}
                              {ps.fitur && (
                                <li>
                                  <span className="font-medium">Fitur Utama:</span> {ps.fitur}
                                </li>
                              )}
                              {ps.manfaat && (
                                <li>
                                  <span className="font-medium">Manfaat:</span> {ps.manfaat}
                                </li>
                              )}
                              {ps.harga && (
                                <li>
                                  <span className="font-medium">Harga:</span> {ps.harga}
                                </li>
                              )}
                            </ul>

                            {/* Dropdown Rincian Keuangan */}
                            <div className="mt-3">
                              <button
                                onClick={() => setIsFinanceOpen(!isFinanceOpen)}
                                className="flex items-center gap-1 text-xs font-medium text-[#f02d9c]"
                              >
                                {isFinanceOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                Lihat rincian keuangan
                              </button>
                              {isFinanceOpen && (
                                <div className="mt-2 p-3 bg-white border border-dashed border-[#c2e9e8] rounded text-xs text-[#5b5b5b]">
                                  <h5 className="font-bold text-[#0a5f61] mb-2">Rincian Keuangan</h5>
                                  {ps.biayaModal && (
                                    <div className="mb-2">
                                      <p className="font-medium">Modal Awal:</p>
                                      <p>{ps.biayaModal.replace('Biaya Modal: ', '')}</p>
                                      <ul className="list-disc pl-4 mt-1">
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
                                      <ul className="list-disc pl-4 mt-1">
                                        {parseBahanBakuDetails(ps.biayaBahanBaku).map((item, i) => (
                                          <li key={i}>{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {ps.hargaJual && (
                                    <p className="font-medium">
                                      Harga Jual: {ps.hargaJual.replace('Harga Jual: ', '')}
                                    </p>
                                  )}
                                  {ps.margin && (
                                    <p className="font-medium">Margin: {ps.margin.replace('Margin: ', '')}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Customer Profile */}
                          <div className="p-3 mb-3 bg-[#fdf6f0] rounded border border-[#f0d5c2]">
                            <h4 className="font-bold text-[#0a5f61] text-sm mb-2 flex items-center gap-1">
                              <Target size={14} /> Customer Profile
                            </h4>
                            <ul className="text-xs text-[#5b5b5b] space-y-1">
                              <li>
                                <span className="font-medium">Jobs:</span> {vpcData.customerJobs || '-'}
                              </li>
                              <li>
                                <span className="font-medium">Pains:</span> {vpcData.pains || '-'}
                              </li>
                              <li>
                                <span className="font-medium">Gains:</span> {vpcData.gains || '-'}
                              </li>
                            </ul>
                          </div>
                          {/* Value Map */}
                          <div className="p-3 bg-[#f0f9f9] rounded border border-[#c2e9e8]">
                            <h4 className="font-bold text-[#f02d9c] text-sm mb-2 flex items-center gap-1">
                              <Zap size={14} /> Value Map
                            </h4>
                            <ul className="text-xs text-[#5b5b5b] space-y-1">
                              <li>
                                <span className="font-medium">Pain Relievers:</span> {vpcData.painRelievers || '-'}
                              </li>
                              <li>
                                <span className="font-medium">Gain Creators:</span> {vpcData.gainCreators || '-'}
                              </li>
                            </ul>
                          </div>
                        </div>
                        {/* Penjelasan VPC */}
                        <VpcExplanation />
                      </>
                    )}
                    {/* Edit Mode */}
                    {selectedIdea && isEditing && (
                      <div className="space-y-4">
                        <div className="border border-gray-300 rounded-xl p-4 bg-[#fdf6f0]">
                          <h3 className="font-bold text-[#0a5f61] mb-3 flex items-center gap-2">
                            <Target size={16} /> Customer Profile
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Customer Jobs</label>
                              <textarea
                                value={vpcData.customerJobs}
                                onChange={(e) => handleVpcChange('customerJobs', e.target.value)}
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                rows="2"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Pains</label>
                              <textarea
                                value={vpcData.pains}
                                onChange={(e) => handleVpcChange('pains', e.target.value)}
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                rows="2"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Gains</label>
                              <textarea
                                value={vpcData.gains}
                                onChange={(e) => handleVpcChange('gains', e.target.value)}
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                rows="2"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="border border-gray-300 rounded-xl p-4 bg-[#f0f9f9]">
                          <h3 className="font-bold text-[#f02d9c] mb-3 flex items-center gap-2">
                            <Zap size={16} /> Value Map
                          </h3>
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-[#5b5b5b] mb-2">
                              Products & Services
                            </label>
                            <div className="space-y-2 text-xs">
                              <input
                                type="text"
                                placeholder="Ide Produk"
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
                                placeholder="Biaya Modal"
                                value={ps.biayaModal ? ps.biayaModal.replace('Biaya Modal: ', '') : ''}
                                onChange={(e) => {
                                  const newPs = { ...ps, biayaModal: e.target.value ? `Biaya Modal: ${e.target.value}` : '' };
                                  handleVpcChange('productsServices', formatProductsServices(newPs));
                                }}
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                              />
                              <textarea
                                placeholder="Biaya Bahan Baku (rincian bahan & biaya)"
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
                                placeholder="Margin (contoh: ±40%)"
                                value={ps.margin ? ps.margin.replace('Margin: ', '') : ''}
                                onChange={(e) => {
                                  const newPs = { ...ps, margin: e.target.value ? `Margin: ${e.target.value}` : '' };
                                  handleVpcChange('productsServices', formatProductsServices(newPs));
                                }}
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Pain Relievers</label>
                              <textarea
                                value={vpcData.painRelievers}
                                onChange={(e) => handleVpcChange('painRelievers', e.target.value)}
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                rows="3"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Gain Creators</label>
                              <textarea
                                value={vpcData.gainCreators}
                                onChange={(e) => handleVpcChange('gainCreators', e.target.value)}
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                rows="3"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Tombol Aksi */}
                    {selectedIdea && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          onClick={handleSave}
                          className="px-4 py-2.5 bg-[#f02d9c] text-white font-medium rounded-lg border border-black hover:bg-pink-600 flex items-center gap-1"
                        >
                          <CheckCircle size={16} />
                          Simpan
                        </button>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="px-4 py-2.5 bg-white text-[#f02d9c] font-medium rounded-lg border border-[#f02d9c] hover:bg-[#fdf6f0] flex items-center gap-1"
                        >
                          <Edit3 size={16} />
                          {isEditing ? 'Simpan Edit' : 'Edit'}
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/${projectId}`)}
                          className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-1"
                        >
                          <ChevronLeft size={16} />
                          Prev
                        </button>
                        <Link
                          href={`/dashboard/${projectId}/plan/level_2_rww`}
                          className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg border border-black hover:bg-[#7abfc0] flex items-center gap-1"
                        >
                          Next
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                    )}
                  </div>
                  {/* Kolom Kanan: Tujuan, Tips, Resources */}
                  <div className="space-y-5">
                    <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                      <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-2">
                        <Lightbulb size={16} />
                        Tujuan Level 1
                      </h3>
                      <ul className="text-sm text-[#5b5b5b] list-disc pl-5 space-y-1">
                        <li>Pilih ide produk yang relevan dengan minatmu</li>
                        <li>Definisikan Customer Profile & Value Map</li>
                        <li>Capai product-market fit sejak awal</li>
                        <li>Sertakan estimasi biaya & harga untuk validasi bisnis</li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                      <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-2">
                        <Award size={16} />
                        Tips dari Strategyzer & Miro
                      </h3>
                      <ul className="text-sm text-[#5b5b5b] list-disc pl-5 space-y-1">
                        <li>
                          Fokus pada <strong>satu segmen pelanggan</strong>
                        </li>
                        <li>
                          Gunakan <strong>Jobs-to-be-done</strong> sebagai dasar
                        </li>
                        <li>
                          Pastikan <strong>Pain Relievers</strong> benar-benar mengurangi rasa sakit
                        </li>
                        <li>
                          <strong>Gain Creators</strong> harus melebihi ekspektasi pelanggan
                        </li>
                        <li>
                          Sertakan <strong>struktur biaya & harga</strong> sejak dini untuk uji kelayakan
                        </li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                      <h3 className="font-bold text-[#0a5f61] mb-3 flex items-center gap-2">
                        <BookOpen size={16} /> Resources Validasi Ide
                      </h3>
                      <ul className="text-sm text-[#5b5b5b] space-y-2">
                        <li>
                          <a
                            href="https://www.strategyzer.com/canvas/value-proposition-canvas"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline flex items-center gap-1"
                          >
                            Strategyzer VPC Guide <ChevronRight size={12} />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://miro.com/templates/value-proposition-canvas/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline flex items-center gap-1"
                          >
                            Miro VPC Template <ChevronRight size={12} />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://perempuaninovasi.id/workshop"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f02d9c] hover:underline flex items-center gap-1"
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
    </div>
  );
}