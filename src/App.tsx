import React, { useState, ChangeEvent } from 'react';
import { IoLogoWhatsapp, IoLogoTiktok } from 'react-icons/io5';
import { BsThreads } from 'react-icons/bs';

// --- DEFINISI TIPE ---
interface DropdownOption { id: string; name: string; }
interface Faq { id: number; question: string; answer: string; }
interface FAQItemProps { faq: Faq; isOpen: boolean; onToggle: () => void; }

// --- Data Dropdown ---
const CATEGORIES = {
  models: [
    { id: 'gemini-flash', name: 'Gemini Flash' },
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'dall-e', name: 'DALL-E' },
    { id: 'midjourney-v6', name: 'Midjourney v6' },
    { id: 'stable-diffusion-xl', name: 'Stable Diffusion XL' },
    { id: 'nanobanana', name: 'Nanobanana' },
    { id: 'chatgpt', name: 'ChatGPT' },
    { id: 'meta-ai', name: 'Meta AI' },
  ],
  ratios: [
    { id: '3-4', name: '3:4 (Portrait)' },
    { id: '4-3', name: '4:3 (Landscape)' },
    { id: '1-1', name: '1:1 (Square)' },
    { id: '16-9', name: '16:9 (Widescreen)' },
    { id: '9-16', name: '9:16 (Tall)' },
  ],
  cameraShots: [
    { id: 'close-up', name: 'Close-up' },
    { id: 'medium-shot', name: 'Medium Shot' },
    { id: 'long-shot', name: 'Long Shot' },
    { id: 'dutch-angle', name: 'Dutch Angle' },
    { id: 'low-angle', name: 'Low Angle' },
  ],
  quality: [
    { id: 'standard', name: 'Standard' },
    { id: 'hd', name: 'HD' },
    { id: 'ultra', name: 'Ultra' },
    { id: '4k', name: '4K' },
  ],
  devices: [
    { id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max' },
    { id: 'dslr-camera', name: 'DSLR Camera' },
    { id: 'canon-eos-r5', name: 'Canon EOS R5' },
    { id: 'gopro', name: 'GoPro' },
    { id: 'drone', name: 'Drone' },
    { id: 'vintage-film-camera', name: 'Vintage Film Camera' },
  ],
  styles: [
    { id: 'photorealistic', name: 'Photorealistic' },
    { id: 'anime', name: 'Anime' },
    { id: '3d', name: '3D' },
    { id: 'cartoon', name: 'Kartun' },
    { id: 'line-art', name: 'Line art' },
    { id: 'black-white', name: 'Hitam putih' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'fantasy-art', name: 'Fantasy Art' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'impressionism', name: 'Impressionism' },
  ],
};

// --- FAQ Data ---
const faqData: Faq[] = [
  { id: 1, question: "Apa itu BackEnd Generator?", answer: "Alat bantu untuk menganalisis gambar dan membuat prompt teks yang detail." },
  { id: 2, question: "Bagaimana cara kerjanya?", answer: "1. Unggah gambar\n2. Klik 'ANALISA GAMBAR'\n3. Lihat prompt hasil analisis\n4. Atur opsi tambahan jika perlu." },
  { id: 3, question: "Apakah aplikasi ini gratis?", answer: "Ya, aplikasi ini gratis digunakan." }
];

// --- Komponen FAQ Item ---
const FAQItem = ({ faq, isOpen, onToggle }: FAQItemProps) => (
  <div className="border-b border-gray-700">
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full py-4 text-left"
    >
      <span className="text-md font-medium text-gray-200">{faq.question}</span>
      <svg
        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
      <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{faq.answer}</p>
    </div>
  </div>
);

// --- Komponen FAQ Wrapper ---
const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const handleToggle = (id: number) => setOpenId(openId === id ? null : id);

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-gray-800 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-white mb-6">FAQ</h2>
      <div className="divide-y divide-gray-700">
        {faqData.map(faq => (
          <FAQItem key={faq.id} faq={faq} isOpen={openId === faq.id} onToggle={() => handleToggle(faq.id)} />
        ))}
      </div>
    </div>
  );
};

// --- Main App ---
const App = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [showDropdowns, setShowDropdowns] = useState(false);

  // Dropdown states
  const [selectedModel, setSelectedModel] = useState(CATEGORIES.models[0].id);
  const [selectedRatio, setSelectedRatio] = useState(CATEGORIES.ratios[0].id);
  const [selectedShot, setSelectedShot] = useState(CATEGORIES.cameraShots[0].id);
  const [selectedQuality, setSelectedQuality] = useState(CATEGORIES.quality[0].id);
  const [selectedDevice, setSelectedDevice] = useState(CATEGORIES.devices[0].id);
  const [selectedStyle, setSelectedStyle] = useState(CATEGORIES.styles[0].id);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrompt('');
    setShowDropdowns(false);
  };

  const handleAnalyzeImage = () => {
    // Simulasi analisa gambar (bisa diganti dengan API)
    const generatedPrompt = `Prompt detail untuk gambar ini:\nModel: ${selectedModel}\nRatio: ${selectedRatio}\nCamera Shot: ${selectedShot}\nQuality: ${selectedQuality}\nDevice: ${selectedDevice}\nStyle: ${selectedStyle}`;
    setPrompt(generatedPrompt);
    setShowDropdowns(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8">BackEnd Image Prompt Generator</h1>

      {/* Upload */}
      <div className="max-w-md mx-auto mb-4">
        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
        {previewUrl && (
          <div className="mb-4">
            <img src={previewUrl} alt="Preview" className="w-full rounded-xl mb-4" />
            <button
              onClick={handleAnalyzeImage}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-colors"
            >
              ANALISA GAMBAR
            </button>
          </div>
        )}
      </div>

      {/* Dropdowns muncul setelah klik ANALISA */}
      {showDropdowns && (
        <div className="max-w-md mx-auto bg-gray-800 p-4 rounded-xl mb-4 space-y-3">
          <Dropdown
            title="Model AI"
            options={CATEGORIES.models}
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
          />
          <Dropdown
            title="Aspek Rasio"
            options={CATEGORIES.ratios}
            value={selectedRatio}
            onChange={e => setSelectedRatio(e.target.value)}
          />
          <Dropdown
            title="Tangkapan Kamera"
            options={CATEGORIES.cameraShots}
            value={selectedShot}
            onChange={e => setSelectedShot(e.target.value)}
          />
          <Dropdown
            title="Kualitas Gambar"
            options={CATEGORIES.quality}
            value={selectedQuality}
            onChange={e => setSelectedQuality(e.target.value)}
          />
          <Dropdown
            title="Perangkat Pengambil"
            options={CATEGORIES.devices}
            value={selectedDevice}
            onChange={e => setSelectedDevice(e.target.value)}
          />
          <Dropdown
            title="Gaya"
            options={CATEGORIES.styles}
            value={selectedStyle}
            onChange={e => setSelectedStyle(e.target.value)}
          />
        </div>
      )}

      {/* Prompt hasil */}
      {prompt && (
        <div className="max-w-md mx-auto bg-gray-800 p-4 rounded-xl mb-6 whitespace-pre-line">
          {prompt}
        </div>
      )}

      {/* FAQ */}
      <FAQ />
    </div>
  );
};

// --- Komponen Dropdown ---
interface DropdownProps {
  title: string;
  options: DropdownOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown = ({ title, options, value, onChange }: DropdownProps) => (
  <div>
    <label className="block mb-1 font-medium">{title}</label>
    <select value={value} onChange={onChange} className="w-full p-2 rounded-lg bg-gray-700 text-white">
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </select>
  </div>
);

export default App;
