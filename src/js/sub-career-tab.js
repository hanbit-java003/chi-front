var careerItems = [];

function insert(_option) {
    var option = _option;

    for (var i=0; i<careerItems.length; i++) {
        if (careerItems[i].option === option.option) {
            alert('이미 선택된 옵션입니다. 다른 옵션을 선택해주세요.');
            return;
        }
    }

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
}

module.exports = {
    insert: insert
};