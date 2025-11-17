import React, { useState } from "react";

interface Faq { id: number; question: string; answer: string; }
interface FAQItemProps { faq: Faq; isOpen: boolean; onToggle: () => void; }

const faqData: Faq[] = [
  { id: 1, question: "Apa itu BackEnd Generator?", answer: "Alat yang menganalisa gambar dan menghasilkan prompt detail menggunakan Gemini." },
  { id: 2, question: "Bagaimana cara kerjanya?", answer: "Upload gambar → klik Analisa → prompt otomatis muncul." },
  { id: 3, question: "Apakah gratis?", answer: "Ya, gratis digunakan." }
];

const FAQItem = ({ faq, isOpen, onToggle }: FAQItemProps) => (
  <div className="border-b border-gray-700">
    <button onClick={onToggle} className="flex justify-between items-center w-full py-5">
      <span>{faq.question}</span>
      <span>{isOpen ? "▲" : "▼"}</span>
    </button>
    {isOpen && <p className="pb-4 text-gray-300">{faq.answer}</p>}
  </div>
);

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">FAQ</h2>
      {faqData.map((f) => (
        <FAQItem
          key={f.id}
          faq={f}
          isOpen={openId === f.id}
          onToggle={() => setOpenId(openId === f.id ? null : f.id)}
        />
      ))}
    </div>
  );
}
