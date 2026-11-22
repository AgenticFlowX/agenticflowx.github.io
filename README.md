# AgenticFlowX website

Static website served from this repository’s root on GitHub Pages. No build dependencies or hosted application service are required.

## Pages

| Page                  | Content                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| `index.html`          | Overview, installation, Pi/model access, YouTube explainer, interactive spec example, product tour, credits |
| `vscode.html`         | Chat modes, hybrid Markdown Previewer, SDD Studio, Workbench, Blueprint, history, traceability              |
| `workflow.html`       | Dash/Sprint/full workflows, Claude Code/Desktop/Cowork installation, CLI, role packs                        |
| `get-started.html`    | Extension setup, model connection, first change, skills/trust, settings, troubleshooting                    |
| `models.html`         | Pi SDK/RPC, provider access, subscriptions, API keys, local runtimes, custom endpoints                      |
| `learn.html`          | Practical spec-driven development walkthrough                                                               |
| `docs.html`           | Documentation map, canonical templates, stable IDs, validation, research, and ADRs                          |
| `examples.html`       | Complete Dash, Sprint, and Room Dashboard documents with Markdown / preview / AFX Previewer views           |
| `spec-reference.html` | Detailed notation, file layouts, worked examples, document controls, standards lineage                      |

The old `help.html`, `sdd-guide.html`, and `document-anatomy.html` URLs remain generated aliases with canonical links to their replacements. `assets/site/legacy-routes.js` preserves their section destinations, including help sections moved to Models or Skills, and older homepage anchors.

## Editing and building

Node.js 18 or newer. No dependency installation is needed.

```sh
npm run build
npm run check
npm test
npm run dev
```

The preview server listens on `http://127.0.0.1:4173`. Set `PORT` to change the port. Rebuild after changing HTML source, then reload the preview.

Edit `src/pages/*.html`, `src/layout.html`, and `src/partials/spec-example.html`. Generated HTML stays at the root for the existing GitHub Pages setup. Shared styles and interactions live in `assets/site/refresh.css` and `refresh.js`; `reference.css` scopes the detailed technical examples to the reference page.

Design direction, content rules, and verified product facts live in `../docs/site-refresh/BRIEF.md`. Read it before changing copy or styles. Type is the system sans for headings and body, with monospace for IDs, paths, and commands. Fonts require no third-party requests. Styles are layered: `refresh.css` (tokens and shared components), `system.css` (`h-*` composition primitives on every page), optional `assets/site/pages/<page>.css`, and `reference.css` for the spec reference. Keep Markdown examples in `pre` elements so formatting preserves their line breaks.

The document examples offer Markdown preview, AFX Previewer, and Markdown source views. The AFX view is an explicitly labelled interactive illustration: buttons explain the command the extension would prepare or send, and supported task checkboxes demonstrate a local state change. The website never runs an agent, approves work, or changes repository files. The action set follows the extension’s document type; Dash currently uses the general renderer and has no dedicated document action bar. Product screenshots are existing captures and can be replaced independently. Livtra reference images are kept outside the published site in the parent project’s `docs/site-refresh/references/`.

## Validation

- `npm run check`: all eleven generated pages, local assets/links/fragments, heading counts, image alternatives, duplicate IDs, table tag balance, and ARIA targets.
- `npm test`: four preview-server tests covering root URLs, assets, restricted paths, and missing files.
- JavaScript syntax checked with `node --check`.
- Temporary DOM verification using the adjacent extension repository’s existing JSDOM: 105 assertions covering tab selection/keyboard controls, menus, illustrative actions, screenshot event wiring, and clipboard success/failure paths. No website dependency added.
- Live browser review: all seven canonical pages at 320, 900, and 1280 pixels; mobile homepage also inspected at 390 pixels. A narrow-screen overflow from long settings names was fixed and rechecked.
- Live interaction checks: mobile menu/Escape, install disclosure and copy feedback, tab keyboard navigation, demo review/task actions, native screenshot dialog/Escape with focus restored, and representative legacy routes including an automatically expanded provider recipe.
- Code-example line breaks checked in the rendered reference. No browser console errors observed in the final check.

Typography uses local font availability, so fallback rendering on other operating systems may differ. External sign-in and installation flows were not exercised. The browser clipboard bridge returned no text even though the copy control reported success; exact copied command text is covered by the DOM checks.

Future additions: verified “Built with AgenticFlowX” stories and a larger documentation section. No empty destinations are published for them.

## Embedded document examples

`assets/examples/` contains a complete illustrative Dash and snapshots of the extension Sprint and Room Dashboard files. `src/partials/document-examples.html` contains their pre-rendered HTML and full Markdown source; these are checked in so building the site requires no Markdown package. If changing the examples, regenerate the partial with a Markdown renderer that escapes HTML, retain the exact Markdown source, and verify the outputs and links. Snapshots describe their source at the time captured; do not present them as current product status.

The on-page AFX Previewer is a representation of the extension, not the actual VS Code webview. The reusable tours appear on the homepage, VS Code page, and spec reference; the six full documents on the Skills page have independent view switching. Workbench document and section actions are defined in `afx-vscode/apps/workbench/src/lib/document-studio.tsx` and checkbox behavior in `doc-preview.tsx`. Recheck those sources when changing the demonstration.
