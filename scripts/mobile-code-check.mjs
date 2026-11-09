import { chromium } from "playwright";
const browser = await chromium.launch({
  args: [
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
});
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
await page.evaluate(() => {
  const el = document.querySelector(".code-block");
  window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 90, behavior: "instant" });
});
await page.waitForTimeout(8000);
const info = await page.evaluate(() => {
  const body = document.querySelector(".code-body");
  const block = document.querySelector(".code-block").getBoundingClientRect();
  const cs = getComputedStyle(body);
  return {
    len: body.textContent.length,
    scrollHeight: body.scrollHeight,
    clientHeight: body.clientHeight,
    lineHeight: cs.lineHeight,
    blockRect: { top: block.top, height: block.height, bottom: block.bottom },
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: "shots/m-programmes-code.png" });
await browser.close();
