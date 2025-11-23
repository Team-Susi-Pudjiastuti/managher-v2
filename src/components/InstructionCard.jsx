// /components/InstructionCard.jsx
import { BookOpen, Lightbulb, Award } from 'lucide-react';

export default function InstructionCard() {
  const instructions = [
    'Isi minat/bidang (misal: kuliner)',
    'Klik “Generate” untuk dapat 3 ide',
    'Pilih salah satu ide yang paling menarik',
    'Tinjau atau edit detail produk & pelanggan',
    'Klik “Simpan” untuk lanjut ke Level 2',
  ];

  return (
    <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={16} className="text-[#f02d9c]" />
        <span className="font-bold text-[#5b5b5b]">Petunjuk</span>
      </div>
      <div className="space-y-2">
        {instructions.map((text, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-[#5b5b5b]">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#f02d9c] text-white text-xs font-bold mt-0.5">
              {i + 1}
            </span>
            {text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="px-2.5 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
          <Lightbulb size={12} /> Tujuan: Temukan ide yang relevan & layak
        </div>
        <div className="px-2.5 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center gap-1">
          <Award size={12} /> Tips: Fokus pada satu pelanggan dulu
        </div>
      </div>
    </div>
  );
}