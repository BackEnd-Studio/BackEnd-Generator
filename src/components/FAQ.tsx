
import React, { useState } from "react";

interface Faq { id: number; question: string; answer: string; }
interface FAQItemProps { faq: Faq; isOpen: boolean; onToggle: () => void; }

const faqData: Faq[] = [
  { id: 1, question: "Apa itu BackEnd Generator?", answer: "Alat untuk menganalisis gambar dan membuat prompt teks otomatis." },
  { id: 2, question: "Bagaimana cara kerjanya?", answer: "1. Unggah gambar\n2. Klik 'Analisa Gambar'\n3. Lihat prompt hasil analisis" },
  { id: 3, question: "Apakah gratis?", answer: "Ya, gratis digunakan." }
];

const FAQItem: React.FC<FAQItemProps> = ({ faq, isOpen, onToggle }) => (
  <div className="border-b border-gray-700">
    <button
      onClick={onToggle}
      className="flex justify-between w-full py-5 text-left"
    >
      <span>{faq.question}</span>
      <span>{isOpen ? "▲" : "▼"}</span>
    </button>
    {isOpen && <p className="text-gray-400 whitespace-pre-line">{faq.answer}</p>}
  </div>
);

const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const handleToggle = (id: number) => setOpenId(openId === id ? null : id);

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold text-center mb-4">FAQ</h2>
      {faqData.map(faq => (
        <FAQItem
          key={faq.id}
          faq={faq}
          isOpen={openId === faq.id}
          onToggle={() => handleToggle(faq.id)}
        />
      ))}
    </div>
  );
};

export default FAQ;
