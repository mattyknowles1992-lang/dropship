import { cache } from "react";
import type { AssetConfig, AssetKeys } from "@/content/assets";
import { defaultAssets } from "@/content/assets";
import { prisma } from "@/lib/db";

export const getAssets = cache(async (): Promise<AssetConfig> => {
  const dbAssets = await prisma.asset.findMany();
  const merged: AssetConfig = { ...defaultAssets };

  for (const asset of dbAssets) {
    if (asset.key in merged) {
      const key = asset.key as AssetKeys;
      merged[key] = asset.path;
    }
  }

  return merged;
});
