"""Generate PNG and JPG thumbnails from SVG placeholders.
Usage: python tools/generate_thumbnails.py
Requires: cairosvg, Pillow
"""
import os
from pathlib import Path

try:
    import cairosvg
except Exception as e:
    print("cairosvg not available. Install with: pip install cairosvg")
    raise

try:
    from PIL import Image
except Exception as e:
    print("Pillow not available. Install with: pip install Pillow")
    raise

ROOT = Path(__file__).resolve().parents[1]
SVG_DIR = ROOT / 'assets' / 'Projects'
OUT_DIR = SVG_DIR / 'raster'
OUT_DIR.mkdir(exist_ok=True)

count = 0
for svg_path in sorted(SVG_DIR.glob('project*.svg')):
    name = svg_path.stem
    png_out = OUT_DIR / f"{name}.png"
    jpg_out = OUT_DIR / f"{name}.jpg"
    print(f"Rendering {svg_path.name} -> {png_out.name}")
    try:
        cairosvg.svg2png(url=str(svg_path), write_to=str(png_out), output_width=1200)
        # convert to JPG for broader compatibility
        with Image.open(png_out) as im:
            rgb = im.convert('RGB')
            rgb.save(jpg_out, quality=88)
        count += 1
    except Exception as e:
        print(f"Error converting {svg_path.name}: {e}")

print(f"Done. Generated {count} thumbnails in {OUT_DIR}")