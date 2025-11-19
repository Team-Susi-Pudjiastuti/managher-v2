'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import useProjectStore from '@/store/useProjectStore';
import useAuthStore from '@/store/useAuthStore';
import ProjectCard from '@/components/ProjectCard';
import { LogOut, UserCircle2, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const params = useParams();
  const id = params.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { projects, getAllprojects, addProject } = useProjectStore();
  const router = useRouter();
  const { logout, isAuthenticated, loadSession, isHydrated } = useAuthStore();

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  useEffect(() => {
      if (id) {
        getAllprojects(id);
      }
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-6 h-6 text-[#f02d9c] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // sedang redirect
  }

  const openModal = () => {
    setProjectName('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreate = async () => {
    if (!projectName.trim()) return;

    setIsCreating(true);
    await addProject(id, projectName);
    setIsCreating(false);
    setIsModalOpen(false);
    await getAllprojects(id);

  };

  return (
    <div className="min-h-screen bg-white font-[Poppins] p-3 sm:p-4 md:p-6 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        {/* Header */}
        <div className="relative w-full">
        {/* === Bar atas: Logout kiri & Profil kanan === */}
        <div className="flex justify-between items-center px-4 sm:px-6 mb-4">
          {/* Icon Profil */}
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition"
            title="Profile"
            onClick={() => {
              router.push('/profile');
            }}
          >
            <UserCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#5b5b5b]" />
          </button>

          {/* Tombol Logout */}
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition"
            title="Logout"
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin logout?')) {
                logout();
                router.push('/auth/login');
              }
            }}
          >
            <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-[#f02d9c]" />
          </button>

        </div>

        {/* === Teks tengah === */}
        <div className="text-center mb-6 sm:mb-8 px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#5b5b5b] mb-2">
            Selamat Datang di <span className="text-[#f02d9c]">ManagHer</span>
          </h1>
          <p className="text-[#7a7a7a] text-xs sm:text-sm md:text-base max-w-md mx-auto px-1">
            Rancang, kelola, dan wujudkan ide bisnismu bersama komunitas perempuan inovatif
          </p>
        </div>
      </div>

        {/* Card "Buat Proyek Baru" */}
        <div className="relative mb-6 sm:mb-8 w-full max-w-xs">
          <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-2xl"></div>
          <div
            className="relative bg-white rounded-2xl border-t border-l border-black p-5 sm:p-6 text-center cursor-pointer group
              hover:translate-x-1 hover:translate-y-1 transition-transform duration-200"
            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
            onClick={openModal}
          >
            <div className="flex justify-center mb-2 sm:mb-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#fbe2a7] border-t border-l border-black flex items-center justify-center 
                group-hover:bg-[#f02d9c] transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[#333333] group-hover:text-white transition-colors duration-200"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h2 className="font-semibold text-[#5b5b5b] text-sm sm:text-base">Buat Proyek Baru</h2>
            <p className="text-[#7a7a7a] text-xs mt-1 opacity-90">Mulai dari ide sederhana</p>
          </div>
        </div>

        {/* Daftar Proyek */}
        {projects.length > 0 && (
          <>
            <h2 className="text-base sm:text-lg font-semibold text-[#5b5b5b] mb-3 sm:mb-4 text-center px-1">
              Proyekmu
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl px-1">
            {projects
              .filter((p) => p && p._id)
              .map((project, index) => (
                <ProjectCard
                  key={project._id || `temp-${index}`}
                  project={project}
                  onClick={() => router.push(`/dashboard/${project._id}`)}
                />
              ))}

            </div>
          </>
        )}

        {projects.length === 0 && (
          <div className="text-center py-4 sm:py-6 px-2 mt-4">
            <div className="inline-block p-2.5 sm:p-3 rounded-full bg-[#f9f9f9] border border-dashed border-[#e0e0e0] mb-2 sm:mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 sm:w-10 sm:h-10 text-[#b0b0b0]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-[#7a7a7a] text-xs sm:text-sm max-w-xs mx-auto px-1">
              Belum ada proyek. Klik card di atas untuk membuat yang pertama!
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-2xl border-t border-l border-black p-4 sm:p-5 w-full max-w-xs sm:max-w-sm"
            style={{ boxShadow: '3px 3px 0 0 #8acfd1' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#8acfd1] rounded-2xl -z-10"></div>

            <h3 className="font-semibold text-[#5b5b5b] text-center mb-2 sm:mb-3 text-sm sm:text-base">
              Buat Proyek Baru
            </h3>

            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Nama proyekmu..."
              className="w-full px-3 py-1.5 sm:px-3.5 sm:py-2 mb-3 sm:mb-4 bg-transparent border-t border-l border-black rounded-lg text-[#5b5b5b] placeholder:text-[#7a7a7a] focus:outline-none text-xs sm:text-sm"
              style={{ boxShadow: '2px 2px 0 0 #8acfd1' }}
              autoFocus
            />

            <div className="flex gap-2">
              <button
                onClick={closeModal}
                className="flex-1 py-1.5 sm:py-2 font-medium rounded-lg border-t border-l border-black bg-[#f9f9f9] text-[#5b5b5b] 
                  hover:bg-[#e4e4e4] transition-colors shadow-[2px_2px_0_0_#000000] text-xs sm:text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleCreate}
                disabled={!projectName.trim() || isCreating}
                className={`flex-1 py-1.5 sm:py-2 font-medium rounded-lg border-t border-l transition-all text-xs sm:text-sm
                  ${projectName.trim()
                    ? 'bg-[#f02d9c] text-white border-black hover:bg-[#d7488e] hover:translate-x-0.5 hover:translate-y-0.5 shadow-[2px_2px_0_0_#8acfd1]'
                    : 'bg-[#f0c2d9] text-[#7a7a7a] border-[#f0c2d9] cursor-not-allowed shadow-[2px_2px_0_0_#f0c2d9]'
                  }`}
              >
                Buat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}