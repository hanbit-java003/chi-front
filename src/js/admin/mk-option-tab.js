var id;

var options = {
    list: []
};

function init(_id) {
    id = _id;

    if (true) {
        options = optionList2;
    }
    else {
        $.ajax({
            url: '/chi_makers/api/makers/option/' + id,
            success: function (result) {
                options = result;
            }
        });
    }
    setOptions();
}

var optionList2 = { // 옵션 1개 모델
    id: 614330,
    deliveryPrice: 2500,
    list: [{
        name: '',
        options: [{
            name: 'CAMERA',
            price: 51000
        }]
    }]
};

function setOptions() {
    $('.hta-tab-contents li[tab-id=option]').empty();

    var template = require('../../template/admin/mk-option.hbs');
    var html = template();
    $('.hta-tab-contents li[tab-id=option]').append(html);

/*
    for (var i=0; i<options.length; i++) {
        options[i].no = i + 1;
        var html = template(options[i]);

        $('.hta-mk-option tbody').append(html);
    }

    addAreaOptionEvents();*/
}

function addAreaOptionEvents() {
    addBtnRowEvents();

    $('.hta-mk-option tbody tr').off('dblclick');
    $('.hta-mk-option tbody tr').on('dblclick', function() {
        var row = $(this);
        var rowIndex = $(this).index();
        var option = options[rowIndex];
        option.name = option.name.replace(/<br>/g, '\n');
        var template = require('../../template/admin/mk-option-edit.hbs');
        var html = template(option);

        row.replaceWith(html);

        addBtnRowEvents();
    });
}

function addBtnRowEvents() {
    $('.hta-mk-option .hta-btn-row').off('click');
    $('.hta-mk-option .hta-btn-row').on('click', function() {
        var row = $(this).parents('tr');
        var rowIndex = row.index();
        var option = options[rowIndex];

        if ($(this).hasClass('hta-apply-row')) {
            option.name = row.find('.hta-mk-option-name').val().replace(/\n/g, '<br>').trim();
            option.price = row.find('.hta-mk-option-price').val().trim();
        }
        else if ($(this).hasClass('hta-remove-row')) {
            _.remove(options, function(value, n) {
                return rowIndex === n;
            });

            setOptions();
            return;
        }
        else if ($(this).hasClass('hta-up-row')) {
            if (rowIndex < 1) {
                return;
            }

            options = _.move(options, rowIndex, rowIndex - 1);

            setOptions();
            return;
        }
        else if ($(this).hasClass('hta-down-row')) {
            if (rowIndex >= options.length - 1) {
                return;
            }

            options = _.move(options, rowIndex, rowIndex + 1);

            setOptions();
            return;
        }

        var template = require('../../template/admin/mk-option.hbs');
        var html = template(option);
        row.replaceWith(html);

        addAreaOptionEvents();
    });
}

module.exports = {
    init: init
};