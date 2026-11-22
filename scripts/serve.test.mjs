import assert from "node:assert/strict";
import test from "node:test";
import { serveRequest } from "./serve.mjs";

async function request(url) {
  const result = {};
  await serveRequest(
    { url },
    {
      writeHead(status, headers) {
        result.status = status;
        result.headers = headers;
        return this;
      },
      end(body) {
        result.body = body?.toString() ?? "";
      },
    },
  );
  return result;
}

test("homepage works at the directory root and explicit index URL", async () => {
  for (const url of ["/", "/?preview=1", "/index.html"]) {
    const response = await request(url);
    assert.equal(response.status, 200, url);
    assert.equal(response.headers["Content-Type"], "text/html");
    assert.match(response.body, /<title>AgenticFlowX/);
  }
});

test("product pages and stylesheet remain available", async () => {
  for (const url of ["/vscode.html", "/workflow.html", "/assets/site/refresh.css"]) {
    assert.equal((await request(url)).status, 200, url);
  }
});

test("private source and encoded directory escapes stay blocked", async () => {
  for (const url of [
    "/.git/config",
    "/src/layout.html",
    "/scripts/serve.mjs",
    "/%2e%2e%2fAGENTS.md",
    "/%2e%2e%2fafx-site-other/index.html",
  ]) {
    assert.equal((await request(url)).status, 403, url);
  }
});

test("missing files return not found", async () => {
  assert.equal((await request("/missing-page.html")).status, 404);
});
