var options = [];

function init(_options) {
    options = _options;
    setOptions();

    $('[tab-id=options] .hta-add-row').on('click', function() {
        options.push({
            name: '이름',
            price: 0
        });

        setOptions();
    });
}

function setOptions() {
    $('.hta-mk-option tbody').empty();

    var template = require('../../template/admin/mk-option.hbs');

    for (var i=0; i<options.length; i++) {
        options[i].no = i + 1;
        var html = template(options[i]);

        $('.hta-mk-option tbody').append(html);
    }

    addAreaOptionEvents();
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