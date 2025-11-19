'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import useProjectStore from '@/store/useProjectStore';

import {
  LayoutDashboard,
  Lightbulb,
  CheckCircle,
  Palette,
  FileText,
  Box,
  Users,
  Rocket,
} from 'lucide-react';

export default function PlanSidebar({
  currentLevelId = 'overview',
  isMobile = false,
  mobileSidebarOpen = false,
  setMobileSidebarOpen = () => {},
}) {
  const { planLevels } = useProjectStore();
  const pathname = usePathname();
  const projectId = planLevels?.[0]?.project._id;

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('plan_sidebar_collapsed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const isInLevelPage = /\/plan\/level_[1-7]_[a-z]/.test(pathname);
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

  const sidebarItems = [
    { id: 'overview', title: 'Overview', icon: LayoutDashboard, href: `/dashboard/${projectId}` },
    { id: 1, title: 'Ide Generator', icon: Lightbulb, href: `/dashboard/${projectId}/plan/level_1_idea/${planLevels?.[0]?.entities[0]?.entity_ref}` },
    { id: 2, title: 'RWW Analysis', icon: CheckCircle, href: `/dashboard/${projectId}/plan/level_2_rww/${planLevels?.[1]?.entities[0]?.entity_ref}` },
    { id: 3, title: 'Brand Identity', icon: Palette, href: `/dashboard/${projectId}/plan/level_3_product_brand/${planLevels?.[2]?.entities[0]?.entity_ref}` },
    { id: 4, title: 'Lean Canvas', icon: FileText, href: `/dashboard/${projectId}/plan/level_4_lean_canvas/${planLevels?.[3]?.entities[0]?.entity_ref}` },
    { id: 5, title: 'Prototype', icon: Box, href: `/dashboard/${projectId}/plan/level_5_MVP/${planLevels?.[4]?.entities[0]?.entity_ref}` },
    { id: 6, title: 'Beta Testing', icon: Users, href: `/dashboard/${projectId}/plan/level_6_beta_testing/${planLevels?.[5]?.entities[0]?.entity_ref}` },
    { id: 7, title: 'Persiapan Launching', icon: Rocket, href: `/dashboard/${projectId}/plan/level_7_launch/${planLevels?.[6]?.entities[0]?.entity_ref}` }
  ];

  const isLevelCompleted = (order) => {
    if (order === 'overview') return true;
    return planLevels?.[order - 1]?.completed || false;
  };

  const isActive = (order) => {
      const index = sidebarItems.findIndex(item => item.id === order);

      const completed = isLevelCompleted(order);

      if (completed) return false;

      if (index === 0) return true;

      const prev = sidebarItems[index - 1];

      return isLevelCompleted(prev.id);
  };

  const showText = isMobile ? mobileSidebarOpen : !isCollapsed;

  if (isMobile && !mobileSidebarOpen) {
    return null;
  }

  return (
    <>
      {isMobile && mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <div
        className={`${
          isMobile
            ? 'fixed inset-y-0 left-0 z-40 w-64'
            : 'lg:sticky lg:top-0 lg:z-0'
        }
        bg-white transition-all duration-300 ease-in-out
        ${isMobile ? '' : isCollapsed ? 'w-12' : 'w-64'}
        `}
      >
        <div className="px-4 pt-4 lg:p-0 mb-4">
          <div
            className={`bg-white rounded-2xl border-t border-l border-black flex items-center ${
              !showText
                ? 'w-10 h-10 justify-center'
                : 'p-3 justify-between'
            }
            ${ isMobile ? '' : isCollapsed ? 'ml-4' : '' }`}
            style={{
              boxShadow: '1px 1px 0 0 #fbe2a7',
            }}
          >
            {!showText ? (
                <button
                  onClick={isMobile ? closeMobileSidebar : handleToggle}
                  className={`text-[#5b5b5b] hover:text-[#f02d9c] transition-colors flex items-center justify-center`}
                  aria-label="Toggle sidebar"
                >
                  <MenuIcon size={16} />
                </button>
            ) : (
              <>
                <div className="flex items-center space-x-2 min-w-0">
                  <MenuIcon size={18} className="text-[#5b5b5b] shrink-0" />
                  <span className="font-bold text-[#5b5b5b] truncate">Menu</span>
                </div>
                {isMobile ? (
                  <button
                    onClick={closeMobileSidebar}
                    className="text-[#5b5b5b] hover:text-[#f02d9c]"
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleToggle}
                    className="text-[#5b5b5b] hover:text-[#f02d9c] font-bold"
                    aria-label="Collapse sidebar"
                  >
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

            let bgColor, textColor, borderColor, cursor;

            if (completed) {
              bgColor = 'bg-[#f02d9c]';
              textColor = 'text-white';
              borderColor = 'border-[#f02d9c]';
            } else if (active) {
              bgColor = 'bg-[#fdf6f0]';
              textColor = 'text-slate-800';
              borderColor = 'border-[#f02d9c]/30';
            } else {
              bgColor = 'bg-gray-100';
              textColor = 'text-gray-500';
              borderColor = 'border-gray-300';
              cursor = 'cursor-not-allowed'
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  if (!isLevelCompleted(item.id)) {
                     e.preventDefault();
                     return
                  }
                  isMobile ? closeMobileSidebar : undefined
                }}
                title={!showText ? item.title : undefined}
                className={`
                  group block rounded-lg border ${borderColor} ${bgColor} ${textColor} ${cursor}
                  transition-all duration-200 ease-in-out 
                  ${
                    !showText
                      ? 'w-10 h-10 flex items-center justify-center mx-auto hover:border-[#f02d9c] hover:bg-[#fbe2a7] hover:text-[#5b5b5b]'
                      : 'p-3 flex items-center hover:border-[#f02d9c] hover:bg-[#fbe2a7] hover:text-[#5b5b5b]'
                  }
                `}
              >
                <Icon
                  size={!showText ? 16 : 18}
                  className="shrink-0"
                />
                {showText && (
                  <span className="ml-3 font-medium truncate">{item.title}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}