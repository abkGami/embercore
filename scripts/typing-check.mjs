import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
await page.evaluate(() => {
  const el = document.getElementById("packs");
  window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 110, behavior: "instant" });
});
for (let i = 0; i < 8; i += 1) {
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const body = document.querySelector(".code-body");
    const caret = document.querySelector(".code-caret");
    return {
      len: body ? body.textContent.length : null,
      text: body ? body.textContent.slice(0, 80) : null,
      caret: Boolean(caret),
      reveal: document.querySelector(".code-block")?.className,
    };
  });
  console.log(i + 1, JSON.stringify(info));
}
await browser.close();
