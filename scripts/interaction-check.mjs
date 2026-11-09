import { chromium } from "playwright";

const browser = await chromium.launch({
  args: [
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (err) => errors.push(err.message));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);

// Anchor landing clears the fixed nav.
await page.click('.nav-item[href="#packs"]');
await page.waitForTimeout(1600);
const anchor = await page.evaluate(() => {
  const top = document.getElementById("packs").getBoundingClientRect().top;
  const nav = document.querySelector(".nav").getBoundingClientRect();
  return { sectionTop: Math.round(top), navBottom: Math.round(nav.bottom) };
});
console.log("ANCHOR", JSON.stringify(anchor));

// Timetable day + filter + booking.
await page.evaluate(() => {
  const el = document.getElementById("sched");
  window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 110, behavior: "instant" });
});
await page.waitForTimeout(900);
const mondayFirst = await page.locator(".sched-row:not(.head) .sched-class b").first().textContent();
await page.getByRole("button", { name: "Tue", exact: true }).click();
await page.waitForTimeout(200);
const tuesdayFirst = await page.locator(".sched-row:not(.head) .sched-class b").first().textContent();
const dayPressed = await page.getByRole("button", { name: "Tue", exact: true }).getAttribute("aria-pressed");
await page.getByRole("button", { name: "Conditioning", exact: true }).click();
await page.waitForTimeout(200);
const types = await page.locator(".sched-row:not(.head) .sched-class > span").allTextContents();
const filterPressed = await page.getByRole("button", { name: "Conditioning", exact: true }).getAttribute("aria-pressed");
await page.locator(".sched-row:not(.head) .book-btn").first().click();
await page.waitForTimeout(200);
const booked = await page.locator(".sched-row:not(.head) .chip.booked").count();
console.log(
  "TIMETABLE",
  JSON.stringify({
    mondayFirst,
    tuesdayFirst,
    changedDay: mondayFirst !== tuesdayFirst,
    dayPressed,
    types,
    filterPressed,
    booked,
  })
);

// Membership billing toggle.
await page.evaluate(() => {
  const el = document.getElementById("join");
  window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 110, behavior: "instant" });
});
await page.waitForTimeout(500);
await page.getByRole("button", { name: /Annual/ }).click();
await page.waitForTimeout(300);
const annualPrices = await page.locator(".price-value").allTextContents();
const annualPressed = await page.getByRole("button", { name: /Annual/ }).getAttribute("aria-pressed");
await page.getByRole("button", { name: "Monthly", exact: true }).click();
await page.waitForTimeout(300);
const monthlyPrices = await page.locator(".price-value").allTextContents();
console.log("MEMBERSHIP", JSON.stringify({ annualPrices, annualPressed, monthlyPrices }));

console.log("ERRORS", errors.length ? errors.join(" | ") : "(none)");
await browser.close();
