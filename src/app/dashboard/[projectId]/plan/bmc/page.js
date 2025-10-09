'use client';

import { use, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useProjectStore from '@/store/useProjectStore';

// Palet warna pastel
const NOTE_COLORS = [
  '#ffcccc', '#ccffcc', '#ccccff', '#ffffcc',
  '#ffccff', '#ccffff', '#ffe0cc', '#e0ccff'
];

// Data BMC dengan penjelasan & contoh
const BMC_BLOCKS = [
  {
    id: 'keyPartners',
    title: 'Key Partners',
    description: 'Siapa mitra strategis Anda?',
    example: 'Supplier bahan baku, platform logistik'
  },
  {
    id: 'keyActivities',
    title: 'Key Activities',
    description: 'Aktivitas utama untuk menjalankan bisnis?',
    example: 'Produksi, pemasaran, layanan pelanggan'
  },
  {
    id: 'keyPropositions',
    title: 'Key Propositions',
    description: 'Nilai unik yang Anda tawarkan?',
    example: 'Harga terjangkau, desain eksklusif'
  },
  {
    id: 'customerRelationships',
    title: 'Customer Relationships',
    description: 'Bagaimana Anda berinteraksi dengan pelanggan?',
    example: 'Chat responsif, program loyalitas'
  },
  {
    id: 'customerSegments',
    title: 'Customer Segments',
    description: 'Siapa target pelanggan Anda?',
    example: 'Mahasiswa, ibu rumah tangga, UMKM'
  },
  {
    id: 'keyResources',
    title: 'Key Resources',
    description: 'Sumber daya utama yang dibutuhkan?',
    example: 'Tim kreatif, modal awal, teknologi'
  },
  {
    id: 'channels',
    title: 'Channels',
    description: 'Bagaimana Anda menjangkau pelanggan?',
    example: 'Instagram, Tokopedia, WhatsApp'
  },
  {
    id: 'costStructure',
    title: 'Cost Structure',
    description: 'Apa saja biaya utama bisnis Anda?',
    example: 'Produksi, iklan, gaji karyawan'
  },
  {
    id: 'revenueStreams',
    title: 'Revenue Streams',
    description: 'Dari mana Anda mendapat penghasilan?',
    example: 'Penjualan produk, langganan bulanan'
  },
];

export default function BmcPage({ params }) {
  const { projectId } = use(params);
  const router = useRouter();
  const { currentProject, setCurrentProject, getPhaseData, updatePhaseData, deletePhaseData } =
    useProjectStore();

  const [bmcData, setBmcData] = useState({});
  const [noteContent, setNoteContent] = useState('');
  const [noteColor, setNoteColor] = useState(NOTE_COLORS[0]);
  const [previewNote, setPreviewNote] = useState(null); // Note yang siap diseret
  const dragItem = useRef(null);

  useEffect(() => {
    setCurrentProject(projectId);
    const saved = getPhaseData(projectId, 'bmc') || {};
    setBmcData(saved);
  }, [projectId, setCurrentProject, getPhaseData]);

  const saveBmcData = (newData) => {
    setBmcData(newData);
    updatePhaseData(projectId, 'bmc', newData);
  };

  // Buat note (tapi belum simpan ke blok)
  const handleCreateNote = () => {
    if (!noteContent.trim()) {
      alert('Isi catatan terlebih dahulu.');
      return;
    }
    const note = {
      id: Date.now().toString(),
      content: noteContent.trim(),
      color: noteColor,
    };
    setPreviewNote(note);
    setNoteContent('');
  };

  // Drag & Drop
  const handleDragStart = (e) => {
    if (!previewNote) return;
    dragItem.current = previewNote;
    e.dataTransfer.setData('text/plain', JSON.stringify(previewNote));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    try {
      const note = JSON.parse(data);
      const newData = { ...bmcData };
      if (!newData[targetId]) newData[targetId] = [];
      newData[targetId].push(note);
      saveBmcData(newData);
      setPreviewNote(null); // Hapus preview setelah disimpan
      dragItem.current = null;
    } catch (err) {
      console.error('Gagal parse note:', err);
    }
  };

  const handleDeleteNote = (blockId, noteId) => {
    if (confirm('Hapus note ini?')) {
      const newData = { ...bmcData };
      newData[blockId] = (newData[blockId] || []).filter(note => note.id !== noteId);
      if (newData[blockId].length === 0) delete newData[blockId];
      saveBmcData(newData);
    }
  };

  const handleResetAll = () => {
    if (confirm('Yakin ingin menghapus seluruh data BMC?')) {
      deletePhaseData(projectId, 'bmc');
      setBmcData({});
      setPreviewNote(null);
    }
  };

  const SIDEBAR_MENU = [
    { id: 'ide-bisnis', label: 'Ide bisnis', icon: '💡' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'brand', label: 'Brand Identity', icon: '🎨' },
    { id: 'validasi', label: 'Validasi', icon: '🔍' },
    { id: 'bmc', label: 'BMC', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-[#ffffff] p-4 sm:p-6">
      {/* Header */}
      <header className="mb-8">
        <div
          className="p-5 font-sans"
          style={{
            borderStyle: 'solid',
            borderTopWidth: '1px',
            borderLeftWidth: '1px',
            borderBottomWidth: '4px',
            borderRightWidth: '4px',
            borderColor: '#000000',
            boxShadow: '4px 4px 0 0 #000000',
            backgroundColor: '#ffffff',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#000000] font-sans">
                ManagHer / Mini Business Plan
              </h1>
              <p className="text-[#000000] text-sm font-sans font-light mt-1">
                Bangun model bisnis dengan sticky note 📌
              </p>
            </div>
            <button
              onClick={() => router.push(`/dashboard/${projectId}`)}
              className="bg-[#ffcccc] text-[#000000] px-4 py-2 font-semibold font-sans hover:bg-[#ffa8a8] transition-colors"
              style={{
                borderStyle: 'solid',
                borderTopWidth: '1px',
                borderLeftWidth: '1px',
                borderBottomWidth: '4px',
                borderRightWidth: '4px',
                borderColor: '#000000',
              }}
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar Cantik */}
        <div
          className="w-full lg:w-64 font-sans"
          style={{
            backgroundColor: '#fff8f0',
            borderStyle: 'solid',
            borderTopWidth: '1px',
            borderLeftWidth: '1px',
            borderBottomWidth: '4px',
            borderRightWidth: '4px',
            borderColor: '#000000',
            boxShadow: '4px 4px 0 0 #000000',
          }}
        >
          <div
            className="p-4 border-b border-[#000000]"
            style={{
              borderStyle: 'solid',
              borderTopWidth: '1px',
              borderLeftWidth: '1px',
              borderBottomWidth: '4px',
              borderRightWidth: '4px',
              borderColor: '#000000',
            }}
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-10 h-10 flex items-center justify-center font-bold text-white"
                style={{
                  backgroundColor: '#b80000',
                  border: '2px solid #000000',
                  borderRadius: '0',
                }}
              >
                MH
              </div>
              <div>
                <h3 className="font-bold text-[#000000]">ManagHer</h3>
                <p className="text-[#000000] text-xs font-light">Solopreneur Journey</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {SIDEBAR_MENU.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'ide-bisnis') {
                    router.push(`/dashboard/${projectId}/plan`);
                  } else {
                    router.push(`/dashboard/${projectId}/plan/${item.id}`);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 font-medium transition-colors ${
                  item.id === 'bmc'
                    ? 'bg-[#b80000] text-white'
                    : 'text-[#000000] hover:bg-[#ffcccc]'
                }`}
                style={{ borderRadius: '0', textAlign: 'left' }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 text-xs text-[#000000] font-light border-t border-[#000000] mt-auto">
            v1.0 — Business Model Canvas
          </div>
        </div>

        {/* Konten Utama */}
        <div className="flex-1 space-y-6">
          {/* Sticky Note Creator */}
          <div
            className="font-sans"
            style={{
              backgroundColor: '#ffffff',
              borderStyle: 'solid',
              borderTopWidth: '1px',
              borderLeftWidth: '1px',
              borderBottomWidth: '4px',
              borderRightWidth: '4px',
              borderColor: '#000000',
              boxShadow: '4px 4px 0 0 #000000',
            }}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#000000] mb-4">Buat Sticky Note</h3>
              
              {/* Pilih Warna */}
              <div className="flex flex-wrap gap-2 mb-3">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNoteColor(color)}
                    className={`w-6 h-6 border-2 ${noteColor === color ? 'border-[#000000]' : 'border-transparent'}`}
                    style={{ backgroundColor: color, borderRadius: '0' }}
                  />
                ))}
              </div>

              {/* Input Teks */}
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full px-3 py-2 outline-none font-sans resize-vertical mb-3"
                rows="3"
                placeholder="Tulis ide Anda di sini..."
                style={{
                  borderStyle: 'solid',
                  borderTopWidth: '1px',
                  borderLeftWidth: '1px',
                  borderBottomWidth: '4px',
                  borderRightWidth: '4px',
                  borderColor: '#000000',
                  borderRadius: '0',
                }}
              />

              <div className="flex justify-between items-center">
                <button
                  onClick={handleResetAll}
                  className="bg-[#ffcccc] text-[#000000] px-4 py-2 font-semibold font-sans hover:bg-[#ffa8a8]"
                  style={{
                    borderStyle: 'solid',
                    borderTopWidth: '1px',
                    borderLeftWidth: '1px',
                    borderBottomWidth: '4px',
                    borderRightWidth: '4px',
                    borderColor: '#000000',
                    borderRadius: '0',
                  }}
                >
                  Reset Semua
                </button>

                <button
                  onClick={handleCreateNote}
                  className="bg-[#b80000] text-white px-4 py-2 font-semibold font-sans hover:bg-[#8B0000]"
                  style={{
                    borderStyle: 'solid',
                    borderTopWidth: '1px',
                    borderLeftWidth: '1px',
                    borderBottomWidth: '4px',
                    borderRightWidth: '4px',
                    borderColor: '#000000',
                    borderRadius: '0',
                  }}
                >
                  Buat Note
                </button>
              </div>

              {/* Preview Note (siap diseret) */}
              {previewNote && (
                <div
                  className="mt-4 p-3 text-[#000000] font-sans cursor-grab"
                  draggable
                  onDragStart={handleDragStart}
                  style={{
                    backgroundColor: previewNote.color,
                    border: '1px solid #000000',
                    borderRadius: '0',
                  }}
                >
                  {previewNote.content}
                  <div className="text-xs mt-1 text-[#000000]">← Seret ke blok BMC</div>
                </div>
              )}
            </div>
          </div>

          {/* BMC Board */}
          <div
            className="font-sans"
            style={{
              backgroundColor: '#ffffff',
              borderStyle: 'solid',
              borderTopWidth: '1px',
              borderLeftWidth: '1px',
              borderBottomWidth: '4px',
              borderRightWidth: '4px',
              borderColor: '#000000',
              boxShadow: '4px 4px 0 0 #000000',
            }}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#000000] mb-4">Business Model Canvas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BMC_BLOCKS.map((block) => (
                  <div
                    key={block.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, block.id)}
                    className="relative"
                    style={{
                      border: '1px dashed #000000',
                      minHeight: '180px',
                      padding: '1rem',
                      borderRadius: '0',
                      backgroundColor: '#f9f9f9',
                    }}
                  >
                    <div>
                      <div className="font-bold text-[#000000]">{block.title}</div>
                      <div className="text-[#000000] text-xs font-light italic mb-2">{block.description}</div>
                    </div>

                    {/* Area Konten (Scrollable jika >2 note) */}
                    <div
                      className="space-y-2"
                      style={{
                        maxHeight: (bmcData[block.id]?.length || 0) > 2 ? '120px' : 'none',
                        overflowY: (bmcData[block.id]?.length || 0) > 2 ? 'auto' : 'visible',
                      }}
                    >
                      {(bmcData[block.id] || []).map((note) => (
                        <div
                          key={note.id}
                          className="p-2 text-[#000000] text-sm font-sans break-words relative"
                          style={{
                            backgroundColor: note.color,
                            border: '1px solid #000000',
                            borderRadius: '0',
                          }}
                        >
                          {note.content}
                          <button
                            onClick={() => handleDeleteNote(block.id, note.id)}
                            className="absolute top-0 right-0 w-5 h-5 text-[#b80000] font-bold"
                            style={{
                              border: '1px solid #000000',
                              borderRadius: '0',
                              backgroundColor: '#ffcccc',
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {/* Tampilkan contoh jika belum ada note */}
                      {(bmcData[block.id] || []).length === 0 && (
                        <div className="text-[#000000] text-xs font-sans font-light italic">
                          Contoh: {block.example}
                        </div>
                      )}
                    </div>

                    {(bmcData[block.id] || []).length === 0 && (
                      <div className="text-[#000000] text-xs font-sans font-light mt-2">
                        Seret note ke sini
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 text-[#000000] text-xs font-sans font-light">
                <p>Source: Strategyzer.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}