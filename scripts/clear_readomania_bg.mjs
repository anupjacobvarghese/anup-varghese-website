/**
 * Knock out near-white background from readomania-logo.png via edge flood-fill.
 * Keeps brand colors and enclosed white "YEARS" text inside the navy ribbon.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "public", "media", "readomania-logo.png");
const backup = path.join(
  __dirname,
  "..",
  "public",
  "media",
  "readomania-logo.before-clear.png"
);
const src = fs.existsSync(backup) ? backup : out;
if (!fs.existsSync(backup) && fs.existsSync(out)) {
  fs.copyFileSync(out, backup);
}

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function distFromWhite(r, g, b) {
  const dr = 255 - r;
  const dg = 255 - g;
  const db = 255 - b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/** Edge flood-fill: mark background pixels in `bg` (Uint8Array 0/1). */
function floodBackground(data, w, h, isBgSeed) {
  const bg = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const idx = y * w + x;
    if (bg[idx]) return;
    const i = idx << 2;
    if (!isBgSeed(data[i], data[i + 1], data[i + 2], data[i + 3])) return;
    bg[idx] = 1;
    stack.push(idx);
  };

  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }

  while (stack.length) {
    const idx = stack.pop();
    const x = idx % w;
    const y = (idx / w) | 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }
  return bg;
}

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = Buffer.from(data);
const { width: w, height: h } = info;

const bg = floodBackground(pixels, w, h, (r, g, b, a) => {
  if (a < 12) return true;
  const lum = luminance(r, g, b);
  const d = distFromWhite(r, g, b);
  // Near-white / light gray plate only
  if (d < 55 || lum > 235) return true;
  if (lum > 210 && d < 80) return true;
  return false;
});

let cleared = 0;
let enclosedWhite = 0;

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const idx = y * w + x;
    const i = idx << 2;
    if (bg[idx]) {
      pixels[i] = 0;
      pixels[i + 1] = 0;
      pixels[i + 2] = 0;
      pixels[i + 3] = 0;
      cleared++;
      continue;
    }
    // Enclosed near-white (YEARS): keep fully opaque white
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    if (a > 200 && distFromWhite(r, g, b) < 40 && luminance(r, g, b) > 220) {
      pixels[i] = 255;
      pixels[i + 1] = 255;
      pixels[i + 2] = 255;
      enclosedWhite++;
    }
  }
}

const tmp = out.replace(/\.png$/i, ".tmp.png");
await sharp(pixels, {
  raw: { width: w, height: h, channels: 4 },
})
  .png()
  .toFile(tmp);

try {
  fs.copyFileSync(tmp, out);
} catch {
  // Fallback if destination is locked: write adjacent then rename
  const alt = out.replace(/\.png$/i, ".transparent.png");
  fs.copyFileSync(tmp, alt);
  console.warn("Could not overwrite", out, "- wrote", alt);
}
fs.unlinkSync(tmp);

const inspectPath = fs.existsSync(out) ? out : out.replace(/\.png$/i, ".transparent.png");
const after = await sharp(inspectPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const corners = [
  [0, 0],
  [w - 1, 0],
  [0, h - 1],
  [w - 1, h - 1],
].map(([x, y]) => {
  const i = (y * w + x) << 2;
  return [after.data[i], after.data[i + 1], after.data[i + 2], after.data[i + 3]];
});

let opaqueWhite = 0;
for (let i = 0; i < after.data.length; i += 4) {
  const r = after.data[i];
  const g = after.data[i + 1];
  const b = after.data[i + 2];
  const a = after.data[i + 3];
  if (a > 200 && distFromWhite(r, g, b) < 30) opaqueWhite++;
}

const meta = await sharp(inspectPath).metadata();
console.log(
  JSON.stringify(
    {
      input: path.basename(src),
      output: path.basename(inspectPath),
      size: `${w}x${h}`,
      cleared,
      enclosedWhite,
      opaqueWhiteRemaining: opaqueWhite,
      corners,
      hasAlpha: meta.hasAlpha,
      fileSize: fs.statSync(inspectPath).size,
    },
    null,
    2
  )
);
