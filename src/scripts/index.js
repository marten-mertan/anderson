$(window).on('load', function(){

    /*функция показа модального окна*/
    function showPopup(icon, popup) {
        $(document).on('click', icon, function (e) {
            var $html = $('html');
            e.preventDefault();
            $(popup).addClass('is-visible');
            $('.mfp-bg').addClass('is-visible');


            $html.addClass('lock-html');
            $('body').addClass('fixed-input');
            if (windowWidth > documentWidth) {
                $html.css({
                    'margin-right': '17px'
                });
                $('.mfp-wrap').css({
                    'overflow-y': 'scroll'
                });
                // console.log('Есть полоса прокрутки');
            } else {
                // console.log('Нет полосы прокрутки');
            }

            if (windowWidth > documentWidth) {

            } else {

            }

            var popupHolidayImg = $('.popup-holiday-menu__img img');
            var popupHolidayImgWidth = popupHolidayImg.width();
            var popupHolidayImgHeight = popupHolidayImg.height();
            var addpopupHolidayImgSize = function () {
                $('.popup-holiday-menu .popup-holiday-menu__img').css({
                    width: popupHolidayImgWidth,
                    height: popupHolidayImgHeight
                });
            }

            if (popup === '.popup-holiday-menu' && windowWidth >= 730) {
                addpopupHolidayImgSize();
            }

            $(window).resize(function () {
                if (windowWidth >= 730) {
                    addpopupHolidayImgSize();
                } else {
                    $('.popup-holiday-menu .popup-holiday-menu__img').css({
                        width: auto,
                        height: auto
                    });
                }
            });


        });
    }

    $('.js-home-slider').slick({
        slidesToShow: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 5000,
    });
    
    $('.js-qritems-slider').slick({
        centerMode: true,
        slidesToShow: 1,
        arrows: true,
        centerPadding: '0px',
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    centerMode: true,
                    slidesToShow: 1
                }
            }
        ]
    });

    $('.js-qritems-slider-video').slick({
        centerMode: true,
        slidesToShow: 1,
        arrows: true,
        centerPadding: '0px',
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    centerMode: true,
                    slidesToShow: 1
                }
            }
        ]
    });
    
    $('.js-qritem-dropdown').on('click', function(event) {
        $(this).toggleClass('active');
    });

    $('.js-animation-to-cart').on('click', function(event) {
        var counter = Number($('.js-cart-counter').text()) + 1;

        var butWrap = $(this).parents('.animations-online-programs-item');
        console.log(butWrap);
        butWrap.append('<div class="animtocart"></div>');
        var cart = $('.js-show-cart');
        $('.animtocart').css({
            'position' : 'absolute',
            'background' : butWrap.css('background'),
            'width' :  butWrap.width(),
            'height' : butWrap.height(),
            'border' : '2px solid #e4f3f0;',
            'z-index' : '9999999999',
            'opacity' : '0.4',
            'left' : butWrap.offset().left,
            'top' : butWrap.offset().top,
          });
        $('.animtocart').animate({ top: cart.offset().top + (cart.height() / 2) + 'px', left: cart.offset().left+ (cart.width() / 2) + 'px', width: 0, height: 0 }, 400, function(){
            $(this).remove();

            $('.js-cart-counter').text(counter);
        });
    });

    //плавный скролл
    function scrollToAnchor (elem) {
        $(document).on("click", elem, function (event) {
            var id  = $(this).attr('href'),
                menuHeight = 70,
                top = $(id).offset().top,
                topIndent = top - menuHeight;

            $('html').animate({scrollTop: topIndent}, 500);
        });
    };

    scrollToAnchor('.js-animations-link');

    $(document).ready(function(){
        var $sections = $('.js-section');
        $(window).scroll(function() {
            $sections.each(function(i,el){
                var top  = $(el).offset().top-100;
                var bottom = top +$(el).height();
                var scroll = $(window).scrollTop();
                var id = $(el).attr('id');
                if( scroll > top && scroll < bottom){
                    $('a.active').removeClass('active');
                    $('a[href="#'+id+'"]').addClass('active');
        
                }

                //показать нижнюю форму
                if (i == 0){
                    var headerHeight = $('header').height();
                    var windowHeight = window.innerHeight;
                    if( scroll > (headerHeight-windowHeight+150)){
                        $('.animations-online-flying-form').removeClass('hidden');
                    } else{
                        $('.animations-online-flying-form').addClass('hidden');
                    }
                }

                //показать навигацию
                if (i == 0){
                    if( scroll > top){
                        $('.animations-online-flying-nav').removeClass('hidden');
                    } else{
                        $('.animations-online-flying-nav').addClass('hidden');
                    }
                }
                //показать корзину
                if (i == 1){
                    if (scroll > top){
                        $('.animations-online-flying-cart').removeClass('hidden');
    
                    } else {
                        $('.animations-online-flying-cart').addClass('hidden');
                    }
                }
            });
        });
     
    });

    showPopup(".js-show-cart", '.popup-pie-one-click');

    $('.js-menu-burger').on('click', function(event) {
        $('.js-mobile-menu').removeClass('hidden');
    });

    $('.js-menu-close').on('click', function(event) {
        $('.js-mobile-menu').addClass('hidden');
    });

    // 100vh на мобилках
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
    
    
    $('.js-main-slider').slick({
        centerMode: true,
        slidesToShow: 1,
        arrows: true,
        dots: true,
        centerPadding: '0px',
    });

    $('.js-table-slider').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        infinite: true,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1140,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 820,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 520,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            }
        ]
    });
    $('.js-open-mobile-menu').on('click', function(event) {
        $('.js-mobile-menu').addClass('open');
    });

    $('.js-close-mobile-menu').on('click', function(event) {
        $('.js-mobile-menu').removeClass('open');
    });
    
    $(document).on('click','.js-mobile-filter-close', function(e){
        e.stopPropagation();
        $('.js-filter-mobile-dropdown').toggleClass('dropdown-show');
        $('.js-filter-mobile-dropdown').siblings('.filter-hold').slideToggle(200);
    });
    
    $('.js-main-table-input').bind('input', function() {
        var $this = $(this);
        var delay = 300;
        clearTimeout($this.data('timer'));
        $this.data('timer', setTimeout(function(){
            var value = $this.val().toLowerCase();
            if (value.length >= 3){
                $('.js-main-table-input-slide').each(function( index ) {
                    var text = $(this).children('.js-main-table-input-text').text().toLowerCase();
                    var number = $(this).data('slide');
                    if ((text).indexOf(value) !== -1){
                        console.log(text);
                        console.log(number);
                        $('.js-table-slider').slick('slickGoTo', number - 1);
                        return;
                    }
                });
            } else{
                
            }
        }, delay));
    });

    $(document).on('click','.js-add-package', function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).parents('.js-package').addClass('in-cart');
    });
    $(document).on('click','.js-delete-package', function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).parents('.js-package').removeClass('in-cart');
    });
    $(document).on('click','.js-package-head', function(e){
        e.preventDefault();
        $(this).parents('.js-package').toggleClass('closed');
    });
});
