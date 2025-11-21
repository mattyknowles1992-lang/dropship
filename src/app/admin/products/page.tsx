"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  image: string;
  imageAlt: string | null;
  showInUk: boolean;
  showInUs: boolean;
  categoryId: string | null;
  category?: Category | null;
  createdAt: string;
  updatedAt: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const categoryLookup = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to load catalog data");
        }

        const [productsJson, categoriesJson] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
        ]);

        if (mounted) {
          setProducts(productsJson);
          setCategories(categoriesJson);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load catalog data",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  function updateLocal(productId: string, patch: Partial<Product>) {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...patch } : p)),
    );
  }

  async function saveProduct(productId: string, patch: Partial<Product>) {
    setSavingId(productId);
    setError(null);

    try {
      const response = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, ...patch }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Failed to save product");
      }
      const updated = (await response.json()) as Product;
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, ...updated } : p)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSavingId(null);
    }
  }

  async function handleImageUpload(product: Product, file: File) {
    setUploadingId(product.id);
    setError(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok || !uploadJson.path) {
        throw new Error(uploadJson.error ?? "Upload failed");
      }

      await saveProduct(product.id, { image: uploadJson.path });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload new image",
      );
    } finally {
      setUploadingId(null);
      const ref = fileInputs.current[product.id];
      if (ref) ref.value = "";
    }
  }

  if (loading) {
    return <p className="text-sm text-[#9CA3AF]">Loading products…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Products</h1>
        <p className="text-sm text-[#9CA3AF]">
          Update catalog imagery and region visibility. Upload writes to
          /public/uploads and then saves the DB reference.
        </p>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="space-y-3 rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FBBF24]">
                  {product.title}
                </p>
                <p className="text-xs text-[#9CA3AF]">{product.slug}</p>
              </div>
              <div className="text-[11px] text-[#9CA3AF]">
                {product.categoryId
                  ? categoryLookup[product.categoryId] ?? "Unassigned"
                  : "No category"}
              </div>
            </div>

            <div className="flex gap-3 text-[11px] text-[#E5E7EB]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={product.showInUk}
                  onChange={(e) =>
                    void saveProduct(product.id, { showInUk: e.target.checked })
                  }
                />
                Show on UK
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={product.showInUs}
                  onChange={(e) =>
                    void saveProduct(product.id, { showInUs: e.target.checked })
                  }
                />
                Show on US
              </label>
            </div>

            <div className="relative h-40 w-full overflow-hidden rounded-xl border border-[#374151] bg-black/60">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.imageAlt ?? product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-[#6B7280]">
                  No image set
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={(el) => {
                  fileInputs.current[product.id] = el;
                }}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(event) => {
                  const nextFile = event.target.files?.[0];
                  if (nextFile) {
                    void handleImageUpload(product, nextFile);
                  }
                }}
              />
              <button
                type="button"
                disabled={uploadingId === product.id}
                onClick={() => fileInputs.current[product.id]?.click()}
                className="inline-flex items-center gap-2 rounded-lg border border-[#374151] bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#F9FAFB] transition hover:border-[#D9A441] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploadingId === product.id ? "Uploading..." : "Change image"}
              </button>
              <input
                className="flex-1 rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-xs text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                value={product.image}
                onChange={(e) =>
                  updateLocal(product.id, { image: e.target.value })
                }
                onBlur={(e) =>
                  void saveProduct(product.id, { image: e.target.value })
                }
                placeholder="/uploads/product.jpg"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
              <span>
                Last updated:{" "}
                {new Date(product.updatedAt).toLocaleString()}
              </span>
              {savingId === product.id ? (
                <span className="text-[#FBBF24]">Saving…</span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
