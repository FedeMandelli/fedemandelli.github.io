class PomodoroTimer extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        // get elements
        this.timestampContainer = this.querySelector('.timestamp-container')
        this.timestamp = this.querySelector('.timestamp')
        this.startPauseButton = this.querySelector('#start_pause')
        this.resetButton = this.querySelector('#reset')
        this.workTimeInput = this.querySelector('#work_time')
        this.breakTimeInput = this.querySelector('#break_time')

        // set event listeners
        this.startPauseButton.addEventListener('click', this.startPause.bind(this))
        this.resetButton.addEventListener('click', this.reset.bind(this))
        this.workTimeInput.addEventListener('input', this.workTimeChanged.bind(this))
        this.workTimeInput.addEventListener('wheel', () => { })
        this.breakTimeInput.addEventListener('input', this.breakTimeChanged.bind(this))
        this.breakTimeInput.addEventListener('wheel', () => { })

        // set default state
        this.reset()
    }

    workTimeChanged() {
        this.workTime = this.workTimeInput.value
        this.timestamp.innerHTML = this.secondsToTimestamp(this.workTime * 60)
    }

    breakTimeChanged() {
        this.breakTime = this.breakTimeInput.value
    }

    startPause() {
        // start timer
        if (this.state == 'stopped' || this.state == 'paused') {
            this.state = 'running'
            this.startPauseButton.innerHTML = 'Pause'
            this.startTimer()

            // disable inputs
            this.workTimeInput.disabled = true
            this.breakTimeInput.disabled = true
        }

        // pause timer
        else if (this.state == 'running') {
            this.state = 'paused'
            this.startPauseButton.innerHTML = 'Start'
            this.stopTimer()
        }
    }

    reset() {
        // stop timer and set circle color
        this.stopTimer()
        this.timestampContainer.style.background = 'red'

        // reset values
        this.workTime = 25
        this.workTimeInput.value = this.workTime
        this.breakTime = 5
        this.breakTimeInput.value = this.breakTime

        // reset state
        this.state = 'stopped'
        this.session = 'work'
        this.startPauseButton.innerHTML = 'Start'
        this.timestamp.innerHTML = this.secondsToTimestamp(this.workTime * 60)

        // enable inputs
        this.workTimeInput.disabled = false
        this.breakTimeInput.disabled = false
    }

    startTimer() {
        // get initial time
        this.time = this.timestampToSeconds(this.timestamp.innerHTML)

        // start timer
        this.timer = setInterval(() => {
            // update time and timestamp
            this.time--
            this.timestamp.innerHTML = this.secondsToTimestamp(this.time)

            // updade circle
            const percLeft = (this.time / (this.session == 'work' ? this.workTime : this.breakTime) / 60 * 100)
            const color = this.session == 'work' ? 'red' : 'green'
            this.timestampContainer.style.background = `conic-gradient(${color} ${percLeft}%, transparent ${percLeft}%)`

            // end session
            if (this.time == 0) {
                this.switchSession()
            }
        }, 1000)
    }

    stopTimer() {
        clearInterval(this.timer)
    }

    switchSession() {
        // stop timer
        this.stopTimer()
        this.state = 'stopped'
        this.startPauseButton.innerHTML = 'Start'

        // switch session
        if (this.session == 'work') {
            this.session = 'break'
            this.time = this.breakTime * 60
            this.timestampContainer.style.background = 'green'
        }
        else if (this.session == 'break') {
            this.session = 'work'
            this.time = this.workTime * 60
            this.timestampContainer.style.background = 'red'
        }

        // update timestamp
        this.timestamp.innerHTML = this.secondsToTimestamp(this.time)
    }

    timestampToSeconds(timestamp) {
        let time = timestamp.split(':')
        return time[0] * 60 + time[1] * 1
    }

    secondsToTimestamp(seconds) {
        let min = Math.floor(seconds / 60)
        let sec = seconds % 60
        return (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec)
    }

    disconnectedCallback() {
        this.stopTimer()
        this.startPauseButton.removeEventListener('click', this.startPause)
        this.resetButton.removeEventListener('click', this.reset)
        this.workTimeInput.removeEventListener('input', this.workTimeChanged)
        this.workTimeInput.removeEventListener('wheel', () => { })
        this.breakTimeInput.removeEventListener('input', this.breakTimeChanged)
        this.breakTimeInput.removeEventListener('wheel', () => { })
    }
}

window.customElements.define('pomodoro-timer', PomodoroTimer)