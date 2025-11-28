import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const APP_KEY = process.env.AE_APP_KEY;
const APP_SECRET = process.env.AE_APP_SECRET;
const REFRESH_TOKEN = process.env.AE_REFRESH_TOKEN ?? process.env.refresh_token;

if (!APP_KEY || !APP_SECRET || !REFRESH_TOKEN) {
  console.error("Missing AE_APP_KEY, AE_APP_SECRET, or AE_REFRESH_TOKEN in environment");
  process.exit(1);
}

const endpoint = process.env.AE_AUTH_ENDPOINT ?? "https://oauth.aliexpress.com/token";

const payload = new URLSearchParams({
  grant_type: "refresh_token",
  client_id: APP_KEY,
  client_secret: APP_SECRET,
  refresh_token: REFRESH_TOKEN,
});

console.log("Refreshing AliExpress access token...");

let response;
try {
  response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  },
  body: payload.toString(),
  });
} catch (error) {
  console.error("Refresh request threw", error);
  process.exit(1);
}

const rawText = await response.text();

if (!response.ok) {
  console.error("Refresh request failed", response.status, rawText.slice(0, 400));
  process.exit(1);
}

let json;
try {
  json = JSON.parse(rawText);
} catch (error) {
  console.error("Refresh response was not JSON:", rawText);
  process.exit(1);
}

if (!json.access_token || !json.refresh_token) {
  console.error("Refresh response missing tokens", json);
  process.exit(1);
}

const nextEnv = `AE_ACCESS_TOKEN=${json.access_token}\nAE_REFRESH_TOKEN=${json.refresh_token}\nAE_ACCESS_TOKEN_EXPIRES_IN=${json.expires_in ?? ""}\nAE_REFRESH_TOKEN_EXPIRES_IN=${json.refresh_token_timeout ?? ""}\n`;

const outputDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "tmp");
const outputPath = path.join(outputDir, "ae-token-refresh.env");
await writeFile(outputPath, nextEnv, "utf8");

console.log("Tokens refreshed successfully.");
console.log("Written to:", outputPath);
console.log("Remember to update both .env and Render with the new values.");
