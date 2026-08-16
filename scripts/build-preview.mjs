import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.resolve(projectRoot, "..", "JARVIS-TradeAnalyzer-preview.html");
const [html, css, js] = await Promise.all([
  readFile(path.join(projectRoot, "public/index.html"), "utf8"),
  readFile(path.join(projectRoot, "public/styles.css"), "utf8"),
  readFile(path.join(projectRoot, "public/app.js"), "utf8"),
]);

const previewCss = `
.preview-ribbon{position:fixed;z-index:200;left:50%;bottom:18px;transform:translateX(-50%);padding:7px 10px;border:1px solid #34343c;border-radius:2px;background:#101014;color:#3ee6c4;font:600 8px var(--mono);letter-spacing:.04em;white-space:nowrap}
@media(max-width:720px){.preview-ribbon{bottom:calc(var(--mobile-nav) + env(safe-area-inset-bottom) + 10px);max-width:calc(100vw - 24px);overflow:hidden;text-overflow:ellipsis}}
`;
const ribbon = `<div class="preview-ribbon">[ static_ui_preview ] live research requires server</div>`;
const bundled = html
  .replace('<link rel="stylesheet" href="/styles.css" />', `<style>${css}\n${previewCss}</style>`)
  .replace('<script src="/app.js" type="module"></script>', `<script type="module">${js.replaceAll("</script", "<\\/script")}</script>`)
  .replace("<body>", `<body>${ribbon}`);

await writeFile(outputPath, bundled, "utf8");
process.stdout.write(`${outputPath}\n`);
