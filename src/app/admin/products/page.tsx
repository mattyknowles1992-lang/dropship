"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { PUBLIC_ROUTES } from "@/lib/routes";
import { PRODUCT_PAGE_OPTIONS } from "@/content/product-pages";
import { runCjSync } from "./actions";

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
  gallery: string[];
  description: string | null;
  price: string;
  compareAt: string | null;
  costPrice: string | null;
  shippingUk: string | null;
  shippingUs: string | null;
  stock: number | null;
  supplier: string | null;
  supplierSku: string | null;
  externalId: string | null;
  warehouseId: string | null;
  warehouseCode: string | null;
  warehouseName: string | null;
  showInUk: boolean;
  showInUs: boolean;
  tags: string[];
  pages: string[];
  sourceUrl: string | null;
  categoryId: string | null;
  category?: Category | null;
  createdAt: string;
  updatedAt: string;
};

type ProductListResponse = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const PLACEHOLDER_IMAGE = "/products/santa-hat-model-1.jpg";
const PAGE_SIZE = 25;
const CATEGORY_ALL = "all";
const CATEGORY_NONE = "null";
const SUPPLIER_ALL = "all";
const SUPPLIER_MANUAL = "manual";

type SupplierOption = {
  value: string;
  label: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [galleryUploadingId, setGalleryUploadingId] = useState<string | null>(null);
  const [supplierOptions, setSupplierOptions] = useState<SupplierOption[]>([]);
  const [tagDrafts, setTagDrafts] = useState<Record<string, string>>({});
  const [searchDraft, setSearchDraft] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(CATEGORY_ALL);
  const [supplierFilter, setSupplierFilter] = useState<string>(SUPPLIER_ALL);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [syncRunning, setSyncRunning] = useState(false);
  const [syncSummary, setSyncSummary] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const galleryFileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const categoryLookup = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.name])),
    [categories],
  );
  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearchTerm(searchDraft.trim());
    }, 300);

    return () => {
      window.clearTimeout(handle);
    };
  }, [searchDraft]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter, supplierFilter]);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load categories");
        }
        const categoriesJson = (await response.json()) as Category[];
        if (!cancelled) {
          setCategories(categoriesJson);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load categories");
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    let cancelled = false;

    async function loadSuppliers() {
      try {
        const response = await fetch("/api/products?mode=suppliers", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load suppliers");
        }
        const json = (await response.json()) as { suppliers?: Array<string | null> };
        if (cancelled) return;

        const seen = new Set<string>();
        const options: SupplierOption[] = [];

        for (const entry of json.suppliers ?? []) {
          const trimmed = typeof entry === "string" ? entry.trim() : "";
          if (trimmed.length === 0) {
            if (!seen.has(SUPPLIER_MANUAL)) {
              options.push({ value: SUPPLIER_MANUAL, label: "(manual)" });
              seen.add(SUPPLIER_MANUAL);
            }
            continue;
          }
          if (!seen.has(trimmed)) {
            options.push({ value: trimmed, label: trimmed });
            seen.add(trimmed);
          }
        }

        options.sort((a, b) => {
          if (a.value === b.value) return 0;
          if (a.value === SUPPLIER_MANUAL) return -1;
          if (b.value === SUPPLIER_MANUAL) return 1;
          return a.label.localeCompare(b.label);
        });

        setSupplierOptions(options);
      } catch (err) {
        if (!cancelled) {
          setError((prev) => prev ?? (err instanceof Error ? err.message : "Failed to load suppliers"));
        }
      }
    }

    void loadSuppliers();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(PAGE_SIZE),
        });

        if (searchTerm.length > 0) params.set("search", searchTerm);
        if (categoryFilter !== CATEGORY_ALL) params.set("category", categoryFilter);
        if (supplierFilter !== SUPPLIER_ALL) params.set("supplier", supplierFilter);

        const response = await fetch(`/api/products?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const payload = await response.json();

        if (!response.ok) {
          const message = payload?.error ?? "Failed to load products";
          throw new Error(message);
        }

        const { items, total: totalCount, totalPages: totalPageCount, pageSize: effectivePageSize } = payload as ProductListResponse;

        if (cancelled) return;

        if (totalPageCount > 0 && page > totalPageCount) {
          setPage(totalPageCount);
          return;
        }

        setProducts(items);
        setPageSize(effectivePageSize);
        setTotal(totalCount);
        setTotalPages(totalPageCount);
        setTagDrafts(
          Object.fromEntries(items.map((item) => [item.id, (item.tags ?? []).join(", ")])),
        );
      } catch (err) {
        if (cancelled) return;
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        if (cancelled) return;
        setProducts([]);
        setPageSize(PAGE_SIZE);
        setTotal(0);
        setTotalPages(1);
        setTagDrafts({});
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [page, searchTerm, categoryFilter, supplierFilter, reloadKey]);

  function updateLocal(productId: string, patch: Partial<Product>) {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...patch } : product)),
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
        prev.map((product) => (product.id === productId ? { ...product, ...updated } : product)),
      );
      setTagDrafts((prev) => ({
        ...prev,
        [productId]: (updated.tags ?? []).join(", "),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSavingId(null);
    }
  }

  async function handleImageUpload(productId: string, file: File) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    setUploadingId(productId);
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

      updateLocal(productId, { image: uploadJson.path });
      await saveProduct(productId, { image: uploadJson.path });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload new image");
    } finally {
      setUploadingId(null);
      const ref = fileInputs.current[productId];
      if (ref) ref.value = "";
    }
  }

  async function handleGalleryUpload(productId: string, file: File) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    setGalleryUploadingId(productId);
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

      const trimmed = product.gallery.filter((entry) => entry.trim().length > 0);
      const alreadyExists = trimmed.includes(uploadJson.path);
      const nextGallery = alreadyExists ? trimmed : [...trimmed, uploadJson.path];

      updateLocal(productId, { gallery: nextGallery });
      await saveProduct(productId, { gallery: nextGallery });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload gallery image");
    } finally {
      setGalleryUploadingId(null);
      const ref = galleryFileInputs.current[productId];
      if (ref) ref.value = "";
    }
  }

  async function handleGalleryRemove(productId: string, index: number) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const nextGallery = product.gallery.filter((_, idx) => idx !== index);
    updateLocal(productId, { gallery: nextGallery });
    await saveProduct(productId, { gallery: nextGallery });
  }

  function handleGalleryInputChange(productId: string, index: number, value: string) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const nextGallery = [...product.gallery];
    nextGallery[index] = value;
    updateLocal(productId, { gallery: nextGallery });
  }

  async function handleGalleryInputBlur(productId: string, index: number, value: string) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const sanitised = product.gallery.map((entry, idx) =>
      idx === index ? value.trim() : entry.trim(),
    );
    const nextGallery = sanitised.filter((entry) => entry.length > 0);

    updateLocal(productId, { gallery: nextGallery });
    await saveProduct(productId, { gallery: nextGallery });
  }

  async function handleRunCjSync() {
    setSyncRunning(true);
    setSyncSummary(null);
    setSyncError(null);

    try {
      const summary = await runCjSync();
      setSyncSummary(
        `Processed ${summary.pagesProcessed} page${summary.pagesProcessed === 1 ? "" : "s"}, upserted ${summary.productUpserts} product${summary.productUpserts === 1 ? "" : "s"}, variants ${summary.rawVariants}, stocks ${summary.rawStocks}.`,
      );
      setReloadKey((current) => current + 1);
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : "CJ sync failed");
    } finally {
      setSyncRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Products</h1>
        <p className="text-sm text-[#9CA3AF]">
          Update catalog imagery and region visibility. Upload writes to /public/uploads and then saves the DB reference.
        </p>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="space-y-3 rounded-2xl bg-black/60 p-4 text-sm text-[#E5E7EB]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FBBF24]">
              CJ Catalog Sync
            </p>
            <p className="text-[11px] text-[#9CA3AF]">
              Pull the latest CJ listings into the master catalog using the new normaliser pipeline.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleRunCjSync()}
            disabled={syncRunning}
            className="rounded-lg bg-[#D9A441] px-3 py-1 text-sm font-semibold text-black transition hover:bg-[#FDE68A] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {syncRunning ? "Syncing..." : "Run CJ Sync"}
          </button>
        </div>
        {syncRunning ? (
          <p className="text-[11px] text-[#9CA3AF]">
            Sync in progress... this may take a minute while CJ rate limits settle.
          </p>
        ) : null}
        {syncSummary ? (
          <p className="text-[11px] text-[#34D399]">{syncSummary}</p>
        ) : null}
        {syncError ? <p className="text-[11px] text-red-400">{syncError}</p> : null}
      </div>

      <div className="space-y-4 rounded-2xl bg-black/60 p-4 text-sm text-[#E5E7EB]">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Search</span>
            <input
              className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
              placeholder="title, tag, SKU, ID"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Category</span>
            <select
              className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value={CATEGORY_ALL}>All categories</option>
              <option value={CATEGORY_NONE}>No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Supplier</span>
            <select
              className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
              value={supplierFilter}
              onChange={(event) => setSupplierFilter(event.target.value)}
            >
              <option value={SUPPLIER_ALL}>All suppliers</option>
              {supplierOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#9CA3AF]">
          <div>
            {loading ? (
              <span>Loading results...</span>
            ) : total > 0 ? (
              <span>
                Showing {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, total)} of {total} product{total === 1 ? "" : "s"}
              </span>
            ) : (
              <span>No matching products.</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded border border-[#374151] px-2 py-1 text-[#E5E7EB] transition hover:border-[#D9A441] disabled:opacity-40"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || loading}
            >
              Previous
            </button>
            <span>
              Page {totalPages === 0 ? 0 : page} / {totalPages}
            </span>
            <button
              type="button"
              className="rounded border border-[#374151] px-2 py-1 text-[#E5E7EB] transition hover:border-[#D9A441] disabled:opacity-40"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages || loading}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {!loading && products.length === 0 ? (
          <p className="rounded-2xl bg-black/60 p-4 text-sm text-[#9CA3AF]">
            No products match the current filters.
          </p>
        ) : null}
        {products.map((product) => (
          <div
            key={product.id}
            className="space-y-5 rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FBBF24]">
                  {product.title || "Untitled product"}
                </p>
                <p className="text-[11px] text-[#9CA3AF]">Slug: {product.slug}</p>
                <p className="text-[11px] text-[#6B7280]">ID: {product.id}</p>
              </div>
              <div className="text-right text-[11px] text-[#9CA3AF]">
                <div>
                  {product.categoryId ? categoryLookup[product.categoryId] ?? "Unassigned" : "No category"}
                </div>
                <div>
                  {product.supplier ?? "(manual)"}
                  {product.externalId ? ` · ${product.externalId}` : ""}
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Title</span>
                <input
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.title}
                  onChange={(event) => updateLocal(product.id, { title: event.target.value })}
                  onBlur={(event) => {
                    const trimmed = event.target.value.trim() || "Untitled product";
                    updateLocal(product.id, { title: trimmed });
                    void saveProduct(product.id, { title: trimmed });
                  }}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Category</span>
                <select
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.categoryId ?? ""}
                  onChange={(event) => {
                    const nextValue = event.target.value || null;
                    updateLocal(product.id, { categoryId: nextValue });
                    void saveProduct(product.id, { categoryId: nextValue });
                  }}
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Tags</span>
                <input
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={tagDrafts[product.id] ?? ""}
                  onChange={(event) =>
                    setTagDrafts((prev) => ({ ...prev, [product.id]: event.target.value }))
                  }
                  onBlur={(event) => {
                    const entries = event.target.value
                      .split(",")
                      .map((entry) => entry.trim())
                      .filter((entry) => entry.length > 0);
                    updateLocal(product.id, { tags: entries });
                    void saveProduct(product.id, { tags: entries });
                    setTagDrafts((prev) => ({ ...prev, [product.id]: entries.join(", ") }));
                  }}
                  placeholder="festive, kids, uk"
                />
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Product pages</span>
                <div className="flex flex-wrap gap-3 rounded-lg border border-[#374151] bg-black/60 px-3 py-2 text-sm text-[#F9FAFB]">
                  {PRODUCT_PAGE_OPTIONS.map((opt) => {
                    const checked = (product.pages ?? []).includes(opt.slug);
                    return (
                      <label key={opt.slug} className="flex items-center gap-2 text-xs text-[#E5E7EB]">
                        <input
                          type="checkbox"
                          className="h-3 w-3 rounded border-[#4B5563] bg-black/80 text-[#D9A441] focus:ring-[#D9A441]"
                          checked={checked}
                          onChange={(event) => {
                            const current = new Set(product.pages ?? []);
                            if (event.target.checked) {
                              current.add(opt.slug);
                            } else {
                              current.delete(opt.slug);
                            }
                            const selected = Array.from(current);
                            updateLocal(product.id, { pages: selected });
                            void saveProduct(product.id, { pages: selected });
                          }}
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
                <span className="text-[10px] text-[#6B7280]">
                  Tick which product listing pages this item should appear on (For Him, For Her, For Kids, Deals).
                </span>
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Description</span>
                <textarea
                  className="h-24 rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.description ?? ""}
                  onChange={(event) => updateLocal(product.id, { description: event.target.value })}
                  onBlur={(event) => {
                    const trimmed = event.target.value.trim();
                    updateLocal(product.id, { description: trimmed || null });
                    void saveProduct(product.id, { description: trimmed || null });
                  }}
                  placeholder="Product marketing copy"
                />
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Price (£)</span>
                <input
                  type="number"
                  step="0.01"
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.price ?? ""}
                  onChange={(event) => updateLocal(product.id, { price: event.target.value })}
                  onBlur={(event) => void saveProduct(product.id, { price: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Compare at (£)</span>
                <input
                  type="number"
                  step="0.01"
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.compareAt ?? ""}
                  onChange={(event) =>
                    updateLocal(product.id, {
                      compareAt: event.target.value === "" ? null : event.target.value,
                    })
                  }
                  onBlur={(event) =>
                    void saveProduct(product.id, {
                      compareAt: event.target.value.trim() === "" ? null : event.target.value,
                    })
                  }
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Cost price (£)</span>
                <input
                  type="number"
                  step="0.01"
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.costPrice ?? ""}
                  onChange={(event) =>
                    updateLocal(product.id, {
                      costPrice: event.target.value === "" ? null : event.target.value,
                    })
                  }
                  onBlur={(event) =>
                    void saveProduct(product.id, {
                      costPrice: event.target.value.trim() === "" ? null : event.target.value,
                    })
                  }
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Stock</span>
                <input
                  type="number"
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={typeof product.stock === "number" ? product.stock : ""}
                  onChange={(event) =>
                    updateLocal(product.id, {
                      stock: event.target.value === "" ? null : Number(event.target.value),
                    })
                  }
                  onBlur={(event) =>
                    void saveProduct(product.id, {
                      stock: event.target.value === "" ? null : Number(event.target.value),
                    })
                  }
                />
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">UK shipping (£)</span>
                <input
                  type="number"
                  step="0.01"
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.shippingUk ?? ""}
                  onChange={(event) =>
                    updateLocal(product.id, {
                      shippingUk: event.target.value === "" ? null : event.target.value,
                    })
                  }
                  onBlur={(event) =>
                    void saveProduct(product.id, {
                      shippingUk: event.target.value.trim() === "" ? null : event.target.value,
                    })
                  }
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">US shipping (£)</span>
                <input
                  type="number"
                  step="0.01"
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.shippingUs ?? ""}
                  onChange={(event) =>
                    updateLocal(product.id, {
                      shippingUs: event.target.value === "" ? null : event.target.value,
                    })
                  }
                  onBlur={(event) =>
                    void saveProduct(product.id, {
                      shippingUs: event.target.value.trim() === "" ? null : event.target.value,
                    })
                  }
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Supplier</span>
                <input
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.supplier ?? ""}
                  onChange={(event) => updateLocal(product.id, { supplier: event.target.value })}
                  onBlur={(event) =>
                    void saveProduct(product.id, { supplier: event.target.value.trim() || null })
                  }
                  placeholder="CJ"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">External ID</span>
                <input
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.externalId ?? ""}
                  onChange={(event) => updateLocal(product.id, { externalId: event.target.value })}
                  onBlur={(event) =>
                    void saveProduct(product.id, { externalId: event.target.value.trim() || null })
                  }
                  placeholder="CJ pid"
                />
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Warehouse ID</span>
                <input
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.warehouseId ?? ""}
                  onChange={(event) => updateLocal(product.id, { warehouseId: event.target.value })}
                  onBlur={(event) =>
                    void saveProduct(product.id, { warehouseId: event.target.value.trim() || null })
                  }
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Warehouse code</span>
                <input
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.warehouseCode ?? ""}
                  onChange={(event) => updateLocal(product.id, { warehouseCode: event.target.value })}
                  onBlur={(event) =>
                    void saveProduct(product.id, { warehouseCode: event.target.value.trim() || null })
                  }
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Warehouse name</span>
                <input
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.warehouseName ?? ""}
                  onChange={(event) => updateLocal(product.id, { warehouseName: event.target.value })}
                  onBlur={(event) =>
                    void saveProduct(product.id, { warehouseName: event.target.value.trim() || null })
                  }
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Supplier SKU</span>
                <input
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.supplierSku ?? ""}
                  onChange={(event) => updateLocal(product.id, { supplierSku: event.target.value })}
                  onBlur={(event) =>
                    void saveProduct(product.id, { supplierSku: event.target.value.trim() || null })
                  }
                />
              </label>
              <label className="flex flex-col gap-1 md:col-span-4">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Source URL</span>
                <input
                  className="rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-sm text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                  value={product.sourceUrl ?? ""}
                  onChange={(event) => updateLocal(product.id, { sourceUrl: event.target.value })}
                  onBlur={(event) =>
                    void saveProduct(product.id, { sourceUrl: event.target.value.trim() || null })
                  }
                  placeholder="https://supplier-product-url"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] text-[#E5E7EB]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={product.showInUk}
                  onChange={(event) => void saveProduct(product.id, { showInUk: event.target.checked })}
                />
                Show in UK storefront
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={product.showInUs}
                  onChange={(event) => void saveProduct(product.id, { showInUs: event.target.checked })}
                />
                Show in US storefront
              </label>
              <span className="ml-auto text-[11px] text-[#9CA3AF]">
                Stock: {typeof product.stock === "number" ? product.stock : "-"}
              </span>
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
                ref={(element) => {
                  fileInputs.current[product.id] = element;
                }}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(event) => {
                  const nextFile = event.target.files?.[0];
                  if (nextFile) {
                    void handleImageUpload(product.id, nextFile);
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
                value={product.image ?? ""}
                onChange={(event) => updateLocal(product.id, { image: event.target.value })}
                onBlur={(event) =>
                  void saveProduct(product.id, {
                    image: event.target.value.trim() || PLACEHOLDER_IMAGE,
                  })
                }
                placeholder="/uploads/product.jpg"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FBBF24]">Gallery</p>
                <div className="flex items-center gap-2">
                  <input
                    ref={(element) => {
                      galleryFileInputs.current[product.id] = element;
                    }}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(event) => {
                      const nextFile = event.target.files?.[0];
                      if (nextFile) {
                        void handleGalleryUpload(product.id, nextFile);
                      }
                    }}
                  />
                  <button
                    type="button"
                    disabled={galleryUploadingId === product.id}
                    onClick={() => galleryFileInputs.current[product.id]?.click()}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#374151] bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#F9FAFB] transition hover:border-[#D9A441] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {galleryUploadingId === product.id ? "Uploading..." : "Add image"}
                  </button>
                </div>
              </div>

              {product.gallery.length === 0 ? (
                <p className="text-[11px] text-[#6B7280]">No additional images yet.</p>
              ) : (
                <div className="space-y-2">
                  {product.gallery.map((imagePath, index) => (
                    <div key={`${product.id}-gallery-${index}`} className="flex items-center gap-2">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-[#374151] bg-black/60">
                        <Image
                          src={imagePath || PLACEHOLDER_IMAGE}
                          alt={`${product.title} gallery ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <input
                        className="flex-1 rounded-lg border border-[#374151] bg-black/60 px-2 py-1 text-xs text-[#F9FAFB] outline-none focus:border-[#D9A441]"
                        value={imagePath}
                        onChange={(event) => handleGalleryInputChange(product.id, index, event.target.value)}
                        onBlur={(event) => void handleGalleryInputBlur(product.id, index, event.target.value)}
                        placeholder="/uploads/product-secondary.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => void handleGalleryRemove(product.id, index)}
                        className="rounded-lg border border-[#6B7280] px-2 py-1 text-[11px] text-[#F9FAFB] transition hover:border-[#EF4444] hover:text-[#FCA5A5]"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
              <span>
                Last updated: {new Date(product.updatedAt).toLocaleString()} · Created: {new Date(product.createdAt).toLocaleString()}
              </span>
              {savingId === product.id ? <span className="text-[#FBBF24]">Saving...</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}









