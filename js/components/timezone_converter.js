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
            try {
                // option.value = timezone.split("/")[1].replace("_", " ")
            }
            catch (e) {
            }
            option.value = timezone
            timezoneSuggestionsList.appendChild(option)
        })

        // first timezone
        this.firstTimezone = this.querySelector('#first-timezone')
        this.firstTime = this.querySelector('#first-time')
        this.firstDate = this.querySelector('#first-date')
        this.setDefault()

        // second timezone
        this.secondTimezone = this.querySelector('#second-timezone')
        this.secondTime = this.querySelector('#second-time')
        this.secondDate = this.querySelector('#second-date')

        // event listeners
        this.firstTimezone.addEventListener('change', this.updateTime.bind(this))
        this.firstTime.addEventListener('change', this.updateTime.bind(this))
        this.firstDate.addEventListener('change', this.updateTime.bind(this))
        this.secondTimezone.addEventListener('change', this.updateTime.bind(this))
        this.secondTime.addEventListener('change', this.updateTime.bind(this))
        this.secondDate.addEventListener('change', this.updateTime.bind(this))
    }

    updateTime() {
        // get values
        let firstTimezone = this.firstTimezone.value
        let firstTime = this.firstTime.value
        let firstDate = this.firstDate.value
        let secondTimezone = this.secondTimezone.value
        let secondTime = this.secondTime.value
        let secondDate = this.secondDate.value

        // update second timezone
        if (firstTimezone && firstTime && firstDate) {
            let firstMoment = moment.tz(`${firstDate} ${firstTime}`, firstTimezone)
            let secondMoment = firstMoment.clone().tz(secondTimezone)
            this.secondTimezone.value = secondTimezone
            this.secondTime.value = secondMoment.format('HH:mm')
            this.secondDate.value = secondMoment.format('YYYY-MM-DD')
        }
        // update first timezone
        else if (secondTimezone && secondTime && secondDate) {
            let secondMoment = moment.tz(`${secondDate} ${secondTime}`, secondTimezone)
            let firstMoment = secondMoment.clone().tz(firstTimezone)
            this.firstTimezone.value = firstTimezone
            this.firstTime.value = firstMoment.format('HH:mm')
            this.firstDate.value = firstMoment.format('YYYY-MM-DD')
        }
        // set default
        else {
            this.setDefault()
        }



    }

    setDefault() {
        this.firstTimezone.value = moment.tz.guess()
        this.firstTime.value = moment().format('HH:mm')
        this.firstDate.value = moment().format('YYYY-MM-DD')
    }
}

window.customElements.define('timezone-converter', TimezoneConverter)