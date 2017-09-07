require('bootstrap');
require('../less/main.less');

require('./common');

$.ajax({
    url: '/chi_makers/api/makers/',
    success: function (result) {
        initMakers(result);
    }
});

function initMakers(mainModels) {
    var template = require('../template/index-items.hbs');
    var html = template(mainModels);

    $('.mk-contents').append(html);

    $('.mk-content-img').on('click', function () {
        var id = $(this).attr('id');

        location.href = './sub.html?id=' + id;
    });

    $('.mk-content-body').on('click', function () {
        var id = $(this).attr('id');

        location.href = './sub.html?id=' + id;
    });

}
