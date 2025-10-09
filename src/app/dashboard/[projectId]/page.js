'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useProjectStore from '@/store/useProjectStore';

export default function DashboardPage({ params }) {
  const { projectId } = use(params);
  const router = useRouter();
  const { currentProject, setCurrentProject } = useProjectStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    setCurrentProject(projectId);
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

  // Menu Sidebar
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

  const handleFeature = (feature) => {
    alert(`Fitur "${feature}" sedang dalam pengembangan!`);
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
                Dari Zero ke CEO 💪
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Ikon Fitur Pendukung — Background Abu-Abu Terang */}
              <button
                onClick={() => handleFeature('Calendar')}
                className="w-10 h-10 flex items-center justify-center bg-[#e0e0e0] text-[#000000] font-bold hover:bg-[#d0d0d0]"
                style={{
                  borderStyle: 'solid',
                  borderTopWidth: '1px',
                  borderLeftWidth: '1px',
                  borderBottomWidth: '4px',
                  borderRightWidth: '4px',
                  borderColor: '#000000',
                  borderRadius: '0',
                }}
                title="Calendar"
              >
                📅
              </button>
              <button
                onClick={() => handleFeature('Pomodoro Timer')}
                className="w-10 h-10 flex items-center justify-center bg-[#e0e0e0] text-[#000000] font-bold hover:bg-[#d0d0d0]"
                style={{
                  borderStyle: 'solid',
                  borderTopWidth: '1px',
                  borderLeftWidth: '1px',
                  borderBottomWidth: '4px',
                  borderRightWidth: '4px',
                  borderColor: '#000000',
                  borderRadius: '0',
                }}
                title="Pomodoro Timer"
              >
                ⏰
              </button>
              <button
                onClick={() => handleFeature('Lofi Playlist')}
                className="w-10 h-10 flex items-center justify-center bg-[#e0e0e0] text-[#000000] font-bold hover:bg-[#d0d0d0]"
                style={{
                  borderStyle: 'solid',
                  borderTopWidth: '1px',
                  borderLeftWidth: '1px',
                  borderBottomWidth: '4px',
                  borderRightWidth: '4px',
                  borderColor: '#000000',
                  borderRadius: '0',
                }}
                title="Lofi Playlist"
              >
                🎧
              </button>
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

        {/* Konten Utama — Ringkasan Global */}
        <div className="flex-1 space-y-6">
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
            <h2 className="text-xl font-bold text-[#000000] mb-4">📋 Ringkasan Proyek</h2>
            <p className="text-[#000000] mb-6">
              Selamat datang kembali, Founder! 💪  
              Proyek <strong>{projectName}</strong> sedang dalam perjalanan dari <strong>0 ke CEO</strong>.
            </p>

            {/* Tombol Buka Fase Plan */}
            <button
              onClick={() => router.push(`/dashboard/${projectId}/plan`)}
              className="bg-[#b80000] text-white px-6 py-3 font-bold font-sans hover:bg-[#8B0000]"
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
              ➡️ Buka Fase Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}