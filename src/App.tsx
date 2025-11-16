import React, { useState } from "react"; import { IoLogoWhatsapp, IoLogoTiktok } from "react-icons/io5"; import { BsThreads } from "react-icons/bs";

// ------------------------- // TYPES // ------------------------- interface DropdownOption { id: string; name: string; } interface DropdownSectionProps { title: string; options: DropdownOption[]; selectedValue: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; } interface SocialIconProps { href: string; children: React.ReactNode; } interface CheckboxProps { label: string; isChecked: boolean; onChange: () => void; } interface FAQItem { id: number; question: string; answer: string; }

// ------------------------- // DATA // ------------------------- const CATEGORIES = { models: [ { id: 'gemini-flash', name: 'Gemini Flash' }, { id: 'gemini-pro', name: 'Gemini Pro' }, { id: 'dall-e-3', name: 'DALL-E 3' }, { id: 'midjourney-v6', name: 'Midjourney v6' }, { id: 'sdxl', name: 'Stable Diffusion XL' }, ], ratios: [ { id: '3:4', name: '3:4 (Portrait)' }, { id: '4:3', name: '4:3 (Landscape)' }, { id: '1:1', name: '1:1 (Square)' }, ], cameraShots: [ { id: 'close-up', name: 'Close-up' }, { id: 'medium-shot', name: 'Medium Shot' }, { id: 'long-shot', name: 'Long Shot' }, ], quality: [ { id: 'standard', name: 'Standard' }, { id: 'hd', name: 'HD' }, { id: 'ultra', name: 'Ultra' }, ], devices: [ { id: 'iphone-16', name: 'iPhone 16 Pro Max' }, { id: 'dslr', name: 'DSLR Camera' }, ], styles: [ { id: 'photorealistic', name: 'Photorealistic' }, { id: 'anime', name: 'Anime' }, { id: 'cyberpunk', name: 'Cyberpunk' }, ], };

const faqData: FAQItem[] = [ { id: 1, question: 'Apa itu BackEnd Generator?', answer: 'BackEnd Generator adalah alat bantu untuk menganalisis sebuah gambar dan menyusun prompt AI yang mendetail dalam bahasa Inggris dan Indonesia.' }, { id: 2, question: 'File apa yang didukung?', answer: 'Umumnya JPG, PNG dan WebP. Pastikan ukuran tidak terlalu besar (mis. < 8MB) agar proses upload cepat.' }, ];

// ------------------------- // UTILITY COMPONENTS // ------------------------- const SocialIcon = ({ href, children }: SocialIconProps) => ( <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-all duration-200"> {children} </a> );

