'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useProjectStore from '@/store/useProjectStore';

// ✅ Ikon SVG sebagai komponen
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.666l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.816 1.387 2.816 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.911 15 5v.227l-4.5-.15a1.5 1.5 0 00-1.002 0L5 5.227V5c0-1.089.611-2.05 1.364-2.452zM7.5 10.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm4.5 0a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm3 0a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#000000] opacity-40">
    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('create'); // 'create' | 'edit'
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [manager, setManager] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { projects, addProject, updateProject, deleteProject } = useProjectStore();
  const router = useRouter();

  const fallbackImage = '/only-one-red-shoes.png';

  const openCreateModal = () => {
    setMode('create');
    setProjectName('');
    setManager('');
    setImagePreview(null);
    setCurrentProjectId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setMode('edit');
    setCurrentProjectId(project.id);
    setProjectName(project.name);
    setManager(project.manager);
    setImagePreview(project.imageUrl || fallbackImage);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!projectName.trim()) {
      alert('Nama proyek wajib diisi');
      return;
    }

    const imageUrl = imagePreview || fallbackImage;

    if (mode === 'create') {
      addProject({
        name: projectName.trim(),
        manager: manager.trim() || '-',
        imageUrl,
      });
    } else if (mode === 'edit' && currentProjectId) {
      updateProject(currentProjectId, {
        name: projectName.trim(),
        manager: manager.trim() || '-',
        imageUrl,
      });
    }

    closeModal();
  };

  const handleDelete = () => {
    if (currentProjectId && confirm('Yakin ingin menghapus proyek ini?')) {
      deleteProject(currentProjectId);
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#ffffff] p-4 sm:p-6">
      {/* Background decoration — optional */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-[#b80000]"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 rotate-45 bg-[#b80000]"></div>
      </div>

      {/* 🌟 HEADER CANTIK — Mirip Landing Page */}
      <header className="mb-10 relative">
        <div
          className="bg-[#ffffff] p-8 rounded-none shadow-[4px_4px_0_0_#000000]"
          style={{
            borderStyle: 'solid',
            borderTopWidth: '1px',
            borderLeftWidth: '1px',
            borderBottomWidth: '4px',
            borderRightWidth: '4px',
            borderColor: '#000000',
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Logo + Judul Utama */}
            <div className="flex items-center space-x-3">
              <img src="/only-shoes-logo-removebg.png" alt="ManagHer Logo" className="h-20 w-auto" />
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#b80000] mb-1">ManagHer</h1>
                <p className="text-lg text-[#000000] font-sans font-light">Proyek Bisnismu</p>
              </div>
            </div>
          </div>

          {/* Subjudul — Deskripsi Singkat */}
          <div className="mt-4 pt-4 border-t border-[#000000]">
            <p className="text-[#000000] font-sans font-light">
              Kelola semua proyek bisnismu dalam satu tempat — dari ide hingga eksekusi.
            </p>
          </div>
        </div>
      </header>

      {/* Daftar Proyek */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Tambah Proyek */}
        <div
          onClick={openCreateModal}
          className="group bg-[#ffffff] p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 hover:shadow-[6px_6px_0_0_#000000]"
          style={{
            borderStyle: 'solid',
            borderTopWidth: '1px',
            borderLeftWidth: '1px',
            borderBottomWidth: '4px',
            borderRightWidth: '4px',
            borderColor: '#000000',
          }}
        >
          <div
            className="w-16 h-16 flex items-center justify-center mb-4 transition-colors"
            style={{
              borderStyle: 'solid',
              borderTopWidth: '1px',
              borderLeftWidth: '1px',
              borderBottomWidth: '4px',
              borderRightWidth: '4px',
              borderColor: '#000000',
              backgroundColor: '#ffcccc',
            }}
          >
            <span className="text-3xl text-[#000000] font-bold">+</span>
          </div>
          <h3 className="font-bold text-[#000000] text-lg font-sans">Buat Proyek Baru</h3>
          <p className="text-[#000000] text-sm mt-1 font-sans font-light">Mulai bisnismu hari ini</p>
        </div>

        {/* Daftar Proyek */}
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-[#ffffff] flex flex-col overflow-hidden transition-all duration-200 hover:shadow-[6px_6px_0_0_#000000]"
            style={{
              borderStyle: 'solid',
              borderTopWidth: '1px',
              borderLeftWidth: '1px',
              borderBottomWidth: '4px',
              borderRightWidth: '4px',
              borderColor: '#000000',
            }}
          >
            <img
              src={project.imageUrl || fallbackImage}
              alt={project.name}
              className="h-32 object-cover w-full"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />

            <div className="p-6 flex flex-col flex-grow">
              <div className="mb-4">
                <h3 className="font-bold text-lg text-[#000000] font-sans">{project.name}</h3>
                <p className="text-[#000000] text-sm mt-1 flex items-center font-sans font-light">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                  {project.manager}
                </p>
              </div>

              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => router.push(`/dashboard/${project.id}`)}
                  className="flex-1 bg-[#b80000] text-white py-2 font-semibold font-sans transition-colors hover:bg-[#8B0000]"
                  style={{
                    borderStyle: 'solid',
                    borderTopWidth: '1px',
                    borderLeftWidth: '1px',
                    borderBottomWidth: '4px',
                    borderRightWidth: '4px',
                    borderColor: '#000000',
                  }}
                >
                  Buka
                </button>
                <button
                  onClick={() => openEditModal(project)}
                  className="w-10 h-10 flex items-center justify-center bg-[#ffcccc] text-[#000000] font-bold transition-colors hover:bg-[#ffa8a8]"
                  style={{
                    borderStyle: 'solid',
                    borderTopWidth: '1px',
                    borderLeftWidth: '1px',
                    borderBottomWidth: '4px',
                    borderRightWidth: '4px',
                    borderColor: '#000000',
                  }}
                  title="Edit"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Yakin ingin menghapus proyek ini?')) {
                      deleteProject(project.id);
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-[#ffcccc] text-[#b80000] font-bold transition-colors hover:bg-[#ffa8a8]"
                  style={{
                    borderStyle: 'solid',
                    borderTopWidth: '1px',
                    borderLeftWidth: '1px',
                    borderBottomWidth: '4px',
                    borderRightWidth: '4px',
                    borderColor: '#000000',
                  }}
                  title="Hapus"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-[#000000] font-sans font-light">
          <p>Belum ada proyek. Mulai dengan membuat yang pertama!</p>
        </div>
      )}

      {/* Modal — Create or Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className="bg-[#ffffff] w-full max-w-md p-7 font-sans"
            style={{
              borderStyle: 'solid',
              borderTopWidth: '1px',
              borderLeftWidth: '1px',
              borderBottomWidth: '4px',
              borderRightWidth: '4px',
              borderColor: '#000000',
              boxShadow: '4px 4px 0 0 #000000',
            }}
          >
            <div className="text-center mb-6">
              <div
                className="w-14 h-14 flex items-center justify-center mx-auto mb-3"
                style={{
                  borderStyle: 'solid',
                  borderTopWidth: '1px',
                  borderLeftWidth: '1px',
                  borderBottomWidth: '4px',
                  borderRightWidth: '4px',
                  borderColor: '#000000',
                  backgroundColor: '#ffcccc',
                }}
              >
                <span className="text-2xl text-[#b80000] font-bold">
                  {mode === 'create' ? '✨' : '✏️'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[#000000] font-sans">
                {mode === 'create' ? 'Buat Proyek Baru' : 'Edit Proyek'}
              </h2>
              <p className="text-[#000000] text-sm mt-1 font-sans font-light">
                {mode === 'create'
                  ? 'Isi detail proyek bisnismu'
                  : 'Perbarui detail proyek ini'}
              </p>
            </div>

            <div className="space-y-5">
              {/* Upload Gambar */}
              <div>
                <label className="block text-sm font-medium text-[#000000] mb-2 text-left font-sans">
                  Gambar Proyek
                </label>
                <div
                  onClick={triggerFileInput}
                  className="cursor-pointer hover:shadow-[4px_4px_0_0_#000000] transition-all"
                  style={{
                    borderStyle: 'dashed',
                    borderWidth: '2px',
                    borderColor: '#000000',
                    padding: '1rem',
                    textAlign: 'center',
                  }}
                >
                  {imagePreview ? (
                    <div className="mx-auto">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover mx-auto mb-2"
                        style={{
                          borderStyle: 'solid',
                          borderTopWidth: '1px',
                          borderLeftWidth: '1px',
                          borderBottomWidth: '4px',
                          borderRightWidth: '4px',
                          borderColor: '#000000',
                        }}
                      />
                      <p className="text-xs text-[#000000] font-sans font-light">Klik untuk ganti gambar</p>
                    </div>
                  ) : (
                    <div>
                      <UploadIcon />
                      <p className="text-sm text-[#000000] mt-2 font-sans font-light">Klik untuk unggah gambar</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Nama Proyek */}
              <div>
                <label className="block text-sm font-medium text-[#000000] mb-2 text-left font-sans">
                  Nama Proyek
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 outline-none font-sans"
                  style={{
                    borderStyle: 'solid',
                    borderTopWidth: '1px',
                    borderLeftWidth: '1px',
                    borderBottomWidth: '4px',
                    borderRightWidth: '4px',
                    borderColor: '#000000',
                  }}
                  placeholder="Contoh: Toko Bunga Online"
                />
              </div>

              {/* Nama Manajer */}
              <div>
                <label className="block text-sm font-medium text-[#000000] mb-2 text-left font-sans">
                  Nama Manajer
                </label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  className="w-full px-4 py-3 outline-none font-sans"
                  style={{
                    borderStyle: 'solid',
                    borderTopWidth: '1px',
                    borderLeftWidth: '1px',
                    borderBottomWidth: '4px',
                    borderRightWidth: '4px',
                    borderColor: '#000000',
                  }}
                  placeholder="Opsional"
                />
              </div>

              {/* Tombol */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 font-medium text-[#000000] hover:bg-[#f0f0f0] transition-colors font-sans"
                  style={{
                    borderStyle: 'solid',
                    borderTopWidth: '1px',
                    borderLeftWidth: '1px',
                    borderBottomWidth: '4px',
                    borderRightWidth: '4px',
                    borderColor: '#000000',
                  }}
                >
                  Batal
                </button>

                {mode === 'edit' && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-3 bg-[#000000] text-white font-medium font-sans"
                    style={{
                      borderStyle: 'solid',
                      borderTopWidth: '1px',
                      borderLeftWidth: '1px',
                      borderBottomWidth: '4px',
                      borderRightWidth: '4px',
                      borderColor: '#000000',
                    }}
                  >
                    Hapus
                  </button>
                )}

                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#b80000] text-white px-4 py-3 font-semibold font-sans hover:bg-[#8B0000] transition-colors"
                  style={{
                    borderStyle: 'solid',
                    borderTopWidth: '1px',
                    borderLeftWidth: '1px',
                    borderBottomWidth: '4px',
                    borderRightWidth: '4px',
                    borderColor: '#000000',
                  }}
                >
                  {mode === 'create' ? 'Simpan' : 'Perbarui'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}