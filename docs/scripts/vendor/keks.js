"use strict";

$(window).on('load', function () {
  $('.js-review-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    adaptiveHeight: true,
    prevArrow: '<a class="arrows back"><img src="assets/img/keks/arrow-left.svg" alt="arrow-left"></img></a>',
    nextArrow: '<a class="arrows next"><img src="assets/img/keks/arrow-right.svg" alt="arrow-right"></img></a>'
  });
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    $('.js-parallax').css('transform', 'translateY(' + scroll * 0.4 + 'px)');
    $('.js-parallax-deep').css('transform', 'translateY(' + scroll * 0.2 + 'px)');
  });
  $('.js-open-mobile-review').on('click', function (event) {
    $('.full-review').removeClass('hidden');
  });
  $('.js-open-mobile-order').on('click', function (event) {
    $('.full-order').removeClass('hidden');
  });
  $('.js-mobile-popup-close').on('click', function (event) {
    $('.js-mobile-popup').addClass('hidden');
  });
});