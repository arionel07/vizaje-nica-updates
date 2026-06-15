<!--
==========================================================================
 Checkout / Payments Page
---------------------------------------------------------------------------
 Purpose:
 New checkout flow for Vizaje-Nica.

 UX goals:
 - Split checkout into clear 3 steps.
 - Reduce visual overload compared to the old long form.
 - Make delivery, recipient and payment choices easier to understand.
 - Improve mobile checkout experience.
 - Reduce checkout abandonment.

 Related files:
 - payments.css
 - payments.js
 - language.json
 - README.md
 - design/

 Important:
 - Selected delivery method should be saved with the order.
 - Selected store should be visible in admin order details.
 - Selected confirmation type should be visible in admin order details:
   phone call or SMS.
 - Success modal should be shown after successful order creation.
==========================================================================
-->

<header class="checkout-header">
	<a href="/<?= $lclang ?>/catalog" class="checkout-header__back" aria-label="Вернуться в каталог">←</a>

	<a href="/<?= $lclang ?>" class="checkout-header__logo" aria-label="Vizaje-Nica">
		<img src="/app/img/logo_v.webp" alt="Vizaje-Nica">
	</a>

	<div class="checkout-header__lang">
		<a href="/ru/checkout">RU</a>
		<a href="/ro/checkout">RO</a>
	</div>
</header>

