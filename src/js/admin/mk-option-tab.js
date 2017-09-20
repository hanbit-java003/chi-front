var id;

var options = {
    list: []
};

function init(_id) {
    id = _id;

    $.ajax({
        url: '/chi_makers/api/makers/option/' + id,
        success: function (result) {
            options = result;
            setOptions();
        }
    });
}

function setOptions() {
    $('.hta-tab-contents li[tab-id=option]').empty();

    for (var i = 0; i < options.list.length; i++) {
        var list = options.list[i];
        list.no = i + 1;
        for (var j = 0; j < list.options.length; j++) {
            var optionsArr = list.options[j];
            optionsArr.no1 = j + 1;
        }
    }

    var template = require('../../template/admin/mk-option.hbs');
    var html = template(options);
    $('.hta-tab-contents li[tab-id=option]').append(html);

    // mk-option.hbs 이 생성되고 이벤트를 줘야한다. %위치 중요%
    if (options.deliveryPrice) {
        $('#checkboxId').attr('checked', true);
        $('.sub-option-fee-input').show();
    }

    $('#checkboxId').on('change', function() {
        if (this.checked) {
            $('.sub-option-fee-input').show();
        }
        else {
            $('.sub-option-fee-input').hide();
        }
    });

    addCategoryEvents();
}

function addCategoryEvents() {
    addOptionsTableEvents();

    $('.sub-option-category-add > button').off('click');
    $('.sub-option-category-add > button').on('click', function() {
        var no = {no: $('.sub-option-category-list').length + 1};

        var template = require('../../template/admin/mk-option-category-add.hbs');
        var html = template(no);

        $('.sub-option-category').append(html);
        addOptionsTableEvents();
    });

    $('.sub-option-category-del > button').off('click');
    $('.sub-option-category-del > button').on('click', function() {
        var list = $('.sub-option-category-list');
        var l = list.length;
        if (l > 1) {
            $(list[l-1]).remove();
        }
    });
}

function addOptionsTableEvents() {
    $('.category-list-add').off('click');
    $('.category-list-add').on('click', function () {
        var row = $(this).parents('.sub-option-category-list'); // class가 아닌 태그의 수 즉 div의 수를 센다
        var rowIndex = row.index(); // 처음이 그래서 0이 아닌 2가 된다.

        var tbody = $('.sub-option-category-list > table > tbody')[rowIndex - 2];

        var no1 = {no1: $(tbody).children('tr').length + 1};
        var template = require('../../template/admin/mk-options-table-add.hbs');
        var html = template(no1);
        $(tbody).append(html);
    });

    $('.category-list-del').off('click');
    $('.category-list-del').on('click', function () {
        var row = $(this).parents('.sub-option-category-list');
        var rowIndex = row.index();

        var tbody = $('.sub-option-category-list > table > tbody')[rowIndex - 2];
        var l = $(tbody).children('tr').length;
        if (l > 1) {
            $(tbody).children('tr')[l - 1].remove();
        }
    });
}

module.exports = {
    init: init
};