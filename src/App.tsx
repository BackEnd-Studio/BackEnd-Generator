import React, { useState, useMemo } from 'react';
// --- Impor Ikon ---
import { FaWhatsapp, FaTiktok } from 'react-icons/fa6';
import { BsThreads } from 'react-icons/bs'; // Ikon Threads dari Bootstrap

// --- (Impor Firebase tidak kita pakai di proyek ini) ---
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

/*
 * =======================================================================
 * Kunci API & Database Kategori
 * =======================================================================
 */

// --- Konfigurasi Firebase (Dibiarkan, tapi tidak dipakai di v15) ---
// const firebaseConfig = {
//   apiKey: "AIzaSyCvJ6qQxpbCjMrD7Gbe4O9u7h01hhngqmY",
//   authDomain: "backend-prompt-studio.firebaseapp.com",
//   projectId: "backend-prompt-studio",
//   storageBucket: "backend-prompt-studio.firebasestorage.app",
//   messagingSenderId: "1061635739260",
//   appId: "1:1061635739260:web:2bd7e7d906deee4c4503f9"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

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

// --- Database untuk FAQ ---
const faqData = [
  {
    id: 1,
    question: "Apa itu BackEnd Generator?",
    answer: "adalah alat bantu untuk menganalisis sebuah gambar dan secara otomatis membuat deskripsi teks (prompt) yang detail. Prompt ini bisa digunakan pada platform generator gambar AI lain seperti Midjourney atau DALL-E."
  },
  {
    id: 2,
    question: "Bagaimana cara kerjanya?",
    answer: "1. Unggah gambar yang Anda inginkan. \n2. Atur parameter seperti gaya, kualitas, dan lainnya. \n3. Klik 'Buat Prompt'. \n4. BackEnd Generator akan menganalisis gambar dan membuat prompt dalam Bahasa Inggris dan Indonesia serta file json."
  },
  {
    id: 3,
    question: "Apakah aplikasi ini gratis?",
    answer: "Ya, aplikasi ini gratis digunakan. Aplikasi ini menggunakan API dari Google AI Studio yang memiliki kuota gratis yang cukup besar untuk penggunaan personal."
  },
  {
    id: 4,
    question: "Apakah gambar saya disimpan?",
    answer: "Tidak. Gambar yang Anda unggah hanya diproses saat itu juga dan tidak disimpan di server kami untuk menjaga privasi Anda."
  }
];

/*
 * =======================================================================
 * DEFINISI TIPE TYPESCRIPT (untuk perbaikan error)
 * =======================================================================
 */
interface DropdownOption {
  id: string;
  name: string;
}

