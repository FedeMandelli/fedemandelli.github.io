class BakerCalc extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        // Get the template
        this.totalFlourGr = this.querySelector('#total_flour_gr')
        this.strongFlourGr = this.querySelector('#strong_flour_gr')
        this.strongFlourPct = this.querySelector('#strong_flour_pct')
        this.normalFlourGr = this.querySelector('#normal_flour_gr')
        this.normalFlourPct = this.querySelector('#normal_flour_pct')

        // Add event listeners for changes
        this.totalFlourGr.addEventListener('input', (e) => this.update(e))
        this.strongFlourGr.addEventListener('input', (e) => this.update(e))
        this.strongFlourPct.addEventListener('input', (e) => this.update(e))
        this.normalFlourGr.addEventListener('input', (e) => this.update(e))
        this.normalFlourPct.addEventListener('input', (e) => this.update(e))
    }

    update(e) {
        // get changed element
        const changed = e.target.id

        // calculate
        if (changed === 'total_flour_gr') {
            this.strongFlourGr.value = (this.totalFlourGr.value * this.strongFlourPct.value / 100).toFixed(0)
            this.normalFlourGr.value = (this.totalFlourGr.value * this.normalFlourPct.value / 100).toFixed(0)
        }

        if (changed === 'strong_flour_gr') {
            this.totalFlourGr.value = (this.strongFlourGr.value / this.strongFlourPct.value * 100).toFixed(0)
            this.normalFlourGr.value = (this.totalFlourGr.value * this.normalFlourPct.value / 100).toFixed(0)
        }

        if (changed === 'normal_flour_gr') {
            this.totalFlourGr.value = (this.normalFlourGr.value / this.normalFlourPct.value * 100).toFixed(0)
            this.strongFlourGr.value = (this.totalFlourGr.value * this.strongFlourPct.value / 100).toFixed(0)
        }

        if (changed === 'strong_flour_pct') {
            this.strongFlourGr.value = (this.totalFlourGr.value * this.strongFlourPct.value / 100).toFixed(0)
            this.normalFlourPct.value = (100 - this.strongFlourPct.value).toFixed(0)
            this.normalFlourGr.value = (this.totalFlourGr.value * this.normalFlourPct.value / 100).toFixed(0)
        }

        if (changed === 'normal_flour_pct') {
            this.normalFlourGr.value = (this.totalFlourGr.value * this.normalFlourPct.value / 100).toFixed(0)
            this.strongFlourPct.value = (100 - this.normalFlourPct.value).toFixed(0)
            this.strongFlourGr.value = (this.totalFlourGr.value * this.strongFlourPct.value / 100).toFixed(0)
        }
    }
}

window.customElements.define('baker-calc', BakerCalc);