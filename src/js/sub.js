require('bootstrap');
require('../less/sub.less');
require('./sub-footer');

$('.header-title').on('click', function() {
    location.href = 'index.html';
});

$('.carousel').carousel({
    interval: false
});