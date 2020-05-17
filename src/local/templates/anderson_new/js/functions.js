/* global BX, reloadContent, site, windowWidth, documentWidth, curUri, Intl */

var siteEvents = {};
//var citys = ['cafe', 'holiday', 'cakes', 'menu', 'catering', 'schedule', 'news', 'business', 'franchise', 'menu_new'];
var citys = ['news', 'stock', 'schedule', 'menu', 'cafe'];
function setCity(_this, data) {
    $.ajax({
        url: '/local/ajax/set_city.php',
        method: 'POST',
        data: data,
        success: function (res) {
            $('.popup-bubble.top').remove();
            _this.parents('.popup-city').find('.popup-close').trigger('click');
            if (!res.error) {

                if (res.url.length > 0) {
                    window.location.href = res.url;
                    return false;
                }
                $('#popup__request-call input[name="form_text_33"]').val(res.name);
                $('.header-city a').text(res.name);
                $('.popup-city__title-place').text(res.name + '?');
                $('.header-tel').attr('href', 'tel:' + res.phoneCall);
                if (res.phone != null)
                    $('.header-tel').find('span').text(res.phone);
                $('.header-mobile__tel').text(res.phone);
                $('.header-mobile__tel').attr('href', 'tel:' + res.phoneCall);
                var curPage = curUri.split('/')[1];
                if (!citys.includes(curPage) && curPage.length > 0)
                    data.code = '';

                if (data.url.length > 0) {
                    window.location.assign(data.url);
                    return false;
                }
                if (data.code == '')
                    window.location.reload();
                else
                    window.location.assign('/' + data.code + curUri);
            }
        }
    });
}

function setCityText(name, code, id) {
    $('.popup-city .popup-city__title-place').text(name);
    $('.popup-city .c-button_yes').data('code', code);
    $('.popup-city .c-button_yes').data('id', id);

}
function showPopup(icon, popup) {
    $(icon).on('click', function (e) {
        e.preventDefault();
        $(popup).addClass('is-visible');
        $('.mfp-bg').addClass('is-visible');


        $('html').addClass('lock-html');
        // $('.c-layout').addClass('popup-fix');
        if (windowWidth > documentWidth) {
            $('html').css({
                'margin-right': '17px'
            });
            $('.mfp-wrap').css({
                'overflow-y': 'scroll'
            });
            console.log('Есть полоса прокрутки');
        } else {
            console.log('Нет полосы прокрутки');
        }
        // $('html').addClass('body-popup');
    });
}

function getFormData(formId) {
    var form = BX(formId),
            prepared = BX.ajax.prepareForm(form),
            i;

    for (i in prepared.data) {
        if (prepared.data.hasOwnProperty(i) && i == '')
            delete prepared.data[i];
        if ($('input[name="' + i + '"]').prop('disabled'))
            delete prepared.data[i];
    }

    return !!prepared && prepared.data ? prepared.data : {};
}

function authorize(formId) {
    var formData = getFormData(formId), rem = formData['USER_REMEMBER'] === 'Y' ? 1 : 0, data = {
        login: formData['USER_LOGIN'],
        pass: formData['USER_PASSWORD'],
        rem: rem
    };
    $.ajax({
        url: '/local/ajax/auth.php',
        method: 'POST',
        data: data,
        success: function (res) {
            if (res.error) {
                $('#' + formId).find('.errortext').show();
                $('#' + formId).find('.errortext span.error_text').text(res.text);
            } else
                window.location.reload();
        }
    });
}

function graduationBuy(formId) {
    var formData = getFormData(formId), data = formData;
    $.ajax({
        url: '/local/ajax/buy/graduation.php',
        method: 'POST',
        data: data,
        success: function (res) {
            $('#' + formId).find('input, textarea').removeClass('error');
            $('#order-errors').hide();
            if (!res.error) {
                $('#payment_link-content a').remove();
                $('#payment_link-content').html('<a href="' + res.url + '" class="c-button c-button__medium" id="payment_link" target="_blank">Перейти к оплате</a>');
                $('#orderId').html(res.orderId);
                $('.popup-party-order').removeClass('is-visible');
                $('.popup-graduation-order-congratulation').addClass('is-visible');
                $('#' + formId + ' input').val('');
                $('#' + formId + ' textarea').val('');
                //dataLayer.push({'event': 'buyTicket'});
            } else {
                $('#order-errors').show();
                for (var i in res.codes)
                    $('[name="' + res.codes[i] + '"]').addClass('error');
                $('#order-errors .error_text').html(res.text);
            }
        }
    });
}

