"use client";

import { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Geometry, Program, Mesh } from "ogl";

// Classic Ashima 3D simplex noise, compacted. Used to displace the sphere's
// point cloud outward per-vertex so it reads as an organic "techno ball"
// rather than a rigid sphere.
const NOISE_GLSL = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const VERTEX = `
  attribute vec3 position;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uScroll;
  varying float vNoise;
  ${NOISE_GLSL}
  void main() {
    float n = snoise(position * (1.4 + uScroll * 1.6) + uTime * 0.08);
    vNoise = n;
    float displacement = 1.0 + n * (0.12 + uScroll * 0.32);
    vec3 displaced = position * displacement;
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (5.0 + uScroll * 3.0) * (10.0 / -mvPosition.z);
  }
`;

const FRAGMENT = `
  precision mediump float;
  uniform vec3 uColor;
  varying float vNoise;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * (0.55 + vNoise * 0.3);
    gl_FragColor = vec4(uColor, alpha);
  }
`;

const FIELD_VERTEX = `
  precision mediump float;
  attribute vec3 position;
  attribute float seed;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uScroll;
  varying float vSeed;
  void main() {
    vSeed = seed;
    // Each mote drifts at its own pace (seeded) and parallaxes against
    // scroll, which is what reads as "depth" rather than a flat sprinkle.
    vec3 p = position;
    p.y += sin(uTime * 0.15 + seed * 6.2831) * 0.15;
    p.y += uScroll * (seed - 0.5) * 3.0;
    p.x += cos(uTime * 0.1 + seed * 6.2831) * 0.08;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (4.0 + seed * 4.0) * (10.0 / -mvPosition.z);
  }
`;

const FIELD_FRAGMENT = `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uTime;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float twinkle = 0.5 + 0.5 * sin(uTime * (0.6 + vSeed) + vSeed * 20.0);
    float alpha = smoothstep(0.5, 0.0, d) * twinkle * 0.85;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

// Scatters points into two bands on either side of center (leaving the
// sphere's silhouette clear) so the edges of the viewport don't read empty.
// Placement is derived from the camera's actual frustum at each point's depth
// (rather than arbitrary world units) so points always land on-screen instead
// of drifting outside what the camera can see.
function sideField(
  count: number,
  cameraZ: number,
  fovDeg: number,
  aspect: number
): { position: Float32Array; seed: Float32Array } {
  const position = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const halfFov = (fovDeg * Math.PI) / 180 / 2;
  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const z = (Math.random() - 0.5) * 4 - 1;
    const distance = cameraZ - z;
    const halfWidth = distance * Math.tan(halfFov) * aspect;
    const halfHeight = distance * Math.tan(halfFov);
    const x = side * halfWidth * (0.5 + Math.random() * 0.45);
    const y = (Math.random() - 0.5) * halfHeight * 1.8;
    position[i * 3] = x;
    position[i * 3 + 1] = y;
    position[i * 3 + 2] = z;
    seed[i] = Math.random();
  }
  return { position, seed };
}

// getComputedStyle can serialize a resolved color back out as oklch()/lab()
// rather than rgb() depending on how it was authored, so we can't regex the
// numbers out directly. Painting it to a 1x1 canvas forces the browser to
// resolve it to concrete sRGB bytes regardless of the source color space.
function readPrimaryColor(): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [0.85, 0.25, 0.25];
  ctx.fillStyle = raw || "oklch(0.6 0.21 20)";
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

// Evenly distributes points on a unit sphere so the cloud reads as a solid
// ball rather than clumping at the poles (standard fibonacci sphere).
function fibonacciSphere(count: number): Float32Array {
  const points = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points[i * 3] = Math.cos(theta) * radius;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = Math.sin(theta) * radius;
  }
  return points;
}

export function OrbBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) });
    const gl = renderer.gl;
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 45 });
    camera.position.set(0, 0, 3.2);

    const scene = new Transform();

    const position = fibonacciSphere(5000);
    const geometry = new Geometry(gl, {
      position: { size: 3, data: position },
    });

    const [r, g, b] = readPrimaryColor();
    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uColor: { value: [r, g, b] },
      },
      transparent: true,
      depthTest: false,
    });

    const points = new Mesh(gl, { mode: gl.POINTS, geometry, program });
    points.setParent(scene);

    const aspect = container.clientWidth / container.clientHeight;
    const { position: fieldPosition, seed: fieldSeed } = sideField(900, 3.2, 45, aspect);
    const fieldGeometry = new Geometry(gl, {
      position: { size: 3, data: fieldPosition },
      seed: { size: 1, data: fieldSeed },
    });
    const fieldProgram = new Program(gl, {
      vertex: FIELD_VERTEX,
      fragment: FIELD_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uColor: { value: [r, g, b] },
      },
      transparent: true,
      depthTest: false,
    });
    const field = new Mesh(gl, { mode: gl.POINTS, geometry: fieldGeometry, program: fieldProgram });
    field.setParent(scene);

    let scrollProgress = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.perspective({ aspect: clientWidth / clientHeight });
    };
    window.addEventListener("resize", resize);
    resize();

    let raf = 0;
    const start = performance.now();
    const loop = () => {
      const t = (performance.now() - start) / 1000;
      program.uniforms.uTime.value = t;
      program.uniforms.uScroll.value = scrollProgress;
      points.rotation.y = t * 0.06 + scrollProgress * Math.PI;
      points.rotation.x = scrollProgress * 0.6;
      fieldProgram.uniforms.uTime.value = t;
      fieldProgram.uniforms.uScroll.value = scrollProgress;
      renderer.render({ scene, camera });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      container.removeChild(gl.canvas);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 h-full w-full opacity-80" />
    </div>
  );
}
