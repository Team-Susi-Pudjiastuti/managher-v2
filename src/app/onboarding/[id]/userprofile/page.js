'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Trash2, Edit2, Upload } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { apiRequest } from '@/lib/api';

// ─────────────────────────────────────────────────────────────
// Komponen: Editable Row
// ─────────────────────────────────────────────────────────────
const EditableInfoRow = ({
  icon,
  label,
  value,
  onEdit,
  isEditing,
  editValue,
  onChange,
  onSave,
  onCancel
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-pink-500">{icon}</div>
    <div className="flex-1">
      <div className="flex justify-between items-start mb-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>

        {!isEditing && (
          <button
            onClick={onEdit}
            className="text-pink-600 hover:text-pink-700"
            aria-label={`Edit ${label}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editValue}
            onChange={onChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder={`Masukkan ${label.toLowerCase()}`}
          />

          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="px-3 py-1.5 text-xs bg-pink-600 text-white rounded hover:bg-pink-700"
            >
              Simpan
            </button>

            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 font-medium">{value || '—'}</p>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Komponen: Non-Editable Row
// ─────────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-pink-500">{icon}</div>
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-gray-800 font-medium">{value || '—'}</p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// HALAMAN UTAMA
// ─────────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, user, loadSession } = useAuthStore();

  // State
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [userData, setUserData] = useState(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fileInputRef = useRef(null);

  // Load user session
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Fetch user data directly from API to ensure correctness
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiRequest('me', 'GET');
        if (res.user) {
          setUserData(res.user);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  // Redirect jika tidak login
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  // Loading screen
  if (!isHydrated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white font-[Poppins]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f02d9c]"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center font-[Poppins]">
        <div className="text-center max-w-md">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#5b5b5b] mb-2">Data Tidak Ditemukan</h2>
          <p className="text-[#7a7a7a] mb-4">Gagal memuat informasi akun. Silakan coba login ulang.</p>
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

  // Variabel user (dibersihkan)
  const userName = user?.name || user?.username || '';
  const userUsername = user?.username || '';
  const userEmail = user?.email || '';

  // ───── Edit Handlers ─────
  const handleEdit = (field) => {
    setEditingField(field);
    setEditValues({ ...editValues, [field]: user[field] || '' });
  };

  const handleChange = (e) => {
    setEditValues({ ...editValues, [editingField]: e.target.value });
  };

  const handleSave = () => {
    console.log('Update field:', editingField, 'to:', editValues[editingField]);
    alert(`${editingField === 'name' ? 'Nama' : 'Username'} berhasil diubah!`);
    setEditingField(null);
  };

  const handleCancel = () => setEditingField(null);

  // ───── Avatar Upload ─────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);

    reader.readAsDataURL(file);
  };

  // ───── Password Handler ─────
  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Password baru dan konfirmasi tidak cocok!');
      return;
    }

    alert('Password berhasil diubah!');
    setIsEditingPassword(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // ───── Delete Handler ─────
  const handleDeleteAccount = () => {
    if (confirm('Yakin ingin menghapus akun? Semua data akan hilang permanen.')) {
      alert('Akun berhasil dihapus.');
      window.location.href = '/auth/login';
    }
  };

  // ─────────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f02d9c]">Profil Saya</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola informasi dan keamanan akun Anda
          </p>
        </div>

        {/* FOTO PROFIL */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">Foto Profil</h2>

          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                {avatar ? (
                  <img src={avatar} alt="Foto profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow"
                aria-label="Upload foto profil"
              >
                <Upload size={16} />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <p className="text-sm text-gray-600">Klik ikon upload untuk mengubah foto profil</p>
          </div>
        </div>

        {/* INFORMASI AKUN */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">Informasi Akun</h2>

          <div className="space-y-5">
            <EditableInfoRow
              icon={<User className="w-5 h-5" />}
              label="Nama"
              value={userName}
              isEditing={editingField === 'name'}
              editValue={editValues.name || userName}
              onEdit={() => handleEdit('name')}
              onChange={handleChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />

            <EditableInfoRow
              icon={<Edit2 className="w-5 h-5" />}
              label="Username"
              value={userUsername}
              isEditing={editingField === 'username'}
              editValue={editValues.username || userUsername}
              onEdit={() => handleEdit('username')}
              onChange={handleChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />

            <InfoRow
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              value={userEmail}
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Keamanan Akun</h2>

          {!isEditingPassword ? (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition font-medium text-sm flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> Ganti Kata Sandi
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Kata Sandi Lama
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm font-medium"
                >
                  Simpan
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditingPassword(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>

        {/* DELETE ACCOUNT */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-red-600 mb-3">Hapus Akun</h2>
          <p className="text-sm text-gray-600 mb-5">
            Semua data Anda akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
          </p>

          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-sm flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Hapus Akun Saya
          </button>
        </div>
      </div>
    </div>
  );
}
