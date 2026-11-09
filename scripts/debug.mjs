import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const logs = [];
page.on("console", (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
page.on("pageerror", (err) => logs.push(`[pageerror] ${err.message}`));
page.on("requestfailed", (req) =>
  logs.push(`[failed] ${req.url()} :: ${req.failure()?.errorText}`)
);
page.on("response", (res) => {
  if (res.url().includes(".glb") || res.url().includes("three")) {
    logs.push(`[${res.status()}] ${res.url()}`);
  }
});
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(6000);
const info = await page.evaluate(() => {
  const s = window.__embercoreScene;
  if (!s) return { scene: "missing" };
  const mesh = s.mesh;
  return {
    loaded: s.loaded,
    cam: s.camera.position.toArray(),
    camRot: [s.camera.rotation.x, s.camera.rotation.y, s.camera.rotation.z],
    rigPos: s.rig.position.toArray(),
    rigRot: [s.rig.rotation.x, s.rig.rotation.y, s.rig.rotation.z],
    rigScale: s.rig.scale.toArray(),
    bodyScale: s.body.scale.toArray(),
    mesh: mesh
      ? {
          visible: mesh.visible,
          opacity: mesh.material.opacity,
          transparent: mesh.material.transparent,
          side: mesh.material.side,
          count: mesh.geometry.attributes.position.count,
          bbox: mesh.geometry.boundingBox,
          sphere: mesh.geometry.boundingSphere,
          world: mesh.matrixWorld.elements,
        }
      : null,
    draw: {
      calls: s.renderer.info.render.calls,
      triangles: s.renderer.info.render.triangles,
    },
    size: [s.renderer.domElement.width, s.renderer.domElement.height],
  };
});
console.log(JSON.stringify(info, null, 2));
console.log(logs.join("\n"));
await browser.close();
