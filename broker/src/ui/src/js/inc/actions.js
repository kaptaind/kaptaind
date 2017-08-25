'use strict';

$(document).ready(function () {
    var $body = $('body');

    //Fullscreen Launch function
    function launchIntoFullscreen(element) {

        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    //Fullscreen exit function
    function exitFullscreen() {

        if(document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }


    $body.on('click', '[data-ma-action]', function (e) {
        e.preventDefault();

        var $this = $(this);
        var action = $this.data('ma-action');
        var target = '';

        switch (action) {
            /*-------------------------------------------
                Search
            ---------------------------------------------*/
            // Open
            case 'search-open':
                $('.search').addClass('search--toggled');
                break;

            // Close
            case 'search-close':
                $('.search').removeClass('search--toggled');
                break;


            /*-------------------------------------------
                Aside
            ---------------------------------------------*/
            // Open
            case 'aside-open':
                target = $this.data('ma-target');
                $this.addClass('toggled')
                $(target).addClass('toggled');
                $('.content, .header').append('<div class="ma-backdrop" data-ma-action="aside-close" data-ma-target='+target+' />');
                break;


            case 'aside-close':
                target = $this.data('ma-target');
                $('[data-ma-action="aside-open"], '+target).removeClass('toggled');
                $('.content, .header').find('.ma-backdrop').remove();
                break;


            /*-------------------------------------------
                Full screen browse
            ---------------------------------------------*/
            case 'fullscreen':
                launchIntoFullscreen(document.documentElement);
                break;


            /*-------------------------------------------
                Print
            ---------------------------------------------*/
            case 'print':
                window.print();
                break;


            /*-------------------------------------------------
                Clear local storage (SweetAlert 2 required)
            --------------------------------------------------*/
            case 'clear-localstorage':
                swal({
                    title: 'Are you sure?',
                    text: 'This can not be undone!',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, clear it',
                    cancelButtonText: 'No, cancel'
                }).then(function() {
                    localStorage.clear();
                    swal(
                        'Cleared!',
                        'Local storage has been successfully cleared',
                        'success'
                    );
                });
                break;


            /*-------------------------------------------
                Login
            --------------------------------------------*/
            case 'login-switch':
                target = $this.data('ma-target');
                $('.login__block').removeClass('active');
                $(target).addClass('active');
                break;


            /*-------------------------------------------
                Notifications clear
            --------------------------------------------*/
            case 'notifications-clear':
                e.stopPropagation();

                var items = $('.top-nav__notifications .listview__item');
                var itemsCount = items.length;
                var index = 0;
                var delay = 150;

                $this.fadeOut();

                items.each(function () {
                    var currentItem = $(this);
                    setTimeout(function () {
                        currentItem.addClass('animated fadeOutRight');
                    }, index+=delay);
                });

                setTimeout(function () {
                    items.remove();
                    $('.top-nav__notifications').addClass('top-nav__notifications--cleared');
                }, itemsCount*180);
                break;


            /*------------------------------------------------
                Toolbar search toggle
            -------------------------------------------------*/

            // Open
            case 'toolbar-search-open':
                $(this).closest('.toolbar').find('.toolbar__search').fadeIn(200);
                $(this).closest('.toolbar').find('.toolbar__search input').focus();
                break;

            // Close
            case 'toolbar-search-close':
                $(this).closest('.toolbar').find('.toolbar__search input').val('');
                $(this).closest('.toolbar').find('.toolbar__search').fadeOut(200);
                break;
        }
    }); 
});