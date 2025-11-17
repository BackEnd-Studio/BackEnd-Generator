import React, { useState } from "react";
import FAQ from "./components/FAQ";

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [ratio, setRatio] = useState("3:4");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  // --- Convert File to Base64 ---
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() || "");
      reader.onerror = (error) => reject(error);
    });
  };

  // --- Handle Upload ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await convertToBase64(file);
    setImage(base64.replace("data:image/jpeg;base64,", "").replace("data:image/png;base64,", ""));
  };

  // --- ANALISA GAMBAR ---
  const handleAnalyze = async () => {
    if (!image) {
      alert("Upload gambar dulu.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ratio,
          imageBase64: image
        })
      });

      const data = await res.json();

      setResult(data.prompt || "Tidak ada hasil dari backend.");
    } catch (err) {
      console.error(err);
      setResult("Gagal terhubung ke backend.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-3xl font-bold text-center mb-6">BackEnd Generator</h1>

      {/* Upload */}
      <div className="max-w-md mx-auto">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />

        {/* Preview */}
        {image && (
          <div className="w-full mb-4">
            <img
              src={`data:image/jpeg;base64,${image}`}
              className="w-full rounded-lg shadow-lg"
              alt="preview"
            />
          </div>
        )}

        {/* RATIO */}
        {image && (
          <div className="mb-4">
            <label className="text-sm text-gray-300">Aspect Ratio</label>
            <select
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg mt-1"
            >
              <option value="3:4">3:4 (Portrait)</option>
              <option value="4:3">4:3 (Landscape)</option>
              <option value="1:1">1:1 (Square)</option>
              <option value="16:9">16:9 (Wide)</option>
              <option value="9:16">9:16 (Tall)</option>
            </select>
          </div>
        )}

        {/* ANALISA BUTTON */}
        {image && (
          <button
            onClick={handleAnalyze}
            className="w-full py-3 mt-3 text-lg font-bold bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Menganalisa..." : "ANALISA GAMBAR"}
          </button>
        )}

        {/* HASIL */}
        {result && (
          <div className="mt-6 bg-gray-800 p-4 rounded-xl whitespace-pre-line">
            <h2 className="text-lg font-bold mb-2">Prompt Hasil</h2>
            <p>{result}</p>
          </div>
        )}
      </div>

      {/* FAQ SELALU TAMPIL */}
      <FAQ />
    </div>
  );
}
