/* global BX, curUri, initedData */
var $body,
    windowHeight,
    windowWidth,
    mediaPoint1 = 1024,
    mediaPoint2 = 768,
    mediaPoint3 = 480,
    mediaPoint4 = 320;

var windowWidth = (window.innerWidth); // вся ширина окна
var documentWidth = (document.documentElement.clientWidth); // ширина минус прокрутка
// console.log('Ширина window: ' + windowWidth);
// console.log('Ширина wrapper: ' + documentWidth);
var documentHeight = (document.documentElement.clientHeight);
var reloadContent = '<div class="popup"><h3 class="popup-title">Загрузка <span class="popup-close"></span></h3><div style="text-align: center"><img src="/local/templates/anderson_new/images/preload.svg"></div> </div>',
    stopLoadItem = false;
$(document).ready(function () {
    loadJs();
});

$(document).ready(function () {
    $('body').on('click', '.delivery-club__link', function (e) {
        e.preventDefault();
        e.stopPropagation();
        location = 'https://www.delivery-club.ru/srv/AnderSon';
        return false;
    });
});

// fotorama

var fotoramaSlider = $('.holiday-hall-fotorama');


if (window.frameCacheVars !== undefined) {
    BX.addCustomEvent("onFrameDataReceived", function (json) {
        loadonFrameDataReceived();
    });
}
BX.addCustomEvent('onAjaxSuccess', function (e) {
    if (e == null)
        loadJs();
    else if (e.JS_FILTER_PARAMS) {
        loadJs();
    }
    loadAfterAjax();
});

function loadonFrameDataReceived() {
    $('.c-select').SumoSelect();
    changeRabbitFace('#form_dropdown_SIMPLE_QUESTION_257');
}

function loadAfterAjax() {
    //BX.UserConsent.loadFromForms();
    //$("#party-datepicker").datepicker("setDate", date);
    $('.order-tabs__item').click(function () {
        var tab = $(this).find('a').attr('href');
        $(tab).find('input.delivery').trigger('click');

        $('#delivery_price').show();
        $('#delivery_text').show();
        $('.popup-form__item.time-prop').show();

        console.log($(tab).find('input.delivery').val())
        if (parseInt($(tab).find('input.delivery').val()) === 3 || parseInt($(tab).find('input.delivery').val()) === 4) {
            $('#delivery_price').hide();
            $('#delivery_text').hide();
            $('.popup-form__item.time-prop').hide();
        }


    });
    $('.js-input--tel, input[name="form_text_30"] , input[name="form_text_68"]').mask('+7 (000) 000-00-00');

    $(document).on('click', '.order-delivery-search__clear', function (e) {
        e.preventDefault();
        $(this).parents('.order-delivery-search__item').siblings().find('input').val('');
        $('.order-delivery-address__all').removeClass('show-item-all');

        //showDeliveryAddressCake('.order-delivery-address__item');
    });

    //показать все адреса кафе в заказе
    function showDeliveryAddressCake(elem) {
        $(elem).each(function (i, elem) {
            i < 6 ? $(elem).show() : $(elem).hide();
        });
    }

    //showDeliveryAddressCake('.order-delivery-address__item');
    $('.c-card-product__slider').owlCarousel({
        loop: true,
        // nav:true,
        margin: 20,
        // items: 4,
        // center: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                nav: true,
                items: 2
            },
            1200: {
                nav: true,
                items: 3
            },
            1600: {
                nav: true,
                items: 3
            }
        }
    });
    $('.carousel-slider').owlCarousel({
        loop: true,
        // nav:true,
        margin: 20,
        // items: 4,
        // center: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            540: {
                nav: true,
                items: 2
            },
            780: {
                nav: true,
                items: 3
            },
            1200: {
                nav: true,
                items: 4
            },
            1600: {
                nav: true,
                items: 5
            }
        }
    });

    $('#lk-profile-subscription-del__ok').click(function () {
        removeSubs($(this).data('action'), $(this).data('id'));
    });

    $('#lk-profile-subscription-all').click(function () {
        var parent = $(this).parent().parent(), _checked = $(this).prop('checked'), inputs = parent.find('input');
        for (var i = 0; i < inputs.length; i++) {
            if (_checked)
                $(inputs[i]).prop('checked', true);
            else
                $(inputs[i]).prop('checked', false);
        }
    });
}

