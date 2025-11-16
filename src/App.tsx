import React, { useState } from 'react';
import { IoLogoWhatsapp, IoLogoTiktok } from 'react-icons/io5'; 
import { BsThreads } from 'react-icons/bs';

const CATEGORIES = { /* tetap sama seperti sebelumnya */ };

// Helper: file ke base64
const fileToGenerativePart = async (file: File) => {
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return { inlineData: { data: base64Data, mimeType: file.type } };
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
  const [activeTab, setActiveTab] = useState<'EN'|'IN'|'JSON'>('EN');

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

  const handleGeneratePrompt = async () => {
    if (!imageFile) { alert('Silakan unggah gambar'); return; }
    setIsGenerating(true);
    setPromptEnglish('');
    setPromptIndonesian('');
    setRawJson('');

    try {
      const imagePart = await fileToGenerativePart(imageFile);
      const masterPrompt = `Analisis gambar ini dan buat prompt AI mendetail dalam bahasa Inggris & Indonesia (Model: ${selectedModel}, Style: ${selectedStyle}, Quality: ${selectedQuality}, Shot: ${selectedShot}, Device: ${selectedDevice}, Ratio: ${selectedRatio})`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: masterPrompt, image: imagePart }),
      });

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const jsonResponse = JSON.parse(text);
        setRawJson(JSON.stringify(jsonResponse, null, 2));
        setPromptEnglish(jsonResponse.prompt_en);
        setPromptIndonesian(jsonResponse.prompt_id);
      } else {
        throw new Error('Respon AI kosong');
      }
    } catch (err: any) {
      const msg = `Gagal membuat prompt: ${err.message}`;
      setPromptEnglish(msg);
      setPromptIndonesian(msg);
      setRawJson(`{ "error": "${err.message}" }`);
    } finally {
      setIsGenerating(false);
    }
  };

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
          <a href="#"><IoLogoWhatsapp className="w-8 h-8 text-gray-400 hover:text-white"/></a>
          <a href="#"><BsThreads className="w-8 h-8 text-gray-400 hover:text-white"/></a>
          <a href="#"><IoLogoTiktok className="w-8 h-8 text-gray-400 hover:text-white"/></a>
        </div>
      </header>

      <div className="max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6">
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-gray-300 mb-4"/>
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 rounded-lg"/>}

          {/* Dropdowns */}
          {Object.entries(CATEGORIES).map(([key, options]: any) => (
            <div key={key} className="mb-2">
              <label className="block text-sm text-gray-300 mb-1">{key}</label>
              <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded" 
                value={(() => {
                  switch(key){
                    case 'models': return selectedModel;
                    case 'ratios': return selectedRatio;
                    case 'cameraShots': return selectedShot;
                    case 'quality': return selectedQuality;
                    case 'devices': return selectedDevice;
                    case 'styles': return selectedStyle;
                  }
                })()}
                onChange={(e) => {
                  switch(key){
                    case 'models': setModel(e.target.value); break;
                    case 'ratios': setRatio(e.target.value); break;
                    case 'cameraShots': setShot(e.target.value); break;
                    case 'quality': setQuality(e.target.value); break;
                    case 'devices': setDevice(e.target.value); break;
                    case 'styles': setStyle(e.target.value); break;
                  }
                }}>
                {options.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
          ))}

          <button onClick={handleGeneratePrompt} disabled={isGenerating} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mt-4 transition-colors">
            {isGenerating ? 'Sedang Membuat...' : 'Buat Prompt'}
          </button>
        </div>

        {/* Output Gabung */}
        <div className="p-6 relative">
          <div className="flex space-x-2 mb-2">
            {['EN','IN','JSON'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1 rounded-t-lg border-b-2 ${activeTab===tab?'border-blue-500 text-white':'border-gray-600 text-gray-400'}`}>
                {tab}
              </button>
            ))}
            <CopyButton textToCopy={getTabContent()} />
          </div>
          <textarea readOnly value={getTabContent()} 
            className="w-full h-40 p-3 bg-gray-700 rounded-b-lg text-white resize-none"/>
        </div>
      </div>
    </div>
  );
}
