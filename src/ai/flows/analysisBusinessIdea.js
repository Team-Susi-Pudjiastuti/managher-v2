'use server';
/**
 * @fileOverview AI agent untuk menghasilkan ide bisnis lengkap berdasarkan minat (interest) pengguna.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const generateBusinessIdeaInputSchema = z.object({
  interest: z.string().describe('Minat utama atau topik yang ingin dijelajahi menjadi ide bisnis.'),
});

const generateBusinessIdeaOutputSchema = z.object({
  interest: z.string(),
  marketPotential: z.string(),
  problemSolved: z.string(),
  solutionOffered: z.string(),
  productsServices: z.string(),
  unfairAdvantage: z.string(),
  uniqueValueProposition: z.string(),
});

const prompt = ai.definePrompt({
  name: 'generateBusinessIdeaPrompt',
  input: { schema: generateBusinessIdeaInputSchema },
  output: { schema: generateBusinessIdeaOutputSchema },
  prompt: `
Kamu adalah pakar bisnis kreatif dan analis pasar Indonesia.
Buatkan 3 ide bisnis lengkap berdasarkan minat berikut:

Minat: "{{{interest}}}"

Gunakan format seperti contoh berikut (tulis dalam Bahasa Indonesia):

Contoh format hasil:
{
  "marketPotential": "Ibu bekerja usia 28–45 tahun ingin menyediakan makanan sehat untuk keluarga setiap hari",
  "problemSolved": "Waktu terbatas, tidak sempat belanja & masak, takut anak kurang gizi, stres mengatur menu",
  "solutionOffered": "Anak sehat dan tumbuh optimal, hemat waktu, tidak perlu mikir masak, tenang secara mental",
  "productsServices": "Meal Prep Box untuk Ibu Bekerja\\nJenis: Layanan Langganan Makanan Sehat\\nDeskripsi: Kotak makanan siap saji mingguan dengan resep bergizi dari ahli nutrisi, bahan organik lokal\\nFitur utama: Dikirim setiap Senin, siap saji dalam 5 menit, bisa atur alergi\\nManfaat: Hemat 10 jam/minggu, anak lebih sehat, tidak perlu mikir menu\\nHarga: Rp299.000/minggu (5 menu)\\nBiaya Modal: Rp5.000.000 (kompor portable, wadah food-grade 100 pcs, branding awal)\\nBiaya Bahan Baku: ±Rp180.000/minggu\\nMargin: ±40%",
  "unfairAdvantage": "Dikirim setiap Senin pagi → tidak perlu belanja\\nSiap saji dalam 5 menit → tidak perlu masak\\nBisa atur alergi → aman untuk anak",
  "uniqueValueProposition": "Hemat 10 jam/minggu\\nAnak-anak lebih sehat\\nTidak perlu mikir menu\\nHarga: Rp299.000/minggu (5 menu)"
}

Aturan:
1. Output **harus** dalam format JSON sesuai struktur di atas.
2. Semua penjelasan dan istilah dalam **Bahasa Indonesia**.
3. Ide harus realistis, sesuai tren pasar di Indonesia.
4. Jika interest umum (misal: "fashion", "teknologi", "kuliner"), buat ide unik dan berbeda dari bisnis konvensional.
5. Pastikan setiap bagian menjawab pain point dan menawarkan nilai tambah yang jelas.
6. Jangan gunakan bullet list, tapi susun seperti paragraf dengan \n untuk baris baru.
7. Buat 3 ide bisnis berbeda.
8. Jangan buat jawaban terlalu panjang.

Sekarang hasilkan ide bisnis berdasarkan minat tersebut.
  `,
});

const generateBusinessIdeaFlow = ai.defineFlow(
  {
    name: 'generateBusinessIdeaFlow',
    inputSchema: generateBusinessIdeaInputSchema,
    outputSchema: generateBusinessIdeaOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output;
  }
);

export async function generateBusinessIdea(input) {
  return generateBusinessIdeaFlow(input);
}
