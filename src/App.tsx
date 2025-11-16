import React, { useState, useEffect } from "react";
import FAQ from "./components/FAQ";

export default function App() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [basePrompt, setBasePrompt] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [ratio, setRatio] = useState("3:4");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
      setBasePrompt("");
      setPrompt("");
    }
  };

  const handleAnalyze = () => {
    if (!image) return;
    setLoading(true);

    setTimeout(() => {
      const simulatedPrompt = `Model: gemini-flash
Ratio: ${ratio}
Camera Shot: close-up
Quality: standard
Device: iphone-16-pro-max
Style: photorealistic`;

      setBasePrompt(simulatedPrompt);
      setPrompt(simulatedPrompt);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (basePrompt) {
      const lines = basePrompt.split("\n").map(line => {
        if (line.startsWith("Ratio:")) return `Ratio: ${ratio}`;
        return line;
      });
      setPrompt(lines.join("\n"));
    }
  }, [ratio, basePrompt]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Image Prompt Generator</h1>

      {/* Upload Gambar */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 rounded-lg border border-gray-700 bg-gray-900 text-white"
      />

      {/* Preview Gambar */}
      {preview && (
        <div className="mt-4">
          <img src={preview} alt="preview" className="w-full rounded-lg shadow-lg" />
        </div>
      )}

      {/* Tombol Analisa */}
      {preview && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex justify-center items-center gap-2"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
              ></path>
            </svg>
          )}
          {loading ? "Memproses..." : "ANALISA GAMBAR"}
        </button>
      )}

      {/* Dropdown Rasio */}
      {basePrompt && (
        <div className="mt-4">
          <label className="block mb-2 text-white font-medium">Pilih Rasio:</label>
          <select
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
          >
            <option value="3:4">3:4 (Portrait)</option>
            <option value="4:3">4:3 (Landscape)</option>
            <option value="1:1">1:1 (Square)</option>
            <option value="16:9">16:9 (Widescreen)</option>
            <option value="9:16">9:16 (Tall)</option>
          </select>
        </div>
      )}

      {/* Prompt Hasil */}
      {prompt && (
        <div className="mt-4 p-4 bg-gray-800 text-white rounded-lg shadow-md whitespace-pre-line">
          {prompt}
        </div>
      )}

      {/* FAQ */}
      <FAQ />
    </div>
  );
}
