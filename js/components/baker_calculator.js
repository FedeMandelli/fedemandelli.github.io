// === Ingredients Calculator ===
class IngredientsCalc extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        // Get the inputs
        this.inputs = [this.totalFlourGr = this.querySelector('#total_flour_gr'),
        this.strongFlourGr = this.querySelector('#strong_flour_gr'),
        this.strongFlourPct = this.querySelector('#strong_flour_pct'),
        this.normalFlourGr = this.querySelector('#normal_flour_gr'),
        this.normalFlourPct = this.querySelector('#normal_flour_pct'),
        this.starterPct = this.querySelector('#starter_pct'),
        this.starterGr = this.querySelector('#starter_gr'),
        this.waterPct = this.querySelector('#water_pct'),
        this.waterGr = this.querySelector('#water_gr'),
        this.saltPct = this.querySelector('#salt_pct'),
        this.saltGr = this.querySelector('#salt_gr'),
        this.oilPct = this.querySelector('#oil_pct'),
        this.oilGr = this.querySelector('#oil_gr')]

        // Add event listeners
        this.inputs.forEach(input => {
            input.addEventListener('input', (e) => this.update(e))
            input.addEventListener('wheel', () => { })
        })

        // Set initial values
        this.totalFlourGr.value = 500
        this.update({ target: this.totalFlourGr })
    }

    update(e) {
        // get changed element
        const changed = e.target.id

        // check input limits
        const value = parseFloat(e.target.value);
        if (value < 0) { e.target.value = 0 }
        if (value > 100 && changed.endsWith('pct')) { e.target.value = 100 }

        // calculations
        if (changed === 'total_flour_gr') {
            this.strongFlourGr.value = (this.totalFlourGr.value * this.strongFlourPct.value / 100).toFixed(1)
            this.normalFlourGr.value = (this.totalFlourGr.value * this.normalFlourPct.value / 100).toFixed(1)
            this.starterGr.value = (this.totalFlourGr.value * this.starterPct.value / 100).toFixed(1)
            this.waterGr.value = (this.totalFlourGr.value * this.waterPct.value / 100).toFixed(1)
            this.saltGr.value = (this.totalFlourGr.value * this.saltPct.value / 100).toFixed(1)
            this.oilGr.value = (this.totalFlourGr.value * this.oilPct.value / 100).toFixed(1)
        }

        if (changed === 'strong_flour_gr') {
            this.totalFlourGr.value = (this.strongFlourGr.value / this.strongFlourPct.value * 100).toFixed(1)
            this.normalFlourGr.value = (this.totalFlourGr.value * this.normalFlourPct.value / 100).toFixed(1)
            this.starterGr.value = (this.totalFlourGr.value * this.starterPct.value / 100).toFixed(1)
            this.waterGr.value = (this.totalFlourGr.value * this.waterPct.value / 100).toFixed(1)
            this.saltGr.value = (this.totalFlourGr.value * this.saltPct.value / 100).toFixed(1)
            this.oilGr.value = (this.totalFlourGr.value * this.oilPct.value / 100).toFixed(1)
        }

        if (changed === 'normal_flour_gr') {
            this.totalFlourGr.value = (this.normalFlourGr.value / this.normalFlourPct.value * 100).toFixed(1)
            this.strongFlourGr.value = (this.totalFlourGr.value * this.strongFlourPct.value / 100).toFixed(1)
            this.starterGr.value = (this.totalFlourGr.value * this.starterPct.value / 100).toFixed(1)
            this.waterGr.value = (this.totalFlourGr.value * this.waterPct.value / 100).toFixed(1)
            this.saltGr.value = (this.totalFlourGr.value * this.saltPct.value / 100).toFixed(1)
            this.oilGr.value = (this.totalFlourGr.value * this.oilPct.value / 100).toFixed(1)
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
            this.oilGr.value = (this.totalFlourGr.value * this.oilPct.value / 100).toFixed(1)
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
window.customElements.define('ingredients-calc', IngredientsCalc);

// === Jobs Calculator ===
class JobsCalc extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        // get the inputs
        this.inputs = [
            this.firstMixWait = this.querySelector('#first_mix_wait'),
            this.firstMixTime = this.querySelector('#first_mix_time'),
            this.secondMixWait = this.querySelector('#second_mix_wait'),
            this.secondMixTime = this.querySelector('#second_mix_time'),
            this.firstFoldWait = this.querySelector('#first_fold_wait'),
            this.firstFoldTime = this.querySelector('#first_fold_time'),
            this.secondFoldWait = this.querySelector('#second_fold_wait'),
            this.secondFoldTime = this.querySelector('#second_fold_time'),
            this.thirdFoldTime = this.querySelector('#third_fold_time')
        ]

        // add event listeners
        this.inputs.forEach(input => {
            input.addEventListener('input', (e) => this.update(e))
            input.addEventListener('wheel', () => { })
        })
        this.querySelector('#reset').addEventListener('click', () => this.resetTable())

        // reset table
        this.resetTable()

    }

    update(e) {
        // get the changed input
        const changed = e.target.id

        // check input limits
        const value = parseFloat(e.target.value);
        if (value < 0 && e.target.type === 'number') { e.target.value = 0 }

        // calculations
        if (changed === 'first_mix_time') {
            this.secondMixTime.value = this.addSubtractTime(this.firstMixTime, this.firstMixWait, true)
            this.firstFoldTime.value = this.addSubtractTime(this.secondMixTime, this.secondMixWait, true)
            this.secondFoldTime.value = this.addSubtractTime(this.firstFoldTime, this.firstFoldWait, true)
            this.thirdFoldTime.value = this.addSubtractTime(this.secondFoldTime, this.secondFoldWait, true)
        }

        if (changed === 'third_fold_time') {
            this.secondFoldTime.value = this.addSubtractTime(this.thirdFoldTime, this.secondFoldWait, false)
            this.firstFoldTime.value = this.addSubtractTime(this.secondFoldTime, this.firstFoldWait, false)
            this.secondMixTime.value = this.addSubtractTime(this.firstFoldTime, this.firstMixWait, false)
            this.firstMixTime.value = this.addSubtractTime(this.secondMixTime, this.firstMixWait, false)
        }

        if (changed === 'first_mix_wait') {
            this.secondMixTime.value = this.addSubtractTime(this.firstMixTime, this.firstMixWait, true)
            this.firstFoldTime.value = this.addSubtractTime(this.secondMixTime, this.secondMixWait, true)
            this.secondFoldTime.value = this.addSubtractTime(this.firstFoldTime, this.firstFoldWait, true)
            this.thirdFoldTime.value = this.addSubtractTime(this.secondFoldTime, this.secondFoldWait, true)
        }

        if (changed === 'second_mix_wait') {
            this.firstFoldTime.value = this.addSubtractTime(this.secondMixTime, this.secondMixWait, true)
            this.secondFoldTime.value = this.addSubtractTime(this.firstFoldTime, this.firstFoldWait, true)
            this.thirdFoldTime.value = this.addSubtractTime(this.secondFoldTime, this.secondFoldWait, true)
        }

        if (changed === 'first_fold_wait') {
            this.secondFoldTime.value = this.addSubtractTime(this.firstFoldTime, this.firstFoldWait, true)
            this.thirdFoldTime.value = this.addSubtractTime(this.secondFoldTime, this.secondFoldWait, true)
        }

        if (changed === 'second_fold_wait') {
            this.thirdFoldTime.value = this.addSubtractTime(this.secondFoldTime, this.secondFoldWait, true)
        }
    }

    addSubtractTime(time, wait, sum) {
        // convert inputs to seconds
        const timeInSeconds = time.valueAsNumber / 1000
        const waitInSeconds = wait.valueAsNumber * 60

        // calculate the new time
        var newTimeInSeconds = sum ? timeInSeconds + waitInSeconds : timeInSeconds - waitInSeconds

        // check if over midnight
        if (newTimeInSeconds >= 86400) { newTimeInSeconds -= 86400 }
        if (newTimeInSeconds < 0) { newTimeInSeconds += 86400 }

        // convert seconds to time format
        const hours = Math.floor(newTimeInSeconds / 3600)
        const minutes = Math.floor((newTimeInSeconds - (hours * 3600)) / 60)
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

        return formattedTime
    }

    resetTable() {
        // set the initial values
        this.thirdFoldTime.value = '18:30'
        this.firstMixWait.value = 60
        this.secondMixWait.value = 40
        this.firstFoldWait.value = 40
        this.secondFoldWait.value = 40
        this.update({ target: this.thirdFoldTime })

        // clear checks
        this.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false)
    }
}

window.customElements.define('jobs-calc', JobsCalc);
