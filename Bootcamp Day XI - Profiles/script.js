$('.mobile-menu-toggle').click(function () {
    $('.nav-links').toggleClass('active');
});

$(document).ready(function () {
    $('.team-intro-white').fadeIn(1000, function () { });


    const $wrapper = $(".swiper-wrapper");

    $.ajax({
        url: "https://randomuser.me/api/?results=10",
        dataType: "json",
        success: function (data) {
            data.results.forEach((user) => {
                const card = `
          <div class="swiper-slide personnel-card">
            <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}" />
            <h3>${user.name.first} ${user.name.last}</h3>
            <p>${user.location.city}, ${user.location.country}</p>
          </div>
        `;
                $wrapper.append(card);
            });

            new Swiper(".personnel-swiper", {
                slidesPerView: 3,
                loop: true,
                autoplay: {
                    delay: 0,
                    disableOnInteraction: false,
                },
                speed: 3000,
                grabCursor: true,
                freeMode: true,
            });
        },
    });
});

