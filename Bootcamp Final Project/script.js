(() => {
    const JSON_URL = 'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json';
    const STORAGE_KEY = 'carousel_products';
    const FAVORITES_KEY = 'carousel_favorites';
    const CONTAINER_CLASS = 'you-might-also-like-carousel';

    const init = async () => {
        if (!document.querySelector('.product-detail')) return;

        await loadJquery();
        const products = await getProducts();
        buildHTML(products);
        buildCSS();
        setEvents();
    };

    const loadJquery = () => new Promise(resolve => {
        if (window.jQuery) return resolve();
        const script = document.createElement('script');
        script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });

    const getProducts = async () => {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) return JSON.parse(cached);

        const res = await fetch(JSON_URL);
        const data = await res.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
    };

    const buildHTML = (products) => {
        const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
        const wrapper = $(`
            <div class="${CONTAINER_CLASS}">
                <h2>You Might Also Like</h2>
                <div class="carousel">
                    <button class="arrow prev">&#10094;</button>
                    <div class="track"></div>
                    <button class="arrow next">&#10095;</button>
                </div>
            </div>
        `);

        const track = wrapper.find('.track');
        products.forEach(product => {
            const isFav = favorites.includes(product.id);
            const item = $(`
                <div class="item">
                    <a href="${product.url}" target="_blank">
                        <img src="${product.img}" alt="${product.name}">
                        <p class="name">${product.name}</p>
                        <p class="price">${product.price} TRY</p>
                    </a>
                    <span class="heart ${isFav ? 'active' : ''}" data-id="${product.id}">&#10084;</span>
                </div>
            `);
            track.append(item);
        });

        $('.product-detail').append(wrapper);
    };

    const buildCSS = () => {
        const css = `
        .${CONTAINER_CLASS} {
            margin: 40px auto;
            padding: 0 20px;
            max-width: 1200px;
            font-family: Arial, sans-serif;
        }

        .${CONTAINER_CLASS} h2 {
            font-size: 20px;
            margin-bottom: 10px;
        }

        .${CONTAINER_CLASS} .carousel {
            position: relative;
            width: 100%;
        }

        .${CONTAINER_CLASS} .track {
            display: flex;
            gap: 12px;
            overflow-x: auto;
            scroll-behavior: smooth;
            padding: 10px 0;
            scrollbar-width: none;
        }

        .${CONTAINER_CLASS} .track::-webkit-scrollbar {
            display: none;
        }

        .${CONTAINER_CLASS} .item {
            flex: 0 0 auto;
            width: 160px;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px;
            background: #fff;
            box-sizing: border-box;
            position: relative;
            text-align: left;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            min-height: 280px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .${CONTAINER_CLASS} .item img {
            width: 100%;
            height: auto;
            border-radius: 4px;
        }

        .${CONTAINER_CLASS} .item a {
            text-decoration: none;
            color: black;
        }

        .${CONTAINER_CLASS} .item .name {
            font-size: 13px;
            margin: 8px 0 10px;
            color: #000;
            height: 32px;
            overflow: hidden;
            text-align: left;
        }

        .${CONTAINER_CLASS} .item .price {
            font-weight: 600;
            font-size: 13px;
            margin: 0;
            color: #1d4ed8;
            text-align: left;
            height: 20px;
        }

        .${CONTAINER_CLASS} .heart {
            position: absolute;
            top: 8px;
            right: 8px;
            cursor: pointer;
            background: white;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            padding: 3px 6px;
            font-size: 16px;
            color: #ccc;
        }

        .${CONTAINER_CLASS} .heart.active {
            color: #007bff;
        }

        .${CONTAINER_CLASS} .arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            border: 1px solid #ccc;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-size: 18px;
            z-index: 2;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .${CONTAINER_CLASS} .prev { left: -25px; }
        .${CONTAINER_CLASS} .next { right: -25px; }

        .${CONTAINER_CLASS} .prev,
        .${CONTAINER_CLASS} .next {
            background: none !important; 
            border: none;
            box-shadow: none;
        }

        
        @media (max-width: 768px) {
            .${CONTAINER_CLASS} .item {
                width: 130px;
            }
        }

        @media (max-width: 480px) {
            .${CONTAINER_CLASS} .item {
                width: 110px;
            }
        }
    `;
        $('<style>').text(css).appendTo('head');
    };


    const setEvents = () => {
        const $carousel = $('.' + CONTAINER_CLASS);

        $carousel.on('click', '.heart', function () {
            const $icon = $(this);
            const id = $icon.data('id');
            let favs = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

            if ($icon.hasClass('active')) {
                favs = favs.filter(f => f !== id);
                $icon.removeClass('active');
            } else {
                favs.push(id);
                $icon.addClass('active');
            }

            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
        });

        $carousel.on('mouseenter', '.item', function () {
            $(this).stop().animate({ top: '-5px' }, 150);
            $(this).css('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.15)');
        });

        $carousel.on('mouseleave', '.item', function () {
            $(this).stop().animate({ top: '0px' }, 150);
            $(this).css('box-shadow', '0 2px 6px rgba(0, 0, 0, 0.05)');
        });

        $carousel.on('click', '.prev', function () {
            $carousel.find('.track').animate({ scrollLeft: '-=300' }, 300);
        });

        $carousel.on('click', '.next', function () {
            $carousel.find('.track').animate({ scrollLeft: '+=300' }, 300);
        });
    };

    init();
})();
