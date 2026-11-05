"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Edges,
  Environment,
  Grid,
  Lightformer,
  MeshReflectorMaterial,
  Sparkles,
  useCursor,
} from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { contributions } from "@/data/contributions";
import {
  AXIS_X,
  FLOOR_Y,
  GOLD,
  GOLD_LIGHT,
  INK,
  LAST,
  STATION_GAP,
  buildPaths,
  stationZ,
} from "./journey";
import { coinTexture, glowTexture, slabTexture, useFonts } from "./textures";

export interface Tip {
  title: string;
  sub?: string;
}

export interface SceneProps {
  progress: RefObject<number>;
  reduced: boolean;
  compact: boolean;
  project: number | null;
  setHoverProject: (i: number | null) => void;
  onPickProject: (i: number) => void;
  coin: number | null;
  setHoverCoin: (i: number | null) => void;
  onPickCoin: (i: number) => void;
  category: string | null;
  setTip: (t: Tip | null) => void;
  onReady: () => void;
}

// Colours above 1.0 survive only on materials that skip tone mapping, which is
// what lets the bloom pass (threshold 0.9) single them out as light sources.
const glow = (hex: string, k: number) => new THREE.Color(hex).multiplyScalar(k);
const damp = THREE.MathUtils.damp;

/** 1 when the camera is parked at station i, falling to 0 away from it. */
const near = (camT: number, i: number) =>
  THREE.MathUtils.clamp(1 - Math.abs(camT - i) * 1.5, 0, 1);

type CamT = RefObject<number>;

/* -------------------------------------------------------------------------- */
/* Camera                                                                      */
/* -------------------------------------------------------------------------- */

function CameraRig({
  progressRef,
  camTRef,
  reduced,
  lightRef,
}: {
  progressRef: RefObject<number>;
  camTRef: CamT;
  reduced: boolean;
  lightRef: RefObject<THREE.PointLight | null>;
}) {
  const size = useThree((s) => s.size);
  const aspect = size.width / size.height;
  const paths = useMemo(() => buildPaths(aspect), [aspect]);
  const t = useRef(-1);
  const pointer = useRef(new THREE.Vector2());
  const posRef = useRef(new THREE.Vector3());
  const tgtRef = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const pos = posRef.current;
    const tgt = tgtRef.current;
    const goal = progressRef.current ?? 0;
    // First frame: start where the page already is (e.g. reload mid-page)
    // instead of flying in from the intro.
    if (t.current < 0) t.current = goal;
    // Damping turns stepped wheel input into a continuous glide.
    t.current = damp(t.current, goal, reduced ? 40 : 3, dt);
    camTRef.current = t.current * LAST;
    paths.cam.getPoint(t.current, pos);
    paths.look.getPoint(t.current, tgt);

    const k = reduced ? 0 : 1;
    pointer.current.x = damp(pointer.current.x, state.pointer.x * k, 2.5, dt);
    pointer.current.y = damp(pointer.current.y, state.pointer.y * k, 2.5, dt);

    state.camera.position.set(
      pos.x + pointer.current.x * 0.55,
      pos.y + pointer.current.y * 0.3,
      pos.z,
    );
    state.camera.lookAt(tgt);
    // A warm light rides with the camera so every station is lit the same way.
    lightRef.current?.position.set(pos.x + 2, pos.y + 4, pos.z - 3);
  });
  return null;
}

/* -------------------------------------------------------------------------- */
/* Corridor                                                                    */
/* -------------------------------------------------------------------------- */

