require('bootstrap');
require('../../less/admin/makers-info-edit.less');
require('./common');
require('eonasdan-bootstrap-datetimepicker');
require('eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css');

var UrlSearchParams = require('url-search-params');
var params = new UrlSearchParams(location.search);

var moment = require('moment');
var _ = require('lodash');
_.move = require('lodash-move').default;

var model = {
    imgs: [],
    infos: [],
    schedules: []
};

var slides = [];

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

$('#hta-mk-imgs-main').on('change', function() {
    if (this.files.length === 0) {
        return;
    }

    for (var i=0; i<this.files.length; i++) {
        var file = this.files[i];

        if (!file.type.startsWith('image/')) {
            alert('이미지 파일이 아닙니다.');
            return;
        }
    }

    var fileReader = new FileReader();

    fileReader.onload = function(event) {
        $('#hta-mk-imgs-main-preview > li').css({
            'background-image': 'url(' + event.target.result + ')',
        });

        $('#hta-mk-imgs-main-preview .main-img').text('되돌리기');
        $('#hta-mk-imgs-main-preview .main-img').css('cursor', 'pointer');
        $('#hta-mk-imgs-main-preview .main-img').on('click', function () {
            $('#hta-mk-imgs-main-preview > li').css({
                'background-image': 'url(' + model.mainImg + ')',
            });
            $('#hta-mk-imgs-main-preview .main-img').text('메인');
            $('#hta-mk-imgs-main-preview .main-img').css('cursor', 'auto');
            $('#hta-mk-imgs-main').val(''); // input file 초기화
        });
    };
    fileReader.readAsDataURL(this.files[0]);
});

