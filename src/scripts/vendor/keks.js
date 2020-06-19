$(window).on('load', function(){
    $('.js-review-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        autoplay: true,
        adaptiveHeight: true,
        autoplaySpeed: 5000,
        prevArrow: '<a class="arrows back"><img src="assets/img/keks/arrow-left.svg" alt="arrow-left"></img></a>',
        nextArrow: '<a class="arrows next"><img src="assets/img/keks/arrow-right.svg" alt="arrow-right"></img></a>',
    });

    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        $('.js-parallax').css('transform', 'translateY('+scroll*0.4+'px)');
        $('.js-parallax-deep').css('transform', 'translateY('+scroll*0.2+'px)');
        console.log(scroll);
    });
});