function Stage({ compact }: { compact: boolean }) {
  const length = LAST * STATION_GAP + 120;
  const centerZ = -(LAST * STATION_GAP) / 2 - 10;
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y, centerZ]}>
        <planeGeometry args={[80, length]} />
        {compact ? (
          // The reflector re-renders the whole scene; phones get a plain floor.
          <meshStandardMaterial color="#0b0b0e" metalness={0.6} roughness={0.5} />
        ) : (
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={512}
            mixBlur={1}
            mixStrength={26}
            roughness={1}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#0b0b0e"
            metalness={0.6}
            mirror={0}
          />
        )}
      </mesh>

      <Grid
        position={[0, FLOOR_Y + 0.01, centerZ]}
        args={[80, length]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#2a2418"
        sectionSize={6}
        sectionThickness={0.9}
        sectionColor="#6b5530"
        fadeDistance={55}
        fadeStrength={1.6}
        followCamera
        infiniteGrid
      />

      {Array.from({ length: LAST + 1 }, (_, i) => (
        <mesh
          key={i}
          position={[AXIS_X, FLOOR_Y + 0.02, stationZ(i)]}
          rotation-x={-Math.PI / 2}
        >
          <torusGeometry args={[3.6, 0.012, 8, 160]} />
          <meshBasicMaterial color={glow(GOLD, 1.4)} toneMapped={false} />
        </mesh>
      ))}

      <Sparkles
        count={compact ? 260 : 650}
        scale={[34, 12, length]}
        position={[0, 1, centerZ]}
        size={3.2}
        speed={0.25}
        opacity={0.8}
        color={GOLD_LIGHT}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 0  Intro: the gem                                                           */
/* -------------------------------------------------------------------------- */

function Gem({ reduced }: { reduced: boolean }) {
  const core = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const cage = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (reduced) return;
    const s = state.clock.elapsedTime;
    if (core.current) {
      core.current.rotation.y += dt * 0.18;
      core.current.rotation.x = Math.sin(s * 0.4) * 0.12;
      core.current.position.y = Math.sin(s * 0.7) * 0.12;
    }
    if (ringA.current) ringA.current.rotation.z += dt * 0.25;
    if (ringB.current) ringB.current.rotation.x += dt * 0.18;
    if (cage.current) cage.current.rotation.y -= dt * 0.08;
  });

  return (
    <group position={[AXIS_X, 0, stationZ(0)]}>
      <group ref={core}>
        <mesh>
          <icosahedronGeometry args={[1.55, 1]} />
          <meshPhysicalMaterial
            color="#070709"
            metalness={1}
            roughness={0.1}
            flatShading
            clearcoat={1}
            envMapIntensity={1.8}
          />
          <Edges threshold={1} color={glow(GOLD, 1.8)} />
        </mesh>
        <mesh ref={cage} scale={1.55}>
          <icosahedronGeometry args={[1.55, 0]} />
          <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.28} toneMapped={false} />
        </mesh>
      </group>
      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[2.75, 0.014, 12, 220]} />
        <meshBasicMaterial color={glow(GOLD_LIGHT, 2)} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} rotation={[0.3, 0, Math.PI / 3]}>
        <torusGeometry args={[3.25, 0.01, 12, 260]} />
        <meshBasicMaterial color={glow(GOLD, 1.6)} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* 1  Open source: one coin per merged PR                                      */
/* -------------------------------------------------------------------------- */

function Coin({
  index,
  angle,
  radius,
  texture,
  lit,
  spinRef,
  onHover,
  onPick,
  setTip,
}: {
  index: number;
  angle: number;
  radius: number;
  texture: THREE.Texture;
  lit: boolean;
  spinRef: RefObject<THREE.Group | null>;
  onHover: (i: number | null) => void;
  onPick: (i: number) => void;
  setTip: (t: Tip | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const face = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const c = contributions[index];
  useCursor(hovered);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    // Cancel the carousel's spin so each coin stays upright and readable.
    g.rotation.z = -(spinRef.current?.rotation.z ?? 0);
    g.scale.setScalar(damp(g.scale.x, lit ? 1.28 : 1, 7, dt));
    if (face.current) {
      face.current.emissiveIntensity = damp(face.current.emissiveIntensity, lit ? 1.5 : 0.75, 7, dt);
    }
  });

  return (
    <group position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
      <group
        ref={group}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(index);
          setTip({ title: c.title, sub: `${c.repo} · PR #${c.pr}` });
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
          setTip(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPick(index);
        }}
      >
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.62, 0.62, 0.12, 56]} />
          <meshStandardMaterial
            color="#c9a15a"
            metalness={1}
            roughness={0.22}
            emissive={GOLD}
            emissiveIntensity={lit ? 0.45 : 0.06}
          />
        </mesh>
        <mesh position={[0, 0, 0.062]}>
          <circleGeometry args={[0.55, 56]} />
          <meshStandardMaterial
            ref={face}
            color="#000000"
            emissive="#ffffff"
            emissiveMap={texture}
            emissiveIntensity={0.75}
          />
        </mesh>
      </group>
    </group>
  );
}

