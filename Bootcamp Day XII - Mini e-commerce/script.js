(($) => {
    'use strict';
    const classes = {
        style: 'custom-style',
        wrapper: 'custom-wrapper',
        container: 'custom-container',
        addToCartButton: 'add-to-cart-btn',
        productCard: 'product-card',
        cartItem: 'cart-item',
        cartIcon: 'cart-icon',
        modal: 'cart-modal',
        modalContent: 'cart-modal-content',
        removeBtn: 'remove-btn',
        clearCartBtn: 'clear-cart-btn',
        closeDetailModalBtn: 'close-detail-modal-btn',
        productDetailModal: 'product-detail-modal',
        searchCartWrapper: 'search-cart-wrapper',
        cartModalTitle: 'cart-modal-title',
        cartItemsContainer: 'cart-items-container',
        totalPrice: 'total-price',
        cartButtons: 'cart-buttons',
        continueShoppingBtn: 'continue-shopping-btn',
        tempModal: 'custom-temp-modal',
        productDetailPrice: 'product-detail-price',
        cartItemsHeader: 'cart-items-header',
        cartItemsHeaderSpan: 'cart-items-header-span',
        titleHeader: 'title-header'
    };
    const selectors = {
        style: `.${classes.style}`,
        wrapper: `.${classes.wrapper}`,
        container: `.${classes.container}`,
        addToCartButton: `.${classes.addToCartButton}`,
        appendLocation: '#container',
        productList: '#productList',
        searchInput: '#searchInput',
        cartIcon: `.${classes.cartIcon}`,
        modal: `.${classes.modal}`,
        modalContent: `.${classes.modalContent}`,
        clearCartBtn: `.${classes.clearCartBtn}`,
        closeDetailModalBtn: `.${classes.closeDetailModalBtn}`,
        productDetailModal: `.${classes.productDetailModal}`,
        searchCartWrapper: `.${classes.searchCartWrapper}`,
        cartModalTitle: `.${classes.cartModalTitle}`,
        cartItemsContainer: `.${classes.cartItemsContainer}`,
        totalPrice: `.${classes.totalPrice}`,
        cartButtons: `.${classes.cartButtons}`,
        continueShoppingBtn: `.${classes.continueShoppingBtn}`,
        tempModal: `.${classes.tempModal}`,
        productDetailPrice: `.${classes.productDetailPrice}`,
        cartItemsHeader: `.${classes.cartItemsHeader}`,
        cartItemsHeaderSpan: `.${classes.cartItemsHeaderSpan}`,
        titleHeader: `.${classes.titleHeader}`
    };

    const cart = new Map();
    const self = {};

    self.init = () => {
        self.reset();
        self.buildCSS();
        self.buildHTML();
        self.loadProducts();
        self.loadCartFromStorage();
        self.setEvents();
    };

    self.reset = () => {
        $(selectors.style).remove();
        $(selectors.wrapper).remove();
        $(document).off('.eventListener');
        $(`.${classes.productDetailModal}`).remove();
        $(`#cartModal`).remove();
    };

    self.buildCSS = () => {
        const customStyle = `
    <style class="${classes.style}">
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&display=swap');
        ${selectors.wrapper} {
            display: flex;
            justify-content: center;
            padding: 10px;
            background: linear-gradient(to bottom right, #ffffff, #e0e0e0);
        }
        ${selectors.container} {
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
            color: #000;
            width: 100%;
        }
        ${selectors.addToCartButton} {
            padding: 10px 20px;
            background: linear-gradient(135deg, #00f2fe, #4facfe);
            color: #fff;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 0 10px rgba(79, 172, 254, 0.6), 0 0 20px rgba(0, 242, 254, 0.4);
            transition: all 0.3s ease;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        ${selectors.addToCartButton}:hover {
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            box-shadow: 0 0 15px rgba(0, 242, 254, 0.9), 0 0 30px rgba(79, 172, 254, 0.7);
            transform: translateY(-2px);
        }
        .${classes.productCard} {
            font-family: 'Poppins', sans-serif;
            border: none;
            border-radius: 20px;
            padding: 16px;
            margin: 10px;
            width: 220px;
            height: 360px;
            box-sizing: border-box;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            background: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            cursor: pointer;
        }
        .${classes.productCard}:hover {
            transform: scale(1.035);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        .${classes.productCard} img {
            width: 100%;
            height: 120px;
            object-fit: contain;
            display: block;
            margin: 0 auto 10px;
            border-radius: 12px;
        }
        .${classes.productCard} h3 {
            font-size: 14px;
            margin: 10px 0;
            height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .${classes.productCard} .price {
            font-weight: bold;
            margin-bottom: 10px;
            color: #3498db;
            font-size: 16px;
        }
        .${classes.cartItem} {
            border-bottom: 1px solid #ccc;
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #555;
        }
        .${classes.cartItem} img {
            width: 40px;
            height: auto;
            flex-shrink: 0;
            border-radius: 8px;
        }
        .${classes.cartItem} span.title {
            flex: 2;
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .${classes.cartItem} span.price,
        .${classes.cartItem} span.qty,
        .${classes.cartItem} span.subtotal {
            flex: 1;
            text-align: center;
            font-weight: 500;
        }
        .${classes.cartItem} button.${classes.removeBtn} {
            flex: 0;
            background: transparent;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #333;
            padding: 0 5px;
            line-height: 1;
            transition: color 0.2s ease;
        }
        .${classes.cartItem} button.${classes.removeBtn}:hover {
            color: red;
        }
        ${selectors.cartIcon} {
            background-color: #3498db;
            color: white;
            padding: 10px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        ${selectors.cartIcon} .cart-count {
            position: absolute;
            top: -5px;
            right: -5px;
            background: red;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 12px;
            font-weight: bold;
        }
        ${selectors.modal} {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            overflow-y: auto;
            background-color: rgba(0,0,0,0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        }
        ${selectors.modalContent} {
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            width: 100%;
            max-width: 700px;
            max-height: 80vh;
            overflow-y: auto;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            color: #444;
        }
        ${selectors.cartItemsHeader} {
            display: flex;
            padding: 10px 15px;
            font-weight: 700;
            border-bottom: 2px solid #ccc;
            gap: 10px;
            font-size: 14px;
        }
        ${selectors.cartItemsHeaderSpan} {
            flex: 1;
            text-align: center;
        }
        ${selectors.titleHeader} {
            flex: 2;
            text-align: left;
        }
        ${selectors.cartItemsContainer} {
            flex-grow: 1;
            overflow-y: auto;
            margin-top: 10px;
        }
        ${selectors.totalPrice} {
            font-weight: 700;
            font-size: 18px;
            text-align: right;
            margin-top: 10px;
            color: #3498db;
        }
        ${selectors.cartButtons} {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }
        ${selectors.cartButtons} button {
            padding: 10px 20px;
            font-weight: 600;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 14px;
        }
        ${selectors.clearCartBtn} {
            background-color: darkred;
            color: white;
        }
        ${selectors.continueShoppingBtn} {
            background-color: #3498db;
            color: white;
        }
        ${selectors.productDetailModal} {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            overflow-y: auto;
            background-color: rgba(0,0,0,0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        }
        ${selectors.productDetailModal} > ${selectors.modalContent} {
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-sizing: border-box;
        }
        ${selectors.closeDetailModalBtn} {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            border: none;
            background: transparent;
            cursor: pointer;
            line-height: 1;
            color: #555;
        }
        ${selectors.productDetailModal} img {
            width: 100%;
            max-width: 200px;
            height: auto;
            margin: 0 auto 15px;
            border-radius: 12px;
        }
        ${selectors.productDetailModal} h2 {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            margin-bottom: 10px;
            text-align: center;
            color: #555;
        }
        ${selectors.productDetailModal} p.description {
            font-size: 16px;
            color: #555;
            margin-bottom: 10px;
            text-align: justify;
        }
        ${selectors.searchCartWrapper} {
            width: 100%;
            max-width: 700px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        ${selectors.cartModalTitle} {
            margin: 0 0 10px 0;
            text-align: center;
        }
        ${selectors.tempModal} {
            position: fixed;
            z-index: 12000;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0,0,0,0.25);
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            font-size: 14px;
        }
        ${selectors.productDetailPrice} {
            font-weight: 700;
            font-size: 18px;
            color: #3498db;
        }
        #productList {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }
        ${selectors.searchInput} {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 14px;
        }
    </style>`;
        $('head').append(customStyle);
    };

    self.buildHTML = () => {
        const html = `
        <div class="${classes.wrapper}">
            <div class="${classes.container}">
                <div class="${classes.searchCartWrapper}">
                    <input type="text" id="searchInput" placeholder="Ürün Ara..." />
                    <div class="${classes.cartIcon}" role="button" aria-label="Sepeti aç">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="cart-count">0</span>
                    </div>
                </div>
                <div id="productList"></div>
            </div>
        </div>
        <div class="${classes.modal}" id="cartModal" aria-modal="true" role="dialog" aria-labelledby="cartModalTitle" tabindex="-1">
            <div class="${classes.modalContent}">
                <h2 id="cartModalTitle" class="${classes.cartModalTitle}">Sepetiniz</h2>
                <div id="cartItemsHeader" class="${classes.cartItemsHeader}">
                    <span class="${classes.cartItemsHeaderSpan} ${classes.titleHeader}">Ürün</span>
                    <span class="${classes.cartItemsHeaderSpan}">Fiyat</span>
                    <span class="${classes.cartItemsHeaderSpan}">Adet</span>
                    <span class="${classes.cartItemsHeaderSpan}">Ara Toplam</span>
                    <span class="${classes.cartItemsHeaderSpan}"></span>
                </div>
                <div id="cartItemsContainer" class="${classes.cartItemsContainer}"></div>
                <div id="totalPrice" class="${classes.totalPrice}">Toplam: 0 $</div>
                <div id="cartButtons" class="${classes.cartButtons}">
                    <button id="clearCartBtn" class="${classes.clearCartBtn}">Sepeti Temizle</button>
                    <button id="continueShoppingBtn" class="${classes.continueShoppingBtn}">Alışverişe Devam Et</button>
                </div>
            </div>
        </div>`;
        $(selectors.appendLocation).append(html);
    };

    self.loadProducts = () => {
        $.ajax({
            url: 'https://fakestoreapi.com/products',
            method: 'GET',
            success: function (products) {
                products.forEach(product => {
                    const $card = $(`
                        <div class="${classes.productCard}" data-id="${product.id}" data-description="${product.description}" data-title="${product.title}" data-price="${product.price}" data-img="${product.image}">
                            <img src="${product.image}" alt="${product.title}" />
                            <h3>${product.title}</h3>
                            <p class="price">${product.price} $</p>
                            <button class="${classes.addToCartButton}">Sepete Ekle</button>
                        </div>
                    `).hide();
                    $(selectors.productList).append($card);
                    $card.fadeIn();
                });
            }
        });
    };

    self.setEvents = () => {

        $(document).on('click.eventListener', selectors.addToCartButton, function (e) {
            e.stopPropagation();
            const $card = $(this).closest(`.${classes.productCard}`);
            const product = {
                id: $card.data('id'),
                title: $card.find('h3').text(),
                price: Number($card.find('.price').text().replace('$', '').trim()),
                img: $card.find('img').attr('src')
            };
            self.addToCart(product);
            self.showModal(`<div class="${classes.cartItem}"><img src="${product.img}" alt="${product.title}" /><span>${product.title}</span><span>${product.price.toFixed(2)} $</span><i class='fas fa-check'></i> Sepete Eklendi</div>`);
        });


        $(document).on('click', `.${classes.productCard}`, function () {
            const $card = $(this);
            const productDetails = {
                id: $card.data('id'),
                title: $card.data('title'),
                description: $card.data('description'),
                price: $card.data('price'),
                img: $card.data('img'),
            };
            self.showProductDetailsModal(productDetails);
        });


        $(document).on('input', selectors.searchInput, self.debounce(function () {
            const q = $(this).val().toLowerCase();
            $(`${selectors.productList} .${classes.productCard}`).each(function () {
                const title = $(this).find('h3').text().toLowerCase();
                $(this).toggle(title.includes(q));
            });
        }, 300));


        $(document).on('click', selectors.cartIcon, () => $('#cartModal').fadeToggle());


        $(document).on('click', selectors.modal, (e) => {
            if (e.target.id === 'cartModal') $('#cartModal').fadeOut();
        });


        $(document).on('click', `.${classes.removeBtn}`, function () {
            const id = $(this).closest(`.${classes.cartItem}`).data('id');
            cart.delete(id);
            self.renderCart();
            self.saveCartToStorage();
        });


        $(document).on('click', selectors.clearCartBtn, function () {
            cart.clear();
            self.renderCart();
            self.saveCartToStorage();
        });


        $(document).on('click', selectors.continueShoppingBtn, function () {
            $('#cartModal').fadeOut();
        });


        $(document).on('click', selectors.closeDetailModalBtn, function () {
            $(`.${classes.productDetailModal}`).fadeOut(() => $(`.${classes.productDetailModal}`).remove());
        });


        $(document).on('click', selectors.productDetailModal, function (e) {
            if (e.target.classList.contains(classes.productDetailModal.replace('.', ''))) {
                $(`.${classes.productDetailModal}`).fadeOut(() => $(`.${classes.productDetailModal}`).remove());
            }
        });
    };

    self.addToCart = (product) => {
        if (cart.has(product.id)) {
            cart.get(product.id).qty++;
        } else {
            cart.set(product.id, { ...product, qty: 1 });
        }
        self.renderCart();
        self.saveCartToStorage();
    };

    self.renderCart = () => {
        const $container = $(selectors.cartItemsContainer);
        $container.empty();

        let totalPrice = 0;

        if (cart.size === 0) {
            $container.html('<p class="empty-cart">Sepetiniz boş</p>');

            $('style.custom-style').append(`
                .empty-cart {
                    text-align: center;
                    padding: 15px;
                    color: #666;
                }
            `);
        } else {
            cart.forEach((item, id) => {
                const price = Number(item.price);
                const qty = item.qty;
                const subtotal = price * qty;
                totalPrice += subtotal;

                const $item = $(`
                    <div class="${classes.cartItem}" data-id="${id}">
                        <img src="${item.img}" alt="${item.title}" />
                        <span class="title" title="${item.title}">${item.title}</span>
                        <span class="price">${price.toFixed(2)} $</span>
                        <span class="qty">${qty}</span>
                        <span class="subtotal">${subtotal.toFixed(2)} $</span>
                        <button class="${classes.removeBtn}" aria-label="Ürünü kaldır">×</button>
                    </div>
                `);
                $container.append($item);
            });
        }
        $(selectors.totalPrice).text(`Toplam: ${totalPrice.toFixed(2)} $`);
        $(`${selectors.cartIcon} .cart-count`).text(cart.size);
    };

    self.saveCartToStorage = () => {
        const cartArray = Array.from(cart.entries());
        localStorage.setItem('myCart', JSON.stringify(cartArray));
    };

    self.loadCartFromStorage = () => {
        const cartString = localStorage.getItem('myCart');
        if (cartString) {
            try {
                const cartArray = JSON.parse(cartString);
                cart.clear();
                cartArray.forEach(([id, item]) => {
                    item.price = Number(item.price);
                    cart.set(id, item);
                });
                self.renderCart();
            } catch (error) {
                console.error('Sepet hatalı:', error);
                localStorage.removeItem('myCart');
            }
        }
    };

    self.debounce = (func, wait) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    self.showModal = (content) => {
        const $modal = $(`<div class="${classes.tempModal}">${content}</div>`).appendTo('body');
        setTimeout(() => $modal.fadeOut(500, () => $modal.remove()), 1500);
    };

    self.showProductDetailsModal = (product) => {
        $(`.${classes.productDetailModal}`).remove();

        const html = `
            <div class="${classes.productDetailModal}" aria-modal="true" role="dialog" tabindex="-1">
                <div class="${classes.modalContent}">
                    <button class="${classes.closeDetailModalBtn}" aria-label="Kapat">×</button>
                    <img src="${product.img}" alt="${product.title}" />
                    <h2>${product.title}</h2>
                    <p class="description">${product.description}</p>
                    <p class="${classes.productDetailPrice}">${Number(product.price).toFixed(2)} $</p>
                </div>
            </div>
        `;
        $(selectors.appendLocation).append(html);
        $(`.${classes.productDetailModal}`).fadeIn();
    };

    $(document).ready(self.init);

})(jQuery);