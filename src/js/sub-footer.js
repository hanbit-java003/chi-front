require('../less/sub-footer.less');
var careerController = require('../js/sub-career-tab');

var id = 0;
var optionList = {
    list: []
};

var level = 0;
var listCnt = 0;

function init(_id) {
    id = _id;

    // ajax - initMakers 실행 순서 때문에 optionList가 동작하지 않는다. - %주의%
    $.ajax({
        url: '/chi_makers/api/makers/option/' + id,
        success: function (result) {
            optionSet(result);
        }
    });
}

function optionSet(_optionList) {
    optionList = _optionList;
    careerController.init(optionList);

    $('.sub-footer-order').on('click', function() {
        $('body').append('<div class="overlay-layer dark-layer"></div>');
        $('body').css('overflow', 'hidden');

        listCnt = optionList.list.length;
        for (var i=0; i<listCnt; i++) {
            optionList.list[i].level = i;
        }
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

        // 옵션 1개인 경우~~보류
        if (optionList.list.length === 1) { // option 1개인 경우 UI
            oneOptionItem();

            $('.sub-order-text .sub-order-option').hide();
            setTimeout(function () {
                $('.career-price .career-price-cost').hide();
            }, 100); // 애니매이션 등 늦게 동작해서 hide가 안먹는다. - 해결

            $('.overlay-layer').off('click');
            $('.sub-order-btn-cancel').off('click');

            $('.overlay-layer, .sub-order-btn-cancel').on('click', function () {
                careerController.flushCareer();
                close();
            });
        }
        else {
            // 옵션 여러개
            optionBarsDisplay();

            optionEventAttach();
            itemEventAttach();
        }

        careerController.setCareer();
    });
}

function oneOptionItem() {
    careerController.insert(level, 0);
}

function optionBarsDisplay() {
    var optionBars = $('.sub-order-text .sub-order-option');
    for (var i=0; i<optionBars.length; i++) {
        if (level >= i) {
            $(optionBars[i]).css('display', 'block');
        }
        else {
            $(optionBars[i]).css('display', 'none');
        }
    }
    $(optionBars[level]).animate({
        height: '40px'
    }, {
        duration: 400,
        complete: function () {
        }
    });
}

function itemEventAttach() {
    $('.sub-order-option-list > li').on('click', function () {
        level = $(this).parent('ul').attr('level');
        var index = $(this).index(); // 해당 ul의 li의 index가 출력

        careerController.insert(level, index);
        optionListClose();
        var optionBars = $('.sub-order-text .sub-order-option');
        for (var i=listCnt -1; i>level; i--) {
            $(optionBars[i]).text(optionList.list[i].name);
        }
        $(optionBars[level]).text(optionList.list[level].options[index].name);

        level++; // 전역 변수에서 number로 선언
        $(optionBars[level]).css('height', '0px');// 애니메이션 넣기 위해 bar 높이 0으로
        optionBarsDisplay();
    });
}

function optionEventAttach() { // 이벤트 붙이기
    $('.sub-order-option').on('click', function () {
        var index = $(this).index();

        $('.overlay-layer').off('click');

        $('.sub-order-text').append('<div class="overlay-layer dark-layer"></div>');
        $('.sub-order-text').css('overflow', 'hidden');

        var optionLists = $('.sub-order-option-list');
        var itemLength = optionList.list[index].options.length;

        $(optionLists[index]).css('display', 'block');
        $(optionLists[index]).animate({ // 벌어지는 애니메이션 주기 위해선 높이 초기값이 0 이어야한다.
            marginTop: -1 * itemLength * 21 + 'px',
            height: itemLength * 42 + 'px'
        }, {
            duration: 500,
            complete: function () {
                // 이벤트 걸때 - optionListClose() 함수로 주면 결과를 실행하기 때문에 자동으로 clsoe됨 - 중요!!
                $('.overlay-layer').on('click', optionListClose);
            }
        });
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

function close() {
    $('.sub-order-layer').animate({
        bottom: '-161px'
    }, {
        duration: 500,
        complete: function () {
            $('.sub-order-layer').remove();
            $('.overlay-layer').remove();
            $('body').css('overflow', 'auto');

            level = 0;
            optionBarsDisplay();
        }
    });
}

module.exports = {
    init: init
};

