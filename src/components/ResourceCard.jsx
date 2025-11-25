import { BookOpen } from 'lucide-react';

export default function ResourceCard() {
  return (
    <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
      <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-1">
        <BookOpen size={14} /> Resources
      </h3>
      <ul className="text-sm text-[#5b5b5b] space-y-2">
        {/* Bacaan tentang VPC */}
        <li>
          <a
            href="https://www.strategyzer.com/canvas/value-proposition-canvas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
          >
            Apa Itu Value Proposition Canvas?
          </a>
        </li>

        {/* Video penjelasan */}
        <li>
          <a
            href="https://www.youtube.com/watch?v=ReM1uqmVfP0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
          >
            Video: Memahami VPC untuk Pemula
          </a>
        </li>

        {/* Konteks Level 1 – Ide Bisnis */}
        <li>
          <a
            href="https://www.entrepreneur.com/growing-a-business/how-to-generate-business-ideas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
          >
            Cara Menghasilkan Ide Bisnis yang Layak – Entrepreneur
          </a>
        </li>
      </ul>
    </div>
  );
}