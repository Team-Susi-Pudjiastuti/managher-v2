'use client';

import useProjectStore from '@/store/useProjectStore';
import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import useProjectStore from '@/store/useProjectStore';

export default function ProjectCard({ project, onClick }) {
  // const totalLevels = 12; 
  // const completedLevels = project.levels.filter((l) => l.completed).length;
  // const progress = Math.min(100, Math.floor((completedLevels / totalLevels) * 100));
  // const isCompleted = completedLevels === totalLevels;
  const id = project._id;
  const { getLevels, levels, deleteProject} = useProjectStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    getLevels(id);
  }, [id]);

  const totalLevels = levels.length;
  const completedLevels = levels.filter((l) => l.completed).length;
  const progress = Math.min(100, Math.floor((completedLevels / totalLevels) * 100));
  const isCompleted = completedLevels === totalLevels;

  const openDeleteModal = (e) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteProject(project.id);
    setIsDeleteModalOpen(false);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div onClick={onClick} className="group relative cursor-pointer">
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-[#f02d9c] rounded-2xl"></div>

      {/* Card utama */}
      <div
        className="relative bg-white rounded-2xl border-t border-l border-black p-5
          transition-all duration-300 ease-out
          group-hover:translate-x-1.5 group-hover:translate-y-1.5"
        style={{ boxShadow: '3px 3px 0 0 #f02d9c' }}
      >
        <button
          type="button"
          onClick={openDeleteModal}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center 
            rounded-full bg-[#ffe0e9] text-[#f02d9c] hover:bg-[#ffccd9] transition-colors z-10"
          aria-label="Hapus proyek"
        >
          <Trash2 size={14} />
        </button>

        <h3 className="font-bold text-[#5b5b5b] text-lg mb-2 truncate font-[Poppins]">
          {project.title}
        </h3>

        <p className="text-[#7a7a7a] text-sm mb-3 font-[Poppins]">
          Level: <span className="font-semibold">
          {completedLevels}/{totalLevels}
          </span> 
        </p>

        <div className="w-full bg-[#f0f0f0] rounded-full h-2 border border-[#e0e0e0] mb-2">
          <div
            className="bg-[#f02d9c] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#7a7a7a] text-xs font-[Poppins]">{progress}%</span>
          {isCompleted ? (
            <span className="flex items-center gap-1 text-[#8acfd1] text-xs font-semibold font-[Poppins]">
              <CheckCircle size={14} />
              Selesai!
            </span>
          ) : (
            <span className="text-[#f02d9c] text-xs font-semibold font-[Poppins]">Lanjutkan</span>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={cancelDelete}
        >
          <div
            className="bg-[#f96f70] text-white rounded-2xl p-6 max-w-xs w-full text-center border-t border-l border-white"
            style={{ boxShadow: '3px 3px 0 0 rgba(255,255,255,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <Trash2 size={20} color="#f96f70" />
              </div>
            </div>

            <p className="font-semibold text-lg font-[Poppins]">
              Hapus proyek?
            </p>
            <p className="text-sm mt-1 opacity-90 font-[Poppins]">
              "{project.name}" akan dihapus permanen.
            </p>

            <div className="flex gap-3 mt-5">
              <button
                onClick={cancelDelete}
                className="flex-1 px-3 py-2 rounded-lg font-medium font-[Poppins] bg-white text-[#f96f70] border-t border-l border-white transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
                style={{ boxShadow: '2px 2px 0 0 rgba(255,255,255,0.5)' }}
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-3 py-2 rounded-lg font-medium font-[Poppins] bg-[#fbe2a7] text-[#333333] border-t border-l border-black transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
                style={{ boxShadow: '2px 2px 0 0 #000000' }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}