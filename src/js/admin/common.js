require('bootstrap');

$('.hta-logo').on('click', function() {
    location.href = './';
});

$('.hta-menu-group').on('click', function() {
    var link = $(this).attr('link');

    if (!link) {
        return;
    }

    location.href = "/admin/" + link + '.html';
});