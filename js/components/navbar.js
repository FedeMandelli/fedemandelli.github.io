// === Navigation Bar ===
class NavBar extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        // get elements
        this.menuButton = this.querySelector('.menu-button')
        this.linksContainer = this.querySelector('.links-container')
        this.mainSection = document.querySelector('main')
        this.logo = this.querySelector('svg')

        // add event listeners
        this.logo.addEventListener('click', () => { this.loadPage('home') })
        this.menuButton.addEventListener('click', () => { this.toggleMenu() })
        this.mainSection.addEventListener('click', () => { this.closeMenu() })
        window.addEventListener('resize', () => { if (window.innerWidth > 768) { this.closeMenu() } })

        // create pages
        const pages = ['home', 'baking', 'pomodoro','contact']
        const linksContainer = this.querySelector('.links-container')
        pages.forEach(page => {
            const link = document.createElement('a')
            link.innerHTML = page
            link.addEventListener('click', () => {
                this.loadPage(page)
            })
            linksContainer.appendChild(link)
        })

        // set first page
        const params = new URLSearchParams(window.location.search)
        const target = params.get('page')
        this.loadPage(target)
    }

    loadPage(page) {
        // reformat page name
        var target = page || 'pomodoro' // === TO CHANGE IN PRODUCTION ===
        target = target.charAt(0) === '/' ? target.substring(1) : target

        // fade out current page
        this.mainSection.style.opacity = 0

        // fetch html
        setTimeout(() => {
            fetch(`/html/${target}.html`)
                .then(response => {
                    // page found
                    if (response.status === 200) {
                        return response.text()
                    }

                    // page not found
                    else if (response.status === 404) {
                        return 'Page not found'
                    }
                })
                .then(html => {
                    // set page content
                    this.mainSection.innerHTML = html

                    // update url         
                    // window.history.pushState({}, '', target) // === TO CHANGE IN PRODUCTION ===
                })
                .then(() => {
                    // fade in new page
                    this.mainSection.style.opacity = 1
                })
        }, 400);

        // set active link
        const links = this.querySelectorAll('a')
        links.forEach(link => {
            if (link.innerHTML === target) {
                link.classList.add('selected')
            } else {
                link.classList.remove('selected')
            }
        })

        // close menu
        this.closeMenu()
    }

    toggleMenu() {
        this.menuButton.classList.toggle('menu-button-open')
        this.linksContainer.classList.toggle('links-container-open')
    }

    closeMenu() {
        this.menuButton.classList.remove('menu-button-open')
        this.linksContainer.classList.remove('links-container-open')
    }
}
window.customElements.define('nav-bar', NavBar)
