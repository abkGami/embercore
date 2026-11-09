"use client";

import { useEffect, useRef } from "react";

const ASSETS = {
  dayPlate: "/assets/embercore-day-plate.webp",
  heroLoop: "/assets/embercore-hero-loop.mp4",
  nightPlate: "/assets/embercore-night-plate.webp",
  kettlebell: "/assets/embercore-kettlebell.glb",
};

const THREE_URL =
  "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
const GLTF_URL =
  "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js";
const ROOM_ENV_URL =
  "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/environments/RoomEnvironment.js";
const DRACO_URL =
  "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/DRACOLoader.js";
const DRACO_PATH =
  "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/";

const smoothstep = (a, b, v) => {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function makeShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function startPond(video, canvas, pointer, isVisible) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
  });
  if (!gl) return null;

  const vertexSource = `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uTex;
    uniform vec2 uMouse;
    uniform float uTime;
    uniform float uPresence;
    uniform vec2 uScale;
    uniform vec2 uTilt;

    void main() {
      float dist = distance(vUv, uMouse);
      float ripple = sin(dist * 20.0 - uTime * 5.0) * 0.006;
      float strength = smoothstep(0.2, 0.0, dist) * uPresence;
      vec2 dir = normalize(vUv - uMouse + vec2(0.00001));
      vec2 offset = dir * ripple * strength;
      vec2 base = (vUv - 0.5) * uScale + 0.5 + uTilt;

      float r = texture2D(uTex, base + offset + vec2(0.005, 0.0) * strength).r;
      float g = texture2D(uTex, base + offset).g;
      float b = texture2D(uTex, base + offset - vec2(0.005, 0.0) * strength).b;
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `;

  const vs = makeShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fs = makeShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    return null;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );
  gl.useProgram(program);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const uTex = gl.getUniformLocation(program, "uTex");
  const uMouse = gl.getUniformLocation(program, "uMouse");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uPresence = gl.getUniformLocation(program, "uPresence");
  const uScale = gl.getUniformLocation(program, "uScale");
  const uTilt = gl.getUniformLocation(program, "uTilt");
  gl.uniform1i(uTex, 0);

  const scale = { x: 1, y: 1 };
  let raf = 0;
  let presence = 0;
  let tiltX = 0;
  let tiltY = 0;
  let last = performance.now();
  const started = last;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);

    const canvasAspect = width / height;
    const videoAspect =
      video.videoWidth && video.videoHeight
        ? video.videoWidth / video.videoHeight
        : 1280 / 720;
    if (canvasAspect > videoAspect) {
      scale.x = 1;
      scale.y = videoAspect / canvasAspect;
    } else {
      scale.x = canvasAspect / videoAspect;
      scale.y = 1;
    }
    scale.x *= 0.975;
    scale.y *= 0.975;
  };

  resize();
  window.addEventListener("resize", resize);

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    if (!isVisible()) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    const k = 1 - Math.exp(-6 * dt);
    presence += ((pointer.inside ? 1 : 0) - presence) * k;

    const targetX = pointer.inside ? pointer.tx : 0;
    const targetY = pointer.inside ? pointer.ty : 0;
    const kt = 1 - Math.exp(-dt / 0.1);
    tiltX += (targetX - tiltX) * kt;
    tiltY += (targetY - tiltY) * kt;

    if (video.paused || video.readyState < 2 || !video.videoWidth) return;

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGB,
      gl.RGB,
      gl.UNSIGNED_BYTE,
      video
    );

    const time = (now - started) / 1000;
    gl.uniform2f(uMouse, pointer.u, pointer.v);
    gl.uniform1f(uTime, time);
    gl.uniform1f(uPresence, presence);
    gl.uniform2f(uScale, scale.x, scale.y);
    gl.uniform2f(
      uTilt,
      tiltX * 0.009 * scale.x,
      tiltY * 0.009 * scale.y
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    gl.deleteTexture(texture);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}

