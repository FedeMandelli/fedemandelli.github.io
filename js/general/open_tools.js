// open tools
export function openTools(name, width, height) {
    fetch(`/html/${name}.html`)
        .then(response => {
            return response.text()
        })
        .then(html => {
            const bakingWindow = window.open("", "", `width=${width},height=${height},top=50,left=100,menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes`)
            bakingWindow.document.write(html)
            bakingWindow.history.pushState({}, '', name)
            bakingWindow.document.close()
        })
}
