"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import { getBundleLabel, type BundleOption } from "@/lib/bundles";
import type { Region } from "@/content/regions";
import { getCurrentRegion } from "@/content/regions";

type CartProductInput = {
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
};

type CartItem = CartProductInput & {
  lineId: string;
  quantity: number;
  bundleKey?: string;
};

type CartBundleInfo = BundleOption & {
  key: string;
  region: Region;
};

type CartState = {
  items: CartItem[];
  bundles: Record<string, CartBundleInfo>;
};

type CartBundleSummary = {
  key: string;
  label: string;
  totalQuantity: number;
  bundleCount: number;
  remainderQuantity: number;
  totalPrice: number;
};

type CartTotals = {
  itemCount: number;
  subtotal: number;
  bundleSummaries: CartBundleSummary[];
};

type CartContextValue = {
  items: CartItem[];
  bundles: Record<string, CartBundleInfo>;
  totals: CartTotals;
  addItem: (product: CartProductInput, quantity?: number) => void;
  addBundleItem: (product: CartProductInput, bundle: BundleOption) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
};

type CartAction =
  | { type: "add-item"; payload: { product: CartProductInput; quantity: number } }
  | { type: "add-bundle"; payload: { product: CartProductInput; bundle: CartBundleInfo } }
  | { type: "update-quantity"; payload: { lineId: string; quantity: number } }
  | { type: "remove-line"; payload: { lineId: string } }
  | { type: "clear" };

const STORAGE_KEY = "dropship-cart-state";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add-item": {
      const { product, quantity } = action.payload;
      const existing = state.items.find(
        (line) => line.productId === product.productId && !line.bundleKey,
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((line) =>
            line.lineId === existing.lineId
              ? { ...line, quantity: line.quantity + quantity }
              : line,
          ),
        };
      }

      const lineId = crypto.randomUUID();
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...product,
            lineId,
            quantity,
          },
        ],
      };
    }
    case "add-bundle": {
      const { product, bundle } = action.payload;
      const bundleKey = bundle.key;
      const existing = state.items.find(
        (line) => line.productId === product.productId && line.bundleKey === bundleKey,
      );

      const items = existing
        ? state.items.map((line) =>
            line.lineId === existing.lineId
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          )
        : [
            ...state.items,
            {
              ...product,
              lineId: crypto.randomUUID(),
              quantity: 1,
              bundleKey,
            },
          ];

      return {
        items,
        bundles: {
          ...state.bundles,
          [bundleKey]: bundle,
        },
      };
    }
    case "update-quantity": {
      const { lineId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: "remove-line", payload: { lineId } });
      }

      return {
        ...state,
        items: state.items.map((line) =>
          line.lineId === lineId ? { ...line, quantity } : line,
        ),
      };
    }
    case "remove-line": {
      const nextItems = state.items.filter((line) => line.lineId !== action.payload.lineId);
      const activeBundles = new Set(nextItems.map((line) => line.bundleKey).filter(Boolean) as string[]);
      const nextBundles = Object.fromEntries(
        Object.entries(state.bundles).filter(([key]) => activeBundles.has(key)),
      );
      return {
        items: nextItems,
        bundles: nextBundles,
      };
    }
    case "clear":
      return { items: [], bundles: {} };
    default:
      return state;
  }
}

function loadInitialState(region: Region): CartState {
  if (typeof window === "undefined") {
    return { items: [], bundles: {} };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { items: [], bundles: {} };
    }

    const parsed = JSON.parse(raw) as CartState;

    // Ensure stored bundles carry current region context
    const bundlesWithRegion: CartState["bundles"] = Object.fromEntries(
      Object.entries(parsed.bundles ?? {}).map(([key, bundle]) => [
        key,
        { ...bundle, region },
      ]),
    );

    return {
      items: parsed.items ?? [],
      bundles: bundlesWithRegion,
    };
  } catch (error) {
    console.warn("Failed to parse stored cart state", error);
    return { items: [], bundles: {} };
  }
}

function expandBundleTotals(state: CartState): CartTotals {
  let subtotal = 0;
  let itemCount = 0;
  const bundleBuckets = new Map<string, { info: CartBundleInfo; items: CartItem[] }>();

  for (const item of state.items) {
    itemCount += item.quantity;
    if (item.bundleKey) {
      const info = state.bundles[item.bundleKey];
      if (!info) {
        subtotal += item.price * item.quantity;
        continue;
      }

      const existing = bundleBuckets.get(item.bundleKey);
      if (existing) {
        existing.items.push(item);
      } else {
        bundleBuckets.set(item.bundleKey, { info, items: [item] });
      }
      continue;
    }

    subtotal += item.price * item.quantity;
  }

  const bundleSummaries: CartBundleSummary[] = [];

  for (const [key, bucket] of bundleBuckets.entries()) {
    const { info, items } = bucket;
    const expandedPrices = items
      .flatMap((item) => Array(item.quantity).fill(item.price))
      .sort((a, b) => b - a);

    const totalQuantity = expandedPrices.length;
    const bundleCount = Math.floor(totalQuantity / info.minQuantity);
    const bundleUnits = bundleCount * info.minQuantity;

    let totalPrice = bundleCount * info.bundlePrice;
    const remainderQuantity = totalQuantity - bundleUnits;
    let remainderCost = 0;

    if (remainderQuantity > 0) {
      const remainderPrices = expandedPrices.slice(bundleUnits, bundleUnits + remainderQuantity);
      remainderCost = remainderPrices.reduce((acc, value) => acc + value, 0);
    }

    totalPrice += remainderCost;
    subtotal += totalPrice;

    bundleSummaries.push({
      key,
      label: getBundleLabel(info, info.region),
      totalQuantity,
      bundleCount,
      remainderQuantity,
      totalPrice,
    });
  }

  return {
    itemCount,
    subtotal,
    bundleSummaries,
  };
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const region = getCurrentRegion().id;
  const [state, dispatch] = useReducer(cartReducer, loadInitialState(region));

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totals = useMemo(() => expandBundleTotals(state), [state]);

  const addItem = useCallback((product: CartProductInput, quantity = 1) => {
    dispatch({ type: "add-item", payload: { product, quantity } });
  }, []);

  const addBundleItem = useCallback(
    (product: CartProductInput, bundle: BundleOption) => {
      const regionConfig = getCurrentRegion();
      dispatch({
        type: "add-bundle",
        payload: {
          product,
          bundle: {
            ...bundle,
            region: regionConfig.id,
          },
        },
      });
    },
    [],
  );

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    dispatch({ type: "update-quantity", payload: { lineId, quantity } });
  }, []);

  const removeLine = useCallback((lineId: string) => {
    dispatch({ type: "remove-line", payload: { lineId } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      bundles: state.bundles,
      totals,
      addItem,
      addBundleItem,
      updateQuantity,
      removeLine,
      clearCart,
    }),
    [state.items, state.bundles, totals, addItem, addBundleItem, updateQuantity, removeLine, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
