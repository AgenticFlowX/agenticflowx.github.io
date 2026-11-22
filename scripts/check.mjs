import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const pages = [
  "index.html",
  "vscode.html",
  "workflow.html",
  "get-started.html",
  "models.html",
  "learn.html",
  "spec-reference.html",
  "docs.html",
  "examples.html",
  "help.html",
  "sdd-guide.html",
  "document-anatomy.html",
];
const errors = [];
let links = 0;
for (const page of pages) {
  const html = await readFile(path.join(root, page), "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${page}: duplicate element ID`);
  if ((html.match(/<h1\b/g) || []).length !== 1)
    errors.push(`${page}: expected exactly one main heading`);
  if (/\{\{[\w-]+\}\}/.test(html)) errors.push(`${page}: unresolved template`);
  for (const tag of ["td", "th", "tr"]) {
    const opens = (html.match(new RegExp(`<${tag}\\b`, "g")) || []).length;
    const closes = (html.match(new RegExp(`</${tag}>`, "g")) || []).length;
    if (opens !== closes) errors.push(`${page}: unbalanced ${tag} elements`);
  }
  for (const [, id] of html.matchAll(/\baria-(?:controls|labelledby)="([^"]+)"/g)) {
    for (const ref of id.split(" "))
      if (!ids.includes(ref)) errors.push(`${page}: missing ARIA target ${ref}`);
  }
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g))
    if (!/\balt="/.test(tag)) errors.push(`${page}: missing image alternative text`);
  const linkMarkup = html.replace(/<(?:pre|code)\b[^>]*>[\s\S]*?<\/(?:pre|code)>/g, "");
  for (const [, raw] of linkMarkup.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(raw)) continue;
    const [pathname, hash] = raw.split("#");
    const target = path.resolve(root, pathname || page);
    try {
      await stat(target);
      if (hash && target.endsWith(".html")) {
        const targetHtml = await readFile(target, "utf8");
        if (!targetHtml.includes(`id="${hash}"`) && !targetHtml.includes(`id='${hash}'`))
          errors.push(`${page}: missing fragment ${raw}`);
      }
      links++;
    } catch {
      errors.push(`${page}: missing local resource ${raw}`);
    }
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Checked ${pages.length} pages and ${links} local references; headings, image alternatives, IDs, and ARIA targets are valid.`,
  );
