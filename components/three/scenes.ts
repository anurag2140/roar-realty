import type * as THREE_NS from "three";

/**
 * The three WebGL scenes from the prototype's `roar-3d.js`, ported to work
 * against an npm-installed Three.js rather than a CDN global, and returning a
 * disposer so React can tear them down cleanly.
 *
 * Every scene: pauses when scrolled out of view, caps pixel ratio at 1.5, and
 * releases its WebGL context on unmount (browsers allow only ~16 live contexts,
 * and the prototype leaked one per navigation).
 */

export type SceneHandle = { dispose: () => void };

type Ctx = {
  THREE: typeof THREE_NS;
  container: HTMLElement;
};

function makeRenderer({ THREE, container }: Ctx) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.domElement.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;display:block;";
  container.appendChild(renderer.domElement);
  return renderer;
}

function runLoop(
  container: HTMLElement,
  renderer: THREE_NS.WebGLRenderer,
  onFrame: (t: number) => void
): () => void {
  let raf = 0;
  let visible = true;

  const io = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true;
  });
  io.observe(container);

  const onVisibility = () => {
    if (document.hidden) visible = false;
  };
  document.addEventListener("visibilitychange", onVisibility);

  const tick = (ms: number) => {
    raf = requestAnimationFrame(tick);
    if (!visible || document.hidden) return;
    onFrame(ms * 0.001);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    renderer.dispose();
    renderer.forceContextLoss?.();
    renderer.domElement.remove();
  };
}

function attachResize(
  container: HTMLElement,
  renderer: THREE_NS.WebGLRenderer,
  camera: THREE_NS.PerspectiveCamera | null,
  onResize?: (w: number, h: number) => void
): () => void {
  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    if (camera) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    onResize?.(w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  window.addEventListener("resize", resize);
  resize();
  return () => {
    ro.disconnect();
    window.removeEventListener("resize", resize);
  };
}

/* ---------------- Hero: golden wireframe skyline ---------------- */

export function createHeroScene(ctx: Ctx): SceneHandle {
  const { THREE, container } = ctx;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0907, 0.028);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  camera.position.set(0, 7.5, 26);

  const renderer = makeRenderer(ctx);

  const gold = new THREE.Color(0xc6a15b);
  const goldHi = new THREE.Color(0xe8cd8f);

  const city = new THREE.Group();
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const edges = new THREE.EdgesGeometry(boxGeo);
  boxGeo.dispose();

  // Deterministic PRNG so the skyline is identical on every load and between
  // server and client — a random one caused a visible reshuffle on hydration.
  let seed = 7;
  const srand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const rand = (a: number, b: number) => a + srand() * (b - a);

  const disposables: { dispose: () => void }[] = [edges];

  for (let gx = -9; gx <= 9; gx++) {
    for (let gz = -7; gz <= 3; gz++) {
      if (Math.abs(gx) < 2 && gz > -2) continue; // central avenue
      if (srand() < 0.28) continue;

      const h = 1.5 + Math.pow(srand(), 2.2) * 16;
      const w = 0.9 + srand() * 1.4;
      const mat = new THREE.LineBasicMaterial({
        color: gold.clone().lerp(goldHi, srand() * 0.7),
        transparent: true,
        opacity: 0.32 + srand() * 0.38,
      });
      disposables.push(mat);

      const m = new THREE.LineSegments(edges, mat);
      m.scale.set(w, h, w);
      m.position.set(gx * 2.4 + rand(-0.4, 0.4), h / 2, gz * 2.6 + rand(-0.4, 0.4));
      city.add(m);

      // Lit windows on the taller towers.
      if (h > 9 && srand() > 0.4) {
        const n = 14;
        const pg = new THREE.BufferGeometry();
        const pos = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
          pos[i * 3] = m.position.x + rand(-w / 2, w / 2);
          pos[i * 3 + 1] = rand(0.5, h);
          pos[i * 3 + 2] = m.position.z + w / 2 + 0.02;
        }
        pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const pm = new THREE.PointsMaterial({
          color: 0xe8cd8f,
          size: 0.09,
          transparent: true,
          opacity: 0.85,
        });
        disposables.push(pg, pm);
        city.add(new THREE.Points(pg, pm));
      }
    }
  }
  scene.add(city);

  const grid = new THREE.GridHelper(90, 60, 0x8a6c33, 0x2a2115);
  (grid.material as THREE_NS.Material).transparent = true;
  (grid.material as THREE_NS.Material).opacity = 0.5;
  scene.add(grid);
  disposables.push(grid.geometry, grid.material as THREE_NS.Material);

  // Gold dust
  const dustN = 700;
  const dg = new THREE.BufferGeometry();
  const dp = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) {
    dp[i * 3] = rand(-30, 30);
    dp[i * 3 + 1] = rand(0, 20);
    dp[i * 3 + 2] = rand(-25, 20);
  }
  dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  const dm = new THREE.PointsMaterial({
    color: 0xd9b96e,
    size: 0.1,
    transparent: true,
    opacity: 0.8,
  });
  const dust = new THREE.Points(dg, dm);
  scene.add(dust);
  disposables.push(dg, dm);

  let mx = 0;
  let my = 0;
  const onPointer = (e: PointerEvent) => {
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const detachResize = attachResize(container, renderer, camera);

  const stopLoop = runLoop(container, renderer, (t) => {
    const sc = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.4);
    // Ease toward the pointer rather than snapping to it.
    camera.position.x += (mx * 4 - camera.position.x) * 0.04;
    camera.position.y = 7.5 - my * 1.5 + sc * 5;
    camera.position.z = 26 - sc * 6;
    camera.lookAt(0, 4 + sc * 2, -4);
    city.rotation.y = Math.sin(t * 0.05) * 0.04;
    dust.rotation.y = t * 0.015;
    dust.position.y = Math.sin(t * 0.3) * 0.4;
    renderer.render(scene, camera);
  });

  return {
    dispose: () => {
      window.removeEventListener("pointermove", onPointer);
      detachResize();
      stopLoop();
      disposables.forEach((d) => d.dispose());
    },
  };
}

