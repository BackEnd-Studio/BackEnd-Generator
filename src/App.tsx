import React, { useState } from 'react';
import { IoLogoWhatsapp, IoLogoTiktok } from 'react-icons/io5'; 
import { BsThreads } from 'react-icons/bs'; 

// =======================
// TYPESCRIPT TYPES
// =======================
interface DropdownOption { id: string; name: string; }
interface DropdownSectionProps { title: string; options: DropdownOption[]; selectedValue: string; onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; }
interface SocialIconProps { href: string; children: React.ReactNode; }
interface CheckboxProps { label: string; isChecked: boolean; onChange: () => void; }
interface Faq { id: number; question: string; answer: string; }
interface FAQItemProps { faq: Faq; isOpen: boolean; onToggle: () => void; }

// =======================
// DATABASE
// =======================
const CATEGORIES = {
  models: [
    { id: 'gemini-flash', name: 'Gemini Flash' },
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'dall-e-3', name: 'DALL-E 3' },
  ],
  ratios: [
    { id: '3:4', name: '3:4 (Portrait)' },
    { id: '4:3', name: '4:3 (Landscape)' },
  ],
  cameraShots: [
    { id: 'close-up', name: 'Close-up' },
    { id: 'medium-shot', name: 'Medium Shot' },
  ],
  quality: [
    { id: 'standard', name: 'Standard' },
    { id: 'hd', name: 'HD' },
  ],
  devices: [
    { id: 'iphone-16', name: 'iPhone 16 Pro Max' },
    { id: 'dslr', name: 'DSLR Camera' },
  ],
  styles: [
    { id: 'photorealistic', name: 'Photorealistic' },
    { id: 'anime', name: 'Anime' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
  ],
};

const faqData: Faq[] = [
  { id: 1, question: "Apa itu BackEnd Generator?", answer: "Alat bantu untuk menganalisis sebuah gambar dan membuat prompt teks yang detail." },
  { id: 2, question: "Bagaimana cara kerjanya?", answer: "1. Unggah gambar.\n2. Atur parameter.\n3. Klik 'Buat Prompt'.\n4. Aplikasi membuat prompt melalui AI." },
  { id: 3, question: "Apakah aplikasi ini gratis?", answer: "Ya, aplikasi ini gratis digunakan." }
];

// =======================
// KOMPONEN UI
// =======================
const DropdownSection = ({ title, options, selectedValue, onChange }: DropdownSectionProps) => (
  <div className="mb-4">
    <label className="text-sm font-medium text-gray-300 mb-1 block">{title}</label>
    <select
      value={selectedValue}
      onChange={onChange}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map(item => (
        <option key={item.id} value={item.id}>{item.name}</option>
      ))}
    </select>
  </div>
);

const SocialIcon = ({ href, children }: SocialIconProps) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-transform duration-200 transform hover:scale-110">
    {children}
  </a>
);

const Checkbox = ({ label, isChecked, onChange }: CheckboxProps) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <input type="checkbox" checked={isChecked} onChange={onChange} className="form-checkbox h-4 w-4 rounded text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500"/>
    <span className="text-gray-300 text-sm">{label}</span>
  </label>
);

const FAQItem = ({ faq, isOpen, onToggle }: FAQItemProps) => (
  <div className="border-b border-gray-700">
    <button onClick={onToggle} className="flex justify-between w-full py-4 text-left">
      <span className="text-gray-200">{faq.question}</span>
      <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </button>
    {isOpen && <p className="text-gray-400 text-sm pb-4 whitespace-pre-line">{faq.answer}</p>}
  </div>
);

const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-gray-800 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold text-center text-white mb-4">Frequently Asked Questions</h2>
      <div className="divide-y divide-gray-700">
        {faqData.map(faq => (
          <FAQItem key={faq.id} faq={faq} isOpen={openId === faq.id} onToggle={() => setOpenId(openId === faq.id ? null : faq.id)} />
        ))}
      </div>
    </div>
  );
};

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');
  const handleCopy = () => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy)
      .then(() => { setCopyStatus('Copied!'); setTimeout(() => setCopyStatus('Copy'), 2000); })
      .catch(() => setCopyStatus('Error'));
  };
  return (
    <button onClick={handleCopy} disabled={!textToCopy || copyStatus === 'Copied!'} className="absolute top-2 right-2 px-2 py-1 bg-gray-600 text-xs rounded hover:bg-gray-500">{copyStatus}</button>
  );
};

// Helper untuk base64 image
const fileToGenerativePart = async (file: File) => {
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return { inlineData: { data: base64Data, mimeType: file.type } };
};

