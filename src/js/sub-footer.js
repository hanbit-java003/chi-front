require('../less/sub-footer.less');

$('.sub-footer-order').on('click', function() {
    $('body').append('<div class="overlay-layer dark-layer"></div>');
    $('body').css('overflow', 'hidden');

    var memberLayer = require('../template/sub-footer-order-layer.hbs');

    $('.sub-footer').append(memberLayer);

    $('.sub-order-layer').animate({
        bottom: '0px'
    }, {
        duration: 500,
        complete: function() {
            $('.overlay-layer').on('click', cancel);
        }
    });

    $('.sub-order-btn-cancel').on('click', cancel);

    function cancel() {
        $('.sub-order-layer').animate({
            bottom: '-161px'
        }, {
            duration: 500,
            complete: function () {
                $('.sub-order-layer').remove();
                $('.overlay-layer').remove();
                $('body').css('overflow', 'auto');
            }
        });
    }
});