// Perbaikan untuk 'title', 'options', 'selectedValue', 'onChange'
interface DropdownSectionProps {
  title: string;
  options: DropdownOption[];
  selectedValue: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

// Perbaikan untuk 'title', 'text', 'isLoading', 'isJson'
interface PromptOutputBoxProps {
  title: string;
  text: string;
  isLoading: boolean;
  isJson?: boolean;
}

// Perbaikan untuk 'label', 'isChecked', 'onChange'
interface CheckboxProps {
  label: string;
  isChecked: boolean;
  onChange: () => void;
}

// Perbaikan untuk 'href', 'children'
interface SocialIconProps {
  href: string;
  children: React.ReactNode;
}

// Tipe data baru untuk FAQ
interface Faq {
  id: number;
  question: string;
  answer: string;
}

// Perbaikan untuk 'faq', 'isOpen', 'onToggle'
interface FAQItemProps {
  faq: Faq;
  isOpen: boolean;
  onToggle: () => void;
}

/*
 * =======================================================================
 * KOMPONEN UI (Sekarang dengan Tipe)
 * =======================================================================
 */

// Komponen Dropdown
const DropdownSection = ({ title, options, selectedValue, onChange }: DropdownSectionProps) => (
  <div className="mb-5">
    <label className="text-lg font-semibold text-gray-300 mb-2 block" htmlFor={title}>
      {title}
    </label>
    <div className="relative">
      <select
        id={title}
        value={selectedValue}
        onChange={onChange}
        className="
          w-full px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200
          bg-gray-700 text-white border border-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          appearance-none
        "
      >
        {options.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

// Komponen Kotak Output
const PromptOutputBox = ({ title, text, isLoading, isJson = false }: PromptOutputBoxProps) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
    <div className={`
      relative w-full p-4 bg-gray-900 rounded-lg font-mono text-sm text-gray-300 
      overflow-y-auto border border-gray-700
      ${isJson ? 'h-64' : 'h-36'} 
    `}>
      {isLoading ? (
        <span className="animate-pulse">Membuat prompt...</span>
      ) : (
        <pre className="whitespace-pre-wrap break-words">
          {text || (isJson ? "{...}" : "Prompt akan muncul di sini...")}
        </pre>
      )}
    </div>
  </div>
);

// Komponen Checkbox
const Checkbox = ({ label, isChecked, onChange }: CheckboxProps) => (
  <label className="flex items-center space-x-3 cursor-pointer">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className="
        form-checkbox h-5 w-5 bg-gray-700 border-gray-600 rounded 
        text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800
      "
    />
    <span className="text-gray-300 font-medium">{label}</span>
  </label>
);

// Komponen Ikon Sosial Media
const SocialIcon = ({ href, children }: SocialIconProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-transform duration-200 transform hover:scale-110"
  >
    {children}
  </a>
);

// --- Komponen untuk 1 item FAQ ---
const FAQItem = ({ faq, isOpen, onToggle }: FAQItemProps) => {
  return (
    <div className="border-b border-gray-700">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full py-5 text-left"
      >
        <span className="text-md font-medium text-gray-200">{faq.question}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
      >
        <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

// --- Komponen Wrapper untuk FAQ ---
const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null); // Tipe eksplisit

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-gray-800 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        Frequently Asked Questions (FAQ)
      </h2>
      <div className="divide-y divide-gray-700">
        {faqData.map(faq => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            onToggle={() => handleToggle(faq.id)}
          />
        ))}
      </div>
    </div>
  );
};


/*
 * =======================================================================
 * KOMPONEN UTAMA APLIKASI
 * =======================================================================
 */
