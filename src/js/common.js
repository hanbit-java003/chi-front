$('.header-title').on('click', function () {
    location.href = 'http://localhost:89/index.html'
});

$('.mk-menu-items > li').on('click', function () {
    //console.log($(this).index());
    if ($(this).hasClass('active')) { // class에 .안씀
        return;
    }

    var index = $(this).index();
    if(index === 1) {
        location.href = './best.html';
    }
    else {
        location.href = './index.html';
    }
});