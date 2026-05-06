const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const downloadConfig = window.ATLAS_DOWNLOAD;

if (downloadConfig?.href) {
  document.querySelectorAll("[data-download-link]").forEach((link) => {
    link.href = downloadConfig.href;
    link.setAttribute("download", downloadConfig.fileName ?? "");
  });

  document.querySelectorAll("[data-download-name]").forEach((item) => {
    item.textContent = downloadConfig.fileName ?? "Arquivo de instalação";
  });

  document.querySelectorAll("[data-download-meta]").forEach((item) => {
    const sizeLabel = downloadConfig.sizeLabel ? ` • ${downloadConfig.sizeLabel}` : "";
    const updatedLabel = downloadConfig.updatedLabel ? ` • Atualizado em ${downloadConfig.updatedLabel}` : "";
    item.textContent = `Windows${sizeLabel}${updatedLabel}`;
  });
}

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

const animatedItems = document.querySelectorAll("[data-animate]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.16 }
  );

  animatedItems.forEach((item) => revealObserver.observe(item));
} else {
  animatedItems.forEach((item) => item.classList.add("is-visible"));
}
