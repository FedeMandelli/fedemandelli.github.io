// open pomodoro timer
export function openPomodoro() {
    fetch(`/html/pomodoro.html`)
        .then(response => {
            return response.text()
        })
        .then(html => {
            const pomodoroWindow = window.open("", "Pomodoro", "width=300,height=400,top=100,left=100,menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes")
            pomodoroWindow.document.write(html)
            pomodoroWindow.document.close()
        })
}
