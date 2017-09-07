var schedules = [];

function init(_schedules) {
    schedules = _schedules;
    setSchedules();

    $('[tab-id=schedule] .hta-add-row').on('click', function () {
        schedules.push({
            schedule: '0월 0주경 배송시작'
        });

        setSchedules();
    });
}

function setSchedules() {
    $('.hta-mk-schedule tbody').empty();

    var template = require('../../template/admin/mk-schedule.hbs');

    for (var i=0; i<schedules.length; i++) {
        schedules[i].no = i + 1;
        var html = template(schedules[i]);

        $('.hta-mk-schedule tbody').append(html);
    }

    addAreaScheduleEvents();
}

function addAreaScheduleEvents() {
    addBtnRowEvents();

    $('.hta-mk-schedule tbody tr').off('dblclick');
    $('.hta-mk-schedule tbody tr').on('dblclick', function () {
        var row = $(this);
        var rowIndex = $(this).index();
        var schedule = schedules[rowIndex];
        var template = require('../../template/admin/mk-schedule-edit.hbs');
        var html = template(schedule);

        row.replaceWith(html);

        addBtnRowEvents();
    });
}

function addBtnRowEvents() {
    $('.hta-mk-schedule .hta-btn-row').off('click');
    $('.hta-mk-schedule .hta-btn-row').on('click', function() {
        var row = $(this).parents('tr');
        var rowIndex = row.index();
        var schedule = schedules[rowIndex];

        if ($(this).hasClass('hta-apply-row')) {
            schedule.schedule = row.find('.hta-mk-schedule-schedule').val().trim();
        }
        else if ($(this).hasClass('hta-remove-row')) {
            _.remove(schedules, function(value, index) {
                return rowIndex === index;
            });

            setSchedules();
            return;
        }
        else if ($(this).hasClass('hta-up-row')) {
            if (rowIndex < 1) {
                return;
            }

            schedules = _.move(schedules, rowIndex, rowIndex - 1);

            setSchedules();
            return;
        }
        else if ($(this).hasClass('hta-down-row')) {
            if (rowIndex >= schedules.length - 1) {
                return;
            }

            schedules = _.move(schedules, rowIndex, rowIndex + 1);

            setSchedules();
            return;
        }

        var template = require('../../template/admin/mk-schedule.hbs');
        var html = template(schedule);
        row.replaceWith(html);

        addAreaScheduleEvents();
    });
}

module.exports = {
    init: init
};