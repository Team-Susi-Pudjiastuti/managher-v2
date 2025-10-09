'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useProjectStore from '@/store/useProjectStore';

// Tambahkan contact & social media
const STEPS = [
  { key: 'brandName', label: 'Nama Brand' },
  { key: 'logoUrl', label: 'Logo' },
  { key: 'tagline', label: 'Tagline' },
  { key: 'color', label: 'Warna' },
  { key: 'contact', label: 'Kontak (Email/No HP)' },
  { key: 'socialMedia', label: 'Sosial Media' },
];

const SIDEBAR_MENU = [
  { id: 'ide-bisnis', label: 'Ide bisnis', icon: '💡' },
  { id: 'pricing', label: 'Pricing', icon: '💰' },
  { id: 'brand', label: 'Brand Identity', icon: '🎨' },
  { id: 'validasi', label: 'Validasi', icon: '🔍' },
  { id: 'bmc', label: 'BMC', icon: '📊' },
];

const PLACEHOLDERS = {
  brandName: 'Contoh: NamaBrand',
  tagline: 'Contoh: Tagline brand Anda',
  color: 'Contoh: #FF5733 atau "Merah"',
  contact: 'Contoh: hello@namabrand.com / 0812-3456-7890',
  socialMedia: 'Contoh: @namabrand (Instagram, TikTok, dll)',
};

const STEP_COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#9b59b6', '#e67e22'];

