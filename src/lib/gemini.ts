// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("API Key Gemini tidak ditemukan! Pastikan sudah ada di .env");
}

export const genAI = new GoogleGenerativeAI(apiKey);

export async function generateResponse(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Error generateResponse:", err);
    return "Terjadi kesalahan koneksi.";
  }
}
