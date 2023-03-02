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
