import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CJ Raw Feed",
};

type RawCjProduct = {
  id: string;
  categoryId: string | null;
  data: any;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
};

function extractSummary(row: RawCjProduct) {
  const data = row.data ?? {};
  const name: string =
    data.name ??
    data.productNameEn ??
    (Array.isArray(data.productName) ? data.productName[0] : data.productName) ??
    "Unnamed product";

  const image: string | null =
    data.mainImage ?? data.image ?? data.productImage ?? null;

  const price =
    typeof data.sellPrice === "number"
      ? data.sellPrice
      : typeof data.retailPrice === "number"
        ? data.retailPrice
        : null;

  const status: string = data._status ?? (price && image ? "ok" : "needs_review");

  return { name, image, price, status };
}

async function loadRaw(): Promise<RawCjProduct[]> {
  const headers: HeadersInit = {};
  if (process.env.ADMIN_API_TOKEN) {
    headers["x-admin-token"] = process.env.ADMIN_API_TOKEN;
  }

  const res = await fetch(`${process.env.NEXTAUTH_URL ?? ""}/api/admin/cj/raw?limit=50`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    // Best-effort: return empty list if the endpoint is not yet usable.
    return [];
  }

  return (await res.json()) as RawCjProduct[];
}

export default async function AdminCjRawPage() {
  const rows = await loadRaw();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">CJ Raw Feed</h1>
        <p className="text-sm text-[#9CA3AF]">
          These rows are stored in the <code>RawCjProduct</code> table. They show
          what comes back from CJ before any mapping. Use this as a WMS view to
          decide which items to promote into real store products.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-[#9CA3AF]">
          No raw CJ rows loaded yet. Run the CJ import endpoint to populate this
          table.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((row) => {
          const summary = extractSummary(row);
          return (
            <div
              key={row.id}
              className="space-y-3 rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FBBF24]">
                    {summary.name}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF]">
                    Raw id: <code>{row.id}</code>
                  </p>
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  Status:{" "}
                  <span className="font-medium">
                    {summary.status}
                    {summary.price != null ? ` · £${summary.price}` : ""}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 text-[11px] text-[#9CA3AF]">
                <span>
                  Last seen:{" "}
                  {new Date(row.lastSeenAt ?? row.updatedAt).toLocaleString()}
                </span>
                {row.categoryId ? (
                  <span className="ml-auto">CategoryId: {row.categoryId}</span>
                ) : null}
              </div>

              <pre className="max-h-48 overflow-auto rounded-lg bg-black/80 p-2 text-[10px] text-[#D1D5DB]">
                {JSON.stringify(row.data, null, 2)}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}

