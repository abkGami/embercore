import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
const info = await page.evaluate(() => {
  const el = document.querySelector(".nav-scrim");
  if (!el) return { present: false };
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    present: true,
    rect: r.toJSON(),
    background: cs.backgroundImage,
    zIndex: cs.zIndex,
    position: cs.position,
    display: cs.display,
    opacity: cs.opacity,
    parent: el.parentElement.className,
    u: getComputedStyle(document.documentElement).getPropertyValue("--u"),
  };
});
console.log(JSON.stringify(info, null, 2));
await page.evaluate(() => {
  const el = document.querySelector(".nav-scrim");
  if (el) el.style.background = "rgba(255,0,0,.5)";
});
await page.screenshot({ path: "shots/scrim-test.png" });
await browser.close();
