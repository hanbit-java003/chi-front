require('../less/sub-footer.less');

var options = [{
    option: '아쿠아블루레몬',
    price: 32000
}, {
    option: '블루체리머스크',
    price: 32000
}, {
    option: '일랑일랑아이리스',
    price: 32000
}, {
    option: '스윗피치자몽',
    price: 32000
}];

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
            $('.overlay-layer').on('click', close);
        }
    });
    $('.sub-order-btn-cancel').on('click', close);

    $('.sub-order-option').on('click', function () {
        $('.overlay-layer').off('click');
        optionListInsert();

        $('.sub-order-text').append('<div class="overlay-layer dark-layer"></div>');
        $('.sub-order-text').css('overflow', 'hidden');
        $('.sub-order-option-list').css('display', 'block');

        $('.sub-order-option-list').animate({
            marginTop: '-100px',
            height: options.length * 42 + 'px'
        }, {
            duration: 500,
            complete: function () {
                // 이벤트 걸때 - optionListClose() 함수로 주면 결과를 실행하기 때문에 자동으로 clsoe됨 - 중요!!
                $('.overlay-layer').on('click', optionListClose);
            }
        });
    });
});

function close() {
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

function optionListClose() {
    $('.sub-order-option-list').animate({
        marginTop: '0px',
        height: '0px'
    }, {
        duration: 500,
        complete: function () {
            $('.sub-order-option-list').css('display', 'none');
            $('.sub-order-text .overlay-layer').remove();
            $('.sub-order-text').css('overflow', 'auto');

            $('.overlay-layer').off('click');
            $('.overlay-layer').on('click', close);
        }
    });
}

function optionListInsert() {
    $('.sub-order-option-list').empty();
    for (var i=0; i<options.length; i++) {
        var html = '<li>' + options[i].option + '</li>';
        $('.sub-order-option-list').append(html);
    }

    $('.sub-order-option-list > li').on('click', function () {
        var index = $(this).index();
        var value = $(this).text();

        console.log(index);

        optionListClose();
    });
}
