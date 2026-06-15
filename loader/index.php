<!--
==========================================================================
 App Loader
---------------------------------------------------------------------------
 Purpose:
 Premium loading screen displayed during initial page load.

 UX goals:
 - Hide layout shifts during page initialization.
 - Improve perceived loading speed.
 - Create premium first impression.
 - Smooth transition into website content.

 Related files:
 - loader.css
 - loader.js
 - README.md

 Important:
 - Loader is displayed immediately after page load starts.
 - Hidden after window.load event.
 - Removed from DOM after fade-out animation completes.

 Note:
 - Old .preloader implementation is deprecated.
 - Current project uses only #appLoader.
==========================================================================
-->

<div class="app-loader" id="appLoader">
	<div class="app-loader__logo">
		<img
			class="app-loader__img"
			src="/app/img/icons-2/logo-2.svg"
			alt="Vizaje-Nica"
		>
	</div>

	<div class="app-loader__line"></div>
</div>