function excursionBuy(formId) {

    var formData = getFormData(formId), data = formData;
    if (!data['quantity'])
        data['quantity'] = $('.excursion__count input').val();

    showLoader();
    $.ajax({
        url: '/local/ajax/buy/excursion.php',
        method: 'POST',
        data: data,
        success: function (res) {
            endLoader();
            $('#' + formId).find('input, textarea').removeClass('error');
            $('#order-errors').hide();
            if (!res.error) {
                $('#payment_link-content a').remove();
                $('#payment_link-content').html('<a href="' + res.url + '" class="c-button c-button__medium" id="payment_link" target="_blank">Перейти к оплате</a>');
                $('#orderId').html(res.orderId);
                $('.popup-excursion-order').removeClass('is-visible');
                $('.popup-excursion-order-congratulation').addClass('is-visible');
                $('#excursion-form input').val('');
                $('#excursion-form textarea').val('');
                dataLayer.push({'event': 'buyTicket'});
            } else {
                $('#order-errors').show();
                for (var i in res.codes)
                    $('[name="' + res.codes[i] + '"]').addClass('error');
                $('#order-errors .error_text').html(res.text);
            }
        }
    });
}

function incQuantity(_this, needPrice, priceClass, needNull = false) {
    var val = _this.parent().find('input').val();
    if (_this.hasClass('inc'))
        ++val;
    else if (_this.hasClass('dec'))
        --val;
    if (val <= 0 && !needNull)
        val = 1;

    if (needNull && val < 0)
        val = 0;

    if (needPrice) {
        var price = parseInt($(priceClass).data('price')) * val;
        $(priceClass).html(new Intl.NumberFormat().format(price) + ' <span class="c-currency-symbol rub">руб</span>');
    }
    //$(quantityClass).val(val);
    _this.parent().find('input').val(val);

    return val;
}

function removeSubs(action, id) {
    $.ajax({
        url: '/local/ajax/subscribe.php',
        method: 'POST',
        data: {
            action: action,
            id: id
        },
        success: function () {
            setTimeout(function () {
                window.location.reload();
            }, 2000);
        }
    });
}

function initProfilePlugin() {
    //маска
    $('.js-input--tel').mask('+0(000)000-00-00', {clearIfNotMatch: true});
    $('.js-input--date').mask('00.00.0000', {clearIfNotMatch: true});

    /*селект*/
    $('.js-select--child').SumoSelect();
    //changeSelectFace('.lk-profile-edit__child-list .js-select--child', 'M', 'icon-boy-smiling', 'icon-girl-smiling');
}

function changeSelectFace(select, value, icon_1, icon_2) {
    $(select).on("change", function () {
        var valReview = $(this).val();
        var $icon = $(this).parents('.c-select-layout').find('.c-select__icon');
        console.log(value);

        if (valReview == value) {
            $icon.removeClass(icon_2);
            $icon.addClass(icon_1);
            console.log('boy');
        } else {
            $icon.removeClass(icon_1);
            $icon.addClass(icon_2);
            console.log('girl');
        }
    });
}

function renderEventDate(dates) {
    var eventDates = [];
    for (var i in dates) {
        eventDates.push(dates[i].UF_NAME);
    }
    $('#event-datepicker-new').datepicker({
        inline: true,
        onRenderCell: function (date, cellType) {
            var currentDateVisual = date.getDate();
            var month = (date.getMonth() + 1);
            var day = date.getDate();
            if (parseInt(day) <= 9)
                day = '0' + day;
            if (parseInt(month) <= 9)
                month = '0' + month;
            var currentDate = day + '.' + month + '.' + date.getFullYear();
            if (cellType === 'day' && eventDates.includes(currentDate)) {
                return {
                    html: currentDateVisual + '<span class="dp-note"></span>'
                };
            } else {
                return {
                    disabled: true
                };
            }
        },
        onSelect: function (date) {
            showLoader();
            $.ajax({
                url: '?date=' + date + '&ajax=Y&ajax_date=Y',
                success: function (res) {
                    $('#events-by-date').html(res);
                    endLoader();
                }
            });
        }
    });
}