function startKettlebell(
  THREE,
  GLTFLoader,
  RoomEnvironment,
  DRACOLoader,
  canvas,
  pointer,
  reduced,
  isVisible
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;

  const hemi = new THREE.HemisphereLight(0xffc9a0, 0x1a0e08, 0.7);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffe0c2, 1.6);
  key.position.set(3, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff5a1f, 2.8);
  rim.position.set(-5, -1, -4);
  scene.add(rim);

  const rig = new THREE.Group();
  const body = new THREE.Group();
  rig.add(body);
  scene.add(rig);

  const fh = 2 * Math.tan((15 * Math.PI) / 180) * 10;
  let fw = fh * camera.aspect;

  let meshes = [];
  let shaders = [];
  let shaderTime = 0;
  let loaded = false;
  let disposed = false;
  let raf = 0;
  let last = performance.now();
  let elapsed = 0;
  let spin = 0;
  let vel = 0;
  let lastScroll = window.scrollY;
  let needsRender = true;
  let poses = [];

  const current = {
    x: 0.36,
    y: 0.18,
    s: 0.55,
    yaw: 0.35,
    pitch: 0.12,
    roll: -0.08,
  };
  let camTx = 0;
  let camTy = 0;

  const absTop = (id) => {
    const el = document.getElementById(id);
    if (!el) return 0;
    return el.getBoundingClientRect().top + window.scrollY;
  };

  const computePoses = () => {
    const h = window.innerHeight;
    const dash = document.getElementById("dash");
    const dashRect = dash?.getBoundingClientRect();
    const dashTop = (dashRect?.top || 0) + window.scrollY;
    const dashHeight = dashRect?.height || 0;
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - h
    );
    const phone = window.innerWidth <= 820;

    const data = [
      [0, 0.36, 0.18, 0.55, 0.35, 0.12, -0.08],
      [
        absTop("studio") + 0.2 * h,
        -0.66,
        -0.58,
        0.34,
        1.2,
        0.08,
        0.06,
      ],
      [
        dashTop + dashHeight / 2 - 0.5 * h,
        0.52,
        -0.5,
        0.36,
        -0.6,
        0.1,
        -0.05,
      ],
      [absTop("packs") + 0.3 * h, 0.42, -0.76, 0.38, 2.0, 0.05, 0.08],
      [absTop("sched") + 0.3 * h, -0.6, -0.5, 0.34, 3.2, 0.1, 0],
      [absTop("coaches") + 0.3 * h, 0.55, -0.62, 0.36, 4.4, 0.06, -0.06],
      [absTop("uses") + 0.3 * h, -0.42, -0.42, 0.44, 5.6, 0.12, 0.05],
      [absTop("join") + 0.3 * h, 0.46, -0.6, 0.38, 6.9, 0.08, 0.04],
      [
        Math.min(absTop("end"), maxScroll),
        -0.82,
        0.46,
        0.38,
        7.9,
        0.15,
        -0.05,
      ],
    ];

    const phonePose = {
      0: [0.18, 0.38, 0.36],
      1: [0.42, -0.72, 0.24],
      2: [-0.35, -0.74, 0.24],
      3: [0.38, -0.74, 0.24],
      4: [-0.38, -0.74, 0.24],
      5: [0.38, -0.74, 0.24],
      6: [-0.3, -0.76, 0.26],
      7: [0.36, -0.74, 0.24],
      8: [0.3, -0.74, 0.26],
    };

    poses = data.map((row, index) => {
      let [pos, x, y, s, yaw, pitch, roll] = row;
      if (phone) {
        [x, y, s] = phonePose[index];
      }
      return { pos, x, y, s, yaw, pitch, roll };
    });
  };

  computePoses();
  current.x = poses[0].x;
  current.y = poses[0].y;
  current.s = poses[0].s;
  current.yaw = poses[0].yaw;
  current.pitch = poses[0].pitch;
  current.roll = poses[0].roll;

  const findPose = (y) => {
    if (poses.length === 0) return current;
    if (y <= poses[0].pos) return poses[0];
    for (let i = 1; i < poses.length; i += 1) {
      if (y <= poses[i].pos) {
        const prev = poses[i - 1];
        const next = poses[i];
        const span = next.pos - prev.pos || 1;
        const t = easeInOutCubic(
          Math.max(0, Math.min(1, (y - prev.pos) / span))
        );
        return {
          x: prev.x + (next.x - prev.x) * t,
          y: prev.y + (next.y - prev.y) * t,
          s: prev.s + (next.s - prev.s) * t,
          yaw: prev.yaw + (next.yaw - prev.yaw) * t,
          pitch: prev.pitch + (next.pitch - prev.pitch) * t,
          roll: prev.roll + (next.roll - prev.roll) * t,
        };
      }
    }
    return poses[poses.length - 1];
  };

  const loader = new GLTFLoader();
  const draco = new DRACOLoader();
  draco.setDecoderPath(DRACO_PATH);
  loader.setDRACOLoader(draco);
  loader.load(
    ASSETS.kettlebell,
    (gltf) => {
      if (disposed) return;
      const source = gltf.scene;
      source.updateMatrixWorld(true);
      const sourceMeshes = [];
      source.traverse((object) => {
        if (object.isMesh) {
          object.updateWorldMatrix(true, false);
          object.geometry.applyMatrix4(object.matrixWorld);
          sourceMeshes.push(object);
        }
      });
      if (sourceMeshes.length === 0) return;

      const box = new THREE.Box3();
      const tempBox = new THREE.Box3();
      sourceMeshes.forEach((object) => {
        object.geometry.computeBoundingBox();
        tempBox.copy(object.geometry.boundingBox);
        box.union(tempBox);
      });
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const longest = Math.max(size.x, size.y, size.z) || 1;

      const makeMaterial = (sourceMaterial) => {
        const map = sourceMaterial?.map || null;
        if (map) map.colorSpace = THREE.SRGBColorSpace;
        const baseColor =
          !map && sourceMaterial?.color
            ? sourceMaterial.color.clone()
            : new THREE.Color(0xffffff);
        const material = new THREE.MeshPhysicalMaterial({
          color: baseColor,
          map,
          metalness: 0.85,
          roughness: 0.35,
          clearcoat: 0.4,
          clearcoatRoughness: 0.35,
          emissive: 0xff5a1f,
          emissiveIntensity: 0.12,
          envMapIntensity: 1.1,
          side: THREE.FrontSide,
        });
        material.onBeforeCompile = (compiled) => {
          compiled.uniforms.uTime = { value: 0 };
          compiled.uniforms.uAmp = { value: 0.016 };
          compiled.uniforms.uSpeed = { value: 3.2 };
          compiled.vertexShader = `
            uniform float uTime;
            uniform float uAmp;
            uniform float uSpeed;
          ` + compiled.vertexShader;
          compiled.vertexShader = compiled.vertexShader.replace(
            "#include <begin_vertex>",
            `
              vec3 transformed = vec3(position);
              float h = clamp(position.y + 0.5, 0.0, 1.0);
              float pulse = sin(uTime * uSpeed);
              transformed.y += pulse * uAmp * h * 0.5;
              transformed.xz *= 1.0 + pulse * uAmp * 0.35 * (1.0 - h);
            `
          );
          shaders.push(compiled);
          material.userData.shader = compiled;
        };
        material.customProgramCacheKey = () => "embercore-kettlebell-tempo";
        return material;
      };

      sourceMeshes.forEach((object) => {
        const geometry = object.geometry;
        geometry.translate(-center.x, -center.y, -center.z);
        geometry.scale(1 / longest, 1 / longest, 1 / longest);
        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();

        const sourceMaterial = Array.isArray(object.material)
          ? object.material[0]
          : object.material;
        const mesh = new THREE.Mesh(geometry, makeMaterial(sourceMaterial));
        meshes.push(mesh);
        body.add(mesh);
      });

      loaded = true;
      needsRender = true;
    },
    undefined,
    (error) => {
      console.warn("Embercore kettlebell failed to load:", error);
    }
  );

  const resize = () => {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    fw = fh * camera.aspect;
    computePoses();
    needsRender = true;
  };

  window.addEventListener("resize", resize);
  const onScroll = () => {
    needsRender = true;
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  const observer = new ResizeObserver(() => {
    computePoses();
    needsRender = true;
  });
  observer.observe(document.body);

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    if (disposed || !loaded || !isVisible()) {
      last = now;
      return;
    }
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;

    if (reduced && !needsRender) {
      lastScroll = window.scrollY;
      return;
    }
    needsRender = false;

    const scroll = window.scrollY;
    const instant = dt > 0 ? (scroll - lastScroll) / dt : 0;
    lastScroll = scroll;
    vel += (instant - vel) * 0.1;
    const speedUp = Math.min(Math.abs(vel) / 1800, 1.4);
    const target = findPose(scroll);
    const k = reduced ? 1 : 1 - Math.exp(-3.2 * dt);

    current.x += (target.x - current.x) * k;
    current.y += (target.y - current.y) * k;
    current.s += (target.s - current.s) * k;
    current.yaw += (target.yaw - current.yaw) * k;
    current.pitch += (target.pitch - current.pitch) * k;
    current.roll += (target.roll - current.roll) * k;

    elapsed += dt;
    if (!reduced) {
      spin += dt * (0.25 + 1.6 * speedUp);
      shaderTime += dt * (1 + speedUp);
    }

    if (shaders.length > 0) {
      shaders.forEach((compiled) => {
        compiled.uniforms.uTime.value = shaderTime;
        compiled.uniforms.uAmp.value = reduced
          ? 0.016
          : 0.016 + 0.014 * speedUp;
      });
    }

    const bob = reduced ? 0 : Math.sin(0.9 * elapsed) * 0.018;
    rig.position.set(current.x * (fw / 2), (current.y + bob) * (fh / 2), 0);
    body.scale.setScalar(current.s * fh);

    const wobbleX = reduced ? 0 : Math.sin(0.7 * elapsed) * 0.04;
    const wobbleY = reduced ? 0 : Math.sin(0.5 * elapsed) * 0.06;
    rig.rotation.set(
      current.roll + wobbleX,
      current.yaw + spin + wobbleY,
      current.pitch
    );

    const pointerX = pointer.inside ? pointer.tx : 0;
    const pointerY = pointer.inside ? pointer.ty : 0;
    const kt = reduced ? 1 : 1 - Math.exp(-dt / 0.1);
    camTx += (pointerX - camTx) * kt;
    camTy += (pointerY - camTy) * kt;
    camera.rotation.y = reduced ? 0 : -camTx * 0.01745;
    camera.rotation.x = reduced ? 0 : camTy * 0.01745;

    renderer.render(scene, camera);
  };

  raf = requestAnimationFrame(frame);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    window.removeEventListener("scroll", onScroll);
    observer.disconnect();
    meshes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    draco.dispose();
    environment.dispose();
    pmrem.dispose();
    renderer.dispose();
  };
}

