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

        // get content and update url         
        this.main = document.querySelector('main');
        // window.history.pushState({}, '', target); // === TO CHANGE IN PRODUCTION ===

        // load new page with fade effect
        this.main .style.opacity = 0;
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
    }


    loadHtml(path) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.onload = () => {
            if (xhr.status === 200) {
                this.main .innerHTML = xhr.responseText;
            } else if (xhr.status === 404) {
                this.main .innerHTML = 'Page not found';
            }
        }
        xhr.send();
    }
}
window.customElements.define('nav-bar', NavBar);
