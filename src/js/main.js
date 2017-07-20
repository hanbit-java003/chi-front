require('bootstrap');
require('../less/main.less');
var hello = require('./sample/hello');

$.ajax({
    url: '/chi_makers/api/makers/',
    success: function (result) {
        initMakers(result);
    }
});
// var mainModels = require('./model/main-items');
function initMakers(mainModels) {
    var template = require('../template/index-items.hbs');

    $('.mk-contents').empty();

    for (var i=0; i<mainModels.length; i++) {
//      img 주기 2가지 방법
//      img[0].img 가져와서 key:value 추가 할 수 있음
//      mainModels[i].img = mainModels[i].imgs[0].img; //키값 추가 하고 싶을때 그냥 가능 - 대박
//      아니면 가져오는 list가 한 개 니까
//      .hbs에 <img>를 {{#each imgs ~}}로 감싸서 1개만 표시

        var html = template(mainModels[i]);

        $('.mk-contents').append(html);
    }
    //이벤트 추가해줘야 한다.

    $('.mk-content-img').on('click', function () {
        var id = $(this).attr('id');

        location.href = './sub.html?id=' + id;
    });

    $('.mk-content-body').on('click', function () {
        var id = $(this).attr('id');

        location.href = './sub.html?id=' + id;
    });

}

$('.say-hello').on('click', function() {
    alert(hello.hello($('#txt-hello').val()));
});

$('.goto-sub').on('click', function() {
    location.href = 'sub.html';
});