function CoinRing({
  reduced,
  focus,
  setHover,
  onPick,
  setTip,
}: {
  reduced: boolean;
  focus: number | null;
  setHover: (i: number | null) => void;
  onPick: (i: number) => void;
  setTip: (t: Tip | null) => void;
}) {
  const fonts = useFonts();
  const spin = useRef<THREE.Group>(null);
  const textures = useMemo(
    () => (fonts ? contributions.map((c) => coinTexture(c, fonts)) : []),
    [fonts],
  );
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  const n = contributions.length;
  const radius = Math.max(2.6, n * 0.32);
  const angleOf = (i: number) => (i / n) * Math.PI * 2;

  useFrame((_, dt) => {
    const s = spin.current;
    if (!s) return;
    if (focus !== null) {
      // Turn the carousel the short way round until the coin for the PR being
      // read sits at 9 o'clock, pointing back at its card in the text column.
      const target = Math.PI - angleOf(focus);
      const diff = Math.atan2(Math.sin(target - s.rotation.z), Math.cos(target - s.rotation.z));
      s.rotation.z += diff * (1 - Math.exp(-(reduced ? 60 : 3.5) * dt));
    } else if (!reduced) {
      s.rotation.z += dt * 0.12;
    }
  });

  if (!textures.length) return null;
  return (
    <group position={[AXIS_X, 0, stationZ(1)]}>
      <group ref={spin}>
        {contributions.map((c, i) => (
          <Coin
            key={c.url}
            index={i}
            angle={angleOf(i)}
            radius={radius}
            texture={textures[i]}
            lit={focus === i}
            spinRef={spin}
            onHover={setHover}
            onPick={onPick}
            setTip={setTip}
          />
        ))}
      </group>
      <mesh>
        <torusGeometry args={[radius, 0.008, 8, 200]} />
        <meshBasicMaterial color={glow(GOLD, 1.3)} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* 2  Experience: 40 database lookups collapse into 2; payload shrinks 46%     */
/* -------------------------------------------------------------------------- */

const COLS = 8;
const ROWS = 5;
const KEEP = [19, 20]; // the two centre columns survive the collapse

function QueryCollapse({ camTRef, reduced }: { camTRef: CamT; reduced: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const cube = useRef<THREE.Group>(null);
  const collapse = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = COLS * ROWS;
  const heights = useMemo(
    () => Array.from({ length: count }, (_, i) => 0.7 + (((i * 37) % 11) / 11) * 2.1),
    [count],
  );

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const dim = glow(GOLD, 1.05);
    const bright = glow(GOLD_LIGHT, 2.6);
    for (let i = 0; i < count; i++) m.setColorAt(i, KEEP.includes(i) ? bright : dim);
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [count]);

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    // Plays when the camera arrives and rewinds when it leaves, so the effect
    // is seen every time someone reads this section.
    const goal = near(camTRef.current ?? 0, 2) > 0.7 ? 1 : 0;
    collapse.current = reduced ? goal : damp(collapse.current, goal, 1.4, dt);
    const c = collapse.current;

    for (let i = 0; i < count; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      let x = (col - (COLS - 1) / 2) * 0.42;
      let z = (row - (ROWS - 1) / 2) * 0.42;
      let h: number;
      if (KEEP.includes(i)) {
        h = THREE.MathUtils.lerp(heights[i], 3.6, c);
        x = THREE.MathUtils.lerp(x, i === KEEP[0] ? -0.32 : 0.32, c);
        z = THREE.MathUtils.lerp(z, 0, c);
      } else {
        // Stagger left-to-right so the collapse reads as a wave, not a blink.
        const local = THREE.MathUtils.clamp(c * 1.7 - col * 0.09, 0, 1);
        h = Math.max(heights[i] * (1 - local), 0.0001);
      }
      dummy.position.set(x, h / 2, z);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;

    if (cube.current) {
      cube.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.54, c));
      if (!reduced) cube.current.rotation.y += dt * 0.3;
    }
  });

  return (
    <group position={[AXIS_X, -1.7, stationZ(2)]}>
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[4.2, 0.16, 2.8]} />
        <meshPhysicalMaterial color="#08080a" metalness={1} roughness={0.18} clearcoat={1} />
        <Edges color={glow(GOLD, 1.3)} />
      </mesh>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* Payload: a faint outline of the old size, and the 54% that remains. */}
      <group position={[2.9, 3.1, -0.4]}>
        <mesh>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          <Edges color={GOLD} transparent opacity={0.25} />
        </mesh>
        <group ref={cube}>
          <mesh>
            <boxGeometry args={[1.3, 1.3, 1.3]} />
            <meshPhysicalMaterial color="#0a0a0c" metalness={1} roughness={0.15} clearcoat={1} />
            <Edges color={glow(GOLD_LIGHT, 2)} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* 3  Projects: a wall of slabs                                                */
