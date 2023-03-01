function changeURL(path) {
    window.history.pushState({}, '', path);
}

// window.addEventListener('popstate', () => {
//     const path = window.location.pathname;
//     console.log(path)

//     if (path === '/page1') {
//         // Handle the "/page1" URL
//     } else if (path === '/page2') {
//         // Handle the "/page2" URL
//     } else if (path === '/page3') {
//         // Handle the "/page3" URL
//     }
// });

// === Main Content ===
class MainContent extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
    }

    static get observedAttributes() {
        return ['path'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'path' && newValue !== oldValue) {
            this.loadPage(`${newValue}.html`);
            window.history.pushState({}, '', newValue);
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
        const mainContent = document.querySelector('main-content');
        mainContent.setAttribute('path', 'home.html');

        // create pages
        const pages = ['home', 'about', 'contact'];
        pages.forEach(page => {
            const link = document.createElement('a');
            link.innerHTML = page;
            link.addEventListener('click', (event) => {
                event.preventDefault();
                mainContent.setAttribute('path', `${page}`);
            });
            this.appendChild(link);
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
        console.log(`connected ${this.pageName}`)
    }

    disconnectedCallback() {
        console.log(`disconnected ${this.pageName}`)
    }
}
window.customElements.define('page-content', PageContent);