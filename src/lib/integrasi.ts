import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // simpan di .env
export const genAI = new GoogleGenerativeAI(API_KEY);
