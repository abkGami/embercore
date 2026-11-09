import { chromium } from "playwright";
import fs from "node:fs";

const outDir = "shots";
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  args: [
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
});

const results = [];

function watch(page, label) {
  const messages = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      messages.push(`[${msg.type()}] ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => messages.push(`[pageerror] ${err.message}`));
  page.on("requestfailed", (req) =>
    messages.push(`[requestfailed] ${req.url()} :: ${req.failure()?.errorText}`)
  );
  page.on("response", (res) => {
    if (res.status() >= 400) messages.push(`[http ${res.status()}] ${res.url()}`);
  });
  return () => {
    results.push({ page: label, messages });
  };
}

async function scrollTo(page, id, offset = 80) {
  await page.evaluate(
    ({ id, offset }) => {
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }
      if (id === "bottom") {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "instant",
        });
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
    },
    { id, offset }
  );
}

// ---------------------------------------------------------------- desktop
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const finish = watch(page, "desktop");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(6000);

  const state = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) };
    };
    const koi = document.querySelector(".koi-canvas");
    const video = document.querySelector(".pond-video");
    return {
      u: getComputedStyle(document.documentElement).getPropertyValue("--u"),
      nav: { center: box(".nav-center"), right: box(".nav-right") },
      koi: koi ? { width: koi.width, height: koi.height } : null,
      video: video
        ? {
            readyState: video.readyState,
            paused: video.paused,
            width: video.videoWidth,
            height: video.videoHeight,
            src: video.currentSrc,
          }
        : null,
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      inner: [innerWidth, innerHeight],
    };
  });
  console.log("DESKTOP STATE", JSON.stringify(state, null, 2));

  const shots = [
    ["hero-desktop", "top", 0],
    ["studio", "studio", 110],
    ["dashboard", "dash", 110],
    ["programmes", "packs", 110],
    ["timetable", "sched", 110],
    ["coaches", "coaches", 110],
    ["uses", "uses", 110],
    ["membership", "join", 110],
    ["footer", "end", 110],
    ["footer-bottom", "bottom", 0],
  ];
  for (const [name, id, offset] of shots) {
    await scrollTo(page, id, offset);
    await page.waitForTimeout(
      name === "hero-desktop" ? 600 : name === "programmes" ? 6000 : 2200
    );
    await page.screenshot({ path: `${outDir}/${name}.png` });
  }
  finish();
  await page.close();
}

// ----------------------------------------------------------------- mobile
{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const finish = watch(page, "mobile");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5000);

  const state = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }));
  console.log("MOBILE STATE", JSON.stringify(state, null, 2));

  const shots = [
    ["m-hero", "top", 0],
    ["m-studio", "studio", 72],
    ["m-dashboard", "dash", 72],
    ["m-programmes", "packs", 72],
    ["m-timetable", "sched", 72],
    ["m-timetable-rows", "sched", -380],
    ["m-coaches", "coaches", 72],
    ["m-coaches-cards", "coaches", -430],
    ["m-uses", "uses", 72],
    ["m-uses-lower", "uses", -620],
    ["m-membership", "join", 72],
    ["m-membership-cards", "join", -620],
    ["m-footer", "end", 72],
    ["m-footer-bottom", "bottom", 0],
  ];
  for (const [name, id, offset] of shots) {
    await scrollTo(page, id, offset);
    await page.waitForTimeout(name === "m-hero" ? 500 : 1800);
    await page.screenshot({ path: `${outDir}/${name}.png` });
  }
  finish();
  await page.close();
}

// --------------------------------------------------------- reduced motion
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const finish = watch(page, "reduced-motion");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5000);

  const state = await page.evaluate(() => {
    const video = document.querySelector(".pond-video");
    const koi = document.querySelector(".koi-canvas");
    const reveals = Array.from(document.querySelectorAll(".reveal"));
    const hiddenReveals = reveals.filter(
      (el) =>
        !el.classList.contains("in") || getComputedStyle(el).opacity !== "1"
    );
    return {
      videoSrc: video?.getAttribute("src"),
      videoReadyState: video?.readyState,
      pondClasses: document.querySelector(".pond-fx")?.className,
      koi: koi ? { width: koi.width, height: koi.height } : null,
      revealCount: reveals.length,
      hiddenReveals: hiddenReveals.length,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
  });
  console.log("REDUCED STATE", JSON.stringify(state, null, 2));

  await page.screenshot({ path: `${outDir}/reduced-hero.png` });
  await scrollTo(page, "packs", 80);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${outDir}/reduced-programmes.png` });
  await scrollTo(page, "join", 80);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${outDir}/reduced-membership.png` });
  finish();
  await page.close();
}

await browser.close();

for (const result of results) {
  console.log(`\n--- ${result.page} console ---`);
  console.log(result.messages.length ? result.messages.join("\n") : "(clean)");
}
