# Graph Report - Portfolio  (2026-08-26)

## Corpus Check
- 32 files · ~7,613 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 207 nodes · 258 edges · 14 communities (10 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `22c8f371`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- compilerOptions
- dialog.tsx
- components.json
- devDependencies
- page.tsx
- skills.tsx
- package.json
- layout.tsx
- scroll-deck.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `cn()` - 12 edges
3. `Button()` - 8 edges
4. `include` - 7 edges
5. `profile` - 6 edges
6. `aliases` - 6 edges
7. `tailwind` - 6 edges
8. `scripts` - 5 edges
9. `OrbBackground()` - 5 edges
10. `ReadmeDialog()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Button()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/button.tsx → src/lib/utils.ts
- `DialogDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts
- `DialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.tsx → src/lib/utils.ts
- `Badge()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/badge.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (14 total, 4 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.05
Nodes (37): class-variance-authority, clsx, framer-motion, lucide-react, next, next-themes, ogl, dependencies (+29 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 2 - "dialog.tsx"
Cohesion: 0.17
Nodes (13): ReadmeDialog(), ReadmeDialogProps, rewriteImageSrc(), Badge(), badgeVariants, Dialog(), DialogContent(), DialogDescription() (+5 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @tailwindcss/typography (+11 more)

### Community 5 - "page.tsx"
Cohesion: 0.20
Nodes (10): About(), Contact(), Footer(), iconMap, Header(), navLinks, Hero(), Button() (+2 more)

### Community 6 - "skills.tsx"
Cohesion: 0.40
Nodes (4): Skills(), Skill, SkillGroup, skillGroups

### Community 7 - "package.json"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 8 - "layout.tsx"
Cohesion: 0.16
Nodes (12): geistMono, geistSans, ibmPlexMono, metadata, playfair, CornerMarks(), positions, fibonacciSphere() (+4 more)

### Community 9 - "scroll-deck.tsx"
Cohesion: 0.13
Nodes (16): PhaseTree(), PhaseTreeProps, TreeItem, openSourceItems, panels, Phase, phases, PhaseSection() (+8 more)

## Knowledge Gaps
- **101 isolated node(s):** `graphify`, `name`, `version`, `private`, `dev` (+96 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `graphify`, `name`, `version` to the rest of the system?**
  _101 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._