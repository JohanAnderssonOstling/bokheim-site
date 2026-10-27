location.replace("/" + (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") + location.pathname + location.search + location.hash);
