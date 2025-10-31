'use client';

import useProjectStore from '@/store/useProjectStore';
import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  // const totalLevels = 12; 
  // const completedLevels = project.levels.filter((l) => l.completed).length;
  // const progress = Math.min(100, Math.floor((completedLevels / totalLevels) * 100));
  // const isCompleted = completedLevels === totalLevels;
  const id = project._id;
  const { getLevels, levels} = useProjectStore();

  useEffect(() => {
    getLevels(id);
  }, [id]);

  const totalLevels = levels.length;
  const completedLevels = levels.filter((l) => l.completed).length;
  const progress = Math.min(100, Math.floor((completedLevels / totalLevels) * 100));
  const isCompleted = completedLevels === totalLevels;

  console.log(project.title);
  console.log(totalLevels);


  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-[#f02d9c] rounded-2xl"></div>

      {/* Card utama */}
      <div
        className="relative bg-white rounded-2xl border-t border-l border-black p-5
          transition-all duration-300 ease-out
          group-hover:translate-x-1.5 group-hover:translate-y-1.5"
        style={{ boxShadow: '3px 3px 0 0 #f02d9c' }}
      >
        {/* Judul Proyek */}
        <h3 className="font-bold text-[#5b5b5b] text-lg mb-2 truncate font-[Poppins]">
          {project.title}
        </h3>

        {/* Status Level: 0/12 */}
        <p className="text-[#7a7a7a] text-sm mb-3 font-[Poppins]">
          Level: <span className="font-semibold">
          {completedLevels}/{totalLevels}
          </span> 
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-[#f0f0f0] rounded-full h-2 border border-[#e0e0e0] mb-2">
          <div
            className="bg-[#f02d9c] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}>
          </div>
        </div>

        {/* Persentase & Status */}
        <div className="flex justify-between items-center">
          <span className="text-[#7a7a7a] text-xs font-[Poppins]">
            {progress}%
          </span>
          {isCompleted ? (
            <span className="flex items-center gap-1 text-[#8acfd1] text-xs font-semibold font-[Poppins]">
              <CheckCircle size={14} />
              Selesai!
            </span>
          ) : (
            <span className="text-[#f02d9c] text-xs font-semibold font-[Poppins]">
              Lanjutkan
            </span>
          )}
        </div>
      </div>
    </div>
  );
}