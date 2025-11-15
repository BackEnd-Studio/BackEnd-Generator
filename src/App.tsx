import React, { useState, useMemo } from 'react';
// --- IKON YANG SUDAH DIPERBAIKI ---
import { IoLogoWhatsapp, IoLogoTiktok } from 'react-icons/io5'; // Ambil ini dari io5
import { BsThreads } from 'react-icons/bs'; // Ambil ini dari bs

// --- Komponen CopyButton harus dideklarasikan di atas App ---
// (Jika Anda meletakkannya di file yang sama, pastikan ini ada di atas App)
const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [copyStatus, setCopyStatus] = useState('Copy'); // Teks tombol

  const handleCopy = () => {
    if (!textToCopy) return; // Jangan lakukan apa-apa jika tidak ada teks

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => {
          setCopyStatus('Copy');
        }, 2000); // Setel ulang teks tombol setelah 2 detik
      })
      .catch(err => {
        console.error('Gagal menyalin teks: ', err);
        setCopyStatus('Error'); // Tampilkan jika ada error
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
// --- END CopyButton ---

// --- Database Kategori ---
const CATEGORIES = {
  models: [
    { id: 'gemini-flash', name: 'Gemini Flash' },
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'dall-e-3', name: 'DALL-E 3' },
    { id: 'midjourney-v6', name: 'Midjourney v6' },
    { id: 'sdxl', name: 'Stable Diffusion XL' },
    { id: 'nanobanana', name: 'Nanobanana' },
    { id: 'chatgpt', name: 'ChatGPT' },
    { id: 'meta-ai', name: 'Meta AI' },
  ],
  ratios: [
    { id: '3:4', name: '3:4 (Portrait)' },
    { id: '4:3', name: '4:3 (Landscape)' },
    { id: '1:1', name: '1:1 (Square)' },
    { id: '16:9', name: '16:9 (Widescreen)' },
    { id: '9:16', name: '9:16 (Tall)' },
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
    { id: 'iphone-16', name: 'iPhone 16 Pro Max' },
    { id: 'dslr', name: 'DSLR Camera' },
    { id: 'vintage-film', name: 'Vintage Film Camera' }, 
  ],
  styles: [
    { id: 'photorealistic', name: 'Photorealistic' },
    { id: 'anime', name: 'Anime' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'fantasy-art', name: 'Fantasy Art' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'impressionism', name: 'Impressionism' },
  ],
};

// --- FAQ Data dan Komponen (diasumsikan komponen FAQ Anda sudah benar) ---
const faqData = [
  { id: 1, question: "Apa itu BackEnd Generator?", answer: "adalah alat bantu untuk menganalisis sebuah gambar..." },
  { id: 2, question: "Bagaimana cara kerjanya?", answer: "1. Unggah gambar yang Anda inginkan..." },
  // ... Tambahkan data FAQ lainnya
];

// --- Definisi Tipe & Komponen UI Lainnya (DropdownSection, SocialIcon, Checkbox, FAQ, dll.) ---
// ... (Pastikan semua tipe dan komponen ini ada di App.tsx Anda) ...
interface DropdownOption { id: string; name: string; }
interface DropdownSectionProps { title: string; options: DropdownOption[]; selectedValue: string; onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; }
interface SocialIconProps { href: string; children: React.ReactNode; }
interface CheckboxProps { label: string; isChecked: boolean; onChange: () => void; }
// ... (Definisi tipe lainnya) ...

// Karena kode komponen ini panjang, diasumsikan user telah memilikinya dengan benar.
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
  // --- STATE DECLARATION ---
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // State untuk 7 kategori
  const [selectedModel, setModel] = useState('gemini-flash');
  const [selectedRatio, setRatio] = useState('3:4');
  const [selectedShot, setShot] = useState('close-up');
  const [selectedQuality, setQuality] = useState('standard');
  const [selectedDevice, setDevice] = useState('iphone-16');
  const [selectedStyle, setStyle] = useState('photorealistic');

  // FIX: State untuk output
  const [promptEnglish, setPromptEnglish] = useState(''); 
  const [promptIndonesian, setPromptIndonesian] = useState(''); // FIX
  const [rawJson, setRawJson] = useState('');
  const [showJson, setShowJson] = useState(false);
  
  // ... Logika fileToGenerativePart (baris 387-400) ...
  // (Diasumsikan logika ini benar dan ada di App.tsx)


  // --- 1. Logika Upload Gambar ---
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


  // --- 2. Logika Panggil Gemini API (Master Prompt Logic) ---
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
      // 1. BUAT MASTER PROMPT (SANGAT PENTING UNTUK DETAIL)
      const masterPrompt = `Analisis gambar ini dan buatkan prompt AI yang mendetail.
      Tolong hasilkan dalam format JSON yang ketat: {"prompt_en": "...", "prompt_id": "..."}
      Gunakan konteks: [Model AI: ${selectedModel}, Gaya: ${selectedStyle}, Kualitas: ${selectedQuality}, Shot: ${selectedShot}, Perangkat: ${selectedDevice}, Rasio: ${selectedRatio}]`;
      
      // 2. Ambil data gambar dan buat payload
      const imagePart = await fileToGenerativePart(imageFile); // Diasumsikan fungsi ini ada
      const payload = { 
        prompt: masterPrompt, 
        image: imagePart 
      }; // <-- PAYLOAD BARU

      // Kunci API-mu (Pastikan ini ada di sini atau di .env)
      const apiKey = "AIzaSyCvJ6qQxpbCjMrD7Gbe4O9u7h01hhngqmY"; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      
      let response;
      let delay = 1000;
      for (let i = 0; i < 5; i++) {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload) // <-- GUNAKAN PAYLOAD BARU
        });
        
        if (response.status !== 429) { break; }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }

      if (!response) throw new Error("Gagal mendapatkan respon dari server setelah beberapa kali percobaan.");
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        setRawJson(JSON.stringify(JSON.parse(text), null, 2)); 
        const jsonResponse = JSON.parse(text); 
        setPromptEnglish(jsonResponse.prompt_en);
        setPromptIndonesian(jsonResponse.prompt_id); // FIX
      } else {
        console.error("Respon API tidak valid:", result);
        throw new Error('Respon AI tidak valid atau kosong.');
      }
      
    } catch (error: any) {
      const errorMsg = `Gagal membuat prompt: ${error.message}`;
      setPromptEnglish(errorMsg);
      setPromptIndonesian(errorMsg); // FIX
      setRawJson(`{ "error": "${error.message}" }`);
    } finally {
      setIsGenerating(false);
    }
  };


  /*
   * =======================================================================
   * TAMPILAN VISUAL (JSX) - Pastikan semua styling sudah benar
   * =======================================================================
   */
  return (
    <div className="dark min-h-screen bg-gray-900 text-white p-4 md:p-8 font-sans">
      
      <header className="text-center pt-4 pb-6 max-w-md mx-auto">
        <h1 className="text-5xl font-extrabold text-white tracking-wider uppercase">
          BACKEND
        </h1>
        <h2 className="text-xl font-light text-blue-400 mt-1">
          Image Prompt Generator
        </h2>
        
        {/* IKON SOSIAL MEDIA (Fix TS2786) */}
        <div className="flex justify-center gap-6 my-5">
          <SocialIcon href="https://whatsapp.com/channel/0029Vb6C0bRBKfi8cD3jBh1z">
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
          {/* ... Logika Upload Gambar (label dan input) ... */}
          
          {/* Dropdown Kategori (DropdownSection) */}
          {/* ... (DropdownSection untuk models, ratios, shots, dll.) ... */}
          <DropdownSection title="Pilih Model AI" options={CATEGORIES.models} selectedValue={selectedModel} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setModel(e.target.value)} />
          {/* ... (DropdownSection lainnya) ... */}

          {/* Tombol "Buat Prompt" */}
          <button onClick={handleGeneratePrompt} disabled={isGenerating} className="... (style Tailwind)">
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
                <textarea id="prompt-indonesia" readOnly value={promptIndonesian} placeholder="Prompt akan muncul di sini..." className="w-full h-40 p-3 bg-gray-700 rounded text-white" />
                <CopyButton textToCopy={promptIndonesian} />
              </div>
            </>
          )}
        </div>
      </div>
      
      <FAQ />
      
      <footer className="text-center py-6 max-w-md mx-auto">
        <p className="text-xl font-semibold text-gray-400">
          Copyright@2025 by BackEnd
        </p>
      </footer>
      
    </div>
  );
}
  