/* -------------------------------------------------------------------------- */

function Slab({
  index,
  position,
  texture,
  lit,
  reduced,
  onHover,
  onPick,
}: {
  index: number;
  position: [number, number, number];
  texture: THREE.Texture;
  lit: boolean;
  reduced: boolean;
  onHover: (i: number | null) => void;
  onPick: (i: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const face = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.position.z = damp(g.position.z, position[2] + (lit ? 0.7 : 0), 6, dt);
    const bob = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.06;
    g.position.y = damp(g.position.y, position[1] + bob + (lit ? 0.1 : 0), 6, dt);
    if (face.current) {
      face.current.emissiveIntensity = damp(face.current.emissiveIntensity, lit ? 1.5 : 0.7, 6, dt);
    }
  });

  const dx = position[0] - AXIS_X;
  return (
    <group ref={group} position={position} rotation-y={-dx * 0.08}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(index);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPick(index);
        }}
      >
        <boxGeometry args={[1.3, 1.85, 0.07]} />
        {[0, 1, 2, 3, 5].map((n) => (
          <meshStandardMaterial key={n} attach={`material-${n}`} color="#15120d" metalness={1} roughness={0.3} />
        ))}
        <meshStandardMaterial
          ref={face}
          attach="material-4"
          color="#000000"
          emissive="#ffffff"
          emissiveMap={texture}
          emissiveIntensity={0.7}
          metalness={0.6}
          roughness={0.25}
        />
        <Edges color={glow(GOLD, lit ? 2.4 : 1.1)} />
      </mesh>
    </group>
  );
}

