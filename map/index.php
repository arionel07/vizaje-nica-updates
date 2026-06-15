<!--
==========================================================================
 Store Map / Store Locator
---------------------------------------------------------------------------
 Purpose:
 Premium store locator page for Vizaje-Nica.

 UX goals:
 - Help users quickly find the nearest Vizaje-Nica store.
 - Provide both list and map views.
 - Improve trust by showing physical store presence.
 - Make mobile navigation easier with list/map tabs.
 - Create a more premium visual experience than the old embedded map.

 Related files:
 - stores-map.css
 - stores-map.js
 - language.json
 - README.md
 - design/

 Map provider:
 - MapLibre GL
 - OpenFreeMap style
 - No paid Mapbox/Google Maps token required.

 Important:
 - JS reads store data from data-* attributes on .vn-store-card.
 - Do not rename data-store-card or data-* attributes without updating JS.
 - Store coordinates must be valid latitude/longitude values.
==========================================================================
-->

<section class="vn-stores">
	<div class="vn-stores__container _container">

		<!-- Page intro -->
		<div class="vn-stores__header">
			<p class="vn-stores__eyebrow">Vizaje-Nica</p>

			<h1 class="vn-stores__title">
				<?= $page_name ?>
			</h1>

			<p class="vn-stores__text">
				Выберите ближайший магазин Vizaje-Nica в Кишинёве.
			</p>
		</div>

		<!-- Trust / feature row -->
		<div class="vn-stores__features">
			<div>12 магазинов в Кишинёве</div>
			<div>100% оригинальная продукция</div>
			<div>Тестирование в магазинах</div>
		</div>

		<!--
		==========================================================================
		 Mobile view switcher
		---------------------------------------------------------------------------
		 Allows users to switch between:
		 - store list
		 - map view

		 JS toggles .is-map-view / .is-list-view on .vn-stores.
		==========================================================================
		-->
		<div class="vn-stores__mobile-tabs" data-store-tabs>
			<button
				type="button"
				class="vn-stores__mobile-tab is-active"
				data-store-view="list"
			>
				Списком
			</button>

			<button
				type="button"
				class="vn-stores__mobile-tab"
				data-store-view="map"
			>
				На карте
			</button>
		</div>

		<div class="vn-stores__layout">

			<!--
			==========================================================================
			 Store list
			---------------------------------------------------------------------------
			 PHP renders all stores from backend.

			 Important:
			 JS reads the following data attributes:
			 - data-index
			 - data-title
			 - data-address
			 - data-time
			 - data-phone
			 - data-lat
			 - data-lng
			==========================================================================
			-->
			<div class="vn-stores__list">
				<?php foreach ($stores as $index => $store) {
					$crd = !empty($store->coords) ? $store->coords : '47.0183674,28.8516902';
					$ca = explode(',', $crd);
				?>
					<article
						class="vn-store-card"
						data-store-card
						data-index="<?= $index ?>"
						data-title="<?= htmlspecialchars($store->title) ?>"
						data-address="<?= htmlspecialchars($store->text) ?>"
						data-time="<?= htmlspecialchars($store->desc) ?>"
						data-phone="<?= htmlspecialchars($store->phone) ?>"
						data-lat="<?= trim($ca[0]) ?>"
						data-lng="<?= trim($ca[1]) ?>"
					>
						<div class="vn-store-card__top">
							<h2 class="vn-store-card__title">
								<?= $store->title ?>
							</h2>

							<span class="vn-store-card__number">
								<?= str_pad($index + 1, 2, '0', STR_PAD_LEFT) ?>
							</span>
						</div>

						<p class="vn-store-card__address">
							<?= $store->text ?>
						</p>

						<div class="vn-store-card__meta">
							<div>
								<span><?= WORKING_MODE ?></span>
								<p><?= $store->desc ?></p>
							</div>

							<div>
								<span><?= CONTACT_NUMBER ?></span>

								<a href="tel:<?= str_replace(' ', '', $store->phone) ?>">
									<?= $store->phone ?>
								</a>
							</div>
						</div>

						<!--
							On mobile this button switches to map view and focuses selected store.
							On desktop the whole card can be used to select the store.
						-->
						<button class="vn-store-card__button" type="button">
							Показать на карте
						</button>
					</article>
				<?php } ?>
			</div>

			<!--
			==========================================================================
			 Map area
			---------------------------------------------------------------------------
			 #vnStoresMap is initialized by stores-map.js via MapLibre GL.
			==========================================================================
			-->
			<div class="vn-stores__map-wrap">
				<div id="vnStoresMap" class="vn-stores__map"></div>

				<!-- Selected store glass panel -->
				<div class="vn-map-panel" data-map-panel>
					<div class="vn-map-panel__brand">Vizaje-Nica</div>

					<div class="vn-map-panel__head">
						<h3 class="vn-map-panel__title" data-panel-title></h3>
						<span class="vn-map-panel__mark">V</span>
					</div>

					<p class="vn-map-panel__address" data-panel-address></p>

					<div class="vn-map-panel__meta">
						<div>
							<span>Телефон</span>
							<a href="#" data-panel-phone></a>
						</div>
					</div>

					<a
						href="#"
						target="_blank"
						rel="noopener noreferrer"
						class="vn-map-panel__link"
						data-panel-route
					>
						Построить маршрут
					</a>
				</div>
			</div>

		</div>
	</div>
</section>