$('#hta-mk-imgs-slide').on('change', function() {
    if (this.files.length === 0) {
        return;
    }

    for (var i=0; i<this.files.length; i++) {
        var file = this.files[i];

        if (!file.type.startsWith('image/')) {
            continue;
        }

        slides.push(file);

        var fileReader = new FileReader();

        fileReader.onload = function(event) {
            addPreview(event.target.result, false);
        };

        fileReader.readAsDataURL(file);
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
    model.orderDays = $('#mk-item-orderStart').val().trim() + ' ~ ' + $('#mk-item-orderEnd').val().trim();
    model.price = $('#mk-item-price').val().trim();
    model.likes = $('#mk-item-likes').val().trim();
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
        $('#mk-item-orderStart').focus();
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
    else if (!model.mainImg && $('#hta-mk-imgs-main')[0].files.length === 0) {
        alert('배경이미지를 선택하세요.');
        return;
    }
    else if (!slides.length && !_.filter(model.imgs, function(value) {
            return value !== '_removed_';
        }).length) { // 추가파일과 모델의 파일을 구분
        alert('슬라이드가 될 이미지입니다. <br>1개 이상은 필수입니다.');
        return;
    }

    if (!model.infos.length) {
        alert('제품정보가 없습니다. <br>1개 이상은 필수입니다.');
        return;
    }
    else {
        for (var i = 0; i < model.infos.length; i++) {
            if (!model.infos[i].title) {
                alert('정보의 제목을 입력하세요.');
                return;
            }
            else if (!model.infos[i].value) {
                alert('정보의 내용을 입력하세요.');
                return;
            }
        }
        for (var i=0; i<model.infos.length; i++) {
            delete model.infos[i].no;
        }
    }

    if (!model.schedules.length) {
        alert('배송정보가 없습니다. <br>1개 이상은 필수입니다.');
        return;
    }
    else {
        for (var i = 0; i < model.schedules.length; i++) {
            if (!model.schedules[i].schedule) {
                alert('배송 스케줄을 입력하세요.');
                return;
            }
        }
        for (var i = 0; i < model.schedules.length; i++) {
            delete model.schedules[i].no;
        }
    }

    if (!model.options.length) {
        alert('상품옵션 정보가 없습니다. <br>1개 이상은 필수입니다.');
        return;
    }
    else {
        for (var i = 0; i < model.options.length; i++) {
            if (!model.options[i].name) {
                alert('옵션의 내용을 입력하세요.');
                return;
            }
            else if (!model.options[i].price) {
                alert('옵션의 가격을 입력하세요.');
                return;
            }
        }
        for (var i = 0; i < model.options.length; i++) {
            delete model.options[i].no;
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
    formData.append('json', JSON.stringify(model)); // 모델을 JSON 형태로 바꿔줌

    var mainImg = $('#hta-mk-imgs-main')[0].files;
    if (mainImg.length > 0) {
        formData.append('mainImg', mainImg[0]);
    }

    slides.forEach(function(img) {
        formData.append('imgs', img);
    });

    $.ajax({
        url: url,
        method: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function(result) {
            alert('정상적으로 저장되었습니다.');
            if (pageType === 'add') {
                //안가지는 url - 상대주소 좀더 재대로 알아야 할듯
                // location.href + "?id=" + result.id
                // './makers-info-edit.html?id=' + result.id
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

$('.hta-delete').on('click', function () {
    var id = model.id;

    $.ajax({
        url: '/chi_makers/api/admin/makers/delete/' + id,
        success: function (result) {
            location.href = '/admin/makers-list.html';
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
        $('#mk-item-price').val(model.price);
        $('#mk-item-likes').val(model.likes);
        $('#mk-item-orders').val(model.orders);

        var html = '<li style="background-image: url(' + model.mainImg + ')"></li>';
        $('#hta-mk-imgs-main-preview > li').replaceWith(html);

        pageType = 'edit';
    }
    else {
        $('.hta-delete').hide();
    }

    if (model.mainImg) {
        $('#hta-mk-imgs-main-preview > li').css({
            'background-image': 'url(' + model.mainImg + ')',
        });
    }

    if (model.imgs) {
        model.imgs.forEach(function (img) {
            var url = img.img;
            addPreview(url, true);
        });
    }

    var mkInfoTab = require('./mk-info-tab');
    mkInfoTab.init(model.infos);

    var mkScheduleTab = require('./mk-schedule-tab');
    mkScheduleTab.init(model.schedules);

    var mkOptionTab = require('./mk-option-tab');
    mkOptionTab.init(model.options);

    orderDaySetting();
}

function addPreview(url, saved) {
    var preview = $('<li><div class="hta-img-remove">X</div></li>');
    preview.attr('saved', saved);

    preview.css({
        'background-image': 'url(' + url + ')'
    });

    $('#hta-mk-imgs-slide-preview').append(preview);
    // li:last-child - 추가하면 마지막에 붙으니까 마지막만 주면 결국 전부 이벤트 주게됨
    $('#hta-mk-imgs-slide-preview > li:last-child .hta-img-remove').on('click', function() {
        var img = $(this).parent('li');
        // 저장된 사진과 새로 추가된 사진 구분
        var saved = img.attr('saved') === 'true';
        var savedPhotoCount = model.imgs ? model.imgs.length : 0;
        // DB의 photo는 앞에 존재, 추가된 photo는 뒤에 존재하기 때문
        var index = saved ? img.index() : img.index() - savedPhotoCount;

        if (saved) {
            model.imgs[index].img = '_removed_';
            img.hide(); // 실제로 지우면 복잡해지기 때문에 표시하고 숨기기
        }
        else {
            slides.splice(index, 1); // array - splice(제거할 부분, 제거 수) - 추가할 요소 파라미터도 있지마 안썼음
            img.remove(); // 파일 선택이라면 지우면 됨
        }
    });
}

function orderDaySetting() {
    var pickerStart = $('#mk-item-orderStart');
    var pickerEnd = $('#mk-item-orderEnd');
    var startDay = moment();
    var endDay = moment();

    if (model.orderDays) {
        var flow = model.orderDays.indexOf('~');
        var orderStart = model.orderDays.substring(0, flow).trim();
        var orderEnd = model.orderDays.substring(flow).trim();
        startDay = moment(orderStart, 'YYYY.MM.DD a hh시');
        endDay = moment(orderEnd, '~ YYYY.MM.DD a hh시');
    }

    pickerStart.datetimepicker({
        locale: 'ko',
        dayViewHeaderFormat: 'YYYY.MM.DD a hh시',
        format: 'YYYY.MM.DD a hh시',
        date: startDay,
        minDate: moment(),
        sideBySide: true
    });
    pickerEnd.datetimepicker({
        locale: 'ko',
        useCurrent: false,
        dayViewHeaderFormat: 'YYYY.MM.DD a hh시',
        format: 'YYYY.MM.DD a hh시',
        date: endDay,
        sideBySide: true
    });

    pickerStart.val();
    pickerEnd.val();

    pickerStart.on('dp.change', function (e) {
        if (pickerStart.data().date > pickerEnd.data().date) {
            pickerEnd.data().date = pickerStart.data().date;
            pickerEnd.val(pickerEnd.data().date);
        }
        pickerEnd.data('DateTimePicker').minDate(e.date);
    });
}
