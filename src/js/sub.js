require('bootstrap');
require('../less/sub.less');
require('./sub-footer');

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