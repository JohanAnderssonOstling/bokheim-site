# bokheim-site

The public landing page for Bokheim, served at <https://bokheim.se>.

Static HTML with inline CSS and no build step. Open `index.html` in a browser
to preview it; what you see locally is what gets published.

## Layout

| Path | Purpose |
| --- | --- |
| `index.html` | The Bokheim page — markup, styles and the OS-detection script |
| `rusttrados/index.html` | RustTrados Windows download page at `/rusttrados/` |
| `icon/` | Favicon, Apple touch icon and the SVG mark used in the hero |
| `CNAME` | Custom domain for GitHub Pages |
| `robots.txt` | Crawler policy |
| `.nojekyll` | Serves files verbatim instead of running them through Jekyll |

## Deployment

GitHub Pages serves this repository's default branch from the root, so pushing
to `main` publishes the site. Configure it under **Settings → Pages**: set the
source to *Deploy from a branch*, branch `main`, folder `/ (root)`, and set the
custom domain to `bokheim.se`.

DNS for the apex domain needs four A records pointing at GitHub Pages —
`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` —
and a `CNAME` record for `www` pointing at `johananderssonostling.github.io`.

## Downloads

The site does not host any binaries. Bokheim download links point at the latest
release in [`bokheim-release`](https://github.com/JohanAnderssonOstling/bokheim-release):

- Linux — `releases/latest/download/Bokheim-x86_64.AppImage`
- Windows — `releases/latest/download/Bokheim-Windows-x86_64-Setup.exe`
- Android — `releases/latest/download/Bokheim-Android-arm64.apk`
- macOS (Apple Silicon and Intel, macOS 13+) — `releases/latest/download/Bokheim-macOS-universal.dmg`

These filenames are stable across versions and are produced by the release
workflows in the `bokheim-release` repository. `releases/latest` skips draft
releases, so a release has to be published before these links resolve.

The macOS workflow produces a universal disk image with an ad-hoc signed app.
It is not notarized by Apple. The page detects macOS and explains the initial
Privacy & Security → Open Anyway approval. iPads that identify as MacIntel keep
the browser/release-page option instead of receiving a macOS download.

Publish the first macOS release asset before deploying these website changes;
the stable macOS link does not resolve until that asset exists in the latest release.


## RustTrados download page

`https://bokheim.se/rusttrados/` is a standalone page with a Windows download button.
It uses the same colours and typography as the Bokheim page.

The button points to:

<https://github.com/JohanAnderssonOstling/rusttrados-release/releases/latest/download/rusttrados-windows-x86_64.zip>

The Windows release workflow in RustTrados builds the main executable and its
ProZ browser helper. A version tag matching `v*`, such as `v0.1.0`, publishes
the ZIP and its SHA-256 checksum as release assets in the private source repository.
Branch pushes, pull requests and manual builds upload Actions artifacts.

Public downloads are hosted separately in
[`rusttrados-release`](https://github.com/JohanAnderssonOstling/rusttrados-release),
so visitors can download without access to the application source. Publish the
verified Windows ZIP and checksum to a published release in that public repository
to update the website download.

Before publishing the page, confirm the release repository is publicly accessible,
publish the first Windows release, and test the ZIP download without signing in.
Extract the ZIP and keep both executables in the same folder.
