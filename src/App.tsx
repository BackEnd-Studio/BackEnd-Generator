import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Code, Globe, Languages } from "lucide-react";
import { IoLogoWhatsapp, IoLogoTiktok } from "react-icons/io5";
import { BsThreads } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";

// HEADER COMPONENT
const Header = () => {
  const socialLinks = [
    { icon: <IoLogoWhatsapp size={26} />, href: "https://wa.me/628123456789", hover: "hover:text-green-600" },
    { icon: <BsThreads size={26} />, href: "https://www.threads.net", hover: "hover:text-black" },
    { icon: <IoLogoTiktok size={26} />, href: "https://www.tiktok.com", hover: "hover:text-black" },
  ];

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-6 py-6 text-center">
        <h1 className="text-4xl font-bold tracking-wide text-gray-900">BACKEND</h1>
        <div className="flex justify-center gap-6 mt-3">
          {socialLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-gray-700 transition ${link.hover}`}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

// UTILITY FUNCTION: Generate detailed image prompt
const generateImagePrompt = (input: string, imageName?: string) => {
  let basePrompt = input ? input : "Describe your scene";
  let prompt = `${basePrompt}, highly detailed, cinematic lighting, 8k resolution, photorealistic, dramatic perspective, vibrant colors, trending art style`;
  if (imageName) prompt += `, reference image: ${imageName}`;
  return prompt;
};

export default function App() {
  const [activeLang, setActiveLang] = useState<"en" | "id">("en");
  const [userInput, setUserInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [detailedPrompt, setDetailedPrompt] = useState("");
  const [rawJson, setRawJson] = useState("");

  // Update prompt whenever input or image changes
  useEffect(() => {
    const prompt = generateImagePrompt(userInput, imageFile?.name);
    setDetailedPrompt(prompt);
    const json = {
      input: userInput,
      image: imageFile ? imageFile.name : null,
      prompt: prompt,
      language: activeLang,
      timestamp: new Date().toISOString(),
    };
    setRawJson(JSON.stringify(json, null, 2));
  }, [userInput, imageFile, activeLang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(detailedPrompt);
    toast.success("Prompt berhasil disalin!");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 py-10">
      <Toaster position="top-right" />

      {/* HEADER */}
      <Header />

      {/* APP HEADER */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">Image & Text to Prompt Generator</h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          Type an idea or upload an image to generate a detailed AI image prompt.
        </p>
      </header>

      {/* PROMPT BOX */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-gray-900 p-5 rounded-2xl shadow-xl border border-gray-800"
      >
        <div className="flex justify-between items-center mb-3">
          {/* Language toggle */}
          <div className="flex gap-2 bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveLang("en")}
              className={`px-3 py-1 rounded-lg flex items-center gap-1 ${
                activeLang === "en" ? "bg-blue-600" : "bg-transparent"
              }`}
            >
              <Globe size={16} /> EN
            </button>
            <button
              onClick={() => setActiveLang("id")}
              className={`px-3 py-1 rounded-lg flex items-center gap-1 ${
                activeLang === "id" ? "bg-blue-600" : "bg-transparent"
              }`}
            >
              <Languages size={16} /> ID
            </button>
          </div>

          {/* Copy & JSON */}
          <div className="flex gap-2">
            <button onClick={handleCopy} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700">
              <Copy size={18} />
            </button>
            <button onClick={() => alert(rawJson)} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700">
              <Code size={18} />
            </button>
          </div>
        </div>

        {/* USER INPUT */}
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your image idea..."
          className="w-full h-28 p-4 mb-4 bg-gray-800 rounded-xl focus:outline-none resize-none text-white"
        />

        {/* IMAGE UPLOAD */}
        <div className="mb-4">
          <label className="block mb-2">Upload reference image (optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            className="text-gray-900"
          />
          {imageFile && <p className="mt-2 text-gray-300">Selected: {imageFile.name}</p>}
        </div>

        {/* DETAILED PROMPT OUTPUT */}
        <textarea
          value={detailedPrompt}
          readOnly
          placeholder="Detailed AI image prompt will appear here..."
          className="w-full h-36 p-4 bg-gray-700 rounded-xl focus:outline-none resize-none text-white"
        />
      </motion.div>
    </div>
  );
}
