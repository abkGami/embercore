import { chromium } from "playwright";
const browser = await chromium.launch({
  args: [
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
const times = await page.evaluate(async () => {
  const out = [];
  for (let i = 0; i < 5; i += 1) {
    const start = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 12));
    out.push(Math.round(performance.now() - start));
  }
  return out;
});
console.log("timer deltas", times);
const raf = await page.evaluate(async () => {
  const out = [];
  for (let i = 0; i < 5; i += 1) {
    const start = performance.now();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    out.push(Math.round(performance.now() - start));
  }
  return out;
});
console.log("raf deltas", raf);
await browser.close();
