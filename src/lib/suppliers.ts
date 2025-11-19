export type SupplierKey = "aliexpress" | "cjdropshipping";

export type SupplierProductSource = {
  supplier: SupplierKey;
  externalId: string;
  url: string;
};

export type SupplierConfig = {
  name: string;
  short: string;
  info: string;
  site: string;
};

export const SUPPLIERS: Record<SupplierKey, SupplierConfig> = {
  aliexpress: {
    name: "AliExpress",
    short: "AliExpress",
    info: "Global marketplace used for Christmas dropshipping products.",
    site: "https://www.aliexpress.com/",
  },
  cjdropshipping: {
    name: "CJdropshipping",
    short: "CJ",
    info: "Fast-shipping dropshipping supplier ideal for UK & US orders.",
    site: "https://cjdropshipping.com/",
  },
};

export function listSuppliers(): SupplierConfig[] {
  return Object.values(SUPPLIERS);
}
