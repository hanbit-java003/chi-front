require('bootstrap');
require('../less/main.less');
var hello = require('./sample/hello');

var mainModels = require('./model/main-items');
function initMain() {
    var template = require('../template/index-items.hbs');

    $('.mk-contents').empty();

    for (var i=0; i<mainModels.length; i++) {
        var html = template(mainModels[i]);

        $('.mk-contents').append(html);
    }
}

initMain();

$('.say-hello').on('click', function() {
    alert(hello.hello($('#txt-hello').val()));
});

$('.goto-sub').on('click', function() {
    location.href = 'sub.html';
});

$('.mk-content-img').on('click', function () {
    var id = $(this).attr('id');

    location.href = './sub.html?id=' + id;
});

$('.mk-content-body').on('click', function () {
    var id = $(this).attr('id');

    location.href = './sub.html?id=' + id;
});