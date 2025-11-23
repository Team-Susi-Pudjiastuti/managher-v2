// /components/PlanProgressCard.jsx
'use client';

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

const PhaseProgressBar = ({ currentXp, totalXp }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculatedProgress = totalXp > 0 ? Math.min(100, Math.floor((currentXp / totalXp) * 100)) : 0;
    setProgress(calculatedProgress);
  }, [currentXp, totalXp]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 w-full">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-bold text-[#5b5b5b]">
          XP Fase Plan: {currentXp} / {totalXp}
        </span>
        <span className="text-xs font-bold text-[#f02d9c]">{progress}%</span>
      </div>
      <div className="w-full bg-[#f0f0f0] rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full bg-[#f02d9c] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {progress >= 100 && (
        <p className="text-[10px] text-[#7a7a7a] mt-1 text-right">Selesai!</p>
      )}
    </div>
  );
};

export default function PlanProgressCard({ currentXp, totalXp }) {
  return (
    <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={16} className="text-[#f02d9c]" />
        <span className="font-bold text-[#5b5b5b]">Progress Fase Plan</span>
      </div>
      <PhaseProgressBar currentXp={currentXp} totalXp={totalXp} />
    </div>
  );
}