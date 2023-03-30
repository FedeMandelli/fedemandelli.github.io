// import moment
class TimezoneConverter extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        // timezone list
        const timezoneSuggestionsList = this.querySelector('#timezone-suggestions')
        moment.tz.names().forEach(function (timezone) {
            let option = document.createElement("option")
            option.text = timezone
            option.value = timezone
            timezoneSuggestionsList.appendChild(option)
        })

        // first timezone
        this.firstTimezone = this.querySelector('#first-timezone')
        this.firstTime = this.querySelector('#first-time')
        this.firstDate = this.querySelector('#first-date')
        this.firstClear = this.querySelector('#first-clear')
        this.firstDefault = this.querySelector('#first-default')
        this.setDefault()

        // second timezone
        this.secondTimezone = this.querySelector('#second-timezone')
        this.secondTime = this.querySelector('#second-time')
        this.secondDate = this.querySelector('#second-date')
        this.secondClear = this.querySelector('#second-clear')

        // event listeners
        this.firstTimezone.addEventListener('change', this.updateTime.bind(this))
        this.firstTime.addEventListener('change', this.updateTime.bind(this))
        this.firstDate.addEventListener('change', this.updateTime.bind(this))
        this.firstClear.addEventListener('click', this.clearFirst.bind(this))
        this.firstDefault.addEventListener('click', this.setDefault.bind(this))
        this.secondTimezone.addEventListener('change', this.updateTime.bind(this))
        this.secondTime.addEventListener('change', this.updateTime.bind(this))
        this.secondDate.addEventListener('change', this.updateTime.bind(this))
        this.secondClear.addEventListener('click', this.clearSecond.bind(this))
    }

    updateTime(element) {
        // get values
        var firstTimezone = this.firstTimezone.value
        var firstTime = this.firstTime.value
        var firstDate = this.firstDate.value
        var secondTimezone = this.secondTimezone.value
        var secondTime = this.secondTime.value
        var secondDate = this.secondDate.value

        // update
        if (['first-timezone', 'first-time', 'first-date', 'second-timezone'].includes(element.target.id)) {
            this.secondTime.value = moment.tz(firstDate + ' ' + firstTime, firstTimezone).tz(secondTimezone).format('HH:mm')
            this.secondDate.value = moment.tz(firstDate + ' ' + firstTime, firstTimezone).tz(secondTimezone).format('YYYY-MM-DD')
        }
        else {
            this.firstTime.value = moment.tz(secondDate + ' ' + secondTime, secondTimezone).tz(firstTimezone).format('HH:mm')
            this.firstDate.value = moment.tz(secondDate + ' ' + secondTime, secondTimezone).tz(firstTimezone).format('YYYY-MM-DD')
        }
    }

    clearFirst() {
        this.firstTimezone.value = ''
        this.firstTime.value = ''
        this.firstDate.value = ''
    }

    clearSecond() {
        this.secondTimezone.value = ''
        this.secondTime.value = ''
        this.secondDate.value = ''
    }

    setDefault() {
        this.firstTimezone.value = moment.tz.guess()
        this.firstTime.value = moment().format('HH:mm')
        this.firstDate.value = moment().format('YYYY-MM-DD')
    }
}

window.customElements.define('timezone-converter', TimezoneConverter)