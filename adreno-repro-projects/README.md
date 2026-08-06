# Adreno HeatmapLayer / ScreenGridLayer compile-fix repro - 4 standalone projects

Reproduces the GLSL fragment-shader compile failure on Qualcomm **Adreno** GPUs
(Chrome / ANGLE) for `HeatmapLayer` and `ScreenGridLayer`, as 4 independent
Vite projects. Each pins **deck.gl 9.3.7** and applies a different fix variant to
the installed package via **patch-package** (`postinstall` hook) - no forking, no
hand-built bundles.

| project | fix applied | patches/ |
|---------|-------------|----------|
| `v1-no-fix` | none - pristine 9.3.7 | (none) |
| `v2-split`  | **#10301** split the combined `struct FragmentGeometry {...} geometry;` | `@deck.gl+core+9.3.7.patch` |
| `v3-init`   | **#10448** `geometry.uv = vec2(0.)` in the heatmap/screen-grid shaders | `@deck.gl+aggregation-layers+9.3.7.patch` |
| `v4-both`   | both | both patches |

Released deck.gl **9.3.7 ships neither fix**, so `v1` reproduces the bug as-is;
`v2`/`v3`/`v4` each add a fix.

## Run one project

```bash
cd v2-split
npm install         # postinstall runs patch-package -> applies patches/ to node_modules
npm run dev         # live (open the URL in Chrome; on an Adreno phone for the real test)
# or:
npm run build       # -> dist/ (static, host it anywhere)
```

## Expected result

- **On an Adreno phone (Chrome):** `v1` - HeatmapLayer + ScreenGridLayer fail to
  compile (deck shows a shader-error overlay); the Scatterplot control still draws.
  `v2` / `v3` / `v4` - all four render. Either fix alone is enough.
- **On a desktop GPU:** all four render in every project (the bug does not trigger)
  - this only confirms the harness; the Adreno device is the real test.

## Hosting for the maintainers

- **CodeSandbox** (live, editable): import each folder (or the repo) - it runs
  `npm install` + `npm run dev` in a cloud container and serves a public preview URL
  that also loads on a phone. Preferred over StackBlitz here: StackBlitz WebContainers
  run Node in the viewer's browser and are unreliable on mobile Chrome.
- **Static** (simplest, 100% reliable on mobile): `npm run build` each, then host the
  four `dist/` folders on Netlify Drop / Cloudflare Pages / GitHub Pages. Real URLs,
  load on any Adreno phone, render on its GPU.
- On desktop everything is green - attach **screenshots from an Adreno phone**
  (v1 broken vs v2-v4 working) as the actual evidence.

## Regenerating the patches (if the pinned version changes)

`_patchgen/` is the scratch project that produced the two `.patch` files: install the
target deck.gl version, hand-edit the shader files in `node_modules/@deck.gl/...` to
match PR #10301 / #10448, then `npx patch-package @deck.gl/core @deck.gl/aggregation-layers`.
The patch filenames are version-stamped (`+9.3.7`), so bump the version in every
project's `package.json` and regenerate together.
