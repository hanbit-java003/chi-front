var _ = require('lodash');

var careerItems = [];
var optionId = 1;

function insert(_option) {
    var option = _option;

    for (var i=0; i<careerItems.length; i++) {
        if (careerItems[i].option === option.option) {
            alert('이미 선택된 옵션입니다. 다른 옵션을 선택해주세요.');
            return;
        }
    }

    option.id = optionId++;
    option.count = 1;
    careerItems.push(option);

    var template = require('../template/sub-order-career-item.hbs');
    var html = template(option);
    $('.sub-order-career').append(html);

    setCareerEvent();
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

        li.find('.amount-count').text(option.count);
        li.find('.cost-times').text(option.price * option.count + '원');
    });

    $('.career-price-cost .mk-btn').off('click');
    $('.career-price-cost .mk-btn').on('click', function () {
        var li = $(this).parents('li');
        var index = li.index();
        var option = careerItems[index];

        if ($(this).hasClass('cost-cancel')) {
            $('.sub-order-career [option-id=' + option.id +']').animate({
                height: '0px'
            }, {
                duration: 500,
                complete: function () {
                    $('.sub-order-career [option-id=' + option.id +']').remove();
                    var abc = _.remove(careerItems, function (n) {
                        return n == index;
                    });
                    console.log(abc);
                }
            });
        }
    });

}

module.exports = {
    insert: insert
};