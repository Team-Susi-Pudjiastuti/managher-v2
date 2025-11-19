// app/dashboard/[projectId]/page.jsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import useProjectStore from '@/store/useProjectStore';
import useAuthStore from '@/store/useAuthStore';
import { Lock, HelpCircle, Sparkle, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function DashboardPage() {
  const params = useParams();
  const projectId = params?.projectId; // ✅ Ambil langsung dari URL

  const { getLevels, levels, planLevels, sellLevels, scaleUpLevels } = useProjectStore();
  const router = useRouter();
  const { isAuthenticated, loadSession, isHydrated } = useAuthStore();

  // Load sesi pengguna
  useEffect(() => {
    loadSession();
  }, []);

  // Redirect jika belum login
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  // ✅ Fetch level berdasarkan projectId dari URL
  useEffect(() => {
    if (projectId && typeof projectId === 'string') {
      getLevels(projectId);
    }
  }, [projectId, getLevels]);

  // Tampilkan loading saat data belum siap
  if (!isHydrated || !projectId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 text-[#f02d9c] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // sedang redirect
  }

  // Jika level belum dimuat, tampilkan loading
  if (levels.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 text-[#f02d9c] animate-spin" />
      </div>
    );
  }

  // === Hitung progres global ===
  const TOTAL_XP = levels.reduce((sum, level) => sum + (level.xp || 0), 0);
  const completedLevels = levels.filter((l) => l.completed);
  const currentXp = completedLevels.reduce((sum, l) => sum + (l.xp || 0), 0);
  const globalProgress = TOTAL_XP > 0 ? Math.min(100, Math.floor((currentXp / TOTAL_XP) * 100)) : 0;

  // Cari level aktif di fase Plan
  const currentLevel = planLevels.find((l) => !l.completed) || planLevels[planLevels.length - 1];

  // Judul proyek
  const projectTitle = planLevels[0]?.project?.title || 'Proyekku';

  // === Render badge level ===
  const renderLevelBadge = (level) => {
    const isPlanPhase = level.phase?.name === 'plan';
    const isCompleted = isPlanPhase && level.completed;
    const isActive = isPlanPhase && !level.completed && level.order === currentLevel?.order;

    let bgColor, textColor, borderColor, badgeBg;

    if (!isPlanPhase) {
      // Fase Sell/Scale Up → terkunci
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-500';
      borderColor = 'border-gray-300';
      badgeBg = 'bg-gray-300 text-gray-700';
    } else if (isCompleted) {
      bgColor = 'bg-[#f02d9c]';
      textColor = 'text-white';
      borderColor = 'border-[#f02d9c]';
      badgeBg = 'bg-[#8acfd1] text-white';
    } else if (isActive) {
      bgColor = 'bg-[#fdf6f0]';
      textColor = 'text-slate-800';
      borderColor = 'border-[#f02d9c]/30';
      badgeBg = 'bg-[#8acfd1] text-white';
    } else {
      // Plan, tapi belum aktif
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-500';
      borderColor = 'border-gray-300';
      badgeBg = 'bg-gray-300 text-gray-700';
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
          <span className="block text-[8px] font-semibold mt-1">+{level.xp || 0} XP</span>
        </div>
        {level.badge && (
          <span className={`mt-1 px-1.5 py-0.5 rounded text-[7px] font-bold whitespace-nowrap ${badgeBg}`}>
            {level.badge}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-[#5b5b5b] mb-4 sm:mb-6">
          Dashboard: {projectTitle}
        </h1>

        {/* Global XP & Progress */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="font-bold text-[#5b5b5b] text-sm sm:text-base">
                Total XP: {currentXp} / {TOTAL_XP}
              </span>
              <div className="text-xs sm:text-sm text-[#7a7a7a] mt-1">
                Level: {currentLevel?.order} • {currentLevel?.title}
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
            {currentXp < TOTAL_XP ? (
              `Kumpulkan poin XP untuk naik level`
            ) : (
              <span className="flex items-center gap-1">
                <Sparkle size={14} className="text-[#f02d9c]" />
                Selamat! Kamu telah menyelesaikan semua level!
              </span>
            )}
          </p>
        </div>

        {/* FASE PLAN */}
        <Link href={`/dashboard/${projectId}/plan`} className="block mb-6 sm:mb-8 group">
          <div className="relative">
            <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-xl sm:rounded-2xl"></div>
            <div
              className="relative bg-white rounded-xl sm:rounded-2xl border-t border-l border-black p-4 sm:p-5 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-200 cursor-pointer"
              style={{ boxShadow: '1px 1px 0 0 #f02d9c' }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-[#f02d9c] text-lg">Fase: Plan</h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs rounded-full border border-black font-medium">
                  Buka
                </span>
              </div>
              <div className="flex flex-wrap gap-2 justify-start">
                {planLevels.map(renderLevelBadge)}
              </div>
            </div>
          </div>
        </Link>

        {/* Fase Sell — Terkunci */}
        <div className="relative mb-6 sm:mb-8 opacity-80">
          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#8acfd1] rounded-xl sm:rounded-2xl"></div>
          <div
            className="relative bg-white rounded-xl sm:rounded-2xl border-t border-l border-black p-4 sm:p-5"
            style={{ boxShadow: '1px 1px 0 0 #8acfd1' }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-[#0a5f61] text-lg">Fase: Sell</h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-600 text-xs rounded-full border border-gray-300 font-medium">
                <Lock size={12} />
                Belum Tersedia
              </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-start">
              {sellLevels.map(renderLevelBadge)}
            </div>
          </div>
        </div>

        {/* Fase Scale Up — Terkunci */}
        <div className="relative mb-6 sm:mb-8 opacity-80">
          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#c5a8e0] rounded-xl sm:rounded-2xl"></div>
          <div
            className="relative bg-white rounded-xl sm:rounded-2xl border-t border-l border-black p-4 sm:p-5"
            style={{ boxShadow: '1px 1px 0 0 #c5a8e0' }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-[#5a3a8c] text-lg">Fase: Scale Up</h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-600 text-xs rounded-full border border-gray-300 font-medium">
                <Lock size={12} />
                Belum Tersedia
              </span>
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