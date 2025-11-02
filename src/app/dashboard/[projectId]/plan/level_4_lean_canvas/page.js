'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Printer,
  Target,
  Lightbulb,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Wrench,
  BarChart3,
  ShieldCheck,
  Users,
  Send,
  Coins,
  TrendingUp,
  Eye,
  Edit3,
  Menu,
  Award,
} from 'lucide-react';

import Breadcrumb from '@/components/Breadcrumb';
import PlanSidebar from '@/components/PlanSidebar';
import NotificationModalPlan from '@/components/NotificationModalPlan';

export default function Level4Page() {
  const { projectId } = useParams();
  const router = useRouter();

  const [canvas, setCanvas] = useState({
    Problem: '',
    Solution: '',
    KeyMetrics: '',
    UniqueValueProp: '',
    UnfairAdvantage: '',
    Channels: '',
    CustomerSegments: '',
    CostStructure: '',
    RevenueStreams: '',
  });

  const [selectedField, setSelectedField] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    xpGained: 0,
    badgeName: '',
  });

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (projectId) {
      const saved = localStorage.getItem(`lean-canvas-${projectId}`);
      if (saved) {
        try {
          setCanvas(JSON.parse(saved));
        } catch (e) {
          console.error('Gagal parse canvas:', e);
        }
      }
    }
  }, [projectId]);

  const handleChange = (field, value) => {
    setCanvas(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(`lean-canvas-${projectId}`, JSON.stringify(canvas));

    setNotificationData({
      xpGained: 10,
      badgeName: 'Lean Strategist',
    });
    setShowNotification(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const fieldBgColors = {
    Problem: 'bg-red-50',
    Solution: 'bg-blue-50',
    KeyMetrics: 'bg-green-50',
    UniqueValueProp: 'bg-purple-50',
    UnfairAdvantage: 'bg-amber-50',
    Channels: 'bg-cyan-50',
    CustomerSegments: 'bg-indigo-50',
    CostStructure: 'bg-orange-50',
    RevenueStreams: 'bg-emerald-50',
  };

  const fieldIcons = {
    Problem: AlertTriangle,
    Solution: Wrench,
    KeyMetrics: BarChart3,
    UniqueValueProp: Target,
    UnfairAdvantage: ShieldCheck,
    Channels: Send,
    CustomerSegments: Users,
    CostStructure: Coins,
    RevenueStreams: TrendingUp,
  };

  const fieldPlaceholders = {
    Problem: 'Apa masalah utama pelangganmu?',
    Solution: 'Solusi yang kamu tawarkan?',
    KeyMetrics: 'Bagaimana kamu mengukur kesuksesan?',
    UniqueValueProp: 'Apa keunikan utama bisnismu?',
    UnfairAdvantage: 'Apa keunggulan unik yang tidak bisa ditiru?',
    Channels: 'Bagaimana kamu menjangkau pelanggan?',
    CustomerSegments: 'Siapa target pelangganmu?',
    CostStructure: 'Biaya utama dalam bisnismu?',
    RevenueStreams: 'Bagaimana bisnismu menghasilkan uang?',
  };

  const breadcrumbItems = [
    { href: `/dashboard/${projectId}`, label: 'Dashboard' },
    { href: `/dashboard/${projectId}/plan`, label: 'Fase Plan' },
    { label: 'Level 4: Lean Canvas' },
  ];

  if (!isMounted) {
    return <div className="min-h-screen bg-white p-6">Loading...</div>;
  }

  // === UPDATED: LEVEL 4 INFO CARDS (GAYA LEVEL 5/6) ===
  const Level4InfoCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Pencapaian */}
      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
        <h3 className="font-bold text-[#5b5b5b] mb-2 flex items-center gap-1">
          <Award size={16} className="text-[#f02d9c]" />
          Pencapaian
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-[#f02d9c] text-white text-xs font-bold rounded-full flex items-center gap-1">
            <Lightbulb size={12} /> +10 XP
          </span>
          <span className="px-3 py-1.5 bg-[#8acfd1] text-[#0a5f61] text-xs font-bold rounded-full flex items-center gap-1">
            <Award size={12} /> Lean Strategist
          </span>
        </div>
        <p className="mt-2 text-xs text-[#5b5b5b]">
          Kumpulkan XP & badge untuk naik pangkat dari Zero ke CEO!
        </p>
      </div>

      {/* Petunjuk */}
      <div className="border border-[#fbe2a7] bg-[#fdfcf8] rounded-xl p-4">
        <h3 className="font-bold text-[#5b5b5b] mb-3 flex items-center gap-1">
          <BookOpen size={16} className="text-[#f02d9c]" />
          Petunjuk
        </h3>
        <div className="space-y-2">
          {[
            'Isi semua bagian Lean Canvas berdasarkan ide bisnismu',
            'Fokus pada masalah nyata & solusi yang jelas',
            'Tentukan metrik utama untuk mengukur keberhasilan',
            'Identifikasi keunggulan yang sulit ditiru pesaing',
            'Simpan canvas untuk lanjut ke Level 5',
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-[#5b5b5b]">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#f02d9c] text-white text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              {text}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-2.5 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
            <Lightbulb size={12} /> Tujuan: Rangkum model bisnis dalam 1 halaman
          </span>
          <span className="px-2.5 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center gap-1">
            <Award size={12} /> Tips: Gunakan kalimat singkat & spesifik
          </span>
        </div>
      </div>

      {/* Resources */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white">
        <h3 className="font-bold text-[#0a5f61] mb-2 flex items-center gap-1">
          <BookOpen size={14} /> Resources
        </h3>
        <ul className="text-sm text-[#5b5b5b] space-y-1.5">
          <li>
            <a
              href="https://miro.com/templates/lean-canvas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
            >
              Miro: Lean Canvas Template <ChevronRight size={12} />
            </a>
          </li>
          <li>
            <a
              href="https://www.strategyzer.com/canvas/lean-canvas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
            >
              Panduan Resmi Lean Canvas (Strategyzer) <ChevronRight size={12} />
            </a>
          </li>
          <li>
            <a
              href="https://perempuaninovasi.id/workshop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f02d9c] hover:underline inline-flex items-center gap-1"
            >
              Workshop Perempuan Inovasi <ChevronRight size={12} />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-[Poppins] text-[#333]">
      <div className="px-3 sm:px-4 md:px-6 py-2 border-b border-gray-200 bg-white">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {isMobile && !mobileSidebarOpen && (
        <header className="p-3 flex items-center border-b border-gray-200 bg-white sticky top-10 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={20} className="text-[#5b5b5b]" />
          </button>
          <h1 className="ml-2 font-bold text-[#5b5b5b] text-base">Level 4: Lean Canvas</h1>
        </header>
      )}

      <div className="flex">
        <PlanSidebar
          projectId={projectId}
          currentLevelId={4}
          isMobile={isMobile}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        <main className="flex-1">
          <div className="py-6 px-3 sm:px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#f02d9c] rounded-2xl"></div>
                <div
                  className="relative bg-white rounded-2xl border-t border-l border-black p-4 sm:p-5 md:p-6"
                  style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#f02d9c]">
                      Level 4: Lean Canvas
                    </h1>
                  </div>

                  {/* === INFO CARDS (HORIZONTAL) === */}
                  <Level4InfoCards />

                  {isEditing ? (
                    <>
                      <div className="mb-6">
                        <div className="hidden md:grid grid-cols-5 gap-4">
                          {/* Problem */}
                          <div
                            className={`col-span-1 row-span-2 ${fieldBgColors.Problem} border-t border-l border-black rounded-2xl p-4 relative`}
                            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            onClick={() => setSelectedField('Problem')}
                          >
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <AlertTriangle size={14} /> Problem
                            </h3>
                            <textarea
                              value={canvas.Problem}
                              onChange={(e) => handleChange('Problem', e.target.value)}
                              placeholder={fieldPlaceholders.Problem}
                              className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#f02d9c]"
                              rows="10"
                            />
                          </div>

                          {/* Solution */}
                          <div
                            className={`col-span-1 ${fieldBgColors.Solution} border-t border-l border-black rounded-2xl p-4 relative`}
                            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            onClick={() => setSelectedField('Solution')}
                          >
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <Wrench size={14} /> Solution
                            </h3>
                            <textarea
                              value={canvas.Solution}
                              onChange={(e) => handleChange('Solution', e.target.value)}
                              placeholder={fieldPlaceholders.Solution}
                              className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#f02d9c]"
                              rows="6"
                            />
                          </div>

                          {/* UVP */}
                          <div
                            className={`col-span-1 row-span-2 ${fieldBgColors.UniqueValueProp} border-t border-l border-black rounded-2xl p-4 relative`}
                            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            onClick={() => setSelectedField('UniqueValueProp')}
                          >
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <Target size={14} /> Unique Value Proposition
                            </h3>
                            <textarea
                              value={canvas.UniqueValueProp}
                              onChange={(e) => handleChange('UniqueValueProp', e.target.value)}
                              placeholder={fieldPlaceholders.UniqueValueProp}
                              className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#f02d9c]"
                              rows="10"
                            />
                          </div>

                          {/* Unfair Advantage */}
                          <div
                            className={`col-span-1 ${fieldBgColors.UnfairAdvantage} border-t border-l border-black rounded-2xl p-4 relative`}
                            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            onClick={() => setSelectedField('UnfairAdvantage')}
                          >
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <ShieldCheck size={14} /> Unfair Advantage
                            </h3>
                            <textarea
                              value={canvas.UnfairAdvantage}
                              onChange={(e) => handleChange('UnfairAdvantage', e.target.value)}
                              placeholder={fieldPlaceholders.UnfairAdvantage}
                              className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#f02d9c]"
                              rows="6"
                            />
                          </div>

                          {/* Customer Segments */}
                          <div
                            className={`col-span-1 row-span-2 ${fieldBgColors.CustomerSegments} border-t border-l border-black rounded-2xl p-4 relative`}
                            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            onClick={() => setSelectedField('CustomerSegments')}
                          >
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <Users size={14} /> Customer Segments
                            </h3>
                            <textarea
                              value={canvas.CustomerSegments}
                              onChange={(e) => handleChange('CustomerSegments', e.target.value)}
                              placeholder={fieldPlaceholders.CustomerSegments}
                              className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#f02d9c]"
                              rows="10"
                            />
                          </div>

                          {/* Key Metrics */}
                          <div
                            className={`col-span-1 ${fieldBgColors.KeyMetrics} border-t border-l border-black rounded-2xl p-4 relative`}
                            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            onClick={() => setSelectedField('KeyMetrics')}
                          >
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <BarChart3 size={14} /> Key Metrics
                            </h3>
                            <textarea
                              value={canvas.KeyMetrics}
                              onChange={(e) => handleChange('KeyMetrics', e.target.value)}
                              placeholder={fieldPlaceholders.KeyMetrics}
                              className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#f02d9c]"
                              rows="6"
                            />
                          </div>

                          {/* Channels */}
                          <div
                            className={`col-span-1 ${fieldBgColors.Channels} border-t border-l border-black rounded-2xl p-4 relative`}
                            style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                            onClick={() => setSelectedField('Channels')}
                          >
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <Send size={14} /> Channels
                            </h3>
                            <textarea
                              value={canvas.Channels}
                              onChange={(e) => handleChange('Channels', e.target.value)}
                              placeholder={fieldPlaceholders.Channels}
                              className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#f02d9c]"
                              rows="6"
                            />
                          </div>

                          {/* Cost & Revenue */}
                          <div className="col-span-5 flex gap-4">
                            <div
                              className={`w-1/2 ${fieldBgColors.CostStructure} border border-gray-300 rounded-2xl p-4 relative`}
                              style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                              onClick={() => setSelectedField('CostStructure')}
                            >
                              <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                                <Coins size={14} /> Cost Structure
                              </h3>
                              <textarea
                                value={canvas.CostStructure}
                                onChange={(e) => handleChange('CostStructure', e.target.value)}
                                placeholder={fieldPlaceholders.CostStructure}
                                className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#f02d9c]"
                                rows="6"
                              />
                            </div>

                            <div
                              className={`w-1/2 ${fieldBgColors.RevenueStreams} border border-gray-300 rounded-2xl p-4 relative`}
                              style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                              onClick={() => setSelectedField('RevenueStreams')}
                            >
                              <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                                <TrendingUp size={14} /> Revenue Streams
                              </h3>
                              <textarea
                                value={canvas.RevenueStreams}
                                onChange={(e) => handleChange('RevenueStreams', e.target.value)}
                                placeholder={fieldPlaceholders.RevenueStreams}
                                className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#f02d9c]"
                                rows="6"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="md:hidden space-y-4">
                          {Object.entries(canvas).map(([field]) => {
                            const Icon = fieldIcons[field];
                            return (
                              <div
                                key={field}
                                className={`${fieldBgColors[field]} border border-gray-300 rounded-2xl p-4`}
                                style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                              >
                                <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                                  <Icon size={14} /> {field === 'UniqueValueProp'
                                    ? 'Unique Value Proposition'
                                    : field === 'CustomerSegments'
                                      ? 'Customer Segments'
                                      : field === 'KeyMetrics'
                                        ? 'Key Metrics'
                                        : field === 'UnfairAdvantage'
                                          ? 'Unfair Advantage'
                                          : field === 'RevenueStreams'
                                            ? 'Revenue Streams'
                                            : field === 'CostStructure'
                                              ? 'Cost Structure'
                                              : field}
                                </h3>
                                <textarea
                                  value={canvas[field]}
                                  onChange={(e) => handleChange(field, e.target.value)}
                                  placeholder={fieldPlaceholders[field]}
                                  className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#f02d9c]"
                                  rows="5"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-8">
                        <div className="hidden md:grid grid-cols-5 gap-4">
                          <div className={`col-span-1 row-span-2 ${fieldBgColors.Problem} border border-gray-300 rounded-2xl p-4`} style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}>
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <AlertTriangle size={14} /> Problem
                            </h3>
                            <p className="text-sm text-gray-700 whitespace-pre-line min-h-[24px]">
                              {canvas.Problem || <span className="text-gray-400 italic">Belum diisi</span>}
                            </p>
                          </div>
                          <div className={`col-span-1 ${fieldBgColors.Solution} border border-gray-300 rounded-2xl p-4`} style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}>
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <Wrench size={14} /> Solution
                            </h3>
                            <p className="text-sm text-gray-700 whitespace-pre-line min-h-[24px]">
                              {canvas.Solution || <span className="text-gray-400 italic">Belum diisi</span>}
                            </p>
                          </div>
                          <div className={`col-span-1 row-span-2 ${fieldBgColors.UniqueValueProp} border border-gray-300 rounded-2xl p-4`} style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}>
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <Target size={14} /> Unique Value Proposition
                            </h3>
                            <p className="text-sm text-gray-700 whitespace-pre-line min-h-[24px]">
                              {canvas.UniqueValueProp || <span className="text-gray-400 italic">Belum diisi</span>}
                            </p>
                          </div>
                          <div className={`col-span-1 ${fieldBgColors.UnfairAdvantage} border border-gray-300 rounded-2xl p-4`} style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}>
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <ShieldCheck size={14} /> Unfair Advantage
                            </h3>
                            <p className="text-sm text-gray-700 whitespace-pre-line min-h-[24px]">
                              {canvas.UnfairAdvantage || <span className="text-gray-400 italic">Belum diisi</span>}
                            </p>
                          </div>
                          <div className={`col-span-1 row-span-2 ${fieldBgColors.CustomerSegments} border border-gray-300 rounded-2xl p-4`} style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}>
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <Users size={14} /> Customer Segments
                            </h3>
                            <p className="text-sm text-gray-700 whitespace-pre-line min-h-[24px]">
                              {canvas.CustomerSegments || <span className="text-gray-400 italic">Belum diisi</span>}
                            </p>
                          </div>
                          <div className={`col-span-1 ${fieldBgColors.KeyMetrics} border border-gray-300 rounded-2xl p-4`} style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}>
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <BarChart3 size={14} /> Key Metrics
                            </h3>
                            <p className="text-sm text-gray-700 whitespace-pre-line min-h-[24px]">
                              {canvas.KeyMetrics || <span className="text-gray-400 italic">Belum diisi</span>}
                            </p>
                          </div>
                          <div className={`col-span-1 ${fieldBgColors.Channels} border border-gray-300 rounded-2xl p-4`} style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}>
                            <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                              <Send size={14} /> Channels
                            </h3>
                            <p className="text-sm text-gray-700 whitespace-pre-line min-h-[24px]">
                              {canvas.Channels || <span className="text-gray-400 italic">Belum diisi</span>}
                            </p>
                          </div>
                          <div className="col-span-5 flex gap-4">
                            <div className={`w-1/2 ${fieldBgColors.CostStructure} border border-gray-300 rounded-2xl p-4`} style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}>
                              <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                                <Coins size={14} /> Cost Structure
                              </h3>
                              <p className="text-sm text-gray-700 whitespace-pre-line min-h-[24px]">
                                {canvas.CostStructure || <span className="text-gray-400 italic">Belum diisi</span>}
                              </p>
                            </div>
                            <div className={`w-1/2 ${fieldBgColors.RevenueStreams} border border-gray-300 rounded-2xl p-4`} style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}>
                              <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                                <TrendingUp size={14} /> Revenue Streams
                              </h3>
                              <p className="text-sm text-gray-700 whitespace-pre-line min-h-[24px]">
                                {canvas.RevenueStreams || <span className="text-gray-400 italic">Belum diisi</span>}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="md:hidden space-y-4">
                          {Object.entries(canvas).map(([field, value]) => {
                            const Icon = fieldIcons[field];
                            return (
                              <div
                                key={field}
                                className={`${fieldBgColors[field]} border border-gray-300 rounded-2xl p-4`}
                                style={{ boxShadow: '2px 2px 0 0 #f02d9c' }}
                              >
                                <h3 className="font-semibold mb-2 text-[#f02d9c] flex items-center gap-1.5">
                                  <Icon size={14} /> {field === 'UniqueValueProp'
                                    ? 'Unique Value Proposition'
                                    : field === 'CustomerSegments'
                                      ? 'Customer Segments'
                                      : field === 'KeyMetrics'
                                        ? 'Key Metrics'
                                        : field === 'UnfairAdvantage'
                                          ? 'Unfair Advantage'
                                          : field === 'RevenueStreams'
                                            ? 'Revenue Streams'
                                            : field === 'CostStructure'
                                              ? 'Cost Structure'
                                              : field}
                                </h3>
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                  {value || <span className="text-gray-400 italic">Belum diisi</span>}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* === TOMBOL EDIT & PRINT BERDAMPINGAN === */}
                      <div className="mt-6 flex justify-center gap-3">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-5 py-2.5 bg-[#f02d9c] text-white font-medium rounded-lg border border-black hover:bg-pink-600 flex items-center gap-1"
                        >
                          <Edit3 size={16} /> Edit Canvas
                        </button>
                        <button
                          onClick={handlePrint}
                          className="px-5 py-2.5 bg-[#f02d9c] text-white font-medium rounded-lg border border-black hover:bg-pink-600 flex items-center gap-1"
                        >
                          <Printer size={16} /> Print Canvas
                        </button>
                      </div>
                    </>
                  )}

                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => router.push(`/dashboard/${projectId}/plan/level_3_product_brand`)}
                      className="px-4 py-2.5 bg-gray-100 text-[#5b5b5b] font-medium rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center gap-1 text-sm"
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>

                    {isEditing && (
                      <button
                        onClick={handleSave}
                        className="px-4 py-2.5 bg-[#f02d9c] text-white font-medium rounded-lg border border-black hover:bg-pink-600 flex items-center gap-1 text-sm"
                      >
                        <CheckCircle size={16} /> Simpan
                      </button>
                    )}

                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2.5 bg-white text-[#f02d9c] font-medium rounded-lg border border-[#f02d9c] hover:bg-[#fdf6f0] flex items-center gap-1 text-sm"
                    >
                      <Eye size={16} /> {isEditing ? 'Lihat Preview' : 'Edit'}
                    </button>

                    {isEditing && (
                      <button
                        onClick={() => router.push(`/dashboard/${projectId}/plan/level_5_MVP`)}
                        className="px-4 py-2.5 bg-[#8acfd1] text-[#0a5f61] font-medium rounded-lg border border-black hover:bg-[#7abfc0] flex items-center gap-1 text-sm"
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Notifikasi */}
      <NotificationModalPlan
        isOpen={showNotification}
        type="success"
        xpGained={notificationData.xpGained}
        badgeName={notificationData.badgeName}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}