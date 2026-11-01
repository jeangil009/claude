"""
Contact sheet: un cuadro por beat del video, con marca de tiempo, en una sola imagen.

Uso:
    python tools/contact_sheet.py VIDEO.mp4 SALIDA.png [t1 t2 t3 ...]

Si no se dan tiempos, usa los beats de shotlist.md (líneas con formato "00.0-02.0s").
Requiere ffmpeg en el PATH y Pillow (ya viene con Manim).
"""

import re
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent.parent


def beats_from_shotlist() -> list[float]:
    """Punto medio de cada beat declarado en shotlist.md."""
    times = []
    for line in (HERE / "shotlist.md").read_text(encoding="utf-8").splitlines():
        m = re.match(r"\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)s\b", line)
        if m:
            a, b = float(m.group(1)), float(m.group(2))
            times.append(round(b - 0.4 if b - a > 1 else (a + b) / 2, 2))
    return times


def grab(video: str, t: float, out: Path) -> None:
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-ss", str(t), "-i", video, "-frames:v", "1", str(out)],
        check=True,
    )


def main() -> None:
    video, out = sys.argv[1], sys.argv[2]
    times = [float(x) for x in sys.argv[3:]] or beats_from_shotlist()
    if not times:
        sys.exit("Sin tiempos: pásalos como argumentos o define beats en shotlist.md")

    cols = 3
    tile_w = 560
    with tempfile.TemporaryDirectory() as tmp:
        tiles = []
        for i, t in enumerate(times):
            f = Path(tmp) / f"f{i:02d}.png"
            grab(video, t, f)
            img = Image.open(f).convert("RGB")
            img = img.resize((tile_w, int(img.height * tile_w / img.width)))
            draw = ImageDraw.Draw(img)
            draw.rectangle([0, 0, 92, 24], fill=(0, 0, 0))
            draw.text((6, 5), f"{t:05.2f} s", fill=(255, 255, 255), font=ImageFont.load_default())
            tiles.append(img)

    rows = -(-len(tiles) // cols)
    gap = 6
    w = cols * tile_w + (cols + 1) * gap
    h = rows * tiles[0].height + (rows + 1) * gap
    sheet = Image.new("RGB", (w, h), (30, 30, 30))
    for i, tile in enumerate(tiles):
        r, c = divmod(i, cols)
        sheet.paste(tile, (gap + c * (tile_w + gap), gap + r * (tile.height + gap)))
    sheet.save(out)
    print(f"{out}: {len(tiles)} cuadros en tiempos {times}")


if __name__ == "__main__":
    main()
