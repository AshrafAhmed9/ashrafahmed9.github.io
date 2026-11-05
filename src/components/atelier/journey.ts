import * as THREE from "three";

export const GOLD = "#d9b36c";
export const GOLD_LIGHT = "#f1dba8";
export const IVORY = "#f4eee1";
export const INK = "#050507";

// One entry per page section, in page order. Each section owns a "station"
// in the 3D corridor, and its showpiece is built around that section's content.
export const chapters = [
  { id: "top", label: "Intro" },
  { id: "opensource", label: "Open source" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export const LAST = chapters.length - 1;

export const STATION_GAP = 30;
export const stationZ = (i: number) => -i * STATION_GAP;

// Showpieces sit right of the corridor axis; the text column owns the left.
export const AXIS_X = 4.4;
export const FLOOR_Y = -3.4;

// Per-station framing: camera distance, sideways sway, height.
const DIST = [12, 13, 12, 15, 13, 12, 11];
const SWAY = [0, -1, 0.8, -0.6, 1, -0.8, 0];
const RISE = [0.4, 0.3, 1.2, 0.7, 0.9, 2.2, 0.2];

/**
 * Converts the page's scroll state into a camera position along the corridor.
 *
 * The camera stays parked at a section's station while that section is being
 * read, then flies to the next station while the next section's top edge
 * travels from the bottom of the screen to the middle. Long sections therefore
 * hold the camera still instead of dragging it slowly through empty space.
 */
export function scrollProgress(sections: HTMLElement[]) {
  const vh = window.innerHeight;
  const mid = vh / 2;
  let i = 0;
  for (let k = 0; k < sections.length; k++) {
    if (sections[k].getBoundingClientRect().top <= mid) i = k;
  }
  if (i >= LAST) return 1;
  const distance = sections[i + 1].getBoundingClientRect().top - mid;
  const t = THREE.MathUtils.clamp(1 - distance / mid, 0, 1);
  return (i + THREE.MathUtils.smoothstep(t, 0, 1)) / LAST;
}

/**
 * Camera and look-at curves. Catmull-Rom passes through its control points
 * and getPoint(i / LAST) returns point i, so station i is exactly progress i / LAST.
 * On portrait screens the text spans the full width, so the showpiece is
 * centred behind it instead of pushed right.
 */
export function buildPaths(aspect: number) {
  const fit = THREE.MathUtils.clamp(1.78 / aspect, 1, 2.4);
  const portrait = THREE.MathUtils.clamp((1.1 - aspect) / 0.5, 0, 1);
  const lookX = THREE.MathUtils.lerp(0.4, AXIS_X, portrait);

  const cam: THREE.Vector3[] = [];
  const look: THREE.Vector3[] = [];
  for (let i = 0; i <= LAST; i++) {
    const z = stationZ(i);
    cam.push(new THREE.Vector3(SWAY[i], RISE[i], z + DIST[i] * fit));
    look.push(new THREE.Vector3(lookX, 0, z));
  }
  return {
    cam: new THREE.CatmullRomCurve3(cam, false, "centripetal"),
    look: new THREE.CatmullRomCurve3(look, false, "centripetal"),
  };
}
