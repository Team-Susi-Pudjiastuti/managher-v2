'use client';

import { useState } from 'react';
import { 
  Award, 
  Star, 
  Lightbulb, 
  CheckCircle, 
  PartyPopper,
  Rocket,
  Box,
  Palette,
  FileText,
  Users
 } from 'lucide-react';

const getBadgeIcon = (badgeName) => {
  switch (badgeName) {
    case 'AI Innovator':
      return <Lightbulb className="w-8 h-8 text-[#f02d9c]" />;
    case 'Validator Pro':
      return <CheckCircle className="w-8 h-8 text-[#f02d9c]" />;
    case 'Brand Builder':
      return <Palette className="w-8 h-8 text-[#f02d9c]" />;
    case 'Canvas Master':
      return <FileText className="w-8 h-8 text-[#f02d9c]" />;
    case 'Product Maker':
      return <Box className="w-8 h-8 text-[#f02d9c]" />;
    case 'Marketing Hero':
      return <Users className="w-8 h-8 text-[#f02d9c]" />;
    case 'Launch Star':
      return <Rocket className="w-8 h-8 text-[#f02d9c]" />;   
  }
};

export default function NotificationModal({ 
  isOpen, 
  onClose,
  pesan = "Selamat! Kamu telah menyelesaikan Level ini.",
  keterangan = "Lanjut ke level berikutnya untuk mengembangkan ide bisnismu!",
  xpGained = null,
  badgeName = null
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 max-w-xs w-full text-center border-t border-l bg-[#fbe2a7] text-[#333333] border-black"
        style={{ boxShadow: '3px 3px 0 0 #000000' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ikon Sukses Utama */}
        <div className="w-12 h-12 rounded-full bg-[#d7488e] flex items-center justify-center mx-auto mb-3">
          <PartyPopper className="w-6 h-6 text-white" />
        </div>

        {/* Pesan Selamat */}
        <p className="font-bold text-lg mb-4">
          {pesan}
        </p>

        {/* Badge */}
        {badgeName && (
          <div className="mb-4">
            <div className="inline-flex flex-col items-center justify-center gap-2 bg-white/80 rounded-xl p-4 mx-auto">
              {getBadgeIcon(badgeName)}
              <span className="font-bold text-[#f02d9c] text-sm">Badge: {badgeName}</span>
            </div>
          </div>
        )}

        {/* XP */}
        {xpGained && (
          <div className="bg-[#d7488e] text-white px-4 py-2 rounded-full inline-block mb-4 font-bold">
            +{xpGained} XP
          </div>
        )}

        <p className="text-sm mb-4">
          {keterangan}
        </p>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg font-medium border-t border-l font-[Poppins] bg-[#8acfd1] text-[#333333] border-black"
          style={{ boxShadow: '2px 2px 0 0 #000000' }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}