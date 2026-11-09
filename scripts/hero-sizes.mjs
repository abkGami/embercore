import { chromium } from "playwright";
const browser = await chromium.launch();
for (const [w, h, name] of [
  [1280, 800, "hero-1280"],
  [1920, 1080, "hero-1920"],
  [1024, 768, "hero-1024"],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);
  const info = await page.evaluate(() => {
    const rect = (sel) => {
      const el = document.querySelector(sel);
      return el ? el.getBoundingClientRect().toJSON() : null;
    };
    const navCenter = rect(".nav-center");
    const navRight = rect(".nav-right");
    return {
      headline: rect(".hero-headline"),
      subline: rect(".hero-subline"),
      actions: rect(".hero-actions"),
      scrollCard: rect(".scroll-card"),
      navCenter,
      navRight,
      navGap: navCenter && navRight ? Math.round(navRight.left - navCenter.right) : null,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      vh: innerHeight,
    };
  });
  console.log(name, JSON.stringify(info));
  await page.screenshot({ path: `shots/${name}.png` });
  await page.close();
}
await browser.close();
