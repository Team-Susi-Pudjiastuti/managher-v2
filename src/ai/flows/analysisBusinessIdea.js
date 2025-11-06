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
    ide : z.string().describe('Nama ide bisnis yang diusulkan.'),
    jenis : z.string().describe('Kategori atau jenis bisnis (misal: "kuliner", "edukasi", dll)'),
    deskripsi : z.string().describe('Deskripsi singkat tentang ide bisnis (1-2 kalimat)'),
    fitur : z.array(z.string()).describe('Daftar fitur utama yang disediakan oleh ide bisnis (2-4 fitur)'),
    manfaat : z.array(z.string()).describe('Daftar manfaat utama yang diungkapkan oleh ide bisnis (2-4 manfaat)'),
    harga : z.string().describe('Harga jual per unit atau per minggu (misal: Rp299.000/minggu)'),
    biayaModal : z.string().describe('Biaya modal yang diperlukan untuk memulai bisnis (misal: Rp5.000.000)'),
    biayaBahanBaku : z.string().describe('Biaya bahan baku yang diperlukan untuk membuat produk atau layanan (misal: Rp180.000/minggu)'),
    hargaJual : z.string().describe('Harga jual per unit atau per minggu (misal: Rp299.000/minggu)'),
    margin : z.string().describe('Margin keuntungan per unit atau per minggu (misal: ±40%)'),
    uniqueAdvantage : z.string().describe('Keunggulan unik yang membuat ide bisnis ini berbeda dari yang lain (2-4 baris, pisahkan dengan \n)'),
    keyMetrics : z.string().describe('Metrik penting yang harus dicatat, misal: "50 pelanggan/minggu", "retensi 80%" (1 kalimat)'),
    channel : z.string().describe('Cara jualan: online, offline, marketplace, dll (1 kalimat)'),
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
[
    {
      interest: 'kuliner',
      customerJobs: 'Ibu bekerja usia 28–45 tahun ingin menyediakan makanan sehat untuk keluarga setiap hari',
      pains: 'Waktu terbatas, tidak sempat belanja & masak, takut anak kurang gizi, stres mengatur menu',
      gains: 'Anak sehat dan tumbuh optimal, hemat waktu, tidak perlu mikir masak, tenang secara mental',
      productsServices:
        'Meal Prep Box untuk Ibu Bekerja\n' +
        'Jenis: Layanan Langganan Makanan Sehat\n' +
        'Deskripsi: Kotak makanan siap saji mingguan dengan resep bergizi dari ahli nutrisi, bahan organik lokal\n' +
        'Fitur utama: Dikirim setiap Senin, siap saji dalam 5 menit, bisa atur alergi\n' +
        'Manfaat: Hemat 10 jam/minggu, anak lebih sehat, tidak perlu mikir menu\n' +
        'Harga: Rp299.000/minggu (5 menu)\n' +
        'Biaya Modal: Rp5.000.000 (kompor portable, wadah food-grade 100 pcs, branding awal)\n' +
        'Biaya Bahan Baku: Beras organik (Rp50.000), Ayam kampung (Rp80.000), Sayur lokal (Rp30.000), Bumbu & minyak (Rp20.000) → Total: Rp180.000/minggu\n' +
        'Harga Jual: Rp299.000/minggu\n' +
        'Margin: ±40%',
      unfairAdvantage:
        'Dikirim setiap Senin pagi → tidak perlu belanja\nSiap saji dalam 5 menit → tidak perlu masak\nBisa atur alergi/makanan pantangan → aman untuk anak',
      uniqueValueProposition: 'Hemat 10 jam/minggu\nAnak-anak lebih sehat\nTidak perlu mikir menu\nHarga: Rp299.000/minggu (5 menu)',
    },
    {
      interest: '...',
      customerJobs: '...',
      pains: '...',
      gains: '....',
      productsServices:
        '....\n' +
        'Jenis: ...\n' +
        'Deskripsi: ...\n' +
        'Fitur utama: ...\n' +
        'Manfaat: ...\n' +
        'Harga:..\n' +
        'Biaya Modal: ..\n' +
        'Biaya Bahan Baku: ...\n' +
        'Harga Jual: ...\n' +
        'Margin: ±..%',
      unfairAdvantage:
        '..\n...\n...',
      uniqueValueProposition: '...\n...\n....\nHarga: ....',
    },
    {
      interest: '...',
      customerJobs: '...',
      pains: '...',
      gains: '....',
      productsServices:
        '....\n' +
        'Jenis: ...\n' +
        'Deskripsi: ...\n' +
        'Fitur utama: ...\n' +
        'Manfaat: ...\n' +
        'Harga:..\n' +
        'Biaya Modal: ..\n' +
        'Biaya Bahan Baku: ...\n' +
        'Harga Jual: ...\n' +
        'Margin: ±..%',
      unfairAdvantage:
        '..\n...\n...',
      uniqueValueProposition: '...\n...\n....\nHarga: ....',
    },
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

export async function generateBusinessIdea(input) {
  return generateBusinessIdeaFlow(input);
}
