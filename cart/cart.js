/* ==========================================================================
   Cart drawer module
   --------------------------------------------------------------------------
   Purpose:
   - Opens/closes cart drawer.
   - Controls item quantity.
   - Removes cart items with animation.
   - Recalculates subtotal, discount and total.
   - Handles demo promo-code logic.
   - Shows empty cart state.

   Related files:
   - cart.php
   - cart.css
   - language.json

   Important:
   - This file currently works with static/demo cart items.
   - In production, quantity changes, item removal and promo-code validation
     should be connected to backend/cart API or existing CodeIgniter cart logic.
   ========================================================================== */

/* ==========================================================================
   DOM references
   --------------------------------------------------------------------------
   These selectors are required by the current implementation.
   Do not rename related classes in cart.php without updating this file.
   ========================================================================== */

const cartButton = document.querySelector('.js-cart-open')
const cartDrawer = document.querySelector('.cart-drawer')
const cartOverlay = document.querySelector('.cart-overlay')
const cartClose = document.querySelector('.cart-drawer__close')
const cartContinue = document.querySelector('.cart-summary__continue')

const cartTitle = document.querySelector('.cart-drawer__title')
const cartBody = document.querySelector('.cart-drawer__body_items')
const cartEmpty = document.querySelector('.cart-empty-state')
const cartSummary = document.querySelector('.cart-summary')

const promoInput = document.querySelector('.cart-summary__input')
const promoButton = document.querySelector('.cart-summary__apply')
const promoMessage = document.querySelector('.cart-summary__promo-message')
const discountRow = document.querySelector('.cart-summary__discount')
const discountValue = document.querySelector('.cart-summary__discount-value')
const subtotalValue = document.querySelector('.cart-summary__subtotal-value')
const totalValue = document.querySelector('.cart-summary__total-value')

/* ==========================================================================
   State
   --------------------------------------------------------------------------
   promoApplied controls whether the 10% promo discount is active.
   This is frontend-only demo logic.
   ========================================================================== */

let promoApplied = false

/* ==========================================================================
   Helpers
   ========================================================================== */

/**
 * Format numeric price as Moldovan Leu.
 * Example: 2050 -> "2 050 MDL"
 */
function formatMDL(value) {
	return value.toLocaleString('ru-RU').replace(',', ' ') + ' MDL'
}

/**
 * Get all current cart items from DOM.
 * Used after item removal so totals are always based on current DOM state.
 */
function getCartItems() {
	return Array.from(document.querySelectorAll('.cart-item'))
}

/**
 * Returns true if at least one item already has discount.
 * Promo codes are disabled when discounted products are in the cart.
 */
function hasDiscountProducts() {
	return getCartItems().some(item => item.dataset.discount === '1')
}

/**
 * Read quantity value from a cart item.
 */
function getItemQuantity(item) {
	return Number(item.querySelector('.cart-item__qty-value')?.textContent || 1)
}

/**
 * Update quantity value in cart item.
 */
function setItemQuantity(item, quantity) {
	const qtyValue = item.querySelector('.cart-item__qty-value')
	if (qtyValue) qtyValue.textContent = quantity
}

/**
 * Recalculate and update visual item price based on quantity.
 */
function updateItemPrice(item) {
	const price = Number(item.dataset.price || 0)
	const quantity = getItemQuantity(item)
	const total = price * quantity
	const priceEl = item.querySelector('.cart-item__price')

	if (priceEl) priceEl.textContent = formatMDL(total)
}

/* ==========================================================================
   Drawer actions
   ========================================================================== */

/**
 * Open cart drawer and lock page scroll.
 */
function openCart() {
	cartDrawer.classList.add('is-open')
	cartOverlay.classList.add('is-open')
	document.body.style.overflow = 'hidden'
}

/**
 * Close cart drawer and restore page scroll.
 */
function closeCart() {
	cartDrawer.classList.remove('is-open')
	cartOverlay.classList.remove('is-open')
	document.body.style.overflow = ''
}

/* ==========================================================================
   Promo messages
   ========================================================================== */

/**
 * Remove promo message text and visual status.
 */
function clearPromoMessage() {
	if (!promoMessage) return

	promoMessage.textContent = ''
	promoMessage.classList.remove('is-error', 'is-success')
}

/**
 * Show promo message.
 *
 * @param {string} text - Message text.
 * @param {'success'|'error'} type - Message visual state.
 */
function showPromoMessage(text, type) {
	if (!promoMessage) return

	promoMessage.textContent = text
	promoMessage.classList.remove('is-error', 'is-success')
	promoMessage.classList.add(type === 'success' ? 'is-success' : 'is-error')
}

/* ==========================================================================
   Totals calculation
   ========================================================================== */