export default function Scene() {
  const dayRef = useRef(null);
  const videoRef = useRef(null);
  const pondRef = useRef(null);
  const violetRef = useRef(null);
  const nightRef = useRef(null);
  const koiRef = useRef(null);

  useEffect(() => {
    const day = dayRef.current;
    const video = videoRef.current;
    const pond = pondRef.current;
    const violet = violetRef.current;
    const night = nightRef.current;
    const koi = koiRef.current;
    if (!day || !video || !pond || !violet || !night || !koi) return;

    const root = document.documentElement;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;
    const cleanups = [];

    const pointer = {
      u: 0.5,
      v: 0.5,
      tx: 0,
      ty: 0,
      inside: false,
    };
    const onPointerMove = (event) => {
      pointer.u = event.clientX / window.innerWidth;
      pointer.v = 1 - event.clientY / window.innerHeight;
      pointer.tx = pointer.u * 2 - 1;
      pointer.ty = pointer.v * 2 - 1;
      pointer.inside = true;
    };
    const onPointerLeave = () => {
      pointer.inside = false;
      pointer.tx = 0;
      pointer.ty = 0;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave);
    cleanups.push(() => {
      window.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
    });

    const updateScene = () => {
      const h = window.innerHeight;
      const y = window.scrollY;
      const end = document.getElementById("end");
      const endTop = end
        ? end.getBoundingClientRect().top + y
        : document.documentElement.scrollHeight - h;
      const toViolet = smoothstep(0.15 * h, 1.05 * h, y);
      const toNight = smoothstep(endTop - 1.1 * h, endTop - 0.1 * h, y);

      day.style.opacity = String(1 - toViolet);
      day.style.transform = `scale(${1 + 0.08 * toViolet}) translateY(${
        -0.06 * y
      }px)`;
      violet.style.opacity = String(toViolet * (1 - toNight));
      night.style.opacity = String(toNight);

      // Keep the kettlebell as the hero prop and a faint ambient ghost once
      // editorial content starts, so it never competes with body copy.
      const phone = window.innerWidth <= 820;
      const heroPresence = 1 - smoothstep(0.45 * h, 1.02 * h, y);
      const finalePresence = smoothstep(endTop - 1.2 * h, endTop - 0.35 * h, y);
      const ambient = phone ? 0.1 : 0.16;
      const finale = phone ? ambient : 0.9;
      koi.style.opacity = String(
        Math.max(ambient, heroPresence, finalePresence * finale)
      );

      if (video.getAttribute("src")) {
        if (toViolet < 0.999 && video.paused) {
          video.play().catch(() => {});
        } else if (toViolet >= 0.999 && !video.paused) {
          video.pause();
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(sceneScrollTick);
      sceneScrollTick = requestAnimationFrame(updateScene);
    };
    let sceneScrollTick = 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      cancelAnimationFrame(sceneScrollTick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });

    if (!reduced) {
      video.src = ASSETS.heroLoop;
      const playAttempt = video.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => {});
      }
    }

    const pondCleanup = reduced
      ? null
      : startPond(video, pond, pointer, () => sceneVisible);
    if (!reduced && !pondCleanup) {
      video.classList.add("plain");
    }
    if (pondCleanup) {
      cleanups.push(pondCleanup);
    }

    const onPlaying = () => {
      if (pondCleanup) pond.classList.add("on");
      else video.classList.add("plain");
    };
    const onVideoError = () => {
      pond.classList.remove("on");
      video.classList.remove("plain");
    };
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onVideoError);
    cleanups.push(() => {
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onVideoError);
    });

    updateScene();

    let kettlebellCleanup = null;
    let cancelled = false;

    // Pause WebGL rendering when scene is not in viewport for performance
    let sceneVisible = true;
    const sceneObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          sceneVisible = entry.isIntersecting;
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    sceneObserver.observe(document.documentElement);
    cleanups.push(() => sceneObserver.disconnect());

    const importUrl = new Function("u", "return import(u)");
    (async () => {
      try {
        const THREE = await importUrl(THREE_URL);
        const { GLTFLoader } = await importUrl(GLTF_URL);
        const { RoomEnvironment } = await importUrl(ROOM_ENV_URL);
        const { DRACOLoader } = await importUrl(DRACO_URL);
        if (cancelled) return;
        kettlebellCleanup = startKettlebell(
          THREE,
          GLTFLoader,
          RoomEnvironment,
          DRACOLoader,
          koi,
          pointer,
          reduced,
          () => sceneVisible
        );
        cleanups.push(kettlebellCleanup);
      } catch (error) {
        console.warn("Embercore kettlebell unavailable:", error);
      }
    })();

    const onMotionChange = (event) => {
      if (event.matches) {
        reduced = true;
        if (kettlebellCleanup) {
          kettlebellCleanup();
          kettlebellCleanup = null;
        }
      }
    };
    reducedQuery.addEventListener("change", onMotionChange);

    return () => {
      cancelled = true;
      reducedQuery.removeEventListener("change", onMotionChange);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="scene" aria-hidden="true">
      <div className="scene-layer day-plate" ref={dayRef}>
        <video
          className="pond-video"
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          poster={ASSETS.dayPlate}
        />
        <canvas className="pond-fx" ref={pondRef} />
      </div>
      <div className="scene-layer violet-layer" ref={violetRef} />
      <div className="scene-layer night-plate" ref={nightRef} />
      <canvas className="koi-canvas" ref={koiRef} />
    </div>
  );
}