function getEventDetail(link, type, id) {
    $('#event-' + type).html(reloadContent);
    var href = link;
    var data = {ajax: 'Y'};
    data[type] = 'Y';
    BX.ajax({
        url: href + '?id=' + id,
        method: 'POST',
        dataType: 'html',
        data: data,
        onsuccess: function (res) {
            stopLoadItem = true;
            window.history.pushState(null, null, href);
            BX('event-' + type).innerHTML = res;
        }
    });
    if (type === 'card') {
        $(document).on('click', '.popup-event .popup-close', function () {
            $('.popup-event').removeClass('is-visible');
            window.history.pushState(null, null, '/schedule/');
            $('#event-' + type).html('');
        });
    }
}

function loadMenu(_this) {
    $('#menu_popup').html('<div style="text-align: center"><img src="/local/templates/anderson_new/images/preload.svg"></div>');
    $.ajax({
        url: '/local/ajax/menu.php',
        data: {
            cafe: _this.data('cafe')
        },
        success: function (res) {
            $('#menu_popup').html(res);
        }
    });
}

function mapJS(_this) {
    fix_size($(_this._element).find('.c-card-cafe__img img'));
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
}

function loadEventsCard() {
    $(document).on('click', '.popup-event-map__item .c-card-event__link--more', function () {
        $('#event-card').html(reloadContent);
        var href = $(this).attr('href');
        var folder = '/schedule_new/';
        BX.ajax({
            url: href,
            method: 'POST',
            dataType: 'html',
            data: {
                ajax: 'Y',
                clear_cache: 'Y'
            },
            onsuccess: function (res) {
                stopLoadItem = true;
                window.history.pushState(null, null, href);
                BX('event-card').innerHTML = res;
            }
        });
        $(document).on('click', '.popup-event .popup-close', function () {
            $('.popup-event').removeClass('is-visible');
            window.history.pushState(null, null, folder);
            $('#event-card').html('');
        });
    });
}

function loadGraduationDate() {
    var disabledPartyDays = [0, 6];
    var date = Date.parse($('#party-datepicker').val());
    $('#party-datepicker').datepicker({
        minDate: new Date(),
        defaultDate: new Date(date),
        inline: true,
        onRenderCell: function (date, cellType) {
            if (cellType == 'day') {
                var day = date.getDay(),
                        isDisabled = disabledPartyDays.indexOf(day) != -1;
                return {
                    disabled: isDisabled
                }
            }
        }
    });
}
/* in main.js*/

function sendEvent(yaId) {
    yaCounter24015385.reachGoal(yaId);
}

function flyToElement(flyer, flyingTo) {
    var $func = $(this),
            divider = 9,
            flyerClone = $(flyer).clone();

    // console.log($func);
    $(flyerClone).css({
        position: 'absolute',
        'max-width': '500px',
        top: $(flyer).offset().top + 'px',
        left: $(flyer).offset().left + 'px',
        opacity: 1,
        'z-index': 1020
    });
    $('body').append($(flyerClone));
    var gotoX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - ($(flyer).width() / divider) / 2;
    var gotoY = $(flyingTo).offset().top + ($(flyingTo).height() / 2) - ($(flyer).height() / divider) / 2;

    $(flyerClone).animate({
        opacity: 0.4,
        left: gotoX,
        top: gotoY,
        width: $(flyer).width() / divider,
        height: $(flyer).height() / divider
    }, 700,
            function () {
                $(flyingTo).fadeOut('fast', function () {
                    $(flyingTo).fadeIn('fast', function () {
                        $(flyerClone).fadeOut('fast', function () {
                            $(flyerClone).remove();
                        })
                    })
                })
            })
}


