import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Groups & Bundles",
};

type ProductSummary = {
  title: string;
  slug: string;
  price: string;
};

type ProductGroupRule = {
  id: string;
  name: string | null;
  minQuantity: number;
  bundlePrice: string;
};

type ProductGroupItem = {
  id: string;
  productId: string;
  product: ProductSummary;
};

type ProductGroup = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  rules: ProductGroupRule[];
  items: ProductGroupItem[];
};

async function loadGroups(): Promise<ProductGroup[]> {
  const headers: HeadersInit = {};
  if (process.env.ADMIN_API_TOKEN) {
    headers["x-admin-token"] = process.env.ADMIN_API_TOKEN;
  }

  const base = process.env.NEXTAUTH_URL ?? "";
  const res = await fetch(`${base}/api/admin/groups`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) return [];
  return (await res.json()) as ProductGroup[];
}

export default async function AdminGroupsPage() {
  const groups = await loadGroups();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">
          Product Groups &amp; Bundles
        </h1>
        <p className="text-sm text-[#9CA3AF]">
          Use groups to define bundle rules like &quot;3 items from this group
          for £20 + postage&quot;. Products are assigned to groups via their
          IDs for now; a future UI can add richer selection.
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-[#9CA3AF]">
          No groups yet. Use the API endpoint <code>/api/admin/groups</code>{" "}
          with your admin token to create one, or we can extend this page with a
          form when you&apos;re ready.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((group) => {
          const rule = group.rules[0];
          return (
            <div
              key={group.id}
              className="space-y-3 rounded-2xl bg-black/70 p-4 text-sm text-[#E5E7EB]"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FBBF24]">
                    {group.name}
                  </p>
                  {group.description ? (
                    <p className="text-xs text-[#9CA3AF]">
                      {group.description}
                    </p>
                  ) : null}
                </div>
                {rule ? (
                  <div className="text-[11px] text-[#9CA3AF] text-right">
                    <div>
                      Deal:{" "}
                      <span className="font-semibold">
                        {rule.minQuantity} for £{rule.bundlePrice}
                      </span>
                    </div>
                    {rule.name ? <div>Rule: {rule.name}</div> : null}
                  </div>
                ) : null}
              </div>

              <div className="text-[11px] text-[#9CA3AF]">
                Created: {new Date(group.createdAt).toLocaleString()}
              </div>

              <div className="space-y-1 rounded-xl border border-[#374151] bg-black/60 p-2 text-[11px] text-[#E5E7EB]">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9CA3AF]">
                  Group products ({group.items.length})
                </div>
                {group.items.length === 0 ? (
                  <p className="text-[11px] text-[#9CA3AF]">
                    No products linked yet. Use the{" "}
                    <code>/api/admin/groups/items</code> endpoint with{" "}
                    <code>groupId</code> and <code>productId</code> to attach
                    products.
                  </p>
                ) : (
                  group.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-[11px] font-medium">
                          {item.product.title}
                        </div>
                        <div className="text-[10px] text-[#9CA3AF]">
                          {item.product.slug}
                        </div>
                      </div>
                      <div className="text-[10px] text-[#9CA3AF]">
                        £{item.product.price}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

