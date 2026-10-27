#!/usr/bin/env python3
"""Regenerate the shipped scripts using esbuild; readable sources stay unchanged."""

import argparse
from pathlib import Path
import subprocess


ROOT = Path(__file__).resolve().parent


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--esbuild", default="esbuild", help="Path to the esbuild executable")
    args = parser.parse_args()
    for name in ("downloads", "theme"):
        result = subprocess.run(
            [
                args.esbuild, str(ROOT / f"{name}.js"), "--minify",
                "--target=es2020", "--charset=utf8", "--legal-comments=none",
                "--log-level=error",
            ],
            check=True, capture_output=True,
        )
        (ROOT / f"{name}.min.js").write_bytes(result.stdout)
        print(f"{name}.min.js: {len(result.stdout)} bytes")
