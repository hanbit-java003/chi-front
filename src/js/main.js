require('bootstrap');
require('../less/main.less');
var hello = require('./sample/hello');

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