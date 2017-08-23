require('../less/sub-footer.less');
var careerController = require('../js/sub-career-tab');

var options = [];

function init(_options) {
    options = _options;

    $('.sub-footer-order').on('click', function() {
        $('body').append('<div class="overlay-layer dark-layer"></div>');
        $('body').css('overflow', 'hidden');

        var memberLayer = require('../template/sub-footer-order-layer.hbs');

        $('.sub-footer').append(memberLayer);
        if (careerController.hasCareerItems()) {
            careerController.setCareer();
        }
        else if (options.length === 1) { // option 1개인 경우 추가
            careerController.insert(options[0]);
        }

        if (options.length === 1) { // option 1개인 경우 UI
            $('.sub-order-text .sub-order-option').hide();
            $('.career-price .career-price-cost').hide();
        }


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
        var html = '<li>' + options[i].name + '</li>';
        $('.sub-order-option-list').append(html);
    }

    $('.sub-order-option-list > li').on('click', function () {
        var index = $(this).index();

        optionListClose();

        careerController.insert(options[index]);
    });
}

module.exports = {
    init: init
};
