// open pomodoro timer
export function openPomodoro() {
    fetch(`/html/pomodoro.html`)
        .then(response => {
            return response.text()
        })
        .then(html => {
            const pomodoroWindow = window.open("", "", "width=300,height=400,top=100,left=100,menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes")
            pomodoroWindow.document.write(html)
            pomodoroWindow.history.pushState({}, '', 'pomodoro')
            pomodoroWindow.document.close()
        })
}

// open baking tools
export function openBaking() {
    fetch(`/html/baking.html`)
        .then(response => {
            return response.text()
        })
        .then(html => {
            const bakingWindow = window.open("", "", "width=500,height=600,top=100,left=100,menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes")
            bakingWindow.document.write(html)
            bakingWindow.history.pushState({}, '', 'baking')
            bakingWindow.document.close()
        })
}
