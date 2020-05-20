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
});
