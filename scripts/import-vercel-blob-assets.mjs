import { list, put } from "@vercel/blob";

const sourceBaseUrl = "https://8791-i96pjtkiakuziz2ojec6h-e3e5b1d8.us2.manus.computer/";
const maximumAssetCount = 256;
const token = process.env.BLOB_READ_WRITE_TOKEN;

function decodeHref(href) {
  try {
    return decodeURIComponent(href);
  } catch {
    return href;
  }
}

async function collectRemoteFiles(relativeDirectory = "") {
  const directoryUrl = new URL(relativeDirectory, sourceBaseUrl);
  const response = await fetch(directoryUrl);
  if (!response.ok) throw new Error(`No se pudo leer el directorio remoto ${directoryUrl} (${response.status}).`);

  const markup = await response.text();
  const links = [...markup.matchAll(/<a href="([^"]+)">/g)].map((match) => match[1]);
  const files = [];

  for (const href of links) {
    if (href === "../" || href.startsWith("?")) continue;
    const decodedHref = decodeHref(href);
    const childPath = `${relativeDirectory}${decodedHref}`;
    if (href.endsWith("/")) {
      files.push(...(await collectRemoteFiles(childPath)));
    } else {
      files.push(childPath);
    }
  }
  return files;
}

async function listExistingBlobPaths() {
  const paths = new Set();
  let cursor;
  do {
    const page = await list({ token, cursor, limit: 1000 });
    page.blobs.forEach((blob) => paths.add(blob.pathname));
    cursor = page.cursor;
    if (!page.hasMore) break;
  } while (cursor);
  return paths;
}

if (!token || process.env.BLOB_IMPORT_ASSETS !== "1") {
  console.log("[blob-import] Importación temporal omitida; los activos ya residen en Vercel Blob.");
  process.exit(0);
}

const files = (await collectRemoteFiles()).sort((a, b) => a.localeCompare(b));
if (files.length === 0 || files.length > maximumAssetCount) {
  throw new Error(`[blob-import] Inventario remoto inesperado: ${files.length} activos.`);
}

const existingPaths = await listExistingBlobPaths();
let imported = 0;

for (const [index, filePath] of files.entries()) {
  if (existingPaths.has(filePath)) continue;

  const sourceUrl = new URL(encodeURI(filePath), sourceBaseUrl);
  const response = await fetch(sourceUrl);
  if (!response.ok || !response.body) {
    throw new Error(`[blob-import] No se pudo recuperar ${filePath} (${response.status}).`);
  }

  await put(filePath, response.body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 31_536_000,
    contentType: response.headers.get("content-type") ?? "application/octet-stream",
    multipart: Number(response.headers.get("content-length") ?? 0) >= 5 * 1024 * 1024,
    token,
  });
  imported += 1;
  console.log(`[blob-import] ${index + 1}/${files.length}: ${filePath}`);
}

console.log(`[blob-import] Completado: ${imported} importados; ${files.length - imported} ya existentes.`);
