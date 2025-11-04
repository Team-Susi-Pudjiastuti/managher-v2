'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useProjectStore from '@/store/useProjectStore';
import Breadcrumb from '@/components/Breadcrumb';

import { 
  Lightbulb, CheckCircle, Palette, FileText, Box, Users, Rocket,
  Lock, Check, Sparkle 
} from 'lucide-react';

const PLAN_LEVELS = [
  { id: 1, title: "Ide Generator", phase: "plan", xp: 10, icon: Lightbulb, path: "level_1_idea" },
  { id: 2, title: "RWW Analysist", phase: "plan", xp: 10, icon: CheckCircle, path: "level_2_rww" },
  { id: 3, title: "Brand Identity", phase: "plan", xp: 10, icon: Palette, path: "level_3_product_brand" },
  { id: 4, title: "Lean Canvas", phase: "plan", xp: 10, icon: FileText, path: "level_4_lean_canvas" },
  { id: 5, title: "MVP", phase: "plan", xp: 10, icon: Box, path: "level_5_MVP" },
  { id: 6, title: "Beta Testing", phase: "plan", xp: 10, icon: Users, path: "level_6_beta_testing" },
  { id: 7, title: "Persiapan Launching", phase: "plan", xp: 10, icon: Rocket, path: "level_7_launch" },
];

export default function PlanLevelsPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const projects = useProjectStore((state) => state.projects);

  useEffect(() => {
    if (projectId) {
      const found = projects.find((p) => p.id === projectId);
      setProject(found);
    }
  }, [projectId, projects]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        Memuat...
      </div>
    );
  }

  const enrichedLevels = PLAN_LEVELS.map(level => {
    const existing = project?.levels?.find(l => l.id === level.id);
    return {
      ...level,
      completed: existing?.completed || false,
    };
  });

  const completedLevels = enrichedLevels.filter(l => l.completed);
  const currentXp = completedLevels.reduce((sum, l) => sum + l.xp, 0);
  const totalXp = PLAN_LEVELS.reduce((sum, l) => sum + l.xp, 0);
  const phaseProgress = Math.min(100, Math.floor((currentXp / totalXp) * 100));

  const firstIncompleteLevel = enrichedLevels.find(l => !l.completed);

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { label: 'Fase Plan' }
  ];

  const renderLevelBadge = (level) => {
    const isCompleted = level.completed;
    const isActive = level.id === firstIncompleteLevel?.id;

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
        className={`px-2.5 py-1.5 rounded-lg font-medium text-xs border ${bgColor} ${textColor} ${borderColor} flex flex-col items-center min-w-20`}
      >
        <div className="flex items-center justify-center w-5 h-5 mb-0.5">
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

  return (
    <div className="min-h-screen bg-white">
      <div className="px-3 sm:px-4 md:px-6 py-2 border-b border-gray-200 bg-white">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="max-w-4xl mx-auto mt-6 p-3 sm:p-4 md:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#5b5b5b] mb-4 sm:mb-6">Fase: Plan</h1>

        <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-[#5b5b5b] text-sm sm:text-base">XP Fase Plan: {currentXp} / {totalXp}</span>
            <span className="font-bold text-[#f02d9c] text-sm sm:text-base">{phaseProgress}%</span>
          </div>
          <div className="w-full bg-[#f0f0f0] rounded-full h-2 sm:h-2.5 border border-[#e0e0e0]">
            <div
              className="h-2 sm:h-2.5 rounded-full bg-[#f02d9c] transition-all duration-500"
              style={{ width: `${phaseProgress}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-[#7a7a7a] mt-2">
            {phaseProgress < 100
              ? `Lanjutkan ke Level ${firstIncompleteLevel?.id || ''} untuk menyelesaikan fase ini`
              : 'Fase Plan telah selesai!'}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {enrichedLevels.map((level) => {
            const isCompleted = level.completed;
            const isUnlocked = level.id <= (firstIncompleteLevel?.id || Infinity);
            const isActive = level.id === firstIncompleteLevel?.id;

            return (
              <div key={level.id} className="relative">
                <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-xl sm:rounded-2xl"></div>
                <div
                  className="relative bg-white rounded-xl sm:rounded-2xl border-t border-l border-black p-3 sm:p-5"
                  style={{ boxShadow: '1px 1px 0 0 #f02d9c' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div className="shrink-0">
                      {renderLevelBadge(level)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#5b5b5b] text-base sm:text-lg">{level.title}</h3>
                      <p className="text-xs sm:text-sm text-[#7a7a7a] mt-1 flex items-start gap-1">
                        {isCompleted ? (
                          <>
                            <Check size={14} className="text-green-600 mt-0.5 shrink-0" />
                            <span>Sudah selesai</span>
                          </>
                        ) : isActive ? (
                          <>
                            <Sparkle size={14} className="text-[#f02d9c] mt-0.5 shrink-0" />
                            <span>Siap dikerjakan — klik "Buka" untuk mulai</span>
                          </>
                        ) : !isUnlocked ? (
                          <>
                            <Lock size={14} className="text-gray-500 mt-0.5 shrink-0" />
                            <span>Belum bisa diakses — selesaikan level sebelumnya</span>
                          </>
                        ) : (
                          <>
                            <Sparkle size={14} className="text-[#f02d9c] mt-0.5 shrink-0" />
                            <span>Buka untuk lanjutkan</span>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="shrink-0 mt-2 sm:mt-0">
                      {isCompleted || isUnlocked ? (
                        <Link 
                          href={`/dashboard/${projectId}/plan/${level.path}`} 
                          className="group relative inline-block"
                        >
                          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-full"></div>
                          <div
                            className="relative px-3 py-1 sm:px-4 sm:py-1.5 bg-white rounded-full border-t border-l border-black font-medium text-black text-xs sm:text-sm
                              group-hover:bg-[#f02d9c] group-hover:text-white
                              group-hover:translate-x-1 group-hover:translate-y-1
                              transition-all duration-200 whitespace-nowrap"
                            style={{ boxShadow: '1px 1px 0 0 #f02d9c' }}
                          >
                            Buka
                          </div>
                        </Link>
                      ) : (
                        <div className="group relative inline-block opacity-70 cursor-not-allowed">
                          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-gray-300 rounded-full"></div>
                          <div
                            className="relative px-3 py-1 sm:px-4 sm:py-1.5 bg-white rounded-full border-t border-l border-gray-400 font-medium text-gray-500 text-xs sm:text-sm flex items-center gap-1"
                            style={{ boxShadow: '1px 1px 0 0 #d1d5db' }}
                          >
                            <Lock size={10} />
                            <span className="hidden sm:inline">Terkunci</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}