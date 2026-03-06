#!/usr/bin/env python3
"""Combine slide images (PNG/JPG) into a single PDF file.

Scans output/slides/ for volume directories and merges all slide-*.png
images within each volume (and optionally across all volumes) into PDF.

Usage:
    # Combine all volumes into one PDF
    python scripts/combine_pdf.py

    # Combine a specific volume only
    python scripts/combine_pdf.py --vol 1

    # Combine all volumes, each into a separate PDF
    python scripts/combine_pdf.py --per-volume

    # Combine all volumes into one PDF AND per-volume PDFs
    python scripts/combine_pdf.py --per-volume --merged

    # Custom output path
    python scripts/combine_pdf.py -o output/proposal-all.pdf

    # Custom slides directory
    python scripts/combine_pdf.py -d output/slides

Dependencies:
    pip install Pillow
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print(
        "Error: Pillow is required. Install with: pip install Pillow",
        file=sys.stderr,
    )
    sys.exit(1)


def natural_sort_key(path: Path) -> list:
    """Sort key for natural ordering (slide-2 before slide-10)."""
    parts = re.split(r"(\d+)", path.stem)
    return [int(p) if p.isdigit() else p.lower() for p in parts]


def find_slide_images(vol_dir: Path) -> list[Path]:
    """Find slide images in a volume directory, sorted naturally."""
    patterns = ["slide-*.png", "slide-*.jpg", "slide-*.jpeg"]
    images: list[Path] = []
    for pattern in patterns:
        images.extend(vol_dir.glob(pattern))
    images.sort(key=natural_sort_key)
    return images


def find_volume_dirs(slides_dir: Path) -> list[Path]:
    """Find volume directories sorted by volume number."""
    vol_dirs = [
        d for d in slides_dir.iterdir()
        if d.is_dir() and re.match(r"vol\d+-", d.name)
    ]
    vol_dirs.sort(key=lambda d: int(re.search(r"vol(\d+)", d.name).group(1)))
    return vol_dirs


def images_to_pdf(image_paths: list[Path], output_path: Path) -> int:
    """Convert a list of image files to a single PDF. Returns page count."""
    if not image_paths:
        return 0

    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Convert all images to RGB (PDF doesn't support RGBA)
    pages: list[Image.Image] = []
    for img_path in image_paths:
        img = Image.open(img_path)
        if img.mode == "RGBA":
            # Composite on white background
            bg = Image.new("RGB", img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[3])
            pages.append(bg)
        elif img.mode != "RGB":
            pages.append(img.convert("RGB"))
        else:
            pages.append(img)

    # Save as PDF
    first_page = pages[0]
    if len(pages) > 1:
        first_page.save(
            output_path,
            "PDF",
            save_all=True,
            append_images=pages[1:],
            resolution=150,
        )
    else:
        first_page.save(output_path, "PDF", resolution=150)

    # Close images
    for page in pages:
        page.close()

    return len(pages)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Combine slide images into PDF files."
    )
    parser.add_argument(
        "-d", "--dir",
        default="output/slides",
        help="Slides directory (default: output/slides)",
    )
    parser.add_argument(
        "-o", "--output",
        help="Output PDF path (default: output/proposal-all.pdf)",
    )
    parser.add_argument(
        "--vol",
        type=int,
        help="Process only this volume number",
    )
    parser.add_argument(
        "--per-volume",
        action="store_true",
        help="Generate a separate PDF for each volume",
    )
    parser.add_argument(
        "--merged",
        action="store_true",
        help="Also generate a merged PDF when used with --per-volume",
    )
    parser.add_argument(
        "-q", "--quiet",
        action="store_true",
        help="Suppress progress output",
    )

    args = parser.parse_args()

    slides_dir = Path(args.dir)
    if not slides_dir.exists():
        print(f"Error: Slides directory not found: {slides_dir}", file=sys.stderr)
        return 1

    vol_dirs = find_volume_dirs(slides_dir)
    if not vol_dirs:
        print(f"Error: No volume directories found in {slides_dir}", file=sys.stderr)
        return 1

    # Filter to specific volume if requested
    if args.vol is not None:
        vol_dirs = [
            d for d in vol_dirs
            if int(re.search(r"vol(\d+)", d.name).group(1)) == args.vol
        ]
        if not vol_dirs:
            print(f"Error: Volume {args.vol} not found", file=sys.stderr)
            return 1

    generated_pdfs: list[tuple[str, Path, int]] = []

    # Per-volume PDFs
    if args.per_volume or args.vol is not None:
        for vol_dir in vol_dirs:
            images = find_slide_images(vol_dir)
            if not images:
                if not args.quiet:
                    print(f"  Skip: {vol_dir.name} (no slide images)")
                continue

            pdf_path = vol_dir / f"{vol_dir.name}.pdf"
            count = images_to_pdf(images, pdf_path)
            generated_pdfs.append((vol_dir.name, pdf_path, count))
            if not args.quiet:
                print(f"  {vol_dir.name}: {count} slides -> {pdf_path}")

    # Merged PDF (default behavior, or when --merged is specified with --per-volume)
    if not args.per_volume or args.merged:
        if args.vol is None:  # Don't merge when single volume is specified
            all_images: list[Path] = []
            for vol_dir in vol_dirs:
                all_images.extend(find_slide_images(vol_dir))

            if all_images:
                output_path = Path(args.output) if args.output else Path("output/proposal-all.pdf")
                count = images_to_pdf(all_images, output_path)
                generated_pdfs.append(("ALL", output_path, count))
                if not args.quiet:
                    print(f"  Merged: {count} slides -> {output_path}")
            else:
                print("Error: No slide images found across all volumes", file=sys.stderr)
                return 1

    if not generated_pdfs:
        print("Error: No PDFs generated (no slide images found)", file=sys.stderr)
        return 1

    if not args.quiet:
        print(f"\nDone: {len(generated_pdfs)} PDF(s) generated.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
