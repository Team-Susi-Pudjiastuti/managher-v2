'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation'; // ✅ tambahkan useParams
import { Home, FileText, Settings, LogOut, Sparkle } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const params = useParams(); // ✅ dapatkan semua params
  const projectId = params.projectId; // ✅ ambil projectId dari [projectId]

  // Jika belum ada projectId (misal di halaman lain), jangan render link
  if (!projectId) {
    return null;
  }

  const menuItems = [
    { name: 'Dashboard', href: `/dashboard/${projectId}`, icon: Home },
    { name: 'Profile Bisnis', href: `/dashboard/${projectId}/profile`, icon: FileText },
    { name: 'Settings', href: `/dashboard/${projectId}/settings`, icon: Settings },
  ];

  return (
    <div className="flex h-full flex-col border-r border-[#e0e0e0] bg-white w-64 p-4 font-[Poppins]">
      {/* Logo ManagHer dengan Sparkle */}
      <div className="flex items-center gap-2 mb-8">
        <Sparkle size={24} className="text-[#f02d9c]" />
        <span className="text-lg font-bold text-[#f02d9c]">ManagHer</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#fbe2a7] text-[#f02d9c] font-medium border border-black'
                  : 'text-[#5b5b5b] hover:bg-[#fbe2a7] hover:text-[#f02d9c]'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-[#f02d9c]' : 'text-[#7a7a7a]'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => {
          if (confirm('Yakin ingin keluar?')) {
            window.location.href = '/login';
          }
        }}
        className="mt-4 flex items-center gap-3 px-3 py-2.5 text-sm text-[#f02d9c] rounded-lg hover:bg-[#fbe2a7]"
      >
        <LogOut size={18} className="text-[#f02d9c]" />
        Logout
      </button>
    </div>
  );
}