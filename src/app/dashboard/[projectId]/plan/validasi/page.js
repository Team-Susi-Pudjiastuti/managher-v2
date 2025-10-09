'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useProjectStore from '@/store/useProjectStore';

export default function ValidasiPage({ params }) {
  const { projectId } = use(params);
  const router = useRouter();
  const { currentProject, setCurrentProject, getPhaseData, updatePhaseData, deletePhaseData } =
    useProjectStore();

  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    activity: '',
    feedbackScale: '',
    feedbackNote: '',
  });

  const [validationData, setValidationData] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setCurrentProject(projectId);
    const saved = getPhaseData(projectId, 'validation') || [];
    if (Array.isArray(saved)) {
      setValidationData(saved);
    }
  }, [projectId, setCurrentProject, getPhaseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const { gender, age, activity } = formData;
    if (!gender.trim() || !age.trim() || !activity.trim()) {
      alert('Jenis Kelamin, Usia, dan Aktivitas wajib diisi.');
      return;
    }

    const payload = {
      gender: formData.gender,
      age: formData.age,
      activity: formData.activity,
      feedbackScale: formData.feedbackScale || '0',
      feedbackNote: formData.feedbackNote || '-',
    };

    if (editingId) {
      // Mode Edit
      const updatedData = validationData.map((item) =>
        item.id === editingId ? { ...item, ...payload } : item
      );
      setValidationData(updatedData);
      updatePhaseData(projectId, 'validation', updatedData);
      alert('✅ Data validasi berhasil diperbarui!');
    } else {
      // Mode Tambah
      const newEntry = {
        id: Date.now().toString(),
        ...payload,
        date: new Date().toLocaleString(),
      };
      const updatedData = [...validationData, newEntry];
      setValidationData(updatedData);
      updatePhaseData(projectId, 'validation', updatedData);
      alert('✅ Data validasi berhasil disimpan!');
    }

    // Reset
    setFormData({
      gender: '',
      age: '',
      activity: '',
      feedbackScale: '',
      feedbackNote: '',
    });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setFormData({
      gender: item.gender,
      age: item.age,
      activity: item.activity,
      feedbackScale: item.feedbackScale,
      feedbackNote: item.feedbackNote,
    });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      const updatedData = validationData.filter((item) => item.id !== id);
      setValidationData(updatedData);
      updatePhaseData(projectId, 'validation', updatedData);
    }
  };

  const handleReset = () => {
    if (confirm('Yakin ingin menghapus semua data validasi?')) {
      deletePhaseData(projectId, 'validation');
      setValidationData([]);
      setFormData({
        gender: '',
        age: '',
        activity: '',
        feedbackScale: '',
        feedbackNote: '',
      });
      setEditingId(null);
      alert('Data validasi telah direset.');
    }
  };

  // Statistik
  const stats = {
    total: validationData.length,
    gender: {
      female: validationData.filter((d) => /perempuan/i.test(d.gender)).length,
      male: validationData.filter((d) => /laki/i.test(d.gender)).length,
    },
    ageGroups: {
      '<20': validationData.filter((d) => parseInt(d.age) < 20).length,
      '20-29': validationData.filter((d) => parseInt(d.age) >= 20 && parseInt(d.age) <= 29).length,
      '30-39': validationData.filter((d) => parseInt(d.age) >= 30 && parseInt(d.age) <= 39).length,
      '40+': validationData.filter((d) => parseInt(d.age) >= 40).length,
    },
    activities: Object.keys(
      validationData.reduce((acc, d) => {
        acc[d.activity] = (acc[d.activity] || 0) + 1;
        return acc;
      }, {})
    ),
  };

  const getFeedbackEmoji = (scale) => {
    const num = parseInt(scale);
    if (num >= 4) return '😍';
    if (num === 3) return '😊';
    if (num === 2) return '😐';
    if (num === 1) return '😞';
    return '❓';
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
                Validasi ide bisnismu dengan data nyata 🔍
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
                  item.id === 'validasi'
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
            v1.0 — Validasi Ide
          </div>
        </div>

        {/* Konten Utama */}
        <div className="flex-1 space-y-6">
          {/* Form Input */}
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
              <h2 className="text-xl font-bold text-[#000000] mb-4">
                {editingId ? 'Edit Data Validasi' : 'Input Data Validasi'}
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'gender', label: 'Jenis Kelamin', placeholder: 'Contoh: Perempuan / Laki-laki' },
                  { name: 'age', label: 'Usia', placeholder: 'Contoh: 23' },
                  { name: 'activity', label: 'Aktivitas Saat Ini', placeholder: 'Contoh: Mahasiswa / Pekerja kantoran' },
                  { name: 'feedbackScale', label: 'Skala Feedback (1-5)', placeholder: 'Contoh: 4' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-[#000000] text-sm font-sans font-medium mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.name === 'age' || field.name === 'feedbackScale' ? 'number' : 'text'}
                      name={field.name}
                      value={formData[field.name] ?? ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      min={field.name === 'feedbackScale' ? '1' : undefined}
                      max={field.name === 'feedbackScale' ? '5' : undefined}
                      className="w-full px-4 py-3 outline-none font-sans"
                      style={{
                        borderStyle: 'solid',
                        borderTopWidth: '1px',
                        borderLeftWidth: '1px',
                        borderBottomWidth: '4px',
                        borderRightWidth: '4px',
                        borderColor: '#000000',
                      }}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-[#000000] text-sm font-sans font-medium mb-1">
                    Penjelasan Feedback
                  </label>
                  <textarea
                    name="feedbackNote"
                    value={formData.feedbackNote ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 outline-none font-sans"
                    rows="3"
                    placeholder="Contoh: Suka modelnya, tapi harganya agak tinggi"
                    style={{
                      borderStyle: 'solid',
                      borderTopWidth: '1px',
                      borderLeftWidth: '1px',
                      borderBottomWidth: '4px',
                      borderRightWidth: '4px',
                      borderColor: '#000000',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handleReset}
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
                    onClick={handleSave}
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
                    {editingId ? 'Perbarui' : 'Simpan'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Data Validasi */}
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#000000]">Tabel Data Validasi</h2>
                <span className="text-[#000000] text-sm font-sans">
                  Total: <strong>{stats.total}</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm font-sans">
                  <thead>
                    <tr>
                      <th className="py-2 text-left text-[#000000] font-bold border-b border-[#000000]">JK</th>
                      <th className="py-2 text-left text-[#000000] font-bold border-b border-[#000000]">Usia</th>
                      <th className="py-2 text-left text-[#000000] font-bold border-b border-[#000000]">Aktivitas</th>
                      <th className="py-2 text-left text-[#000000] font-bold border-b border-[#000000]">Skala</th>
                      <th className="py-2 text-left text-[#000000] font-bold border-b border-[#000000]">Feedback</th>
                      <th className="py-2 text-left text-[#000000] font-bold border-b border-[#000000]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-4 text-center text-[#000000] font-sans font-light italic">
                          Belum ada data validasi.
                        </td>
                      </tr>
                    ) : (
                      validationData.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2 text-[#000000]">{item.gender}</td>
                          <td className="py-2 text-[#000000]">{item.age}</td>
                          <td className="py-2 text-[#000000]">{item.activity}</td>
                          <td className="py-2 text-[#000000]">
                            {item.feedbackScale} {getFeedbackEmoji(item.feedbackScale)}
                          </td>
                          <td className="py-2 text-[#000000]">{item.feedbackNote}</td>
                          <td className="py-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="w-8 h-8 flex items-center justify-center bg-[#ffcccc] text-[#000000] font-bold hover:bg-[#ffa8a8]"
                                style={{
                                  borderStyle: 'solid',
                                  borderTopWidth: '1px',
                                  borderLeftWidth: '1px',
                                  borderBottomWidth: '4px',
                                  borderRightWidth: '4px',
                                  borderColor: '#000000',
                                  borderRadius: '0',
                                }}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="w-8 h-8 flex items-center justify-center bg-[#ffcccc] text-[#b80000] font-bold hover:bg-[#ffa8a8]"
                                style={{
                                  borderStyle: 'solid',
                                  borderTopWidth: '1px',
                                  borderLeftWidth: '1px',
                                  borderBottomWidth: '4px',
                                  borderRightWidth: '4px',
                                  borderColor: '#000000',
                                  borderRadius: '0',
                                }}
                                title="Hapus"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Dashboard Hasil Validasi Ide */}
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
              <h2 className="text-xl font-bold text-[#000000] mb-4">Dashboard Hasil Validasi Ide</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Jenis Kelamin */}
                <div style={{ backgroundColor: '#f8f8f8', padding: '1rem' }}>
                  <h3 className="font-bold text-[#000000] mb-2">Distribusi Jenis Kelamin</h3>
                  <div className="flex items-center justify-center space-x-6">
                    <div className="text-center">
                      <div
                        className="w-16 h-16 flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: '#f87171', borderRadius: '0', border: '1px solid #000000' }}
                      >
                        {stats.gender.female}
                      </div>
                      <p className="text-[#000000] text-xs mt-1">Perempuan</p>
                    </div>
                    <div className="text-center">
                      <div
                        className="w-16 h-16 flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: '#3b82f6', borderRadius: '0', border: '1px solid #000000' }}
                      >
                        {stats.gender.male}
                      </div>
                      <p className="text-[#000000] text-xs mt-1">Laki-laki</p>
                    </div>
                  </div>
                </div>

                {/* Usia */}
                <div style={{ backgroundColor: '#f8f8f8', padding: '1rem' }}>
                  <h3 className="font-bold text-[#000000] mb-2">Distribusi Usia</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.ageGroups).map(([group, count]) => (
                      <div key={group} className="flex items-center">
                        <div
                          style={{
                            height: '1.5rem',
                            marginRight: '0.5rem',
                            width: `${(count / Math.max(1, stats.total)) * 100}%`,
                            backgroundColor: '#b80000',
                            border: '1px solid #000000',
                          }}
                        ></div>
                        <span className="text-[#000000] text-xs">{group}: {count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aktivitas */}
                <div style={{ backgroundColor: '#f8f8f8', padding: '1rem' }}>
                  <h3 className="font-bold text-[#000000] mb-2">Distribusi Aktivitas</h3>
                  <div className="space-y-2">
                    {stats.activities.map((activity) => {
                      const count = validationData.filter((d) => d.activity === activity).length;
                      return (
                        <div key={activity} className="flex items-center">
                          <div
                            style={{
                              height: '1.5rem',
                              marginRight: '0.5rem',
                              width: `${(count / Math.max(1, stats.total)) * 100}%`,
                              backgroundColor: '#ffcccc',
                              border: '1px solid #000000',
                            }}
                          ></div>
                          <span className="text-[#000000] text-xs">{activity}: {count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Skala Rata-rata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Skala by JK', data: ['Perempuan', 'Laki-laki'] },
                  { title: 'Skala by Usia', data: ['<20', '20-29', '30-39', '40+'] },
                  { title: 'Skala by Aktivitas', data: stats.activities },
                ].map((section, idx) => (
                  <div key={idx} style={{ backgroundColor: '#f8f8f8', padding: '1rem' }}>
                    <h3 className="font-bold text-[#000000] mb-2">{section.title}</h3>
                    <div className="space-y-1">
                      {section.data.map((item) => {
                        let filtered = [];
                        if (section.title.includes('JK')) {
                          const keyword = item === 'Perempuan' ? 'perempuan' : 'laki';
                          filtered = validationData.filter((d) => d.gender.toLowerCase().includes(keyword));
                        } else if (section.title.includes('Usia')) {
                          filtered = validationData.filter((d) => {
                            const a = parseInt(d.age);
                            if (item === '<20') return a < 20;
                            if (item === '20-29') return a >= 20 && a <= 29;
                            if (item === '30-39') return a >= 30 && a <= 39;
                            if (item === '40+') return a >= 40;
                            return false;
                          });
                        } else {
                          filtered = validationData.filter((d) => d.activity === item);
                        }
                        const avg = filtered.length > 0 ? filtered.reduce((sum, d) => sum + parseInt(d.feedbackScale || 0), 0) / filtered.length : 0;
                        return (
                          <div key={item} className="flex items-center">
                            <div
                              style={{
                                height: '1rem',
                                marginRight: '0.5rem',
                                width: `${Math.min(avg * 20, 100)}%`,
                                backgroundColor: '#b80000',
                                border: '1px solid #000000',
                              }}
                            ></div>
                            <span className="text-[#000000] text-xs">{item}: {avg.toFixed(1)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}