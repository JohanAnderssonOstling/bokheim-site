# bokheim-site

The public landing page for Bokheim, served at <https://bokheim.se>.

Static HTML with inline CSS and no build step. Open `index.html` in a browser
to preview it; what you see locally is what gets published.

## Layout

| Path | Purpose |
| --- | --- |
| `index.html` | The whole page — markup, styles and the OS-detection script |
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

The page does not host any binaries. Every download link points at the latest
release in [`bokheim-release`](https://github.com/JohanAnderssonOstling/bokheim-release):

- Linux — `releases/latest/download/Bokheim-x86_64.AppImage`
- Android — `releases/latest/download/bokheim-arm64.apk`

Both filenames are stable across versions, and both are produced by the release
workflows in the main `bokheim` repository. `releases/latest` skips draft
releases, so a release has to be published before these links resolve.
