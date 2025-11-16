import React, { useState, useMemo } from 'react';
// --- IKON YANG SUDAH KITA PERBAIKI (Final Fix for TS2786) ---
import { IoLogoWhatsapp, IoLogoTiktok } from 'react-icons/io5'; 
import { BsThreads } from 'react-icons/bs'; 

// --- DEFINISI TIPE (Pastikan ini ada di file Anda) ---
interface DropdownOption { id: string; name: string; }
interface DropdownSectionProps { title: string; options: DropdownOption[]; selectedValue: string; onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; }
interface SocialIconProps { href: string; children: React.ReactNode; }
interface CheckboxProps { label: string; isChecked: boolean; onChange: () => void; }
// ... (Tipe lainnya seperti FAQItemProps, dll.) ...


// --- DATABASE KATEGORI (Digunakan untuk Dropdown) ---
const CATEGORIES = {
  models: [
    { id: 'gemini-flash', name: 'Gemini Flash' },
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'dall-e-3', name: 'DALL-E 3' },
    { id: 'midjourney-v6', name: 'Midjourney v6' },
    { id: 'sdxl', name: 'Stable Diffusion XL' },
  ],
  ratios: [
    { id: '3:4', name: '3:4 (Portrait)' },
    { id: '4:3', name: '4:3 (Landscape)' },
    { id: '1:1', name: '1:1 (Square)' },
  ],
  cameraShots: [
    { id: 'close-up', name: 'Close-up' },
    { id: 'medium-shot', name: 'Medium Shot' },
    { id: 'long-shot', name: 'Long Shot' },
  ],
  quality: [
    { id: 'standard', name: 'Standard' },
    { id: 'hd', name: 'HD' },
    { id: 'ultra', name: 'Ultra' },
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
const faqData = [{ id: 1, question: "Apa itu BackEnd Generator?", answer: "adalah alat bantu untuk menganalisis sebuah gambar..." }]; // Disederhanakan


// --- KOMPONEN CopyButton (Harus di Atas Fungsi App) ---
const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleCopy = () => {
    if (!textToCopy) return; 
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => {
          setCopyStatus('Copy');
        }, 2000); 
      })
      .catch(err => {
        setCopyStatus('Error'); 
      });
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 px-3 py-1 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-500 disabled:opacity-50"
      disabled={!textToCopy || copyStatus === 'Copied!'}
    >
      {copyStatus}
    </button>
  );
};
// --- End CopyButton ---

// --- ASUMSI Komponen UI Lainnya (SocialIcon, DropdownSection, FAQ) ---
const DropdownSection = (props: DropdownSectionProps) => {/* ... */ return (<div className="mb-5">{/* ... */}</div>);};
const SocialIcon = (props: SocialIconProps) => {/* ... */ return (<a href={props.href}>{props.children}</a>);};
const Checkbox = (props: CheckboxProps) => {/* ... */ return (<label>{/* ... */}</label>);};
const FAQ = () => {/* ... */ return (<div>{/* ... */}</div>);};


/*
 * =======================================================================
 * KOMPONEN UTAMA APLIKASI
 * =======================================================================
 */
