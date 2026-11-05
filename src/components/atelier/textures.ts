"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import type { Project } from "@/data/projects";
import type { Contribution } from "@/data/contributions";
import { GOLD, GOLD_LIGHT, IVORY } from "./journey";

export interface Fonts {
  serif: string;
  mono: string;
  sans: string;
}

// next/font exposes each family as a CSS variable on <html>. Canvas 2D needs
// the real family string, and the font must be loaded before we draw with it,
// otherwise the textures bake in a fallback font.
export function useFonts(): Fonts | null {
  const [fonts, setFonts] = useState<Fonts | null>(null);
  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const read = (v: string, fallback: string) =>
      css.getPropertyValue(v).trim() || fallback;
    const f = {
      serif: read("--font-playfair", "serif"),
      mono: read("--font-ibm-plex-mono", "monospace"),
      sans: read("--font-geist-sans", "sans-serif"),
    };
    Promise.all([
      document.fonts.load(`600 64px ${f.serif}`),
      document.fonts.load(`400 24px ${f.mono}`),
      document.fonts.load(`400 24px ${f.sans}`),
    ])
      .catch(() => {})
      .finally(() => setFonts(f));
  }, []);
  return fonts;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function toTexture(canvas: HTMLCanvasElement) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function projectName(p: Project) {
  return p.title.split(" — ")[0];
}

export function projectSubtitle(p: Project) {
  return p.title.split(" — ")[1] ?? p.tags.slice(0, 3).join(" · ");
}

export function slabTexture(p: Project, index: number, fonts: Fonts) {
  const W = 512;
  const H = 720;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0d0d11");
  bg.addColorStop(1, "#17140e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(217,179,108,0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(22, 22, W - 44, H - 44);
  ctx.strokeStyle = "rgba(217,179,108,0.18)";
  ctx.strokeRect(34, 34, W - 68, H - 68);

  ctx.fillStyle = GOLD;
  ctx.font = `400 26px ${fonts.mono}`;
  ctx.fillText(String(index + 1).padStart(2, "0"), 58, 90);

  const name = projectName(p);
  const size = name.length > 24 ? 50 : 66;
  ctx.fillStyle = IVORY;
  ctx.font = `600 ${size}px ${fonts.serif}`;
  const lines = wrap(ctx, name, W - 116);
  let y = 300;
  for (const l of lines) {
    ctx.fillText(l, 58, y);
    y += size * 1.12;
  }

  ctx.fillStyle = "rgba(244,238,225,0.62)";
  ctx.font = `400 25px ${fonts.sans}`;
  y += 14;
  for (const l of wrap(ctx, projectSubtitle(p), W - 116)) {
    ctx.fillText(l, 58, y);
    y += 34;
  }

  ctx.fillStyle = GOLD;
  ctx.font = `400 20px ${fonts.mono}`;
  ctx.fillText(p.tags.slice(0, 3).join("  ·  ").toUpperCase(), 58, H - 62);

  return toTexture(c);
}

export function coinTexture(c: Contribution, fonts: Fonts) {
  const S = 512;
  const cv = document.createElement("canvas");
  cv.width = S;
  cv.height = S;
  const ctx = cv.getContext("2d")!;

  const bg = ctx.createRadialGradient(S / 2, S / 2, 20, S / 2, S / 2, S / 2);
  bg.addColorStop(0, "#1b1710");
  bg.addColorStop(1, "#08080a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(217,179,108,0.4)";
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 46, 0, Math.PI * 2);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = GOLD;
  ctx.font = `400 26px ${fonts.mono}`;
  ctx.fillText("MERGED PR", S / 2, 168);
  ctx.fillStyle = GOLD_LIGHT;
  ctx.font = `600 112px ${fonts.serif}`;
  ctx.fillText(`#${c.pr}`, S / 2, 285);
  ctx.fillStyle = IVORY;
  ctx.font = `400 30px ${fonts.mono}`;
  const [org, repo] = c.repo.split("/");
  ctx.fillText(org, S / 2, 345);
  ctx.fillText(repo, S / 2, 385);

  return toTexture(cv);
}

// Soft radial falloff used for the glow behind the final gate.
export function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,214,140,0.55)");
  g.addColorStop(0.45, "rgba(217,179,108,0.16)");
  g.addColorStop(1, "rgba(217,179,108,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return toTexture(c);
}
