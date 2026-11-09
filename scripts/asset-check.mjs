const base = "http://localhost:3000";
const paths = [
  "/assets/embercore-day-plate.webp",
  "/assets/embercore-night-plate.webp",
  "/assets/embercore-hero-loop.mp4",
  "/assets/embercore-kettlebell.glb",
  "/assets/embercore-kettlebell-ref.png",
  "/assets/embercore-coach-01.webp",
  "/assets/embercore-coach-02.webp",
  "/assets/embercore-coach-03.webp",
  "/assets/embercore-coach-04.webp",
  "/assets/embercore-og.jpg",
  "/icon.svg",
];
for (const path of paths) {
  const res = await fetch(base + path);
  console.log(res.status, res.headers.get("content-type"), path);
  await res.arrayBuffer();
}

const cdn = [
  "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
  "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js",
  "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/environments/RoomEnvironment.js",
  "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/DRACOLoader.js",
  "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/draco_decoder.js",
  "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/draco_decoder.wasm",
];
for (const url of cdn) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    console.log(res.status, url);
  } catch (error) {
    console.log("ERR", url, error.message);
  }
}
