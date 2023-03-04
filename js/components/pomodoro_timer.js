class PomodoroTimer extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        // get button
        this.notificationButton = this.querySelector('button')
        this.notificationButton.addEventListener('click', this.notificationCheck.bind(this))
    }

    disconnectedCallback() { }

    notificationCheck() {
        // check for notification support
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notification')
            return
        }

        // check for permission
        if (Notification.permission === 'granted') {
            this.showNotification()
        }

        // request permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (permission === 'granted') {
                    this.showNotification()
                }
            })
        }
    }

    showNotification() {
        // show notification
        var notification = new Notification('FedeMandelli', {
            body: 'Notification test',
            icon: '/media/imgs/alarm.svg'
        })

        // close notification after 5 seconds
        setTimeout(notification.close.bind(notification), 5000)
    }
}

window.customElements.define('pomodoro-timer', PomodoroTimer)