function SlabWall({
  reduced,
  focus,
  setHover,
  onPick,
}: {
  reduced: boolean;
  focus: number | null;
  setHover: (i: number | null) => void;
  onPick: (i: number) => void;
}) {
  const fonts = useFonts();
  const textures = useMemo(
    () => (fonts ? projects.map((p, i) => slabTexture(p, i, fonts)) : []),
    [fonts],
  );
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  // Two staggered rows, bowed slightly toward the camera at the ends.
  const layout = useMemo(() => {
    const z = stationZ(3);
    const top = Math.ceil(projects.length / 2);
    const rows: [number, number][] = [
      [top, 1.12],
      [projects.length - top, -1.12],
    ];
    const out: [number, number, number][] = [];
    for (const [n, y] of rows) {
      for (let j = 0; j < n; j++) {
        const dx = (j - (n - 1) / 2) * 1.62;
        out.push([AXIS_X + dx, y, z + dx * dx * 0.05]);
      }
    }
    return out;
  }, []);

  if (!textures.length) return null;
  return (
    <>
      {projects.map((p, i) => (
        <Slab
          key={p.title}
          index={i}
          position={layout[i]}
          texture={textures[i]}
          lit={focus === i}
          reduced={reduced}
          onHover={setHover}
          onPick={onPick}
        />
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 4  Skills: one orbit per skill group                                        */
/* -------------------------------------------------------------------------- */

function SkillNode({
  angle,
  radius,
  name,
  category,
  dimmed,
  lit,
  setTip,
}: {
  angle: number;
  radius: number;
  name: string;
  category: string;
  dimmed: boolean;
  lit: boolean;
  setTip: (t: Tip | null) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "help");

  useFrame((_, dt) => {
    if (mesh.current) mesh.current.scale.setScalar(damp(mesh.current.scale.x, hovered ? 2.4 : 1, 8, dt));
    const m = mat.current;
    if (!m) return;
    // Fade rather than toggle, so moving between groups feels continuous.
    m.opacity = damp(m.opacity, dimmed ? 0.08 : 1, 6, dt);
    m.emissiveIntensity = damp(m.emissiveIntensity, lit || hovered ? 3 : 1.2, 6, dt);
  });

  return (
    <group position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
      <mesh ref={mesh}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          ref={mat}
          color={GOLD_LIGHT}
          emissive={GOLD}
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.25}
          transparent
        />
      </mesh>
      {/* Bigger invisible hit target: the visible gems are too small to hover. */}
      <mesh
        visible={false}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setTip({ title: name, sub: category });
        }}
        onPointerOut={() => {
          setHovered(false);
          setTip(null);
        }}
      >
        <sphereGeometry args={[0.28, 8, 8]} />
      </mesh>
    </group>
  );
}

function SkillOrbit({
  index,
  group,
  active,
  reduced,
  setTip,
}: {
  index: number;
  group: (typeof skillGroups)[number];
  active: string | null;
  reduced: boolean;
  setTip: (t: Tip | null) => void;
}) {
  const spin = useRef<THREE.Group>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const radius = 1.25 + index * 0.47;
  const speed = (index % 2 ? -1 : 1) * (0.5 / radius);
  const dimmed = active !== null && active !== group.category;
  const lit = active === group.category;

  useFrame((_, dt) => {
    if (spin.current && !reduced) spin.current.rotation.y += dt * speed * (lit ? 2.2 : 1);
    if (ringMat.current) {
      ringMat.current.opacity = damp(ringMat.current.opacity, dimmed ? 0.04 : lit ? 1 : 0.45, 6, dt);
    }
  });

  const tiltX = Math.sin(index * 1.7) * 0.28;
  const tiltZ = Math.cos(index * 2.3) * 0.28;

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[radius, 0.006, 6, 200]} />
        <meshBasicMaterial
          ref={ringMat}
          color={glow(GOLD, 1.6)}
          transparent
          opacity={0.45}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      <group ref={spin}>
        {group.skills.map((s, i) => (
          <SkillNode
            key={s.name}
            angle={(i / group.skills.length) * Math.PI * 2}
            radius={radius}
            name={s.name}
            category={group.category}
            dimmed={dimmed}
            lit={lit}
            setTip={setTip}
          />
        ))}
      </group>
    </group>
  );
}

