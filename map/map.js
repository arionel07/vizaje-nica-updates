/* ==========================================================================
   Store Map / Store Locator
   --------------------------------------------------------------------------
   Purpose:
   Controls the interactive Vizaje-Nica store locator.

   UX goals:
   - Show stores on an interactive map.
   - Sync store cards with map markers.
   - Provide smooth flyTo animation when store is selected.
   - Show selected store information in glass panel.
   - Support mobile list/map switching.

   Technology:
   - MapLibre GL
   - OpenFreeMap Positron style
   - No Google Maps API key required
   - No Mapbox token required

   Related files:
   - stores-map.php
   - stores-map.css
   - language.json
   - README.md
   - design/

   Important:
   - Store data is read from .vn-store-card data-* attributes.
   - Required data attributes:
     data-index, data-title, data-address, data-phone, data-lat, data-lng.
   - Do not rename data-store-card or #vnStoresMap without updating this file.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
	/* ======================================================================
	   DOM References
	   ====================================================================== */

	const mapElement = document.getElementById('vnStoresMap')
	const cards = document.querySelectorAll('[data-store-card]')
	const storesRoot = document.querySelector('.vn-stores')
	const viewTabs = document.querySelectorAll('[data-store-view]')

	/* Exit safely if this page does not contain the store map */
	if (!mapElement || !cards.length || typeof maplibregl === 'undefined') return

	/* ======================================================================
	   Store Data
	   ----------------------------------------------------------------------
	   Store data comes from PHP-rendered data-* attributes.
	   This keeps JS independent from backend structure.
	   ====================================================================== */

	const stores = Array.from(cards).map(card => ({
		card,
		index: Number(card.dataset.index),
		title: card.dataset.title,
		address: card.dataset.address,
		phone: card.dataset.phone,
		lat: Number(card.dataset.lat),
		lng: Number(card.dataset.lng)
	}))

	/* ======================================================================
	   Map Init
	   ----------------------------------------------------------------------
	   Uses MapLibre GL with OpenFreeMap Positron style.

	   Notes:
	   - Free map provider.
	   - No token required.
	   - attributionControl is disabled visually in CSS.
	   ====================================================================== */

	const map = new maplibregl.Map({
		container: 'vnStoresMap',
		style: 'https://tiles.openfreemap.org/styles/positron',
		center: [28.8353, 47.0105],
		zoom: 12.3,
		attributionControl: false
	})

	map.addControl(
		new maplibregl.NavigationControl({
			showCompass: false
		}),
		'bottom-right'
	)

	/* ======================================================================
	   Markers
	   ----------------------------------------------------------------------
	   Custom HTML markers:
	   - default state shows store number.
	   - active state shows Vizaje-Nica "V" mark.
	   ====================================================================== */

	const markers = []

	stores.forEach(store => {
		const markerEl = document.createElement('button')

		markerEl.className = 'vn-map-marker'
		markerEl.type = 'button'
		markerEl.innerHTML = `
			<span class="vn-map-marker__number">
				${String(store.index + 1).padStart(2, '0')}
			</span>
			<span class="vn-map-marker__brand">V</span>
		`

		const marker = new maplibregl.Marker({
			element: markerEl,
			anchor: 'center'
		})
			.setLngLat([store.lng, store.lat])
			.addTo(map)

		store.marker = marker
		store.markerEl = markerEl

		markerEl.addEventListener('click', () => {
			selectStore(store)
		})

		markers.push(marker)
	})

	/* ======================================================================
	   Store Card Click
	   ----------------------------------------------------------------------
	   Desktop:
	   - clicking a card selects the store and moves the map.

	   Mobile:
	   - clicking "Show on map" switches to map view and focuses the store.
	   ====================================================================== */

	cards.forEach(card => {
		card.addEventListener('click', event => {
			const button = event.target.closest('.vn-store-card__button')
			const index = Number(card.dataset.index)
			const store = stores.find(item => item.index === index)

			if (!store) return

			selectStore(store)

			if (button && window.innerWidth <= 768) {
				storesRoot?.classList.add('is-map-view')
				storesRoot?.classList.remove('is-list-view')

				viewTabs.forEach(item => {
					item.classList.toggle('is-active', item.dataset.storeView === 'map')
				})

				setTimeout(() => {
					map.resize()

					map.flyTo({
						center: [store.lng, store.lat],
						zoom: 15.8,
						speed: 0.8,
						curve: 1.35,
						essential: true
					})
				}, 120)
			}
		})
	})

	/* ======================================================================
	   Mobile Tabs
	   ----------------------------------------------------------------------
	   Switches between list and map view on mobile.
	   Required classes:
	   - .is-map-view
	   - .is-list-view
	   ====================================================================== */

	viewTabs.forEach(tab => {
		tab.addEventListener('click', () => {
			const view = tab.dataset.storeView

			viewTabs.forEach(item => item.classList.remove('is-active'))
			tab.classList.add('is-active')

			if (!storesRoot) return

			storesRoot.classList.toggle('is-map-view', view === 'map')
			storesRoot.classList.toggle('is-list-view', view === 'list')

			if (view === 'map') {
				setTimeout(() => {
					map.resize()
				}, 100)
			}
		})
	})

	/* Default mobile state: show list first */
	if (storesRoot && window.innerWidth <= 768) {
		storesRoot.classList.add('is-list-view')
	}

	/* ======================================================================
	   Select Store
	   ----------------------------------------------------------------------
	   Updates:
	   - active card
	   - active marker
	   - map position
	   - info panel
	   ====================================================================== */

	function selectStore(store) {
		cards.forEach(card => card.classList.remove('is-active'))

		stores.forEach(item => {
			item.markerEl?.classList.remove('is-active')
		})

		store.card.classList.add('is-active')
		store.markerEl.classList.add('is-active')

		map.flyTo({
			center: [store.lng, store.lat],
			zoom: 15.8,
			speed: 0.8,
			curve: 1.35,
			essential: true
		})

		updatePanel(store)
	}

	/* ======================================================================
	   Info Panel
	   ----------------------------------------------------------------------
	   Updates glass panel with selected store data.
	   Route link opens Google Maps directions.
	   ====================================================================== */

	function updatePanel(store) {
		const panel = document.querySelector('[data-map-panel]')
		const panelTitle = document.querySelector('[data-panel-title]')
		const panelAddress = document.querySelector('[data-panel-address]')
		const panelPhone = document.querySelector('[data-panel-phone]')
		const panelRoute = document.querySelector('[data-panel-route]')

		if (!panel) return

		panelTitle.textContent = store.title
		panelAddress.textContent = store.address

		if (panelPhone) {
			panelPhone.textContent = store.phone
			panelPhone.href = `tel:${store.phone.replaceAll(' ', '')}`
		}

		panelRoute.href = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`

		panel.classList.add('is-visible')
	}
})
