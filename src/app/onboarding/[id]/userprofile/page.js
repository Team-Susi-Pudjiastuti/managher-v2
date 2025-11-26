'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, LogOut } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';

// Fungsi untuk ambil inisial
const getInitials = (name, username, email) => {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
  if (username) {
    return username.substring(0, 2).toUpperCase();
  }
  if (email) {
    return email.substring(0, 2).toUpperCase();
  }
  return 'UB';
};

export default function UserProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, user, loadSession, logout } = useAuthStore();

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f02d9c]"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#5b5b5b] mb-2">Data Tidak Ditemukan</h2>
          <p className="text-[#7a7a7a] mb-4">Gagal memuat informasi akun.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-4 py-2 bg-[#f02d9c] text-white rounded-lg hover:bg-[#d7488e] text-sm font-medium"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const initials = getInitials(user.name, user.username, user.email);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#f02d9c]">Profil Saya</h1>
          <p className="text-gray-500 mt-1">Informasi akun Anda</p>
        </div>

        {/* === PROFIL (Foto di atas, data di bawah) === */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border">
          {/* Foto Profil - di tengah atas */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow">
              {user.avatar ? (
                <img src={user.avatar} alt="Foto profil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#f02d9c] flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{initials}</span>
                </div>
              )}
            </div>
          </div>

          {/* Informasi Akun */}
          <div>
            <h2 className="text-lg font-semibold text-center mb-4">Informasi Akun</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-pink-500"><User className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nama</p>
                  <p className="text-gray-800 font-medium">{user.name || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-pink-500"><Mail className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-gray-800 font-medium">{user.email || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-pink-500"><User className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Username</p>
                  <p className="text-gray-800 font-medium">{user.username || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === LOGOUT === */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-white text-[#f02d9c] border border-[#f02d9c] rounded-lg hover:bg-pink-50 transition font-medium flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </div>
    </div>
  );
}