// /components/AchievementCard.jsx
import { Award, Lightbulb } from 'lucide-react';

export default function AchievementCard({ levelData }) {
  const xp = levelData?.xp || 0;
  const badge = levelData?.badge || '';

  return (
    <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Award size={16} className="text-[#f02d9c]" />
        <span className="font-bold text-[#5b5b5b]">Pencapaian</span>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-[#f02d9c] text-white px-3 py-1.5 rounded-full text-xs font-bold">
          <Lightbulb size={12} /> +{xp} XP
        </div>
        <div className="flex items-center gap-1.5 bg-[#8acfd1] text-[#0a5f61] px-3 py-1.5 rounded-full text-xs font-bold">
          <Award size={12} /> {badge}
        </div>
      </div>
      <p className="mt-3 text-xs text-[#5b5b5b]">
        Kumpulkan XP & badge untuk naik pangkat dari Zero ke CEO!
      </p>
    </div>
  );
}