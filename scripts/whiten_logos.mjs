/**
 * Convert logo images to white marks on transparent PNGs.
 * - Light backgrounds: knock out near-white via edge flood-fill + distance-from-white ink
 * - Dark backgrounds: knock out dark via edge flood-fill; keep light ink as white
 * - Oxford: knock out navy + light-blue padding; keep crest as white
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(__dirname, "..", "public", "media", "logos");
const backupDir = path.join(logosDir, "_backup");

const files = [
  "arthur-d-little-v2.png",
  "mckinsey-v2.png",
  "beroe-v2.png",
  "gems-our-own-v2.png",
  "credence-v2.png",
  "millennium-v2.png",
  "oxford-v2.png",
  "gems-v2.png",
];

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

function sampleCornerLum(data, w, h) {
  const pts = [
    [2, 2],
    [w - 3, 2],
    [2, h - 3],
    [w - 3, h - 3],
    [Math.floor(w / 2), 2],
    [Math.floor(w / 2), h - 3],
    [2, Math.floor(h / 2)],
    [w - 3, Math.floor(h / 2)],
  ];
  let sum = 0;
  let n = 0;
  for (const [x, y] of pts) {
    const i = (w * y + x) << 2;
    if (data[i + 3] < 20) continue;
    sum += luminance(data[i], data[i + 1], data[i + 2]);
    n++;
  }
  return n ? sum / n : 128;
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

function whitenLightBg(data, w, h) {
  // Aggressive near-white / light-gray knockout from edges (fixes white boxes).
  const bg = floodBackground(data, w, h, (r, g, b, a) => {
    if (a < 12) return true;
    const lum = luminance(r, g, b);
    const d = distFromWhite(r, g, b);
    // Near-white / light gray plate
    if (d < 55 || lum > 235) return true;
    // Soft light gray (former box edges)
    if (lum > 210 && d < 80) return true;
    return false;
  });

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
      // Colored or gray ink survives even when luminance is high (e.g. GEMS blue).
      const t = clamp01((d - 28) / 85);
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = Math.round(t * a);
    }
  }
  return "light-bg";
}

function whitenDarkBg(data, w, h) {
  const bg = floodBackground(data, w, h, (r, g, b, a) => {
    if (a < 12) return true;
    const lum = luminance(r, g, b);
    return lum < 105;
  });

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
      const lum = luminance(data[i], data[i + 1], data[i + 2]);
      const t = clamp01((lum - 90) / 70);
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = Math.round(t * a);
    }
  }
  return "dark-bg";
}

function whitenOxford(data, w, h) {
  // Navy + light-blue padding are background; crest/wordmark stays as white.
  const bg = floodBackground(data, w, h, (r, g, b, a) => {
    if (a < 12) return true;
    const lum = luminance(r, g, b);
    if (lum < 100) return true; // Oxford navy
    // Light blue / lavender padding (NOT neutral white crest)
    const blueBias = b - Math.max(r, g);
    if (lum > 165 && blueBias > 6) return true;
    if (lum > 200 && blueBias > 2) return true;
    return false;
  });

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
      const lum = luminance(data[i], data[i + 1], data[i + 2]);
      // Soften anti-aliased crest edges against former navy
      const t = clamp01((lum - 95) / 90);
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = Math.round(t * a);
    }
  }
  return "oxford";
}

function whitenRaw(data, w, h, name) {
  if (name === "oxford-v2.png") return whitenOxford(data, w, h);
  const corner = sampleCornerLum(data, w, h);
  if (corner < 110) return whitenDarkBg(data, w, h);
  return whitenLightBg(data, w, h);
}

function cornerRGBA(data, w, h) {
  const pts = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
  ];
  return pts.map(([x, y]) => {
    const i = (y * w + x) << 2;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  });
}

async function inspect(p) {
  const meta = await sharp(p).metadata();
  const { data, info } = await sharp(p)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return {
    hasAlpha: meta.hasAlpha,
    channels: meta.channels,
    width: info.width,
    height: info.height,
    corners: cornerRGBA(data, info.width, info.height),
    data,
    info,
  };
}

fs.mkdirSync(backupDir, { recursive: true });

const report = [];

for (const name of files) {
  const src = path.join(logosDir, name);
  if (!fs.existsSync(src)) {
    console.log("MISSING", name);
    continue;
  }

  const backup = path.join(backupDir, name);
  // Prefer pristine backup; for Oxford also allow oxford-original.png
  let inputPath = backup;
  if (!fs.existsSync(backup)) {
    fs.copyFileSync(src, backup);
    inputPath = backup;
  }
  if (name === "oxford-v2.png") {
    const original = path.join(logosDir, "oxford-original.png");
    if (fs.existsSync(original)) inputPath = original;
  }

  const before = await inspect(src);
  const beforeCorners = before.corners.map((c) => c.join(",")).join(" | ");
  const hadWhiteBox = before.corners.some(
    ([r, g, b, a]) => a > 200 && luminance(r, g, b) > 200
  );

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  const kind = whitenRaw(pixels, info.width, info.height, name);

  await sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(src);

  const after = await inspect(src);
  const afterCorners = after.corners.map((c) => c.join(",")).join(" | ");
  const stillWhiteBox = after.corners.some(
    ([r, g, b, a]) => a > 200 && luminance(r, g, b) > 200
  );

  const line = {
    name,
    kind,
    hadWhiteBox,
    stillWhiteBox,
    beforeHasAlpha: before.hasAlpha,
    afterHasAlpha: after.hasAlpha,
    beforeCorners,
    afterCorners,
    from: path.basename(inputPath),
  };
  report.push(line);

  console.log("\n===", name, "(" + kind + ", source=" + path.basename(inputPath) + ") ===");
  console.log("  BEFORE hasAlpha="+before.hasAlpha+" corners "+beforeCorners);
  console.log("  AFTER  hasAlpha="+after.hasAlpha+" corners "+afterCorners);
  console.log(
    "  whiteBox before="+hadWhiteBox+" after="+stillWhiteBox+" size="+fs.statSync(src).size
  );
}

console.log("\n--- SUMMARY ---");
for (const r of report) {
  console.log(
    r.name +
      ": whiteBox " +
      (r.hadWhiteBox ? "YES" : "no") +
      " -> " +
      (r.stillWhiteBox ? "STILL" : "cleared") +
      " | hasAlpha " +
      r.beforeHasAlpha +
      " -> " +
      r.afterHasAlpha
  );
}
