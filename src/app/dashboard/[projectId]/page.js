'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useProjectStore from '@/store/useProjectStore';

import { 
  Lightbulb, CheckCircle, Palette, FileText, Box, Users, Rocket,
  Package, User, ShoppingBag, BarChart3,
  TrendingUp, Lock, Sparkle
} from 'lucide-react';

const LEVELS = [
  { id: 1, title: "Ide Generator", phase: "plan", xp: 10, icon: Lightbulb },
  { id: 2, title: "RWW Analysist", phase: "plan", xp: 10, icon: CheckCircle },
  { id: 3, title: "Brand Identity", phase: "plan", xp: 10, icon: Palette },
  { id: 4, title: "Lean Canvas", phase: "plan", xp: 10, icon: FileText },
  { id: 5, title: "MVP", phase: "plan", xp: 10, icon: Box },
  { id: 6, title: "Beta Testing", phase: "plan", xp: 10, icon: Users },
  { id: 7, title: "Persiapan Launching", phase: "plan", xp: 10, icon: Rocket },
  { id: 8, title: "Product", phase: "sell", xp: 10, icon: Package },
  { id: 9, title: "Customer", phase: "sell", xp: 10, icon: User },
  { id: 10, title: "Order", phase: "sell", xp: 10, icon: ShoppingBag },
  { id: 11, title: "Laba Rugi", phase: "sell", xp: 10, icon: BarChart3 },
  { id: 12, title: "Scale Up", phase: "scaleUp", xp: 10, icon: TrendingUp },
];

const TOTAL_XP = LEVELS.reduce((sum, level) => sum + level.xp, 0);

