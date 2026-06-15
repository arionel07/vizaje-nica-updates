/* ==========================================================================
   Checkout / Payments v2
   --------------------------------------------------------------------------
   Purpose:
   Controls the new 3-step checkout flow.

   UX goals:
   - Keep checkout simple and structured.
   - Open only the relevant step.
   - Update order summary when delivery changes.
   - Show online payment fields only when needed.
   - Validate required fields before order completion.
   - Show clear errors and scroll user to the problem.
   - Redirect online payments to Paynet test page.
   - Redirect cash/card-courier orders to homepage with success state.

   Related files:
   - payments.php
   - payments.css
   - language.json
   - README.md
   - design/

   Important:
   - Current subtotal is demo/static.
   - Real subtotal should come from backend/cart.
   - Mail delivery is prepared as future feature.
   - Pickup stores are currently test data.
   - Selected store and confirmation type must be saved in order/admin.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
	/* ======================================================================
	   State
	   ====================================================================== */

	const subtotal = 2500

	let currentDelivery = 'pickup'
	let currentPayment = 'cash'

	/* ======================================================================
	   DOM References
	   ====================================================================== */

	const deliveryValue = document.querySelector(
		'.checkout-summary__delivery-value'
	)

	const subtotalValue = document.querySelector(
		'.checkout-summary__subtotal-value'
	)

	const totalValue = document.querySelector('.checkout-summary__total-value')
	const submitButton = document.querySelector('.checkout-summary__button')

	const successModal = document.querySelector('#orderSuccessModal')
	const successClose = document.querySelector('.order-success-modal__close')
	const successOverlay = document.querySelector('.order-success-modal__overlay')
	const successButton = document.querySelector('.order-success-modal__button')

	/* ======================================================================
	   Helpers
	   ====================================================================== */

	function formatMDL(value) {
		return value.toLocaleString('ru-RU') + ' MDL'
	}

	function getDeliveryPrice(type) {
		switch (type) {
			case 'express':
				return 100

			default:
				return 0
		}
	}

	function getDeliveryText(type) {
		switch (type) {
			case 'express':
				return '100 MDL'

			case 'mail':
				return 'По тарифу'

			default:
				return 'Бесплатно'
		}
	}

	/* ======================================================================
	   Checkout Alert
	   ====================================================================== */

	function showCheckoutAlert() {
		const alert = document.querySelector('#checkoutAlert')

		if (!alert) return

		alert.classList.add('is-open')
	}

	function hideCheckoutAlert() {
		const alert = document.querySelector('#checkoutAlert')

		if (!alert) return

		alert.classList.remove('is-open')
	}

	/* ======================================================================
	   Summary
	   ----------------------------------------------------------------------
	   Updates order summary based on selected delivery.
	   In production subtotal must come from real cart/backend.
	   ====================================================================== */

	function updateSummary() {
		const deliveryPrice = getDeliveryPrice(currentDelivery)

		if (subtotalValue) {
			subtotalValue.textContent = formatMDL(subtotal)
		}

		if (deliveryValue) {
			deliveryValue.textContent = getDeliveryText(currentDelivery)
		}

		if (totalValue) {
			totalValue.textContent = formatMDL(subtotal + deliveryPrice)
		}
	}

	/* ======================================================================
	   Success Modal
	   ----------------------------------------------------------------------
	   Used after successful order creation.
	   For online payments it should appear after successful Paynet redirect.
	   ====================================================================== */

	function openSuccessModal() {
		if (!successModal) return

		successModal.classList.add('is-open')
		document.body.style.overflow = 'hidden'
	}

	function closeSuccessModal() {
		if (!successModal) return

		successModal.classList.remove('is-open')
		document.body.style.overflow = ''
	}

	/* ======================================================================
	   Steps
	   ====================================================================== */

	function openStep(stepName) {
		document.querySelectorAll('.checkout-step').forEach(step => {
			const isTarget = step.dataset.step === stepName

			if (step.classList.contains('is-open') && !isTarget) {
				step.classList.add('is-completed')
			}

			step.classList.toggle('is-open', isTarget)
		})
	}

	/* ======================================================================
	   Validation Helpers
	   ====================================================================== */

	function clearErrors() {
		hideCheckoutAlert()

		document
			.querySelectorAll('.checkout-field__error')
			.forEach(error => error.remove())

		document
			.querySelectorAll('.checkout-field')
			.forEach(field => field.classList.remove('is-error'))

		document
			.querySelectorAll('.checkout-checkbox')
			.forEach(box => box.classList.remove('is-error'))

		document
			.querySelectorAll('.checkout-step')
			.forEach(step => step.classList.remove('has-error'))
	}

	function markStepError(element) {
		const step = element.closest('.checkout-step')

		if (!step) return

		step.classList.add('has-error')
		openStep(step.dataset.step)
	}

	function setFieldError(input, text) {
		if (!input) return

		const field = input.closest('.checkout-field')

		if (!field) return

		field.classList.add('is-error')
		markStepError(field)

		const oldError = field.querySelector('.checkout-field__error')

		if (oldError) oldError.remove()

		const error = document.createElement('div')

		error.className = 'checkout-field__error'
		error.textContent = text

		field.append(error)
	}

	function setCheckboxError(input) {
		const checkbox = input.closest('.checkout-checkbox')

		if (!checkbox) return

		checkbox.classList.add('is-error')
		markStepError(checkbox)
	}

	function scrollToFirstError() {
		const firstError = document.querySelector(
			'.checkout-field.is-error, .checkout-checkbox.is-error, .checkout-alert.is-open'
		)

		if (!firstError) return

		firstError.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		})
	}

	/* ======================================================================
	   Delivery Fields
	   ----------------------------------------------------------------------
	   Returns inputs that must be filled based on selected delivery method.

	   Notes:
	   - pickup has no address fields.
	   - mail is future feature and should not be connected as final logic
	     until business requirements are approved.
	   ====================================================================== */

	function getCurrentDeliveryFields() {
		if (currentDelivery === 'pickup') {
			return []
		}

		if (currentDelivery === 'courier') {
			return document.querySelectorAll(
				'.checkout-option[data-delivery="courier"] .checkout-option__expand input'
			)
		}

		if (currentDelivery === 'express') {
			return document.querySelectorAll(
				'.checkout-option[data-delivery="express"] .checkout-option__expand input'
			)
		}

		if (currentDelivery === 'mail') {
			return document.querySelectorAll(
				'.checkout-option[data-delivery="mail"] .checkout-option__expand input'
			)
		}

		return []
	}

	/* ======================================================================
	   Checkout Validation
	   ====================================================================== */

	function validateCheckout() {
		clearErrors()

		let valid = true

		/* Delivery validation */
		const deliveryFields = getCurrentDeliveryFields()

		deliveryFields.forEach(input => {
			if (!input.value.trim()) {
				setFieldError(input, 'Заполните поле доставки')
				valid = false
			}
		})

		/* Recipient validation */
		const phone = document.querySelector('input[type="tel"]')
		const email = document.querySelector('input[type="email"]')

		if (!phone || phone.value.trim().length < 6) {
			setFieldError(phone, 'Введите номер телефона')
			valid = false
		}

		if (!email || !email.value.includes('@')) {
			setFieldError(email, 'Введите корректный Email')
			valid = false
		}

		/* Online payment validation */
		if (currentPayment === 'online') {
			document
				.querySelectorAll('.checkout-online-fields input')
				.forEach(input => {
					if (!input.value.trim()) {
						setFieldError(input, 'Заполните поле')
						valid = false
					}
				})
		}

		/* Required agreement validation */
		const requiredCheckbox = document.querySelector(
			'.checkout-checkbox input[required]'
		)

		if (requiredCheckbox && !requiredCheckbox.checked) {
			setCheckboxError(requiredCheckbox)
			valid = false
		}

		if (!valid) {
			showCheckoutAlert()

			setTimeout(function () {
				scrollToFirstError()
			}, 120)
		}

		return valid
	}

	/* ======================================================================
	   Delivery & Payment Options
	   ====================================================================== */

	document.querySelectorAll('.checkout-option').forEach(option => {
		option.addEventListener('click', function () {
			const group = option.closest('.checkout-options')

			if (group) {
				group
					.querySelectorAll('.checkout-option')
					.forEach(item => item.classList.remove('is-active'))
			}

			option.classList.add('is-active')

			if (option.dataset.delivery) {
				currentDelivery = option.dataset.delivery
				updateSummary()
			}

			if (option.dataset.payment) {
				currentPayment = option.dataset.payment

				const onlineFields = document.querySelector('.checkout-online-fields')

				if (onlineFields) {
					onlineFields.classList.toggle(
						'is-visible',
						currentPayment === 'online'
					)
				}
			}
		})
	})

	/* ======================================================================
	   Pickup Store / Mail Operator Selection
	   ----------------------------------------------------------------------
	   Used for nested radio-like cards inside delivery panels.

	   Important:
	   - Selected pickup store must be saved with order.
	   - Selected pickup store must be displayed in admin order details.
	   - Selected confirmation method should also be shown in admin.
	   ====================================================================== */

	document.querySelectorAll('.checkout-pick-list').forEach(list => {
		const items = list.querySelectorAll('.checkout-pick-item')

		items.forEach(item => {
			item.addEventListener('click', function () {
				items.forEach(el => el.classList.remove('is-active'))

				item.classList.add('is-active')

				const input = item.querySelector('input')

				if (input) input.checked = true
			})
		})
	})

	/* ======================================================================
	   Step Toggle
	   ====================================================================== */

	document.querySelectorAll('.checkout-step__head').forEach(head => {
		head.addEventListener('click', function () {
			const step = head.closest('.checkout-step')

			if (!step) return

			step.classList.toggle('is-open')
		})
	})

	document.querySelectorAll('.checkout-step__next').forEach(button => {
		button.addEventListener('click', function () {
			openStep(button.dataset.nextStep)
		})
	})

	/* ======================================================================
	   Submit Checkout
	   ----------------------------------------------------------------------
	   Current flow:
	   - Online payment redirects to Paynet test page.
	   - Cash/card-courier stores success flag and redirects to homepage.

	   Production flow:
	   - Create order in backend.
	   - Save selected delivery.
	   - Save selected pickup store.
	   - Save selected confirmation type.
	   - Save payment method.
	   - Redirect to Paynet only after order is created.
	   ====================================================================== */

	if (submitButton) {
		submitButton.addEventListener('click', function () {
			if (!validateCheckout()) return

			if (currentPayment === 'online') {
				window.location.href = '/ru/paynet-test'
				return
			}

			sessionStorage.setItem('vizajeOrderSuccess', '1')
			window.location.href = '/ru'
		})
	}

	/* ======================================================================
	   Success Modal Events
	   ====================================================================== */

	if (successClose) {
		successClose.addEventListener('click', closeSuccessModal)
	}

	if (successOverlay) {
		successOverlay.addEventListener('click', closeSuccessModal)
	}

	if (successButton) {
		successButton.addEventListener('click', closeSuccessModal)
	}

	/* ======================================================================
	   Init
	   ====================================================================== */

	updateSummary()
})

/* ==========================================================================
   Phone Mask
   --------------------------------------------------------------------------
   Moldova phone format:
   +373 XX XXX XXX

   Important:
   This is frontend formatting only.
   Backend must validate and normalize phone number before saving order.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
	const phoneInput = document.querySelector('.js-phone-mask')

	if (!phoneInput) return

	phoneInput.addEventListener('focus', () => {
		if (!phoneInput.value.trim()) {
			phoneInput.value = '+373 '
		}
	})

	phoneInput.addEventListener('input', () => {
		let digits = phoneInput.value.replace(/\D/g, '')

		if (digits.startsWith('373')) {
			digits = digits.slice(3)
		}

		digits = digits.slice(0, 8)

		let formatted = '+373'

		if (digits.length > 0) {
			formatted += ' ' + digits.slice(0, 2)
		}

		if (digits.length > 2) {
			formatted += ' ' + digits.slice(2, 5)
		}

		if (digits.length > 5) {
			formatted += ' ' + digits.slice(5, 8)
		}

		phoneInput.value = formatted
	})
})
