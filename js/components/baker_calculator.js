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
        this.starterPct = this.querySelector('#starter_pct')
        this.starterGr = this.querySelector('#starter_gr')
        this.waterPct = this.querySelector('#water_pct')
        this.waterGr = this.querySelector('#water_gr')
        this.saltPct = this.querySelector('#salt_pct')
        this.saltGr = this.querySelector('#salt_gr')
        this.oilPct = this.querySelector('#oil_pct')
        this.oilGr = this.querySelector('#oil_gr')

        // Add event listeners for changes
        this.totalFlourGr.addEventListener('input', (e) => this.update(e))
        this.strongFlourGr.addEventListener('input', (e) => this.update(e))
        this.strongFlourPct.addEventListener('input', (e) => this.update(e))
        this.normalFlourGr.addEventListener('input', (e) => this.update(e))
        this.normalFlourPct.addEventListener('input', (e) => this.update(e))
        this.starterPct.addEventListener('input', (e) => this.update(e))
        this.starterGr.addEventListener('input', (e) => this.update(e))
        this.waterPct.addEventListener('input', (e) => this.update(e))
        this.saltPct.addEventListener('input', (e) => this.update(e))
        this.oilPct.addEventListener('input', (e) => this.update(e))

        // Add event listener for scroll wheel
        this.totalFlourGr.addEventListener('wheel', (e) => this.scroll(e))
        this.strongFlourGr.addEventListener('wheel', (e) => this.scroll(e))
        this.strongFlourPct.addEventListener('wheel', (e) => this.scroll(e))
        this.normalFlourGr.addEventListener('wheel', (e) => this.scroll(e))
        this.normalFlourPct.addEventListener('wheel', (e) => this.scroll(e))
        this.starterPct.addEventListener('wheel', (e) => this.scroll(e))
        this.starterGr.addEventListener('wheel', (e) => this.scroll(e))
        this.waterPct.addEventListener('wheel', (e) => this.scroll(e))
        this.saltPct.addEventListener('wheel', (e) => this.scroll(e))
        this.oilPct.addEventListener('wheel', (e) => this.scroll(e))
    }

    update(e) {
        // get changed element
        const changed = e.target.id

        // calculate
        if (changed === 'total_flour_gr') {
            this.strongFlourGr.value = (this.totalFlourGr.value * this.strongFlourPct.value / 100).toFixed(1)
            this.normalFlourGr.value = (this.totalFlourGr.value * this.normalFlourPct.value / 100).toFixed(1)
            this.waterGr.value = (this.totalFlourGr.value * this.waterPct.value / 100).toFixed(1)
            this.saltGr.value = (this.totalFlourGr.value * this.saltPct.value / 100).toFixed(1)
            this.starterGr.value = (this.totalFlourGr.value * this.starterPct.value / 100).toFixed(1)
        }

        if (changed === 'strong_flour_gr') {
            this.totalFlourGr.value = (this.strongFlourGr.value / this.strongFlourPct.value * 100).toFixed(1)
            this.normalFlourGr.value = (this.totalFlourGr.value * this.normalFlourPct.value / 100).toFixed(1)
            this.waterGr.value = (this.totalFlourGr.value * this.waterPct.value / 100).toFixed(1)
            this.saltGr.value = (this.totalFlourGr.value * this.saltPct.value / 100).toFixed(1)
            this.starterGr.value = (this.totalFlourGr.value * this.starterPct.value / 100).toFixed(1)
        }

        if (changed === 'normal_flour_gr') {
            this.totalFlourGr.value = (this.normalFlourGr.value / this.normalFlourPct.value * 100).toFixed(1)
            this.strongFlourGr.value = (this.totalFlourGr.value * this.strongFlourPct.value / 100).toFixed(1)
            this.waterGr.value = (this.totalFlourGr.value * this.waterPct.value / 100).toFixed(1)
            this.saltGr.value = (this.totalFlourGr.value * this.saltPct.value / 100).toFixed(1)
            this.starterGr.value = (this.totalFlourGr.value * this.starterPct.value / 100).toFixed(1)
        }

        if (changed === 'strong_flour_pct') {
            this.strongFlourGr.value = (this.totalFlourGr.value * this.strongFlourPct.value / 100).toFixed(1)
            this.normalFlourPct.value = (100 - this.strongFlourPct.value).toFixed(1)
            this.normalFlourGr.value = (this.totalFlourGr.value * this.normalFlourPct.value / 100).toFixed(1)
        }

        if (changed === 'normal_flour_pct') {
            this.normalFlourGr.value = (this.totalFlourGr.value * this.normalFlourPct.value / 100).toFixed(1)
            this.strongFlourPct.value = (100 - this.normalFlourPct.value).toFixed(1)
            this.strongFlourGr.value = (this.totalFlourGr.value * this.strongFlourPct.value / 100).toFixed(1)
        }

        if (changed === 'starter_pct') {
            this.starterGr.value = (this.totalFlourGr.value * this.starterPct.value / 100).toFixed(1)
        }

        if (changed === 'starter_gr') {
            this.totalFlourGr.value = (this.starterGr.value / this.starterPct.value * 100).toFixed(1)
            this.strongFlourGr.value = (this.totalFlourGr.value * this.strongFlourPct.value / 100).toFixed(1)
            this.normalFlourGr.value = (this.totalFlourGr.value * this.normalFlourPct.value / 100).toFixed(1)
            this.waterGr.value = (this.totalFlourGr.value * this.waterPct.value / 100).toFixed(1)
            this.saltGr.value = (this.totalFlourGr.value * this.saltPct.value / 100).toFixed(1)
        }

        if (changed === 'water_pct') {
            this.waterGr.value = (this.totalFlourGr.value * this.waterPct.value / 100).toFixed(1)
        }

        if (changed === 'salt_pct') {
            this.saltGr.value = (this.totalFlourGr.value * this.saltPct.value / 100).toFixed(1)
        }

        if (changed === 'oil_pct') {
            this.oilGr.value = (this.totalFlourGr.value * this.oilPct.value / 100).toFixed(1)
        }
    }
}

window.customElements.define('baker-calc', BakerCalc);