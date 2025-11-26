'use client';

import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, LogOut } from 'lucide-react';
import useProjectStore from '@/store/useProjectStore';

export default function Sidebar({ isSidebarOpen, toggleSidebar, isMobile }) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId;
  const { getProject, project } = useProjectStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  // getProject(projectId);
  // console.log(project);
  const userId = project?.user;

  const isInLevelPage = /\/plan\/level_[1-7]_[a-z]/.test(pathname);

  useEffect(() => {
    if (projectId) {
      getProject(projectId);
    }
  }, [projectId]);

  // Saat masuk halaman, set default collapsed jika di level
  useEffect(() => {
    if (isInLevelPage) {
      setIsCollapsed(true);
    }
  }, [isInLevelPage]);

  const handleToggle = () => {
    setIsCollapsed(prev => !prev);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_collapsed', String(!isCollapsed));
    }
  };

  if (!projectId) return null;
  if (isMobile && !isSidebarOpen) return null;

  const effectiveOpen = isMobile ? isSidebarOpen : !isCollapsed;
  const showTooltip = !effectiveOpen && !isMobile;

  const menuItems = [
    { name: 'Dashboard', href: `/dashboard/${projectId}`, icon: Home },
  ];

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={toggleSidebar} />
      )}

      <div
        className={`${
          isMobile 
            ? 'fixed inset-y-0 left-0 z-40 w-64' 
            : effectiveOpen ? 'w-64' : 'w-16'
        } flex flex-col border-r border-[#e0e0e0] bg-white transition-all duration-300 ease-in-out font-sans
        ${isMobile ? '' : 'sticky top-0 h-screen z-30'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 mb-2 relative z-10">
          <div className="flex items-center gap-2">
            {(effectiveOpen || isMobile) && (
              <>
              <Link href="/" className="flex items-center gap-2">
                <img src="/managher_logo.png" alt="ManagHer Logo" className="w-8 h-8" />
              </Link>
              <span className="text-lg font-bold text-[#f02d9c]">ManagHer</span>
              </>
            )}
          </div>

          {isMobile && isSidebarOpen ? (
            <button onClick={toggleSidebar} className="text-[#5b5b5b] hover:text-[#f02d9c] z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : !isMobile ? (
            <button
              onClick={handleToggle}
              className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 text-[#5b5b5b] hover:text-[#f02d9c] transition-colors z-10"
              aria-label={effectiveOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {effectiveOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </button>
          ) : null}
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={showTooltip ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  !effectiveOpen && !isMobile ? 'justify-center px-2' : ''
                } ${
                  isActive
                    ? 'bg-[#fbe2a7] text-[#f02d9c] font-medium border border-black'
                    : 'text-[#5b5b5b] hover:bg-[#fbe2a7] hover:text-[#f02d9c]'
                }`}
                onClick={() => isMobile && toggleSidebar()}
              >
                <Icon size={18} className={isActive ? 'text-[#f02d9c]' : 'text-[#7a7a7a]'} />
                {(effectiveOpen || isMobile) && item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 pb-4">
          <button
            onClick={() => {
              if (confirm('Yakin ingin keluar proyek?')) {
                router.push(`/onboarding/${userId}`);
              }
            }}
            title={showTooltip ? 'Keluar proyek' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm text-[#f02d9c] rounded-lg hover:bg-[#fbe2a7] transition-colors ${
              !effectiveOpen && !isMobile ? 'justify-center px-2' : ''
            }`}
          >
            <LogOut size={18} className="text-[#f02d9c]" />
            {(effectiveOpen || isMobile) && 'Keluar'}
          </button>
        </div>
      </div>
    </>
  );
}