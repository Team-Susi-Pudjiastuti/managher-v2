'use client';

import { useState } from 'react';

export default function NotificationModal({ isOpen, message, type, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`rounded-2xl p-6 max-w-xs w-full text-center border-t border-l ${
          type === 'success' 
            ? 'bg-[#fbe2a7] text-[#333333] border-black' 
            : 'bg-[#f96f70] text-white border-white'
        }`}
        style={{ 
          boxShadow: type === 'success' 
            ? '3px 3px 0 0 #000000' 
            : '3px 3px 0 0 rgba(255,255,255,0.5)' 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-3">
          {type === 'success' ? (
            <div className="w-12 h-12 rounded-full bg-[#d7488e] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-6 h-6"
              >
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#f96f70"
                className="w-6 h-6"
              >
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        <p className="font-semibold text-lg font-[Poppins]">{message}</p>

        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 rounded-lg font-medium transition-transform hover:translate-x-0.5 hover:translate-y-0.5 border-t border-l font-[Poppins] ${
            type === 'success'
              ? 'bg-[#8acfd1] text-[#333333] border-black'
              : 'bg-white text-[#f96f70] border-white'
          }`}
          style={{ 
            boxShadow: type === 'success' 
              ? '2px 2px 0 0 #000000' 
              : '2px 2px 0 0 rgba(255,255,255,0.5)' 
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}