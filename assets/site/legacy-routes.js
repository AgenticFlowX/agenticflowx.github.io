// Preserve links from older READMEs and search results after the guide reorganisation.
const page = location.pathname.split("/").pop();
const aliases = {
  "help.html": "get-started.html",
  "sdd-guide.html": "learn.html",
  "document-anatomy.html": "spec-reference.html",
};
const helpRoutes = {
  recipes: "models.html#recipes",
  "pi-users": "models.html#pi-users",
  "r-oauth": "models.html#r-oauth",
  "r-keys": "models.html#r-keys",
  "r-deepseek": "models.html#r-deepseek",
  "r-xiaomi": "models.html#r-xiaomi",
  "r-more": "models.html#r-more",
  "r-routers": "models.html#r-routers",
  "r-ollama": "models.html#r-ollama",
  "r-llamacpp": "models.html#r-llamacpp",
  packs: "workflow.html#packs",
  "claude-desktop": "workflow.html#claude-desktop",
  cli: "workflow.html#cli-tools",
};
if (aliases[page]) {
  const route = page === "help.html" && helpRoutes[location.hash.slice(1)];
  const destination = new URL(route || aliases[page] + location.hash, location.href);
  destination.search = location.search;
  location.replace(destination.href);
}

const overviewRoutes = {
  pains: "index.html#why",
  learn: "learn.html",
  chat: "vscode.html#chat",
  studio: "vscode.html#studio",
  trace: "vscode.html#trace",
  watch: "index.html#why",
  ecosystem: "index.html#credits",
  compare: "index.html#skills",
  anatomy: "vscode.html#viewer",
  headless: "index.html#skills",
  previewer: "index.html#vscode",
  workbench: "index.html#vscode",
  facts: "get-started.html#faq",
};
// The full documents moved from the Skills page to the Examples page.
if (page === "workflow.html" && /^(example-(dash|sprint|full)|doc-\d+-.+)$/.test(location.hash.slice(1))) {
  const destination = new URL("examples.html" + location.hash, location.href);
  destination.search = location.search;
  location.replace(destination.href);
}

if ((!page || page === "index.html") && overviewRoutes[location.hash.slice(1)]) {
  const destination = new URL(overviewRoutes[location.hash.slice(1)], location.href);
  destination.search = location.search;
  location.replace(destination.href);
}