function loadJs() {

    $('.c-reviews-negative').click(function () {
        $('[name="form_checkbox_SIMPLE_QUESTION_989[]"]').val('60');
    })
    $('.c-reviews-positive').click(function () {
        $('[name="form_checkbox_SIMPLE_QUESTION_989[]"]').val('57');
    })
    $('#review-negative').change(function () {
        if ($(this).prop('checked')) {
            $('[name="form_checkbox_SIMPLE_QUESTION_989[]"]').val('60');
        }
    });
    $('#review-positive').change(function () {
        if ($(this).prop('checked')) {
            $('[name="form_checkbox_SIMPLE_QUESTION_989[]"]').val('57');
        }
    });
    $('#cafe_maps').click(function (e) {
        e.preventDefault();
        var scrollTo = $('#maps').offset().top;
        $('body, html').animate({scrollTop: scrollTo + 'px'}, 800);
    });
    var $datepicker = $('.datepicker-all');
    $('.datepicker-all').datepicker({
        autoClose: true
    });

    $('input[name="form_text_68"]').mask('+0(000)000-00-00', {clearIfNotMatch: true});
    loadGraduationDate();
    //DisabledFormButton('#popup-reg', '#reg__regulations', '#popup-reg button');
    //DisabledFormButton('#popup__write-to-us', '#write-to-us__regulations', '#popup__write-to-us button');
    //DisabledFormButton('#popup__request-call', '#request-call__regulations', '#popup__request-call button');
    DisabledFormButton('#popup__vacancy', '#vacancy__regulations', '#popup__vacancy button');
    DisabledFormButton('#order-auth-new', '#order-auth-new__regulations', '#order-auth-new button');
    changeRabbitFace('#form_dropdown_SIMPLE_QUESTION_257');
    fix_size();
    showPopup(".cafe-slider__tour", '.popup__virtual');
    showPopup(".c-card-cafe__menu", '.popup__menu');
    showPopup(".js-show-booking", '.popup__booking');

    $('.js-show-booking').click(function () {
        $('#booking_popup').html('<iframe style="display: block; overflow: hidden; /*position: absolute;*/ border: 0" width="100%" height="400px" src="' + $(this).data('frame') + '"></iframe>')
    })
    $('.top-message__close').click(function () {
        $.ajax({url: '/local/ajax/actions.php', data: {action: 'hide-top'}});
    });
    $(".tabs-menu a").click(function (event) {
        event.preventDefault();
        $(this).parent().addClass("current");
        $(this).parent().siblings().removeClass("current");
        var tab = $(this).attr("href");
        $(this).parents('.tabs-menu').parent().siblings('.tab').find(".tab-content").not(tab).css("display", "none");
        $(tab).find('input.delivery').trigger('click');
        $(tab).fadeIn();
    });
    $('.c-select').SumoSelect();
    $('.c-select--search').SumoSelect({
        forceCustomRendering: false,
        search: true,
        searchText: 'Искать...'
    });
    $('.c-card_menu').click(function () {
        loadMenu($(this))
    });

    $(document).on('click', '.c-card-cafe__menu', function () {
        loadMenu($(this));
    });

    $('#search-btn').on('click', function (e) {
        var data = $('#search_form').serialize();
        $.ajax({
            url: '/local/components/custom/search.filter/ajax.php' + '?' + data,
            success: function (res) {
                if (res != "") {
                    e.preventDefault();
                    window.location.assign(res);
                }
            }
        })
    });

    $('#authorization').click(function (e) {
        e.preventDefault();
        var rem = $('input[name=USER_REMEMBER]').prop('checked') ? 1 : 0;
        $('.errortext').hide();
        $.ajax({
            url: '/local/ajax/auth.php',
            method: 'POST',
            data: {
                login: $('input[name=USER_LOGIN]').val(),
                pass: $('input[name=USER_PASSWORD]').val(),
                rem: rem
            },
            success: function (res) {
                if (res.error) {
                    $('.errortext').show();
                    $('.errortext span.error_text').text(res.text);
                } else
                    window.location.reload();
            }
        });
    });

    $('#reg__email').change(function () {
        $('#login').val($(this).val());
    });
    $('.popup-city .c-button_yes').click(function () {
        var data = {
            city: $(this).data('id'),
            name: $(this).data('name'),
            code: $(this).data('code')
        };
        setCity($(this), data);
    });

    $('.popup-request-city__link').click(function () {
        $('.mobile-request-call .mobile_city').text($(this).text());
        $('#popup__request-call input[name="form_text_33"]').val($(this).text());
        $('.mobile-request-call__phone-number').text($(this).data('phone'));
    });
    $('.popup-city__link, .city__link').click(function () {
        var data = {
            city: $(this).data('id'),
            code: $(this).data('code'),
            url: $(this).data('url'),
            name: $(this).text()
        };
        setCity($(this), data);
    });

    $(document).on('click', '.change_city', function () {
        $('.mfp-bg').removeClass('is-visible');
        $('.header-city > a').trigger('click');
        $('.popup-pie').removeClass('is-visible');
        $('.mfp-bg').addClass('is-visible');
    });
    $(document).on('click', '.is-my_city', function () {
        console.log(1);
        $('.popup-city .c-button_yes').trigger('click');
    });

    $('.respond__vacancy').click(function () {
        var vacancyPopup = $('.popup__vacancy');
        vacancyPopup.find('.c-card-vacancy__title').text($(this).data('name'));
        if ($(this).data('price').length > 0)
            vacancyPopup.find('.c-card-vacancy__sum').text($(this).data('price') + '.-');
        else
            vacancyPopup.find('.c-card-vacancy__sum').text('');
        vacancyPopup.find('.c-card-vacancy__description .c-card-vacancy__text').html($(this).data('text'));
        $('#vacancy-name').val($(this).data('name'));
        $('#vacancy-city').val($(this).data('city'));
    });

    /*
     // load ITEM on scrollend
     var loadItem = function (target) {
     var $linkAjax = $(target).find('.ajax-link')
     if (!$linkAjax.hasClass('loading')) {
     $linkAjax.addClass('loading');
     $.ajax({
     url: $linkAjax.attr("href"),
     cache: false,
     type: 'GET',
     success: function (data) {
     $(target).append(data);
     $linkAjax.removeClass('loading');
     $linkAjax.eq(0).remove();
     }
     });
     }
     };
     
     $(document).on('click', '.ajax-link', function () {
     loadItem('.ajax-load-container');
     });
     
     $(window).scroll(function () {
     if ($(window).scrollTop() >= $(document).height() - $(window).height() - 240) {
     if ($('.ajax-link').length > 0) {
     loadItem('.ajax-load-container');
     }
     }
     });
     */
    //подключение тултипа
    $('.tooltip').tooltipster({
        animation: 'grow',
        delay: 100,
        trigger: 'custom',
        triggerOpen: {
            mouseenter: true,
            touchstart: true
        },
        triggerClose: {
            mouseleave: true,
            click: true,
            scroll: true,
            tap: true
        }
    });
    $('.eventToCart').click(function (e) {
        e.preventDefault();
        var id = $(this).data('product');
        var cafe = $(this).data('cafe');
        var time = $(this).data('time');
        $.ajax({
            url: '/local/ajax/add_to_cart.php',
            method: 'POST',
            data: {
                product: id,
                eventsCafe: cafe,
                eventsTime: time,
                action: 'add'
            },
            success: function (res) {
                BX.onCustomEvent('OnBasketChange');

            }
        });

    });

    $('.filter-bage, .filter-hold__close').click(function (e) {
        if ($('.catalog-body').hasClass('show-category')) {
            $.cookie("showLeftBlock", "1", {path: '/', expires: -1});
        } else {
            $.cookie("showLeftBlock", "1", {path: '/', expires: 1});
        }
    });

    $('.popup-graduation__close, #graduation__close,.easter__close, #easter__close, .hideout, .btn-birthday').click(function () {
        $.cookie("graduation", "1", {path: '/', expires: 1});
    });
    $('#adv_close, .adv_close').click(function () {
        $.cookie("adversting", "1", {path: '/', expires: 1});
    });
    setTimeout(function () {
        if ($(".popup-graduation").length > 0) {
            $(".popup-graduation").addClass('is-visible');
            $('.mfp-bg').addClass('is-visible');
            $('html').addClass('lock-html');

            if (windowWidth > documentWidth) {
                $('html').css({
                    'margin-right': '17px'
                });
                $('.mfp-wrap').css({
                    'overflow-y': 'scroll'
                });
            }
        }
        if ($(".popup-offer--easter").length > 0) {
            $(".popup-offer--easter").addClass('is-visible');
            $('.mfp-bg').addClass('is-visible');
            $('html').addClass('lock-html');

            if (windowWidth > documentWidth) {
                $('html').css({
                    'margin-right': '17px'
                });
                $('.mfp-wrap').css({
                    'overflow-y': 'scroll'
                });
            }
        }
        if ($(".popup-banner").length > 0) {
            $(".popup-banner").addClass('is-visible');
            $('.mfp-bg').addClass('is-visible');
            $('html').addClass('lock-html');

            if (windowWidth > documentWidth) {
                $('html').css({
                    'margin-right': '17px'
                });
                $('.mfp-wrap').css({
                    'overflow-y': 'scroll'
                });
            }
        }
    }, 3000);

    $('input[name="excursion-pay"]').change(function () {
        if ($(this).val() !== 'excursion-score') {
            $('.excursion-pay-score').find('input').prop('disabled', true);
            $('.excursion-pay-score').find('input').each(function () {
                $(this).data('old-val', $(this).val());
                $(this).val('');
            });
        } else {
            $('.excursion-pay-score').find('input').prop('disabled', false);
            $('.excursion-pay-score').find('input').each(function () {
                $(this).val($(this).data('old-val'));
            });
        }
    });

    /******* EXCURSION **************/
    $('.excursion__count .c-counter__btn').click(function () {
        incQuantity($(this), true, '.replace__price-block', '.excursion__buy .c-counter__field');
    });
    $('.excursion__count .c-counter__field').change(function () {
        incQuantity($(this), true, '.replace__price-block', '.excursion__buy .c-counter__field');
    });

    $('#excursion-score-inn').mask('0000000000');
    $('#excursion-score-kpp').mask('000000000');
    $('#excursion-score-rs, #excursion-score-ks').mask('00000000000000000000');
    $('#excursion-score-bik').mask('000000000');

    $('#excursion-buy').click(function () {
        var code = $(this).data('code');
        window.history.pushState(null, null, code);
    });
    $('.popup-excursion-order .popup-close').click(function () {
        window.history.pushState(null, null, '/excursion/');
    });
    $('#excursion-buy.clicked').click();

    $('.subscribe__btn').click(function (e) {
        e.preventDefault();
        var email = $(this).parent().find('input[name="EMAIL"]').val(), _this = $(this), id = $(this).data('id'),
            _this = $(this);
        var action = $(this).data('action');
        $.ajax({
            url: '/local/ajax/subscribe.php',
            data: {
                EMAIL: email,
                action: action,
                id: id
            },
            success: function (res) {
                if (!res.error && action == 'add') {
                    _this.addClass('active');
                    _this.text('Вы подписаны');
                    _this.data('id', res.ID);
                    _this.data('action', 'delete');
                    localStorage.setItem('sub_email', email);
                }
                if (!res.error && action == 'delete') {
                    _this.parent().find('input[name="EMAIL"]').val('')
                    _this.addClass('active');
                    _this.text('Подписаться');
                    _this.data('action', 'add');
                    localStorage.removeItem('sub_email');
                }
            }
        });
    });
    /********** EXCURSION END **************/

    /* halls filter */
    $(document).on('change', '.select-city', function () {

        var val = $(this).val();

        $('.select-cafe option').each(function (i) {
            if (i === 0)
                return;
            var city = $(this).data('city');
            $(this).prop('disabled', false);
            if (val !== city && val !== '')
                $(this).prop('disabled', true);
        });
        if ($('.select-cafe').length > 0) {
            $('.select-cafe')[0].sumo.reload();
            filterHalls('halls.filter');
        }
    });
    $(document).on('change', '.select-cafe', function () {
        var city = $(this).find('option:selected').data('city');
        $('.select-city option').each(function (i) {
            if (i === 0)
                return;
            var val = $(this).val();
            $(this).prop('disabled', false);
            if (val !== city && typeof city !== 'undefined')
                $(this).prop('disabled', true);
        });
        if ($('.select-city').length > 0) {
            $('.select-city')[0].sumo.reload();
            filterHalls('halls.filter');
        }
    });
    $(document).on('change', '.select-guest', function () {
        filterHalls('halls.filter');
    });

    /* holiday offers */
    $(document).on('change', '#cafe_list', function () {
        var val = $(this).val(), html = '', interval = '', key = 0;
        for (var i in initedData['HALL_LIST'][val]) {
            var hall = initedData['HALL_LIST'][val][i];
            html += '<option value="' + hall.ID + '">' + hall.NAME + '</option>';
            if (key == 0) {
                var selectedHallName = hall.NAME, selectedHallId = hall.ID, selectedHallHL = hall.UF_XML_ID;
                for (var j in initedData['INTERVAL'][hall.ID]) {
                    var intervalOne = initedData['INTERVAL'][hall.ID][j],
                        disabled = intervalOne.disabled == 1 ? ' disabled' : '';
                    interval += '<option value="' + intervalOne.UF_XML_ID + '"' + disabled + ' data-id="' + intervalOne.ID_IBLOCK + '">' + intervalOne.UF_NAME + '</option>';
                }
            }
            ++key;
        }
        $('#interval_list').html(interval);
        $('#interval_list')[0].sumo.reload();
        $('#hall_list').html(html);
        $('#hall_list')[0].sumo.reload();

        $('input[name="PROPS[CAFE]"]').val($('#cafe_list').find('option:selected').text());
        $('input[name="PROPS[HALL]"]').val($('#hall_list').find('option').eq(0).text());
        var array = {
            'CAFE': val,
            'HALL': selectedHallId,
            'INTERVAL_ID': $("#interval_list").find('option').eq(0).data('id'),
            'INTERVAL_HL': $("#interval_list").find('option').eq(0).val()
        };
        $('input[name="PROPS[BOOKING_DATA]"]').val(JSON.stringify(array));
        $('#hall_list').trigger('change');
    });
    $(document).on('change', '#hall_list', function () {
        var val = $(this).val(), interval = '';

        for (var j in initedData['INTERVAL'][val]) {
            var intervalOne = initedData['INTERVAL'][val][j];
            for (var k in initedData['INTERVAL_NEW'][val]) {
                if (initedData['INTERVAL_NEW'][val][k].TYPE == intervalOne.UF_DAY_TIME) {
                    intervalOne.UF_NAME = initedData['INTERVAL_NEW'][val][k].UF_NAME;
                }
            }
            if (typeof (initedData['INTERVAL_NEW'][val][intervalOne.UF_NAME]) !== 'undefined')
                var disabled = initedData['INTERVAL_NEW'][val][intervalOne.UF_NAME].disabled == 1 ? ' disabled' : '';
            if (typeof intervalOne.UF_NAME !== 'undefined')
                interval += '<option value="' + intervalOne.UF_XML_ID + '"' + disabled + ' data-id="' + intervalOne.ID_IBLOCK + '" data-type="' + intervalOne.UF_DAY_TIME + '">' + intervalOne.UF_NAME + '</option>';
        }
        $('#interval_list').html(interval);
        $('#interval_list')[0].sumo.reload();
        $('input[name="PROPS[CAFE]"]').val($('#cafe_list').find('option:selected').text());
        $('input[name="PROPS[HALL]"]').val($('#hall_list').find('option:selected').text());
        var option = $("#interval_list").find('option').eq(0);
        var hlId = $("#interval_list").find('option').eq(0).val();
        if ($(option).prop('disabled')) {
            hlId = '';
        }
        var array = {
            'CAFE': $('#cafe_list').find('option:selected').val(),
            'HALL': val,
            'INTERVAL_ID': $("#interval_list").find('option').eq(0).data('id'),
            'INTERVAL_HL': hlId
        };
        $('#interval_list').change();
        $('input[name="PROPS[BOOKING_DATA]"]').val(JSON.stringify(array));
    });
    $(document).on('change', '#interval_list', function () {
        var array = {
            'CAFE': $('#cafe_list').find('option:selected').val(),
            'HALL': $('#hall_list').find('option:selected').val(),
            'INTERVAL_ID': $(this).find('option:selected').data('id'),
            'INTERVAL_HL': $(this).val()
        };
        $('input[name="PROPS[INTERVALS][]"]').val($(this).find('option:selected').text());
        $('input[name="PROPS[TIME_INTERVAL]"]').val($(this).find('option:selected').data('type'));
        $('input[name="PROPS[BOOKING_DATA]"]').val(JSON.stringify(array));
    });
    $(document).on('click', '#send_holiday_order', function (e) {
        e.preventDefault();
        var formData = getFormData('party-form');
        formData['save'] = 'Y';
        showLoader();
        $.ajax({
            url: '/local/ajax/buy/child_holidays.php',
            data: formData,
            method: 'POST',
            success: function (e) {
                endLoader();
                if (!e.error) {
                    $('#interval_list').find('option:selected').prop('disabled', true);
                    $('#interval_list')[0].sumo.reload();
                    $('.errortext').hide();
                    $('#orderId').html(e.orderId);
                    $('#payment_link').attr('href', e.url);
                    $('.popup-party-order').removeClass('is-visible');
                    $('.children-holiday-congratulation').addClass('is-visible');
                } else {
                    $('input').removeClass('error');
                    $('.errortext').show();
                    $('#party-error-content').html(e.text);
                    for (var i = 0; i < e.codes.length; i++)
                        $('input[name="' + e.codes[i] + '"]').addClass('error');
                }

                dataLayer.push({'event': 'HolidayRequest'});
            }
        });
    });


    $(document).on('click', '.tabs-menu a', function (event) {
        event.preventDefault();
        $(this).parent().addClass("current");
        $(this).parent().siblings().removeClass("current");
        var tab = $(this).attr("href");
        $(this).parents('.tabs-menu').parent().siblings('.tab').find(".tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
    });

//    $('.js-lazy').Lazy({
//        effect: 'fadeIn',
//        effectTime: 500,
//        afterLoad: function (element) {
//            element.removeClass('lazy-animation');
//        }
//    });

}

function setScheldure(_this) {
    yaCounter24015385.reachGoal('zapisopen');
    var ri1 = _this.attr("prop1");
    var ri2 = _this.attr("prop2");
    var ri3 = _this.attr("prop3");
    var ri4 = _this.attr("prop4");
    var ri5 = _this.attr("prop5");
    var ri6 = _this.attr("prop6");
    var ri7 = _this.attr("prop7");
    $(".send5").val(ri1);
    $(".send4").val(ri3);
    $(".send8").val(ri4);
    $(".send9").val(ri5);
    $(".send13").val(ri6);
    $(".send14").val(ri7);
    $(".send6").text("http://cafe-anderson.ru" + ri2);

    $.post("/include/merocal.php", {
        availability: "Y",
        eventId: ri3
    }, function (data) {
        console.log(data);
        $(".available").html(data);
        $(".send10").html("");
        $(".send10").append('<option value="0">Выбрать</option>');
        for (i = 1; i <= parseInt(data); i++) {
            $(".send10").append('<option value="' + i + '">' + i + '</option>');
        }
        $('.c-select')[0].sumo.reload();
    });
}

$("#recalc_order_exc").click(function (event) {
    var formData = getFormData('excursion-form');
    formData['action'] = 'enterCoupon';
    var _this = this, target = event.target;

    $.ajax({
        url: '/local/ajax/buy/coupon.php',
        data: formData,
        method: 'POST',
        success: function (e) {
            if (e.error) {
                $('input[name="coupon"]').removeClass('error');
                $('.errortext').show();
                var text = e.text;
                $('#error-content').html(text);
                $('input[name="coupon"]').addClass('error');
            } else {
                $("#excursion-form .replace__price-block").html(e.price);
                $('.errortext').hide();
                $('input[name="coupon"]').removeClass('error');
                if (_this.couponAction == 'deleteCoupon') {
                    _this.coupon = false;
                    _this.couponAction = 'enterCoupon';
                    $(target).text('Применить купон');
                } else {
                    _this.coupon = true;
                    _this.couponAction = 'deleteCoupon';
                    $(target).text('Удалить купон');
                }
            }
        }
    });
});

function initFormSubscribe() {
    $(document).on('click', '.animate .filter-subscription__btn', function (e) {
        e.preventDefault();
        if (document.querySelector('[name="form_email"]').value.length > 0) {
            var result = [];
            var cafe = $('[name="arrFilter_336"]').val();

            $('[name="arrFilter_336"] option').each(function () {
                if (cafe.indexOf($(this).val()) != -1) {
                    result.push($(this).html())
                }
            });

            var data = {};
            data.email = $('[name="form_email"]').val();
            data.cafe = result;
            $.ajax({
                url: '/local/ajax/add_subscribe_shedule.php',
                type: 'POST',
                data: data,
                success: function (data) {
                    var result = JSON.parse(data);
                    if (result.success == 1) {
                        var $html = $('html');
                        $('.popup-subscribe').addClass('is-visible');
                        $('.mfp-bg').addClass('is-visible');


                        $('.filter-subscription').removeClass('animate');
                        $html.addClass('lock-html');
                        $('body').addClass('fixed-input');
                        if (windowWidth > documentWidth) {
                            $html.css({
                                'margin-right': '17px'
                            });
                            $('.mfp-wrap').css({
                                'overflow-y': 'scroll'
                            });
                        }
                    }
                }
            });

        }
    })
}

var contactUsFormFiles;
$('#contact-us-form input[type=file]').change(function () {
    contactUsFormFiles = this.files;
});
$('#contact-us-form').submit(function (e) {
    e.preventDefault();

    var data = new FormData();
    data.name = $(this).find('#contact-us__user').val();
    data.phone = $(this).find('#contact-us__phone').val();
    data.email = $(this).find('#contact-us__email').val();
    data.message = $(this).find('#contact-us__message').val();
    data.theme = $(this).find('#contact-us-theme option:selected').html();
    data.emailTo = $(this).find('#contact-us-theme').val();

    $.each(contactUsFormFiles, function (key, value) {
        data.append(key, value);
    });


    if (data.theme && data.emailTo && data.name && data.phone && data.email && data.message) {
        $.ajax({
            url: "/local/ajax/contact_us.php?name=" + data.name + "&phone=" + data.phone + "&email=" + data.email + "&message=" + data.message + "&theme=" + data.theme + "&emailTo=" + data.emailTo,
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            success: function (data) {
                $('#contact-us-form').trigger('reset');
                $('#contact-us-theme').val('');
                $('#contact-us-theme')[0].sumo.reload();
                $('label[for=file] span').html('Прикрепить файл');
                contactUsFormFiles = '';
                var $html = $('html');
                $('.popup-contact-us').addClass('is-visible');
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
                }
            }
        });
    }
});

