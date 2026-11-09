import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.screenshot({ path: "shots/scrim-on.png" });
await page.evaluate(() => {
  const el = document.querySelector(".nav-scrim");
  if (el) el.style.display = "none";
});
await page.waitForTimeout(200);
await page.screenshot({ path: "shots/scrim-off.png" });
await browser.close();
