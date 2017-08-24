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
    schedules: [],
    options: []
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
            alert(file.name + '은 이미지 파일이 아닙니다.');
            return;
        }
    }

    var fileReader = new FileReader();
    fileReader.onload = function (event) {
        var url = event.target.result;
        var html = '<li style="background-image: url(' + url + ')"></li>';
        $('#hta-mk-imgs-main-preview > li').replaceWith(html);
        $('#hta-mk-imgs-main-preview > li').attr('changed', true);
    };
    // file 읽어내기 작업이 끝나면 - onload event를 실행
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

        fileReader.onload = function (event) {
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
    model.orderDays = $('#mk-item-orderdays').val().trim();
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
    else if (!model.imgs[0] && !$('#hta-mk-imgs-main')[0].files.length) {
        alert('메인이 될 이미지입니다. <br>1개는 필수입니다.');
        return;
    }
    else if (!slides.imgs && !_.filter(model.imgs, function(value) {
            return value !== '_removed_';
        }).length) {
        alert('슬라이드가 될 이미지입니다. <br>1개 이상은 필수입니다.');
        return;
    }
    else if (!photos.length && !_.filter(model.photos, function(value) {
            return value !== '_removed_';
        }).length) { // 추가파일과 모델의 파일을 구분
        alert('사진을 한개 이상 추가하세요.');
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

    for (var i=0; i<model.options.length; i++) {
        delete model.options[i].no;

        if (!model.options[i].name) {
            alert('옵션의 내용을 입력하세요.');
            return;
        }
        else if (!model.options[i].price) {
            alert('옵션의 가격을 입력하세요.');
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
    formData.append('json', JSON.stringify(model)); // 모델을 JSON 형태로 바꿔줌

    var imgs = $('#hta-mk-imgs')[0].files;

    if (imgs.length > 0) { // input에 파일 입력하면 그것 사용, 아니면 model 것 사용
        for (var i=0; i<imgs.length; i++) {
            formData.append('imgs', imgs[i]); // 같은 이름(imgs)로 하나씩 넣으면, request에서 리스트로 받는다.
        }
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
        $('#mk-item-orderdays').val(model.orderDays);
        $('#mk-item-price').val(model.price);
        $('#mk-item-likes').val(model.likes);
        $('#mk-item-orders').val(model.orders);
        pageType = 'edit';
    }
    else {
        $('.hta-delete').hide();
    }

    if (model.imgs) {
        $('#hta-mk-imgs-main-preview').empty();
        $('#hta-mk-imgs-slide-preview').empty();
        var tag = '<div class="main-img">메인</div>';
        $('#hta-mk-imgs-main-preview').append(tag);
        model.imgs.forEach(function (img, index) {
            var url = img.img;
            var html = '<li style="background-image: url(' + url + ')"></li>';
            if (index === 0) {
                $('#hta-mk-imgs-main-preview').append(html);
            }
            else {
                addPreview(url, true);
            }
            img.remove = false;
        });
    }

    var mkInfoTab = require('./mk-info-tab');
    mkInfoTab.init(model.infos);

    var mkScheduleTab = require('./mk-schedule-tab');
    mkScheduleTab.init(model.schedules);

    var mkOptionTab = require('./mk-option-tab');
    mkOptionTab.init(model.options);
}

function addPreview(url, saved) {
    var preview = $('<li><div class="hta-img-remove">X</div></li>');
    preview.attr('saved', saved); // DB에 저장된 이미지인지, 지금 파일로 가져온 이미지인지 표시

    preview.css({
        'background-image': 'url(' + url + ')'
    });

    $('#hta-mk-imgs-slide-preview').append(preview);
    // li:last-child - 추가하면 마지막에 붙으니까 마지막만 주면 결국 전부 이벤트 주게됨
    $('#hta-mk-imgs-slide-preview > li:last-child .hta-img-remove').on('click', function() {
        var img = $(this).parent('li');
        // 저장된 사진과 새로 추가된 사진 구분
        var saved = img.attr('saved') === 'true';
        var savedPhotoCount = model.imgs.length; // 메인 이미지 빼고

        var index = saved ? img.index() : img.index() - savedPhotoCount;

        if (saved) {
            model.imgs[index + 1].remove = true;
            var shadow = '<div class="shadow">삭제취소</div>';
            img.append(shadow);
            $(this).hide();
            shadowEvent(index);
        }
        else {
            slides.splice(index); // array - splice(제거할 부분, 제거 수) - 추가할 요소 파라미터도 있지마 안썼음
            img.remove(); // 파일 선택이라면 지우면 됨
        }
    });
}

function shadowEvent(index) { // 받은 index의 nth-child를 줘서 해당 태그를 찾는다.
    $('#hta-mk-imgs-slide-preview > li:nth-child('+ (index + 1) +') .shadow').on('click', function () {
        var li = $(this).parent('li'); // parent를 사용하면 상위 태그 찾음 - index 사용안해도 됨
        $(li).find('.hta-img-remove').show();
        $(this).remove();
        model.imgs[index + 1].remove = false;
    });
}
