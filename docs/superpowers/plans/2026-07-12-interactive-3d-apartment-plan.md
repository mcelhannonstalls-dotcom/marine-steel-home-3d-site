# Interactive 3D Apartment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-based, mobile-friendly 3D walkthrough of the approved kitchen/bathroom swap, plus matching presentation renders and a dimensioned plan view.

**Architecture:** A Vite-powered vanilla JavaScript application will use Three.js for procedural apartment geometry, physically based materials, lighting, preset cameras, and orbit/walk navigation. All room dimensions, furniture sizes, materials, and review flags live in one immutable design configuration so the plan overlay, 3D scene, and validation tests cannot drift apart. High-resolution presentation renders will follow the same approved configuration and will be displayed separately from the realtime 3D view.

**Tech Stack:** Vite, Three.js r185 or current compatible release, Vitest, vanilla HTML/CSS/JavaScript, Playwright/browser visual QA, built-in image generation for presentation renders.

## Global Constraints

- Preserve the source plan orientation and the approximate dimensions: kitchen 1873 × 2528 mm, bathroom 2289 × 2528 mm, living room 4282 × 3184 mm.
- The former bathroom becomes an open kitchen; the former kitchen becomes the bathroom.
- Use a freestanding 1600 × 780 × 900 mm island with a target 950–1050 mm kitchen-side aisle and at least 900 mm primary circulation.
- Show marine plywood cabinetry, brushed 304 stainless-steel worktops/backsplash, warm-white walls, warm-grey floors, and 3000–3500 K lighting.
- Show a 320–350 mm deep full-height living-room storage wall.
- Mark structural wall, sewage stack, exhaust route, waterproofing, and property approval as field-verification items.
- The 3D app must support desktop and touch navigation, room presets, fullscreen, reset, and mobile portrait layout.
- The artifact is a conceptual visualization and must display a clear notice that it is not a construction drawing.

---

## File Map

- `package.json`: dependency versions and test/build scripts.
- `index.html`: semantic application shell and fallback message.
- `src/design-config.js`: single source of truth for dimensions, labels, materials, cameras, and warnings.
- `src/plan-math.js`: pure unit conversion, bounds, clearance, and layout validation functions.
- `src/materials.js`: Three.js material factory for marine plywood, stainless steel, glass, tile, and painted walls.
- `src/apartment.js`: procedural walls, floors, windows, doors, rooms, cabinetry, sanitary ware, storage, and furniture.
- `src/navigation.js`: preset camera interpolation, orbit/walk switching, reset, and collision-safe target clamping.
- `src/ui.js`: room buttons, plan overlay, information panel, fullscreen, and mobile drawer.
- `src/main.js`: renderer, scene, lifecycle, resize, animation loop, and module composition.
- `src/styles.css`: responsive visual system and touch-safe controls.
- `tests/plan-math.test.js`: unit and clearance validation.
- `tests/navigation.test.js`: camera target and preset validation.
- `public/source-floor-plan.jpg`: user-provided plan copied into the project for the plan overlay.
- `public/renders/*.png`: approved matching presentation renders.

### Task 1: Project Foundation and Dimension Contract

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/design-config.js`
- Create: `src/plan-math.js`
- Create: `tests/plan-math.test.js`
- Create: `src/styles.css`

**Interfaces:**
- Produces: `DESIGN_CONFIG`, `mm(value)`, `rectangleBounds(item)`, `clearanceBetween(a, b)`, and `validateDesign(config)`.
- `validateDesign(config)` returns `{ valid: boolean, errors: string[], warnings: string[] }`.

- [ ] **Step 1: Write failing tests for dimensions, island identity, and circulation**

```js
import { describe, expect, it } from 'vitest';
import { DESIGN_CONFIG } from '../src/design-config.js';
import { mm, validateDesign } from '../src/plan-math.js';

describe('approved design contract', () => {
  it('converts plan millimetres to scene metres', () => expect(mm(1600)).toBe(1.6));
  it('keeps the island freestanding and correctly sized', () => {
    expect(DESIGN_CONFIG.island).toMatchObject({ widthMm: 1600, depthMm: 780, heightMm: 900, freestanding: true });
  });
  it('passes circulation validation', () => {
    const result = validateDesign(DESIGN_CONFIG);
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });
});
```

- [ ] **Step 2: Run `npm test -- --run tests/plan-math.test.js` and verify failure because the modules do not exist**
- [ ] **Step 3: Implement the immutable config and pure validation functions using the exact dimensions in Global Constraints**
- [ ] **Step 4: Add the semantic app shell and responsive base CSS with 44 px minimum touch targets**
- [ ] **Step 5: Run the focused tests and verify all Task 1 tests pass**
- [ ] **Step 6: Commit with `feat: define apartment design contract`**

### Task 2: Procedural Apartment, Materials, and Furniture

**Files:**
- Create: `src/materials.js`
- Create: `src/apartment.js`
- Create: `tests/apartment.test.js`
- Modify: `src/design-config.js`

**Interfaces:**
- Consumes: `DESIGN_CONFIG` and `mm(value)`.
- Produces: `createMaterials(renderer)`, `createApartment(config, materials)`, and `getInspectableObjects(apartment)`.
- `createApartment` returns `{ root, rooms, inspectables, cameraAnchors, bounds }`.

- [ ] **Step 1: Write a failing structural test that requires kitchen, bathroom, living room, bedroom, balcony, island, and storage-wall groups**
- [ ] **Step 2: Run the focused test and confirm failure because `createApartment` is missing**
- [ ] **Step 3: Implement PBR material factories for warm white, marine plywood, brushed 304 stainless steel, glass, tile, upholstery, and warm grey flooring**
- [ ] **Step 4: Build the floor slab, perimeter walls, openings, interior partitions, windows, and doors from the plan dimensions**
- [ ] **Step 5: Build the new open kitchen, 1600 × 780 mm island, dining stools, full-height living storage, compact sofa, new bathroom fixtures, bedroom, and balcony**
- [ ] **Step 6: Add metadata to every inspectable object: Chinese name, material, approximate size, and field-verification note where applicable**
- [ ] **Step 7: Run Task 1 and Task 2 tests and verify they pass**
- [ ] **Step 8: Commit with `feat: model swapped apartment interior`**

### Task 3: Camera Navigation and Responsive Interface

**Files:**
- Create: `src/navigation.js`
- Create: `src/ui.js`
- Create: `src/main.js`
- Create: `tests/navigation.test.js`
- Modify: `src/styles.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: apartment camera anchors and `DESIGN_CONFIG.cameras`.
- Produces: `createNavigation(camera, controls, bounds)`, `createUI({ config, navigation, inspectables })`, and `goToPreset(id)`.

