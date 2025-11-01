'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useProjectStore from '@/store/useProjectStore';
import { Lock, HelpCircle } from "lucide-react"
import * as Icons from 'lucide-react';

// const LEVELS = [
//   { id: 1, title: "Ide Generator", phase: "plan", xp: 10, icon: Lightbulb, badge: "AI Innovator" },
//   { id: 2, title: "RWW Analysis", phase: "plan", xp: 10, icon: CheckCircle, badge: "Validator Pro" },
//   { id: 3, title: "Brand Identity", phase: "plan", xp: 10, icon: Palette, badge: "Brand Builder" },
//   { id: 4, title: "Lean Canvas", phase: "plan", xp: 10, icon: FileText, badge: "Canvas Master" },
//   { id: 5, title: "MVP", phase: "plan", xp: 10, icon: Box, badge: "MVP Maker" },
//   { id: 6, title: "Beta Testing", phase: "plan", xp: 10, icon: Users, badge: "Tester Hero" },
//   { id: 7, title: "Persiapan Launching", phase: "plan", xp: 10, icon: Rocket, badge: "Launch Ready" },
//   { id: 8, title: "Product", phase: "sell", xp: 10, icon: Package, badge: "Product Manager" },
//   { id: 9, title: "Customer", phase: "sell", xp: 10, icon: User, badge: "Customer Care" },
//   { id: 10, title: "Order", phase: "sell", xp: 10, icon: ShoppingBag, badge: "Order Ninja" },
//   { id: 11, title: "Laba Rugi", phase: "sell", xp: 10, icon: BarChart3, badge: "Finance Guru" },
//   { id: 12, title: "Scale Up", phase: "scaleUp", xp: 10, icon: TrendingUp, badge: "CEO Mode" },
// ];


export default function DashboardPage() {
  const { projectId } = useParams();
  const { getLevels, levels, projects, planLevels, sellLevels, scaleUpLevels } = useProjectStore((state) => state);

  useEffect(() => {
    if (projectId) {
      getLevels(projectId);
    }
  }, [projectId]);

  if (!projectId || !levels) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        Memuat proyek...
      </div>
    );
  }

  const enrichedLevels = levels.map(level => {
    const existing = levels?.find(l => l.id === level._id);
    return {
      ...level,
      completed: existing?.completed || false,
    };
  });

  const TOTAL_XP = levels.reduce((sum, level) => sum + level.xp, 0);
  const completedLevels = enrichedLevels.filter(l => l.completed);
  const currentXp = completedLevels.reduce((sum, l) => sum + l.xp, 0);
  const globalProgress = Math.min(100, Math.floor((currentXp / TOTAL_XP) * 100));
  const currentLevel = enrichedLevels.find(l => !l.completed) || enrichedLevels[enrichedLevels.length - 1];

  // Fase Sell & Scale Up selalu dikunci
  const isPlanCompleted = false; 
  const isSellCompleted = false;

  const renderLevelBadge = (level) => {
    // Fase Sell & Scale Up selalu dianggap "belum selesai"
    const isLockedPhase = level.phase.name !== 'plan';
    const isCompleted = !isLockedPhase && level.completed;
    const isActive = !isLockedPhase && level._id === currentLevel._id && !isCompleted;

    let bgColor, textColor, borderColor, badgeBg;
    if (isLockedPhase || (!isCompleted && !isActive)) {
      // Abu-abu untuk: locked phase, atau plan belum selesai
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-500';
      borderColor = 'border-gray-300';
      badgeBg = 'bg-gray-300 text-gray-700';
    } else if (isCompleted) {
      // Pink pucat + badge biru untuk level Plan yang selesai
      bgColor = 'bg-[#fdf6f0]';
      textColor = 'text-slate-800';
      borderColor = 'border-[#f02d9c]/30';
      badgeBg = 'bg-[#8acfd1] text-white';
    } else {
      // Active (sedang dikerjakan)
      bgColor = 'bg-[#f02d9c]';
      textColor = 'text-white';
      borderColor = 'border-[#f02d9c]';
      badgeBg = 'bg-[#8acfd1] text-white';
    }

    const iconMap = {
      Lightbulb: Icons.Lightbulb,
      CheckCircle: Icons.CheckCircle,
      Palette: Icons.Palette,
      FileText: Icons.FileText,
      Box: Icons.Box,
      Users: Icons.Users,
      Rocket: Icons.Rocket,
      Package: Icons.Package,
      User: Icons.User,
      ShoppingBag: Icons.ShoppingBag,
      BarChart3: Icons.BarChart3,
      TrendingUp: Icons.TrendingUp,
    };

    const Icon = iconMap[level.icon] || Icons.HelpCircle;

    return (
      <div
        key={level._id}
        className={`w-[120px] h-[130px] rounded-lg border ${borderColor} ${bgColor} ${textColor} p-2 flex flex-col items-center justify-between`}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-[#f02d9c]">
          <Icon size={16} className="text-[#f02d9c]" />
        </div>
        <div className="text-center mt-1">
          <h4 className="font-bold text-xs">L{level.order}</h4> 
          <p className="text-[10px] mt-0.5">{level.title}</p>
          <span className="block text-[8px] font-semibold mt-1">+{level.xp} XP</span>
        </div>
        {level.badge && (
          <span className={`mt-1 px-1.5 py-0.5 rounded text-[7px] font-bold whitespace-nowrap ${badgeBg}`}>
            {level.badge}
          </span>
        )}
      </div>
    );
  };

  console.log(levels)

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
        <h1 className="text-xl sm:text-2xl font-bold text-[#5b5b5b] mb-4 sm:mb-6">Dashboard: {levels[0].project?.title}</h1>

        {/* Global XP & Progress */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="font-bold text-[#5b5b5b] text-sm sm:text-base">Total XP: {currentXp} / {TOTAL_XP}</span>
              <div className="text-xs sm:text-sm text-[#7a7a7a] mt-1">
                Level: {currentLevel.order} • {currentLevel.title}
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
              ? `Kumpulkan ${levels.find(l => l.id === currentLevel._id)?.xp || 10} XP lagi untuk naik level`
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
            <div className="flex flex-wrap gap-4 justify-start">
              {planLevels.map(renderLevelBadge)}
            </div>
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
                isLocked: true, 
                phaseColor: '#8acfd1'
              })}
            </div>
            <div className="flex flex-wrap gap-2 justify-start">
              {sellLevels.map(renderLevelBadge)}
            </div>
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
                isLocked: true, 
                phaseColor: '#c5a8e0'
              })}
            </div>
            <div className="flex flex-wrap gap-2 justify-start">
              {scaleUpLevels.map(renderLevelBadge)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}