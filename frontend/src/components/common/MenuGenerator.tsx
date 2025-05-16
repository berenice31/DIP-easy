import React, { useState } from "react";
import Tesseract from "tesseract.js";

interface MenuGeneratorProps {
  onMenuGenerated?: (menuText: string) => void;
}

const MenuGenerator: React.FC<MenuGeneratorProps> = ({ onMenuGenerated }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(file, "fra", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(m.progress * 100);
          }
        },
      });

      if (onMenuGenerated) {
        onMenuGenerated(result.data.text);
      }
    } catch (err) {
      setError("Erreur lors du traitement de l'image");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Génération de Menu</h2>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={isProcessing}
        />
      </div>

      {isProcessing && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Traitement en cours... {Math.round(progress)}%
          </p>
        </div>
      )}

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
    </div>
  );
};

export default MenuGenerator;
