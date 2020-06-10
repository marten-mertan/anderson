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
                menuHeight = 0,
                top = $(id).offset().top,
                topIndent = top - menuHeight;
            $('html').animate({scrollTop: topIndent}, 500);
        });
    };

    scrollToAnchor('.js-animations-link');

    $(document).ready(function(){   
        var $rules = $('#rules');
        var $programs = $('#pr-1');
        var $program2 = $('#pr-2');
        var $program3 = $('#pr-3');
        var $program4 = $('#pr-4');
        var $program5 = $('#pr-5');
        var $map = $('#map');
        $(window).scroll(function() {
            var scroll = $(window).scrollTop() + $(window).height();
            var offsetRules = $rules.offset().top + $rules.height();
            var offsetPrograms = $programs.offset().top + $programs.height();
            var offsetProgram2 = $program2.offset().top + $program2.height();
            var offsetProgram3 = $program3.offset().top + $program3.height();
            var offsetProgram4 = $program4.offset().top + $program4.height();
            var offsetProgram5 = $program5.offset().top + $program5.height();
            var offsetMap = $map.offset().top + $map.height();
            
            if (scroll > offsetRules) {
                $('.animations-online-flying-nav').removeClass('hidden');
            } else{
                $('.animations-online-flying-nav').addClass('hidden');
            }
            if (scroll > offsetPrograms) {
                $('.animations-online-flying-cart').removeClass('hidden');
                $('.animations-online-flying-form').removeClass('hidden');

            } else {
                $('.animations-online-flying-cart').addClass('hidden');
                $('.animations-online-flying-form').addClass('hidden');

            }
            if (scroll > offsetRules && scroll < offsetPrograms) {
                $('.js-animations-link').eq(0).addClass('active');

            } else {
                $('.js-animations-link').eq(0).removeClass('active');
            }
            if (scroll > offsetPrograms && scroll < offsetProgram2) {
                $('.js-animations-link').eq(1).addClass('active');

            } else {
                $('.js-animations-link').eq(1).removeClass('active');
            }
            if (scroll > offsetProgram2 && scroll < offsetProgram3) {
                $('.js-animations-link').eq(2).addClass('active');

            } else {
                $('.js-animations-link').eq(2).removeClass('active');
            }
            if (scroll > offsetProgram3 && scroll < offsetProgram4) {
                $('.js-animations-link').eq(3).addClass('active');

            } else {
                $('.js-animations-link').eq(3).removeClass('active');
            }
            if (scroll > offsetProgram4 && scroll < offsetProgram5) {
                $('.js-animations-link').eq(4).addClass('active');

            } else {
                $('.js-animations-link').eq(4).removeClass('active');
            }
            if (scroll > offsetProgram5 && scroll < offsetMap) {
                $('.js-animations-link').eq(5).addClass('active');

            } else {
                $('.js-animations-link').eq(5).removeClass('active');
            }
            if (scroll > offsetMap) {
                $('.js-animations-link').eq(6).addClass('active');

            } else {
                $('.js-animations-link').eq(6).removeClass('active');
            }
        });
     
    });

    showPopup(".js-show-cart", '.popup-pie-one-click');
});
