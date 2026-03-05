const ROUTE_PARAM = "route";
const LEGACY_ROUTE_PARAM = "page";
const FADE_DURATION_MS = 300;

function normalizeRoute(value, fallbackRoute) {
  if (!value) {
    return fallbackRoute;
  }

  const decoded = decodeURIComponent(value).trim().toLowerCase();
  const pathOnly = decoded.split(/[?#]/)[0];
  const trimmed = pathOnly.replace(/^\/+|\/+$/g, "");
  const safeRoute = trimmed.replace(/[^a-z0-9-]/g, "");

  return safeRoute || fallbackRoute;
}

function routeFromLocation(fallbackRoute) {
  const params = new URLSearchParams(window.location.search);
  const queryRoute = params.get(ROUTE_PARAM) || params.get(LEGACY_ROUTE_PARAM);

  if (queryRoute) {
    return normalizeRoute(queryRoute, fallbackRoute);
  }

  return normalizeRoute(window.location.pathname, fallbackRoute);
}

class SiteRouter {
  constructor(options) {
    this.main = document.querySelector(options.mainSelector || "main");
    this.routes = options.routes || [];
    this.defaultRoute = options.defaultRoute || "home";
    this.onRouteChange = options.onRouteChange || (() => {});
  }

  init() {
    if (!this.main) {
      return;
    }

    window.addEventListener("popstate", () => {
      const target = routeFromLocation(this.defaultRoute);
      this.loadRoute(target, { updateHistory: false });
    });

    const initialTarget = routeFromLocation(this.defaultRoute);
    this.loadRoute(initialTarget, { updateHistory: true, replaceState: true });
  }

  navigate(route) {
    const target = normalizeRoute(route, this.defaultRoute);
    this.loadRoute(target, { updateHistory: true });
  }

  async loadRoute(route, options = {}) {
    const updateHistory = options.updateHistory || false;
    const replaceState = options.replaceState || false;
    const target = this.routes.includes(route) ? route : null;

    if (!target) {
      this.loadRoute(this.defaultRoute, { updateHistory: true, replaceState: true });
      return;
    }

    if (updateHistory) {
      this.updateUrl(target, replaceState);
    }

    this.main.style.opacity = "0";
    // Let the CSS transition complete so fade-out is visible before replacing content.
    await new Promise((resolve) => {
      window.setTimeout(resolve, FADE_DURATION_MS);
    });

    try {
      const response = await fetch(`/html/${target}.html`);
      if (!response.ok) {
        throw new Error(`Unable to load page: ${target}`);
      }

      const html = await response.text();
      this.main.innerHTML = "";
      this.main.appendChild(document.createRange().createContextualFragment(html));
      this.onRouteChange(target);
    } catch (error) {
      this.renderNotFound(target);
      this.onRouteChange(null);
    } finally {
      requestAnimationFrame(() => {
        this.main.style.opacity = "1";
      });
    }
  }

  updateUrl(route, replaceState) {
    const path = route === this.defaultRoute ? "/" : `/${route}`;

    if (replaceState) {
      window.history.replaceState({ route }, "", path);
      return;
    }

    if (window.location.pathname !== path) {
      window.history.pushState({ route }, "", path);
    }
  }

  renderNotFound(route) {
    const safeRoute = route || "unknown";
    this.main.innerHTML = `
      <section class="container container-small text-center p-2">
        <h1>Page not found</h1>
        <p class="mt-1">No content available for <code>/${safeRoute}</code>.</p>
      </section>
    `;
  }
}

export function createRouter(options) {
  const router = new SiteRouter(options);
  router.init();
  return router;
}
