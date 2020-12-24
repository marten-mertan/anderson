'use strict';

function FiasAddress(opts) {
    var _this = this;
    var self = {
        inputs: {
            cityFias: '',
            streetFias: '',
            cityInputVal: '',
            streetInputVal: '',
            cookieCity: '',
            cookieStreet: '',
            cookieStreetId: '',
            addressInputs: '',
            orderPriceInput: '',
            orderPriceText: '',
            orderAddressInput: '',
            deliveryPriceInput: '',
            baseCityInputVal: '',
            baseStreetInputVal: '',
            baseCityFias: '',
            baseStreetFias: '',
        },
        opts: {
            inputTimeout: ''
        },
    };

    if (typeof opts == 'object')
        $.extend(self, opts);

    _this.init = function () {
        _this.initFias();
        _this.setAllCookie();
        _this.deliveryPriceGet();
        _this.removeFree();
        _this.bindHandlers();
    };

    _this.bindHandlers = function () {
        $('#' + self.orderKey + '-special-date-check').click(function () {
            self.inputs.addressInputs.eq(0).trigger('change');
        });
        $('input.delivery').change(function () {
            self.inputs.addressInputs.eq(0).trigger('change');
        });
    };
    _this.initFias = function () {
        self.inputs.cityFias.fias({
            type: $.fias.type.city,
            withParents: true,
            select: function (obj) {
                _this.setCookie($(this).prop('id'), $(this).val());
                _this.setCookie(self.inputs.cookieCity, obj.id, $(this).val());
                self.inputs.cityInputVal.val(obj.id);
            },
            change: function (obj) {
                if (obj !== null) {
                    self.inputs.streetFias.focus().trigger('keyup').focusout();
                    self.inputs.streetFias.focus().trigger('change').focusout();
                }
            },
            receive: function (obj) {

            }
        });

        self.inputs.streetFias.fias({
            type: $.fias.type.street,
            parentType: $.fias.type.city,
            parentInput: '#' + self.inputs.cityFias.attr('id'),
            parentId: self.inputs.cityInputVal.val(),
            verify: true,
            select: function (obj) {
                self.inputs.streetInputVal.val(obj.id);
                _this.setCookie($(this).prop('id'), $(this).val());
                _this.setCookie(self.inputs.cookieStreetId, obj.id, $(this).val());
            },
            check: function (obj) {
                if (obj == null) {
                    self.inputs.streetInputVal.val('');
                } else {
                    var streetId = $.cookie(self.inputs.cookieStreetId);
                    var streetName = $.cookie($(this).prop('id'));
                    if (typeof streetId !== 'undefined' && streetId.length > 0 && self.inputs.streetFias.val().length > 0) {
                        setTimeout(function () {
                            console.log(1);
                            self.inputs.streetFias.val(streetName);
                            self.inputs.streetFias.fias('controller').setValueById(streetId);
                            self.inputs.streetInputVal.val(streetId);
                        }, 1000)
                    }
                }
            },
            sendBefore: function (obj) {
                self.inputs.streetInputVal.val(obj.id);
                if (typeof obj.parentId === 'undefined' || obj.parentId.length == 0) {
                    $('#menu-after-city').show();
                }
            },
        });

    };

    _this.deliveryPriceGet = function () {
        self.inputs.addressInputs.change(function (e) {
            if (self.opts.inputTimeout != null) {
                clearTimeout(self.opts.inputTimeout);
            }
            if (self.inputs.deliveryIdInput) {
                console.log('+++');
                var delivery;
                self.inputs.deliveryIdInput.each(function (e, input) {
                    if ($(input).prop('checked')) {
                        delivery = $(input).val();
                    }
                });
                if (delivery != 7) return;
            }
            self.opts.inputTimeout = setTimeout(function () {
                self.inputs.addressInputs.each(function (e, input) {
                    if ($(input).attr('id').indexOf('__city') > 0) {
                        self.city = $(input).val();
                    }
                    if ($(input).attr('id').indexOf('__street') > 0)
                        self.street = $(input).val();
                    if ($(input).attr('id').indexOf('__house') > 0)
                        self.house = $(input).val();
                    if ($(input).attr('id').indexOf('__korpus') > 0)
                        self.korpus = $(input).val();
                    if ($(input).attr('id').indexOf('__flat') > 0)
                        self.flat = $(input).val();

                    _this.setCookie($(input).attr('id'), $(input).val());
                });



                var cityset = 'г.' + self.city + ', ул.' + self.street + ', д.' + self.house + ', корп.' + self.korpus;
                var cookieCity = 'г.' + self.city + ', ул.' + self.street + ', д.' + self.house + ', корп.' + self.korpus + ', кв.' + self.flat;

                if (typeof self.inputs.orderAddressInput !== 'undefined' && self.inputs.orderAddressInput.length > 0) {
                    self.inputs.orderAddressInput.val(cookieCity);
                }
                $.ajax({
                    url: '/local/ajax/' + self.url,
                    type: 'post',
                    data: {
                        address: cityset,
                        price: self.inputs.orderPriceInput.val(),
                        type: self.orderKey,
                        product: $('#productId').val()
                    },
                    success: function (response) {
                        if (self.type == 'cake')
                            _this.cakeSuccessNew(cityset, response);
                        if (self.type == 'cake_od' || self.type == 'cake_all')
                            _this.menuSuccess(response);
                    }
                });
            }, 500)

        });
    };

    _this.setCookie = function (name, val) {
        $.cookie(name, val, {'path': '/', expires: 1});
    };

    _this.setAllCookie = function () {
        self.inputs.addressInputs.each(function (e, input) {
            $(input).val($.cookie($(input).attr('id')));
        });

        if (self.inputs.cityFias.val() != '') {
            setTimeout(function () {
                var cityId = $.cookie(self.inputs.cookieCity);
                if (typeof cityId !== 'undefined' && cityId.length > 0 && self.inputs.cityFias.length > 0) {
                    self.inputs.cityFias.fias('controller').setValueById(cityId);
                    self.inputs.cityInputVal.val(cityId);
                }

                self.inputs.cityFias.focus().trigger('keyup').focusout();
                self.inputs.cityFias.focus().trigger('change').focusout();

            }, 100);
        }

    };

    _this.removeFree = function () {
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
        $('.autocomplete3').on('DOMSubtreeModified', function (event) {
            $('.autocomplete3').find('li').each(function (_, item) {
                if ($(item).prop('title') == 'Бесплатная версия kladr-api.ru') {
                    $(item).remove();
                }
            })
        });
        $('.autocomplete4').on('DOMSubtreeModified', function (event) {
            $('.autocomplete4').find('li').each(function (_, item) {
                if ($(item).prop('title') == 'Бесплатная версия kladr-api.ru') {
                    $(item).remove();
                }
            })
        });
    };

    _this.cakeSuccess = function (cityset, response) {
        var distance = response.km;
        if (cityset.toLowerCase().indexOf('москва') != -1) {
            distance = 0;
        }
        $('.hidden_distance').val(distance);
        var timeTax,
            baseDeliveryPrice,
            deliveryPrice = 0;
        if (distance <= 20 && $('#special-date-check').is(':checked') && $('input[type=radio][name=delivery_id]').val() != 5) {
            timeTax = 300;
        } else if (distance > 20 && distance <= 50 && $('#special-date-check').is(':checked')) {
            timeTax = 700;
        } else {
            timeTax = 0;
        }
        deliveryPrice = deliveryPrice + timeTax;
        if (distance == 0 && cityset.toLowerCase().indexOf('москва') != -1) {
            if ($('#order_sum_hidden').val() > 2000) {
                $('.delivery_price').val(deliveryPrice);
                $('#delivery_price').html('<span class="price">' + deliveryPrice + ' <span class="c-currency-symbol rub">руб</span></span>');
            } else {
                deliveryPrice = deliveryPrice + 300;
                $('.delivery_price').val(deliveryPrice);
                $('#delivery_price').html('<span class="price">' + deliveryPrice + ' <span class="c-currency-symbol rub">руб</span></span>');
            }
        } else if (distance >= 50) {
            $('.delivery_price').val(0);
            $('#delivery_price').html('0 <span class="c-currency-symbol rub">руб</span>');
        } else if (distance >= 20) {
            deliveryPrice = deliveryPrice + 1500;
            $('.delivery_price').val(deliveryPrice);
            $('#delivery_price').html(deliveryPrice + ' <span class="c-currency-symbol rub">руб</span>');
        } else if (distance >= 0) {
            deliveryPrice = deliveryPrice + 500;
            $('.delivery_price').val(deliveryPrice);
            $('#delivery_price').html(deliveryPrice + ' <span class="c-currency-symbol rub">руб</span>');
        }
    };

    _this.cakeSuccessNew = function (cityset, response) {
        $('.delivery_price').val(response.delivery_price);
        $('#delivery_price').html(response.delivery_price_format);
    };

    _this.menuSuccess = function (response) {
        var distance = response.km;
        if (self.city.toLowerCase().indexOf('москва') != -1)
            distance = 0;
        $('.hidden_distance').val(distance);
        _this.changePriceText();
        _this.changeCity(response);
    };

    _this.changePriceText = function () {
        var distance = $('.hidden_distance').val();
        var city = self.inputs.cityFias.val();

        if (self.inputs.orderPriceInput.length > 0) {
            var price = self.inputs.orderPriceText.data('base-price');
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

    _this.changeCity = function (response) {

        // if (!isAdmin)
        //     response.delivery_price = 470;

        let basePrice = parseInt(self.inputs.orderPriceText.data('base-price'));
        var certainHour = 0;
        var finalPrice = 0, deliveryPrice = response.delivery_price;
        var key = '';
        if (self.type == 'cake_all')
            key = 'cakes';
        if (self.type == 'cake_od')
            key = 'oneday_cakes';


        var certainHour = 0;
        if ($('#' + self.orderKey + '-special-date-check').is(':checked')) {
            certainHour = response.certainHour;
        }

        finalPrice = deliveryPrice + basePrice + certainHour;
        $('.order-item.' + key + ' span.price-delivery').html(deliveryPrice);

        if (certainHour > 0 && deliveryPrice <= 0) {
            $('.order-item.' + key + ' span.price-delivery').html(0);
            $('.order-item.' + key + ' .c-card-product-line__price span.price-delivery').html(certainHour);
        } else if (certainHour > 0 && deliveryPrice > 0) {
            $('.order-item.' + key + ' .c-card-product-line__price span.price-delivery').html(certainHour + deliveryPrice);
        }

        $('.order-item.' + key + ' div.hidden-certain-price .price-delivery-certain').html(certainHour);
        self.inputs.orderPriceText.data('price', finalPrice);
        self.inputs.orderPriceText.html(finalPrice + '<span class="c-currency-symbol rub">руб</span>');
        self.inputs.deliveryPriceInput.val(deliveryPrice);
        $('.order-item.' + key + ' span.price-delivery').parents('.basket-item__list-item').hide();
        self.inputs.deliveryPriceInput.prop('disabled', true);
        $('.order-item.' + key + ' div.hidden-certain-price').hide();
        if (deliveryPrice > 0) {
            self.inputs.deliveryPriceInput.prop('disabled', false);
            $('.order-item.' + key + ' span.price-delivery').parents('.basket-item__list-item').show();
        }
        if (certainHour > 0) {
            $('.order-item.' + key + ' span.price-delivery').parents('.basket-item__list-item').show();
            $('.order-item.' + key + ' div.hidden-certain-price').show();
        }

        if (certainHour > 0 && deliveryPrice > 0) {
            self.inputs.deliveryPriceInput.val(deliveryPrice + certainHour);
        } else if (certainHour > 0 && deliveryPrice <= 0) {
            self.inputs.deliveryPriceInput.val(certainHour);
        }
        return false;
    }

    _this.baseFias = function() {
        self.inputs.baseCityFias.fias({
            type: $.fias.type.city,
            withParents: true,
            select: function (obj) {
                self.inputs.baseCityInputVal.val(obj.id);
            },
            change: function (obj) {
                if (obj !== null) {
                    self.inputs.baseStreetFias.focus().trigger('keyup').focusout();
                    self.inputs.baseStreetFias.focus().trigger('change').focusout();
                }
            },
            receive: function (obj) {

            }
        });
        console.log(self.inputs.baseCityFias.attr('id'));
        console.log($('#' + self.inputs.baseCityFias.attr('id')));
        self.inputs.baseStreetFias.fias({
            type: $.fias.type.street,
            parentType: $.fias.type.city,
            parentInput: '#' + self.inputs.baseCityFias.attr('id'),
            parentId: self.inputs.baseCityInputVal.val(),
            verify: true,
            select: function (obj) {
                self.inputs.baseStreetInputVal.val(obj.id);
            },
            check: function (obj) {
            },
        });


        $('#kladr_autocomplete ul.autocomplete').on('DOMSubtreeModified', function (event) {
            $('#kladr_autocomplete ul.autocomplete').find('li').each(function (_, item) {
                if ($(item).prop('title') == 'Бесплатная версия kladr-api.ru') {
                    $(item).remove();
                }
            })
        });
    }
}