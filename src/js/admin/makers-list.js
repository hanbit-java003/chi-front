require('bootstrap');
require('../../less/admin/makers-list.less');
require('./common');

var _ = require('lodash');
var hangul = require('hangul-js');

var models = [];

$.ajax({
    url: '/chi_makers/api/admin/makers/list',
    success: function (result) {
        models = result;

        mkSetList(models);
    }
});

function mkSetList(makers) {
    var mkTemplate = require('../../template/admin/mk-list-item.hbs');
    var mkHtml = mkTemplate(makers);

    $('.mk-item-list').html(mkHtml);

    $('.mk-item-list > li').on('click', function() {
        var mkId = $(this).attr('mk-id');

        location.href = './makers-info-edit.html?id=' + mkId;
    });
}

$('.dropdown-menu > li').on('click', function () {
    var index = $(this).index();
    var text = $(this).text();
    $('.mk-dropdown-name').text(text);

    if (index === 0) {
        models.sort(function (a, b) {
            return b.id - a.id;
        });

        mkSetList(models);
    }
    else if (index === 1) {
        models.sort(function (a, b) {
            return b.orders - a.orders;
        });

        mkSetList(models);
    }
    else if (index === 2) {
        models.sort(function (a, b) {
            return b.likes - a.likes;
        });

        mkSetList(models);
    }
});

$('.mk-btn-item-insert').on('click', function () {
    location.href = './makers-info-edit.html';
});

/************** search **************/
var searchTimer;
var lastSearchTime = _.now();

$('#mk-search-input').on('input', function() {
    clearTimeout(searchTimer);
    var delay = 200;
    var now = _.now();

    if (now - lastSearchTime > 1000) {
        delay = 0;
    }

    searchTimer = setTimeout(function() {
        search();
    }, delay);
});

function hangulSearch(text, keyword) {
    var disassembled = hangul.disassemble(keyword);
    var isChosung = true;

    for (var i=0; i<disassembled.length; i++) {
        if (!hangul.isCho(disassembled[i])) {
            isChosung = false;
            break;
        }
    }

    if (!isChosung) {
        return hangul.search(text, keyword) > -1;
    }

    var chosung = _.map(hangul.d(text, true), function(arr) {
        return arr[0];
    });

    return hangul.search(chosung, keyword) > -1;
}

function search() {
    var keyword = _.kebabCase($('#mk-search-input').val().toLowerCase());

    models.forEach(function(mk) {
        var id = mk.id + '';
        var title = mk.title.toLowerCase();

        if (id.includes(keyword) || hangulSearch(title, keyword)) {
            delete mk.hidden; // template에 hbs 문법에 hidden 관련 unless가 있다.
        }
        else {
            mk.hidden = true;
        }
    });

    mkSetList(models);

    lastSearchTime = _.now();
}