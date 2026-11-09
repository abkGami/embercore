import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const t0 = Date.now();
page.on("requestfailed", (req) => {
  console.log(`FAILED +${Date.now() - t0}ms ${req.url()} ${req.failure()?.errorText}`);
});
page.on("response", (res) => {
  if (res.url().includes(".mp4")) {
    console.log(`RESP +${Date.now() - t0}ms ${res.status()} ${res.url()}`);
  }
});
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(4000);
console.log("scrollY", await page.evaluate(() => scrollY));
console.log(
  "video",
  await page.evaluate(() => {
    const v = document.querySelector(".pond-video");
    return { paused: v.paused, readyState: v.readyState, networkState: v.networkState };
  })
);
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await page.waitForTimeout(2000);
console.log("after scroll", await page.evaluate(() => scrollY));
console.log(
  "video",
  await page.evaluate(() => {
    const v = document.querySelector(".pond-video");
    return { paused: v.paused, readyState: v.readyState, networkState: v.networkState };
  })
);
await browser.close();