export default function DashboardPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const projects = useProjectStore((state) => state.projects);

  useEffect(() => {
    if (projectId) {
      const found = projects.find((p) => p.id === projectId);
      setProject(found);
    }
  }, [projectId, projects]);

  if (!projectId || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        Memuat proyek...
      </div>
    );
  }

  const enrichedLevels = LEVELS.map(level => {
    const existing = project?.levels?.find(l => l.id === level.id);
    return {
      ...level,
      completed: existing?.completed || false,
    };
  });

  const completedLevels = enrichedLevels.filter(l => l.completed);
  const currentXp = completedLevels.reduce((sum, l) => sum + l.xp, 0);
  const globalProgress = Math.min(100, Math.floor((currentXp / TOTAL_XP) * 100));
  const currentLevel = enrichedLevels.find(l => !l.completed) || enrichedLevels[enrichedLevels.length - 1];

  const planLevels = enrichedLevels.filter(l => l.phase === 'plan');
  const sellLevels = enrichedLevels.filter(l => l.phase === 'sell');
  const scaleUpLevels = enrichedLevels.filter(l => l.phase === 'scaleUp');

  const isPlanCompleted = planLevels.every(l => l.completed);
  const isSellCompleted = sellLevels.every(l => l.completed);

  const renderLevelBadge = (level) => {
    const isCompleted = level.completed;
    const isActive = level.id === currentLevel.id && !isCompleted;

    let bgColor, textColor, borderColor;
    if (isActive) {
      bgColor = 'bg-[#f02d9c]';
      textColor = 'text-white';
      borderColor = 'border-black';
    } else if (isCompleted) {
      bgColor = 'bg-[#8acfd1]';
      textColor = 'text-[#0a5f61]';
      borderColor = 'border-black';
    } else {
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-500';
      borderColor = 'border-gray-300';
    }

    const Icon = level.icon;

    return (
      <div
        key={level.id}
        className={`px-2.5 py-1.5 rounded-lg font-medium text-xs border ${bgColor} ${textColor} ${borderColor} flex flex-col items-center min-w-20`}
      >
        <div className="flex items-center justify-center w-5 h-5 mb-1">
          <Icon size={12} />
        </div>
        <span className="font-bold text-[10px]">L{level.id}</span>
        <span className="mt-0.5 text-center text-[8px] leading-tight">
          {level.title}
        </span>
        <span className="mt-0.5 text-[8px] font-semibold">
          +{level.xp} XP
        </span>
      </div>
    );
  };

  const renderSmallPhaseButton = ({ href, isLocked, phaseColor }) => {
    if (isLocked) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-600 text-xs rounded-full border border-gray-300 font-medium">
          <Lock size={12} />
          Belum Tersedia
        </span>
      );
    }

    return (
      <Link 
        href={href}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs rounded-full border border-black font-medium hover:bg-[#f02d9c] hover:text-white transition-colors"
        style={{ 
          boxShadow: `1px 1px 0 0 ${phaseColor}` 
        }}
      >
        Buka
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-[#5b5b5b] mb-4 sm:mb-6">Dashboard: {project.name}</h1>

        {/* Global XP & Progress */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="font-bold text-[#5b5b5b] text-sm sm:text-base">Total XP: {currentXp} / {TOTAL_XP}</span>
              <div className="text-xs sm:text-sm text-[#7a7a7a] mt-1">
                Level: {currentLevel.id} • {currentLevel.title}
              </div>
            </div>
            <span className="font-bold text-[#f02d9c] text-sm sm:text-base">{globalProgress}%</span>
          </div>

          <div className="mt-3">
            <div className="w-full h-2 sm:h-2.5 bg-[#f0f0f0] rounded-full border border-[#e0e0e0]">
              <div
                className="h-2 sm:h-2.5 rounded-full bg-[#f02d9c] transition-all duration-500"
                style={{ width: `${globalProgress}%` }}
              ></div>
            </div>

            <div className="flex justify-between mt-2 text-[10px] sm:text-xs font-bold">
              <span className="text-[#f02d9c]">Plan</span>
              <span className="text-[#0a5f61]">Sell</span>
              <span className="text-[#5a3a8c]">Scale Up</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#7a7a7a] mt-3">
            {currentXp < TOTAL_XP
              ? `Kumpulkan ${LEVELS.find(l => l.id === currentLevel.id)?.xp || 10} XP lagi untuk naik level`
              : (
                <span className="flex items-center gap-1">
                  <Sparkle size={14} className="text-[#f02d9c]" />
                  Selamat! Kamu telah menyelesaikan semua level!
                </span>
              )}
          </p>
        </div>

        {/* Fase Plan */}
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-xl sm:rounded-2xl"></div>
          <div
            className="relative bg-white rounded-xl sm:rounded-2xl border-t border-l border-black p-4 sm:p-5"
            style={{ boxShadow: '1px 1px 0 0 #f02d9c' }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-[#f02d9c] text-lg">Fase: Plan</h3>
              {renderSmallPhaseButton({
                href: `/dashboard/${projectId}/plan`,
                isLocked: false,
                phaseColor: '#f02d9c'
              })}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">{planLevels.map(renderLevelBadge)}</div>
          </div>
        </div>

        {/* Fase Sell */}
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#8acfd1] rounded-xl sm:rounded-2xl"></div>
          <div
            className="relative bg-white rounded-xl sm:rounded-2xl border-t border-l border-black p-4 sm:p-5"
            style={{ boxShadow: '1px 1px 0 0 #8acfd1' }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-[#0a5f61] text-lg">Fase: Sell</h3>
              {renderSmallPhaseButton({
                href: `/dashboard/${projectId}/sell`,
                isLocked: !isPlanCompleted,
                phaseColor: '#8acfd1'
              })}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">{sellLevels.map(renderLevelBadge)}</div>
          </div>
        </div>

        {/* Fase Scale Up */}
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#c5a8e0] rounded-xl sm:rounded-2xl"></div>
          <div
            className="relative bg-white rounded-xl sm:rounded-2xl border-t border-l border-black p-4 sm:p-5"
            style={{ boxShadow: '1px 1px 0 0 #c5a8e0' }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-[#5a3a8c] text-lg">Fase: Scale Up</h3>
              {renderSmallPhaseButton({
                href: `/dashboard/${projectId}/scale-up`,
                isLocked: !isSellCompleted,
                phaseColor: '#c5a8e0'
              })}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">{scaleUpLevels.map(renderLevelBadge)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}