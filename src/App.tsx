import React, { useState } from 'react';
import { IoLogoWhatsapp, IoLogoTiktok } from 'react-icons/io5'; 
import { BsThreads } from 'react-icons/bs';

// ... tetap pakai interface & database yang sama ...

// Copy Button
const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');
  const handleCopy = () => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy)
      .then(() => { setCopyStatus('Copied!'); setTimeout(() => setCopyStatus('Copy'), 2000); })
      .catch(() => setCopyStatus('Error'));
  };
  return (
    <button onClick={handleCopy} disabled={!textToCopy || copyStatus === 'Copied!'}
      className="ml-auto px-3 py-1 bg-gray-600 text-xs rounded hover:bg-gray-500">
      {copyStatus}
    </button>
  );
};

export default function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedModel, setModel] = useState(CATEGORIES.models[0].id);
  const [selectedRatio, setRatio] = useState(CATEGORIES.ratios[0].id);
  const [selectedShot, setShot] = useState(CATEGORIES.cameraShots[0].id);
  const [selectedQuality, setQuality] = useState(CATEGORIES.quality[0].id);
  const [selectedDevice, setDevice] = useState(CATEGORIES.devices[0].id);
  const [selectedStyle, setStyle] = useState(CATEGORIES.styles[0].id);

  const [promptEnglish, setPromptEnglish] = useState('');
  const [promptIndonesian, setPromptIndonesian] = useState('');
  const [rawJson, setRawJson] = useState('');

  const [activeTab, setActiveTab] = useState<'EN' | 'IN' | 'JSON'>('EN');

  // Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setPromptEnglish('');
    setPromptIndonesian('');
    setRawJson('');
  };

  // Generate Prompt (Dummy)
  const handleGeneratePrompt = async () => {
    if (!imageFile) { alert('Silakan unggah gambar terlebih dahulu.'); return; }
    setIsGenerating(true);
    setPromptEnglish('');
    setPromptIndonesian('');
    setRawJson('');

    try {
      const json = { 
        prompt_en: `Prompt AI English (${selectedModel})`, 
        prompt_id: `Prompt AI Indonesia (${selectedModel})` 
      };
      setRawJson(JSON.stringify(json, null, 2));
      setPromptEnglish(json.prompt_en);
      setPromptIndonesian(json.prompt_id);
    } catch (err: any) {
      const msg = `Gagal membuat prompt: ${err.message}`;
      setPromptEnglish(msg);
      setPromptIndonesian(msg);
      setRawJson(`{ "error": "${err.message}" }`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Tentukan konten berdasarkan tab aktif
  const getTabContent = () => {
    switch(activeTab){
      case 'EN': return promptEnglish;
      case 'IN': return promptIndonesian;
      case 'JSON': return rawJson;
      default: return '';
    }
  };

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

        {/* Output Kotak Gabung */}
        <div className="p-6 relative">
          {/* Tabs */}
          <div className="flex space-x-2 mb-2">
            {['EN','IN','JSON'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'EN'|'IN'|'JSON')}
                className={`px-3 py-1 rounded-t-lg border-b-2 ${activeTab === tab ? 'border-blue-500 text-white' : 'border-gray-600 text-gray-400'}`}
              >
                {tab}
              </button>
            ))}
            <CopyButton textToCopy={getTabContent()} />
          </div>

          <textarea
            readOnly
            value={getTabContent()}
            className="w-full h-40 p-3 bg-gray-700 rounded-b-lg text-white resize-none"
          />
        </div>
      </div>

      {/* FAQ */}
      <FAQ />

      <footer className="text-center py-6 max-w-md mx-auto">
        <p className="text-xl font-semibold text-gray-400">Copyright@2025 by BackEnd</p>
      </footer>
    </div>
  );
}
