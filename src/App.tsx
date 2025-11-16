import React, { useState } from "react"; import { Copy, FileJson } from "lucide-react";

// --- DEFINISI TIPE TAMBAHAN UNTUK FAQ --- interface Faq { id: number; question: string; answer: string; } interface FAQItemProps { faq: Faq; isOpen: boolean; onToggle: () => void; }

// --- Database FAQ --- const faqData: Faq[] = [ { id: 1, question: "Apa itu BackEnd Generator?", answer: "Adalah alat bantu untuk menganalisis sebuah gambar dan otomatis membuat prompt teks detail menggunakan Gemini." }, { id: 2, question: "Bagaimana cara kerjanya?", answer: "1. Unggah gambar.\n2. Atur parameter.\n3. Klik 'Buat Prompt'.\n4. Aplikasi meminta Gemini API untuk menganalisis gambar dan menghasilkan prompt." }, { id: 3, question: "Apakah aplikasi ini gratis?", answer: "Ya, aplikasi ini gratis digunakan. Kami berharap aplikasi ini membantu Anda." } ];

// --- Komponen FAQItem --- const FAQItem = ({ faq, isOpen, onToggle }: FAQItemProps) => (

  <div className="border-b border-gray-700">
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full py-5 text-left"
    >
      <span className="text-md font-medium text-gray-200">{faq.question}</span>
      <svg
        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-5" : "max-h-0"}`}>
      <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{faq.answer}</p>
    </div>
  </div>
);// --- Komponen FAQ Wrapper --- const FAQ = () => { const [openId, setOpenId] = useState<number | null>(null);

return ( <div className="max-w-md mx-auto my-8 p-6 bg-gray-800 rounded-2xl shadow-xl"> <h2 className="text-3xl font-bold text-center text-white mb-6">FAQ</h2> <div className="divide-y divide-gray-700"> {faqData.map(faq => ( <FAQItem key={faq.id} faq={faq} isOpen={openId === faq.id} onToggle={() => setOpenId(openId === faq.id ? null : faq.id)} /> ))} </div> </div> ); };

// --- MAIN APP --- export default function App() { const [selectedLang, setSelectedLang] = useState<"id" | "en">("id"); const [output, setOutput] = useState({ id: "", en: "" });

const handleCopy = () => { navigator.clipboard.writeText(output[selectedLang]); };

return ( <div className="min-h-screen w-full bg-[#0d0d0d] text-white px-5 py-10 flex flex-col items-center"> <h1 className="text-4xl font-bold mb-6 text-center">BACKEND GENERATOR</h1>

{/* --- KOTAK OUTPUT --- */}
  <div className="w-full max-w-2xl bg-[#151515] p-5 rounded-2xl shadow-xl relative border border-gray-700">
    {/* Tombol Copy & JSON */}
    <div className="absolute right-4 top-4 flex gap-2">
      <button onClick={handleCopy} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
        <Copy className="w-5 h-5" />
      </button>
      <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
        <FileJson className="w-5 h-5" />
      </button>
    </div>

    {/* Selector Bahasa */}
    <div className="flex gap-3 mb-4">
      <button
        onClick={() => setSelectedLang("id")}
        className={`px-4 py-2 rounded-lg ${selectedLang === "id" ? "bg-blue-600" : "bg-gray-700"}`}
      >ID</button>
      <button
        onClick={() => setSelectedLang("en")}
        className={`px-4 py-2 rounded-lg ${selectedLang === "en" ? "bg-blue-600" : "bg-gray-700"}`}
      >EN</button>
    </div>

    <textarea
      value={output[selectedLang]}
      onChange={(e) => setOutput({ ...output, [selectedLang]: e.target.value })}
      placeholder="Output akan muncul di sini..."
      className="w-full min-h-[220px] bg-black p-4 rounded-xl text-sm outline-none border border-gray-700"
    />
  </div>

  {/* FAQ */}
  <FAQ />

  {/* Footer */}
  <footer className="text-gray-500 mt-10 text-sm">© 2025 Backend Generator</footer>
</div>

); }
