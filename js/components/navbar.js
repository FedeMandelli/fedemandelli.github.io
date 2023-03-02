// === Navigation Bar ===
class NavBar extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        // create pages
        const pages = ['home', 'baking', 'contact'];
        const linksContainer = this.querySelector('.links-container')
        pages.forEach(page => {
            const link = document.createElement('a');
            link.innerHTML = page;
            link.addEventListener('click', () => {
                this.loadPage(page);
            });
            linksContainer.appendChild(link);
        });

        // set first page
        const params = new URLSearchParams(window.location.search);
        const target = params.get('page');
        this.loadPage(target);

        // add event listener for logo
        const logo = this.querySelector('svg')
        logo.addEventListener('click', () => {
            this.loadPage('home');
        });

        // add event listener for menu button
        const menu = this.querySelector('.menu-button');
        menu.addEventListener('click', () => {
            this.openCloseMenu();
        });
    }

    openCloseMenu() {
        const menu = this.querySelector('.menu-button');
        const linksContainer = this.querySelector('.links-container');
        menu.classList.toggle('menu-button-open');
        linksContainer.classList.toggle('links-container-open');
    }

    loadPage(page) {
        // reformat page name
        var target = page || 'home'; // === TO CHANGE IN PRODUCTION ===
        target = target.charAt(0) === '/' ? target.substring(1) : target;

        // get content and update url         
        this.main = document.querySelector('main');
        window.history.pushState({}, '', target); // === TO CHANGE IN PRODUCTION ===

        // load new page with fade effect
        this.main.style.opacity = 0;
        setTimeout(() => {
            this.loadHtml(`/html/${target}.html`);
            // fade in
            this.main.style.opacity = 1
        }, 400);

        // set active link
        const links = this.querySelectorAll('a');
        links.forEach(link => {
            if (link.innerHTML === target) {
                link.classList.add('selected');
            } else {
                link.classList.remove('selected');
            }
        });

        // close menu
        this.openCloseMenu();
    }

    loadHtml(path) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.onload = () => {
            if (xhr.status === 200) {
                this.main.innerHTML = xhr.responseText;
            } else if (xhr.status === 404) {
                this.main.innerHTML = 'Page not found';
            }
        }
        xhr.send();
    }
}
window.customElements.define('nav-bar', NavBar);
