function changePartyTitlePopup() {
    $(document).on('click', '.js-party-order', function () {
        var letter = $(this).data('name'), item = $(this).data('item'),
                title = $('.popup-party-order .popup-title').find('span');

        title.text('');
        title.append(letter);

        $('#title-party-order').val(item);
    });
}
changePartyTitlePopup();

function DisabledFormButton(form, check, btn_form) {
    $("form input[type='checkbox']").on('change', function () {
        if ($(check).prop('checked')) {
            $(btn_form).removeAttr('disabled');
            // console.log('check');
        } else {
            $(btn_form).attr('disabled', 'disabled');
            // console.log('check else');
        }
    });
}

function fix_size(_current) {
    if (typeof _current != 'undefined') {
        var mapImages = _current;
    } else {
        var mapImages = $('.c-card-cafe__img img');
    }
    mapImages.each(setsize);
}
function setsize() {
    var img = $(this),
            img_dom = img.get(0),
            container = img.parents('.c-card-cafe__img');
    if (img_dom.complete) {
        resize();
    } else
        img.one('load', resize);

    function resize() {
        if ((container.width() / container.height()) < (img_dom.width / img_dom.height)) {
            img.width('auto');
            img.height('100%');
            return;
        }
        img.height('auto');
        img.width('100%');
    }
}

function changeRabbitFace(select) {
    $(select).on("change", function () {
        var valReview = $(this).val();
        var $icon = $(this).parents('.reviews-form__type').find('.reviews-form__type-icon');

        if (valReview == 48) {
            $('[name="form_checkbox_SIMPLE_QUESTION_989[]"]').val('60');
            $icon.removeClass('icon-rabbit-positive');
            $icon.addClass('icon-rabbit-negative');
        } else {
            $('[name="form_checkbox_SIMPLE_QUESTION_989[]"]').val('57');
            $icon.removeClass('icon-rabbit-negative');
            $icon.addClass('icon-rabbit-positive');
        }
    });
}

function changeHeightBasketPopup() {
    var documentHeight = (document.documentElement.clientHeight );
    var basketScroll = $('.popup-basket__scroll'),
            heightBasket = basketScroll.height();

    if (heightBasket >= documentHeight - 100) {
        basketScroll.addClass('fixed-height-basket');
        // console.log('if ' + heightBasket);
        /*кастомный скролл*/
        basketScroll.jScrollPane();
    } else {
        basketScroll.removeClass('fixed-height-basket');
        // console.log('else ' + heightBasket);
    }
}

function findCoords(address, parameter) {
    if(address) {
        $.post('/local/ajax/getNearCafeByAddress.php',{address:address}, function (response) {
            parameter.setCenter([response[0], response[1]], 16);
            $('#order-delivery-on-home input[data-coords="'+response[0]+','+response[1]+'"]').click();
        });
    }
}