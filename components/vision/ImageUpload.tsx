import React, { useCallback, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { VisionAnalysisResult } from "../../types";
import { auth } from "../../firebase";
import { saveHistory } from "../../services/saveHistory";

export function ImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VisionAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64DataUrl = reader.result as string;

      setPreview(base64DataUrl);
      setIsLoading(true);
      setResult(null);
      setError(null);

      try {
        const response = await fetch("http://localhost:5000/api/vision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64DataUrl,
            userEmail: auth.currentUser?.email || "anonymous",
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Vision analysis failed");
        }

        const analysis: VisionAnalysisResult = await response.json();
        setResult(analysis);

        /* ✅ SAVE HISTORY (STEP 5 COMPLETE) */
        if (auth.currentUser) {
          await saveHistory(
            auth.currentUser.uid,
            "skin_disease_detection",
            "Skin Disease Detection",
            { imageUploaded: true },
            {
              summary: analysis.summary,
              disclaimer: analysis.disclaimer,
            }
          );
        }

      } catch (err: any) {
        console.error("Vision Error:", err);
        setError(err.message || "Failed to analyze image.");
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition
            ${isDragging ? "border-teal-500 bg-teal-50" : "border-slate-300 bg-white"}
          `}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileInput}
            disabled={isLoading}
          />

          <UploadCloud className="mx-auto h-10 w-10 text-teal-500 mb-4" />
          <p className="font-semibold text-slate-800">Upload skin image</p>
          <p className="text-sm text-slate-500">JPG / PNG • Max 5MB</p>
        </div>
      ) : (
        <>
          <div className="relative rounded-xl overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                Analyzing image…
              </div>
            )}

            <img src={preview} className="w-full h-64 object-cover" />

            {!isLoading && (
              <button
                onClick={clearImage}
                className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {result && (
            <div className="mt-6 bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold mb-2">AI Analysis Result</h3>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {result.summary}
              </p>
              <p className="text-xs text-red-500 mt-3">
                {result.disclaimer}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-600">{error}</div>
          )}
        </>
      )}
    </div>
  );
}