$(document).ready(function () {

    if (window.b24Tracker) {
        $('.lead_utm_source').val(window.b24Tracker.guest.getUtmSource());
    }
//    var bannerNewYear = getCookie('banner-new-year');
//    console.log(bannerNewYear);
//
//    if(bannerNewYear == undefined ) {
//        var $html = $('html');
//        $('.popup-banner-new-year').addClass('is-visible');
//        $('.mfp-bg').addClass('is-visible');
//
//
//        $html.addClass('lock-html');
//        $('body').addClass('fixed-input');
//        if (windowWidth > documentWidth) {
//            $html.css({
//                'margin-right': '17px'
//            });
//            $('.mfp-wrap').css({
//                'overflow-y': 'scroll'
//            });
//        }
//
//
//        $('.popup-banner-new-year .main-btn').click(function () {
//            $.cookie("banner-new-year", "1", {path: '/', expires: 3});
//        });
//        $('.popup-banner-new-year .popup-close').click(function () {
//            $.cookie("banner-new-year", "1", {path: '/', expires: 3});
//        });
//    }
});

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

$(document).on('click', '.reviews-form button', function (e) {
    if (!$('input[name=form_dropdown_SIMPLE_QUESTION_257]:checked').val()) {
        e.preventDefault();
        $('label.reviews').addClass('error-text');
        var scrollTo = $('label.reviews').offset().top - 150;
        $('body, html').animate({scrollTop: scrollTo + 'px'}, 800);
    } else {
        $('label.reviews').removeClass('error-text');
    }
});