export default function App() {
  // State untuk gambar
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

  // State untuk output
  const [promptEN, setPromptEN] = useState('');
  const [promptID, setPromptID] = useState('');
  const [rawJson, setRawJson] = useState('');
  const [showJson, setShowJson] = useState(false);
  
  /*
   * =======================================================================
   * FUNGSI LOGIKA
   * =======================================================================
   */

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
      
      setPromptEN('');
      setPromptID('');
      setRawJson('');
    }
  };

  // --- 2. Logika Panggil Gemini API ---
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

  const handleGeneratePrompt = async () => {
    if (!imageFile) {
      alert('Silakan unggah gambar terlebih dahulu.');
      return;
    }
    
    setIsGenerating(true);
    setPromptEN('');
    setPromptID('');
    setRawJson(''); 
    
    try {
      const specs = {
        model: CATEGORIES.models.find(m => m.id === selectedModel)?.name,
        ratio: CATEGORIES.ratios.find(r => r.id === selectedRatio)?.name,
        shot: CATEGORIES.cameraShots.find(s => s.id === selectedShot)?.name,
        quality: CATEGORIES.quality.find(q => q.id === selectedQuality)?.name,
        device: CATEGORIES.devices.find(d => d.id === selectedDevice)?.name,
        style: CATEGORIES.styles.find(s => s.id === selectedStyle)?.name,
      };

      // Kunci API-mu
      const apiKey = "AIzaSyCvJ6qQxpbCjMrD7Gbe4O9u7h01hhngqmY"; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      
      const imagePart = await fileToGenerativePart(imageFile);
      
      const systemPrompt = `
        Anda adalah seorang ahli generator prompt gambar.
        Tugas Anda adalah menganalisa gambar yang diberikan pengguna dan menggabungkannya dengan spesifikasi teknis yang mereka pilih.
        
        Spesifikasi teknis pilihan pengguna:
        - Model AI: ${specs.model}
        - Aspek Rasio: ${specs.ratio}
        - Tangkapan Kamera: ${specs.shot}
        - Kualitas: ${specs.quality}
        - Perangkat: ${specs.device}
        - Gaya: ${specs.style}
        
        Tugas Anda:
        1. Analisa gambar (subjek, aksi, latar belakang).
        2. Buat satu prompt deskriptif dalam Bahasa Inggris yang menggabungkan analisa Anda dengan SEMUA spesifikasi teknis.
Jadikan prompt bahasa Inggris lebih detail, sinematik, dan artistik.
        3. Buat satu prompt deskriptif dalam Bahasa Indonesia yang menggabungkan analisa Anda dengan SEMUA spesifikasi teknis.
        4. Kembalikan hasilnya HANYA sebagai objek JSON yang valid dengan format:
           {
             "prompt_en": "...",
             "prompt_id": "..."
           }
      `;
      
      const payload = {
        contents: [{ role: "user", parts: [{ text: "Generate prompts based on my image and specs." }, imagePart] }],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              prompt_en: { type: "STRING" },
              prompt_id: { type: "STRING" }
            },
            required: ["prompt_en", "prompt_id"]
          }
        }
      };

      let response;
      let delay = 1000;
      for (let i = 0; i < 5; i++) {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (response.status !== 429) {
          break; 
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }

      if (!response) {
        throw new Error("Gagal mendapatkan respon dari server setelah beberapa kali percobaan.");
      }
      
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        setRawJson(JSON.stringify(JSON.parse(text), null, 2)); 
        const jsonResponse = JSON.parse(text); 
        setPromptEN(jsonResponse.prompt_en);
        setPromptID(jsonResponse.prompt_id);
      } else {
        console.error("Respon API tidak valid:", result);
        throw new Error('Respon AI tidak valid atau kosong.');
      }
      
    } catch (error: any) {
      console.error("Error generating prompt:", error);
      const errorMsg = `Gagal membuat prompt: ${error.message}`;
      setPromptEN(errorMsg);
      setPromptID(errorMsg);
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
    // Kita gunakan 'dark' secara permanen karena ini adalah aplikasi dark mode
    <div className="dark min-h-screen bg-gray-900 text-white p-4 md:p-8 font-sans">
      
      {/* --- HEADER --- */}
      <header className="text-center pt-4 pb-6 max-w-md mx-auto">
        <h1 className="text-5xl font-extrabold text-white tracking-wider uppercase">
          BACKEND
        </h1>
        <h2 className="text-xl font-light text-blue-400 mt-1">
          Image Prompt Generator
        </h2>
        
        {/* Ikon Sosial Media (Link sudah diisi dan menggunakan react-icons) */}
        <div className="flex justify-center gap-6 my-5">
          {/* WhatsApp */}
          <SocialIcon href="https://whatsapp.com/channel/0029Vb6C0bRBKfi8cD3jBh1z">
            <FaWhatsapp className="w-8 h-8" />
          </SocialIcon>
          {/* Threads (Menggunakan ikon BsThreads) */}
          <SocialIcon href="https://www.threads.com/@b.a.c.k_e.n.d">
            <BsThreads className="w-8 h-8" />
          </SocialIcon>
          {/* TikTok */}
          <SocialIcon href="https://www.tiktok.com/@b.a.c.k_e.n.d">
            <FaTiktok className="w-8 h-8" />
          </SocialIcon>
        </div>
      </header>
      
      {/* --- KARTU APLIKASI --- */}
      <div className="max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* --- Area Upload Gambar --- */}
        <div className="p-6">
          <label 
            htmlFor="file-upload"
            className={`
              relative w-full h-48 border-2 border-dashed border-gray-600 rounded-xl 
              flex flex-col items-center justify-center text-gray-400 cursor-pointer
              hover:border-blue-500 hover:text-blue-400 transition-colors
              ${imagePreview ? 'border-solid p-0' : ''}
            `}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <>
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-4-4m4 4l4-4m-4 4V3" /></svg>
                <span className="font-semibold">Klik untuk mengunggah gambar</span>
              </>
            )}
          </label>
          <input 
            id="file-upload"
            type="file" 
            accept="image/*" 
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* --- Konten Generator (di dalam padding) --- */}
        <div className="p-6 pt-0">
          
          {/* --- Dropdown Kategori --- */}
          <DropdownSection 
            title="Pilih Model AI"
            options={CATEGORIES.models}
            selectedValue={selectedModel}
            onChange={(e) => setModel(e.target.value)}
          />
          <DropdownSection 
            title="Aspek Rasio"
            options={CATEGORIES.ratios}
            selectedValue={selectedRatio}
            onChange={(e) => setRatio(e.target.value)}
          />
          <DropdownSection 
            title="Tangkapan Kamera"
            options={CATEGORIES.cameraShots}
            selectedValue={selectedShot}
            onChange={(e) => setShot(e.target.value)}
          />
          <DropdownSection 
            title="Kualitas Gambar"
            options={CATEGORIES.quality}
            selectedValue={selectedQuality}
            onChange={(e) => setQuality(e.target.value)}
          />
          <DropdownSection 
            title="Perangkat Pengambil"
            options={CATEGORIES.devices}
            selectedValue={selectedDevice}
            onChange={(e) => setDevice(e.target.value)}
          />
          <DropdownSection 
            title="Gaya"
            options={CATEGORIES.styles}
            selectedValue={selectedStyle}
            onChange={(e) => setStyle(e.target.value)}
          />

          {/* --- Tombol "Buat Prompt" --- */}
          <button
            onClick={handleGeneratePrompt}
            disabled={isGenerating}
            className={`
              w-full flex items-center justify-center gap-2 px-6 py-4 mt-4
              text-lg font-semibold text-white rounded-lg transition-colors duration-300
              focus:outline-none focus:ring-4 focus:ring-blue-800
              ${isGenerating 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              }
            `}
          >
            {isGenerating ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM5 14H3a1 1 0 00-1 1v2a1 1 0 001 1h12a1 1 0 001-1v-2a1 1 0 00-1-1h-2v-2H5v2z" /></svg>
            )}
            {isGenerating ? 'Sedang Membuat...' : 'Buat Prompt'}
          </button>
        </div>

        {/* --- Area Pembatas --- */}
        <div className="w-full h-2 bg-gray-900"></div>

        {/* --- Area Output --- */}
        <div className="p-6">
          
          {/* --- Checkbox JSON --- */}
          <div className="mb-4">
            <Checkbox
              label="Tampilkan Hasil JSON Mentah"
              isChecked={showJson}
              onChange={() => setShowJson(!showJson)}
            />
          </div>
          
          {/* --- Render Kondisional Sesuai Pilihan --- */}
          {showJson ? (
            // Tampilan JSON (1 Kotak)
            <PromptOutputBox 
              title="Hasil JSON (Raw)" 
              text={rawJson}
              isLoading={isGenerating}
              isJson={true} 
            />
          ) : (
            // Tampilan BIASA (2 Kotak)
            <>
              <PromptOutputBox 
                title="Prompt (English)" 
                text={promptEN}
                isLoading={isGenerating}
              />
              <PromptOutputBox 
                title="Prompt (Bahasa Indonesia)" 
                text={promptID}
                isLoading={isGenerating}
              />
            </>
          )}
        </div>

      </div>
      
      {/* --- BAGIAN FAQ --- */}
      <FAQ />
      
      {/* --- FOOTER --- */}
      <footer className="text-center py-6 max-w-md mx-auto">
        <p className="text-xl font-semibold text-gray-400">
          Create by BackEnd
        </p>
      </footer>
      
    </div>
  );
}
