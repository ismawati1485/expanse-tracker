import { genAI } from "@/lib/gemini";

export async function analyzeExpenses(expenses: any[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  Berikut adalah data pengeluaran bulan ini:
  ${JSON.stringify(expenses)}

  Tolong analisis pola keuangan saya:
  - Kategori terbesar
  - Kebiasaan yang terlihat
  - Saran penghematan
  Tulis ringkas dalam bahasa Indonesia.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
