'use client';

import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import Link from 'next/link';
import NotificationModal from '@/components/NotificationModal';

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');

  const closeModal = () => setShowModal(false);

  const handleLogin = async () => {
    const { username, password } = formData;
    if (!username.trim() || !password.trim()) {
      setModalMessage('Username dan kata sandi wajib diisi.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      setModalMessage(result.message || 'Login berhasil!');
      setModalType('success');
      setShowModal(true);
      setTimeout(() => {
        router.push(`/onboarding/${result.user.id}`);
      }, 1500);
    } else {
      setModalMessage(result.message || 'Login gagal. Coba lagi.');
      setModalType('error');
      setShowModal(true);
    }
  };


  return (
    <main className="min-h-screen flex items-center justify-center bg-white font-[Poppins] p-6">
      <div className="relative w-full max-w-sm">
        <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-2xl"></div>

        {/* Card utama */}
        <div
          className="relative bg-white text-[#5b5b5b] rounded-2xl border-t border-l border-black p-8"
          style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
        >
          <h1 className="text-2xl font-semibold mb-2 text-center">Selamat Datang</h1>
          <p className="text-center text-sm mb-6">
            Masuk ke akun <span className="font-semibold">ManagHer</span> Anda
          </p>

          {/* Input Username */}
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
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="flex-1 bg-transparent text-[#5b5b5b] text-sm placeholder:text-[#7a7a7a] focus:outline-none font-[Poppins]"
            />
          </div>

          {/* Input Password */}
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
              placeholder="Kata Sandi"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="flex-1 bg-transparent text-[#5b5b5b] text-sm placeholder:text-[#7a7a7a] focus:outline-none font-[Poppins]"
            />
          </div>

          {/* Tombol Login */}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-[#f02d9c] text-white rounded-lg py-2.5 font-medium 
              border-t border-l border-black 
              transition-all duration-200
              hover:bg-[#fbe2a7] hover:text-[#333333]
              hover:translate-x-0.5 hover:translate-y-0.5 font-[Poppins]"
            style={{ boxShadow: '3px 3px 0 0 #8acfd1' }}
          >
            Masuk
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center justify-center">
            <div className="h-px w-20 bg-black" />
            <span className="px-3 text-xs font-[Poppins]">atau</span>
            <div className="h-px w-20 bg-black" />
          </div>

          {/* Link Register */}
          <p className="text-sm text-center font-[Poppins]">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-black font-bold hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>

      {/* Komponen modal */}
      <NotificationModal
        isOpen={showModal}
        message={modalMessage}
        type={modalType}
        onClose={closeModal}
      />
    </main>
  );
}