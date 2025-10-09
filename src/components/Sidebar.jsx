'use client';

import { useRouter } from 'next/navigation';
import useProjectStore from '@/store/useProjectStore';
import { useEffect, useState } from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const router = useRouter();
  const { currentProject } = useProjectStore();
  const [projectName, setProjectName] = useState('');

  // Ambil nama proyek saat dimuat
  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name || 'Proyek');
    }
  }, [currentProject]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'plan', label: 'Plan', icon: '📌' },
    { id: 'sell', label: 'Sell', icon: '🚀' },
    { id: 'scale-up', label: 'Scale Up', icon: '📈' },
  ];

  return (
    <div
      className="w-full lg:w-64 font-sans"
      style={{
        backgroundColor: '#f0f0f0',
        borderStyle: 'solid',
        borderTopWidth: '1px',
        borderLeftWidth: '1px',
        borderBottomWidth: '4px',
        borderRightWidth: '4px',
        borderColor: '#000000',
        boxShadow: '4px 4px 0 0 #000000',
      }}
    >
      {/* Header Sidebar */}
      <div
        className="p-4 flex items-center space-x-2 cursor-pointer"
        onClick={() => router.push('/projects')}
        style={{
          borderStyle: 'solid',
          borderTopWidth: '1px',
          borderLeftWidth: '1px',
          borderBottomWidth: '4px',
          borderRightWidth: '4px',
          borderColor: '#000000',
        }}
      >
        <span className="text-xl">↩️</span>
        <h3 className="font-bold text-[#000000]">{projectName}</h3>
      </div>

      {/* Menu Items — TANPA BORDER PER ITEM */}
      <nav className="p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              router.push(`/dashboard/${currentProject?.id}/${tab.id}`);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#b80000] text-white'
                : 'text-[#000000] hover:bg-[#ffcccc]'
            }`}
            style={{
              borderRadius: '0', // Pastikan tidak ada rounding
              textAlign: 'left',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}