/* ---------------- Liquid gold shader plane ---------------- */

export function createGoldShader(ctx: Ctx, intensity = 1): SceneHandle {
  const { THREE, container } = ctx;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = makeRenderer(ctx);

  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uIntensity: { value: intensity },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    vertexShader: "void main(){gl_Position=vec4(position,1.0);}",
    fragmentShader: `
      precision highp float;
      uniform float uTime; uniform vec2 uRes; uniform float uIntensity;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/uRes.xy;
        vec2 p=uv*vec2(uRes.x/uRes.y,1.0)*2.2;
        float t=uTime*0.08;
        float f=fbm(p+vec2(t,-t*.6)+fbm(p*1.4-vec2(t*.7,0.)));
        float dunes=smoothstep(.35,.85,f);
        vec3 dark=vec3(0.043,0.035,0.027);
        vec3 gold=vec3(0.776,0.631,0.357);
        vec3 hi=vec3(0.945,0.847,0.62);
        vec3 col=mix(dark,gold,dunes*.55);
        col=mix(col,hi,smoothstep(.72,.95,f)*.5);
        float vig=smoothstep(1.25,.35,distance(uv,vec2(.5)));
        col*=vig;
        float alpha=(dunes*.95+.18)*vig*uIntensity;
        gl_FragColor=vec4(col,alpha);
      }`,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  scene.add(new THREE.Mesh(geometry, material));

  const detachResize = attachResize(container, renderer, null, (w, h) =>
    uniforms.uRes.value.set(w, h)
  );

  const stopLoop = runLoop(container, renderer, (t) => {
    uniforms.uTime.value = t;
    renderer.render(scene, camera);
  });

  return {
    dispose: () => {
      detachResize();
      stopLoop();
      geometry.dispose();
      material.dispose();
    },
  };
}

/* ---------------- Dubai → Delhi globe arc ---------------- */

export function createJourneyScene(ctx: Ctx): SceneHandle {
  const { THREE, container } = ctx;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0.5, 8.4);
  camera.lookAt(0, 0.3, 0);

  const renderer = makeRenderer(ctx);
  const disposables: { dispose: () => void }[] = [];

  const globe = new THREE.Group();

  const sphereGeo = new THREE.SphereGeometry(2.2, 28, 20);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x8a6c33,
    wireframe: true,
    transparent: true,
    opacity: 0.26,
  });
  globe.add(new THREE.Mesh(sphereGeo, sphereMat));
  disposables.push(sphereGeo, sphereMat);

  const toVec = (lat: number, lon: number, r: number) => {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lon + 180) * Math.PI) / 180;
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  };

  const dubai = toVec(25.2, 55.3, 2.2);
  const delhi = toVec(28.6, 77.2, 2.2);
  const mid = dubai.clone().add(delhi).multiplyScalar(0.5).normalize().multiplyScalar(3.1);
  const curve = new THREE.QuadraticBezierCurve3(dubai, mid, delhi);

  const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60));
  const arcMat = new THREE.LineBasicMaterial({
    color: 0xe8cd8f,
    transparent: true,
    opacity: 0.9,
  });
  globe.add(new THREE.Line(arcGeo, arcMat));
  disposables.push(arcGeo, arcMat);

  const cityGeo = new THREE.SphereGeometry(0.055, 12, 12);
  const cityMat = new THREE.MeshBasicMaterial({ color: 0xf0d9a0 });
  disposables.push(cityGeo, cityMat);
  for (const v of [dubai, delhi]) {
    const m = new THREE.Mesh(cityGeo, cityMat);
    m.position.copy(v);
    globe.add(m);
  }

  const pulseGeo = new THREE.SphereGeometry(0.08, 10, 10);
  const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffe9b8 });
  const pulse = new THREE.Mesh(pulseGeo, pulseMat);
  globe.add(pulse);
  disposables.push(pulseGeo, pulseMat);

  scene.add(globe);
  globe.rotation.y = -3.55;
  globe.rotation.x = 0.25;

  const detachResize = attachResize(container, renderer, camera);

  const stopLoop = runLoop(container, renderer, (t) => {
    const k = (Math.sin(t * 0.7 - Math.PI / 2) + 1) / 2;
    pulse.position.copy(curve.getPoint(k));
    globe.rotation.y = -3.55 + Math.sin(t * 0.12) * 0.12;
    renderer.render(scene, camera);
  });

  return {
    dispose: () => {
      detachResize();
      stopLoop();
      disposables.forEach((d) => d.dispose());
    },
  };
}
