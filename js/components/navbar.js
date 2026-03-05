// === Navigation Bar ===
class NavBar extends HTMLElement {
  constructor() {
    super();
    this.pages = ["home", "contact"]; // === ADD PAGES HERE ===
  }

  connectedCallback() {
    this.menuButton = this.querySelector(".menu-button");
    this.linksContainer = this.querySelector(".links-container");

    this.menuButton.addEventListener("click", () => {
      this.toggleMenu();
    });

    const mainSection = document.querySelector("main");
    if (mainSection) {
      mainSection.addEventListener("click", () => {
        this.closeMenu();
      });
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        this.closeMenu();
      }
    });

    this.linksContainer.innerHTML = "";
    this.pages.forEach((page) => {
      const link = document.createElement("a");
      link.innerHTML = page;
      link.href = page === "home" ? "/" : `/${page}`;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        this.requestNavigation(page);
      });
      this.linksContainer.appendChild(link);
    });
  }

  setActiveRoute(route) {
    const links = this.querySelectorAll("a");
    links.forEach((link) => {
      if (link.innerHTML === route) {
        link.classList.add("selected");
      } else {
        link.classList.remove("selected");
      }
    });
  }

  requestNavigation(route) {
    this.closeMenu();
    document.dispatchEvent(
      new CustomEvent("site:navigate", {
        detail: { route },
      })
    );
  }

  getPages() {
    return [...this.pages];
  }

  toggleMenu() {
    this.menuButton.classList.toggle("menu-button-open");
    this.linksContainer.classList.toggle("links-container-open");
  }

  closeMenu() {
    this.menuButton.classList.remove("menu-button-open");
    this.linksContainer.classList.remove("links-container-open");
  }
}
window.customElements.define("nav-bar", NavBar);
