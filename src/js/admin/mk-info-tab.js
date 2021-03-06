var infos = [];

function init(_infos) {
    infos = _infos;
    setInfos();

    $('[tab-id=info] .hta-add-row').on('click', function() {
        infos.push({
            title: '제목',
            value: '내용'
        });

        setInfos();
    });
}

function setInfos() {
    $('.hta-mk-info tbody').empty();

    var template = require('../../template/admin/mk-info.hbs');

    for (var i=0; i<infos.length; i++) {
        infos[i].no = i + 1;
        infos[i].value = infos[i].value.replace(/\n/g, '<br>'); // replace는 1개만 바꾼다. - 표현식 사용하면 다 바뀜
        var html = template(infos[i]);

        $('.hta-mk-info tbody').append(html);
    }

    addAreaInfoEvents();
}

function addAreaInfoEvents() {
    addBtnRowEvents();

    $('.hta-mk-info tbody tr').off('dblclick');
    $('.hta-mk-info tbody tr').on('dblclick', function() {
        var row = $(this);
        var rowIndex = $(this).index();
        var info = infos[rowIndex];
        info.value = info.value.replace(/<br>/g, '\n');
        var template = require('../../template/admin/mk-info-edit.hbs');
        var html = template(info);

        row.replaceWith(html);

        $('.hta-mk-info-value').on('keydown keyup', function () {
            $(this).height(1).height($(this).prop('scrollHeight')+12);
        }); // 높이를 1로 줄였다가 -> 크기+12만큼 늘린다. 좋은 소스는 아님


        addBtnRowEvents();
    });
}

function addBtnRowEvents() {
    $('.hta-mk-info .hta-btn-row').off('click');
    $('.hta-mk-info .hta-btn-row').on('click', function() {
        var row = $(this).parents('tr');
        var rowIndex = row.index();
        var info = infos[rowIndex];

        if ($(this).hasClass('hta-apply-row')) {
            info.title = row.find('.hta-mk-info-title').val().trim();
            info.value = row.find('.hta-mk-info-value').val().replace(/\n/g, '<br>').trim();
        }
        else if ($(this).hasClass('hta-remove-row')) {
            _.remove(infos, function(value, index) {
                return rowIndex === index;
            });

            setInfos();
            return;
        }
        else if ($(this).hasClass('hta-up-row')) {
            if (rowIndex < 1) {
                return;
            }

            infos = _.move(infos, rowIndex, rowIndex - 1);

            setInfos();
            return;
        }
        else if ($(this).hasClass('hta-down-row')) {
            if (rowIndex >= infos.length - 1) {
                return;
            }

            infos = _.move(infos, rowIndex, rowIndex + 1);

            setInfos();
            return;
        }

        var template = require('../../template/admin/mk-info.hbs');
        var html = template(info);
        row.replaceWith(html);

        addAreaInfoEvents();
    });
}

module.exports = {
    init: init
};