export default function App() {
  // --- STATE DECLARATION (Fix TS2304) ---
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
  const [promptIndonesian, setPromptIndonesian] = useState(''); // Ejaan yang benar
  const [rawJson, setRawJson] = useState('');
  const [showJson, setShowJson] = useState(false);
  
  
  // --- FUNGSI HELPER (fileToGenerativePart) ---
  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        resolve(base64Data);
      };
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  // --- LOGIKA UPLOAD GAMBAR ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // FIX: Reset output states
      setPromptEnglish('');
      setPromptIndonesian('');
      setRawJson('');
    }
  };


  // --- LOGIKA GEMINI API CALL (Master Prompt Logic) ---
  const handleGeneratePrompt = async () => {
    if (!imageFile) {
      alert('Silakan unggah gambar terlebih dahulu.');
      return;
    }
    
    setIsGenerating(true);
    setPromptEnglish('');
    setPromptIndonesian('');
    setRawJson(''); 
    
    try {
      // 1. MASTER PROMPT (Logika Detail)
      const masterPrompt = `Analisis gambar ini dan buatkan prompt AI yang mendetail dalam Bahasa Inggris dan Indonesia (format JSON: {"prompt_en": "...", "prompt_id": "..."}).
      Gunakan konteks: [Model AI: ${selectedModel}, Gaya: ${selectedStyle}, Kualitas: ${selectedQuality}, Shot: ${selectedShot}, Perangkat: ${selectedDevice}, Rasio: ${selectedRatio}]`;
      
      // 2. Ambil data gambar dan buat payload
      const imagePart = await fileToGenerativePart(imageFile); 
      const payload = { 
        prompt: masterPrompt, 
        image: imagePart 
      }; // PAYLOAD BARU
      
      // --- (Panggilan API Fetch Anda di sini) ---
      // (Asumsi fetch call berhasil dan mengembalikan 'text' JSON)
      const text = '{"prompt_en": "A highly detailed photorealistic image of...", "prompt_id": "Sebuah gambar photorealistic yang sangat detail..."}'; // Placeholder
      
      if (text) {
        setRawJson(JSON.stringify(JSON.parse(text), null, 2)); 
        const jsonResponse = JSON.parse(text); 
        setPromptEnglish(jsonResponse.prompt_en);
        setPromptIndonesian(jsonResponse.prompt_id);
      } else {
        throw new Error('Respon AI tidak valid atau kosong.');
      }
      
    } catch (error: any) {
      const errorMsg = `Gagal membuat prompt: ${error.message}`;
      setPromptEnglish(errorMsg);
      setPromptIndonesian(errorMsg); 
      setRawJson(`{ "error": "${error.message}" }`);
    } finally {
      setIsGenerating(false);
    }
  };


  /*
   * =======================================================================
   * TAMPILAN VISUAL (JSX)
   * =======================================================================
   */
  return (
    <div className="dark min-h-screen bg-gray-900 text-white p-4 md:p-8 font-sans">
      
      {/* --- HEADER & Ikon Sosial Media --- */}
      <header className="text-center pt-4 pb-6 max-w-md mx-auto">
        <h1 className="text-5xl font-extrabold text-white tracking-wider uppercase">BACKEND</h1>
        <h2 className="text-xl font-light text-blue-400 mt-1">Image Prompt Generator</h2>
        
        {/* IKON SOSIAL MEDIA (Fix TS2786) */}
        <div className="flex justify-center gap-6 my-5">
          <SocialIcon href="https://whatsapp.com/channel/...">
            {/* @ts-ignore */}
            <IoLogoWhatsapp className="w-8 h-8" />
          </SocialIcon>
          <SocialIcon href="https://www.threads.com/@b.a.c.k_e.n.d">
            {/* @ts-ignore */}
            <BsThreads className="w-8 h-8" /> 
          </SocialIcon>
          <SocialIcon href="https://www.tiktok.com/@b.a.c.k_e.n.d">
            {/* @ts-ignore */}
            <IoLogoTiktok className="w-8 h-8" />
          </SocialIcon>
        </div>
      </header>
      
      <div className="max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* --- Area Upload Gambar & Dropdown --- */}
        <div className="p-6">
          {/* ... (Logika Upload Gambar JSX) ... */}
          
          {/* Dropdown Kategori */}
          <DropdownSection title="Pilih Model AI" options={CATEGORIES.models} selectedValue={selectedModel} onChange={(e) => setModel(e.target.value)} />
          {/* ... (Dropdown lainnya) ... */}

          {/* Tombol "Buat Prompt" */}
          <button onClick={handleGeneratePrompt} disabled={isGenerating} className="w-full ... (style Tailwind)">
            {isGenerating ? 'Sedang Membuat...' : 'Buat Prompt'}
          </button>
        </div>

        <div className="w-full h-2 bg-gray-900"></div>

        {/* --- Area Output (Fix Duplication & Add Copy Button) --- */}
        <div className="p-6">
          
          {/* Checkbox JSON */}
          <div className="mb-4">
            <Checkbox label="Tampilkan Hasil JSON Mentah" isChecked={showJson} onChange={() => setShowJson(!showJson)} />
          </div>
          
          {/* Render Kondisional OUTPUT */}
          {showJson ? (
            // Tampilan JSON (1 Kotak)
            <>
              <label htmlFor="raw-json" className="block text-sm font-medium text-gray-300 mb-2">Hasil JSON (Raw)</label>
              <div className="relative w-full">
                <textarea id="raw-json" readOnly value={rawJson} className="w-full h-40 p-3 bg-gray-700 rounded text-white" placeholder="Hasil JSON akan muncul di sini..." />
                <CopyButton textToCopy={rawJson} />
              </div>
            </>
          ) : (
            // Tampilan BIASA (2 Kotak)
            <>
              {/* English */}
              <label htmlFor="prompt-english" className="block text-sm font-medium text-gray-300 mb-2">Prompt (English)</label>
              <div className="relative w-full mb-4">
                <textarea id="prompt-english" readOnly value={promptEnglish} className="w-full h-40 p-3 bg-gray-700 rounded text-white" placeholder="Prompt akan muncul di sini..." />
                <CopyButton textToCopy={promptEnglish} />
              </div>

              {/* Indonesian */}
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
  );
}
