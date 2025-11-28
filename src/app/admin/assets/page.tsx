"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { AssetKeys, AssetConfig } from "@/content/assets";
import { defaultAssets } from "@/content/assets";

const LABELS: Record<AssetKeys, string> = {
  logo: "Site logo",
  heroPrimary: "Hero image (primary)",
  heroSecondary: "Hero image (secondary)",
};

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<AssetConfig>(defaultAssets);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<AssetKeys | null>(null);
  const [errorMap, setErrorMap] = useState<Partial<Record<AssetKeys, string>>>(
    {},
  );
  const [completedKey, setCompletedKey] = useState<AssetKeys | null>(null);
  const [savingKey, setSavingKey] = useState<AssetKeys | null>(null);
  const fileInputRefs = useRef<
    Partial<Record<AssetKeys, HTMLInputElement | null>>
  >({});

  useEffect(() => {
    let isMounted = true;

    async function fetchAssets() {
      try {
        const response = await fetch("/api/assets", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load assets");
        }
        const payload = (await response.json()) as AssetConfig;
        if (isMounted) {
          setAssets(payload);
          setFetchError(null);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error ? error.message : "Failed to load assets";
          setFetchError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void fetchAssets();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleChange(key: AssetKeys, value: string) {
    setAssets((prev) => ({ ...prev, [key]: value }));
  }

  async function persistAsset(key: AssetKeys, value: string) {
    setSavingKey(key);
    setCompletedKey(null);
    setErrorMap((prev) => ({ ...prev, [key]: undefined }));

    try {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, path: value }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to save asset");
      }
      setCompletedKey(key);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save asset";
      setErrorMap((prev) => ({ ...prev, [key]: message }));
    } finally {
      setSavingKey(null);
    }
  }

  async function handleFileUpload(key: AssetKeys, file: File) {
    setUploadingKey(key);
    setErrorMap((prev) => ({ ...prev, [key]: undefined }));
    setCompletedKey(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        path?: string;
        error?: string;
      };

      if (!response.ok || !payload.path) {
        throw new Error(payload.error ?? "Failed to upload image");
      }

      handleChange(key, payload.path);
      await persistAsset(key, payload.path);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload image";
      setErrorMap((prev) => ({ ...prev, [key]: message }));
    } finally {
      setUploadingKey(null);
      const inputEl = fileInputRefs.current[key];
      if (inputEl) {
        inputEl.value = "";
      }
    }
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <p className="text-sm text-[#9CA3AF]">Loading assets...</p>
      ) : fetchError ? (
        <p className="text-sm text-red-400">{fetchError}</p>
      ) : null}
      <div className="space-y-2 text-sm text-[#E5E7EB]">
        <p>
          Upload new images directly (files are stored under{" "}
          <code>/public/uploads</code>) or paste an existing path such as{" "}
          <code>/products/santa-hat-model-1.jpg</code>.
        </p>
        <p className="text-xs text-[#9CA3AF]">
          We&apos;ll wire this to the database in the CMS step, but this uploader
          lets us preview the structure right away.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(assets).map(([key, value]) => {
          const typedKey = key as AssetKeys;
          return (
            <div
              key={key}
              className="space-y-3 rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FBBF24]">
                    {LABELS[typedKey]}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">{typedKey}</p>
                </div>
              </div>
              <input
                ref={(el) => {
                  fileInputRefs.current[typedKey] = el;
                }}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(event) => {
                  const nextFile = event.target.files?.[0];
                  if (nextFile) {
                    void handleFileUpload(typedKey, nextFile);
                  }
                }}
              />
              <button
                type="button"
                disabled={uploadingKey === typedKey}
                onClick={() => fileInputRefs.current[typedKey]?.click()}
                className="inline-flex items-center gap-2 rounded-lg border border-[#374151] bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#F9FAFB] transition hover:border-[#D9A441] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploadingKey === typedKey ? "Uploading..." : "Change image"}
              </button>
              {errorMap[typedKey] ? (
                <p className="text-xs text-red-400">{errorMap[typedKey]}</p>
              ) : completedKey === typedKey ? (
                <p className="text-xs text-[#34D399]">
                  Image uploaded and linked.
                </p>
              ) : null}

              <label className="block text-xs font-medium text-[#E5E7EB]">
                Image path
                <input
                  className="mt-1 w-full rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-xs text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={value}
                  onChange={(e) => handleChange(typedKey, e.target.value)}
                  placeholder="/products/santa-hat-model-1.jpg"
                />
              </label>
              <button
                type="button"
                disabled={!value || savingKey === typedKey}
                onClick={() => void persistAsset(typedKey, value)}
                className="rounded-lg border border-[#374151] bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#F9FAFB] transition hover:border-[#D9A441] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingKey === typedKey ? "Saving..." : "Save path"}
              </button>

              <div className="relative h-32 w-full overflow-hidden rounded-xl border border-[#374151] bg-black/60">
                {value ? (
                  <Image
                    src={value}
                    alt={LABELS[typedKey]}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#6B7280]">
                    No image set
                  </div>
                )}
              </div>

              <p className="text-[11px] text-[#9CA3AF]">
                Uploaded files are stored in <code>/public/uploads</code>. If you
                paste a custom path, make sure the file already exists under{" "}
                <code>public</code>.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
