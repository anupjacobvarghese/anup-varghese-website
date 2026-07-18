"""Convert logo PNGs to white marks on transparent backgrounds."""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

LOGOS_DIR = Path(__file__).resolve().parents[1] / "public" / "media" / "logos"
BACKUP_DIR = LOGOS_DIR / "_backup"

FILES = [
    "arthur-d-little.png",
    "mckinsey.png",
    "beroe.png",
    "gems-our-own.png",
    "credence.png",
    "millennium.png",
    "oxford.png",
    "gems.png",
]


def sample_corner_luminance(img: Image.Image) -> float:
    w, h = img.size
    pts = [
        (2, 2),
        (w - 3, 2),
        (2, h - 3),
        (w - 3, h - 3),
        (w // 2, 2),
        (w // 2, h - 3),
    ]
    vals = []
    for x, y in pts:
        r, g, b, a = img.getpixel((x, y))
        if a < 20:
            continue
        vals.append(0.2126 * r + 0.7152 * g + 0.0722 * b)
    return sum(vals) / len(vals) if vals else 128.0


def whiten_logo(src: Path, dst: Path) -> str:
    img = Image.open(src).convert("RGBA")
    corner_lum = sample_corner_luminance(img)
    dark_bg = corner_lum < 110

    pixels = list(img.getdata())
    out = []
    soft = 55.0

    for r, g, b, a in pixels:
        if a < 8:
            out.append((255, 255, 255, 0))
            continue

        lum = 0.2126 * r + 0.7152 * g + 0.0722 * b

        if dark_bg:
            # Keep light marks; knock out dark navy/black bg
            t = (lum - 95.0) / soft
        else:
            # Keep dark ink as white; knock out light/white bg
            t = (175.0 - lum) / soft

        t = max(0.0, min(1.0, t))
        alpha = int(round(t * a))
        out.append((255, 255, 255, alpha))

    result = Image.new("RGBA", img.size)
    result.putdata(out)
    result.save(dst, "PNG", optimize=True)
    return "dark-bg" if dark_bg else "light-bg"


def main() -> None:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    for name in FILES:
        src = LOGOS_DIR / name
        if not src.exists():
            print(f"MISSING {name}")
            continue
        backup = BACKUP_DIR / name
        if not backup.exists():
            shutil.copy2(src, backup)
        kind = whiten_logo(src, src)
        size = src.stat().st_size
        print(f"OK {name} ({kind}) -> {size} bytes")


if __name__ == "__main__":
    main()