$('.carousel-slider-new').owlCarousel({
    loop: true,
    // nav:true,
    margin: 5,
    // items: 4,
    // center: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1
        },
        540: {
            nav: true,
            items: 2
        },
        780: {
            nav: true,
            items: 3
        },
        1200: {
            nav: true,
            items: 4
        },
        1600: {
            nav: true,
            items: 5
        }
    }
});
/*Папа года 2019*/
if ($('.february')) {
    bestFatherTotal();
    $('.february .c-counter-big__btn').click(function () {
        var priceClass = '';

        if ($(this).hasClass('grown')) {
            priceClass = '.price-total.grown';
        } else {
            priceClass = '.price-total.children';
        }
        incQuantity($(this), false, priceClass, true);
        bestFatherTotal();
    });
    $('.february input[type=checkbox]').click(function () {
        bestFatherTotal();
        if ($(this).attr('name') == 'best-father') {
            if ($(this).prop('checked')) {
                $('.form-block-head.best-father').animate({height: 'show'}, 500);
            } else {


                $('.form-block-head.best-father').animate({height: 'hide'}, 500);
            }
        }
    });

    function bestFatherTotal() {
        var inputGrown = $('input[name=grown]');
        var inputChildren = $('input[name=children]');
        var inputFather = $('input[name=best-father]');
        var total = '';
        var price = 0;
        if (true) {
            if (inputGrown.prop('checked')) {
                var grown = $('.fieldCount.grown').val();
                var text = '';
                if (grown == 1) {
                    text = 'взрослый';
                } else {
                    text = 'взрослых';
                }
                total += grown + ' ' + text;

                price += 2200 * grown;
                $('.c-counter-big__btn.dec.grown').css({visibility: 'visible'});
                if (grown <= 0) {
                    $('.c-counter-big__btn.dec.grown').css({visibility: 'hidden'});
                }
            }
            if (inputChildren.prop('checked')) {
                var children = $('.fieldCount.children').val();
                var text = '';
                if (children == 1) {
                    text = 'детский';
                } else {
                    text = 'детских';
                }
                if (total.length > 0) {
                    total += ', ';
                }
                total += children + ' ' + text;
                price += 0 * children;

                $('.c-counter-big__btn.dec.children').css({visibility: 'visible'});
                if (children <= 0) {
                    $('.c-counter-big__btn.dec.children').css({visibility: 'hidden'});
                }
            }
            if (inputFather.prop('checked')) {
                if (total.length > 0) {
                    total += ' + ';
                }
                total += 'заявка на участие';
                price += 1000;
            }


            if (total.length > 0) {
                $('.february .total-block').show();
                $('#total').html(new Intl.NumberFormat().format(price) + ' руб (' + total + ')');
            } else {
                $('.february .total-block').hide();
            }
        }
    }

    $('.february .form-block .buy').click(function (e) {
        e.preventDefault();

        var inputGrown = $('input[name=grown]');
        var inputChildren = $('input[name=children]');
        var inputFather = $('input[name=best-father]');
        var data = {};

        var qGrown = parseInt($('.fieldCount.grown').val()), qChild = parseInt($('.fieldCount.children').val());
        data.basket = [];

        if (qGrown == 0 && qChild == 0) {
            alert('Укажите количество взрослых или детских билетов');
            return false;
        }
        if (inputGrown.prop('checked') && qGrown > 0) {
            data.basket.push({
                'id': inputGrown.data('id'),
                'quantity': $('.fieldCount.grown').val()
            });
        }
        if (inputChildren.prop('checked') && qChild > 0) {
            data.basket.push({
                'id': inputChildren.data('id'),
                'quantity': $('.fieldCount.children').val()
            });
        }
        if (inputFather.prop('checked')) {
            data.basket.push({
                'id': inputFather.data('id'),
                'quantity': 1
            });
        }
        data.fio = $('.february input[name=fio]').val();
        data.phone = $('.february input[name=phone]').val();
        data.email = $('.february input[name=email]').val();

        data.instagramFather = $('.february input[name=father-instagram]').val();
        data.fioFather = $('.february input[name=father-fio]').val();
        data.phoneFather = $('.february input[name=father-phone]').val();
        data.emailFather = $('.february input[name=father-email]').val();


        if (inputFather.prop('checked')) {
            if (data.fioFather.length == 0) {
                $('.february input[name=father-fio]').css('border', '1px solid red');
                return;
            } else {
                $('.february input[name=father-fio]').css('border', '1px solid #d2cdc4');
            }

            if (data.instagramFather.length == 0) {
                $('.february input[name=father-instagram]').css('border', '1px solid red');
                return;
            } else {
                $('.february input[name=father-instagram]').css('border', '1px solid #d2cdc4');
            }

            if (data.phoneFather.length == 0) {
                $('.february input[name=father-phone]').css('border', '1px solid red');
                return;
            } else {
                $('.february input[name=father-phone]').css('border', '1px solid #d2cdc4');
            }

            if (data.emailFather.length == 0) {
                $('.february input[name=father-email]').css('border', '1px solid red');
                return;
            } else {
                $('.february input[name=father-email]').css('border', '1px solid #d2cdc4');
            }
        }


        if (data.fio.length == 0) {
            $('.february input[name=fio]').css('border', '1px solid red');
            return;
        } else {
            $('.february input[name=fio]').css('border', '1px solid #d2cdc4');
        }

        if (data.phone.length == 0) {
            $('.february input[name=phone]').css('border', '1px solid red');
            return;
        } else {
            $('.february input[name=phone]').css('border', '1px solid #d2cdc4');
        }

        if (data.email.length == 0) {
            $('.february input[name=email]').css('border', '1px solid red');
            return;
        } else {
            $('.february input[name=email]').css('border', '1px solid #d2cdc4');
        }

        if (data.basket.length == 0) {
            return
        }
        showLoader();
        $.ajax({
            url: '/local/ajax/buy/best_father.php',
            method: 'POST',
            data: data,
            success: function (res) {
                if (res.error == 0) {
                    $('#best-father-order').html(res.orderId);
                    $('#best-father-link').attr('href', res.url);

                    var $html = $('html');

                    var deadline = new Date(Date.parse(new Date()) + 15 * 60 * 1000); // for endless timer
                    initializeClock('best_timer', deadline);

                    $('.february-ok-order').addClass('is-visible');
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

                    }
                    $('.february input[name=fio]').val('');
                    $('.february input[name=instagram]').val('');
                    $('.february input[name=phone]').val('');
                    $('.february input[name=email]').val('');
                    $('.february input[name=grown]').prop('checked', true);
                    $('.february input[name=children]').prop('checked', true);
                    $('.february input[name=best-father]').prop('checked', false);
                    $('.february .fieldCount').val(0);
                    bestFatherTotal();
                } else {
                    var $html = $('html');
                    $('.february-fail-order').addClass('is-visible');
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

                    }
                }

                endLoader();
            }
        });


    });

    $('.february .buy-ticket.btn-1').click(function () {
        var target = $('.february .form-block');
        if (target.length) {
            var heightHeader = $('.header').height();
            var scrollTo = target.offset().top - (+heightHeader + 100);
            $('body, html').animate({scrollTop: scrollTo + 'px'}, 800);
        }
    });
    $('.february .buy-ticket.btn-2').click(function () {
        var target = $('.february .father-day-body');
        if (target.length) {
            var heightHeader = $('.header').height();
            var scrollTo = target.offset().top - (+heightHeader + 100);
            $('body, html').animate({scrollTop: scrollTo + 'px'}, 800);
        }
    });
    $('.february .request').click(function () {
        var target = $('.february .form-block');
        if (target.length) {
            var heightHeader = $('.header').height();
            var scrollTo = target.offset().top - (+heightHeader + 100);
            $('body, html').animate({scrollTop: scrollTo + 'px'}, 800);
        }
    });
    initBestFatherMobileSlider();
    $(window).on('resize orientationchange', function () {

        initBestFatherMobileSlider();


    });

    function initBestFatherMobileSlider() {
        var mySlider = $('.img-carousel.slider-for');

        if (!mySlider.hasClass('slick-initialized')) {
            $('.img-carousel.slider-for').slick({
                responsive: [
                    {
                        breakpoint: 9999,
                        settings: "unslick"
                    },
                    {
                        breakpoint: 956,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            infinite: true,
                            dots: true
                        }
                    }
                ]
            });
        }
    }

    function getTimeRemaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function initializeClock(id, endtime) {
        var clock = document.getElementById(id);
        //var daysSpan = clock.querySelector('.days');
        //var hoursSpan = clock.querySelector('.hours');
        var minutesSpan = clock.querySelector('#minutes');
        var secondsSpan = clock.querySelector('#seconds');

        function updateClock() {
            var t = getTimeRemaining(endtime);

            //daysSpan.innerHTML = t.days;
            //hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
            minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
            secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

            if (t.total <= 0) {
                clearInterval(timeinterval);
                $('#best-father-link').addClass('disabled');
                $('#best-father-link').attr('href', 'javascript:void(0)');
                //$('#best-father-link').remove();
            }
        }

        updateClock();
        var timeinterval = setInterval(updateClock, 1000);
    }

}
BX.addCustomEvent('onAjaxSuccess', function () {
    if ($('.events__item.best-father'))
        showPopup('.popup-best-father', '.popup-best-father-list');
});
showPopup('.popup-best-father', '.popup-best-father-list');


