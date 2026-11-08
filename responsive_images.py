"""Build responsive screenshot assets with Pillow and update their HTML references."""

import hashlib
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import re

from PIL import Image


ROOT = Path(__file__).resolve().parent
WIDTHS = (240, 480, 640, 960, 1280)
FULL_WIDTH = "(max-width: 1168px) calc(100vw - 80px), 1088px"
SIZES = {
    "sync-computer": "(max-width: 672px) calc(100vw - 100px), (max-width: 1168px) calc(75.5vw - 123px), 760px",
    "sync-phone": "(max-width: 672px) calc(32.4vw - 21px), (max-width: 1168px) calc(24.5vw - 29px), 260px",
    "books-desktop": "(max-width: 672px) calc(100vw - 100px), (max-width: 1168px) calc(53.2vw - 111px), 511px",
    "books-ereader": "(max-width: 672px) calc(53vw - 53px), (max-width: 1168px) calc(28.2vw - 58px), 271px",
    "phone": "(max-width: 672px) calc(35.2vw - 23px), (max-width: 1168px) calc(18.7vw - 28px), 192px",
    "annotations-prince": "(max-width: 640px) calc(100vw - 80px), (max-width: 1168px) calc(48.5vw - 40px), 523px",
}


class Attributes(HTMLParser):
    def handle_starttag(self, tag, attrs):
        self.attrs = dict(attrs)


def attributes(tag):
    parser = Attributes()
    parser.feed(tag)
    return parser.attrs


def set_attributes(tag, values):
    for name, value in values.items():
        tag = re.sub(rf'\s{re.escape(name)}="[^"]*"', "", tag)
        if value is not None:
            tag = tag[:-1] + f' {name}="{escape(value, quote=True)}">'
    return tag


def candidates(url):
    source = ROOT / url.lstrip("/")
    if source.suffix != ".webp":
        return url
    digest = hashlib.sha256(source.read_bytes()).hexdigest()[:8]
    with Image.open(source) as image:
        items = []
        for width in WIDTHS:
            if width >= image.width:
                break
            target = source.parent / "responsive" / f"{source.stem}-{digest}-{width}.webp"
            if not target.exists():
                target.parent.mkdir(exist_ok=True)
                height = round(image.height * width / image.width)
                image.resize((width, height), Image.Resampling.LANCZOS).save(target, quality=84, method=6)
            items.append(f"/{target.relative_to(ROOT)} {width}w")
        items.append(f"{url} {image.width}w")
    return ", ".join(items)


def responsive_page(source):
    # Rebuilding is idempotent; the full-size originals remain the inputs.
    source = re.sub(r'<source data-theme-source="dark"[^>]*>', "", source)

    def image(match):
        tag = match[0]
        url = attributes(tag).get("src", "")
        if not url.startswith("/screenshots/") or not url.endswith(".webp"):
            return tag
        name = Path(url).stem
        sizes = next((value for prefix, value in SIZES.items() if name.startswith(prefix)), FULL_WIDTH)
        return set_attributes(tag, {"srcset": candidates(url), "sizes": sizes})

    source = re.sub(r'<img\b[^>]*>', image, source)

    def picture(match):
        tag = match[0]
        img = re.search(r'<img\b[^>]*>', tag)
        attrs = attributes(img[0])
        url = attrs.get("src", "")
        if url == "/icon/bokheim.svg":
            dark = "/screenshots/dark/bokheim.svg?v=2"
        elif url.startswith("/screenshots/"):
            dark = candidates(url.replace("/screenshots/", "/screenshots/dark/", 1))
        else:
            return tag
        sizes = f' sizes="{escape(attrs["sizes"], quote=True)}"' if "sizes" in attrs else ""
        media = f'<source data-theme-source="dark" media="(prefers-color-scheme: dark)" srcset="{dark}"{sizes}>'
        return tag[:img.start()] + media + tag[img.start():]

    source = re.sub(r'<picture\b[^>]*>.*?</picture>', picture, source, flags=re.S)

    def video(match):
        tag = match[0]
        attrs = attributes(tag)
        url = attrs.get("data-poster", attrs.get("poster", ""))
        if not url:
            return tag
        dark = url.replace("/screenshots/", "/screenshots/dark/", 1)
        return set_attributes(tag, {
            "poster": None,
            "data-poster": url,
            "data-poster-srcset": candidates(url),
            "data-dark-poster-srcset": candidates(dark),
        })

    return re.sub(r'<video\b[^>]*>', video, source)
