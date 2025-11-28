import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const APP_KEY = process.env.AE_APP_KEY;
const APP_SECRET = process.env.AE_APP_SECRET;
const ACCESS_TOKEN = process.env.access_token ?? process.env.AE_ACCESS_TOKEN;

if (!APP_KEY || !APP_SECRET || !ACCESS_TOKEN) {
  console.error("Missing AliExpress credentials. Ensure AE_APP_KEY, AE_APP_SECRET and access_token are set.");
  process.exit(1);
}

const METHOD = process.env.AE_API_METHOD ?? process.argv[2] ?? "aliexpress.ds.feed.get";
const PAGE = Number.parseInt(process.env.AE_API_PAGE ?? process.argv[3] ?? "1", 10);
const PAGE_SIZE = Number.parseInt(process.env.AE_API_PAGE_SIZE ?? process.argv[4] ?? "20", 10);

const ENDPOINT = process.env.AE_API_ENDPOINT ?? "https://api-sg.aliexpress.com/rest";

function topTimestamp() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  const beijing = new Date(utc + 8 * 60 * 60_000);
  const pad = (value) => value.toString().padStart(2, "0");
  return `${beijing.getFullYear()}-${pad(beijing.getMonth() + 1)}-${pad(beijing.getDate())} ${pad(beijing.getHours())}:${pad(beijing.getMinutes())}:${pad(beijing.getSeconds())}`;
}

const SIGN_METHOD = (process.env.AE_SIGN_METHOD ?? "md5").toLowerCase();

const commonParams = {
  method: METHOD,
  app_key: APP_KEY,
  session: ACCESS_TOKEN,
  timestamp: topTimestamp(),
  format: "json",
  v: "2.0",
  sign_method: SIGN_METHOD === "sha256" ? "sha256" : "md5",
};

const bizParams = {
  current_page: Number.isNaN(PAGE) || PAGE < 1 ? 1 : PAGE,
  page_size: Number.isNaN(PAGE_SIZE) || PAGE_SIZE < 1 ? 20 : PAGE_SIZE,
  language: "en",
  ship_to_country: "GB",
  target_currency: "GBP",
};

const allParams = { ...commonParams, ...bizParams };

function buildSign(params) {
  const sortedKeys = Object.keys(params).sort();
  const baseString = sortedKeys.reduce((acc, key) => {
    const value = params[key];
    if (value === undefined || value === null || value === "") return acc;
    return acc + key + value;
  }, "");
  if (SIGN_METHOD === "sha256") {
    return crypto.createHmac("sha256", APP_SECRET).update(baseString).digest("hex").toUpperCase();
  }
  return crypto.createHash("md5").update(`${APP_SECRET}${baseString}${APP_SECRET}`).digest("hex").toUpperCase();
}

const sign = buildSign(allParams);
const payload = new URLSearchParams({ ...allParams, sign });

console.log(`Calling AliExpress API method ${METHOD} (page ${bizParams.current_page}, size ${bizParams.page_size})`);
console.log(`Timestamp used: ${allParams.timestamp}`);

const httpMethod = (process.env.AE_HTTP_METHOD ?? "GET").toUpperCase();
const requestUrl = httpMethod === "POST" ? ENDPOINT : `${ENDPOINT}?${payload.toString()}`;

const response = await fetch(requestUrl, {
  method: httpMethod,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  },
  body: httpMethod === "POST" ? payload.toString() : undefined,
});

const rawText = await response.text();

if (!response.ok) {
  console.error(`AliExpress API returned HTTP ${response.status}`);
  console.error(rawText.slice(0, 400));
  process.exit(1);
}

let parsed;
try {
  parsed = JSON.parse(rawText);
} catch (error) {
  console.warn("Response was not valid JSON; saving raw text");
}

const outputDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "tmp");
await mkdir(outputDir, { recursive: true });
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputPath = path.join(
  outputDir,
  `ae-${METHOD.replace(/\./g, "-")}-${timestamp}.json`,
);
await writeFile(outputPath, parsed ? JSON.stringify(parsed, null, 2) : rawText, "utf8");

console.log(`Response saved to ${outputPath}`);

if (parsed) {
  const root = parsed.response ?? parsed[`${METHOD.replace(/\./g, "_")}_response`] ?? parsed;
  const list =
    Array.isArray(root)
      ? root
      : Array.isArray(root?.result)
        ? root.result
        : Array.isArray(root?.items)
          ? root.items
          : Array.isArray(root?.data)
            ? root.data
            : [];
  console.log(`Detected ${Array.isArray(list) ? list.length : 0} items in response.`);
  const example = Array.isArray(list) && list.length > 0 ? list[0] : root;
  if (example && typeof example === "object") {
    console.log("Sample keys:", Object.keys(example));
  }
} else {
  console.log("Saved raw response (non-JSON). Inspect manually.");
}