/**
 * Recalculate:
 * - item prices
 * - product count
 * - subtotal
 * - promo discount
 * - total
 * - empty state
 *
 * Notes:
 * - Discount is currently 10% for promo code VIZAJE10.
 * - Promo is automatically disabled if discounted products are present.
 */
function updateCartTotals() {
	const items = getCartItems()

	let subtotal = 0
	let count = 0

	items.forEach(item => {
		const price = Number(item.dataset.price || 0)
		const quantity = getItemQuantity(item)

		subtotal += price * quantity
		count += quantity

		updateItemPrice(item)
	})

	if (hasDiscountProducts()) {
		promoApplied = false
	}

	const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
	const total = subtotal - discount

	if (cartTitle) cartTitle.textContent = `Корзина (${count})`
	if (subtotalValue) subtotalValue.textContent = formatMDL(subtotal)
	if (totalValue) totalValue.textContent = formatMDL(total)

	if (discountRow && discountValue) {
		if (promoApplied && discount > 0) {
			discountRow.style.display = 'flex'
			discountValue.textContent = '-' + formatMDL(discount)
		} else {
			discountRow.style.display = 'none'
			discountValue.textContent = '0 MDL'
		}
	}

	/**
	 * Empty cart handling.
	 * If there are no items left:
	 * - hide items list
	 * - hide summary block
	 * - show empty state
	 */
	if (items.length === 0) {
		if (cartBody) cartBody.style.display = 'none'
		if (cartSummary) cartSummary.style.display = 'none'
		if (cartEmpty) cartEmpty.style.display = 'flex'
		if (cartTitle) cartTitle.textContent = 'Корзина (0)'
	} else {
		if (cartBody) cartBody.style.display = 'block'
		if (cartSummary) cartSummary.style.display = 'block'
		if (cartEmpty) cartEmpty.style.display = 'none'
	}
}

/* ==========================================================================
   Cart item events
   ========================================================================== */

/**
 * Bind quantity and remove events to every current cart item.
 *
 * Important:
 * If cart items are later injected dynamically from backend/AJAX,
 * this function should be called again or rewritten with event delegation.
 */
function bindCartItemEvents() {
	getCartItems().forEach(item => {
		const minus = item.querySelector('.cart-item__qty-minus')
		const plus = item.querySelector('.cart-item__qty-plus')
		const remove = item.querySelector('.cart-item__remove')

		if (minus) {
			minus.addEventListener('click', function () {
				const current = getItemQuantity(item)

				if (current <= 1) return

				setItemQuantity(item, current - 1)
				updateCartTotals()
			})
		}

		if (plus) {
			plus.addEventListener('click', function () {
				const current = getItemQuantity(item)

				setItemQuantity(item, current + 1)
				updateCartTotals()
			})
		}

		if (remove) {
			remove.addEventListener('click', function () {
				item.classList.add('is-removing')

				setTimeout(() => {
					item.remove()
					promoApplied = false
					clearPromoMessage()
					updateCartTotals()
				}, 200)
			})
		}
	})
}

/* ==========================================================================
   Drawer open / close events
   ========================================================================== */

if (cartButton && cartDrawer && cartOverlay) {
	cartButton.addEventListener('click', function (e) {
		e.preventDefault()
		openCart()
	})

	cartOverlay.addEventListener('click', closeCart)

	if (cartClose) cartClose.addEventListener('click', closeCart)
	if (cartContinue) cartContinue.addEventListener('click', closeCart)

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') closeCart()
	})
}

/* ==========================================================================
   Promo-code demo logic
   --------------------------------------------------------------------------
   Current frontend-only rule:
   - VIZAJE10 gives 10% discount.
   - Promo cannot be applied if cart contains discounted products.

   Production note:
   Promo validation should be performed on backend.
   Frontend should only display backend response.
   ========================================================================== */

if (promoButton) {
	promoButton.addEventListener('click', function () {
		const promo = promoInput.value.trim().toUpperCase()

		if (!promo) {
			promoApplied = false
			updateCartTotals()
			showPromoMessage('Введите промокод.', 'error')
			return
		}

		if (hasDiscountProducts()) {
			promoApplied = false
			updateCartTotals()
			showPromoMessage(
				'Промокод нельзя применить к товару со скидкой.',
				'error'
			)
			return
		}

		if (promo === 'VIZAJE10') {
			promoApplied = true
			updateCartTotals()
			showPromoMessage('Промокод применён: скидка 10%.', 'success')
		} else {
			promoApplied = false
			updateCartTotals()
			showPromoMessage('Промокод недействителен.', 'error')
		}
	})
}

/* ==========================================================================
   Init
   ========================================================================== */

bindCartItemEvents()
updateCartTotals()
