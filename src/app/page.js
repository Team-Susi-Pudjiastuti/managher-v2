'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  Sparkle,
  Gamepad2,
  Target,
  CheckCircle,
  Users,
  FileText,
  Trophy,
  Lightbulb,
  Palette,
  Box,
  ClipboardCheck,
  Brain
} from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const phases = [
    {
      id: 'plan',
      title: 'Plan',
      subtitle: 'New Product Development Process',
      color: '#8acfd1',
      levels: [
        { id: 1, name: 'AI Idea & VPC Generator', desc: 'Dapatkan ide bisnis dan Value Proposition Canvas (VPC) secara instan dengan bantuan AI.', xp: 10, badge: 'AI Innovator', icon: Lightbulb },
        { id: 2, name: 'RWW Analysis', desc: 'Validasi ide bisnismu: Real? Win? Worth It?', xp: 10, badge: 'Validator Pro', icon: CheckCircle },
        { id: 3, name: 'Brand Identity', desc: 'Bangun identitas brand yang konsisten dan mudah dikenali.', xp: 10, badge: 'Brand Builder', icon: Palette },
        { id: 4, name: 'Lean Canvas', desc: 'Rancang model bisnismu dalam satu halaman yang ringkas.', xp: 10, badge: 'Canvas Master', icon: FileText },
        { id: 5, name: 'MVP', desc: 'Buat versi minimal produkmu untuk diuji ke pasar.', xp: 10, badge: 'MVP Maker', icon: Box },
        { id: 6, name: 'Beta Testing', desc: 'Uji produkmu ke calon pelanggan nyata dan kumpulkan masukan.', xp: 10, badge: 'Tester Hero', icon: Users },
        { id: 7, name: 'Persiapan Launching', desc: 'Siapkan checklist dan aset penting sebelum rilis resmi.', xp: 10, badge: 'Launch Ready', icon: ClipboardCheck }
      ]
    }
  ];

  const usps = [
    {
      title: 'AI Generator',
      desc: 'Dapatkan ide bisnis dan Value Proposition Canvas (VPC) otomatis dari AI berbasis Gemini API.',
      icon: Brain
    },
    {
      title: 'Framework Bisnis Teruji',
      desc: 'Gunakan NPD Process, VPC, RWW Analysis, dan Lean Canvas dalam satu alur terstruktur.',
      icon: Target
    },
    {
      title: 'Gamifikasi Menyenangkan',
      desc: 'Level, XP, badge, dan progress bar membuat proses perencanaan bisnis terasa seperti bermain game.',
      icon: Gamepad2
    }
  ];

  const totalXP = useMemo(() => {
    return phases.reduce((acc, p) => acc + p.levels.reduce((s, l) => s + (l.xp || 0), 0), 0); // 70 XP
  }, [phases]);

  const currentXP = 30;
  const progressPercent = Math.min(100, Math.round((currentXP / totalXP) * 100));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased">
      {/* NAVBAR */}
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-white/80 shadow-sm' : 'bg-white/95'}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkle size={24} className="text-[#f02d9c]" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-extrabold text-lg text-black">
                Manag<span className="text-[#f02d9c]">Her</span>
              </span>
              <span className="text-[11px] text-slate-500">From Zero to CEO</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#how-it-works" className="text-sm font-medium hover:text-black">Cara Kerja</Link>
            <Link href="#usp" className="text-sm font-medium hover:text-black">Keunggulan</Link>
            <Link href="#features" className="text-sm font-medium hover:text-black">Fitur</Link>
            <Link href="/auth/register" className="inline-flex items-center gap-2 px-4 py-2 bg-[#f02d9c] text-white font-semibold rounded-full hover:brightness-95 transition">
              <Gamepad2 size={16} /> Mulai
            </Link>
          </nav>

          <button
            className="md:hidden p-2 rounded-md border border-slate-200 bg-white/70"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-3"
          >
            <Link href="#how-it-works" onClick={() => setOpen(false)}>Cara Kerja</Link>
            <Link href="#usp" onClick={() => setOpen(false)}>Keunggulan</Link>
            <Link href="#features" onClick={() => setOpen(false)}>Fitur</Link>
            <Link href="/auth/register" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#f02d9c] text-white font-semibold rounded-full">Mulai</Link>
          </motion.div>
        )}
      </header>

      <main className="mt-20">
        {/* HERO */}
        <section className="relative min-h-[calc(100vh-120px)] bg-white pt-16 pb-12 flex items-center">
          <div className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-lg"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f02d9c]/10 text-[#f02d9c] mb-5 text-sm font-medium">
                <Sparkle size={16} /> Empowering Women Solopreneur
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 text-black">
                Bangun Bisnismu <span className="text-[#f02d9c]">seperti Bermain Game</span>
              </h1>

              <p className="text-base text-slate-700 mb-5">
                Platform panduan step-by-step roadmap bisnis untuk solopreneur perempuan. Dengan mengintegrasikan framework bisnis teruji ke dalam 7 level gamifikasi, kamu bisa merancang bisnis impianmu secara sistematis dan menyenangkan.
              </p>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-black">From Zero</span>
                  <span className="text-xs font-semibold text-black">to CEO</span>
                </div>
                <div className="relative w-full h-2 bg-black/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full rounded-full bg-[#f02d9c]"
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-[11px]">
                  <span className="text-[#f02d9c] font-medium">{progressPercent}% Selesai</span>
                  <span className="text-slate-600">{currentXP} / {totalXP} XP</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f02d9c] text-white rounded-full font-semibold shadow-[0_4px_12px_rgba(240,45,156,0.15)] hover:scale-[1.02] transition-transform text-sm"
                >
                  <Gamepad2 size={16} /> Mulai Sekarang
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border-2 border-black text-black font-semibold hover:bg-black/5 transition text-sm"
                >
                  Lihat Fitur
                </Link>
              </div>
            </motion.div>

            {/* Mockup dalam frame desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-md">
                <div className="relative w-full aspect-video rounded-t-xl rounded-b-lg overflow-hidden border-4 border-[#f02d9c] shadow-[0_8px_24px_rgba(240,45,156,0.2)]">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-[#f02d9c] flex items-center px-3">
                    <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="ml-4 text-white text-xs font-medium">managher.app</span>
                  </div>
                  <div className="absolute inset-0 pt-8 bg-white">
                    <Image
                      src="/managher.jpeg"
                      alt="ManagHer Dashboard"
                      fill
                      className="object-fill"
                      priority
                    />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#fbe2a7] rounded-full flex items-center justify-center">
                  <Sparkle size={10} className="text-[#f02d9c]" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CARA KERJA */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-black mb-3"
            >
              Cara Kerja
            </motion.h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto text-sm">
              Ikuti 7 langkah terstruktur untuk merancang bisnismu dari nol hingga siap diluncurkan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { step: 1, title: 'Ide & Validasi', desc: 'Dapatkan ide bisnis dan validasi awal dengan AI.', icon: Lightbulb },
                { step: 2, title: 'Rancang Strategi', desc: 'Bangun model bisnis dan identitas brand.', icon: Palette },
                { step: 3, title: 'Uji & Siapkan', desc: 'Buat MVP, uji ke pengguna, dan siapkan launching.', icon: Box }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-xl p-5 border border-[#f02d9c]/20 shadow-[0_4px_12px_rgba(240,45,156,0.15)] hover:shadow-md transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#fdf6f0] flex items-center justify-center mx-auto mb-3 border-2 border-[#f02d9c]">
                      <Icon size={20} className="text-[#f02d9c]" />
                    </div>
                    <h3 className="font-bold text-lg text-black mb-1.5">{item.step}. {item.title}</h3>
                    <p className="text-xs text-slate-700">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* KEUNGGULAN UTAMA (USP) */}
        <section id="usp" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-black mb-3"
            >
              Keunggulan Utama ManagHer
            </motion.h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-sm">
              Dibangun khusus untuk solopreneur perempuan yang ingin merancang bisnis secara terstruktur.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {usps.map((usp, i) => {
                const Icon = usp.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-xl p-6 border border-[#f02d9c]/20 shadow-[0_4px_12px_rgba(240,45,156,0.15)] hover:shadow-md transition"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#fdf6f0] flex items-center justify-center mx-auto mb-4 border-2 border-[#f02d9c]">
                      <Icon size={24} className="text-[#f02d9c]" />
                    </div>
                    <h3 className="font-bold text-lg text-black mb-2">{usp.title}</h3>
                    <p className="text-sm text-slate-700">{usp.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold text-black mb-3"
              >
                Fitur Utama: 7 Level Perencanaan
              </motion.h2>
              <p className="text-slate-600 max-w-xl mx-auto text-sm">
                Setiap level adalah quest yang memberimu XP dan badge.
              </p>
            </div>

            <div className="space-y-12">
              {phases.map((phase, i) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl p-5 border border-[#f02d9c]/20 shadow-[0_4px_12px_rgba(240,45,156,0.15)]"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: phase.color }}>{phase.title}</h3>
                      <p className="text-slate-600 mt-1 text-sm">{phase.subtitle}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="inline-block px-3 py-1.5 bg-[#fdf6f0] border border-[#f02d9c] rounded-full text-xs font-bold text-black">
                        {phase.levels.length} Level • {phase.levels.reduce((s, l) => s + l.xp, 0)} XP
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {phase.levels.map((lvl) => {
                      const Icon = lvl.icon;
                      return (
                        <motion.div
                          key={lvl.id}
                          whileHover={{ y: -3 }}
                          className="bg-[#fdf6f0] rounded-lg border border-[#f02d9c]/30 p-3 shadow-[0_2px_8px_rgba(240,45,156,0.1)] hover:shadow-sm transition"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border-2 border-[#f02d9c]">
                              <Icon size={14} className="text-[#f02d9c]" />
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-black">Level {lvl.id}</h4>
                              <p className="font-medium text-[10px] text-slate-800 mt-0.5">{lvl.name}</p>
                              <div className="flex gap-1 mt-1.5 flex-wrap">
                                <span className="px-1.5 py-0.5 bg-[#fbe2a7] text-black text-[9px] font-bold rounded">
                                  +{lvl.xp} XP
                                </span>
                                <span className="px-1.5 py-0.5 bg-[#8acfd1] text-white text-[9px] font-bold rounded">
                                  {lvl.badge}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Trophy size={40} className="mx-auto mb-4 text-[#f02d9c]" />
              <h2 className="text-2xl font-bold text-black mb-4">
                Siap Merancang Bisnismu?
              </h2>
              <p className="text-slate-700 mb-6 max-w-lg mx-auto text-sm">
                Gabung bersama ribuan solopreneur perempuan yang membangun bisnis dari nol — dengan panduan, komunitas, dan semangat.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#f02d9c] text-white font-bold rounded-full shadow-[0_4px_12px_rgba(240,45,156,0.25)] hover:scale-[1.02] transition-transform text-sm"
              >
                Daftar Sekarang
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-6 bg-white text-center text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} ManagHer. Dibuat dengan ❤️ untuk perempuan Indonesia.</p>
          <p className="mt-0.5">Proyek Akhir • Perempuan Inovasi Scholarship</p>
        </footer>
      </main>
    </div>
  );
}