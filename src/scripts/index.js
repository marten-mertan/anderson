$(window).on('load', function(){
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
    
    $('.js-qritem-dropdown').on('click', function(event) {
        $(this).toggleClass('active');
    });

    $('.js-animation-to-cart').on('click', function(event) {
        var counter = Number($('.js-cart-counter').text()) + 1;
        $('.js-cart-counter').text(counter);
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
                //показать навигацию
                if (i == 0){
                    if( scroll > top){
                        $('.animations-online-flying-nav').removeClass('hidden');
                        $('.animations-online-flying-form').removeClass('hidden');
                    } else{
                        $('.animations-online-flying-nav').addClass('hidden');
                        $('.animations-online-flying-form').addClass('hidden');
                    }
                }
                //показать корзину и нижнюю форму
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

});
