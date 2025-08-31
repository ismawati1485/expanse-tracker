// src/pages/GeminiTestPage.tsx
import { useState } from "react";
import { generateResponse } from "@/lib/gemini";

export default function GeminiTestPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleAsk = async () => {
    const result = await generateResponse(input);
    setOutput(result);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Tes Gemini API</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 w-full mb-4"
        placeholder="Tulis pertanyaan..."
      />
      <button
        onClick={handleAsk}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Kirim
      </button>
      {output && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <strong>Jawaban:</strong>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}
