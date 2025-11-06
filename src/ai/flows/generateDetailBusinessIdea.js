'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// === OUTPUT UNTUK 3 IDE MINI (Level 1) ===
const miniIdeaSchema = z.object({
  idea: z.string().describe('Nama ide bisnis.'),
  category: z.string().describe('Jenis atau kategori ide bisnis.'),
  description: z.string().describe('Deskripsi singkat ide bisnis.'),
});

const generateMiniIdeasOutputSchema = z.array(miniIdeaSchema).length(3);

const generateMiniIdeasPrompt = ai.definePrompt({
  name: 'generateMiniBusinessIdeasPrompt',
  input: { schema: z.object({ interest: z.string() }) },
  output: { schema: generateMiniIdeasOutputSchema },
  prompt: `
Kamu adalah pakar bisnis kreatif di Indonesia.
Berdasarkan minat berikut: "{{{interest}}}", buat **3 ide bisnis berbeda**.

Aturan:
- Output **hanya array JSON** dengan 3 objek.
- Setiap objek berisi: "idea", "category", "description".
- Gunakan Bahasa Indonesia.
- Ide harus realistis, unik, dan sesuai tren pasar Indonesia.
- Jangan tambahkan penjelasan di luar JSON.
- Deskripsi cukup 1 kalimat, jangan terlalu panjang.

Contoh:
[
  {
    "idea": "Meal Prep Box untuk Ibu Bekerja",
    "category": "Layanan Langganan Makanan Sehat",
    "description": "Kotak makanan siap saji mingguan dengan resep bergizi dari ahli nutrisi, bahan organik lokal"
  },
  ...
]

Sekarang hasilkan:
  `,
});

// === OUTPUT UNTUK IDE LENGKAP (Level 1 → Level 2) ===
const fullIdeaSchema = z.object({
  interest: z.string(),
  idea: z.string(),
  category: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  benefits: z.array(z.string()),
  problemSolved: z.string(),
  solutionOffered: z.string(),
  marketPotential: z.string(),
  uniqueValueProposition: z.string(),
  unfairAdvantage: z.string(),
  keyMetrics: z.string(),
  revenueStream: z.string(),
  costStructure: z.string(),
  channel: z.string(),
});

const generateFullIdeaPrompt = ai.definePrompt({
  name: 'generateFullBusinessIdeaPrompt',
  input: { schema: miniIdeaSchema },
  output: { schema: fullIdeaSchema },
  prompt: `
Kamu adalah konsultan bisnis startup.
Berdasarkan ide berikut:
- Nama: "{{{idea}}}"
- Kategori: "{{{category}}}"
- Deskripsi: "{{{description}}}"

Buat versi **lengkap** dalam Bahasa Indonesia dengan field berikut:

interest: (isi dengan kategori umum, misal: "kuliner", "edukasi", dll — boleh sama dengan category jika relevan)
idea: (sama seperti input)
category: (sama seperti input)
description: (sama seperti input)
features: (array string, 2-4 fitur utama)
benefits: (array string, 2-4 manfaat utama)
problemSolved: (masalah utama yang dipecahkan — 1-2 kalimat)
solutionOffered: (solusi yang ditawarkan — 1-2 kalimat)
marketPotential: (seberapa besar pasarnya di Indonesia — 1 kalimat)
uniqueValueProposition: (UVP — 2-4 baris, pisahkan dengan \n)
unfairAdvantage: (keunggulan unik yang sulit ditiru — 2-4 baris, pisahkan dengan \n)
keyMetrics: (metrik penting, misal: "50 pelanggan/minggu", "retensi 80%" — 1 kalimat)
revenueStream: (dari mana dapat uang — 1 kalimat)
costStructure: (struktur biaya utama — 1 kalimat)
channel: (cara jualan: online, offline, marketplace, dll — 1 kalimat)

Output **hanya JSON murni**, tanpa markdown, tanpa penjelasan tambahan.
  `,
});

// === FLOW UNTUK MINI IDEAS ===
const generateMiniIdeasFlow = ai.defineFlow(
  {
    name: 'generateMiniIdeasFlow',
    inputSchema: z.object({ interest: z.string() }),
    outputSchema: generateMiniIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await generateMiniIdeasPrompt(input);
    return output;
  }
);

// === FLOW UNTUK FULL IDEA ===
const generateFullIdeaFlow = ai.defineFlow(
  {
    name: 'generateFullIdeaFlow',
    inputSchema: miniIdeaSchema,
    outputSchema: fullIdeaSchema,
  },
  async (input) => {
    const { output } = await generateFullIdeaPrompt(input);
    return output;
  }
);

// === EXPORT ===
export async function generateMiniBusinessIdeas({ interest }) {
  return generateMiniIdeasFlow({ interest });
}

export async function generateDetailBusinessIdea({ idea, category, description }) {
  return generateFullIdeaFlow({ idea, category, description });
}