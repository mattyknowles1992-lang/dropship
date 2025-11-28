import type { Region } from "@/content/regions";

export type BundleKey = "3for20" | "3for30" | "3for50";

export type BundleOption = {
  key: string;
  groupId: string;
  ruleId: string;
  name: string;
  minQuantity: number;
  bundlePrice: number;
};

type BundleDefinition = {
  id: BundleKey;
  name: string;
  minQuantity: number;
  regionPricing: Partial<Record<Region, number>>;
};

const BUNDLE_DEFINITIONS: Record<BundleKey, BundleDefinition> = {
  "3for20": {
    id: "3for20",
    name: "3 for £20",
    minQuantity: 3,
    regionPricing: {
      uk: 20,
    },
  },
  "3for30": {
    id: "3for30",
    name: "3 for £30",
    minQuantity: 3,
    regionPricing: {
      uk: 30,
    },
  },
  "3for50": {
    id: "3for50",
    name: "3 for £50",
    minQuantity: 3,
    regionPricing: {
      uk: 50,
    },
  },
};

const ALLOWED_PRICES = new Set<number>([20, 30, 50]);

export function getBundleLabel(option: BundleOption, region: Region) {
  const currency = region === "uk" ? "£" : "$";
  return `${option.minQuantity} for ${currency}${option.bundlePrice.toFixed(2)}`;
}

export function getBundleOptionForKey(bundleKey: BundleKey, region: Region): BundleOption | null {
  const definition = BUNDLE_DEFINITIONS[bundleKey];
  if (!definition) {
    return null;
  }

  const regionPrice = definition.regionPricing[region];
  if (regionPrice === undefined) {
    return null;
  }

  return {
    key: `${definition.id}:${region}`,
    groupId: definition.id,
    ruleId: `${definition.id}-min${definition.minQuantity}`,
    name: definition.name,
    minQuantity: definition.minQuantity,
    bundlePrice: regionPrice,
  };
}

export function isAllowedBundlePricing(minQuantity: number, bundlePrice: number): boolean {
  if (minQuantity !== 3) {
    return false;
  }

  const roundedPrice = Number(bundlePrice.toFixed(2));
  return ALLOWED_PRICES.has(roundedPrice);
}

export function getAllowedBundleKeys(): BundleKey[] {
  return Object.keys(BUNDLE_DEFINITIONS) as BundleKey[];
}
