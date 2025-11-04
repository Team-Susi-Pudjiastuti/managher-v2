'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import useProjectStore from '@/store/useProjectStore';
import Link from 'next/link';
import {
  Lightbulb,
  CheckCircle,
  Palette,
  FileText,
  Box,
  Users,
  Rocket,
  Package,
  User,
  ShoppingBag,
  BarChart3,
  TrendingUp,
  Upload,
  Edit2,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
} from 'lucide-react';

export default function BusinessProfilePage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const projects = useProjectStore((state) => state.projects);
  const updateProject = useProjectStore((state) => state.updateProject);

  const fileInputRef = useRef(null);
  const bgInputRef = useRef(null);

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    description: '',
    linkedin: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    profileImage: '',
    backgroundImage: '',
  });

  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    if (projectId) {
      const found = projects.find((p) => p.id === projectId);
      setProject(found);
      if (found) {
        const profile = found.businessProfile || {};
        const jenisProyek = found.levels?.[0]?.data?.productType || 'Belum diisi';
        setFormData({
          businessName: profile.businessName || found.name || '',
          businessType: profile.businessType || jenisProyek,
          description: profile.description || '',
          linkedin: profile.linkedin || '',
          whatsapp: profile.whatsapp || '',
          instagram: profile.instagram || '',
          facebook: profile.facebook || '',
          profileImage: profile.profileImage || '',
          backgroundImage: profile.backgroundImage || '',
        });
      }
    }
  }, [projectId, projects]);

  if (!projectId) {
    return <div className="p-4 text-center">ID proyek tidak valid</div>;
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center font-[Poppins] bg-white">
        Memuat profil bisnis...
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result }));
        updateProject(projectId, {
          businessProfile: { ...formData, [field]: reader.result },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProject(projectId, { businessProfile: formData });
    setEditingSection(null);
    alert('Profil bisnis berhasil disimpan! ✨');
  };

  const toggleEdit = (section) => {
    setEditingSection(editingSection === section ? null : section);
  };

  // === PORTFOLIO DARI LEVEL ===
  const completedLevels = project.levels?.filter(l => l?.completed) || [];

  const getLevelIcon = (id) => {
    const icons = {
      1: Lightbulb,
      2: CheckCircle,
      3: Palette,
      4: FileText,
      5: Box,
      6: Users,
      7: Rocket,
      8: Package,
      9: User,
      10: ShoppingBag,
      11: BarChart3,
      12: TrendingUp,
    };
    return icons[id] || FileText;
  };

  const getLevelTitle = (id) => {
    const titles = {
      1: "Ide Generator",
      2: "RWW Analysist",
      3: "Brand Identity",
      4: "Lean Canvas",
      5: "MVP",
      6: "Beta Testing",
      7: "Persiapan Launching",
      8: "Product",
      9: "Customer",
      10: "Order",
      11: "Laba Rugi",
      12: "Scale Up",
    };
    return titles[id] || `Level ${id}`;
  };

  const getPhaseColor = (id) => {
    if (id <= 7) return 'bg-[#f02d9c]';
    if (id <= 11) return 'bg-[#8acfd1]';
    return 'bg-[#c5a8e0]';
  };

  const AssetCard = ({ title, iconBg, children, className = '' }) => (
    <div className={`relative mb-5 ${className}`}>
      <div className={`absolute inset-0 translate-x-1 translate-y-1 ${iconBg} rounded-2xl`}></div>
      <div
        className="relative bg-white rounded-2xl border-t border-l border-black p-4 sm:p-5"
        style={{ boxShadow: `2px 2px 0 0 ${iconBg.replace('bg-[', '').replace(']', '')}` }}
      >
        <h3 className="font-bold text-[#5b5b5b] text-base sm:text-lg mb-3">{title}</h3>
        {children}
      </div>
    </div>
  );

  const jenisProyek = formData.businessType || project.levels?.[0]?.data?.productType || 'Belum diisi';

  return (
    <div className="min-h-screen bg-white font-[Poppins] p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Background Image */}
        <div className="relative h-40 sm:h-48 rounded-2xl overflow-hidden mb-5 sm:mb-6">
          {formData.backgroundImage ? (
            <img
              src={formData.backgroundImage}
              alt="Background"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-r from-[#f02d9c] to-[#8acfd1]"></div>
          )}
          <button
            onClick={() => bgInputRef.current?.click()}
            className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/80 hover:bg-white rounded-full p-1.5 sm:p-2 shadow"
            aria-label="Upload background"
          >
            <Upload size={14} className="sm:size-4" />
          </button>
          <input
            type="file"
            ref={bgInputRef}
            onChange={(e) => handleFileChange(e, 'backgroundImage')}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Avatar + Info Proyek */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Foto Profil */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#fbe2a7] flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl">👤</span>
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-white rounded-full p-1 sm:p-1.5 shadow"
              aria-label="Upload foto profil"
            >
              <Upload size={12} className="sm:size-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e, 'profileImage')}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Nama Proyek & Jenis Proyek */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-[#5b5b5b]">{formData.businessName}</h1>
              <button
                onClick={() => toggleEdit('name-type')}
                className="text-[#f02d9c] hover:text-[#d7488e]"
                title="Edit nama dan jenis bisnis"
                aria-label="Edit"
              >
                <Edit2 size={14} className="sm:size-4" />
              </button>
            </div>
            <p className="text-[#7a7a7a] text-sm sm:text-base">Jenis: {jenisProyek}</p>
            <p className="text-[#7a7a7a] text-xs sm:text-sm">Profil Bisnis • ManagHer</p>
          </div>
        </div>

        {/* === EDIT NAMA & JENIS BISNIS === */}
        {editingSection === 'name-type' && (
          <AssetCard title="Edit Nama & Jenis Bisnis" iconBg="bg-[#fbe2a7]">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Nama bisnis"
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f02d9c] text-[#5b5b5b] text-sm"
              />
              <input
                type="text"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                placeholder="Jenis bisnis (misal: Kuliner, Fashion, Jasa)"
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f02d9c] text-[#5b5b5b] text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#f02d9c] text-white rounded-lg text-sm hover:bg-[#d7488e]"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                >
                  Batal
                </button>
              </div>
            </form>
          </AssetCard>
        )}

        {/* === SECTION: ABOUT === */}
        <AssetCard title="Tentang Bisnis" iconBg="bg-[#fbe2a7]">
          <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
            <h4 className="font-semibold text-[#5b5b5b]">Deskripsi</h4>
            <button
              onClick={() => toggleEdit('about')}
              className="flex items-center gap-1 text-sm text-[#f02d9c] hover:text-[#d7488e]"
            >
              <Edit2 size={14} /> Edit
            </button>
          </div>

          {editingSection === 'about' ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ceritakan tentang bisnismu..."
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f02d9c] text-[#5b5b5b] text-sm"
                rows="4"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#f02d9c] text-white rounded-lg text-sm hover:bg-[#d7488e]"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <p className="text-[#7a7a7a] whitespace-pre-wrap text-sm">
              {formData.description || 'Belum ada deskripsi. Klik "Edit" untuk menambahkan.'}
            </p>
          )}
        </AssetCard>

        {/* === SECTION: CONTACT === */}
        <AssetCard title="Kontak & Media Sosial" iconBg="bg-[#8acfd1]">
          <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
            <h4 className="font-semibold text-[#5b5b5b]">Informasi Kontak</h4>
            <button
              onClick={() => toggleEdit('contact')}
              className="flex items-center gap-1 text-sm text-[#f02d9c] hover:text-[#d7488e]"
            >
              <Edit2 size={14} /> Edit
            </button>
          </div>

          {editingSection === 'contact' ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-3">
                {[
                  { icon: Phone, name: 'whatsapp', label: 'WhatsApp', type: 'tel', placeholder: '081234567890' },
                  { icon: Linkedin, name: 'linkedin', label: 'LinkedIn', type: 'url', placeholder: 'https://linkedin.com/in/...' },
                  { icon: Instagram, name: 'instagram', label: 'Instagram', type: 'text', placeholder: '@username' },
                  { icon: Facebook, name: 'facebook', label: 'Facebook', type: 'url', placeholder: 'https://facebook.com/...' },
                ].map(({ icon: Icon, name, label, type, placeholder }) => (
                  <div key={name} className="flex items-start gap-2 sm:gap-3">
                    <Icon size={16} className="text-[#0a5f61] mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <label className="block text-[#5b5b5b] text-xs sm:text-sm mb-1">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-lg text-[#5b5b5b] text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#f02d9c] text-white rounded-lg text-sm hover:bg-[#d7488e]"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2.5">
              {[
                { icon: Phone, value: formData.whatsapp },
                { icon: Linkedin, value: formData.linkedin },
                { icon: Instagram, value: formData.instagram },
                { icon: Facebook, value: formData.facebook },
              ].map(({ icon: Icon, value }, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Icon size={16} className="text-[#7a7a7a] shrink-0" />
                  <span className="text-[#7a7a7a] text-sm wrap-break-word">{value || '—'}</span>
                </div>
              ))}
            </div>
          )}
        </AssetCard>

        {/* === SECTION: ASSET DOKUMEN === */}
        <AssetCard title="Asset Dokumen" iconBg="bg-[#c5a8e0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {['Plan', 'Sell', 'Scale Up'].map((phase) => (
              <div
                key={phase}
                className="border border-dashed border-[#c5a8e0] rounded-xl p-3 sm:p-4 text-center hover:bg-[#f9f5ff] transition cursor-pointer"
                onClick={() => alert(`Fitur upload dokumen ${phase} akan segera hadir!`)}
              >
                <Upload size={18} className="mx-auto text-[#c5a8e0] mb-1.5" />
                <h5 className="font-semibold text-[#5b5b5b] text-sm sm:text-base mb-1">{phase}</h5>
                <p className="text-[#7a7a7a] text-xs sm:text-sm">Unggah dokumen</p>
              </div>
            ))}
          </div>
        </AssetCard>

        {/* === PORTFOLIO === */}
        {completedLevels.length > 0 && (
          <AssetCard title="Portfolio Bisnis" iconBg="bg-[#f02d9c]">
            <div className="space-y-2.5">
              {completedLevels.map((level) => {
                const Icon = getLevelIcon(level.id);
                const phaseColor = getPhaseColor(level.id);
                return (
                  <div key={level.id} className="flex items-start gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${phaseColor} flex items-center justify-center`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#5b5b5b] text-sm sm:text-base">{getLevelTitle(level.id)}</h4>
                      <p className="text-[#7a7a7a] text-xs sm:text-sm mt-0.5">
                        {Object.keys(level.data || {}).length > 0
                          ? 'Dokumen tersedia'
                          : 'Data kosong'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </AssetCard>
        )}
      </div>
    </div>
  );
}