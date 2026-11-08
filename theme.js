// Automatic themes stay on the current URL. Explicit theme pages retain their
// selection, including when the system preference changes.
const preference = matchMedia("(prefers-color-scheme: dark)");
const selectedTheme = () => document.documentElement.dataset.theme === "auto"
  ? (preference.matches ? "dark" : "light")
  : document.documentElement.dataset.theme;

const visibleVideos = new Set();
const videoSources = new Map([...document.querySelectorAll("video[data-poster-srcset]")]
  .map(video => [video, video.getAttribute("src")]));

function updatePoster(video) {
  const srcset = selectedTheme() === "dark"
    ? video.dataset.darkPosterSrcset
    : video.dataset.posterSrcset;
  const candidates = srcset.split(",").map(item => {
    const [url, width] = item.trim().split(/\s+/);
    return { url, width: parseInt(width, 10) };
  });
  const width = video.clientWidth * devicePixelRatio;
  const candidate = candidates.find(candidate => candidate.width >= width) || candidates.at(-1);
  if (video.getAttribute("poster") !== candidate.url) video.poster = candidate.url;
}

function updateTheme() {
  const theme = selectedTheme();
  document.querySelectorAll(".theme-control a").forEach(link => {
    if (link.textContent.trim().toLowerCase() === theme) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (document.documentElement.dataset.theme === "auto") {
    document.querySelectorAll(".narration-voices a").forEach(link => {
      link.href = link.getAttribute("href").replace(/^\/(light|dark)\//, `/${theme}/`);
    });
    videoSources.forEach((source, video) => {
      const url = theme === "dark" ? source.replace("/screenshots/", "/screenshots/dark/") : source;
      if (video.getAttribute("src") !== url) video.src = url;
    });
  }
  visibleVideos.forEach(updatePoster);
}

updateTheme();
preference.addEventListener("change", updateTheme);

const resize = new ResizeObserver(entries => {
  entries.forEach(({ target }) => {
    if (visibleVideos.has(target)) updatePoster(target);
  });
});

const nearby = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    visibleVideos.add(target);
    updatePoster(target);
    nearby.unobserve(target);
  });
}, { rootMargin: "600px" });

document.querySelectorAll("video[data-poster-srcset]").forEach(video => {
  resize.observe(video);
  nearby.observe(video);
});
