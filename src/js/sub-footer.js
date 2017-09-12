require('../less/sub-footer.less');
var careerController = require('../js/sub-career-tab');
var optionStack = require('../js/sub-option-stack');

var optionList = {
    list: []
};

var level = 0;

function init(_optionList) {
    optionList = _optionList;

    $('.sub-footer-order').on('click', function() {
        $('body').append('<div class="overlay-layer dark-layer"></div>');
        $('body').css('overflow', 'hidden');

        var memberLayer = require('../template/sub-footer-order-layer.hbs');
        var html = memberLayer(optionList); // list 안에 list도 가능
        $('.sub-footer').append(html);

        $('.sub-order-layer').animate({
            bottom: '0px'
        }, {
            duration: 500,
            complete: function() {
                $('.overlay-layer').on('click', close);
            }
        });
        $('.sub-order-btn-cancel').on('click', close);

        // 옵션 1개인 경우 ~~보류
        if (optionList.list.length === 1) { // option 1개인 경우 UI
            $('.sub-order-text .sub-order-option').hide();
            $('.career-price .career-price-cost').hide();
        }

        // 옵션 여러개
        var optionBars = $('.sub-order-text .sub-order-option');
        for (var i=0; i<optionBars.length; i++) {
            if (level === i) {
                $(optionBars[i]).css('display', 'block');
            }
            else {
                $(optionBars[i]).css('display', 'none');
            }
        }
        optionEventAttach();
    });
}

function optionEventAttach() { //<----- 여기부터 시작
    $('.sub-order-layer').on('click', function () {
        var index = $(this).index();
        optionListClose();
    });

    $('.sub-order-option').on('click', function () {
        $('.overlay-layer').off('click');

        $('.sub-order-text').append('<div class="overlay-layer dark-layer"></div>');
        $('.sub-order-text').css('overflow', 'hidden');
        $('.sub-order-option-list').css('display', 'block');

        $('.sub-order-option-list').animate({
            marginTop: '-100px',
            height: layer.length * 42 + 'px'
        }, {
            duration: 500,
            complete: function () {
                // 이벤트 걸때 - optionListClose() 함수로 주면 결과를 실행하기 때문에 자동으로 clsoe됨 - 중요!!
                $('.overlay-layer').on('click', optionListClose);
            }
        });
    });
}

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
            //$('.sub-order-option-list').css('display', 'none');
            $('.sub-order-text .overlay-layer').remove();
            $('.sub-order-text').css('overflow', 'auto');

            $('.overlay-layer').off('click');
            $('.overlay-layer').on('click', close);
        }
    });
}


module.exports = {
    init: init
};

