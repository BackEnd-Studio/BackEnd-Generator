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
  { id: 1, question: "Apa itu BackEnd Generator?", answer: "Alat bantu untuk menganalisis gambar dan membuat prompt detail." },
  { id: 2, question: "Bagaimana cara kerjanya?", answer: "Unggah gambar → Klik 'ANALISA GAMBAR' → Prompt muncul." },
  { id: 3, question: "Apakah gratis?", answer: "Ya, aplikasi ini gratis." }
];

const FAQItem = ({ faq, isOpen, onToggle }: FAQItemProps) => (
  <div className="border-b border-gray-700">
    <button onClick={onToggle} className="flex justify-between items-center w-full py-5 text-left text-white">
      <span>{faq.question}</span>
      <svg
        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
      <p className="text-gray-400 text-sm whitespace-pre-line">{faq.answer}</p>
    </div>
  </div>
);

const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const handleToggle = (id: number) => setOpenId(openId === id ? null : id);

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-gray-800 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold text-center text-white mb-6">FAQ</h2>
      <div className="divide-y divide-gray-700">
        {faqData.map(faq => (
          <FAQItem key={faq.id} faq={faq} isOpen={openId === faq.id} onToggle={() => handleToggle(faq.id)} />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
