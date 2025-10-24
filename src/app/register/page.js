'use client';

import { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NotificationModal from '@/components/NotificationModal'; // Sesuaikan path jika perlu

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const router = useRouter();

  const handleRegister = () => {
    if (!name || !email || !password) {
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

    setModalMessage('Pendaftaran berhasil!');
    setModalType('success');
    setShowModal(true);

    setTimeout(() => {
      router.push('/onboarding');
    }, 1500);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white font-[Poppins] p-6">
      <div className="relative w-full max-w-sm">
        {/* Bayangan PINK di belakang card */}
        <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-2xl"></div>

        {/* Card utama */}
        <div
          className="relative bg-white text-[#5b5b5b] rounded-2xl border-t border-l border-black p-8"
          style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
        >
          <h1 className="text-2xl font-semibold mb-2 text-center">
            Buat Akun
          </h1>
          <p className="text-center text-sm mb-6">
            Daftar ke <span className="font-semibold">ManagHer</span> untuk memulai
          </p>

          {/* Input Nama */}
          <div
            className="flex items-center gap-2 border-t border-l border-black rounded-lg px-3 py-2 mb-4"
            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px #fbe2a7';
              e.currentTarget.style.border = '1px solid #fbe2a7';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = '2px 2px 0 0 #f02d9c';
              e.currentTarget.style.border = '1px solid black';
            }}
            tabIndex={-1}
          >
            <User className="text-[#7a7a7a]" size={20} strokeWidth={2} />
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-transparent text-[#5b5b5b] text-sm placeholder:text-[#7a7a7a] focus:outline-none font-[Poppins]"
            />
          </div>

          {/* Input Email */}
          <div
            className="flex items-center gap-2 border-t border-l border-black rounded-lg px-3 py-2 mb-4"
            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px #fbe2a7';
              e.currentTarget.style.border = '1px solid #fbe2a7';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = '2px 2px 0 0 #f02d9c';
              e.currentTarget.style.border = '1px solid black';
            }}
            tabIndex={-1}
          >
            <Mail className="text-[#7a7a7a]" size={20} strokeWidth={2} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-[#5b5b5b] text-sm placeholder:text-[#7a7a7a] focus:outline-none font-[Poppins]"
            />
          </div>

          {/* Input Kata Sandi */}
          <div
            className="flex items-center gap-2 border-t border-l border-black rounded-lg px-3 py-2 mb-4"
            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px #fbe2a7';
              e.currentTarget.style.border = '1px solid #fbe2a7';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = '2px 2px 0 0 #f02d9c';
              e.currentTarget.style.border = '1px solid black';
            }}
            tabIndex={-1}
          >
            <Lock className="text-[#7a7a7a]" size={20} strokeWidth={2} />
            <input
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-[#5b5b5b] text-sm placeholder:text-[#7a7a7a] focus:outline-none font-[Poppins]"
            />
          </div>

          {/* Input Konfirmasi Kata Sandi */}
          <div
            className="flex items-center gap-2 border-t border-l border-black rounded-lg px-3 py-2 mb-6"
            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px #fbe2a7';
              e.currentTarget.style.border = '1px solid #fbe2a7';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = '2px 2px 0 0 #f02d9c';
              e.currentTarget.style.border = '1px solid black';
            }}
            tabIndex={-1}
          >
            <Lock className="text-[#7a7a7a]" size={20} strokeWidth={2} />
            <input
              type="password"
              placeholder="Konfirmasi Kata Sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 bg-transparent text-[#5b5b5b] text-sm placeholder:text-[#7a7a7a] focus:outline-none font-[Poppins]"
            />
          </div>

          {/* Tombol Daftar */}
          <button
            type="button"
            onClick={handleRegister}
            className="w-full bg-[#f02d9c] text-white rounded-lg py-2.5 font-medium 
              border-t border-l border-black 
              transition-all duration-200
              hover:bg-[#fbe2a7] hover:text-[#333333]
              hover:translate-x-0.5 hover:translate-y-0.5 font-[Poppins]"
            style={{ boxShadow: '3px 3px 0 0 #8acfd1' }}
          >
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
            <Link href="/login" className="text-black font-bold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* Gunakan komponen modal */}
      <NotificationModal
        isOpen={showModal}
        message={modalMessage}
        type={modalType}
        onClose={closeModal}
      />
    </main>
  );
}