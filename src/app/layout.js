// src/app/layout.js
import './globals.css';
import { Poppins, Lora, Fira_Code } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
})

export const metadata = {
  title: 'ManagHer — Solopreneur Journey',
  description: 'Platform interaktif untuk perempuan solopreneur membangun bisnis dari 0.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"> 
      <body className={`${poppins.variable} ${lora.variable} ${firaCode.variable}`}>{children}</body>
    </html>
  );
}