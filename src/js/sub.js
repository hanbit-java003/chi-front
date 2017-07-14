require('bootstrap');
require('../less/sub.less');
require('./sub-footer');

// url-serch-params 쓰고 싶으면 가져 와야한다.
var URLSearchParams = require('url-search-params');
var params = new URLSearchParams(location.search);
var theresId = params.get('id');

try {
    var model = require('./model/sub/' + theresId);
}
catch (e) {
    var model = require('./model/sub/605811');
}
var carouselImgs = $('.carousel-inner').find('img');
// 태그 src에는 url() 안들어간다. - 지움
$(carouselImgs[0]).attr('src', model.imgs.i1);
$(carouselImgs[1]).attr('src', model.imgs.i2);
$(carouselImgs[2]).attr('src', model.imgs.i3);
$('.sub-detail-title').html(model.name);
$('.sub-detail-price').html(model.price + '원');
$('.sub-box-info-day').html('주문기간 :' + model.orderDays);

// handlebars 사용한 list 추가하기 template 필요
// 모델 삽입은 template(model) - html이 만들어진 것
// 태그에 삽입
var schedulesTemplate = require('../template/sub/schedule.hbs');
var schedulesHtml = schedulesTemplate(model);
$('.sub-box-info-items').html('배송예정일' + schedulesHtml);

$('.header-title').on('click', function() {
    location.href = 'index.html';
});

$('.carousel').carousel({
    interval: false
});

$('.sub-select > li').on('click', function () {
    if ($(this).hasClass('active')) {// 여기에는 . 찍으면 안됨
        return;
    }
    // id줄 필요 없다. index로 몇번째 인지 찾을 수 있다.
    var tabIndex = $(this).index();
    // 상위 찾고 싶으면 parent
    var tabBtns = $(this).parent('.sub-select').find('li');
    tabBtns.removeClass('active');
    $(tabBtns[tabIndex]).addClass('active');

    var tabContents = $('.sub-select-contents').find('li');
    tabContents.removeClass('active');
    $(tabContents[tabIndex]).addClass('active');
    // id 찾을 때는 속성이니까 attr

});
// list의 item 가져오려면 ul > li
$('.sub-faq-contents > li').on('click', function () {
    if ($(this).find('div').hasClass('active')) {
        $(this).css('background-color', '#ffffff');
        $(this).find('div').removeClass('active');
        return;
    }
    $(this).css('background-color', '#f7f7f7');
    $(this).find('div').addClass('active');
});

$('.sub-items-info > li').on('click', function () {
    var divItems = $(this).find('div');
    var tagI = $(divItems[0]).find('i');
    if ($(divItems[1]).hasClass('active')) {
        $(divItems[0]).css('background-color', '#ffffff');
        tagI.removeClass('fa-chevron-up');
        tagI.addClass('fa-chevron-down');
        $(divItems[1]).removeClass('active');
        return;
    }
    $(divItems[0]).css('background-color', '#f0f0f0');
    tagI.removeClass('fa-chevron-down');
    tagI.addClass('fa-chevron-up');
    $(divItems[1]).addClass('active');
});


