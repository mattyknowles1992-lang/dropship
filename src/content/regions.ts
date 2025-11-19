export type Region = "us" | "uk";

export type RegionConfig = {
  id: Region;
  siteName: string;
  domain: string;
  currencySymbol: string;
  locale: string;
  defaultTitle: string;
  defaultDescription: string;
};

export const REGIONS: Record<Region, RegionConfig> = {
  us: {
    id: "us",
    siteName: "Christmas Gift Shop USA",
    domain: "your-us-domain.com",
    currencySymbol: "$",
    locale: "en-US",
    defaultTitle: "Christmas Gifts 2025 | Unique Holiday Presents Online",
    defaultDescription:
      "Shop Christmas gifts 2025 online in the USA – festive gift ideas, Secret Santa presents and stocking fillers with fast US delivery.",
  },
  uk: {
    id: "uk",
    siteName: "Christmas Gift Shop UK",
    domain: "your-uk-domain.co.uk",
    currencySymbol: "£",
    locale: "en-GB",
    defaultTitle: "Christmas Gifts 2025 UK | Festive Presents & Stocking Fillers",
    defaultDescription:
      "Discover Christmas gifts 2025 in the UK – Secret Santa gifts, stocking fillers and festive present ideas with fast UK Christmas delivery.",
  },
};

export function getCurrentRegion(): RegionConfig {
  const region = (process.env.NEXT_PUBLIC_REGION as Region) || "us";
  return REGIONS[region] ?? REGIONS.us;
}
