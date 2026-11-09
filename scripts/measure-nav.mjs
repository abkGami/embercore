import { chromium } from "playwright";

const browser = await chromium.launch();
for (const width of [1440, 1366, 1280, 1200, 1024, 900, 821, 820]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { left: Math.round(b.left), right: Math.round(b.right), width: Math.round(b.width) };
    };
    return {
      logo: box(".logo"),
      center: box(".nav-center"),
      right: box(".nav-right"),
      login: box(".login"),
      tour: box(".pill-grey"),
      free: box(".pill-dark"),
    };
  });
  const centre = r.center;
  const right = r.right;
  console.log(
    width,
    "centre",
    centre && `${centre.left}-${centre.right}`,
    "right",
    right && `${right.left}-${right.right}`,
    "gap",
    centre && right ? right.left - centre.right : "n/a",
    "scrollW",
    await page.evaluate(() => document.documentElement.scrollWidth)
  );
  await page.close();
}
await browser.close();
