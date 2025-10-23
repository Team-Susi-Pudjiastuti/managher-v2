'use client';
import { useState } from 'react';
import { Home, Layers } from 'lucide-react';

export default function Sidebar() {
  const [active, setActive] = useState('Overview');

  const menus = [
    { name: 'Overview', icon: <Home size={18} /> },
    { name: 'Level 1', icon: <Layers size={18} /> },
    { name: 'Level 2', icon: <Layers size={18} /> },
    { name: 'Level 3', icon: <Layers size={18} /> },
    { name: 'Level 4', icon: <Layers size={18} /> },
    { name: 'Level 5', icon: <Layers size={18} /> },
    { name: 'Level 6', icon: <Layers size={18} /> },
    { name: 'Level 7', icon: <Layers size={18} /> },
  ];

  return (
    <div className="min-h-screen w-60 bg-white border-r border-gray-100 flex flex-col p-5">
      {/* Header */}
      <h1 className="text-2xl font-bold text-pink-600 mb-8">ManagHer</h1>

      {/* Menu */}
      <nav className="flex flex-col gap-3">
        {menus.map((menu) => (
          <button
            key={menu.name}
            onClick={() => setActive(menu.name)}
            className={`flex items-center gap-3 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200
              ${
                active === menu.name
                  ? 'bg-[#FFE9A6] text-gray-800 shadow-sm'
                  : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
              }`}
          >
            <span className="text-pink-600">{menu.icon}</span>
            {menu.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
