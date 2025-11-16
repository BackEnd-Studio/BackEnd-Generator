import React from "react";

interface Props {
  prompt: string;
}

const PromptResult: React.FC<Props> = ({ prompt }) => {
  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-800 rounded-2xl shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-2">Prompt Detail</h2>
      <pre className="whitespace-pre-wrap text-gray-200">{prompt}</pre>
    </div>
  );
};

export default PromptResult;
