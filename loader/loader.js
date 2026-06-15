/* ==========================================================================
   App Loader
   --------------------------------------------------------------------------
   Purpose:
   Controls appearance and removal of the loading screen.

   UX goals:
   - Prevent abrupt page appearance.
   - Create smooth transition into website content.
   - Improve perceived loading performance.

   Related files:
   - loader.php
   - loader.css
   - README.md
   - design/

   Workflow:
   1. Wait for window.load event.
   2. Start fade-out animation.
   3. Remove loader from DOM after animation completes.

   Important:
   - Works only if #appLoader exists.
   - Safe to include globally.
   - Does not affect page functionality if loader is missing.
   ========================================================================== */

/* ==========================================================================
   Initialize Loader
   --------------------------------------------------------------------------
   Wait until all page resources are loaded before hiding loader.
   ========================================================================== */

window.addEventListener('load', function () {
	const loader = document.querySelector('#appLoader')

	/* Exit if loader is not present */
	if (!loader) return

	/* Start fade-out animation */
	setTimeout(function () {
		loader.classList.add('is-hidden')
	}, 450)

	/* Remove loader from DOM after animation completes */
	setTimeout(function () {
		loader.remove()
	}, 1000)
})
