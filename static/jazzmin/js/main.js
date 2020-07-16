function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (value * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString() + '; SameSite=Strict;path=/';
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

function handleMenu() {
    $('[data-widget=pushmenu]').bind('click', function () {
        var menuClosed = getCookie('jazzy_menu') === 'closed';
        if (!menuClosed) {
            setCookie('jazzy_menu', 'closed');
        } else {
            setCookie('jazzy_menu', 'open');
        }
    });
}

function handleTabs() {
    var errors = $('.change-form .tab-content .errorlist li');
    var hash = document.location.hash;

    // If we have errors, open that tab first
    if (errors.length) {
        var tabId = errors.eq(0).closest('.tab-pane').attr('id');
        $('.nav-tabs a[href="#' + tabId + '"]').tab('show');

    // If we have a tab hash, open that
    } else if (hash) {
        $('.nav-tabs a[href="' + hash + '"]').tab('show');
    }

    // Change hash for page-reload
    $('.nav-tabs a').on('shown.bs.tab', function (e) {
        e.preventDefault();
        if (history.pushState) {
            history.pushState(null, null, e.target.hash);
        } else {
            location.hash = e.target.hash;
        }
    })
}

function setActiveLinks() {
    /*
     Set the currently active menu item based on the current url, or failing that, find the parent
     item from the breadcrumbs
     */
    const url = window.location.pathname;
    const $breadcrumb = $('.breadcrumb a').last();
    const $link = $('a[href="' + url + '"]');
    const $parent_link = $('a[href="' + $breadcrumb.attr('href') + '"]');

    if ($link.length) {
        $link.addClass('active');
    } else if ($parent_link.length){
        $parent_link.addClass('active');
    }
}

$(document).ready(function () {
    // Set active status on links
    setActiveLinks()

    // Ensure all raw_id_fields have the search icon in them
    $('.related-lookup').append('<i class="fa fa-search"></i>')

    // Allow for styling of selects
    $('.actions select').addClass('form-control');

    // Style the inline fieldset button
    $('.inline-related fieldset.module .add-row a').addClass('btn btn-sm btn-default float-right');

    $('#jazzy-carousel').on('slide.bs.carousel', function (e) {
        if (e.relatedTarget.dataset.hasOwnProperty("label")) {
            $('#carousel .carousel-fieldset-label').text(e.relatedTarget.dataset.label);
        }
    })

    // When we use the menu, store its state in a cookie to preserve it
    handleMenu();

    // Ensure we preserve the tab the user was on using the url hash, even on page reload
    handleTabs();
});