/* halls.filter */
/**
 * Фильтруем список залов
 * @param formId Id формы
 * @returns null
 * 
 */
function filterHalls(formId) {
    var formData = getFormData(formId);
    formData['action'] = 'filter';
    formData['is_ajax_post'] = 'Y';
    showLoader();
    $.ajax({
        method: 'POST',
        data: formData,
        success: function (e) {
            endLoader();
            var cont = $(e).html();
            $('#filter_content').html(cont);
            reInitPlugins();
        }
    });
}
/* loader */
function showLoader() {
    if (!window.loadingScreen)
    {
        window.loadingScreen = new BX.PopupWindow("loading_screen", null, {
            overlay: {backgroundColor: 'white', opacity: '80'},
            events: {
                onAfterPopupShow: BX.delegate(function () {
                    BX.cleanNode(window.loadingScreen.popupContainer);
                    BX.removeClass(window.loadingScreen.popupContainer, 'popup-window');
                    this.loadingScreen.popupContainer.appendChild(
                            BX.create('IMG', {props: {src: site + "/images/loader.gif"}})
                            );
                    window.loadingScreen.popupContainer.removeAttribute('style');
                    window.loadingScreen.popupContainer.style.display = 'block';
                }, this)
            }
        });
        BX.addClass(window.loadingScreen.popupContainer, 'bx-step-opacity');
    }
    window.loadingScreen.show();
}

function endLoader()
{
    if (window.loadingScreen && window.loadingScreen.isShown())
        window.loadingScreen.close();
}

function insertAfter(elem, refElem) {
    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}

var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function setAnalytics(data, action) {
    switch (action)
    {
        case 'add':
            var info = {
                "ecommerce": {
                    "add": {
                        "products": [data]
                    }
                }
            }
            break
        case 'remove':
            var info = {
                "ecommerce": {
                    "remove": {
                        "products": [data]
                    }
                }
            }
            break;
        case 'order':
            var info = {
                "ecommerce": {
                    'currencyCode': data.currency,
                    "purchase": {
                        "actionField": data.actionField,
                        'products': data.products
                    }
                },
                "event": "Purchase"
            };
            break;
    }

    dataLayer.push(info);
}



function reInitPlugins() {
    $('.c-select').SumoSelect();
}

function initHallsАfterAjax() {

    showPopup(".calendar-box__wraplink", '.popup-calendar-booking');
    if ($('ul').hasClass('calendar-selector__list')) {
        /* Calendar Selector */
        new SimpleBar($('.calendar-selector__list')[0], {
            autoHide: false,
            scrollbarMinSize: 35,
        });
    }
    $('.calendar-title__wrapper').on('click', function (event) {
        event.preventDefault();
        $('#hsl-addr-selector').toggleClass('calendar-selector_hidden');
        $('.calendar-title__wrapper .calendar-title__control svg').toggleClass('calendar-title__control_flip');
    });

    $('#hsl-year-selector-init').on('click', function (event) {
        event.preventDefault();
        $('#hsl-year-selector').toggleClass('calendar-selector_hidden');
    });
    $('.calendar-selector__input').on('change paste keyup', function (event) {
        var filter_value = $('.calendar-selector__input').val();
        var $elem_target = $(this).closest('.calendar-selector').find('.calendar-selector__list');

        if (filter_value) {
            $elem_target.find('li').each(function (index, element) {
                if ($(element).find('a').html().toLowerCase().indexOf(filter_value.toLowerCase()) !== -1) {
                    $(element).show();
                } else {
                    $(element).hide();
                }
            });
        } else {
            $elem_target.find('li').each(function (index, element) {
                $(element).show();
            });
        }
    });

    var calendar_options = {
        selector_owlCarousel: '.calendar-nav-hall__row',
        selector_line: '.newcalendar .calendar-line',
        class_hidden: 'calendar-adapt_hidden',
    };

    //      init
    calendar_HallUpdateGrid(
            calendar_options.selector_line,
            0,
            calendar_options.class_hidden
            );

    calendar_HallUpdateBind(calendar_options);
}

