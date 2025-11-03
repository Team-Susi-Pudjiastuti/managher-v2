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
};

// === KOMPONEN UTAMA ===
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
  const [notificationData, setNotificationData] = useState({
    message: '',
    xpGained: 0,
    badgeName: '',
  });

  const businessIdeaId = id;
  const projectId = businessIdeas.project || '';
  const levelId = planLevels[0]?._id || '';

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

      setNotificationData({
        message: 'Ide berhasil disimpan!',
        xpGained: planLevels.find((p) => p._id === levelId)?.xp || 0,
        badgeName: planLevels.find((p) => p._id === levelId)?.badge || '',
      });
      setShowNotification(true);
    } catch (err) {
      console.error('Error saving business idea:', err);
      alert('Gagal menyimpan ide bisnis.');
    }
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
          businessIdeaId={businessIdeaId}
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


                    {/* Brand & Product Preview */}
                    {selectedIdea && !isEditing && (
                      <>
                        <div className="mb-5 p-4 border border-gray-300 rounded-xl bg-white shadow-sm">
                          <h3 className="font-bold text-[#5b5b5b] mb-3 flex items-center gap-2">
                            <Eye size={16} /> Pratinjau Produk & Brand
                          </h3>

                          {/* Profil Pelanggan */}
                          <div className="p-3 mb-3 bg-[#fdf6f0] rounded border border-[#f0d5c2]">
                            <h4 className="font-bold text-[#0a5f61] text-sm mb-2 flex items-center gap-1">
                              <Target size={14} /> Profil Pelanggan
                            </h4>
                            <ul className="text-xs text-[#5b5b5b] space-y-1">
                              <li><span className="font-medium">Tugas Pelanggan:</span> {businessIdeas.marketPotential || '-'}</li>
                              <li><span className="font-medium">Masalah/Masalah:</span> {businessIdeas.problemSolved || '-'}</li>
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
                              {ps.fitur && <li><span className="font-medium">Fitur Utama:</span> {ps.fitur}</li>}
                              {ps.manfaat && <li><span className="font-medium">Manfaat:</span> {ps.manfaat}</li>}
                              {ps.harga && <li><span className="font-medium">Harga:</span> {ps.harga}</li>}
                            </ul>

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
                                    <p className="font-medium">Harga Jual: {ps.hargaJual.replace('Harga Jual: ', '')}</p>
                                  )}
                                  {ps.margin && (
                                    <p className="font-medium">Margin: {ps.margin.replace('Margin: ', '')}</p>
                                  )}
                                </div>
                              )}
                            </div>
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
                      </>
                    )}

                    {/* Mode Edit */}
                    {selectedIdea && isEditing && (
                      <div className="space-y-4">
                        <div className="border border-gray-300 rounded-xl p-4 bg-[#fdf6f0]">
                          <h3 className="font-bold text-[#0a5f61] mb-3 flex items-center gap-2">
                            <Target size={16} /> Profil Pelanggan
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Tugas Pelanggan</label>
                              <textarea
                                value={businessIdeas.marketPotential}
                                onChange={(e) => handleVpcChange('idea', e.target.value)}
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                rows="2"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Masalah/Masalah</label>
                              <textarea
                                value={businessIdeas.problemSolved}
                                onChange={(e) => handleVpcChange('problemSolved', e.target.value)}
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                rows="2"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Keuntungan yang Diinginkan</label>
                              <textarea
                                value={businessIdeas.solutionOffered}
                                onChange={(e) => handleVpcChange('solutionOffered', e.target.value)}
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                rows="2"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border border-gray-300 rounded-xl p-4 bg-[#f0f9f9]">
                          <h3 className="font-bold text-[#f02d9c] mb-3 flex items-center gap-2">
                            <Zap size={16} /> Nilai Produk
                          </h3>
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-[#5b5b5b] mb-2">Produk & Layanan</label>
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
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Solusi Masalah</label>
                              <textarea
                                value={businessIdeas.unfairAdvantage}
                                onChange={(e) => handleVpcChange('unfairAdvantage', e.target.value)}
                                className="w-full p-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#f02d9c]"
                                rows="3"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#5b5b5b] mb-1">Pencipta Keuntungan</label>
                              <textarea
                                value={businessIdeas.uniqueValueProposition}
                                onChange={(e) => handleVpcChange('uniqueValueProposition', e.target.value)}
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
                          <CheckCircle size={16} /> Simpan
                        </button>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="px-4 py-2.5 bg-white text-[#f02d9c] font-medium rounded-lg border border-[#f02d9c] hover:bg-[#fdf6f0] flex items-center gap-1"
                        >
                          <Edit3 size={16} /> {isEditing ? 'Simpan Edit' : 'Edit'}
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/${businessIdeaId}`)}
                          className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-1"
                        >
                          <ChevronLeft size={16} /> Prev
                        </button>
                        <Link
                          href={`/dashboard/${businessIdeaId}/plan/level_2_rww`}
                          className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg border border-black hover:bg-[#7abfc0] flex items-center gap-1"
                        >
                          Next <ChevronRight size={16} />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Kolom Kanan: Tujuan, Tips, Resources */}
                  <div className="space-y-5">
                    {/*  XP & Badge di atas kolom Tujuan */}
                    <div className="flex items-center gap-3 mb-3">
                    {/* XP */}
                      <div className="bg-[#f02d9c]/10 border border-[#f02d9c]/30 rounded-xl p-3 text-center hover:scale-[1.02] transition-transform">
                        <div className="flex items-center gap-1 bg-[#f02d9c] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                          <Lightbulb size={14} />
                          <span>+{planLevels.find((p) => p._id === levelId)?.xp || 0} XP</span>
                        </div>
                      </div>

                      {/* Badge */}
                      <div className="bg-[#f02d9c]/10 border border-[#f02d9c]/30 rounded-xl p-3 text-center hover:scale-[1.02] transition-transform">
                        <div className="flex items-center gap-1 bg-[#8acfd1] text-[#0a5f61] px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                          <Award size={14} />
                          <span>{planLevels.find((p) => p._id === levelId)?.badge || ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                      <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-2">
                        <Lightbulb size={16} /> Tujuan Level 1
                      </h3>
                      <ul className="text-sm text-[#5b5b5b] list-disc pl-5 space-y-1">
                        <li>Pilih ide produk yang relevan dengan minatmu</li>
                        <li>Definisikan siapa pelangganmu dan masalah yang mereka hadapi</li>
                        <li>Buat solusi yang benar-benar membantu mereka dan memberi keuntungan</li>
                        <li>Sertakan estimasi biaya & harga untuk memastikan ide kamu layak</li>
                      </ul>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-[#fdfdfd]">
                      <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-2">
                        <Award size={16} /> Tips dari Strategyzer & Miro
                      </h3>
                      <ul className="text-sm text-[#5b5b5b] list-disc pl-5 space-y-1">
                        <li>Fokus pada <strong>satu segmen pelanggan</strong> saja dulu</li>
                        <li>Pikirkan <strong>apa yang ingin diselesaikan</strong> oleh pelanggan (bukan hanya produk)</li>
                        <li>Pastikan <strong>solusi kamu benar-benar mengurangi masalah</strong> mereka</li>
                        <li><strong>Keuntungan yang kamu tawarkan</strong> harus membuat pelanggan senang</li>
                        <li>Sertakan <strong>struktur biaya & harga</strong> sejak awal agar kamu tahu apakah bisnisnya bisa untung</li>
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

      {/*  Modal Notifikasi */}
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