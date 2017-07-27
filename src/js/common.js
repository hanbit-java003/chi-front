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

$('.header-menu').on('click', function() {
    $('body').append('<div class="overlay-layer dark-layer"></div>');
    $('body').css('overflow', 'hidden');

    var memberLayer = require('../template/member-layer.hbs');

    $('body').append(memberLayer);

    $('.mk-member-layer').animate({
        left: '0px'
    }, {
        duration: 500,
        complete: function() {
            $('.overlay-layer').on('click', function() {
                $('.mk-member-layer').animate({
                    left: '-188px'
                }, {
                    duration: 500,
                    complete: function() {
                        $('.mk-member-layer').remove();
                        $('.overlay-layer').remove();
                        $('body').css('overflow', 'auto');
                    }
                });
            });
        }
    });
});