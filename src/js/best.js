require('bootstrap');
require('../less/best.less');

var common = require('./common');

$.ajax({
    url: '/chi_makers/api/makers/best',
    success: function (result) {
        initBest(result);
    }
});

function initBest (models) {
    var bestTemplate = require('../template/best-items.hbs');
    var bestHtml = bestTemplate(models);
    $('.bt-contents').html(bestHtml);


    attachBestEvent();
}

function attachBestEvent () {
    $('.bt-content').on('click', function () {
        var id = $(this).attr('id');

        location.href = './sub.html?id=' + id;
    });
}