- [ ] **Step 1: Write failing tests that require `overview`, `kitchen`, `living`, `bathroom`, and `bedroom` presets with valid positions and targets**
- [ ] **Step 2: Run the focused navigation test and verify failure because the module is missing**
- [ ] **Step 3: Implement camera interpolation, bounds clamping, reset, orbit mode, walk mode, and keyboard/touch-safe input**
- [ ] **Step 4: Implement Chinese room buttons, plan overlay, clickable object information, design-risk notice, fullscreen, help, reset, and mobile drawer**
- [ ] **Step 5: Compose the WebGL renderer, soft shadows, daylight, warm practical lights, resize handling, animation loop, loading state, and WebGL fallback**
- [ ] **Step 6: Run all unit tests and verify they pass**
- [ ] **Step 7: Commit with `feat: add interactive apartment walkthrough`**

### Task 4: Source Plan, Presentation Renders, and In-App Gallery

**Files:**
- Create: `public/source-floor-plan.jpg`
- Create: `public/renders/kitchen-island.png`
- Create: `public/renders/kitchen-detail.png`
- Create: `public/renders/living-storage.png`
- Optional create after visual review: `public/renders/bathroom.png`
- Modify: `src/ui.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: the approved design configuration and source plan.
- Produces: a gallery with exact render filenames and descriptive Chinese alt text.

- [ ] **Step 1: Copy the supplied source plan non-destructively into `public/source-floor-plan.jpg`**
- [ ] **Step 2: Generate the kitchen/island hero render using marine plywood, brushed 304 stainless steel, a true freestanding island, warm professional lighting, and the approved room proportions**
- [ ] **Step 3: Generate the kitchen material-detail and living storage-wall renders with consistent architecture and palette**
- [ ] **Step 4: Inspect each render for island type, room orientation, material accuracy, duplicated fixtures, text artifacts, and impossible circulation; regenerate only the failing view**
- [ ] **Step 5: Add the approved renders to a responsive in-app gallery without blocking 3D loading**
- [ ] **Step 6: Commit with `feat: add matching interior presentation renders`**

### Task 5: Browser QA, Performance, and Delivery

**Files:**
- Create: `tests/browser/walkthrough.spec.js`
- Modify as required by observed failures: `src/main.js`, `src/navigation.js`, `src/ui.js`, `src/styles.css`
- Create: `README.md`

**Interfaces:**
- Produces: `npm run test`, `npm run build`, and `npm run preview` as verified delivery commands.

- [ ] **Step 1: Write a browser test that opens the app, waits for the 3D-ready state, selects each room preset, opens the plan and render gallery, and verifies the conceptual-design notice**
- [ ] **Step 2: Run the browser test at 1440 × 900 and 390 × 844; capture screenshots and record any visual or interaction failures**
- [ ] **Step 3: Fix only observed failures, keeping all touch targets at least 44 px and preventing control overlap in portrait mode**
- [ ] **Step 4: Run `npm test -- --run`, the browser test, and `npm run build`; require zero test failures and a successful production bundle**
- [ ] **Step 5: Perform a final visual check of kitchen materials, island circulation, storage wall, bathroom swap, camera clipping, and mobile layout**
- [ ] **Step 6: Document local viewing, controls, design assumptions, and field-verification warnings in `README.md`**
- [ ] **Step 7: Commit with `test: verify interactive apartment delivery`**

## Plan Self-Review

- Spec coverage: every requirement in the approved design spec maps to Tasks 1–5.
- Scope: the realtime walkthrough, matching renders, and source plan gallery share one configuration and therefore remain one coherent deliverable.
- Type consistency: `DESIGN_CONFIG`, `mm`, `validateDesign`, `createApartment`, `createNavigation`, and `createUI` are defined before use.
- Testing: pure geometry and navigation rules are unit-tested; user-visible behavior is browser-tested on desktop and mobile.
- Privacy: local delivery is the default. Public hosting requires separate explicit approval because the artifact exposes the apartment layout.
