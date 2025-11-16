import React, { useState } from "react";

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface FAQItemProps {
  faq: Faq;
  isOpen: boolean;
  onToggle: () => void;
}

const faqData: Faq[] = [
  { id: 1, question: "Apa itu BackEnd Generator?", answer: "Alat untuk menganalisis gambar dan membuat prompt detail." },
  { id: 2, question: "Bagaimana cara kerjanya?", answer: "Unggah gambar, klik 'ANALISA GAMBAR', prompt akan muncul." },
  { id: 3, question: "Apakah gratis?", answer: "Ya, aplikasi ini gratis digunakan." },
];

const FAQItem = ({ faq, isOpen, onToggle }: FAQItemProps) => (
  <div className="border-b border-gray-700">
    <button
      onClick={onToggle}
      className="flex justify-between w-full py-4 text-left"
    >
      <span className="text-gray-200">{faq.question}</span>
      <span>{isOpen ? "▲" : "▼"}</span>
    </button>
    {isOpen && <p className="text-gray-400 text-sm py-2">{faq.answer}</p>}
  </div>
);

const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const handleToggle = (id: number) => setOpenId(openId === id ? null : id);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">FAQ</h2>
      <div className="divide-y divide-gray-700">
        {faqData.map((faq) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            onToggle={() => handleToggle(faq.id)}
          />
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [ratio, setRatio] = useState("3:4");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPrompt(""); // Reset prompt saat gambar baru diunggah
    }
  };

  const handleAnalyze = () => {
    if (!image) return;
    setLoading(true);
    // Simulasi API / proses analisis gambar
    setTimeout(() => {
      setPrompt(`Prompt detail untuk gambar ini:
Model: gemini-flash
Ratio: ${ratio}
Camera Shot: close-up
Quality: standard
Device: iphone-16-pro-max
Style: photorealistic`);
      setLoading(false);
    }, 2000); // 2 detik animasi loading
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">BackEnd Image Prompt Generator</h1>

      <div className="max-w-md mx-auto">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && (
          <div className="my-4">
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        )}

        {image && (
          <button
            onClick={handleAnalyze}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg mt-2 font-bold transition-colors"
            disabled={loading}
          >
            {loading ? "Menganalisis..." : "ANALISA GAMBAR"}
          </button>
        )}

        {/* Dropdown Rasio */}
        {prompt && (
          <div className="mt-4">
            <label className="block mb-1">Aspek Rasio:</label>
            <select
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            >
              <option value="3:4">3:4 (Portrait)</option>
              <option value="4:3">4:3 (Landscape)</option>
              <option value="1:1">1:1 (Square)</option>
              <option value="16:9">16:9 (Widescreen)</option>
              <option value="9:16">9:16 (Tall)</option>
            </select>
          </div>
        )}

        {/* Prompt hasil */}
        {prompt && (
          <div className="mt-4 p-4 bg-gray-800 rounded-xl whitespace-pre-line">
            {prompt}
          </div>
        )}

        {/* FAQ */}
        {prompt && <FAQ />}
      </div>
    </div>
  );
};

export default App;
