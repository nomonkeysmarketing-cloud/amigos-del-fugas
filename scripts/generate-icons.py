"""
Generate PWA icons from FIFA World Cup 2026 logo (webp).
Outputs:
  app/icon.png            (64x64 — browser favicon)
  app/apple-icon.png      (180x180 — iOS home screen)
  public/icon-192.png     (192x192 — Android home screen small)
  public/icon-512.png     (512x512 — Android home screen large / splash)
  public/icon-maskable-512.png  (512x512 — Android adaptive, safe-zone padded)
"""
from PIL import Image
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "fifa-presenta-logo-mundial-2026.webp"

# Brand green sampled from the FIFA artwork (the mid-bright green panel)
FIFA_GREEN = (84, 196, 49)

def center_square(im: Image.Image) -> Image.Image:
    w, h = im.size
    size = min(w, h)
    left = (w - size) // 2
    top = (h - size) // 2
    return im.crop((left, top, left + size, top + size))

def main():
    im = Image.open(SRC).convert("RGB")
    print(f"Source: {im.size}")
    sq = center_square(im)
    print(f"Center-square: {sq.size}")

    targets = {
        ROOT / "app" / "icon.png":            64,
        ROOT / "app" / "apple-icon.png":      180,
        ROOT / "public" / "icon-192.png":     192,
        ROOT / "public" / "icon-512.png":     512,
    }
    for path, size in targets.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        resized = sq.resize((size, size), Image.LANCZOS)
        # Compresión adicional: cuantizar a 256 colores indexados (FIFA logo es flat color)
        # mantiene fidelidad visual pero baja el peso 50-70%.
        if size <= 256:
            quant = resized.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
            quant.save(path, "PNG", optimize=True, compress_level=9)
        else:
            resized.save(path, "PNG", optimize=True, compress_level=9)
        print(f"  wrote {path.relative_to(ROOT)} ({size}x{size}) — {path.stat().st_size // 1024}KB")

    # Maskable: shrink the logo to ~78% of canvas (safe zone) so Android crops won't
    # clip the trophy. Background = FIFA green so the crop blends naturally.
    canvas = Image.new("RGB", (512, 512), FIFA_GREEN)
    inner_size = 400  # 400/512 ≈ 78%
    inner = sq.resize((inner_size, inner_size), Image.LANCZOS)
    offset = (512 - inner_size) // 2
    canvas.paste(inner, (offset, offset))
    mp = ROOT / "public" / "icon-maskable-512.png"
    canvas.save(mp, "PNG", optimize=True)
    print(f"  wrote {mp.relative_to(ROOT)} (512x512 maskable, safe-zone padded)")

if __name__ == "__main__":
    main()
