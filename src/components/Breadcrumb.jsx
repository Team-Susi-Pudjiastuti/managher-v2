'use client';

import Link from 'next/link';

export default function Breadcrumb({ items }) {
  return (
    <div className="mb-6 text-sm text-[#5b5b5b] max-w-6xl font-[Poppins]">
      {items.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <Link
              href={item.href}
              className="underline hover:text-[#f02d9c] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="mx-2">›</span>}
        </span>
      ))}
    </div>
  );
}