<section class="checkout-page">
	<div class="checkout-page__container">

		<div class="checkout-page__main">
			<h1>Оформление заказа</h1>

			<!-- Validation alert shown when required checkout data is missing -->
			<div class="checkout-alert" id="checkoutAlert">
				<strong>Проверьте данные заказа</strong>
				<span>Заполните обязательные поля, чтобы продолжить оформление.</span>
			</div>

			<!--
			==========================================================================
			 STEP 1: Delivery
			---------------------------------------------------------------------------
			 User selects delivery method.

			 Current methods:
			 - pickup
			 - courier
			 - express
			 - mail

			 Notes:
			 - Pickup stores are currently test data.
			 - All 12 Vizaje-Nica stores should be added later.
			 - Selected store must be stored in order data and shown in admin.
			==========================================================================
			-->
			<section class="checkout-step is-open" data-step="delivery">
				<button type="button" class="checkout-step__head">
					<span>1 / 3</span>
					<strong>Адрес и способ доставки</strong>
					<em>⌃</em>
				</button>

				<div class="checkout-step__body">
					<div class="checkout-step__body-inner">

						<div class="checkout-options checkout-options--delivery">

							<!-- Pickup from store -->
							<button type="button" class="checkout-option is-active" data-delivery="pickup">
								<span class="checkout-option__head">
									<span class="checkout-option__radio"></span>

									<span class="checkout-option__icon">
										<img src="/app/img/icons-2/store.svg" alt="">
									</span>

									<span class="checkout-option__content">
										<span class="checkout-option__title">Самовывоз из магазина</span>
										<span class="checkout-option__text">Бесплатно</span>
									</span>
								</span>

								<span class="checkout-option__expand">
									<?php $this->load->view('pages/main/stores'); ?>
								</span>
							</button>

							<!-- Courier delivery -->
							<button type="button" class="checkout-option" data-delivery="courier">
								<span class="checkout-option__head">
									<span class="checkout-option__radio"></span>

									<span class="checkout-option__icon">
										<img src="/app/img/icons-2/karobka.svg" alt="">
									</span>

									<span class="checkout-option__content">
										<span class="checkout-option__title">Курьерская доставка</span>
										<span class="checkout-option__text">Бесплатно от 500 MDL</span>
									</span>
								</span>

								<span class="checkout-option__expand">
									<span class="checkout-form">
										<label class="checkout-field">
											<img src="/app/img/icons-2/location.svg" alt="">
											<input type="text" placeholder="Населённый пункт">
										</label>

										<label class="checkout-field">
											<img src="/app/img/icons-2/home.svg" alt="">
											<input type="text" placeholder="Адрес">
										</label>

										<span class="checkout-form__grid">
											<input type="text" placeholder="Дом">
											<input type="text" placeholder="Подъезд">
											<input type="text" placeholder="Квартира">
										</span>
									</span>
								</span>
							</button>

							<!-- Express delivery -->
							<button type="button" class="checkout-option" data-delivery="express">
								<span class="checkout-option__head">
									<span class="checkout-option__radio"></span>

									<span class="checkout-option__icon">
										<img src="/app/img/icons-2/fast-truck.svg" alt="">
									</span>

									<span class="checkout-option__content">
										<span class="checkout-option__title">Срочная доставка</span>
										<span class="checkout-option__text">В течение 3 часов · 100 MDL</span>
									</span>
								</span>

								<span class="checkout-option__expand">
									<span class="checkout-form">
										<span class="checkout-delivery-panel__notice">
											Срочная доставка доступна в пределах Кишинёва. Стоимость: 100 MDL.
										</span>

										<label class="checkout-field">
											<img src="/app/img/icons-2/location.svg" alt="">
											<input type="text" placeholder="Населённый пункт">
										</label>

										<label class="checkout-field">
											<img src="/app/img/icons-2/home.svg" alt="">
											<input type="text" placeholder="Адрес">
										</label>

										<span class="checkout-form__grid">
											<input type="text" placeholder="Дом">
											<input type="text" placeholder="Подъезд">
											<input type="text" placeholder="Квартира">
										</span>
									</span>
								</span>
							</button>

							<!--
							Mail delivery
							---------------------------------------------------------------------------
							Important:
							This block is a future plan and should not be implemented as final logic yet.

							Notes for developers:
							- Postal delivery flow still needs business confirmation.
							- Tariffs, operators and delivery rules must be clarified.
							- Keep the component prepared, but do not connect it to final order logic
							  until requirements are approved.
							-->
							<!-- <button type="button" class="checkout-option" data-delivery="mail">
								<span class="checkout-option__head">
									<span class="checkout-option__radio"></span>

									<span class="checkout-option__icon">
										<img src="/app/img/icons-2/post-office-svgrepo-com.svg" alt="">
									</span>

									<span class="checkout-option__content">
										<span class="checkout-option__title">Доставка почтой</span>
										<span class="checkout-option__text">По тарифам службы доставки</span>
									</span>
								</span>

								<span class="checkout-option__expand">
									<?php $this->load->view('pages/main/post'); ?>
								</span>
							</button>

						</div> -->

						<button type="button" class="checkout-step__next" data-next-step="recipient">
							Дальше
						</button>

					</div>
				</div>
			</section>

			<!--
			==========================================================================
			 STEP 2: Recipient
			---------------------------------------------------------------------------
			 User enters contact data and chooses confirmation method.

			 Important:
			 - Phone is required.
			 - Email can be required depending on business logic.
			 - Confirmation type must be saved in admin:
			   phone call or SMS.
			 - Manager should see this preference before contacting customer.
			==========================================================================
			-->
			<section class="checkout-step" data-step="recipient">
				<button type="button" class="checkout-step__head">
					<span>2 / 3</span>
					<strong>Получатель</strong>
					<em>⌃</em>
				</button>

				<div class="checkout-step__body">
					<div class="checkout-step__body-inner">

						<div class="checkout-form">
							<label class="checkout-field">
								<img src="/app/img/icons-2/phone.svg" alt="">
								<input
									type="tel"
									name="phone"
									class="checkout-input js-phone-mask"
									placeholder="Телефон"
									inputmode="numeric"
									autocomplete="tel"
								>
							</label>

							<label class="checkout-field">
								<img src="/app/img/icons-2/mail.svg" alt="">
								<input
									type="email"
									name="email"
									class="checkout-input js-email-validate"
									placeholder="example@gmail.com"
									autocomplete="email"
								>
							</label>

							
						</div>

						<!-- Confirmation preference: must be saved with order and shown in admin -->
						<div class="checkout-confirm">
							<label class="checkout-radio">
								<input type="radio" name="confirm_type" value="call" checked>
								<span></span>
								<p>Связаться со мной по телефону</p>
							</label>

							<label class="checkout-radio">
								<input type="radio" name="confirm_type" value="sms">
								<span></span>
								<p>Отправить SMS</p>
							</label>
						</div>

						<div class="checkout-agreements">
							<label class="checkout-checkbox">
								<input type="checkbox" required>
								<span></span>
								<p>Я согласен с <a href="#">Условиями и положениями</a>.</p>
							</label>

							<label class="checkout-checkbox">
								<input type="checkbox" checked>
								<span></span>
								<p>Я согласен получать рекламные рассылки об акциях и скидках.</p>
							</label>
						</div>

						<button type="button" class="checkout-step__next" data-next-step="payment">
							Дальше
						</button>

					</div>
				</div>
			</section>

			<!--
			==========================================================================
			 STEP 3: Payment
			---------------------------------------------------------------------------
			 User selects payment method.

			 Current methods:
			 - cash
			 - card-courier
			 - online

			 Notes:
			 - Online payment redirects to Paynet after order confirmation.
			 - Name and surname fields are shown only for online payment.
			==========================================================================
			-->
			<section class="checkout-step" data-step="payment">
				<button type="button" class="checkout-step__head">
					<span>3 / 3</span>
					<strong>Способ оплаты</strong>
					<em>⌃</em>
				</button>

				<div class="checkout-step__body">
					<div class="checkout-step__body-inner">

						<div class="checkout-options">

							<button type="button" class="checkout-option is-active" data-payment="cash">
								<span class="checkout-option__head">
									<span class="checkout-option__radio"></span>
									<span class="checkout-option__icon">
										<img src="/app/img/icons-2/cash.svg" alt="">
									</span>
									<span class="checkout-option__title">Наличными при получении</span>
								</span>
							</button>

							<button type="button" class="checkout-option" data-payment="card-courier">
								<span class="checkout-option__head">
									<span class="checkout-option__radio"></span>
									<span class="checkout-option__icon">
										<img src="/app/img/icons-2/curier.svg" alt="">
									</span>
									<span class="checkout-option__title">Оплата картой курьеру</span>
								</span>
							</button>

							<button type="button" class="checkout-option checkout-option__second" data-payment="online">
								<span class="checkout-option__head">
									<span class="checkout-option__radio"></span>

									<span class="checkout-option__icon checkout-option__icon-cart">
										<img src="/app/img/icons-2/cart.svg" alt="">
									</span>

									<span class="checkout-option__title">Онлайн картой</span>

									<span class="checkout-option__icon-second">
										<img src="/app/img/icons-2/mastercard.svg" alt="">
										<img src="/app/img/icons-2/visa.svg" alt="">
										<img src="/app/img/icons-2/google-pay.svg" alt="">
										<img src="/app/img/icons-2/apple-pay.svg" alt="">
									</span>
								</span>
							</button>

							<!-- Online payment fields: visible only when online payment is selected -->
							<div class="checkout-online-fields">
								<div class="checkout-form">
									<label class="checkout-field">
										<img src="/app/img/icons-2/man.svg" alt="">
										<input type="text" placeholder="Фамилия">
									</label>

									<label class="checkout-field">
										<img src="/app/img/icons-2/man.svg" alt="">
										<input type="text" placeholder="Имя">
									</label>
								</div>
							</div>

						</div>

					</div>
				</div>
			</section>
		</div>

		<!--
		==========================================================================
		 Order Summary
		---------------------------------------------------------------------------
		 Sticky summary on desktop.
		 On mobile it should move below checkout steps.

		 Important:
		 - Delivery price must update based on selected delivery method.
		 - Total value must update after delivery/payment changes.
		==========================================================================
		-->
		<aside class="checkout-summary">
			<h2>Сумма заказа</h2>

			<div class="checkout-summary__row">
				<span>Товары</span>
				<span class="checkout-summary__subtotal-value">2 500 MDL</span>
			</div>

			<div class="checkout-summary__row">
				<span>Доставка</span>
				<span class="checkout-summary__delivery-value">Бесплатно</span>
			</div>

			<div class="checkout-summary__total">
				<strong>Итого</strong>
				<strong class="checkout-summary__total-value">2 500 MDL</strong>
			</div>

			<button type="button" class="checkout-summary__button">
				Завершить оформление
			</button>

			<p class="checkout-summary__note">
				При онлайн оплате после подтверждения заказа вы будете перенаправлены на страницу Paynet.
			</p>
		</aside>

	</div>
</section>

<!--
==========================================================================
 Order Success Modal
---------------------------------------------------------------------------
 Purpose:
 Shown after successful order creation.

 Important:
 - For cash/card-to-courier payment: show after order creation.
 - For online payment: show after successful Paynet redirect.
 - This modal confirms that the order was accepted and manager will contact user.
==========================================================================
-->

<div class="order-success-modal" id="orderSuccessModal">
	<div class="order-success-modal__overlay"></div>

	<div class="order-success-modal__box">
		<button type="button" class="order-success-modal__close" aria-label="Закрыть">×</button>

		<div class="order-success-modal__icon">
			<span>✓</span>
		</div>

		<p class="order-success-modal__eyebrow">Спасибо за ваш заказ</p>

		<h2>Мы уже начали заботиться о нём</h2>

		<p class="order-success-modal__text">
			Ваш заказ успешно принят. Менеджер Vizaje-Nica скоро свяжется с вами,
			чтобы подтвердить детали и помочь с доставкой.
		</p>

		<button type="button" class="order-success-modal__button">
			Продолжить покупки
		</button>
	</div>
</div>