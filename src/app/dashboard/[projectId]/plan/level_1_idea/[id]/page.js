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
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import useProjectStore from '@/store/useProjectStore';
import useAuthStore from '@/store/useAuthStore';
import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';
import PlanProgressCard from '@/components/PlanProgressCard';
import AchievementCard from '@/components/AchievementCard';
import InstructionCard from '@/components/InstructionCard';
import ResourceCard from '@/components/ResourceCard';
import NotificationModalPlan from '@/components/NotificationModalPlan';
import Confetti from '@/components/Confetti';
import useBusinessIdeaStore from '@/store/useBusinessIdeaStore';
import generateBusinessIdea from '@/ai/flows/generateDetailBusinessIdea';

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

let baseIdeas = []

// === GENERATOR IDE (DIPERBAIKI) ===
  const generateThreeIdeasFromInterest = async (interest) => {
    const generated = await generateBusinessIdea({interest});
    baseIdeas = generated;
    return baseIdeas
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
  const { id, projectId } = useParams();
  const router = useRouter();
  const { isAuthenticated, loadSession, isHydrated } = useAuthStore();
  const { businessIdea, updateBusinessIdea, getBusinessIdea } = useBusinessIdeaStore();
  const { planLevels, updateLevelStatus } = useProjectStore();

  const [interest, setInterest] = useState('');
  const [vpcData, setVpcData] = useState({
    customerSegments: '',
    problem: '',
    solution: '',
    productsServices: [],
    painRelievers: '',
    gainCreators: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notificationData, setNotificationData] = useState({
    message: '',
    xpGained: 0,
    badgeName: '',
  });

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  useEffect(() => {
    if (id) {
      getBusinessIdea(id);
    }
  }, [id]);

  useEffect(() => {
    if (id && businessIdea?.data) {
      const data = businessIdea.data;
      let productsServices = Array.isArray(data.productsServices) ? data.productsServices : [];
      setVpcData({
        customerSegments: data.customerSegments || '',
        problem: data.problem || '',
        solution: data.solution || '',
        productsServices,
        painRelievers: data.painRelievers || '',
        gainCreators: data.gainCreators || '',
      });
      setInterest(data.interest || '');
      setSelectedIdea(data.interest || 'saved');
      setIsEditing(false);
    }
  }, [id, businessIdea]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null;

  const currentXp = planLevels.filter(l => l.completed).reduce((acc, l) => acc + (l.xp || 0), 0);
  const totalXp = planLevels.reduce((acc, l) => acc + (l.xp || 0), 0);

  // Handlers
  const handleGenerate = async () => {
    if (!interest.trim()) {
      alert('Silakan isi minat/bidang Anda terlebih dahulu.');
      return;
    }
    const ideas = await generateThreeIdeasFromInterest(interest);
    setGeneratedIdeas(ideas);
    setSelectedIdea(null);
    setVpcData({
      customerSegments: '',
      problem: '',
      solution: '',
      productsServices: [],
      painRelievers: '',
      gainCreators: '',
    });
    setIsEditing(false);
  };

  const handleSelectIdea = (idea) => {
    setSelectedIdea(idea.interest);
    setVpcData({
      customerSegments: idea.customerSegments,
      problem: idea.problem,
      solution: idea.solution,
      productsServices: idea.productsServices,
      painRelievers: idea.painRelievers,
      gainCreators: idea.gainCreators,
    });
    setIsFinanceOpen(false);
    setIsEditing(false);
  };

  const handleVpcChange = (field, value) => {
    setVpcData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!selectedIdea) {
      alert('Pilih salah satu ide produk terlebih dahulu.');
      return;
    }
    const payload = {
      id: 1,
      completed: true,
      interest: selectedIdea,
      customerSegments: vpcData.customerSegments,
      problem: vpcData.problem,
      solution: vpcData.solution,
      productsServices: vpcData.productsServices,
      painRelievers: vpcData.painRelievers,
      gainCreators: vpcData.gainCreators,
    };
    await updateBusinessIdea(id, payload);
    await updateLevelStatus(planLevels[0]._id, { completed: true });
    setShowConfetti(true);
    setNotificationData({
      message: 'Ide berhasil disimpan!',
      xpGained: planLevels[0].xp,
      badgeName: planLevels[0].badge,
    });
    setShowNotification(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // ✅ Cek apakah sudah ada data tersimpan & sudah complete → tampilkan VPC langsung
  const hasSavedVpc = businessIdea?.data?.completed === true;
  const shouldShowVpc = selectedIdea || hasSavedVpc;

  return (
    <div className="min-h-screen bg-white font-sans">
      {showConfetti && <Confetti />}
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
          <h1 className="ml-2 font-bold text-[#5b5b5b] text-base">Level 1: Ide Generator</h1>
        </header>
      )}
      <div className="flex">
        <PlanSidebar
          projectId={projectId}
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
                  <div>
                    {/* Tampilkan form hanya jika belum ada VPC yang disimpan */}
                    {!shouldShowVpc && (
                      <>
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
                        {generatedIdeas.length > 0 && (
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
                                    {idea.productsServices?.[0]?.title || '-'}
                                  </div>
                                  <div className="text-xs text-[#5b5b5b] mt-1">
                                    {idea.productsServices?.[0]?.keunggulan_unik || '-'}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Tampilkan VPC jika sudah dipilih atau disimpan */}
                    {shouldShowVpc && (
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
                                  <span className="font-medium">Siapa yang kamu bantu?</span> {vpcData.customerSegments || '-'}
                                </li>
                                <li>
                                  <span className="font-medium">Apa masalahnya?</span> {vpcData.problem || '-'}
                                </li>
                                <li>
                                  <span className="font-medium">Apa yang dia pengin banget dapet?</span> {vpcData.solution || '-'}
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
                                  <span className="font-medium">Apa yang kamu jual?</span> {vpcData.productsServices?.[0]?.title || '-'}
                                </li>
                                {vpcData.productsServices?.[0]?.jenis && <li><span className="font-medium">Jenis:</span> {vpcData.productsServices?.[0]?.jenis}</li>}
                                {vpcData.productsServices?.[0]?.deskripsi && <li><span className="font-medium">Deskripsi:</span> {vpcData.productsServices?.[0]?.deskripsi}</li>}
                                {vpcData.productsServices?.[0]?.fitur_utama && <li><span className="font-medium">Fitur utama:</span> {vpcData.productsServices?.[0]?.fitur_utama}</li>}
                                {vpcData.productsServices?.[0]?.manfaat && <li><span className="font-medium">Manfaat:</span> {vpcData.productsServices?.[0]?.manfaat}</li>}
                                {vpcData.productsServices?.[0]?.harga && <li><span className="font-medium">Harga:</span> {vpcData.productsServices?.[0]?.harga}</li>}
                              </ul>
                              {vpcData.productsServices?.[0]?.keunggulan_unik && (
                                <div className="mt-3 pt-2 border-t border-[#e0f0f0]">
                                  <p className="font-medium text-[#0a5f61] text-sm">Apa yang bikin kamu beda?</p>
                                  <p className="text-[15px] text-[#5b5b5b] mt-1">
                                    {vpcData.productsServices?.[0]?.keunggulan_unik}
                                  </p>
                                </div>
                              )}
                              {vpcData.productsServices?.[0]?.angka_penting && (
                                <div className="mt-3 pt-2 border-t border-[#e0f0f0]">
                                  <p className="font-medium text-[#0a5f61] text-sm">Apa yang mau kamu ukur?</p>
                                  <div className="mt-1 flex flex-wrap gap-1.5">
                                    {(vpcData.productsServices?.[0]?.angka_penting || '')
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
                              {vpcData.productsServices?.[0]?.cara_jualan && (
                                <div className="mt-3 pt-2 border-t border-[#e0f0f0]">
                                  <p className="font-medium text-[#0a5f61] text-sm">Di mana kamu jualan?</p>
                                  <div className="mt-1 flex flex-wrap gap-1.5">
                                    {(vpcData.productsServices?.[0]?.cara_jualan || '')
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
                                    {vpcData.productsServices?.[0]?.biaya_modal && (
                                      <div className="mb-2">
                                        <p className="font-medium">Modal Awal:</p>
                                        <p>{vpcData.productsServices?.[0]?.biaya_modal}</p>
                                        <ul className="list-disc pl-4 mt-1 text-[14px]">
                                          {parseModalDetails(vpcData.productsServices?.[0]?.biaya_modal).map((item, i) => (
                                            <li key={i}>{item}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {vpcData.productsServices?.[0]?.biaya_bahan_baku && (
                                      <div className="mb-2">
                                        <p className="font-medium">Biaya Bahan Baku:</p>
                                        <p>{vpcData.productsServices?.[0]?.biaya_bahan_baku}</p>
                                        <ul className="list-disc pl-4 mt-1 text-[14px]">
                                          {parseBahanBakuDetails(vpcData.productsServices?.[0]?.biaya_bahan_baku).map((item, i) => (
                                            <li key={i}>{item}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {vpcData.productsServices?.[0]?.harga_jual && (
                                      <p className="font-medium">Harga Jual: {vpcData.productsServices?.[0]?.harga_jual}</p>
                                    )}
                                    {vpcData.productsServices?.[0]?.margin && (
                                      <p className="font-medium">Margin: {vpcData.productsServices?.[0]?.margin}</p>
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
                                    value={vpcData.customerSegments}
                                    onChange={(e) => handleVpcChange('customerSegments', e.target.value)}
                                    className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                    rows="2"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Apa masalahnya?</label>
                                  <textarea
                                    value={vpcData.problem}
                                    onChange={(e) => handleVpcChange('problem', e.target.value)}
                                    className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                    rows="2"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-[#5b5b5b] mb-1">
                                    Apa yang dia pengin banget dapet?
                                  </label>
                                  <textarea
                                    value={vpcData.solution}
                                    onChange={(e) => handleVpcChange('solution', e.target.value)}
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
                                    value={vpcData.productsServices?.[0]?.title || ''}
                                    onChange={(e) => {
                                      const current = vpcData.productsServices?.[0] || {};
                                      const updated = { ...current, title: e.target.value };
                                      handleVpcChange('productsServices', [updated]);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Jenis Produk"
                                    value={vpcData.productsServices?.[0]?.jenis || ''}
                                    onChange={(e) => {
                                      const current = vpcData.productsServices?.[0] || {};
                                      const updated = { ...current, jenis: e.target.value };
                                      handleVpcChange('productsServices', [updated]);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <textarea
                                    placeholder="Deskripsi"
                                    value={vpcData.productsServices?.[0]?.deskripsi || ''}
                                    onChange={(e) => {
                                      const current = vpcData.productsServices?.[0] || {};
                                      const updated = { ...current, deskripsi: e.target.value };
                                      handleVpcChange('productsServices', [updated]);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    rows="2"
                                  />
                                  <textarea
                                    placeholder="Fitur Utama"
                                    value={vpcData.productsServices?.[0]?.fitur_utama || ''}
                                    onChange={(e) => {
                                      const current = vpcData.productsServices?.[0] || {};
                                      const updated = { ...current, fitur_utama: e.target.value };
                                      handleVpcChange('productsServices', [updated]);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    rows="2"
                                  />
                                  <textarea
                                    placeholder="Manfaat"
                                    value={vpcData.productsServices?.[0]?.manfaat || ''}
                                    onChange={(e) => {
                                      const current = vpcData.productsServices?.[0] || {};
                                      const updated = { ...current, manfaat: e.target.value };
                                      handleVpcChange('productsServices', [updated]);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    rows="2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Harga (contoh: Rp25.000/cup)"
                                    value={vpcData.productsServices?.[0]?.harga || ''}
                                    onChange={(e) => {
                                      const current = vpcData.productsServices?.[0] || {};
                                      const updated = { ...current, harga: e.target.value };
                                      handleVpcChange('productsServices', [updated]);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Keunggulan Unik"
                                    value={vpcData.productsServices?.[0]?.keunggulan_unik || ''}
                                    onChange={(e) => {
                                      const current = vpcData.productsServices?.[0] || {};
                                      const updated = { ...current, keunggulan_unik: e.target.value };
                                      handleVpcChange('productsServices', [updated]);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Angka Penting (pisahkan dengan koma)"
                                    value={vpcData.productsServices?.[0]?.angka_penting || ''}
                                    onChange={(e) => {
                                      const current = vpcData.productsServices?.[0] || {};
                                      const updated = { ...current, angka_penting: e.target.value };
                                      handleVpcChange('productsServices', [updated]);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Cara Jualan (pisahkan dengan koma)"
                                    value={vpcData.productsServices?.[0]?.cara_jualan || ''}
                                    onChange={(e) => {
                                      const current = vpcData.productsServices?.[0] || {};
                                      const updated = { ...current, cara_jualan: e.target.value };
                                      handleVpcChange('productsServices', [updated]);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Biaya Modal (contoh: Rp10.000)"
                                    value={vpcData.productsServices?.[0]?.biaya_modal || ''}
                                    onChange={(e) => {
                                      const current = vpcData.productsServices?.[0] || {};
                                      const updated = { ...current, biaya_modal: e.target.value };
                                      handleVpcChange('productsServices', [updated]);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <textarea
                                    placeholder="Biaya Bahan Baku"
                                    value={vpcData.productsServices?.[0]?.biaya_bahan_baku || ''}
                                    onChange={(e) => {
                                      const current = vpcData.productsServices?.[0] || {};
                                      const updated = { ...current, biaya_bahan_baku: e.target.value };
                                      handleVpcChange('productsServices', [updated]);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    rows="2"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Harga Jual (contoh: Rp25.000/cup)"
                                    value={vpcData.productsServices?.[0]?.harga_jual || ''}
                                    onChange={(e) => {
                                      const current = vpcData.productsServices?.[0] || {};
                                      const updated = { ...current, harga_jual: e.target.value };
                                      handleVpcChange('productsServices', [updated]);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Margin (contoh: ±68%)"
                                    value={vpcData.productsServices?.[0]?.margin || ''}
                                    onChange={(e) => {
                                      const current = vpcData.productsServices?.[0] || {};
                                      const updated = { ...current, margin: e.target.value };
                                      handleVpcChange('productsServices', [updated]);
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
                            onClick={() => router.push(`/dashboard/${projectId}`)}
                            className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-1"
                          >
                            <ChevronLeft size={16} /> Prev
                          </button>
                          <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2.5 bg-white text-[#f02d9c] font-medium rounded-lg border border-[#f02d9c] hover:bg-[#fdf6f0] flex items-center gap-1"
                          >
                            <Edit3 size={16} /> {isEditing ? 'Selesai Edit' : 'Edit'}
                          </button>
                          <button
                            onClick={handleSave}
                            className="px-4 py-2.5 bg-[#f02d9c] text-white font-medium rounded-lg hover:bg-[#f02d9c] active:bg-[#e02890] flex items-center gap-1"
                          >
                            <CheckCircle size={16} /> Simpan
                          </button>
                          {/* ✅ Tombol Next hanya aktif jika planLevels[0].completed === true */}
                          {planLevels?.[0]?.completed ? (
                            <Link
                              href={`/dashboard/${projectId}/plan/level_2_rww/${nextPrevLevel(2)}`}
                              className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg hover:bg-[#7abfc0] flex items-center gap-1"
                            >
                              Next <ChevronRight size={16} />
                            </Link>
                          ) : (
                            <button
                              disabled
                              className="px-4 py-2.5 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed"
                            >
                              Next
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="space-y-5">
                    <PlanProgressCard currentXp={currentXp} totalXp={totalXp} />
                    <AchievementCard levelData={planLevels?.[0]} />
                    <InstructionCard />
                    <ResourceCard />
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