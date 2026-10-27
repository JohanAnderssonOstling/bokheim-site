(() => {
  const platform = navigator.userAgentData?.platform || navigator.platform || "";
  const userAgent = navigator.userAgent || "";
  let os;

  // iPads can identify as Macs; Android can identify as Linux.
  if (!/iPad|iPhone|iPod|Windows Phone|IEMobile/i.test(userAgent) &&
      !(/Mac/i.test(platform) && navigator.maxTouchPoints > 1)) {
    if (/Android/i.test(`${platform} ${userAgent}`)) os = "android";
    else if (!navigator.userAgentData?.mobile && !/Mobi|Tablet|Kindle|Silk|Kobo|CrOS/i.test(userAgent)) {
      if (/Linux/i.test(platform)) os = "linux";
      else if (/Win/i.test(platform)) os = "windows";
      else if (/Mac/i.test(platform)) os = "macos";
    }
  }

  const download = document.querySelector(`.download-split [data-os="${os}"]`);
  if (download) {
    document.querySelector("#primary-download").href = download.href;
    document.querySelector("#download-label").textContent = `Download for ${os === "windows" ? "Windows" : download.textContent}`;
  }

  // Without JavaScript, the native menu still offers both Kobo installers.
  document.querySelector("#kobo-install").hidden = true;
  const installer = document.querySelector(`#kobo-install [data-os="${os}"]`);
  if (installer && !(os === "linux" && /arm|aarch/i.test(`${navigator.platform} ${userAgent}`))) {
    const kobo = document.querySelector("#kobo-download");
    kobo.href = installer.href;
    kobo.hidden = false;
  }
})();
