require('../less/sub-footer.less');

var options = [{
        option: '아쿠아블루레몬'
    }, {
        option: '블루체리머스크'
    }, {
        option: '일랑일랑아이리스'
    }, {
        option: '스윗피치자몽'
}];

function init() {
    for (var i=0; i<options.length; i++) {
        var html = '<li>' + options[i].option + '</li>';
        $('.sub-order-option-list').append(html);
        여기서부터 append가 왜 않붙지?
    }
}

init();

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

    $('.sub-order-option').on('click', function () {
        $('.sub-order-text').append('<div class="overlay-layer dark-layer"></div>');
        $('.sub-order-text').css('overflow', 'hidden');
        $('.sub-order-option-list').css('display', 'block');

        $('.sub-order-option-list').animate({
            marginTop: '-100px',
            height: '200px'
        }, {
            duration: 500,
            complete: function () {

            }
        });

        $('.sub-order-text .overlay-layer').on('click', function () {
            $('.sub-order-option-list').animate({
                marginTop: '0px',
                height: '0px'
            }, {
                duration: 500,
                complete: function () {
                    $('.sub-order-option-list').css('display', 'none');
                    $('.sub-order-text .overlay-layer').remove();
                    $('.sub-order-text').css('overflow', 'auto');
                }
            });
        });
    });
});