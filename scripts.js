// === Main Content ===
class MainContent extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() { }

    static get observedAttributes() {
        return ['path'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'path' && newValue !== oldValue) {
            // initial fade out
            this.style.opacity = 0;

            // load new page and update url
            setTimeout(() => {
                this.loadPage(`${newValue}_page.html`);
                window.history.pushState({}, '', newValue);
                // fade in
                this.style.opacity = 1
            }, 400);
        }
    }

    loadPage(path) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.onload = () => {
            if (xhr.status === 200) {
                this.innerHTML = xhr.responseText;
            } else if (xhr.status === 404) {
                this.innerHTML = 'Page not found';
            }
        }
        xhr.send();
    }
}
window.customElements.define('main-content', MainContent);

// === Navigation Bar ===
class NavBar extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        // create pages
        const pages = ['home', 'about', 'contact'];
        pages.forEach(page => {
            const link = document.createElement('a');
            link.innerHTML = page;
            link.addEventListener('click', () => {
                this.loadPage(page);
            });
            this.appendChild(link);
        });

        // set first page
        const params = new URLSearchParams(window.location.search);
        const target = params.get('page');
        this.loadPage(target);
    }

    loadPage(page) {
        // reformat page name
        var target = page || 'home';
        target = target.charAt(0) === '/' ? target.substring(1) : target;

        // get content         
        const mainContent = document.querySelector('main-content');
        mainContent.setAttribute('path', `${target}`);

        // set active link
        const links = this.querySelectorAll('a');
        links.forEach(link => {
            if (link.innerHTML === target) {
                link.classList.add('selected');
            } else {
                link.classList.remove('selected');
            }
        });
    }
}
window.customElements.define('nav-bar', NavBar);

// === Page Content ===
class PageContent extends HTMLElement {
    constructor() {
        super()
        this.pageName = this.getAttribute('page-name');
    }

    connectedCallback() {
    }

    disconnectedCallback() {
    }
}
window.customElements.define('page-content', PageContent);