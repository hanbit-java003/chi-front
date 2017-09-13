var _ = require('lodash');

var career = [];
var optionStack = [];
var totalPrice = 0;

var optionList = {
    list: []
};
var listCnt = 0;

function init(_optionList) {
    optionList = _optionList;
    listCnt = optionList.list.length;
}

function insert(_level, index) {
    var level = Number(_level);

    var name = optionList.list[level].options[index].name;
    if (optionStack.length === listCnt && level === listCnt -1) {
        optionStack.pop();
    }
    else {
        for (var i=optionStack.length -1; i>=level; i--) {
            optionStack.pop();
        }
    }

    optionStack.push(name);
    var str = '';
    for (var i=0; i<optionStack.length; i++) {
        str += optionStack[i] + ' ';
    }

    if (optionStack.length === listCnt && level === listCnt -1) {
        if (career.indexOf(str) !== -1) {
            alert('이미 상품을 선택하셨습니다.');
        }
        else {
            career.push(str);
            console.log(str);
            //setCareer(); // set - 개체 변할 때마다 새로 만드는게 편하다 - 정신건장에 좋음
        }
    }
}

function setCareer() {
    $('.sub-order-career').empty();

    var template = require('../template/sub-order-career-item.hbs');
    var html = template(careerItems); // 하나씩 넣는 것보다 한꺼번에 넣는게 편하다.
    $('.sub-order-career').append(html);

    setCareerEvent(); // 새로 만든 개체에 이벤트 걸자
}

function setCareerEvent() {
    $('.career-price-amount .mk-btn').off('click');
    $('.career-price-amount .mk-btn').on('click', function () {
        var li = $(this).parents('li');
        var index = li.index();
        var option = careerItems[index];

        if ($(this).hasClass('amount-minus')) {
            option.count--;
            if (option.count === 0) {
                option.count = 1;
                alert('최소 1개 이상 주문해야 합니다.');
            }
        }
        else if ($(this).hasClass('amount-plus')) {
            option.count++;
        }

        option.priceCount = option.price * option.count;

        li.find('.amount-count').text(option.count);
        li.find('.cost-times').text((option.priceCount).toLocaleString() + '원');
        totalPriceCount();
    });

    $('.career-price-cost .mk-btn').off('click');
    $('.career-price-cost .mk-btn').on('click', function () {
        var li = $(this).parents('li');
        var index = li.index();

        if ($(this).hasClass('cost-cancel')) {
            $('.sub-order-career > li:nth-child(' + (index+1) +')').animate({ // nth-child - 원하는 index + 1 - 순서가 1부터 시작
                height: '0px'
            }, {
                duration: 500,
                complete: function () {
                    _.remove(careerItems, function(value, n) { // 홈페이지는 n 밖에 없지만, 파라미터 비교 대상과 n 같이 쓰자
                        return index === n; // remove - === 3개 씀 (홈페이지 2개로 되있지만)
                    });

                    setCareer(); // 개체가 변했으니 다시 set
                }
            });
        }
    });

    totalPriceCount();
}

function totalPriceCount() {
    totalPrice = 0;
    for (var i=0; i<careerItems.length; i++) {
        var option = careerItems[i];
        totalPrice += option.price * option.count;
    }
    $('.career-total-price').text(totalPrice.toLocaleString() + '원');
}

function hasCareerItems() {
    if (careerItems.length > 0) {
        return true;
    }
    return false;
}

module.exports = {
    init: init,
    insert: insert
};