function iniDatePicker(dom, params) {
    $(dom).datepicker(params);
}

function addSiteEvent(eventObject, eventName, eventHandler) {
    if (BX.type.isString(eventObject))
    {
        eventHandler = eventName;
        eventName = eventObject;
        eventObject = window;
    }

    eventName = eventName.toUpperCase();

    if (!siteEvents[eventName])
        siteEvents[eventName] = [];

    siteEvents[eventName].push(
            {
                handler: eventHandler,
                obj: eventObject
            }
    );

    console.log(siteEvents);
}

function onSiteEvent(eventObject, eventName, arEventParams, secureParams)
{
    /* shift parameters for short version */
    if (BX.type.isString(eventObject))
    {
        secureParams = arEventParams;
        arEventParams = eventName;
        eventName = eventObject;
        eventObject = window;
    }

    eventName = eventName.toUpperCase();

    if (!siteEvents[eventName])
        return;

    if (!arEventParams)
        arEventParams = [];

    var h;
    for (var i = 0, l = siteEvents[eventName].length; i < l; i++)
    {
        h = siteEvents[eventName][i];
        if (!h || !h.handler)
            continue;

        if (h.obj == window || /*eventObject == window || */h.obj == eventObject) //- only global event handlers will be called
        {
            h.handler.apply(eventObject, !!secureParams ? BX.clone(arEventParams) : arEventParams);
        }
    }
}
function removeSiteEvent(eventObject, eventName, eventHandler)
{
    /* shift parameters for short version */
    if (BX.type.isString(eventObject))
    {
        eventHandler = eventName;
        eventName = eventObject;
        eventObject = window;
    }

    eventName = eventName.toUpperCase();

    if (!siteEvents[eventName])
        return;

    for (var i = 0, l = siteEvents[eventName].length; i < l; i++)
    {
        if (!siteEvents[eventName][i])
            continue;
        if (siteEvents[eventName][i].handler == eventHandler && siteEvents[eventName][i].obj == eventObject)
        {
            delete siteEvents[eventName][i];
            return;
        }
    }
}


function disableNY(date) {
    var currentDate = date.getDate() + "." + parseInt(date.getMonth() + 1) + "." + date.getFullYear();
    var isDisabled = currentDate == '31.12.2018';
    if (currentDate == '1.1.2019')
        isDisabled = true;
    if (currentDate == '2.1.2019')
        isDisabled = true;
    if (currentDate == '15.4.2019')
        isDisabled = true;
    if (currentDate == '16.4.2019')
        isDisabled = true;
    return isDisabled;
}


function showAuthForm(content) {
    $('.' + content).toggleClass('is-visible');
    $('.js-header-cabinet').trigger('click');
    return false;
}


function onPopupClose(object) {

    var save = object.data('save');
    if (save) {
        $.cookie(save['name'], save['value'], {path: '/', expires: save['time']});
    }
}