// =======================
// APP UTAMA
// =======================
export default function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Dropdown states
  const [selectedModel, setModel] = useState(CATEGORIES.models[0].id);
  const [selectedRatio, setRatio] = useState(CATEGORIES.ratios[0].id);
  const [selectedShot, setShot] = useState(CATEGORIES.cameraShots[0].id);
  const [selectedQuality, setQuality] = useState(CATEGORIES.quality[0].id);
  const [selectedDevice, setDevice] = useState(CATEGORIES.devices[0].id);
  const [selectedStyle, setStyle] = useState(CATEGORIES.styles[0].id);

  // Output
  const [promptEnglish, setPromptEnglish] = useState('');
  const [promptIndonesian, setPromptIndonesian] = useState('');
  const [rawJson, setRawJson] = useState('');
  const [showJson, setShowJson] = useState(false);

  // File upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      setPromptEnglish('');
      setPromptIndonesian('');
      setRawJson('');
    }
  };

  // =======================
  // HANDLE GENERATE PROMPT
  // =======================
  const handleGeneratePrompt = async () => {
    if (!imageFile) { alert('Silakan unggah gambar terlebih dahulu.'); return; }
    setIsGenerating(true);
    setPromptEnglish('');
    setPromptIndonesian('');
    setRawJson('');

    try {
      const masterPrompt = `Analisis gambar ini dan buatkan prompt AI yang mendetail dalam bahasa Inggris dan Indonesia.
Konteks: [Model: ${selectedModel}, Style: ${selectedStyle}, Quality: ${selectedQuality}, Shot: ${selectedShot}, Device: ${selectedDevice}, Ratio: ${selectedRatio}]`;

      const imagePart = await fileToGenerativePart(imageFile);

      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: masterPrompt, image: imagePart }),
      });

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        const jsonResponse = JSON.parse(text);
        setRawJson(JSON.stringify(jsonResponse, null, 2));
        setPromptEnglish(jsonResponse.prompt_en);
        setPromptIndonesian(jsonResponse.prompt_id);
      } else {
        throw new Error('Respon AI tidak valid atau kosong.');
      }

    } catch (error: any) {
      const msg = `Gagal membuat prompt: ${error.message}`;
      setPromptEnglish(msg);
      setPromptIndonesian(msg);
      setRawJson(`{ "error": "${error.message}" }`);
    } finally {
      setIsGenerating(false);
    }
  };

  // =======================
  // JSX RENDER
  // =======================
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 font-sans">
      <header className="text-center pt-4 pb-6 max-w-md mx-auto">
        <h1 className="text-5xl font-extrabold uppercase">BACKEND</h1>
        <h2 className="text-xl font-light text-blue-400 mt-1">Image Prompt Generator</h2>
        <div className="flex justify-center gap-6 my-5">
          <SocialIcon href="https://whatsapp.com/channel/..."><IoLogoWhatsapp className="w-8 h-8" /></SocialIcon>
          <SocialIcon href="https://www.threads.com/@b.a.c.k_e.n.d"><BsThreads className="w-8 h-8" /></SocialIcon>
          <SocialIcon href="https://www.tiktok.com/@b.a.c.k_e.n.d"><IoLogoTiktok className="w-8 h-8" /></SocialIcon>
        </div>
      </header>

      <div className="max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6">
          {/* Upload */}
          <div className="mb-4">
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-gray-300"/>
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 rounded-lg"/>}
          </div>

          {/* Dropdowns */}
          <DropdownSection title="Pilih Model AI" options={CATEGORIES.models} selectedValue={selectedModel} onChange={e => setModel(e.target.value)} />
          <DropdownSection title="Pilih Rasio" options={CATEGORIES.ratios} selectedValue={selectedRatio} onChange={e => setRatio(e.target.value)} />
          <DropdownSection title="Pilih Camera Shot" options={CATEGORIES.cameraShots} selectedValue={selectedShot} onChange={e => setShot(e.target.value)} />
          <DropdownSection title="Pilih Kualitas" options={CATEGORIES.quality} selectedValue={selectedQuality} onChange={e => setQuality(e.target.value)} />
          <DropdownSection title="Pilih Perangkat" options={CATEGORIES.devices} selectedValue={selectedDevice} onChange={e => setDevice(e.target.value)} />
          <DropdownSection title="Pilih Gaya" options={CATEGORIES.styles} selectedValue={selectedStyle} onChange={e => setStyle(e.target.value)} />

          {/* Button */}
          <button onClick={handleGeneratePrompt} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mt-4 transition-colors duration-200">
            {isGenerating ? 'Sedang Membuat...' : 'Buat Prompt'}
          </button>
        </div>

        <div className="w-full h-2 bg-gray-900"></div>

        {/* Output */}
        <div className="p-6">
          <div className="mb-4">
            <Checkbox label="Tampilkan Hasil JSON Mentah" isChecked={showJson} onChange={() => setShowJson(!showJson)} />
          </div>

          {showJson ? (
            <div className="relative">
              <textarea readOnly value={rawJson} className="w-full h-40 p-3 bg-gray-700 rounded text-white" />
              <CopyButton textToCopy={rawJson} />
            </div>
          ) : (
            <>
              <div className="relative mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Prompt (English)</label>
                <textarea readOnly value={promptEnglish} className="w-full h-40 p-3 bg-gray-700 rounded text-white" />
                <CopyButton textToCopy={promptEnglish} />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">Prompt (Bahasa Indonesia)</label>
                <textarea readOnly value={promptIndonesian} className="w-full h-40 p-3 bg-gray-700 rounded text-white" />
                <CopyButton textToCopy={promptIndonesian} />
              </div>
            </>
          )}
        </div>
      </div>

      <FAQ />

      <footer className="text-center py-6 max-w-md mx-auto">
        <p className="text-xl font-semibold text-gray-400">Copyright@2025 by BackEnd</p>
      </footer>
    </div>
  );
}
