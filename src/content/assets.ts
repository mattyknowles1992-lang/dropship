export type AssetKeys =
  | "logo"
  | "heroPrimary"
  | "heroSecondary";

export type AssetConfig = Record<AssetKeys, string>;

export const defaultAssets: AssetConfig = {
  // Place files in public/uploads and reference them here
  logo: "/uploads/logo-holly-jolly.png",
  heroPrimary: "/uploads/hero-primary-1.jpg",
  heroSecondary: "/uploads/hero-primary-1.jpg",
};
