'use server';
/**
 * @fileOverview AI agent untuk menghasilkan ide bisnis lengkap berdasarkan minat (interest) pengguna.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const generateBusinessIdeaInputSchema = z.object({
  interest: z.string().describe('Minat utama atau topik yang ingin dijelajahi menjadi ide bisnis.'),
});

const generateBusinessIdeaOutputSchema = z.array(
  z.object({
    interest: z.string(),
    customerSegments: z.string(),
    problem: z.string(),
    solution: z.string(),
    productsServices: z.array(
      z.object({
        title: z.string(),
        jenis: z.string(),
        deskripsi: z.string(),
        fitur_utama: z.string(),
        manfaat: z.string(),
        harga: z.string(),
        biaya_modal: z.string(),
        biaya_bahan_baku: z.string(),
        harga_jual: z.string(),
        margin: z.string(),
        keunggulan_unik: z.string(),
        angka_penting: z.string(),
        cara_jualan: z.string(),
      })
    ),
    painRelievers: z.string(),
    gainCreators: z.string(),
  })
);

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
[
    {
      "interest": "kuliner kekinian",
      "customerSegments": "Anak muda dan pekerja kantoran yang suka camilan manis dan praktis",
      "problem": "Sulit menemukan camilan enak, higienis, dan mudah dibawa untuk menemani aktivitas harian",
      "solution": "Camilan premium siap santap dengan rasa unik dan kemasan menarik",
      "productsServices": [
        {
          "title": "Brownies Lumer Premium",
          "jenis": "Produk Makanan Siap Saji",
          "deskripsi": "Brownies cokelat lembut dengan isian ganache lumer di tengah, dikemas praktis dalam cup",
          "fitur_utama": "Tanpa pengawet, tahan 3 hari suhu ruang, tersedia 5 varian rasa",
          "manfaat": "Nikmat seperti buatan rumahan, cocok untuk hadiah atau camilan harian",
          "harga": "Rp25.000/cup",
          "biaya_modal": "Rp8.000 (bahan premium dan kemasan food grade)",
          "biaya_bahan_baku": "Rp8.000",
          "harga_jual": "Rp25.000/cup",
          "margin": "±68%",
          "keunggulan_unik": "Tekstur lumer khas, dikemas dalam cup anti tumpah",
          "angka_penting": "Jumlah penjualan harian, rating pelanggan, repeat order",
          "cara_jualan": "Marketplace, Instagram, reseller kuliner lokal"
        }
      ],
      "painRelievers": "Produk tahan lama, bisa dikirim jarak jauh, tidak ribet dikonsumsi",
      "gainCreators": "Rasa premium, kemasan menarik, cocok untuk semua usia, harga terjangkau"
    },
    {
      ...
    },
    {
      ...
    }
]

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

export default async function generateBusinessIdea(input) {
  return generateBusinessIdeaFlow(input);
}
