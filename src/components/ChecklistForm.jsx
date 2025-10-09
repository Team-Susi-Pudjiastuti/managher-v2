// src/components/ChecklistForm.js
import React, { useState, useEffect } from 'react';
import useProjectStore from '@/store/useProjectStore';

export default function ChecklistForm({ projectId, phaseKey, items }) {
  const { getPhaseData, updatePhaseData } = useProjectStore();
  const [localData, setLocalData] = useState({});

  useEffect(() => {
    const saved = getPhaseData(projectId, phaseKey);
    setLocalData(saved);
  }, [projectId, phaseKey, getPhaseData]);

  const toggleItem = (item) => {
    const newState = {
      ...localData,
      [item]: !localData[item],
    };
    setLocalData(newState);
    updatePhaseData(projectId, phaseKey, newState);
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        // Di src/components/ChecklistForm.js
<label key={i} className="flex items-start space-x-3 cursor-pointer">
  <input
    type="checkbox"
    checked={!!localData[item]}
    onChange={() => toggleItem(item)}
    className="mt-1 h-5 w-5 text-[#8B0000] rounded focus:ring-[#8B0000]"
  />
  <span className="text-gray-800">{item}</span>
  {item === 'Ide Bisnis' && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/dashboard/${projectId}/plan/ide-bisnis`);
      }}
      className="ml-2 text-xs text-blue-600 hover:underline"
    >
      Isi
    </button>
  )}
</label>
      ))}
    </div>
  );
}