const DropdownSection = ({ title, options, selectedValue, onChange }: DropdownSectionProps) => (

  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-2">{title}</label>
    <select value={selectedValue} onChange={onChange} className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none">
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </select>
  </div>
);const Checkbox = ({ label, isChecked, onChange }: CheckboxProps) => ( <label className="flex items-center gap-3 cursor-pointer select-none"> <input type="checkbox" checked={isChecked} onChange={onChange} className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-400" /> <span className="text-gray-300 text-sm">{label}</span> </label> );

const CopyButton = ({ textToCopy }: { textToCopy: string }) => { const [copyStatus, setCopyStatus] = useState('Copy'); const handleCopy = async () => { if (!textToCopy) return; try { await navigator.clipboard.writeText(textToCopy); setCopyStatus('Copied!'); setTimeout(() => setCopyStatus('Copy'), 2000); } catch (err) { setCopyStatus('Error'); setTimeout(() => setCopyStatus('Copy'), 2000); } };

return ( <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-500 disabled:opacity-50"> {copyStatus} </button> ); };

const FAQ = () => { const [openId, setOpenId] = useState<number | null>(null); const toggle = (id: number) => setOpenId(openId === id ? null : id);

return ( <div className="max-w-md mx-auto mt-8"> <h3 className="text-2xl font-bold text-center mb-4 text-blue-400">FAQ</h3> {faqData.map(item => ( <div key={item.id} className="bg-gray-800 p-4 rounded-xl mb-3 border border-gray-700"> <button onClick={() => toggle(item.id)} className="w-full flex justify-between items-center text-left"> <span className="text-gray-200 font-medium">{item.question}</span> <span className="text-blue-400 text-xl">{openId === item.id ? '−' : '+'}</span> </button> <div className={mt-2 overflow-hidden transition-all duration-300 ${openId === item.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}}> <p className="text-gray-400 text-sm mt-2">{item.answer}</p> </div> </div> ))} </div> ); };

// ------------------------- // HELPERS // ------------------------- const fileToGenerativePart = async (file: File) => { const base64 = await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onloadend = () => { const s = r.result as string; const parts = s.split(','); resolve(parts.length > 1 ? parts[1] : parts[0]); }; r.onerror = () => reject(new Error('Gagal membaca file')); r.readAsDataURL(file); });

return { inlineData: { data: base64, mimeType: file.type } }; };

// ------------------------- // MAIN APP // ------------------------- export default function App() { // file & preview const [imageFile, setImageFile] = useState<File | null>(null); const [imagePreview, setImagePreview] = useState<string | null>(null);

// selectors const [selectedModel, setModel] = useState(CATEGORIES.models[0].id); const [selectedRatio, setRatio] = useState(CATEGORIES.ratios[0].id); const [selectedShot, setShot] = useState(CATEGORIES.cameraShots[0].id); const [selectedQuality, setQuality] = useState(CATEGORIES.quality[0].id); const [selectedDevice, setDevice] = useState(CATEGORIES.devices[0].id); const [selectedStyle, setStyle] = useState(CATEGORIES.styles[0].id);

// outputs const [promptEnglish, setPromptEnglish] = useState(''); const [promptIndonesian, setPromptIndonesian] = useState(''); const [rawJson, setRawJson] = useState(''); const [showJson, setShowJson] = useState(false); const [isGenerating, setIsGenerating] = useState(false);

// handlers const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0] ?? null; if (file) { setImageFile(file); const reader = new FileReader(); reader.onloadend = () => setImagePreview(reader.result as string); reader.readAsDataURL(file);

setPromptEnglish('');
  setPromptIndonesian('');
  setRawJson('');
}

};

const handleGeneratePrompt = async () => { if (!imageFile) { alert('Silakan unggah gambar terlebih dahulu.'); return; }

setIsGenerating(true);
setPromptEnglish('');
setPromptIndonesian('');
setRawJson('');

try {
  const masterPrompt = `Analisis gambar ini dan buatkan prompt AI yang mendetail dalam Bahasa Inggris dan Indonesia (format JSON: {\"prompt_en\": \"...\", \"prompt_id\": \"...\"}). Gunakan konteks: [Model AI: ${selectedModel}, Gaya: ${selectedStyle}, Kualitas: ${selectedQuality}, Shot: ${selectedShot}, Perangkat: ${selectedDevice}, Rasio: ${selectedRatio}]`;

  const imagePart = await fileToGenerativePart(imageFile);
  const payload = { prompt: masterPrompt, image: imagePart };

  // TODO: Ganti dengan panggilan fetch ke backend / AI provider
  // Contoh placeholder untuk demo
  await new Promise(r => setTimeout(r, 700));
  const fakeResponse = {
    prompt_en: `A highly detailed photorealistic image based on the uploaded picture. Context: ${selectedStyle}, ${selectedQuality}, ${selectedShot}.`,
    prompt_id: `Sebuah gambar photorealistic yang sangat detail berdasarkan gambar yang diunggah. Konteks: ${selectedStyle}, ${selectedQuality}, ${selectedShot}.`,
  };

  const text = JSON.stringify(fakeResponse);
  setRawJson(JSON.stringify(JSON.parse(text), null, 2));
  setPromptEnglish(fakeResponse.prompt_en);
  setPromptIndonesian(fakeResponse.prompt_id);

  // (Jika pakai fetch, replace di sini dengan parse response)
  // const res = await fetch('/api/generate', { method: 'POST', body: JSON.stringify(payload) })
  // const data = await res.json();

} catch (err: any) {
  const msg = err?.message ?? 'Unknown error';
  setPromptEnglish(`Gagal membuat prompt: ${msg}`);
  setPromptIndonesian(`Gagal membuat prompt: ${msg}`);
  setRawJson(`{ "error": "${msg}" }`);
} finally {
  setIsGenerating(false);
}

};

