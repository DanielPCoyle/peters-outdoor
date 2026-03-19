"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export default function MediaPicker({ value, onChange, label = "Image", required }: MediaPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      // Reset so the same file can be re-uploaded if needed
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && " *"}
      </label>

      <div className="flex gap-3 items-start">
        {/* Preview */}
        <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
          {value ? (
            <Image
              src={value}
              alt="Preview"
              width={96}
              height={80}
              className="w-full h-full object-cover"
              unoptimized={value.startsWith("https://") && !value.includes("/_next/")}
            />
          ) : (
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-2">
          {!urlMode ? (
            <>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-forest text-white text-sm font-medium rounded-lg hover:bg-forest/90 transition-colors disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Uploading…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {value ? "Replace Image" : "Upload Image"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setUrlMode(true)}
                className="block text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Or enter a URL
              </button>
            </>
          ) : (
            <>
              <input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
              <button
                type="button"
                onClick={() => setUrlMode(false)}
                className="block text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Back to upload
              </button>
            </>
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}
          {value && !urlMode && (
            <p className="text-[11px] text-gray-400 truncate max-w-xs">{value}</p>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