function SkillOrbits({
  active,
  reduced,
  setTip,
}: {
  active: string | null;
  reduced: boolean;
  setTip: (t: Tip | null) => void;
}) {
  return (
    <group position={[AXIS_X, 0, stationZ(4)]} rotation={[0.75, 0, -0.18]}>
      <mesh>
        <icosahedronGeometry args={[0.38, 1]} />
        <meshBasicMaterial color={glow(GOLD_LIGHT, 2.6)} toneMapped={false} />
      </mesh>
      <mesh scale={1.7}>
        <icosahedronGeometry args={[0.38, 1]} />
        <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.35} toneMapped={false} />
      </mesh>
      {skillGroups.map((g, i) => (
        <SkillOrbit key={g.category} index={i} group={g} active={active} reduced={reduced} setTip={setTip} />
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* 5  About: radar sweep with drone tracks and forecast trajectories           */
/* -------------------------------------------------------------------------- */

const DRONES = [
  { a: 0.23, b: 0.31, p: 0.0 },
  { a: 0.17, b: 0.27, p: 1.9 },
  { a: 0.29, b: 0.19, p: 3.4 },
  { a: 0.21, b: 0.35, p: 5.1 },
];
const FORECAST = 9;

// Lissajous paths stay inside the radar's 3-unit radius (max ≈ 2.83).
function dronePos(d: (typeof DRONES)[number], t: number, out: THREE.Vector3) {
  return out.set(2.1 * Math.sin(d.a * t + d.p), 1.9 * Math.sin(d.b * t + 2 * d.p), 0.12);
}

function Radar({ reduced }: { reduced: boolean }) {
  const sweep = useRef<THREE.Mesh>(null);
  const blips = useRef<(THREE.Mesh | null)[]>([]);
  const forecast = useRef<THREE.Points>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const positions = useMemo(() => new Float32Array(DRONES.length * FORECAST * 3), []);
  const time = useRef(8);

  useFrame((_, dt) => {
    time.current += reduced ? 0 : dt;
    const t = time.current;
    const sweepAngle = -t * 1.1;
    if (sweep.current) sweep.current.rotation.z = sweepAngle;

    DRONES.forEach((d, i) => {
      const m = blips.current[i];
      if (!m) return;
      dronePos(d, t, m.position);
      // A blip flares when the beam passes over it, then fades until next pass.
      const bearing = Math.atan2(m.position.y, m.position.x);
      const since = (((bearing - sweepAngle) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.color.copy(glow(GOLD_LIGHT, 0.35 + 2.6 * Math.exp(-since * 1.4)));

      // Forecast: where the track will be over the next few seconds.
      for (let k = 0; k < FORECAST; k++) {
        dronePos(d, t + (k + 1) * 0.45, tmp);
        positions.set([tmp.x, tmp.y, tmp.z], (i * FORECAST + k) * 3);
      }
    });
    const geo = forecast.current?.geometry;
    if (geo) geo.attributes.position.needsUpdate = true;
  });

  return (
    <group position={[AXIS_X, -0.6, stationZ(5)]} rotation={[-Math.PI / 2 + 0.6, 0, 0]}>
      <mesh>
        <circleGeometry args={[3.05, 96]} />
        <meshPhysicalMaterial color="#060608" metalness={1} roughness={0.25} clearcoat={1} />
      </mesh>
      {[1, 2, 3].map((r) => (
        <mesh key={r} position={[0, 0, 0.01]}>
          <torusGeometry args={[r, r === 3 ? 0.018 : 0.007, 6, 200]} />
          <meshBasicMaterial color={glow(GOLD, r === 3 ? 1.8 : 1.2)} toneMapped={false} />
        </mesh>
      ))}
      {[0, Math.PI / 2].map((rot) => (
        <mesh key={rot} rotation-z={rot} position={[0, 0, 0.01]}>
          <planeGeometry args={[6, 0.008]} />
          <meshBasicMaterial color={glow(GOLD, 1.1)} toneMapped={false} />
        </mesh>
      ))}
      <mesh ref={sweep} position={[0, 0, 0.02]}>
        <ringGeometry args={[0.04, 3, 64, 1, 0, 0.75]} />
        <meshBasicMaterial
          color={glow(GOLD, 0.9)}
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      {DRONES.map((d, i) => (
        <mesh key={d.p} ref={(m) => { blips.current[i] = m; }}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial toneMapped={false} />
        </mesh>
      ))}
      <points ref={forecast}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={glow(GOLD, 1.5)} size={0.05} transparent opacity={0.85} toneMapped={false} />
      </points>
      {/* The camera half of radar-camera fusion: a sensor frustum aimed inward. */}
      <mesh position={[3.7, 0, 0.6]} rotation-z={-Math.PI / 2}>
        <coneGeometry args={[0.55, 1.2, 4, 1, true]} />
        <meshBasicMaterial color={glow(GOLD_LIGHT, 1.6)} wireframe toneMapped={false} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* 6  Contact: the gate                                                        */
/* -------------------------------------------------------------------------- */

function Gate({ reduced }: { reduced: boolean }) {
  const rings = useRef<THREE.Group>(null);
  const glowTex = useMemo(() => glowTexture(), []);
  useEffect(() => () => glowTex.dispose(), [glowTex]);

  useFrame((state, dt) => {
    if (reduced || !rings.current) return;
    rings.current.children.forEach((c, i) => {
      c.rotation.z += dt * (0.15 + i * 0.08) * (i % 2 ? -1 : 1);
    });
    rings.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
  });

  return (
    <group position={[AXIS_X, 0, stationZ(6)]}>
      <mesh position={[0, 0, -0.3]}>
        <planeGeometry args={[11, 11]} />
        <meshBasicMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <group ref={rings}>
        <mesh>
          <torusGeometry args={[2.7, 0.1, 24, 200]} />
          <meshStandardMaterial color="#c9a15a" metalness={1} roughness={0.18} emissive={GOLD} emissiveIntensity={0.25} />
        </mesh>
        <mesh>
          <torusGeometry args={[2.2, 0.012, 8, 200]} />
          <meshBasicMaterial color={glow(GOLD_LIGHT, 2)} toneMapped={false} />
        </mesh>
        <mesh>
          <torusGeometry args={[1.7, 0.008, 8, 200]} />
          <meshBasicMaterial color={glow(GOLD, 1.6)} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Root                                                                        */
/* -------------------------------------------------------------------------- */

export default function Scene(props: SceneProps) {
  const light = useRef<THREE.PointLight>(null);
  const camTRef = useRef(0);

  return (
    <Canvas
      // `flat` disables the renderer's tone mapping; the ToneMapping effect
      // applies it after bloom, so glowing materials aren't clamped first.
      flat
      dpr={props.compact ? [1, 1.5] : [1, 1.75]}
      camera={{ fov: 42, near: 0.1, far: 220, position: [0, 0.4, 12] }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      onCreated={props.onReady}
    >
      <color attach="background" args={[INK]} />
      <fog attach="fog" args={[INK, 20, 78]} />

      <ambientLight intensity={0.15} />
      <pointLight ref={light} color="#ffd9a0" intensity={60} distance={40} decay={1.6} />

      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} color="#ffe2b0" position={[0, 6, 4]} scale={[14, 3, 1]} />
        <Lightformer form="rect" intensity={3} color="#ffcf8a" position={[-8, 1, 2]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[8, 2, -3]} rotation-y={-Math.PI / 2} scale={[8, 1.5, 1]} />
        <Lightformer form="ring" intensity={2} color="#fff3d6" position={[0, 2, -8]} scale={5} />
      </Environment>

      <CameraRig progressRef={props.progress} camTRef={camTRef} reduced={props.reduced} lightRef={light} />
      <Stage compact={props.compact} />

      <Gem reduced={props.reduced} />
      <CoinRing
        reduced={props.reduced}
        focus={props.coin}
        setHover={props.setHoverCoin}
        onPick={props.onPickCoin}
        setTip={props.setTip}
      />
      <QueryCollapse camTRef={camTRef} reduced={props.reduced} />
      <SlabWall
        reduced={props.reduced}
        focus={props.project}
        setHover={props.setHoverProject}
        onPick={props.onPickProject}
      />
      <SkillOrbits active={props.category} reduced={props.reduced} setTip={props.setTip} />
      <Radar reduced={props.reduced} />
      <Gate reduced={props.reduced} />

      <EffectComposer multisampling={props.compact ? 0 : 4}>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.9} luminanceSmoothing={0.2} />
        <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  );
}
