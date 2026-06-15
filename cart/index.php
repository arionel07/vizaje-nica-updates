<!--
    Cart drawer module.
    This block is rendered globally so the cart can be opened from any page.
    Required related files:
    - cart.css
    - cart.js
-->

<!-- Background overlay shown when cart drawer is open -->
<div class="cart-overlay"></div>

<!--
    Side cart drawer.
    JS toggles its visible/open state together with .cart-overlay.
-->
<aside class="cart-drawer">

    <!-- Cart header: title + close button -->
    <div class="cart-drawer__head">
        <!-- JS updates product count in the title -->
        <h2 class="cart-drawer__title">Корзина (0)</h2>

        <!-- Close drawer button -->
        <button type="button" class="cart-drawer__close" aria-label="Закрыть корзину">
            <img src="/app/img/icons/close.svg" alt="">
        </button>
    </div>

    <!-- Informational note about promo-code limitations -->
    <div class="cart-drawer__notice">
        <span>ⓘ</span>
        <span>Промокоды не действуют в период скидок и на акционные товары.</span>
    </div>

    <!--
        Cart items container.
        JS reads all .cart-item elements inside this block and recalculates totals.
    -->
    <div class="cart-drawer__body cart-drawer__body_items">

        <!--
            Cart item.
            Required data attributes:
            - data-price: current product price as number
            - data-old-price: old price if product has discount
            - data-discount: 1 if discounted item, 0 otherwise
        -->
        <div class="cart-item" data-price="2050" data-old-price="2890" data-discount="1">
            <a href="#" class="cart-item__image">
                <img src="https://vizaje-nica.com/public/products/667fd1eb87aaf8e162e5aa9e477de174.webp" alt="">
            </a>

            <div class="cart-item__content">
                <div class="cart-item__top">
                    <div>
                        <p class="cart-item__brand">D&G</p>
                        <a href="#" class="cart-item__name">
                            Dolce & Gabbana Light Blue Pour Homme qwfqq qwf qwfq wfqw fqwf qw fqwfqwfqwf
                        </a>
                    </div>

                    <!-- Remove item from cart -->
                    <button type="button" class="cart-item__remove" aria-label="Удалить товар">
                        <img src="/app/img/icons/delete.svg" alt="">
                    </button>
                </div>

                <!-- Product variant information: volume, color, shade, etc. -->
                <p class="cart-item__meta">50 ml</p>

                <div class="cart-item__bottom">
                    <!-- Quantity controls -->
                    <div class="cart-item__qty">
                        <button type="button" class="cart-item__qty-minus" aria-label="Уменьшить количество">−</button>
                        <span class="cart-item__qty-value">1</span>
                        <button type="button" class="cart-item__qty-plus" aria-label="Увеличить количество">+</button>
                    </div>

                    <!-- Item price block -->
                    <div class="cart-item__prices">
                        <span class="cart-item__price">2 050 MDL</span>
                        <span class="cart-item__old-price">2 890 MDL</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cart item without discount -->
        <div class="cart-item" data-price="2300" data-old-price="" data-discount="0">
            <a href="#" class="cart-item__image">
                <img src="https://vizaje-nica.com/public/products/5aa0ac52a35b79a0734b0547d491cd69.webp" alt="">
            </a>

            <div class="cart-item__content">
                <div class="cart-item__top">
                    <div>
                        <p class="cart-item__brand">RUDROSS</p>
                        <a href="#" class="cart-item__name">RUDROSS Vanilla Love Парфюмерная вода</a>
                    </div>

                    <button type="button" class="cart-item__remove" aria-label="Удалить товар">
                        <img src="/app/img/icons/delete.svg" alt="">
                    </button>
                </div>

                <p class="cart-item__meta">100 ml</p>

                <div class="cart-item__bottom">
                    <div class="cart-item__qty">
                        <button type="button" class="cart-item__qty-minus" aria-label="Уменьшить количество">−</button>
                        <span class="cart-item__qty-value">1</span>
                        <button type="button" class="cart-item__qty-plus" aria-label="Увеличить количество">+</button>
                    </div>

                    <div class="cart-item__prices">
                        <span class="cart-item__price">2 300 MDL</span>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <!--
        Empty cart state.
        JS shows this block when there are no .cart-item elements left.
    -->
    <div class="cart-empty-state" style="display:none;">
        <div class="cart-empty__icon">
            <img src="/app/img/icons/cart.svg" alt="">
        </div>

        <p class="cart-empty__title">В корзине пока <br> ничего нет</p>
        <p class="cart-empty__text">
            Добавьте любимые ароматы и начните создавать свою коллекцию.
        </p>

        <a href="/ru/catalog" class="cart-empty__button">Перейти в каталог</a>
    </div>

    <!-- Cart totals and checkout actions -->
    <div class="cart-summary">

        <!-- Free delivery notice -->
        <div class="cart-summary__delivery">
            Бесплатная доставка от <span>500 MDL</span>
        </div>

        <!-- Promo code input -->
        <div class="cart-summary__promo">
            <input type="text" placeholder="Промокод" class="cart-summary__input">
            <button type="button" class="cart-summary__apply">Применить</button>
        </div>

        <!-- JS writes promo success/error message here -->
        <p class="cart-summary__promo-message"></p>

        <div class="cart-summary__row">
            <span>Сумма товаров</span>
            <span class="cart-summary__subtotal-value">0 MDL</span>
        </div>

        <!-- Discount row is shown only when promo discount exists -->
        <div class="cart-summary__row cart-summary__discount" style="display:none;">
            <span>Скидка</span>
            <span class="cart-summary__discount-value">0 MDL</span>
        </div>

        <div class="cart-summary__row">
            <span>Доставка</span>
            <span>Бесплатно</span>
        </div>

        <div class="cart-summary__total">
            <span>Итого</span>
            <span class="cart-summary__total-value">0 MDL</span>
        </div>

        <!-- Checkout page link -->
        <a href="/ru/checkout" class="cart-summary__checkout">Оформить заказ</a>

        <!-- Close drawer and continue browsing -->
        <button type="button" class="cart-summary__continue">
            Продолжить покупки
        </button>
    </div>
</aside>