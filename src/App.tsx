import React, { useState } from "react";

export default function App() { const [idea, setIdea] = useState(""); const [image, setImage] = useState<File | null>(null); const [prompt, setPrompt] = useState("");

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0] || null; setImage(file); };

const generatePrompt = () => { let base = "";

if (idea.trim()) {
  base += `User idea: ${idea}. `;
}

if (image) {
  base += "Image uploaded → describe the contents in detail here. (In real app: run model / Vision API). ";
}

const finalPrompt = `Detailed image generation prompt: ${base.trim()}`;
setPrompt(finalPrompt);

};

return ( <div className="p-6 max-w-xl mx-auto space-y-4"> <h1 className="text-2xl font-bold">AI Prompt Generator</h1>

<div className="space-y-2">
    <label className="font-semibold">Ketik Ide Anda</label>
    <input
      type="text"
      className="w-full p-2 border rounded"
      placeholder="Tulis ide (contoh: pria berjalan di pantai...)"
      value={idea}
      onChange={(e) => setIdea(e.target.value)}
    />
  </div>

  <div className="space-y-2">
    <label className="font-semibold">Upload Gambar</label>
    <input type="file" accept="image/*" onChange={handleImageUpload} />
  </div>

  <button
    onClick={generatePrompt}
    className="px-4 py-2 bg-blue-600 text-white rounded"
  >
    Generate Prompt
  </button>

  {prompt && (
    <div className="mt-4 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
      {prompt}
    </div>
  )}
</div>

); }
