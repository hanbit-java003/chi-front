require('bootstrap');
require('../../less/admin/makers-info-edit.less');

var UrlSearchParams = require('url-search-params');
var params = new UrlSearchParams(location.search);

var _ = require('lodash');
_.move = require('lodash-move').default;

var model = {
    imgs: [],
    infos: [],
    schedules: []
};

if (!params.get('id')) {
    init();
}
else {
    $.ajax({
        url: '/chi_makers/api/makers/detail?id=' + params.get('id'),
        success: function(result) {
            model = result;
            init();
        }
    });
}

function init() {

}