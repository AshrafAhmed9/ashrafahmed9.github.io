# Graph Report - Portfolio  (2026-10-24)

## Corpus Check
- 33 files · ~8,236 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 215 nodes · 264 edges · 16 communities (11 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d6c47b61`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- compilerOptions
- dialog.tsx
- components.json
- devDependencies
- page.tsx
- include
- package.json
- layout.tsx
- scroll-deck.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- CLAUDE.md
- Portfolio — Ashraf Ahmed
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `cn()` - 12 edges
3. `Button()` - 8 edges
4. `include` - 7 edges
5. `tailwind` - 6 edges
6. `aliases` - 6 edges
7. `profile` - 6 edges
8. `scripts` - 5 edges
9. `OrbBackground()` - 5 edges
10. `ReadmeDialog()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts
- `DialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts
- `DialogDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts
- `Badge()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/badge.tsx → src/lib/utils.ts
- `Button()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/button.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (16 total, 5 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.05
Nodes (37): class-variance-authority, clsx, framer-motion, lucide-react, next, next-themes, ogl, dependencies (+29 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 2 - "dialog.tsx"
Cohesion: 0.16
Nodes (15): ReadmeDialog(), ReadmeDialogProps, rewriteImageSrc(), Badge(), badgeVariants, Button(), buttonVariants, Dialog() (+7 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @tailwindcss/typography (+11 more)

### Community 5 - "page.tsx"
Cohesion: 0.15
Nodes (12): About(), Contact(), Footer(), iconMap, Header(), navLinks, Hero(), Skills() (+4 more)

### Community 6 - "include"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 7 - "package.json"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 8 - "layout.tsx"
Cohesion: 0.16
Nodes (12): geistMono, geistSans, ibmPlexMono, metadata, playfair, CornerMarks(), positions, fibonacciSphere() (+4 more)

### Community 9 - "scroll-deck.tsx"
Cohesion: 0.12
Nodes (16): PhaseTree(), PhaseTreeProps, TreeItem, openSourceItems, panels, Phase, phases, PhaseSection() (+8 more)

### Community 14 - "Portfolio — Ashraf Ahmed"
Cohesion: 0.40
Nodes (4): Deployment, Local Development, Portfolio — Ashraf Ahmed, Production Build

## Knowledge Gaps
- **105 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+100 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `compilerOptions` to `include`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _105 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._