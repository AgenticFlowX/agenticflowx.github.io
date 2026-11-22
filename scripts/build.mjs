import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (name) => readFile(path.join(root, name), "utf8");
const layout = await read("src/layout.html");
const example = await read("src/partials/spec-example.html");
const documentExamples = await read("src/partials/document-examples.html");
const paperDocs = await read("src/partials/paper-docs.html");
const providerLogos = await read("src/partials/provider-logos.html");
const pages = [
  {
    name: "index",
    title: "AgenticFlowX — Write the spec. Ship the code. Keep them linked.",
    description:
      "Spec-driven development for coding agents: requirements, design, and decisions in plain Markdown, linked to code by stable IDs. In VS Code or in Claude Code, Codex, and Copilot.",
    nav: "home",
  },
  {
    name: "vscode",
    title: "AgenticFlowX for VS Code — From a conversation to a considered feature",
    description:
      "Explore the AFX Markdown Previewer, SDD Studio, Pipeline, and coding workflow inside VS Code.",
    nav: "vscode",
  },
  {
    name: "workflow",
    title: "AgenticFlowX Skills — A shared plan for you and your agents",
    description:
      "Use AFX spec-driven workflows with Codex, Claude Code, and GitHub Copilot. Start small with Dash, Sprint, or the full workflow.",
    nav: "workflow",
  },
  {
    name: "get-started",
    title: "Get started — AgenticFlowX",
    description:
      "Install AgenticFlowX, connect a model, and make your first change. Setup, skills, trust, settings, and troubleshooting.",
    nav: "start",
  },
  {
    name: "models",
    title: "Pi Coding Harness & Models — AgenticFlowX",
    description:
      "AgenticFlowX runs on Pi. Use the bundled SDK or your Pi CLI with subscription sign-ins, API providers, and local models.",
    nav: "models",
  },
  {
    name: "learn",
    title: "Learn spec-driven development — AgenticFlowX",
    description:
      "A practical guide to Dash, Sprint, and full specifications. Plan a feature, review the work, and keep its intent connected to code.",
    nav: "learn",
  },
  {
    name: "docs",
    title: "Documentation — AgenticFlowX",
    description:
      "Explore AgenticFlowX templates, validation, research, decisions, and real project examples.",
    nav: "docs",
  },
  {
    name: "examples",
    title: "Examples — AgenticFlowX",
    description:
      "Complete AgenticFlowX documents: a Dash, a Sprint, and a full spec, design, tasks, and journal from real projects.",
    nav: "docs",
  },
  {
    name: "spec-reference",
    title: "Spec reference — AgenticFlowX",
    description:
      "The AgenticFlowX Markdown reference: requirements, design anchors, tasks, work sessions, traceability, and worked examples.",
    nav: "learn",
  },
];
for (const page of pages) {
  let content = (await read(`src/pages/${page.name}.html`))
    .replaceAll("{{spec-example}}", example)
    .replaceAll("{{document-examples}}", documentExamples)
    .replaceAll("{{paper-docs}}", paperDocs)
    .replaceAll("{{provider-logos}}", providerLogos);
  let html = layout.replace("{{content}}", content);
  const values = {
    ...page,
    "reference-styles": [
      '<link rel="stylesheet" href="assets/site/system.css" />',
      page.name === "spec-reference" ? '<link rel="stylesheet" href="assets/site/reference.css" />' : "",
      existsSync(path.join(root, `assets/site/pages/${page.name}.css`))
        ? `<link rel="stylesheet" href="assets/site/pages/${page.name}.css" />`
        : "",
    ]
      .filter(Boolean)
      .join("\n    "),
    canonical: `https://agenticflowx.github.io/${page.name === "index" ? "" : page.name + ".html"}`,
  };
  for (const [key, value] of Object.entries(values)) html = html.replaceAll(`{{${key}}}`, value);
  for (const name of ["home", "vscode", "workflow", "learn", "docs", "models", "start"])
    html = html.replaceAll(`{{active-${name}}}`, name === page.nav ? ' aria-current="page"' : "");
  if (/\{\{[\w-]+\}\}/.test(html)) throw new Error(`Unresolved template in ${page.name}`);
  await writeFile(path.join(root, `${page.name}.html`), html.replace(/^[ \t]+$/gm, ""));
  console.log(`Built ${page.name}.html`);
}
// Keep existing external links and their section anchors working.
for (const [oldName, newName] of Object.entries({
  help: "get-started",
  "sdd-guide": "learn",
  "document-anatomy": "spec-reference",
})) {
  const html = await read(`${newName}.html`);
  await writeFile(path.join(root, `${oldName}.html`), html);
  console.log(`Built ${oldName}.html (alias of ${newName}.html)`);
}
