import React, { useState } from "react";

// --- Tipe data FAQ ---
interface Faq { id: number; question: string; answer: string; }
interface FAQItemProps { faq: Faq; isOpen: boolean; onToggle: () => void; }

// --- Database FAQ ---
const faqData: Faq[] = [
  { id: 1, question: "Apa itu BackEnd Generator?", answer: "Alat bantu untuk menganalisis sebuah gambar dan secara otomatis membuat prompt teks yang detail, menggunakan teknologi Gemini." },
  { id: 2, question: "Bagaimana cara kerjanya?", answer: "1. Unggah gambar.\n2. Klik 'ANALISA GAMBAR'.\n3. Tunggu hingga prompt muncul.\n4. Ganti rasio untuk melihat prompt diperbarui." },
  { id: 3, question: "Apakah aplikasi ini gratis?", answer: "Ya, aplikasi ini gratis digunakan." }
];

// --- Komponen FAQItem ---
const FAQItem = ({ faq, isOpen, onToggle }: FAQItemProps) => (
  <div className="border-b border-gray-700">
    <button onClick={onToggle} className="flex justify-between items-center w-full py-5 text-left">
      <span className="text-md font-medium text-gray-200">{faq.question}</span>
      <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
      <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{faq.answer}</p>
    </div>
  </div>
);

// --- Komponen FAQ ---
const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const handleToggle = (id: number) => setOpenId(openId === id ? null : id);

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-gray-800 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Frequently Asked Questions (FAQ)</h2>
      <div className="divide-y divide-gray-700">
        {faqData.map(faq => (
          <FAQItem key={faq.id} faq={faq} isOpen={openId === faq.id} onToggle={() => handleToggle(faq.id)} />
        ))}
      </div>
    </div>
  );
};

// --- Komponen Utama App ---
export default function App() {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [ratio, setRatio] = useState("3:4");

  const generatePrompt = (selectedRatio: string) => {
    return `Prompt detail untuk gambar ini:
Model: gemini-flash
Ratio: ${selectedRatio}
Camera Shot: close-up
Quality: standard
Device: iphone-16-pro-max
Style: photorealistic`;
  };

  const handleAnalyze = () => {
    if (!image) return alert("Silakan pilih gambar terlebih dahulu.");
    setLoading(true);
    setPrompt("");

    setTimeout(() => {
      setPrompt(generatePrompt(ratio));
      setLoading(false);
    }, 1500);
  };

  const handleRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRatio = e.target.value;
    setRatio(newRatio);
    if (prompt) {
      setPrompt(generatePrompt(newRatio));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold text-center mb-6">BackEnd Generator</h1>

      {/* Upload Gambar */}
      <div className="flex flex-col items-center mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files ? e.target.files[0] : null)}
          className="mb-4"
        />
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="max-w-xs rounded-lg mb-4"
          />
        )}
        <button
          onClick={handleAnalyze}
          className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg font-semibold transition-all duration-300"
        >
          {loading ? "Menganalisa..." : "ANALISA GAMBAR"}
        </button>
      </div>

      {/* Dropdown Rasio */}
      {prompt && (
        <div className="max-w-xs mx-auto mb-4">
          <label className="block mb-2">Aspek Rasio:</label>
          <select
            value={ratio}
            onChange={handleRatioChange}
            className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          >
            <option>3:4 (Portrait)</option>
            <option>4:3 (Landscape)</option>
            <option>1:1 (Square)</option>
            <option>16:9 (Widescreen)</option>
            <option>9:16 (Tall)</option>
          </select>
        </div>
      )}

      {/* Prompt */}
      {prompt && (
        <div className="max-w-md mx-auto p-4 bg-gray-800 rounded-2xl shadow-2xl mb-6 whitespace-pre-line">
          {prompt}
        </div>
      )}

      {/* FAQ */}
      <FAQ />
    </div>
  );
}
