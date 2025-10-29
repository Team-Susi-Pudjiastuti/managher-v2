'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import NotificationModal from '@/components/NotificationModal';

export default function RegisterPage() {
  const { register } = useAuthStore();
  const router = useRouter();

  // form state
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);

  const handleRegister = async () => {
    const { name, username, email, password, confirmPassword } = formData;

    // Validasi sederhana
    if (!name || !username || !email || !password) {
      setModalMessage('Semua field wajib diisi.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    if (password !== confirmPassword) {
      setModalMessage('Kata sandi tidak cocok.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    const result = await register(name, username, email, password);

    if (result.success) {
      setModalMessage(result.message || 'Pendaftaran berhasil!');
      setModalType('success');
      setShowModal(true);
      setTimeout(() => router.push('/auth/login'), 1500);
    } else {
      setModalMessage(result.message || 'Pendaftaran gagal.');
      setModalType('error');
      setShowModal(true);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white font-[Poppins] p-6">
      <div className="relative w-full max-w-sm">
        <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-2xl"></div>
        <div className="relative bg-white text-[#5b5b5b] rounded-2xl border-t border-l border-black p-8"
             style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}>
          <h1 className="text-2xl font-semibold mb-2 text-center">Buat Akun</h1>
          <p className="text-center text-sm mb-6">
            Daftar ke <span className="font-semibold">ManagHer</span> untuk memulai
          </p>

          {/* Nama */}
          <InputField icon={<User />} placeholder="Nama Lengkap"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

          {/* Username */}
          <InputField icon={<User />} placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })} />

          {/* Email */}
          <InputField icon={<Mail />} placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

          {/* Password */}
          <InputField icon={<Lock />} type="password" placeholder="Kata Sandi"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

          {/* Konfirmasi Password */}
          <InputField icon={<Lock />} type="password" placeholder="Konfirmasi Kata Sandi"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />

          {/* Tombol */}
          <button onClick={handleRegister}
            className="w-full bg-[#f02d9c] text-white rounded-lg py-2.5 font-medium 
              border-t border-l border-black transition-all duration-200
              hover:bg-[#fbe2a7] hover:text-[#333333] font-[Poppins]"
            style={{ boxShadow: '3px 3px 0 0 #8acfd1' }}>
            Daftar
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center justify-center">
            <div className="h-px w-20 bg-black"></div>
            <span className="px-3 text-xs text-[#5b5b5b] font-[Poppins]">atau</span>
            <div className="h-px w-20 bg-black"></div>
          </div>

          {/* Link Login */}
          <p className="text-sm text-center font-[Poppins]">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-black font-bold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* Modal Notifikasi */}
      <NotificationModal
        isOpen={showModal}
        message={modalMessage}
        type={modalType}
        onClose={closeModal}
      />
    </main>
  );
}

// Komponen input kecil biar rapi
function InputField({ icon, type = 'text', placeholder, value, onChange }) {
  return (
    <div
      className="flex items-center gap-2 border-t border-l border-black rounded-lg px-3 py-2 mb-4"
      style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
    >
      <div className="text-[#7a7a7a]" size={20} strokeWidth={2}>{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent text-[#5b5b5b] text-sm placeholder:text-[#7a7a7a] focus:outline-none font-[Poppins]"
      />
    </div>
  );
}
