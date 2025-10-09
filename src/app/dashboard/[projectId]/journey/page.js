'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useProjectStore from '@/store/useProjectStore';

export default function JourneyPage({ params }) {
  const { projectId } = use(params);
  const router = useRouter();
  const { currentProject, setCurrentProject } = useProjectStore();
  const [activeTab, setActiveTab] = useState('journey');

  useEffect(() => {
    setCurrentProject(projectId);
    setActiveTab('journey');
  }, [projectId, setCurrentProject]);

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ffffff]">
        <div
          className="px-6 py-4 text-[#000000] font-sans"
          style={{
            borderStyle: 'solid',
            borderTopWidth: '1px',
            borderLeftWidth: '1px',
            borderBottomWidth: '4px',
            borderRightWidth: '4px',
            borderColor: '#000000',
            boxShadow: '4px 4px 0 0 #000000',
          }}
        >
          Memuat proyek...
        </div>
      </div>
    );
  }

  const projectName = currentProject.name || 'Proyek';

  // Sidebar Menu
  const SIDEBAR_MENU = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'journey', label: 'Journey', icon: '🚀' },
  ];

  const handleNavigate = (id) => {
    if (id === 'dashboard') {
      router.push(`/dashboard/${projectId}`);
    } else if (id === 'journey') {
      router.push(`/dashboard/${projectId}/journey`);
    }
  };

  // Cek progres Fase Plan
  const businessIdea = currentProject.data?.businessIdea || {};
  const pricing = currentProject.data?.pricing || {};
  const brand = currentProject.data?.brandIdentity || {};
  const validation = currentProject.data?.validation || [];
  const bmc = currentProject.data?.bmc || {};

  const isPlanComplete = () => {
    return (
      businessIdea.idea &&
      pricing.materialCost &&
      brand.brandName &&
      validation.length > 0 &&
      Object.keys(bmc).some((key) => !key.startsWith('__'))
    );
  };

  const planComplete = isPlanComplete();
  const sellUnlocked = planComplete;
  const scaleUpUnlocked = sellUnlocked;

  // Navigasi ke sub-fase
  const goToPlan = (subpage) => {
    router.push(`/dashboard/${projectId}/plan/${subpage}`);
  };

  const goToSell = (subpage) => {
    if (!sellUnlocked) {
      alert('🔒 Fase Sell terkunci!\nSelesaikan semua langkah di Fase Plan terlebih dahulu.');
      return;
    }
    router.push(`/dashboard/${projectId}/sell/${subpage}`);
  };

  const goToScaleUp = (subpage) => {
    if (!scaleUpUnlocked) {
      alert('🔒 Fase Scale Up terkunci!\nSelesaikan Fase Sell terlebih dahulu.');
      return;
    }
    router.push(`/dashboard/${projectId}/scale-up/${subpage}`);
  };

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
                ManagHer / {projectName}
              </h1>
              <p className="text-[#000000] text-sm font-sans font-light mt-1">
                Perjalanan Bisnismu dari Zero ke CEO 💪
              </p>
            </div>
            <button
              onClick={() => router.push('/projects')}
              className="bg-[#ffcccc] text-[#000000] px-4 py-2 font-semibold font-sans hover:bg-[#ffa8a8]"
              style={{
                borderStyle: 'solid',
                borderTopWidth: '1px',
                borderLeftWidth: '1px',
                borderBottomWidth: '4px',
                borderRightWidth: '4px',
                borderColor: '#000000',
              }}
            >
              ← Proyek Saya
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
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 font-medium transition-colors ${
                  activeTab === item.id
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
            v1.0 — Solopreneur Journey
          </div>
        </div>

        {/* Konten Utama */}
        <div className="flex-1 space-y-6">
          {/* Card Fase Plan dengan Tombol Buka */}
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
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-[#000000]">📌 Fase Plan</h2>
              <button
                onClick={() => router.push(`/dashboard/${projectId}/plan`)}
                className="bg-[#b80000] text-white px-4 py-2 font-bold font-sans hover:bg-[#8B0000]"
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
                ➡️ Buka
              </button>
            </div>
            <p className="text-[#000000] mb-4 text-sm">
              Lengkapi semua langkah untuk membuka Fase Sell.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { name: 'Ide Bisnis', subpage: 'ide-bisnis', filled: !!businessIdea.idea },
                { name: 'Pricing', subpage: 'pricing', filled: !!pricing.materialCost },
                { name: 'Brand Identity', subpage: 'brand', filled: !!brand.brandName },
                { name: 'Validasi', subpage: 'validasi', filled: validation.length > 0 },
                { name: 'BMC', subpage: 'bmc', filled: Object.keys(bmc).some((key) => !key.startsWith('__')) },
              ].map((step, i) => (
                <button
                  key={i}
                  onClick={() => goToPlan(step.subpage)}
                  className="p-3 text-center hover:bg-[#ffcccc] transition-colors"
                  style={{
                    backgroundColor: step.filled ? '#e6f7ff' : '#f9f9f9',
                    border: '1px solid #000000',
                    borderRadius: '0',
                  }}
                >
                  <div className="font-bold text-[#000000] text-sm">{step.name}</div>
                  <div className="text-xs mt-1">{step.filled ? '✅' : 'belum'}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Fase Sell */}
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#000000]">🛒 Fase Sell</h2>
              {!sellUnlocked && (
                <span className="text-xs bg-[#ffcccc] text-[#b80000] px-2 py-1 font-bold">
                  🔒 Terkunci
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Product', subpage: 'product' },
                { name: 'Customer', subpage: 'customer' },
                { name: 'Order', subpage: 'order' },
                { name: 'Laporan Laba/Rugi', subpage: 'laporan' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => goToSell(item.subpage)}
                  disabled={!sellUnlocked}
                  className={`p-3 text-center ${
                    sellUnlocked
                      ? 'hover:bg-[#e6ffe6] cursor-pointer'
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  style={{
                    backgroundColor: sellUnlocked ? '#e6ffe6' : '#f9f9f9',
                    border: '1px solid #000000',
                    borderRadius: '0',
                  }}
                >
                  <div className="font-bold text-[#000000] text-sm">{item.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Fase Scale Up */}
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#000000]">📈 Fase Scale Up</h2>
              {!scaleUpUnlocked && (
                <span className="text-xs bg-[#ffcccc] text-[#b80000] px-2 py-1 font-bold">
                  🔒 Terkunci
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { name: 'Marketing', subpage: 'marketing' },
                { name: 'Finance', subpage: 'finance' },
                { name: 'Tax', subpage: 'tax' },
                { name: 'Legal', subpage: 'legal' },
                { name: 'HR', subpage: 'hr' },
                { name: '...', subpage: 'more' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => goToScaleUp(item.subpage)}
                  disabled={!scaleUpUnlocked}
                  className={`p-3 text-center ${
                    scaleUpUnlocked
                      ? 'hover:bg-[#fff0e6] cursor-pointer'
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  style={{
                    backgroundColor: scaleUpUnlocked ? '#fff0e6' : '#f9f9f9',
                    border: '1px solid #000000',
                    borderRadius: '0',
                  }}
                >
                  <div className="font-bold text-[#000000] text-sm">{item.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}