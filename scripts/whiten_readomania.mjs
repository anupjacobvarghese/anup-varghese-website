/**
 * Whiten Readomania logo like affiliations (McKinsey/Beroe): white mark on
 * transparent PNG. Source is the white-bg original (before-clear backup).
 * Enclosed white "YEARS" becomes a cutout (alpha 0) so it stays legible as
 * dark holes in the whitened ribbon on black page backgrounds.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mediaDir = path.join(__dirname, "..", "public", "media");
const backup = path.join(mediaDir, "readomania-logo.before-clear.png");
const current = path.join(mediaDir, "readomania-logo.png");
const out = path.join(mediaDir, "readomania-logo-v2.png");

const src = fs.existsSync(backup) ? backup : current;
if (!fs.existsSync(src)) {
  console.error("Missing source:", src);
  process.exit(1);
}

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function clamp01(t) {
  return Math.max(0, Math.min(1, t));
}

function distFromWhite(r, g, b) {
  const dr = 255 - r;
  const dg = 255 - g;
  const db = 255 - b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function floodBackground(data, w, h, isBgSeed) {
  const bg = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const idx = y * w + x;
    if (bg[idx]) return;
    const i = idx << 2;
    if (!isBgSeed(data[i], data[i + 1], data[i + 2], data[i + 3], x, y)) return;
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

/** Same algorithm as whiten_logos.mjs whitenLightBg */
function whitenLightBg(data, w, h) {
  const bg = floodBackground(data, w, h, (r, g, b, a) => {
    if (a < 12) return true;
    const lum = luminance(r, g, b);
    const d = distFromWhite(r, g, b);
    if (d < 55 || lum > 235) return true;
    if (lum > 210 && d < 80) return true;
    return false;
  });

  let ink = 0;
  let cutouts = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const i = idx << 2;
      if (bg[idx]) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = 0;
        continue;
      }
      const a = data[i + 3];
      const d = distFromWhite(data[i], data[i + 1], data[i + 2]);
      const t = clamp01((d - 28) / 85);
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = Math.round(t * a);
      if (data[i + 3] > 20) ink++;
      else cutouts++;
    }
  }
  return { ink, cutouts };
}

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = Buffer.from(data);
const { width: w, height: h } = info;
const stats = whitenLightBg(pixels, w, h);

await sharp(pixels, {
  raw: { width: w, height: h, channels: 4 },
})
  .png()
  .toFile(out);

// Composite on black for visual QA check
const check = path.join(mediaDir, "readomania-logo-v2-on-black-check.png");
const black = await sharp({
  create: {
    width: w,
    height: h,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 1 },
  },
})
  .png()
  .toBuffer();
await sharp(black)
  .composite([{ input: out, blend: "over" }])
  .png()
  .toFile(check);

const after = await sharp(out)
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
  return [
    after.data[i],
    after.data[i + 1],
    after.data[i + 2],
    after.data[i + 3],
  ];
});
const stillWhiteBox = corners.some(
  ([r, g, b, a]) => a > 200 && luminance(r, g, b) > 200
);
const meta = await sharp(out).metadata();

console.log(
  JSON.stringify(
    {
      source: path.basename(src),
      output: path.basename(out),
      check: path.basename(check),
      size: `${w}x${h}`,
      cutouts: stats.cutouts,
      inkPixels: stats.ink,
      corners,
      stillWhiteBox,
      hasAlpha: meta.hasAlpha,
      fileSize: fs.statSync(out).size,
    },
    null,
    2
  )
);
