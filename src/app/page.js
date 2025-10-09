'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / total) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Font Awesome via CDN */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" />

      {/* Progress Bar — Primary Color */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#f0f0f0] z-50">
        <div
          className="h-1 bg-[#b80000] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Navigation — White with subtle shadow */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm py-4 border-b border-[#000000]">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/only-shoes-logo-removebg.png" alt="ManagHer Logo" className="h-12 w-auto" />
            <span className="text-xl font-bold text-[#000000] font-sans">ManagHer</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="font-medium text-[#000000] hover:text-[#b80000] transition-colors font-sans">Tentang</a>
            <a href="#features" className="font-medium text-[#000000] hover:text-[#b80000] transition-colors font-sans">Fitur</a>
            <a href="#badges" className="font-medium text-[#000000] hover:text-[#b80000] transition-colors font-sans">Badge</a>
            <a href="#testimonials" className="font-medium text-[#000000] hover:text-[#b80000] transition-colors font-sans">Testimoni</a>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
            aria-label="Toggle menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col pt-20 px-6">
          <a href="#about" className="py-4 border-b border-[#000000] font-medium text-[#000000] font-sans" onClick={() => setIsMenuOpen(false)}>Tentang</a>
          <a href="#features" className="py-4 border-b border-[#000000] font-medium text-[#000000] font-sans" onClick={() => setIsMenuOpen(false)}>Fitur</a>
          <a href="#badges" className="py-4 border-b border-[#000000] font-medium text-[#000000] font-sans" onClick={() => setIsMenuOpen(false)}>Badge</a>
          <a href="#testimonials" className="py-4 border-b border-[#000000] font-medium text-[#000000] font-sans" onClick={() => setIsMenuOpen(false)}>Testimoni</a>
          <div className="mt-auto pb-6">
            <a
              href="/dashboard"
              className="bg-[#b80000] text-white px-6 py-3 rounded-none font-semibold inline-block w-full text-center font-sans border-t border-l border-[#000000] border-b-4 border-r-4 shadow-[4px_4px_0_0_#000000]"
            >
              Mulai Sekarang 🚀
            </a>
          </div>
        </div>
      )}

      {/* Hero Section — Elegant & Mature */}
      <section className="pt-40 pb-20 relative overflow-hidden bg-[#ffffff]">
        {/* Animasi Bintang Berkilau */}
        <div className="absolute top-50 left-50 text-xl text-[#b80000] opacity-70 sparkle sparkle-1">✦</div>
        <div className="absolute top-40 right-20 text-xl text-[#b80000] opacity-70 sparkle sparkle-2">✦</div>
        <div className="absolute bottom-44 left-30 text-xl text-[#b80000] opacity-70 sparkle sparkle-1">✦</div>
        <div className="absolute bottom-60 right-40 text-xl text-[#b80000] opacity-70 sparkle sparkle-2">✦</div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <img src="/only-shoes-logo-removebg.png" alt="ManagHer Logo" className="mx-auto h-32 mb-6" />

          {/* Slogan "From Zero to CEO" dengan gaya font Kanroji */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
            <span className="block font-serif italic text-[#b80000] text-6xl">ManagHer</span>
            <span className="block font-sans text-[#000000] text-5xl">From Zero to CEO</span>
          </h1>

          <p className="text-lg md:text-xl text-[#000000] mb-8 max-w-2xl mx-auto leading-relaxed font-sans font-light">
            Solopreneur Journey — Belajar membangun bisnis dari 0 dengan cara terstruktur, elegan, dan berdaya.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="/projects"
              className="bg-[#b80000] text-white px-8 py-4 rounded-none font-semibold font-sans border-t border-l border-[#000000] border-b-4 border-r-4 shadow-[4px_4px_0_0_#000000]"
            >
              Mulai Sekarang 🚀
            </a>
            <a
              href="#about"
              className="inline-block px-8 py-4 border-t border-l border-[#000000] border-b-4 border-r-4 text-[#000000] font-semibold rounded-none transition-all hover:shadow-[4px_4px_0_0_#ff3333] font-sans"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>

          <div className="flex justify-center items-center space-x-2 text-sm text-[#000000] animate-bounce font-sans">
            <span>Scroll untuk melihat lebih banyak</span>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </section>

      {/* About Section — bg-white */}
      <section id="about" className="py-20 px-6 bg-[#ffffff]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#b80000] font-sans">Tentang ManagHer</h2>
            <p className="text-lg text-[#000000] max-w-3xl mx-auto leading-relaxed font-sans font-light">
              Kami hadir untuk perempuan solopreneur yang ingin membangun bisnis dengan pendekatan yang terstruktur, berkelas, dan penuh makna — bukan hanya tentang uang, tapi tentang kekuatan, identitas, dan transformasi diri.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: 'fa-lightbulb', title: 'Ide Kreatif', desc: 'Temukan ide bisnis yang menyatu dengan passion dan nilai hidupmu.' },
              { icon: 'fa-chart-line', title: 'Validasi Pasar', desc: 'Uji konsepmu dengan audiens tanpa takut gagal — pakai data, bukan asumsi.' },
              { icon: 'fa-rocket', title: 'Launch & Grow', desc: 'Luncurkan produkmu dengan percaya diri, lalu pantau pertumbuhan secara real-time.' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#ffffff] p-8 rounded-none shadow-[4px_4px_0_0_#000000] border-t border-l border-b-4 border-r-4 border-[#000000] hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200"
              >
                <div className="w-16 h-16 bg-[#ffcccc] rounded-none flex items-center justify-center mb-6 mx-auto border-t border-l border-b-4 border-r-4 border-[#000000]">
                  <i className={`fas ${item.icon} text-2xl text-[#b80000]`}></i>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center text-[#000000] font-sans"> {item.title} </h3>
                <p className="text-[#000000] text-center font-sans font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases Section — bg-white */}
      <section id="phases" className="py-20 px-6 bg-[#ffffff]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#b80000] font-sans">Tiga Fase Perjalananmu ✨</h2>
            <p className="text-[#000000] max-w-2xl mx-auto font-sans font-light">
              Ikuti alur yang telah teruji untuk membangun bisnis yang berkelanjutan — dari ide hingga ekspansi.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Fase Plan */}
            <div className="bg-[#ffffff] p-8 rounded-none shadow-[4px_4px_0_0_#000000] border-t border-l border-b-4 border-r-4 border-[#000000] hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-3 text-[#000000] font-sans">Fase Plan</h3>
              <p className="text-[#000000] text-sm mb-4 font-sans font-light">
                Bangun fondasi bisnismu: ide, validasi, brand, dan model bisnis.
              </p>
              <ul className="text-sm text-[#000000] space-y-1 font-sans font-light">
                <li>• Ide Bisnis</li>
                <li>• Validasi Pasar</li>
                <li>• Brand Identity</li>
                <li>• Business Model Canvas</li>
              </ul>
            </div>

            {/* Fase Sell */}
            <div className="bg-[#ffffff] p-8 rounded-none shadow-[4px_4px_0_0_#000000] border-t border-l border-b-4 border-r-4 border-[#000000] hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3 text-[#000000] font-sans">Fase Sell</h3>
              <p className="text-[#000000] text-sm mb-4 font-sans font-light">
                Luncurkan produk dan kelola operasional bisnis harianmu.
              </p>
              <ul className="text-sm text-[#000000] space-y-1 font-sans font-light">
                <li>• Product Management</li>
                <li>• Customer & Order</li>
                <li>• Laporan Keuangan</li>
                <li>• Evaluasi Kinerja</li>
              </ul>
            </div>

            {/* Fase Scale Up */}
            <div className="bg-[#ffffff] p-8 rounded-none shadow-[4px_4px_0_0_#000000] border-t border-l border-b-4 border-r-4 border-[#000000] hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-3 text-[#000000] font-sans">Fase Scale Up</h3>
              <p className="text-[#000000] text-sm mb-4 font-sans font-light">
                Kembangkan bisnismu ke level profesional dan berkelanjutan.
              </p>
              <ul className="text-sm text-[#000000] space-y-1 font-sans font-light">
                <li>• Strategi Marketing</li>
                <li>• Manajemen Keuangan</li>
                <li>• Legal & Perpajakan</li>
                <li>• Tim & SDM</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section — bg-white */}
      <section id="testimonials" className="py-20 px-6 bg-[#ffffff]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#b80000] font-sans">Apa Kata Mereka 💖</h2>
            <p className="text-[#000000] max-w-2xl mx-auto font-sans font-light">Kisah nyata dari solopreneur yang telah melewati tiap fase perjalanan.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimoni Fase Plan */}
            <div className="bg-[#ffffff] p-6 rounded-none shadow-[4px_4px_0_0_#000000] border-t border-l border-b-4 border-r-4 border-[#000000] flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#b80000] rounded-none flex items-center justify-center text-white font-bold mb-4 border-t border-l border-b-4 border-r-4 border-[#000000]">AR</div>
              <blockquote className="text-sm italic font-medium text-[#000000] mb-4 font-sans">
                "Fase Plan membantuku menggali passion jadi ide bisnis yang profitable. Akhirnya punya arah jelas!"
              </blockquote>
              <div className="text-xs text-[#b80000] font-semibold font-sans">Fase Plan • Anindya R.</div>
            </div>

            {/* Testimoni Fase Sell */}
            <div className="bg-[#ffffff] p-6 rounded-none shadow-[4px_4px_0_0_#000000] border-t border-l border-b-4 border-r-4 border-[#000000] flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#b80000] rounded-none flex items-center justify-center text-white font-bold mb-4 border-t border-l border-b-4 border-r-4 border-[#000000]">KL</div>
              <blockquote className="text-sm italic font-medium text-[#000000] mb-4 font-sans">
                "Dulu kewalahan urus order manual. Di Fase Sell, aku belajar sistem penjualan otomatis — sekarang bisa fokus kreatif!"
              </blockquote>
              <div className="text-xs text-[#b80000] font-semibold font-sans">Fase Sell • Karina L.</div>
            </div>

            {/* Testimoni Fase Scale Up */}
            <div className="bg-[#ffffff] p-6 rounded-none shadow-[4px_4px_0_0_#000000] border-t border-l border-b-4 border-r-4 border-[#000000] flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#b80000] rounded-none flex items-center justify-center text-white font-bold mb-4 border-t border-l  border-b-4 border-r-4 border-[#000000]">SN</div>
              <blockquote className="text-sm italic font-medium text-[#000000] mb-4 font-sans">
                "Scale Up ngajarin aku bangun tim dan SOP. Sekarang bisnisku bisa jalan tanpa aku harus selalu standby!"
              </blockquote>
              <div className="text-xs text-[#b80000] font-semibold font-sans">Fase Scale Up • Sari N.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section — bg-white */}
      <section className="py-20 px-6 text-center bg-[#ffffff]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#b80000] font-sans">Siap Mulai Fase Kamu?</h2>
          <p className="text-lg text-[#000000] mb-12 max-w-2xl mx-auto font-sans font-light">
            Pilih fase yang sesuai dengan perjalananmu sekarang — dan mulai bangun bisnismu dengan percaya diri.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card Plan */}
            <a
              href="/plan"
              className="group bg-[#ffffff] p-6 rounded-none shadow-[4px_4px_0_0_#000000] border-t border-l border-b-4 border-r-4 border-[#000000] hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 flex flex-col items-center"
            >
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-2 text-[#000000] font-sans">Fase Plan</h3>
              <p className="text-sm text-[#000000] font-sans font-light">Temukan ide & bangun fondasi bisnis.</p>
            </a>

            {/* Card Sell */}
            <a
              href="/sell"
              className="group bg-[#ffffff] p-6 rounded-none shadow-[4px_4px_0_0_#000000] border-t border-l border-b-4 border-r-4 border-[#000000] hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 flex flex-col items-center"
            >
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2 text-[#000000] font-sans">Fase Sell</h3>
              <p className="text-sm text-[#000000] font-sans font-light">Kelola penjualan & operasional harian.</p>
            </a>

            {/* Card Scale Up */}
            <a
              href="/scale"
              className="group bg-[#ffffff] p-6 rounded-none shadow-[4px_4px_0_0_#000000] border-t border-l border-b-4 border-r-4 border-[#000000] hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 flex flex-col items-center"
            >
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-2 text-[#000000] font-sans">Fase Scale Up</h3>
              <p className="text-sm text-[#000000] font-sans font-light">Bangun sistem & ekspansi bisnis.</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer — bg-white */}
      <footer className="py-12 px-6 bg-[#ffffff] text-[#000000] border-t border-[#000000]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/managher-red-shoes-logo.png" alt="ManagHer Logo" className="h-8 w-auto" />
                <h3 className="text-xl font-bold text-[#b80000] font-sans">ManagHer</h3>
              </div>
              <p className="text-[#000000] mb-4 font-sans font-light">Platform interaktif untuk perempuan solopreneur membangun bisnis dari 0.</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-[#ffcccc] rounded-none flex items-center justify-center hover:bg-[#b80000] hover:text-white transition-colors border-t border-l border-b-4 border-r-4 border-[#000000]">
                  <i className="fab fa-instagram text-sm text-[#000000]"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-[#ffcccc] rounded-none flex items-center justify-center hover:bg-[#b80000] hover:text-white transition-colors border-t border-l border-b-4 border-r-4 border-[#000000]">
                  <i className="fab fa-twitter text-sm text-[#000000]"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-[#ffcccc] rounded-none flex items-center justify-center hover:bg-[#b80000] hover:text-white transition-colors border-t border-l border-b-4 border-r-4 border-[#000000]">
                  <i className="fab fa-tiktok text-sm text-[#000000]"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-[#b80000] font-sans">Produk</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#b80000] transition-colors font-sans font-light border-t border-l border-b-4 border-r-4 border-[#000000] block px-2 py-1">Fitur</a></li>
                <li><a href="#" className="hover:text-[#b80000] transition-colors font-sans font-light border-t border-l border-b-4 border-r-4 border-[#000000] block px-2 py-1">Harga</a></li>
                <li><a href="#" className="hover:text-[#b80000] transition-colors font-sans font-light border-t border-l border-b-4 border-r-4 border-[#000000] block px-2 py-1">Demo</a></li>
                <li><a href="#" className="hover:text-[#b80000] transition-colors font-sans font-light border-t border-l border-b-4 border-r-4 border-[#000000] block px-2 py-1">Testimoni</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-[#b80000] font-sans">Sumber Daya</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#b80000] transition-colors font-sans font-light border-t border-l border-b-4 border-r-4 border-[#000000] block px-2 py-1">Blog</a></li>
                <li><a href="#" className="hover:text-[#b80000] transition-colors font-sans font-light border-t border-l border-b-4 border-r-4 border-[#000000] block px-2 py-1">Panduan</a></li>
                <li><a href="#" className="hover:text-[#b80000] transition-colors font-sans font-light border-t border-l border-b-4 border-r-4 border-[#000000] block px-2 py-1">Webinar</a></li>
                <li><a href="#" className="hover:text-[#b80000] transition-colors font-sans font-light border-t border-l border-b-4 border-r-4 border-[#000000] block px-2 py-1">Komunitas</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-[#b80000] font-sans">Perusahaan</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#b80000] transition-colors font-sans font-light border-t border-l border-b-4 border-r-4 border-[#000000] block px-2 py-1">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-[#b80000] transition-colors font-sans font-light border-t border-l border-b-4 border-r-4 border-[#000000] block px-2 py-1">Karir</a></li>
                <li><a href="#" className="hover:text-[#b80000] transition-colors font-sans font-light border-t border-l border-b-4 border-r-4 border-[#000000] block px-2 py-1">Kontak</a></li>
                <li><a href="#" className="hover:text-[#b80000] transition-colors font-sans font-light border-t border-l border-b-4 border-r-4 border-[#000000] block px-2 py-1">Privasi</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#000000] text-center text-[#000000] text-sm font-sans font-light">
            <p>© 2025 ManagHer — Solopreneur Journey. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}