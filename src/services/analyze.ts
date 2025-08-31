// src/services/analyze.ts
import { genAI } from "@/lib/gemini";

export async function analyzeExpenses(expenses: { category: string; amount: number }[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const expenseText = expenses
      .map((e) => `${e.category}: Rp${e.amount}`)
      .join(", ");

    const prompt = `
      Kamu adalah asisten keuangan. Analisis data pengeluaran berikut: 
      ${expenseText}.
      
      Berikan insight singkat:
      - kategori mana yang paling besar,
      - apakah ada pengeluaran boros,
      - saran hemat.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err: any) {
    console.error("Error analyzeExpenses:", err);

    // biar error detail juga kelihatan di UI (sementara untuk debug)
    return `Gagal menganalisis pengeluaran. Error: ${err.message || JSON.stringify(err)}`;
  }
}
