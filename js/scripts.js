// general
import "./general/utilities.js"
import { createRouter } from "./general/router.js"

// components
import "./components/navbar.js"

const navBar = document.querySelector("nav-bar")
const pages = navBar && typeof navBar.getPages === "function"
	? navBar.getPages()
	: ["home", "contact"]

const router = createRouter({
	mainSelector: "main",
	routes: pages,
	defaultRoute: "home",
	onRouteChange: (route) => {
		if (navBar && typeof navBar.setActiveRoute === "function") {
			navBar.setActiveRoute(route)
		}
	}
})

document.addEventListener("site:navigate", (event) => {
	router.navigate(event.detail.route)
})
