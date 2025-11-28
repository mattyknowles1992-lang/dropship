"use server";

import { syncCjProducts } from "@/lib/importers/cj";

export type CjSyncActionOptions = {
  pageSize?: number;
  maxPages?: number;
  countryCodes?: string[];
  excludeCategoryIds?: string[];
  includeCategoryIds?: string[];
  startInventory?: number;
};

export type CjSyncActionSummary = {
  pagesProcessed: number;
  rawProducts: number;
  rawVariants: number;
  rawStocks: number;
  rawComments: number;
  productUpserts: number;
};

export async function runCjSync(options: CjSyncActionOptions = {}): Promise<CjSyncActionSummary> {
  try {
    const summary = await syncCjProducts(options);
    return summary;
  } catch (error) {
    console.error("CJ sync failed via admin action", error);
    throw new Error("CJ sync failed");
  }
}
