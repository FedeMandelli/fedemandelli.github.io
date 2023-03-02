// update footer year
function footerYear() {
    var today = new Date();
    var year = today.getFullYear();
    document.getElementById("footerYear").innerHTML = year;
}
footerYear()