return ( <div className="dark min-h-screen bg-gray-900 text-white p-4 md:p-8 font-sans"> <header className="text-center pt-4 pb-6 max-w-md mx-auto"> <h1 className="text-5xl font-extrabold text-white tracking-wider uppercase">BACKEND</h1> <h2 className="text-xl font-light text-blue-400 mt-1">Image Prompt Generator</h2> <div className="flex justify-center gap-6 my-5"> <SocialIcon href="#"> <IoLogoWhatsapp className="w-8 h-8" /> </SocialIcon> <SocialIcon href="#"> <BsThreads className="w-8 h-8" /> </SocialIcon> <SocialIcon href="#"> <IoLogoTiktok className="w-8 h-8" /> </SocialIcon> </div> </header>

<div className="max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
    <div className="p-6">
      {/* Upload area */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Unggah Gambar</label>
        <div className="flex gap-3 items-center">
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-400 file:bg-gray-700 file:text-white file:py-2 file:px-3 file:rounded-md" />
          {imagePreview && (
            <img src={imagePreview} alt="preview" className="w-20 h-20 object-cover rounded-md border border-gray-700" />
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">Format: JPG/PNG/WebP. Ukuran disarankan &lt; 8MB.</p>
      </div>

      {/* Dropdowns */}
      <DropdownSection title="Pilih Model AI" options={CATEGORIES.models} selectedValue={selectedModel} onChange={(e) => setModel(e.target.value)} />
      <DropdownSection title="Gaya" options={CATEGORIES.styles} selectedValue={selectedStyle} onChange={(e) => setStyle(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <DropdownSection title="Kualitas" options={CATEGORIES.quality} selectedValue={selectedQuality} onChange={(e) => setQuality(e.target.value)} />
        <DropdownSection title="Shot" options={CATEGORIES.cameraShots} selectedValue={selectedShot} onChange={(e) => setShot(e.target.value)} />
      </div>

      <button onClick={handleGeneratePrompt} disabled={isGenerating} className="mt-4 w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-60 transition">
        {isGenerating ? 'Sedang Membuat...' : 'Buat Prompt'}
      </button>
    </div>

    <div className="w-full h-2 bg-gray-900"></div>

    <div className="p-6">
      <div className="mb-4">
        <Checkbox label="Tampilkan Hasil JSON Mentah" isChecked={showJson} onChange={() => setShowJson(!showJson)} />
      </div>

      {showJson ? (
        <>
          <label htmlFor="raw-json" className="block text-sm font-medium text-gray-300 mb-2">Hasil JSON (Raw)</label>
          <div className="relative w-full">
            <textarea id="raw-json" readOnly value={rawJson} className="w-full h-40 p-3 bg-gray-700 rounded text-white" placeholder="Hasil JSON akan muncul di sini..." />
            <CopyButton textToCopy={rawJson} />
          </div>
        </>
      ) : (
        <>
          <label htmlFor="prompt-english" className="block text-sm font-medium text-gray-300 mb-2">Prompt (English)</label>
          <div className="relative w-full mb-4">
            <textarea id="prompt-english" readOnly value={promptEnglish} className="w-full h-40 p-3 bg-gray-700 rounded text-white" placeholder="Prompt akan muncul di sini..." />
            <CopyButton textToCopy={promptEnglish} />
          </div>

          <label htmlFor="prompt-indonesia" className="block text-sm font-medium text-gray-300 mb-2">Prompt (Bahasa Indonesia)</label>
          <div className="relative w-full">
            <textarea id="prompt-indonesia" readOnly value={promptIndonesian} className="w-full h-40 p-3 bg-gray-700 rounded text-white" placeholder="Prompt akan muncul di sini..." />
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

); }
