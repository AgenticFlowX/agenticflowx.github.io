import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".md": "text/plain",
};
const port = Number(process.env.PORT || 4173);
export async function serveRequest(req, res) {
  try {
    const url = new URL(req.url, "http://localhost");
    const filename = path.resolve(root, "." + decodeURIComponent(url.pathname));
    const insideRoot = filename === root || filename.startsWith(root + path.sep);
    if (!insideRoot || /\/(?:\.|src\/|scripts\/)/.test(url.pathname)) {
      res.writeHead(403).end();
      return;
    }
    const info = await stat(filename);
    const target = info.isDirectory() ? path.join(filename, "index.html") : filename;
    const body = await readFile(target);
    res.writeHead(200, {
      "Content-Type": types[path.extname(target)] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  http
    .createServer(serveRequest)
    .listen(port, "127.0.0.1", () => console.log(`Local: http://127.0.0.1:${port}`));
}
