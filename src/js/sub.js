require('bootstrap');
require('../less/sub.less');
require('./sub-footer');

// url-serch-params 쓰고 싶으면 가져 와야한다.
var URLSearchParams = require('url-search-params');
var params = new URLSearchParams(location.search);
var theresId = params.get('id');
var moment = require('moment');

$.ajax({
    url: '/chi_makers/api/makers/detail?id=' + theresId,
    method: 'GET',
    success: function (result) {
        initMakers(result);
    }
});

function initMakers(model) {
    var carouselImgs = $('.carousel-inner').find('img');
    var imgs = model.imgs;
    for(var i=0; i < carouselImgs.length; i++) {
        $(carouselImgs[i]).attr('src', imgs[i].img);
    }

    $('.sub-detail-title').html(model.name);
    $('.sub-detail-price').html(model.price + '원');
    $('.sub-box-info-day').html('주문기간 :' + model.orderDays);

    var schedulesTemplate = require('../template/sub/schedule.hbs');
    var schedulesHtml = schedulesTemplate(model);
    $('.sub-box-info-items').html('배송예정일' + schedulesHtml);
    $('.sub-on-order-person').html(model.orders + '명 주문중');

    var nowHtml = moment().format('(MM/DD hh:mm)');
    $('.sub-on-order-day').html(nowHtml);

    var productInfos = model.infos;
    $('.sub-select-detail').empty();
    for(var i=0; i < productInfos.length; i++) {
        var html = '<div>' + productInfos[i].title + '</div>' + productInfos[i].value;
        $('.sub-select-detail').append(html);
    }

    orderLimit(model);
    attachEvents();
}

function orderLimit(model) {
    var str = String(model.orderDays);
    var n = str.indexOf('~');
    var dot = str.indexOf('.', n);
    var year = Number(str.substring(n+2, dot));
    n = dot+1;
    var dot = str.indexOf('.', n);
    var month = Number(str.substring(n, dot));
    n = dot+1;
    var day = Number(str.substring(n, n+2).trim());

    var a = moment([year, month-1, day]);
    // 한 달 추가되서 나온다 이해할 수 없다.
    var b = moment();

    var result = a.diff(b, 'days');
    if(result <= 0) {
        $('.sub-detail-limit').text('주문종료');
    }
    else {
        $('.sub-detail-limit').text('주문종료 ' + result + '일 남음');
    }
}

function attachEvents() {
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

}

$('.header-title').on('click', function() {
    location.href = 'index.html';
});

$('.carousel').carousel({
    interval: false
});