function initAndersonBirthDay() {

    var couponAction = 'enterCoupon', coupon = false;
    andersonBirthdayTotal();
    $('.february .birthday-banner__btn, .february .buy-ticket').click(function () {
        var target = $('.february .form-block');
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


    $('.february .c-counter-big__btn').click(function () {
        var priceClass = '';

        if ($(this).hasClass('grown'))
            priceClass = '.price-total.grown';
        else if ($(this).hasClass('children'))
            priceClass = '.price-total.children';
        else
            priceClass = '.price-total.full';


        incQuantity($(this), true, priceClass, false);
        andersonBirthdayTotal();
    });

    $('.february input[type=checkbox]').click(function (e) {
        andersonBirthdayTotal();
    });

    function andersonBirthdayTotal() {
        var price = 0, checkBoxes = $('.c-checkbox-custom input'), tmpPrice = 0;
        if (true) {

            for (var i in checkBoxes) {
                if (checkBoxes.hasOwnProperty(i)) {
                    var check = $(checkBoxes[i]);
                    if (check.prop('checked')) {
                        var q = check.parents('.group').find('.fieldCount').val();
                        tmpPrice += parseInt(check.data('price')) * parseInt(q);
                    }
                }
            }
            price = tmpPrice;
            if (price > 0) {
                $('.february .total-block').show();
                $('#total').html(new Intl.NumberFormat().format(price) + ' руб');
            } else {
                $('#total').html(new Intl.NumberFormat().format(price) + ' руб');
            }

            if (coupon) {
                couponAction = 'enterCoupon';
                $('#recalc_order').click();
            }
        }
    }
    $('.buy-birthday-ticket').click(function (e) {
        e.preventDefault();
        var form = $(this).parents('form').attr('id'), data = getFormData(form), ajaxData = {}, _this = $(this);

        ajaxData = data;
        ajaxData['items'] = {};
        if (parseInt(data['children']) > 0)
            ajaxData['items'][data['children']] = data[parseInt(data['children'])]; //data[parseInt(data['children'])];
        if (parseInt(data['grown']) > 0)
            ajaxData['items'][data['grown']] = data[parseInt(data['grown'])]; // data[parseInt(data['grown'])];
        if (parseInt(data['full']) > 0)
            ajaxData['items'][data['full']] = data[parseInt(data['full'])]; // data[parseInt(data['full'])];


        if($('input[name=halloween]').val()!="Y") {
            if (!$('#regulations').prop('checked')) {
                $('#regulations').trigger('click');
                return false;
            }
        }
        showLoader();
        $.ajax({
            url: '/local/ajax/buy/some_events.php',
            method: 'POST',
            data: ajaxData,
            success: function (res) {
                endLoader();
                $('input').removeClass('error');
                if (res.error) {
                    for (var i = 0; i < res.codes.length; i++)
                        $('input[name="' + res.codes[i] + '"]').addClass('error');

                    //alert(res.text);
                } else {
                    _this.parents('form')[0].reset();
                    $('#total').html(new Intl.NumberFormat().format(0) + ' руб');
                    $('#best-father-order').html(res.orderId);
                    $('#best-father-link').attr('href', res.url);

                    var $html = $('html');
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
                    ga('send', 'event', 'Halloween');
                    yaCounter24015385.reachGoal('Halloween');
                    couponAction = 'enterCoupon';
                    coupon = false;
                    sendCrmAnalitics(res.orderId, res.price);
                    $('#recalc_order').text('Применить купон');
                }
            }
        });
    });


    $('#recalc_order').click(function (e) {
        e.preventDefault();

        var form = $(this).parents('form').attr('id'), data = getFormData(form), ajaxData = {}, _this = $(this);

        ajaxData = data;
        ajaxData['items'] = {};
        if (parseInt(data['children']) > 0)
            ajaxData['items'][data['children']] = data[parseInt(data['children'])]; //data[parseInt(data['children'])];
        if (parseInt(data['grown']) > 0)
            ajaxData['items'][data['grown']] = data[parseInt(data['grown'])]; // data[parseInt(data['grown'])];
        if (parseInt(data['full']) > 0)
            ajaxData['items'][data['full']] = data[parseInt(data['full'])]; // data[parseInt(data['full'])];

        ajaxData['action'] = couponAction;
        showLoader();
        $.ajax({
            url: '/local/ajax/buy/coupon.php',
            data: ajaxData,
            method: 'POST',
            success: function (e) {
                endLoader();
                if (e.error) {
                    $('input[name="coupon"]').addClass('error');
                    $('input[name="coupon"]').prop('disabled', false);
                } else {
                    $("#total").html(e.price);
                    $('input[name="coupon"]').removeClass('error');
                    if (couponAction == 'deleteCoupon') {
                        coupon = false;
                        $('[name="coupon"]').removeClass('success');
                        couponAction = 'enterCoupon';
                        $(_this).text('Применить купон');
                    } else {
                        coupon = true;
                        couponAction = 'deleteCoupon';
                        $('[name="coupon"]').addClass('success');
                        $(_this).text('Удалить купон');
                    }
                }
            }
        });
    })
}


function sendCrmAnalitics(orderId, price) {
    (window.b24order = window.b24order || []).push({id: orderId, sum: price});
}