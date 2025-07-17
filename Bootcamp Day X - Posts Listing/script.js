let isLoading = false;
let start = 0;
const limit = 5;
let max = 100;


function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showSkeleton(count = 5) {
    const $container = $('#skeletonContainer');
    $container.empty();

    for (let i = 0; i < count; i++) {
        const skeletonHTML = `
      <div class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-text title"></div>
        <div class="skeleton-text line"></div>
        <div class="skeleton-text line short"></div>
      </div>
    `;
        $container.append(skeletonHTML);
    }

    $container.show();
}

function hideSkeleton() {
    $('#skeletonContainer').hide();
}


async function loadPosts(startIndex, limitCount) {
    if (isLoading) return;

    isLoading = true;
    showSkeleton(limitCount);

    const skeletonWait = wait(1000);
    const postsPromise = $.get(`https://jsonplaceholder.typicode.com/posts?_start=${startIndex}&_limit=${limitCount}`);

    const [posts] = await Promise.all([postsPromise, skeletonWait]);

    posts.forEach(function (post) {
        const imageUrl = `https://picsum.photos/300/200?random=${post.id}`;
        const card = `
      <div class="post-card">
        <img src="${imageUrl}" alt="Post görseli" />
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.body}</p>
      </div>
    `;
        $('#postContainer').append(card);
    });

    hideSkeleton();
    isLoading = false;
}

$(document).ready(function () {
    loadPosts(start, limit);
    start += limit;

    $(window).on('scroll', function () {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
            if (start <= max && !isLoading) {
                loadPosts(start, limit);
                start += limit;
            }
        }
    });
});


$(document).ready(function () {
    $('#errorTestBtn').on('click', function () {
        $('#errorMessage').hide();

        $.get('https://jsonplaceholder.typicode.c')
            .fail(function () {
                $('#errorMessage').text('⚠️ Bir hata oluştu. Lütfen daha sonra tekrar deneyin.').fadeIn();
                setTimeout(() => $('#errorMessage').fadeOut(), 5000);
            });
    });
});


$('#menuToggle').on('click', function () {
    $('#navMenu').toggleClass('active');
});
