require('bootstrap');
require('../../less/admin/makers-info-edit.less');
require('./common');

var UrlSearchParams = require('url-search-params');
var params = new UrlSearchParams(location.search);

var _ = require('lodash');
_.move = require('lodash-move').default;

var model = {
    imgs: [],
    infos: [],
    schedules: []
};

var pageType = 'add';

if (!params.get('id')) {
    init();
}
else {
    $.ajax({
        url: '/chi_makers/api/admin/makers/list/' + params.get('id'),
        method: 'POST',
        success: function(result) {
            model = result;
            init();
        }
    });
}

$('.mk-btn-file').on('click', function() {
    $('#' + $(this).attr('for')).click(); // for가 아이디 이니까 가져와서 input이 클릭되도록
});

$('#hta-mk-imgs').on('change', function() {
    if (this.files.length < 2) {
        alert('그림은 2개 이상');
        return;
    }

    for (var i=0; i<this.files.length; i++) {
        var file = this.files[i];

        if (!file.type.startsWith('image/')) {
            alert('이미지 파일이 아닙니다.');
            return;
        }
    }

    var fileLength = this.files.length;
    $('#hta-mk-imgs-preview').empty();
    for (var i=0; i<fileLength; i++) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(this.files[i]);
        fileReader.onload = function (event) {
            var url = event.target.result;
            var html = '<li style="background-image: url(' + url + ')"></li>';
            $('#hta-mk-imgs-preview').append(html);
        };
    }
});

$('.hta-tab-header > li').on('click', function() {
    if ($(this).hasClass('active')) {
        return;
    }

    var tabIndex = $(this).index();

    var tabBtns = $(this).parent('.hta-tab-header').find('li');
    tabBtns.removeClass('active');
    $(tabBtns[tabIndex]).addClass('active');

    var tabContents = $(this).parents('.hta-tab').find('.hta-tab-contents > li');
    tabContents.removeClass('active');
    $(tabContents[tabIndex]).addClass('active');

});

$('.hta-save').on('click', function() {
    model.title = $('#mk-item-title').val().trim();
    model.name = $('#mk-item-name').val().trim();
    model.content = $('#mk-item-content').val().trim();
    model.orderDays = $('#mk-item-orderdays').val().trim();
    model.price = $('#mk-item-likes').val().trim();
    model.orders = $('#mk-item-orders').val().trim();

    if (!model.title) {
        alert('제목을 입력하세요.');
        $('#mk-item-title').focus();
        return;
    }
    else if (!model.name) {
        alert('제품 이름을 입력하세요.');
        $('#mk-item-name').focus();
        return;
    }
    else if (!model.content) {
        alert('내용을 입력하세요.');
        $('#mk-item-content').focus();
        return;
    }
    else if (!model.orderDays) {
        alert('주문기한을 입력하세요.');
        $('#mk-item-orderdays').focus();
        return;
    }
    else if (!model.price) {
        alert('가격을 입력하세요.');
        $('#mk-item-price').focus();
        return;
    }
    else if (!model.orders) {
        alert('주문량을 입력하세요.');
        $('#mk-item-orders').focus();
        return;
    }
    else if (!model.imgs &&
        $('#hta-mk-imgs')[0].files.length < 2) {
        alert('메인과 슬라이드가 될 이미지입니다. <br>2개 이상 선택하세요.');
        return;
    }

    for (var i=0; i<model.infos.length; i++) {
        delete model.infos[i].no;

        if (!model.infos[i].title) {
            alert('정보의 제목을 입력하세요.');
            return;
        }
        else if (!model.infos[i].value) {
            alert('정보의 내용을 입력하세요.');
            return;
        }
    }

    for (var i=0; i<model.schedules.length; i++) {
        delete model.schedules[i].no;

        if (!model.schedules[i].schedule) {
            alert('배송 스케줄을 입력하세요.');
            return;
        }
    }

    var url;

    if (pageType === 'add') {
        url = '/chi_makers/api/admin/makers/add';
    }
    else if (pageType === 'edit') {
        url = '/chi_makers/api/admin/makers/' + model.id;
    }

    var formData = new FormData();
    formData.append('json', JSON.stringify(model));

    var imgs = $('#hta-mk-imgs')[0].files;
    for (var i=0; i<imgs.length; i++) {
        formData.append('imgs', imgs[i]); // 같은 이름(imgs)로 하나씩 넣으면, request에서 리스트로 받는다.
    }

    $.ajax({
        url: url,
        method: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function(result) {
            alert('정상적으로 저장되었습니다.');

            if (pageType === 'add') {
                location.href = location.href + '?id=' + result.id;
            }
            else if (pageType === 'edit') {
                location.reload();
            }
        },
        error: function() {
            alert('저장 중 오류가 발생하였습니다.');
        }
    });
});

function init() {
    var id = model.id;

    if (id) {
        $('#mk-item-id').text(id);
        $('#mk-item-title').val(model.title);
        $('#mk-item-name').val(model.name);
        $('#mk-item-content').val(model.content);
        $('#mk-item-orderdays').val(model.orderDays);
        $('#mk-item-price').val(model.price);
        $('#mk-item-likes').val(model.likes);
        $('#mk-item-orders').val(model.orders);
        pageType = 'edit';
    }

    if (model.imgs) {
        $('#hta-mk-imgs-preview').empty();
        model.imgs.forEach(function (img) {
            var url = img.img;
            var html = '<li style="background-image: url(' + url + ')"></li>';
            $('#hta-mk-imgs-preview').append(html);
        });
    }

    var mkInfoTab = require('./mk-info-tab');
    mkInfoTab.init(model.infos);

    var mkScheduleTab = require('./mk-schedule-tab');
    mkScheduleTab.init(model.schedules);

}