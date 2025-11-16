import React, { useState } from 'react';
import { IoLogoWhatsapp, IoLogoTiktok } from 'react-icons/io5';
import { BsThreads } from 'react-icons/bs';

/* =========================
   DATABASE / CATEGORIES
========================= */
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

/* =========================
   TYPES
========================= */
interface DropdownOption { id: string; name: string; }
interface DropdownProps {
  title: string;
  options: DropdownOption[];
  selectedValue: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

/* =========================
   COMPONENTS
========================= */
const DropdownSection: React.FC<DropdownProps> = ({ title, options, selectedValue, onChange }) => (
  <div className="mb-2">
    <label className="block text-sm text-gray-300 mb-1">{title}</label>
    <select
      value={selectedValue}
      onChange={onChange}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded"
    >
      {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
    </select>
  </div>
);

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [status, setStatus] = useState('Copy');
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => { setStatus('Copied!'); setTimeout(() => setStatus('Copy'), 2000); })
      .catch(() => setStatus('Error'));
  };
  return (
    <button onClick={handleCopy} className="absolute top-2 right-2 px-2 py-1 bg-gray-600 text-xs rounded hover:bg-gray-500">{status}</button>
  );
};

const FAQ: React.FC = () => (
  <section className="max-w-md mx-auto my-8 text-gray-300">
    <h3 className="text-xl font-bold mb-2">FAQ</h3>
    <p>Belum ada FAQ.</p>
  </section>
);

/* =========================
   MAIN APP
========================= */
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
  const [outputTab, setOutputTab] = useState<'EN' | 'IN' | 'JSON'>('EN');

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

  // Generate dummy prompt
  const handleGeneratePrompt = async () => {
    if (!imageFile) { alert('Silakan unggah gambar terlebih dahulu.'); return; }
    setIsGenerating(true);
    try {
      const json = {
        prompt_en: `Prompt AI English (${selectedModel})`,
        prompt_id: `Prompt AI Indonesia (${selectedModel})`
      };
      setRawJson(JSON.stringify(json, null, 2));
      setPromptEnglish(json.prompt_en);
      setPromptIndonesian(json.prompt_id);
    } catch {
      setRawJson('{ "error": "Gagal membuat prompt" }');
      setPromptEnglish('Gagal membuat prompt');
      setPromptIndonesian('Gagal membuat prompt');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 font-sans">
      <header className="text-center pt-4 pb-6 max-w-md mx-auto">
        <h1 className="text-5xl font-extrabold uppercase">BACKEND</h1>
        <h2 className="text-xl font-light text-blue-400 mt-1">Image Prompt Generator</h2>
        <div className="flex justify-center gap-6 my-5">
          <a href="https://whatsapp.com/channel/..." target="_blank" rel="noopener noreferrer">
            <IoLogoWhatsapp className="w-8 h-8 text-gray-400 hover:text-white"/>
          </a>
          <a href="https://www.threads.com/@b.a.c.k_e.n.d" target="_blank" rel="noopener noreferrer">
            <BsThreads className="w-8 h-8 text-gray-400 hover:text-white"/>
          </a>
          <a href="https://www.tiktok.com/@b.a.c.k_e.n.d" target="_blank" rel="noopener noreferrer">
            <IoLogoTiktok className="w-8 h-8 text-gray-400 hover:text-white"/>
          </a>
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

          {/* Output Box */}
          <div className="relative mt-6 bg-gray-700 rounded p-2">
            {/* Tabs */}
            <div className="flex space-x-2 mb-2">
              {['EN','IN','JSON'].map(tab => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded ${outputTab===tab ? 'bg-blue-500 font-bold' : 'bg-gray-600'}`}
                  onClick={() => setOutputTab(tab as 'EN' | 'IN' | 'JSON')}
                >
                  {tab}
                </button>
              ))}
              <CopyButton textToCopy={
                outputTab==='EN' ? promptEnglish :
                outputTab==='IN' ? promptIndonesian : rawJson
              }/>
            </div>
            {/* Output Text */}
            <textarea
              readOnly
              value={outputTab==='EN' ? promptEnglish : outputTab==='IN' ? promptIndonesian : rawJson}
              className="w-full h-40 p-3 bg-gray-800 rounded text-white resize-none"
            />
          </div>

        </div>
      </div>

      <FAQ />

      <footer className="text-center py-6 max-w-md mx-auto">
        <p className="text-xl font-semibold text-gray-400">Copyright@2025 by BackEnd</p>
      </footer>
    </div>
  );
}
