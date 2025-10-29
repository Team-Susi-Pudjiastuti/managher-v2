'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import useProjectStore from '@/store/useProjectStore';

import { 
  LayoutDashboard, Lightbulb, CheckCircle, Palette, 
  FileText, Box, Users, Rocket 
} from 'lucide-react';

export default function PlanSidebar({ 
  projectId, 
  currentLevelId = 'overview',
  isMobile = false,
  mobileSidebarOpen = false,
  setMobileSidebarOpen = () => {}
}) {
  const pathname = usePathname();
  const projects = useProjectStore((state) => state.projects);
  const project = projects.find(p => p.id === projectId);

  // State lokal untuk PlanSidebar
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('plan_sidebar_collapsed') === 'true';
    }
    return false;
  });

  // Hanya saat pertama masuk Level 1–7: collapse otomatis
  useEffect(() => {
    const isInLevelPage = /\/plan\/level[1-7]/.test(pathname);
    if (isInLevelPage) {
      setIsCollapsed(true);
      localStorage.setItem('plan_sidebar_collapsed', 'true');
    }
  }, [pathname]);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('plan_sidebar_collapsed', String(newState));
  };

  const closeMobileSidebar = () => {
    if (isMobile) setMobileSidebarOpen(false);
  };

  const showText = isMobile ? mobileSidebarOpen : !isCollapsed;

  if (isMobile && !mobileSidebarOpen) return null;

  const sidebarItems = [
    { id: 'overview', title: 'Overview', icon: LayoutDashboard, href: `/dashboard/${projectId}` },
    { id: 1, title: 'Ide Generator', icon: Lightbulb, href: `/dashboard/${projectId}/plan/level1` },
    { id: 2, title: 'RWW Analysist', icon: CheckCircle, href: `/dashboard/${projectId}/plan/level2` },
    { id: 3, title: 'Brand Identity', icon: Palette, href: `/dashboard/${projectId}/plan/level3` },
    { id: 4, title: 'Lean Canvas', icon: FileText, href: `/dashboard/${projectId}/plan/level4` },
    { id: 5, title: 'MVP', icon: Box, href: `/dashboard/${projectId}/plan/level5` },
    { id: 6, title: 'Beta Testing', icon: Users, href: `/dashboard/${projectId}/plan/level6` },
    { id: 7, title: 'Persiapan Launching', icon: Rocket, href: `/dashboard/${projectId}/plan/level7` }
  ];

  const isLevelCompleted = (id) => {
    if (id === 'overview') return true;
    return project?.levels?.[id - 1]?.completed || false;
  };

  const isActive = (id) => id === currentLevelId;

  return (
    <>
      {isMobile && mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={closeMobileSidebar} />
      )}

      <div
        className={`${
          isMobile 
            ? 'fixed inset-y-0 left-0 z-40 w-64' 
            : 'lg:sticky lg:top-0 lg:z-0'
        } bg-white transition-all duration-300 ease-in-out ${
          isMobile ? '' : (isCollapsed ? 'w-12' : 'w-64')
        }`}
      >
        <div className="px-4 pt-4 lg:p-0 mb-4">
          <div
            className={`bg-white rounded-2xl border-t border-l border-black flex items-center ${
              !showText ? 'w-10 h-10 justify-center' : 'p-3 justify-between'
            }`}
            style={{ boxShadow: '1px 1px 0 0 #fbe2a7' }}
          >
            {!showText ? (
              <button
                onClick={isMobile ? closeMobileSidebar : handleToggle}
                className="text-[#5b5b5b] hover:text-[#f02d9c]"
                aria-label="Toggle"
              >
                <MenuIcon size={16} />
              </button>
            ) : (
              <>
                <div className="flex items-center space-x-2 min-w-0">
                  <MenuIcon size={18} className="text-[#5b5b5b]" />
                  <span className="font-bold text-[#5b5b5b] truncate">Menu</span>
                </div>
                {isMobile ? (
                  <button onClick={closeMobileSidebar} className="text-[#5b5b5b] hover:text-[#f02d9c]">
                    <X size={18} />
                  </button>
                ) : (
                  <button onClick={handleToggle} className="text-[#5b5b5b] hover:text-[#f02d9c]">
                    ←
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="px-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const completed = isLevelCompleted(item.id);
            const active = isActive(item.id);

            let bgColor = 'bg-gray-100', textColor = 'text-gray-500', borderColor = 'border-gray-300';
            if (active) {
              bgColor = 'bg-[#f02d9c]';
              textColor = 'text-white';
              borderColor = 'border-black';
            } else if (completed) {
              bgColor = 'bg-[#8acfd1]';
              textColor = 'text-[#0a5f61]';
              borderColor = 'border-black';
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={isMobile ? closeMobileSidebar : undefined}
                title={!showText ? item.title : undefined}
                className={`group block rounded-lg border ${borderColor} ${bgColor} ${textColor} transition-all ${
                  !showText
                    ? 'w-10 h-10 flex items-center justify-center mx-auto hover:bg-[#fbe2a7] hover:text-[#5b5b5b]'
                    : 'p-3 flex items-center hover:bg-[#fbe2a7] hover:text-[#5b5b5b]'
                }`}
              >
                <Icon size={!showText ? 16 : 18} className="shrink-0" />
                {showText && <span className="ml-3 font-medium truncate">{item.title}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}