export default function BrandPage({ params }) {
  const { projectId } = params;
  const router = useRouter();
  const { currentProject, setCurrentProject, getPhaseData, updatePhaseData, deletePhaseData } =
    useProjectStore();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    brandName: '',
    logoUrl: '',
    tagline: '',
    color: '',
    contact: '',
    socialMedia: '',
  });

  useEffect(() => {
    setCurrentProject(projectId);
    const saved = getPhaseData(projectId, 'brandIdentity') || {};
    setFormData({
      brandName: saved.brandName || '',
      logoUrl: saved.logoUrl || '',
      tagline: saved.tagline || '',
      color: saved.color || '',
      contact: saved.contact || '',
      socialMedia: saved.socialMedia || '',
    });
  }, [projectId, setCurrentProject, getPhaseData]);

  const currentStep = STEPS[currentStepIndex];
  const currentValue = formData[currentStep.key];

  const handleChange = (value) => {
    setFormData((prev) => ({ ...prev, [currentStep.key]: value }));
  };

  const handleSaveCurrent = () => {
    updatePhaseData(projectId, 'brandIdentity', {
      [currentStep.key]: currentValue,
    });
  };

  const handleNext = () => {
    if (currentStep.key === 'logoUrl') {
      handleSaveCurrent();
      if (currentStepIndex < STEPS.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
      return;
    }

    if (!currentValue.trim()) {
      alert('Harap isi field terlebih dahulu.');
      return;
    }
    handleSaveCurrent();
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      handleSaveCurrent();
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleFinish = () => {
    // Wajib: brandName, tagline, color
    if (!formData.brandName.trim()) {
      alert('Nama brand wajib diisi.');
      return;
    }
    if (!formData.tagline.trim()) {
      alert('Tagline wajib diisi.');
      return;
    }
    if (!formData.color.trim()) {
      alert('Warna wajib diisi.');
      return;
    }

    updatePhaseData(projectId, 'brandIdentity', {
      brandName: formData.brandName,
      logoUrl: formData.logoUrl,
      tagline: formData.tagline,
      color: formData.color,
      contact: formData.contact,
      socialMedia: formData.socialMedia,
    });
    alert('✅ Brand identity berhasil disimpan!');
  };

  const handleReset = () => {
    if (confirm('Yakin ingin menghapus semua data brand identity?')) {
      deletePhaseData(projectId, 'brandIdentity');
      setFormData({
        brandName: '',
        logoUrl: '',
        tagline: '',
        color: '',
        contact: '',
        socialMedia: '',
      });
      setCurrentStepIndex(0);
    }
  };

  // Progress hanya hitung field wajib
  const requiredFields = ['brandName', 'tagline', 'color'];
  const filledRequired = requiredFields.filter((key) => formData[key]?.trim() !== '').length;
  const progressPercent = Math.round((filledRequired / requiredFields.length) * 100);

  const initials = (formData.brandName || 'NB')
    .replace(/\s+/g, '')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#ffffff] p-4 sm:p-6">
      {/* Header */}
      <header className="mb-8">
        <div
          className="p-5 font-sans"
          style={{
            borderStyle: 'solid',
            borderTopWidth: '1px',
            borderLeftWidth: '1px',
            borderBottomWidth: '4px',
            borderRightWidth: '4px',
            borderColor: '#000000',
            boxShadow: '4px 4px 0 0 #000000',
            backgroundColor: '#ffffff',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#000000] font-sans">
                ManagHer / Mini Business Plan
              </h1>
              <p className="text-[#000000] text-sm font-sans font-light mt-1">
                Bangun identitas brand bisnismu 🎨
              </p>
            </div>
            <button
              onClick={() => router.push(`/dashboard/${projectId}`)}
              className="bg-[#ffcccc] text-[#000000] px-4 py-2 font-semibold font-sans hover:bg-[#ffa8a8] transition-colors"
              style={{
                borderStyle: 'solid',
                borderTopWidth: '1px',
                borderLeftWidth: '1px',
                borderBottomWidth: '4px',
                borderRightWidth: '4px',
                borderColor: '#000000',
              }}
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar */}
        <div
          className="w-full lg:w-64 font-sans"
          style={{
            backgroundColor: '#fff8f0',
            borderStyle: 'solid',
            borderTopWidth: '1px',
            borderLeftWidth: '1px',
            borderBottomWidth: '4px',
            borderRightWidth: '4px',
            borderColor: '#000000',
            boxShadow: '4px 4px 0 0 #000000',
          }}
        >
          <div
            className="p-4 border-b border-[#000000]"
            style={{
              borderStyle: 'solid',
              borderTopWidth: '1px',
              borderLeftWidth: '1px',
              borderBottomWidth: '4px',
              borderRightWidth: '4px',
              borderColor: '#000000',
            }}
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-10 h-10 flex items-center justify-center font-bold text-white"
                style={{
                  backgroundColor: '#b80000',
                  border: '2px solid #000000',
                  borderRadius: '0',
                }}
              >
                MH
              </div>
              <div>
                <h3 className="font-bold text-[#000000]">ManagHer</h3>
                <p className="text-[#000000] text-xs font-light">Solopreneur Journey</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {SIDEBAR_MENU.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'ide-bisnis') {
                    router.push(`/dashboard/${projectId}/plan`);
                  } else {
                    router.push(`/dashboard/${projectId}/plan/${item.id}`);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 font-medium transition-colors ${
                  item.id === 'brand'
                    ? 'bg-[#b80000] text-white'
                    : 'text-[#000000] hover:bg-[#ffcccc]'
                }`}
                style={{ borderRadius: '0', textAlign: 'left' }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 text-xs text-[#000000] font-light border-t border-[#000000] mt-auto">
            v1.0 — Brand Identity
          </div>
        </div>

        {/* Konten Utama */}
        <div className="flex-1 space-y-6">
          {/* Progress Card */}
          <div
            className="font-sans p-6"
            style={{
              backgroundColor: '#ffffff',
              borderStyle: 'solid',
              borderTopWidth: '1px',
              borderLeftWidth: '1px',
              borderBottomWidth: '4px',
              borderRightWidth: '4px',
              borderColor: '#000000',
              boxShadow: '4px 4px 0 0 #000000',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#000000]">🎨 Progress Brand Identity</h2>
              <span className="text-sm font-semibold text-[#000000]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#e0e0e0] h-3 mb-2">
              <div
                className="h-3"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: STEP_COLORS[currentStepIndex],
                  border: '1px solid #000000',
                }}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <div
            className="font-sans"
            style={{
              backgroundColor: '#ffffff',
              borderStyle: 'solid',
              borderTopWidth: '1px',
              borderLeftWidth: '1px',
              borderBottomWidth: '4px',
              borderRightWidth: '4px',
              borderColor: '#000000',
              boxShadow: '4px 4px 0 0 #000000',
            }}
          >
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-bold text-[#000000] mb-3">Langkah Brand Identity</h3>
                <div className="flex flex-wrap gap-2">
                  {STEPS.map((step, index) => (
                    <button
                      key={step.key}
                      onClick={() => setCurrentStepIndex(index)}
                      className={`px-3 py-1 text-sm font-sans transition-colors flex items-center gap-1 ${
                        index === currentStepIndex
                          ? 'bg-[#b80000] text-white'
                          : 'bg-[#ffcccc] text-[#000000] hover:bg-[#ffa8a8]'
                      }`}
                      style={{ borderRadius: '0' }}
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: STEP_COLORS[index],
                          color: '#fff',
                          border: '1px solid #000',
                        }}
                      >
                        {index + 1}
                      </span>
                      {step.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#000000] mb-4">{currentStep.label}</h2>

                {currentStep.key === 'logoUrl' ? (
                  <div className="mb-6">
                    <div
                      className="border-dashed border-2 border-[#000000] p-4 text-center cursor-pointer"
                      onClick={() => document.getElementById('logo-upload').click()}
                      style={{ borderRadius: '0' }}
                    >
                      {formData.logoUrl ? (
                        <div>
                          <img
                            src={formData.logoUrl}
                            alt="Preview Logo"
                            className="mx-auto max-h-24"
                            style={{ borderRadius: '0', border: '1px solid #000000' }}
                          />
                          <p className="text-[#000000] text-sm mt-2">Klik untuk ganti logo</p>
                        </div>
                      ) : (
                        <p className="text-[#000000]">📁 Klik untuk upload logo</p>
                      )}
                    </div>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setFormData((prev) => ({ ...prev, logoUrl: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                ) : currentStep.key === 'color' ? (
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="color"
                        value={
                          /^#[0-9A-F]{6}$/i.test(formData.color)
                            ? formData.color
                            : '#b80000'
                        }
                        onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                        className="w-12 h-12 cursor-pointer"
                        style={{
                          borderRadius: '0',
                          border: '1px solid #000000',
                          padding: '0',
                        }}
                      />
                      <span className="text-[#000000] font-sans">
                        {formData.color || 'Pilih warna'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.color || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                      placeholder={PLACEHOLDERS.color}
                      className="w-full px-4 py-3 outline-none font-sans"
                      style={{
                        borderStyle: 'solid',
                        borderTopWidth: '1px',
                        borderLeftWidth: '1px',
                        borderBottomWidth: '4px',
                        borderRightWidth: '4px',
                        borderColor: '#000000',
                      }}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={currentValue ?? ''}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={PLACEHOLDERS[currentStep.key]}
                    className="w-full px-4 py-3 outline-none font-sans mb-6"
                    style={{
                      borderStyle: 'solid',
                      borderTopWidth: '1px',
                      borderLeftWidth: '1px',
                      borderBottomWidth: '4px',
                      borderRightWidth: '4px',
                      borderColor: '#000000',
                    }}
                  />
                )}

                <div className="flex justify-between">
                  <button
                    onClick={handlePrev}
                    disabled={currentStepIndex === 0}
                    className={`px-4 py-2 font-semibold font-sans ${
                      currentStepIndex === 0
                        ? 'bg-[#f0f0f0] text-[#333333] cursor-not-allowed'
                        : 'bg-[#ffcccc] text-[#000000] hover:bg-[#ffa8a8]'
                    }`}
                    style={{
                      borderStyle: 'solid',
                      borderTopWidth: '1px',
                      borderLeftWidth: '1px',
                      borderBottomWidth: '4px',
                      borderRightWidth: '4px',
                      borderColor: '#000000',
                      borderRadius: '0',
                    }}
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={currentStepIndex === STEPS.length - 1 ? handleFinish : handleNext}
                    className="bg-[#b80000] text-white px-4 py-2 font-semibold font-sans hover:bg-[#8B0000]"
                    style={{
                      borderStyle: 'solid',
                      borderTopWidth: '1px',
                      borderLeftWidth: '1px',
                      borderBottomWidth: '4px',
                      borderRightWidth: '4px',
                      borderColor: '#000000',
                      borderRadius: '0',
                    }}
                  >
                    {currentStepIndex === STEPS.length - 1 ? 'Selesai' : 'Next →'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Preview — Business Card Style */}
        <div
        className="font-sans"
        style={{
            backgroundColor: '#ffffff',
            borderStyle: 'solid',
            borderTopWidth: '1px',
            borderLeftWidth: '1px',
            borderBottomWidth: '4px',
            borderRightWidth: '4px',
            borderColor: '#000000',
            boxShadow: '4px 4px 0 0 #000000',
        }}
        >
        <div className="p-6">
            <h3 className="text-xl font-bold text-[#000000] mb-4">Business Card Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Dengan Logo Gambar */}
            <div
                className="p-5 flex flex-col items-center text-center"
                style={{
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                borderRadius: '0',
                boxShadow: '3px 3px 0 0 rgba(0,0,0,1)',
                }}
            >
                <div className="mb-3">
                {formData.logoUrl ? (
                    <img
                    src={formData.logoUrl}
                    alt="Logo"
                    className="w-16 h-16 object-contain"
                    style={{ borderRadius: '0' }}
                    />
                ) : (
                    <div
                    className="w-16 h-16 flex items-center justify-center bg-[#f0f0f0] border border-dashed border-[#999]"
                    style={{ borderRadius: '0' }}
                    >
                    <span className="text-[#888] text-xs">Logo</span>
                    </div>
                )}
                </div>
                <h4 className="font-bold text-[#000000] text-lg mb-1">
                {formData.brandName || 'Nama Brand'}
                </h4>
                <p className="text-[#555] text-sm mb-2">
                {formData.tagline || 'Tagline brand Anda'}
                </p>
                <p className="text-[#333] text-sm mb-1">
                {formData.contact || 'Kontak (Email/No HP)'}
                </p>
                <p className="text-[#333] text-sm">
                {formData.socialMedia || '@username (Instagram, TikTok, dll)'}
                </p>
            </div>

            {/* Card 2: Dengan Logo Inisial */}
            <div
                className="p-5 flex flex-col items-center text-center"
                style={{
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                borderRadius: '0',
                boxShadow: '3px 3px 0 0 rgba(0,0,0,1)',
                }}
            >
                <div
                className="w-16 h-16 flex items-center justify-center font-bold text-white text-lg mb-3"
                style={{
                    backgroundColor: formData.color || '#b80000',
                    border: '1px solid #000000',
                    borderRadius: '0',
                }}
                >
                {initials}
                </div>
                <h4 className="font-bold text-[#000000] text-lg mb-1">
                {formData.brandName || 'Nama Brand'}
                </h4>
                <p className="text-[#555] text-sm mb-2">
                {formData.tagline || 'Tagline brand Anda'}
                </p>
                <p className="text-[#333] text-sm mb-1">
                {formData.contact || 'Kontak (Email/No HP)'}
                </p>
                <p className="text-[#333] text-sm">
                {formData.socialMedia || '@username (Instagram, TikTok, dll)'}
                </p>
            </div>
            </div>
        </div>
        </div>

          {/* Reset Button */}
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="w-full max-w-xs bg-[#ffcccc] text-[#000000] px-3 py-2 font-semibold font-sans hover:bg-[#ffa8a8]"
              style={{
                borderStyle: 'solid',
                borderTopWidth: '1px',
                borderLeftWidth: '1px',
                borderBottomWidth: '4px',
                borderRightWidth: '4px',
                borderColor: '#000000',
                borderRadius: '0',
              }}
            >
              Reset Semua Data Brand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}