$('.c-reviews-positive').click(function () {
    $('.datepicker-all').datepicker({
        autoClose: true
    });
});
$('.c-reviews-negative').click(function () {
    $('.datepicker-all').datepicker({
        autoClose: true
    });
});
$('.js-positive').click(function () {
    $('.datepicker-all').datepicker({
        autoClose: true
    });
});
$('.js-negative').click(function () {
    $('.datepicker-all').datepicker({
        autoClose: true
    });
});

if ($("div.wedding").length > 0) {
    $('a.wedding-sale-card__btn').click(function (e) {
        e.preventDefault();
        var name = $(this).parent().parent().find('.wedding-sale-card__title').html();
        if (name) {
            $("form[name='WEDDING_FORM'] input[name='form_hidden_146']").val(name);
        }
        var scrollTo = $('div.holiday-hall-sentence__body').offset().top;
        $('body, html').animate({scrollTop: scrollTo + 'px'}, 800);
    });
}
$('.order-finish-item .c-button.c-button__default').click(function () {
    if ($('.order-finish-item .order-item__title').html() == 'Новый Год') {
        yaCounter24015385.reachGoal('click_buy');
        console.log('click_buy');
    }
});

$(document).ready(function () {
    $('body').on('click', '.popup-product__btn-back', function (e) {
        e.preventDefault();
        $(this).closest('.popup').find('.popup-close').get(0).scrollIntoView({behavior: 'smooth', block: 'center'});
    });

    $('body').on('click', '.popup-basket-card__close', function (e) {
        var item_id = $(this).data('item-id');
        var card = $('.c-card-catalog-2[data-item-id="' + item_id + '"]');
        console.log('click', card);
        $(card).find('.c-card-catalog-2__footer').find('.c-card-catalog__count').find('input').val(0);
    });

    if ($('.delivery-custom__city').length > 0) {
        if ($("#order-delivery-on-home").length > 0) {
            //var dist = ["55.686954, 37.830700","55.813862, 37.838834","55.882301, 37.725789","55.907776, 37.543516","55.713578, 37.385950"]; //массив со съездами
            //var service = new google.maps.DistanceMatrixService();

            $('.delivery-custom__city').fias({
                type: $.fias.type.city,
                withParents: true,
                select: function (obj) {
                    console.log(obj);
                }
            });
            var inputTimeout = null;

            $('.delivery-custom__city, .delivery-custom__street, .delivery-custom__house').change(function () {
                if (inputTimeout != null) {
                    clearTimeout(inputTimeout);
                }

                var city = $('.delivery-custom__city').val();
                if (city.toLowerCase().indexOf('г.') == -1) {
                    city = 'г.' + city.charAt(0).toUpperCase() + city.substr(1);
                }
                var street = $('#menu-delivery-custom__street').val();
                var house = $('#menu-delivery-custom__house').val();

                console.log('test');

                inputTimeout = setTimeout(function () {
                    /* service.getDistanceMatrix({
                        origins: [city + ' ул.' + street + ' д.' + house],
                        destinations: dist,
                        travelMode: 'DRIVING'
                      }, function callback(response, status) {
                        if (status == "OK"){
                          var sortable = []; //новый массив для расстояний
                          var elements = response.rows[0].elements;
                          console.log(response, elements);
                          //дальше перебор резаультатов маршрута от съездов до точки
                          for (var i = 0; i < elements.length; i++) {
                            if (elements[i].status != 'NOT_FOUND')
                                sortable.push([response.destinationAddresses[i], elements[i].distance.value]);
                          }
                          sortable.sort(function(a, b) {return a[1] - b[1]});
                          console.log(sortable);

                          var text = 0;
                          if (sortable.length > 0) {
                            for (var y = 0; y < 1; y++){
                                text += sortable[y][1]/1000;
                            }
                          }
                          console.log(text);

                        }
                      }); */
                    var
                        city = $('#order-delivery-on-home #menu-delivery-custom__city').val(),
                        street = $('#order-delivery-on-home #menu-delivery-custom__street').val(),
                        house = $('#order-delivery-on-home #menu-delivery-custom__house').val(),
                        korpus = $('#order-delivery-on-home #menu-delivery-custom__korpus').val(),
                        flat = $('#order-delivery-on-home #menu-delivery-custom__flat').val();

                    var cityset = 'г.' + city + ', ул.' + street + ', д.' + house + ', корп.' + korpus;
                    $.ajax({
                        url: '/local/ajax/getNearCafeByAddress.php',
                        type: 'post',
                        data: {
                            address: cityset,
                            price: $('#price_delivery_home_old_menu').data('base-price')
                        },
                        success: function (response) {
                            var distance = response.km;
                            if (city.toLowerCase().indexOf('москва') != -1) {
                                distance = 0;
                            }
                            $('.hidden_distance').val(distance);

                            changePriceText();
                            window.changeCity();
                        }
                    });
                }, 500);
            });
            $('#price_delivery_home_old_menu').on('DOMSubtreeModified', function (event) {
                changePriceText();
            });

            function changePriceText() {
                var distance = $('.hidden_distance').val();
                var city = $('#menu-delivery-custom__city').val();
                console.log(1);
                if ($('#price_delivery_home_old_menu').length > 0) {
                    var price = $('#price_delivery_home_old_menu').data('base-price');
                    console.log(price);
                    if (city.toLowerCase().indexOf('москва') == -1 && distance == 0) {

                    } else if (city.toLowerCase().indexOf('москва') != -1) {
                        var diff = 0;
                    } else if (distance > 50) {
                        var diff = 0;
                    } else if (distance > 20) {
                        var diff = 0;
                    } else if (distance > 0) {
                        var diff = 3500 - price;
                    }

                    if (diff > 0) {
                        $('.text-after-city').html(`До суммы минимального заказа осталось: ${diff} <span class="c-currency-symbol rub">руб</span>. <a href="/menu">Вернуться в меню</a>`)
                    } else {
                        $('.text-after-city').html(`До суммы минимального заказа осталось: минимальная сумма заказа набрана`)
                    }
                }
            }

            $('.autocomplete1').on('DOMSubtreeModified', function (event) {
                $('.autocomplete1').find('li').each(function (_, item) {
                    if ($(item).prop('title') == 'Бесплатная версия kladr-api.ru') {
                        $(item).remove();
                    }
                })
            });
        }
        if ($("#order-delivery-on-home_cafe").length > 0) {
            $('.delivery-custom__city').fias({
                type: $.fias.type.city,
                withParents: true,
                select: function (obj) {
                    $.cookie($(this).prop('id'), $(this).val());
                    $('#menu_cafe-street_id').val(obj.id)
                    $('#menu_cafe-after-city').hide();
                }
            });

            // $('.delivery-custom__street').fias({
            //     type: $.fias.type.street,
            //     parentType: $.fias.type.city,
            //     parentInput : '#menu_cafe-delivery-custom__city',
            //     parentId: $('#menu_cafe-street_id').val(),
            //     select: function (obj) {
            //         $.cookie($(this).prop('id'), $(this).val());
            //     },
            //     sendBefore: function (obj) {
            //         if (obj.parentId.length == 0){
            //             $('#menu_cafe-after-city').show();
            //         }
            //     }
            // });

            var inputTimeout = null;

            $('#order-delivery-on-home_cafe .delivery-custom__city, #order-delivery-on-home_cafe .delivery-custom__street, ' +
                '#order-delivery-on-home_cafe .delivery-custom__house, ' +
                '#order-delivery-on-home_cafe .delivery-custom__korpus, #order-delivery-on-home_cafe .delivery-custom__flat, .menu_cafe_pickup_cafe_old').change(function () {
                if (inputTimeout != null) {
                    clearTimeout(inputTimeout);
                }

                var city = $('.delivery-custom__city').val();
                if (city.toLowerCase().indexOf('г.') == -1) {
                    city = 'г.' + city.charAt(0).toUpperCase() + city.substr(1);
                }
                var street = $('#menu_cafe-delivery-custom__street').val();
                var house = $('#menu_cafe-delivery-custom__house').val();

                inputTimeout = setTimeout(function () {
                    var
                        city = $('#order-delivery-on-home_cafe #menu_cafe-delivery-custom__city').val(),
                        street = $('#order-delivery-on-home_cafe #menu_cafe-delivery-custom__street').val(),
                        house = $('#order-delivery-on-home_cafe #menu_cafe-delivery-custom__house').val(),
                        korpus = $('#order-delivery-on-home_cafe #menu_cafe-delivery-custom__korpus').val(),
                        flat = $('#order-delivery-on-home_cafe #menu_cafe-delivery-custom__flat').val();
                    $('#menu_cafe-delivery__address-custom').val('г.' + city + ', ул.' + street + ', д.' + house + ', корп.' + korpus + ', кв.' + flat);
                    console.log(city);

                    var cityset = 'г.' + city + ', ул.' + street + ', д.' + house + ', корп.' + korpus;
                    $.ajax({
                        url: '/local/ajax/getNearCafeByAddressCafe.php',
                        type: 'post',
                        data: {
                            'cafe': $('.menu_cafe_pickup_cafe:checked').data('cafe_id'),
                            address: cityset,
                            price: $('#price_delivery_home_old_menu_cafe_input').val(),
                            type: 'menu_сafe',

                        },
                        success: function (response) {
                            if (response.error == 1) {
                                $('#order-errors').show();
                                $('#order-errors .error_text').html(response.text);
                            } else {
                                var distance = response.km,
                                    price = $('#price_delivery_home_old_menu_cafe_input').val();
                                $('.hidden_distance').val(distance);

                                $("#menu_cafe_delivery_price .price-delivery").html(response.delivery_price);
                                $('#menu_cafe_delivery_price_input').val(response.delivery_price);

                                $('#price_delivery_home_old_menu_cafe').data('price', price + response.delivery_price);

                                $('#price_delivery_home_old_menu_cafe').html(parseInt(price) + parseInt(response.delivery_price) + '<span class="c-currency-symbol rub">руб</span>');
                                if (parseInt(response.near) > 0) {
                                    $('#menu_cafe-' + response.near).trigger('click');
                                }

                            }
                        }
                    });
                }, 500);
            });

            $('.autocomplete1').on('DOMSubtreeModified', function (event) {
                $('.autocomplete1').find('li').each(function (_, item) {
                    if ($(item).prop('title') == 'Бесплатная версия kladr-api.ru') {
                        $(item).remove();
                    }
                })
            });
            $('.autocomplete2').on('DOMSubtreeModified', function (event) {
                $('.autocomplete2').find('li').each(function (_, item) {
                    if ($(item).prop('title') == 'Бесплатная версия kladr-api.ru') {
                        $(item).remove();
                    }
                })
            });
        }
    }
});