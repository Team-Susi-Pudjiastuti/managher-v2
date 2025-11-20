// /components/ResourceCard.jsx
import { BookOpen } from 'lucide-react';

export default function ResourceCard() {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-1">
        <BookOpen size={14} /> Resources
      </h3>
      <ul className="text-sm text-[#5b5b5b] space-y-1.5">
        <li>
          <a
            href="https://www.strategyzer.com/canvas/value-proposition-canvas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
          >
            Strategyzer VPC Guide
          </a>
        </li>
        <li>
          <a
            href="https://miro.com/templates/value-proposition-canvas/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
          >
            Miro VPC Template
          </a>
        </li>
      </ul>
    </div>
  );
}