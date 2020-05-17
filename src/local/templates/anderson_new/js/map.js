/* global ymaps, site, BX, reloadContent */
if (typeof ymaps == 'undefined') {
    var ymaps = {
        ready: function (params) {
            console.log('ymap no working');
        }
    }
}

function loftMap(site, coords) {
    ymaps.ready(init);
    var coord = coords.split(',');

    function init() {
        var loftMap = new ymaps.Map('loft-map', {
                center: [coord[0], coord[1]],
                zoom: 15,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
            }, {
                searchControlProvider: 'yandex#search'
            }),
            loftPlacemark = new ymaps.Placemark([coord[0], coord[1]], {
                hintContent: 'Лофт'
            }, {
                iconLayout: 'default#image',
                iconImageHref: site + '/img/icon-map-point.png',
                iconImageSize: [44, 53],
                iconImageOffset: [-5, -38]
            });

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

        if (isMobile.any()) {
            loftMap.behaviors.disable('drag');
        }

        loftMap.geoObjects
            .add(loftPlacemark);
    }
}

function eventsMap(items) {
    ymaps.ready(init);

    function init() {
        var eventMap = new ymaps.Map('eventMap', {
                center: [55.751574, 37.573856],
                zoom: 4,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                controls: ['zoomControl', 'fullscreenControl']
            }, {
                searchControlProvider: 'yandex#search'
            }),
            eventClusterIcons = [
                {
                    href: site + '/img/m1.png',
                    size: [40, 40],
                    // Отступ, чтобы центр картинки совпадал с центром кластера.
                    offset: [-20, -20]
                },
                {
                    href: site + '/img/m1.png',
                    size: [40, 40],
                    offset: [-20, -20]
                }],
            eventIconContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div style="color: #FFFFFF; font-weight: bold;">$[properties.geoObjects.length]</div>'),
            eventClusterer = new ymaps.Clusterer({
                clusterIcons: eventClusterIcons,
                clusterIconContentLayout: eventIconContentLayout,
                /*Ставим true, если хотим кластеризовать только точки с одинаковыми координатами.*/
                groupByCoordinates: false,
                /*Опции кластеров указываем в кластеризаторе с префиксом "cluster".*/
                clusterDisableClickZoom: true,
                clusterHideIconOnBalloonOpen: false,
                geoObjectHideIconOnBalloonOpen: false
            });
        /*шаблон попапа*/
        var eventBlacemarks = [];
        for (var i in items) {
            var html = '<div class="popup-event-map">' +
                '<div class="popup-event-map__header"></div>' +
                '<div class="popup-event-map__body" data-simplebar>';
            var cafe = items[i];
            for (var j in cafe.items) {
                var item = cafe.items[j];
                html += '<div class="popup-event-map__item">' +
                    '<div class="c-card-event">' +
                    '<div class="c-card-event__label">' +
                    '<div class="c-card-event__age"><i class="icon-uneven-circle">' + item.minage + '+</i></div>' +
                    '</div>' +
                    '<div class="c-card-event__price">' + item.price + '</div>' +
                    '<div class="c-card-event__header">' +
                    '<div class="c-card-event__date">' + item.time + '</div>' +
                    '<div class="c-card-event__title"><a href="' + item.detail + '" class="c-card-event__link--more">' + item.name + '</a></div>' +
                    '</div>' +
                    '<div class="c-card-event__body">' +
                    '<div class="c-card-event__info">' +
                    '<div class="c-card-event__item"><i class="icon-mark"></i>' + item.address + '</div>' +
                    '<div class="c-card-event__item">' + item.subway + '</div>' +
                    '<div class="c-card-event__item"><i class="icon-phoneNumber"></i>' + item.phone + '</div>' +
                    '<div class="c-card-event__item"><svg class="c-symbol symbol-table"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#symbol-table"></use></svg>Доступное количество мест: ' + item.count + '</div>' +
                    '</div>' +
                    '<div class="c-card-event__text">' + item.text + '</div>' +
                    '<div class="l-button">' +
                    '<a class="c-button c-button__small c-card-event__link--more" href="' + item.detail + '" onclick="getEventDetail(\'' + item.detail + '\',\'card\', ' + item.id + ')">Подробнее</a>' +
                    '<a class="c-button c-button__small c-button--dark c-card-event__link--basket" href="' + item.detail + '" onclick="getEventDetail(\'' + item.detail + '\',\'basket\', ' + item.id + ')">добавить в корзину</a>' +
                    '<a class="c-button c-button__small c-button--dark c-card-event__link--one-click" href="' + item.detail + '" onclick="getEventDetail(\'' + item.detail + '\',\'one_click\', ' + item.id + ')">оформить в 1 клик</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            html += '</div><div class="popup-event-map__title">' +
                '<a href="' + cafe.cafe_detail + '">' + cafe.cafe_name + '</a>' +
                '<span class="popup-close js-popup-close"></span></div></div>';


            var eventBalloonLayout = ymaps.templateLayoutFactory.createClass(html, {
                    build: function () {
                        this.constructor.superclass.build.call(this);
                        $('.js-popup-close').bind('click', $.proxy(this.onCloseClick, this));
                    },
                    clear: function () {
                        $('.js-popup-close').unbind('click', $.proxy(this.onCloseClick, this));
                        this.constructor.superclass.build.call(this);
                    },
                    onCloseClick: function () {
                        this.getData().geoObject.balloon.close();
                    }
                }),
                getPointOptions = function () {
                    return {
                        iconImageHref: site + '/img/icons/icon-map-point.png',
                        iconImageSize: [44, 53],
                        iconImageOffset: [-22, -56],
                        iconLayout: 'default#image',
                        balloonLayout: eventBalloonLayout,
                        balloonOffset: [-107, -280],
                        balloonShadow: false,
                        balloonAutoPan: false
                    };
                };
            var cafe = new ymaps.Placemark([cafe.coords[0], cafe.coords[1]], {}, getPointOptions());
            eventBlacemarks.push(cafe);
        }
        loadEventsCard();
        eventMap.geoObjects.events.add([
            'balloonopen'
        ], function (e) {
            var geoObject = e.get('target');
            eventMap.panTo([geoObject.geometry.getCoordinates()], {
                delay: 0
            });
        });

        eventClusterer.options.set({
            gridSize: 80,
            clusterDisableClickZoom: false
        });

        // В кластеризатор можно добавить javascript-массив меток (не геоколлекцию) или одну метку.
        eventClusterer.add(eventBlacemarks);
        eventMap.geoObjects.add(eventClusterer);
    }
}

function menuItemMap(items) {
    ymaps.ready(init);

    function init() {
        var map = new ymaps.Map('map', {
                center: [55.751574, 37.573856],
                zoom: 9,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                controls: ['zoomControl', 'fullscreenControl']
            }, {
                searchControlProvider: 'yandex#search'
            }),
            clusterIcons = [
                {
                    href: site + '/img/m1.png',
                    size: [40, 40],
                    // Отступ, чтобы центр картинки совпадал с центром кластера.
                    offset: [-20, -20]
                },
                {
                    href: site + '/img/m1.png',
                    size: [40, 40],
                    offset: [-20, -20]
                }],
            MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div style="color: #FFFFFF; font-weight: bold;">$[properties.geoObjects.length]</div>'),
            clusterer = new ymaps.Clusterer({
                clusterIcons: clusterIcons,
                clusterIconContentLayout: MyIconContentLayout,
                /*Ставим true, если хотим кластеризовать только точки с одинаковыми координатами.*/
                groupByCoordinates: false,
                /*Опции кластеров указываем в кластеризаторе с префиксом "cluster".*/
                clusterDisableClickZoom: true,
                clusterHideIconOnBalloonOpen: false,
                geoObjectHideIconOnBalloonOpen: false
            }),
            /*шаблон попапа*/
            myBalloonLayout = ymaps.templateLayoutFactory.createClass(
                '<div class="c-card-cafe c-card-map">' +
                '<div class="c-card-map__header">' +
                '<span class="popup-close" id="close-balloon" onclick="window.map.balloon.close()"></span>' +
                '<a href="$[properties.link]" class="c-card-map__title">$[properties.name]</a>' +
                '</div>' +
                '<div class="c-card-map__body">' +
                '<div class="c-card-cafe__img">' +
                '<img src="$[properties.pic]" alt="">' +
                '<a  href="#" class="c-card-cafe__menu" style="display:none">' + '<i class="icon-food-menu"></i>' + 'меню</a>' +
                '</div>' +
                '<div class="c-card-cafe__body">' +
                '<div class="c-card-cafe__item">' + '<b>Адрес: </b>' + '$[properties.address]</div>' +
                '<div class="c-card-cafe__item">' + '<b>Телефон: </b>' + '$[properties.phoneNumber]</div>' +
                '<div class="c-card-cafe__item">' + '<b>Время работы: </b>' + '$[properties.timeWork]</div>' +
                '<div class="c-card-cafe__item c-card-cafe__subway">' +
                '$[properties.subway]' +
                '</div>' +
                '<div class="c-card-cafe__item c-card-cafe__entertainment">$[properties.entertainment]</div>' + '$[properties.advantages]' +
                '</div>' +
                '</div>' +
                '</div>', {

                    build: function () {
                        this.constructor.superclass.build.call(this);
                        $('.popup-close').bind('click', $.proxy(this.onCloseClick, this));
                        mapJS(this);
                    },
                    clear: function () {
                        $('.popup-close').unbind('click', $.proxy(this.onCloseClick, this));
                        this.constructor.superclass.build.call(this);
                    },
                    onCloseClick: function () {
                        this.getData().geoObject.balloon.close();
                    }
                }),
            getPointOptions = function () {
                return {
                    iconImageHref: site + '/img/icons/icon-map-point.png',
                    iconImageSize: [44, 53],
                    iconImageOffset: [-22, -56],
                    iconLayout: 'default#image',
                    balloonLayout: myBalloonLayout,
                    balloonOffset: [-107, -280],
                    balloonShadow: false,
                    balloonAutoPan: false
                };
            };
        var placemarks = [];
        for (var i in items) {
            var item = items[i];

            var cafe = new ymaps.Placemark([item.coords[0], item.coords[1]], {
                link: item.link,
                name: item.name,
                address: item.address,
                phoneNumber: item.phoneNumber,
                timeWork: item.timeWork,
                entertainment: item.entertainment,
                advantages: item.advantages,
                pic: item.pic,
                subway: item.subway
            }, getPointOptions());
            placemarks.push(cafe);
        }
        map.geoObjects.events.add([
            'balloonopen'
        ], function (e) {
            var geoObject = e.get('target');
            //map.setCenter([geoObject.geometry.getCoordinates(), 10);
            map.panTo([geoObject.geometry.getCoordinates()], {
                delay: 0
            });
        });

        clusterer.options.set({
            gridSize: 80,
            clusterDisableClickZoom: false
        });

        // В кластеризатор можно добавить javascript-массив меток (не геоколлекцию) или одну метку.
        clusterer.add(placemarks);
        map.geoObjects.add(clusterer);

        // Спозиционируем карту так, чтобы на ней были видны все объекты.
//        map.setBounds(clusterer.getBounds(), {
//            checkZoomRange: true
//        });

        // после вызова карты
        if (isMobile.any()) {
            map.behaviors.disable('drag');
        }
    }
}

function cafeListMap(items) {
    ymaps.ready(init);

    function init() {
        map = new ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 4,
            behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
            controls: ['zoomControl', 'fullscreenControl']
        }, {
            searchControlProvider: 'yandex#search'
        }),
            clusterIcons = [
                {
                    href: site + '/img/m1.png',
                    size: [40, 40],
                    // Отступ, чтобы центр картинки совпадал с центром кластера.
                    offset: [-20, -20]
                },
                {
                    href: site + '/img/m1.png',
                    size: [40, 40],
                    offset: [-20, -20]
                }],
            MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div style="color: #FFFFFF; font-weight: bold;">$[properties.geoObjects.length]</div>'),
            clusterer = new ymaps.Clusterer({
                clusterIcons: clusterIcons,
                clusterIconContentLayout: MyIconContentLayout,
                /*Ставим true, если хотим кластеризовать только точки с одинаковыми координатами.*/
                groupByCoordinates: false,
                /*Опции кластеров указываем в кластеризаторе с префиксом "cluster".*/
                clusterDisableClickZoom: true,
                clusterHideIconOnBalloonOpen: false,
                geoObjectHideIconOnBalloonOpen: false
            }),
            /*шаблон попапа*/
            myBalloonLayout = ymaps.templateLayoutFactory.createClass(
                '<div class="c-card-cafe c-card-map v2">' +
                '<div class="c-card-map__header">' +
                '<span class="popup-close" id="close-balloon" onclick="window.map.balloon.close()"></span>' +
                '<a href="$[properties.link]" class="c-card-map__title">$[properties.name]</a>' +
                '</div>' +
                '<div class="c-card-map__body">' +
                '<div class="c-card-cafe__img">' +
                '<img src="$[properties.pic]" alt="">' +
                '<a  href="#" class="c-card-cafe__menu" data-cafe="$[properties.cafeId]">' + '<i class="icon-food-menu"></i>' + 'меню</a>' +
                '</div>' +
                '<div class="c-card-cafe__body">' +
                '<div class="c-card-cafe__item c-card-cafe__address"><svg class="c-symbol symbol-mark"><use xlink:href="#symbol-mark"></use></svg>' + '$[properties.address]</div>' +
                '<div class="c-card-cafe__item c-card-cafe__subway">' +
                '$[properties.subway]' +
                '</div>' +
                '$[properties.phoneNumber]$[properties.timeWork]' +
                '<div class="c-card-cafe__item c-card-cafe__entertainment">$[properties.entertainment]</div>' + '$[properties.advantages]' +
                '</div>' +
                '</div>' +
                '</div>', {

                    build: function () {
                        this.constructor.superclass.build.call(this);
                        $('.popup-close').bind('click', $.proxy(this.onCloseClick, this));
                        mapJS(this);
                    },
                    clear: function () {
                        $('.popup-close').unbind('click', $.proxy(this.onCloseClick, this));
                        this.constructor.superclass.build.call(this);
                    },
                    onCloseClick: function () {
                        this.getData().geoObject.balloon.close();
                    }
                }),
            getPointOptions = function () {
                return {
                    iconImageHref: site + '/img/icons/icon-map-point.png',
                    iconImageSize: [44, 53],
                    iconImageOffset: [-22, -56],
                    iconLayout: 'default#image',
                    balloonLayout: myBalloonLayout,
                    balloonOffset: [-107, -280],
                    balloonShadow: false,
                    balloonAutoPan: false
                };
            };

        var placemarks = [];
        for (var i in items) {
            var item = items[i];

            var cafe = new ymaps.Placemark([item.coords[0], item.coords[1]], {
                link: item.link,
                name: item.name,
                address: item.address,
                phoneNumber: item.phoneNumber,
                timeWork: item.timeWork,
                entertainment: item.entertainment,
                advantages: item.advantages,
                pic: item.pic,
                subway: item.subway,
                cafeId: item.cafeId
            }, getPointOptions());
            placemarks.push(cafe);
        }
        map.geoObjects.events.add([
            'balloonopen'
        ], function (e) {
            var geoObject = e.get('target');
            //map.setCenter([geoObject.geometry.getCoordinates(), 10);
            map.panTo([geoObject.geometry.getCoordinates()], {
                delay: 0
            });
        });

        clusterer.options.set({
            gridSize: 80,
            clusterDisableClickZoom: false
        });

        // В кластеризатор можно добавить javascript-массив меток (не геоколлекцию) или одну метку.
        clusterer.add(placemarks);
        map.geoObjects.add(clusterer);

        // Спозиционируем карту так, чтобы на ней были видны все объекты.
        // myMap.setBounds(clusterer.getBounds(), {
        //     checkZoomRange: true
        // });
    }
}

window.mapItemLoad = false;
window.mapDeliveryLoad = false;

function cakeItemMap(items, event) {


    if (event) {
        window.mapItemLoad = false;
        window.mapDeliveryLoad = false;
    }
    if (!window.mapItemLoad)
        ymaps.ready(init);

    function init() {
        var mapPickup = new ymaps.Map('cake-order__map', {
                center: [55.73, 37.75],
                zoom: 9,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                controls: ['zoomControl', 'fullscreenControl']
            },
            {
                searchControlProvider: 'yandex#search'
            }
        );
        var pickupCollection = new ymaps.GeoObjectCollection();
        for (var i = 0, l = items.length; i < l; i++) {
            var coord = items[i].PROPERTY_COORDINATES__VALUE.split(',');
            if (items[i].PROPERTY_PICKUP_VALUE == 'Y') {

                var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
                    '<div class="no-pickup tooltip">' +
                    '<div class="close"></div>' +
                    '$[[options.contentLayout observeSize minWidth=235 maxWidth=235 maxHeight=350]]' +
                    '</div>', {
                        build: function () {

                            this.constructor.superclass.build.call(this);

                            this._$element = $('.no-pickup.tooltip', this.getParentElement());

                            this._$element.find('.close')
                                .on('click', $.proxy(this.onCloseClick, this));
                        },
                        onCloseClick: function (e) {
                            e.preventDefault();
                            console.log('++');
                            this.events.fire('userclose');
                        }
                    });
                var MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                    '<span class="map tooltiptext">К сожалению, в данном кафе самовывоза нет.</span>'
                );
                var placemark = new ymaps.Placemark([coord[0], coord[1]], {
                    iconContent: items[i].NAME,
                    itemId: items[i].ID,
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: site + '/img/icon-map-no-pickup.png',
                    iconImageSize: [44, 53],
                    iconImageOffset: [-5, -38],
                    balloonLayout: MyBalloonLayout,
                    balloonContentLayout: MyBalloonContentLayout,
                    balloonPanelMaxMapArea: 0

                });
            } else {
                var placemark = new ymaps.Placemark([coord[0], coord[1]], {
                    iconContent: items[i].NAME,
                    itemId: items[i].ID
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: site + '/img/icon-map-point.png',
                    iconImageSize: [44, 53],
                    iconImageOffset: [-5, -38]
                });
                placemark.events.add([
                    'click'
                ], function (event) {
                    var target = event.get("target");
//                $('#order-delivery-cake__address-' + target.properties._data.itemId).parent().show();
//                $('#order-delivery-cake__address-' + target.properties._data.itemId).parent().insertBefore($('.order-delivery-address__item:first-child'));
                    $('#order-delivery-cake__address-' + target.properties._data.itemId).trigger('click');
                });
            }
            pickupCollection.add(placemark);

        }

        mapPickup.geoObjects.add(pickupCollection);
        $('.cake-cafe-map_item').click(function () {
            var coords = $(this).data('coords').split(',');
            mapPickup.setCenter([coords[0], coords[1]], 16);
        });

        window.mapItemLoad = true;
    }

}


function cakeDeliveryMap() {
    var mkad_coords = window.mkad_coord;

    if (!window.mapDeliveryLoad)
        ymaps.ready(init);

    function init() {
        $('#delivery_map').empty();
        //карта с центром на москве
        var myMap = new ymaps.Map("delivery_map", {
            center: [55.73, 37.75],
            zoom: 9,
            behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
        });

        // Создадим элемент управления поиск
        var searchControl = new ymaps.control.SearchControl({
            options: {
                provider: 'yandex#search'
            }
        });

        // Добавим поиск на карту
        myMap.controls.add(searchControl);
        myMap.events.add('click', function (e) {
            var clickCoords = e.get('coords');
            calculate(clickCoords);
        });
        searchControl.events.add('resultselect', function (e) {
            var index = e.get('index');
            searchControl.getResult(index).then(function (res) {
                var coords = res.geometry.getCoordinates();
                calculate(coords);
            });

        });
        $('#map_address').change(function () {
            calculate($(this).val());
        });
        var arPlacemarks = new Array();
        for (i = 0; i < mkad_coords[0].length; i++)
            arPlacemarks[i] = new ymaps.Placemark(mkad_coords[0][i]);

        var arPlacemarksRez = ymaps.geoQuery(arPlacemarks).addToMap(myMap).setOptions('visible', false);

        var mkad_polygon = new ymaps.Polygon(mkad_coords);
        ymaps.geoQuery(mkad_polygon).addToMap(myMap).setOptions('visible', false);

        function calculate(coords) {
            myMap.geoObjects.remove(window.route);
            ymaps.geocode(coords, {results: 1}, {results: 100}).then(function (res) {
                var result = ymaps.geoQuery(res.geoObjects.get(0));
                var geoObject = res.geoObjects.get(0);
                var name = res.geoObjects.get(0).properties.get('text');
                var objectsInsidePolygon = result.searchInside(mkad_polygon);

                if (typeof objectsInsidePolygon.get(0) === 'undefined') {
                    setRoute(geoObject, name, '5000');
                } else {
                    setRoute(geoObject, name, '2000');
                }

            });
        }

        function setRoute(geoObject, name, price) {
            if ($('#dessert_price').length > 0) {
                var dessert_price = parseInt($('#dessert_price').val());
                if (dessert_price > 2000)
                    price = 0;

            }
            var point = geoObject.geometry.getCoordinates();
            var closestObject = arPlacemarksRez.getClosestTo(point);

            window.route = ymaps.route([
                closestObject.geometry.getCoordinates(),
                point
            ]).then(function (router) {

                route = router;
//                var points = route.getPaths();
//                points.options.set('iconLayout', 'default#image');
//                points.options.set('iconImageHref', site + '/img/icon-map-point.png');
//                points.options.set('iconImageSize', [44, 53]);
//                points.options.set('iconImageOffset', [-5, -38]);
                myMap.geoObjects.add(route);

                var distance = Math.round(route.getLength() / 1000);
                if (parseInt(distance) > 40) {
                    $('#delivery_text').hide();
                    $('#delivery_price').hide();
                    $('#cake-order-issue').prop('disabled', true);
                    return false;
                }
                $('#delivery_price').show();
                $('#delivery_text').show();
                $('#cake-order-issue').prop('disabled', false);
                if (distance > 0) {
                    $('#delivery_price').html(price + ' <span class="c-currency-symbol rub">руб</span>');
                    $('.delivery_price.dessert').html(' + доставка <span>' + price + '</span> <span class="c-currency-symbol rub">руб</span>');
                }
                $('#map_address').val(name);

                $('#delivery_price').data('price', price);
            });
        }

        window.mapDeliveryLoad = true;
    }
}

function menuPickUpMap(items, map, key) {
    ymaps.ready(init);

    function init() {
        for (var i in items) {
            var coord = items[i].PROPERTY_COORDINATES__VALUE.split(',');
            break;
        }
        window['mapPickup' + key] = new ymaps.Map(map, {
                center: [coord[0], coord[1]],
                zoom: 9,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                controls: ['zoomControl', 'fullscreenControl']
            },
            {
                searchControlProvider: 'yandex#search'
            }
        );
        var pickupCollection = new ymaps.GeoObjectCollection();
        for (var i in items) {
            var coord = items[i].PROPERTY_COORDINATES__VALUE.split(',');
            if (items[i].PROPERTY_PICKUP_VALUE == 'Y') {
                var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
                    '<div class="no-pickup tooltip">' +
                    '<div class="close"></div>' +
                    '$[[options.contentLayout observeSize minWidth=235 maxWidth=235 maxHeight=350]]' +
                    '</div>', {
                        build: function () {

                            this.constructor.superclass.build.call(this);

                            this._$element = $('.no-pickup.tooltip', this.getParentElement());

                            this._$element.find('.close')
                                .on('click', $.proxy(this.onCloseClick, this));
                        },
                        onCloseClick: function (e) {
                            e.preventDefault();
                            console.log('++');
                            this.events.fire('userclose');
                        }
                    });
                var MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                    '<span class="map tooltiptext">К сожалению, в данном кафе самовывоза нет.</span>'
                );
                var placemark = new ymaps.Placemark([coord[0], coord[1]], {
                    iconContent: items[i].NAME,
                    itemId: items[i].ID,
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: site + '/img/icon-map-no-pickup.png',
                    iconImageSize: [44, 53],
                    iconImageOffset: [-5, -38],
                    balloonContentLayout: MyBalloonContentLayout,
                    balloonLayout: MyBalloonLayout,
                    balloonPanelMaxMapArea: 0
                });
            } else {
                var placemark = new ymaps.Placemark([coord[0], coord[1]], {
                    iconContent: items[i].NAME,
                    itemId: items[i].ID
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: site + '/img/icon-map-point.png',
                    iconImageSize: [44, 53],
                    iconImageOffset: [-5, -38]
                });
                placemark.events.add([
                    'click'
                ], function (event) {
                    var target = event.get("target");
                    $('#' + key + '-pick-up-' + target.properties._data.itemId).parent().insertBefore($('#' + key + '-pickup_list').find('.order-delivery-address__item:nth-child(1)')[0]);
                    //$('#' + key + '-pick-up-' + target.properties._data.itemId).parent().remove();
                    $('#' + key + '-pick-up-' + target.properties._data.itemId).parent().find('input').trigger('click');
                    //$('#' + key + '-pick-up-' + target.properties._data.itemId).parent().show();
                });
            }
            pickupCollection.add(placemark);
        }
        window['mapPickup' + key].geoObjects.add(pickupCollection);
        window['mapPickup' + key].setBounds(window['mapPickup' + key].geoObjects.getBounds(), {checkZoomRange: true});

        $('#' + key + '-pickup_list').find('.menu_pickup_cafe').click(function () {
            var coords = $(this).data('coords').split(',');
            window['mapPickup' + key].setCenter([coords[0], coords[1]], 16);
        });
    }

}

function menuCafeMap(items, map, key) {
    ymaps.ready(init);

    function init() {
        for (var i in items) {
            var coord = items[i].PROPERTY_COORDINATES__VALUE.split(',');
            break;
        }
        window['mapPickup' + key] = new ymaps.Map(map, {
                center: [55.751574, 37.573856],
                zoom: 9,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                controls: ['zoomControl', 'fullscreenControl']
            },
            {
                searchControlProvider: 'yandex#search'
            }
        );
        MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #FFFFFF; font-weight: bold;">$[properties.geoObjects.length]</div>');

        getPointOptions = function (item) {
            return {
                iconImageHref: site + '/img/icons/icon-map-point.png',
                iconImageSize: [44, 53],
                iconImageOffset: [-22, -56],
                iconLayout: 'default#image',
                balloonOffset: [-5, 0],
            };
        };
        var placemarks = [];
        var pickupCollection = new ymaps.GeoObjectCollection();

        getPointOptions = function (item) {
            return {
                iconImageHref: site + '/img/icons/icon-map-point.png',
                iconImageSize: [44, 53],
                iconImageOffset: [-22, -56],
                iconLayout: 'default#image',
                balloonOffset: [-5, 0],
            };
        };
        clusterIcons = [
            {
                href: site + '/img/m1.png',
                size: [40, 40],
                offset: [-20, -20]
            },
            {
                href: site + '/img/m1.png',
                size: [40, 40],
                offset: [-20, -20]
            }
        ];
        clusterer = new ymaps.Clusterer({
            clusterIcons: clusterIcons,
            clusterIconContentLayout: MyIconContentLayout,
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });
        console.log(items)
        for (var i in items) {
            var coord = items[i].PROPERTY_COORDINATES__VALUE.split(',');

            var placemark = new ymaps.Placemark([coord[0], coord[1]], {
                iconContent: items[i].NAME,
                itemId: items[i].ID,
                balloonContentHeader: items[i].NAME,
                balloonContentBody: items[i].PROPERTY_ADDRESS_VALUE,
                balloonContentFooter: items[i].map_phone + '<br>' + items[i].map_mail,
            }, getPointOptions());
            placemarks.push(placemark);
            //pickupCollection.add(placemark);
        }


        window['mapPickup' + key].geoObjects.events.add([
            'balloonopen'
        ], function (e) {
            var geoObject = e.get('target');
            //map.setCenter([geoObject.geometry.getCoordinates(), 10);
            window['mapPickup' + key].panTo([geoObject.geometry.getCoordinates()], {
                delay: 0
            });
        });

        clusterer.options.set({
            gridSize: 80,
            clusterDisableClickZoom: false
        });

        clusterer.add(placemarks);
        window['mapPickup' + key].geoObjects.add(clusterer);


        $('#' + key + '_list').find('.menu_cafe_pickup_cafe').click(function () {
            var coords = $(this).data('coords').split(','), index = $(this).parent().index();
            window['mapPickup' + key].setCenter([coords[0], coords[1]], 10);
            $.cookie('select_menu_cafe', $(this).data('cafe_id'), {path: '/', expires: 1});
            //placemarks[index].balloon.open();
        });

        $('.menu_cafe_pickup_cafe:checked').click();
    }
}

function menuCafeMapPickUp(items, map, key) {
    ymaps.ready(init);

    function init() {
        for (var i in items) {
            var coord = items[i].PROPERTY_COORDINATES__VALUE.split(',');
            break;
        }
        window['mapPickup' + key] = new ymaps.Map(map, {
                center: [coord[0], coord[1]],
                zoom: 9,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                controls: ['zoomControl', 'fullscreenControl']
            },
            {
                searchControlProvider: 'yandex#search'
            }
        );
        var pickupCollection = new ymaps.GeoObjectCollection();
        for (var i in items) {
            var coord = items[i].PROPERTY_COORDINATES__VALUE.split(',');

            var placemark = new ymaps.Placemark([coord[0], coord[1]], {
                iconContent: items[i].NAME,
                itemId: items[i].ID
            }, {
                iconLayout: 'default#image',
                iconImageHref: site + '/img/icon-map-point.png',
                iconImageSize: [44, 53],
                iconImageOffset: [-5, -38]
            });
            placemark.events.add([
                'click'
            ], function (event) {
                var target = event.get("target");
                $('#' + key + '-' + target.properties._data.itemId).parent().insertBefore($('#' + key + '_list').find('.order-delivery-address__item:nth-child(1)')[0]);
                //$('#' + key + '-pick-up-' + target.properties._data.itemId).parent().remove();
                $('#' + key + '-' + target.properties._data.itemId).parent().find('input').trigger('click');
                //$('#' + key + '-pick-up-' + target.properties._data.itemId).parent().show();
            });

            pickupCollection.add(placemark);
        }
        window['mapPickup' + key].geoObjects.add(pickupCollection);
        window['mapPickup' + key].setBounds(window['mapPickup' + key].geoObjects.getBounds(), {checkZoomRange: true});

        $('#' + key + '_list').find('.menu_cafe_pickup_cafe').click(function () {

            var coords = $(this).data('coords').split(',');
            window['mapPickup' + key].setCenter([coords[0], coords[1]], 16);
            $.cookie('select_menu_cafe', $(this).data('cafe_id'), {path: '/', expires: 1});
        });

        $('.menu_cafe_pickup_cafe:checked').click();
    }
}

function menuHomeMap(items, map, key) {
    ymaps.ready(init);

    function init() {
        for (var i in items) {
            var coord = items[i].PROPERTY_COORDINATES__VALUE.split(',');
            break;
        }
        window['mapHome' + key] = new ymaps.Map(map, {
                center: [coord[0], coord[1]],
                zoom: 9,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                controls: ['zoomControl', 'fullscreenControl']
            },
            {
                searchControlProvider: 'yandex#search'
            }
        );
        var homeCollection = new ymaps.GeoObjectCollection();
        for (var i in items) {
            var coord = items[i].PROPERTY_COORDINATES__VALUE.split(',');
            if (items[i].PROPERTY_PICKUP_VALUE == 'Y') {
                var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
                    '<div class="no-pickup tooltip">' +
                    '<div class="close"></div>' +
                    '$[[options.contentLayout observeSize minWidth=235 maxWidth=235 maxHeight=350]]' +
                    '</div>', {
                        build: function () {

                            this.constructor.superclass.build.call(this);

                            this._$element = $('.no-pickup.tooltip', this.getParentElement());

                            this._$element.find('.close')
                                .on('click', $.proxy(this.onCloseClick, this));
                        },
                        onCloseClick: function (e) {
                            e.preventDefault();
                            console.log('++');
                            this.events.fire('userclose');
                        }
                    });
                var MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                    '<span class="map tooltiptext">К сожалению, в данном кафе самовывоза нет.</span>'
                );
                var placemark = new ymaps.Placemark([coord[0], coord[1]], {
                    iconContent: items[i].NAME,
                    itemId: items[i].ID,
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: site + '/img/icon-map-no-pickup.png',
                    iconImageSize: [44, 53],
                    iconImageOffset: [-5, -38],
                    balloonContentLayout: MyBalloonContentLayout,
                    balloonLayout: MyBalloonLayout,
                    balloonPanelMaxMapArea: 0
                });
            } else {
                var placemark = new ymaps.Placemark([coord[0], coord[1]], {
                    iconContent: items[i].NAME,
                    itemId: items[i].ID
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: site + '/img/icon-map-point.png',
                    iconImageSize: [44, 53],
                    iconImageOffset: [-5, -38]
                });
                placemark.events.add([
                    'click'
                ], function (event) {
                    var target = event.get("target");
                    $('#' + key + '-pick-up-' + target.properties._data.itemId + '-home').parent().insertBefore($('#' + key + '-pickup_home_list').find('.order-delivery-address__item_home:nth-child(1)')[0]);
                    //$('#' + key + '-pick-up-' + target.properties._data.itemId).parent().remove();
                    $('#' + key + '-pick-up-' + target.properties._data.itemId + '-home').parent().find('input').trigger('click');
                    //$('#' + key + '-pick-up-' + target.properties._data.itemId).parent().show();
                });
            }
            homeCollection.add(placemark);
        }
        window['mapHome' + key].geoObjects.add(homeCollection);
        window['mapHome' + key].setBounds(window['mapHome' + key].geoObjects.getBounds(), {checkZoomRange: true});

        window['mapHome' + key].events.add('sizechange', function () {
            window['mapHome' + key].setBounds(window['mapHome' + key].geoObjects.getBounds(), {checkZoomRange: true});
        });

        $('#' + key + '-pickup_home_list').find('.menu_pickup_cafe').click(function () {
            var coords = $(this).data('coords').split(',');
            window['mapHome' + key].setCenter([coords[0], coords[1]], 16);
            $.cookie('select_menu_cafe', $(this).val(), {path: '/', expires: 1});

        });

        $('#order-delivery-on-home .order-delivery-address__item input').keyup(function () {

            if ($('.tab-content .delivery:checked').val() == 7) {
                let
                    city = $('#order-delivery-on-home #menu-delivery-custom__city').val(),
                    street = $('#order-delivery-on-home #menu-delivery-custom__street').val(),
                    house = $('#order-delivery-on-home #menu-delivery-custom__house').val(),
                    korpus = $('#order-delivery-on-home #menu-delivery-custom__korpus').val(),
                    flat = $('#order-delivery-on-home #menu-delivery-custom__flat').val();

                $('#order-delivery-on-home #menu-delivery__address-custom').val('г.' + city + ', ул.' + street + ', д.' + house + ', корп.' + korpus + ', кв.' + flat);
                // if(street && house)
                //     findCoords($('#order-delivery-on-home #menu-delivery__address-custom').val(), window['mapHome' + key]);
            }
        });

    }

}

function menuDeliveryMap(items, map, cafe, city, admin, key) {
    var mkad_coords = window.mkad_coord;
    ymaps.ready(init);

    function init() {
        var adressCollection = new ymaps.GeoObjectCollection(), placemarks = [], zones = {}, mkad;
        window['mapDeliveryCake' + key] = new ymaps.Map(map, {
                center: [55.73, 37.75],
                zoom: 9,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
                controls: ['zoomControl', 'fullscreenControl']
            },
            {
                searchControlProvider: 'yandex#search'
            });

        // Клик по карте и установка маркера        
        window['mapDeliveryCake' + key].events.add('click', function (e) {
            var clickCoords = e.get('coords');
            setMark(window['mapDeliveryCake' + key], adressCollection, false, clickCoords, zones, mkad, arPlacemarksRez);
        });
        // Клик по адресу из списка и установка маркера
        $('#' + key + '-delivery_list').find('.menu-delivery_address').change(function () {
            $('#json_address-' + key).remove();
            if ($(this).prop('checked')) {
                setMark(window['mapDeliveryCake' + key], adressCollection, true, $(this).val(), zones, mkad, arPlacemarksRez);
            }
        });
        // Записк в массив маркеров адресов пользователя

        for (var i in items) {
            var $curAddres = 'г.' + items[i]['CITY'];
            $curAddres += ', ул.' + items[i]['STREET'];
            $curAddres += ', д.' + items[i]['HOUSE'];
            if (items[i].KORPUS.length > 0)
                $curAddres += 'к' + items[i]['KORPUS'];
            if (items[i]['FLAT'].length > 0)
                $curAddres += ', кв. ' + items[i]['FLAT'];

            ymaps.geocode($curAddres, {results: 1}, {results: 100}).then(function (res) {
                var clickCoords = res.geoObjects.get(0).geometry.getCoordinates();
                var placemark = new ymaps.Placemark(clickCoords, {
                    //iconContent: $curAddres
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: site + '/images/maps-and-flags.png',
                    //iconImageSize: [44, 53],
                    iconImageOffset: [-5, -38]
                });
                placemarks.push(placemark);
            });
        }
        // Записк в массив маркеров кафе и также зон доставки данных кафе
        for (var i in cafe) {
            var coord = cafe[i].PROPERTY_COORDINATES__VALUE.split(',');
            var placemark = new ymaps.Placemark([coord[0], coord[1]], {
                iconContent: cafe[i].NAME,
                itemId: cafe[i].ID
            }, {
                iconLayout: 'default#image',
                iconImageHref: site + '/img/icon-map-point.png',
                iconImageSize: [44, 53],
                iconImageOffset: [-5, -38]
            });
            placemarks.push(placemark);
            if (admin && typeof (cafe[i].DELIVERY_ZONE) !== 'undefined') {
                zones[cafe[i].ID] = new ymaps.Polygon(cafe[i].DELIVERY_ZONE, {}, {fill: false});
                ymaps.geoQuery(zones[cafe[i].ID]).addToMap(window['mapDeliveryCake' + key]).setOptions('visible', false);
            }

        }
        // Установка зоны МКАД
        if (admin) {
            mkad = new ymaps.Polygon(window.mkad_coord, {}, {fill: false});
            var arPlacemarks = new Array();
            for (i = 0; i < mkad_coords[0].length; i++)
                arPlacemarks[i] = new ymaps.Placemark(mkad_coords[0][i]);

            var arPlacemarksRez = ymaps.geoQuery(arPlacemarks).addToMap(window['mapDeliveryCake' + key]).setOptions('visible', false);
            ymaps.geoQuery(mkad).addToMap(window['mapDeliveryCake' + key]).setOptions('visible', false);
        }
        var customMenuAdress = $('#' + key + '-delivery-custom_address').parent().parent().find('input, textarea');

        // Поиск введенного адреса на карте и установка маркера
        $(customMenuAdress).keyup(function () {
            var isMenuDelivery = $('#' + key + '-delivery__address-custom').prop('checked');
            if (isMenuDelivery) {
                var jsonAdress = {
                    'CITY': '',
                    'STREET': '',
                    'HOUSE': '',
                    'KORPUS': '',
                    'FLAT': '',
                    'NOTE': ''
                }, adress = [];

                if ($('#' + key + '-delivery-custom__city').val() !== '') {
                    adress.push('г. ' + $('#' + key + '-delivery-custom__city').val());
                    jsonAdress.CITY = $('#' + key + '-delivery-custom__city').val();
                }
                if ($('#' + key + '-delivery-custom__street').val() !== '') {
                    adress.push('ул. ' + $('#' + key + '-delivery-custom__street').val());
                    jsonAdress.STREET = $('#' + key + '-delivery-custom__street').val();
                }
                if ($('#' + key + '-delivery-custom__house').val() !== '') {
                    adress.push('дом ' + $('#' + key + '-delivery-custom__house').val());
                    jsonAdress.HOUSE = $('#' + key + '-delivery-custom__house').val();
                }
                if ($('#' + key + '-delivery-custom__korpus').val() !== '') {
                    adress.push('корпус ' + $('#' + key + '-delivery-custom__korpus').val());
                    jsonAdress.KORPUS = $('#' + key + '-delivery-custom__korpus').val();
                }
                if ($('#' + key + '-delivery-custom__flat').val() !== '') {
                    adress.push('квартира ' + $('#' + key + '-delivery-custom__flat').val());
                    jsonAdress.FLAT = $('#' + key + '-delivery-custom__flat').val();
                }
                if ($('#' + key + '-delivery-custom__note').val() !== '') {
                    jsonAdress.NOTE = $('#' + key + '-delivery-custom__note').val();
                }
                $('#json_address-' + key).remove();
                var elementJq = $('<input/>', {
                    value: JSON.stringify(jsonAdress),
                    class: 'item',
                    type: 'hidden',
                    id: 'json_address-' + key,
                    name: key + '[json_address]'
                });
                $('#' + key + '-delivery__address-custom').parent().append(elementJq);
                if (adress.length > 0)
                    $('#' + key + '-delivery__address-custom').val(adress.join(', '));
            } else {
                $('#json_address-' + key).remove();
            }
        });
        $(customMenuAdress).change(function () {
            var isMenuDelivery = $('#' + key + '-delivery__address-custom').prop('checked');
            if (isMenuDelivery) {
                setMark(window['mapDeliveryCake' + key], adressCollection, false, $('#' + key + '-delivery__address-custom').val(), zones, mkad, arPlacemarksRez);
            }
        });
        // Установка всех маркеров и выделение адреса по умолчанию
        setTimeout(function () {
            for (var i in placemarks)
                adressCollection.add(placemarks[i]);
            window['mapDeliveryCake' + key].geoObjects.add(adressCollection);
            //window['mapDeliveryCake' + key].setBounds(adressCollection.getBounds(), {checkZoomRange: true});
            $('.menu-delivery_address').each(function () {
                if ($(this).prop('checked'))
                    $(this).change();
            });

        }, 1500);
    }

    // Вывод всех кафе на карту
    function showCafe(collection) {
        for (var i in cafe) {
            var coord = cafe[i].PROPERTY_COORDINATES__VALUE.split(',');
            var placemark = new ymaps.Placemark([coord[0], coord[1]], {
                iconContent: cafe[i].NAME,
                itemId: cafe[i].ID
            }, {
                iconLayout: 'default#image',
                iconImageHref: site + '/img/icon-map-point.png',
                iconImageSize: [44, 53],
                iconImageOffset: [-5, -38]
            });
            collection.add(placemark);
        }
    }

    // Установка метки на карту а также проверка доступен ли выбранный адрес для дсотавки
    function setMark(map, collection, noInput, clickCoords, zones, mkad, arPlacemarksRez) {
        ymaps.geocode(clickCoords, {results: 1}, {results: 100}).then(function (res) {
            var object = res.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.Address.Components,
                cafeId = 0, disable = false;
            clickCoords = res.geoObjects.get(0).geometry.getCoordinates();
            if (key === 'cakes')
                calculate(clickCoords, mkad, arPlacemarksRez);
            $('label[for="' + key + '-delivery__address-custom"]').trigger('focus');
            if (!noInput) {
                var adress = [], jsonAdress = {
                    'CITY': '',
                    'STREET': '',
                    'HOUSE': '',
                    'KORPUS': '',
                    'FLAT': '',
                    'NOTE': ''
                };
                for (var i = 0; i < object.length; i++) {
                    switch (object[i].kind) {
                        case 'locality':
                            $('#' + key + '-delivery-custom__city').val(object[i].name);
                            jsonAdress.CITY = object[i].name;
                            adress.push('г. ' + $('#' + key + '-delivery-custom__city').val());
                            break;
                        case 'street':
                            $('#' + key + '-delivery-custom__street').val(object[i].name);
//                            jsonAdress.STREET = object[i].name;
//                            adress.push('ул. ' + $('#' + key + '-delivery-custom__street').val());
                            break;
                        case 'house':
                            $('#' + key + '-delivery-custom__house').val(object[i].name);
//                            jsonAdress.HOUSE = object[i].name;
//                            if (object[i].name !== '')
//                                adress.push('дом ' + $('#' + key + '-delivery-custom__house').val());
                            break;
                    }
                }
                if ($('#' + key + '-delivery-custom__street').val() !== '') {
                    jsonAdress.STREET = $('#' + key + '-delivery-custom__street').val();
                    adress.push('ул. ' + $('#' + key + '-delivery-custom__street').val());
                }
                if ($('#' + key + '-delivery-custom__house').val() !== '') {
                    jsonAdress.HOUSE = $('#' + key + '-delivery-custom__house').val();
                    adress.push('дом ' + $('#' + key + '-delivery-custom__house').val());
                }
                if ($('#' + key + '-delivery-custom__korpus').val() !== '') {
                    jsonAdress.KORPUS = $('#' + key + '-delivery-custom__korpus').val();
                    adress.push('корпус ' + $('#' + key + '-delivery-custom__korpus').val());
                }
                if ($('#' + key + '-delivery-custom__flat').val() !== '') {
                    jsonAdress.FLAT = $('#' + key + '-delivery-custom__flat').val();
                    adress.push('квартира ' + $('#' + key + '-delivery-custom__flat').val());
                }
                if (adress.length > 0)
                    $('#' + key + '-delivery__address-custom').val(adress.join(', '));
                $('#' + key + '-delivery__address-custom').trigger('click');
                $('#json_address-' + key).remove();
                var elementJq = $('<input/>', {
                    value: JSON.stringify(jsonAdress),
                    class: 'item',
                    type: 'hidden',
                    id: 'json_address-' + key,
                    name: key + '[json_address]'
                });
                $('#' + key + '-delivery__address-custom').parent().append(elementJq);
            }
            collection.removeAll();
            var myPlaceMark = new ymaps.Placemark(clickCoords, {
                center: clickCoords
            }, {
                iconLayout: 'default#image',
                iconImageHref: site + '/images/maps-and-flags.png'
            });

            if (admin) {
                var result = ymaps.geoQuery(res.geoObjects.get(0));
                for (var i in zones) {
                    if (typeof result.searchInside(zones[i]).get(0) !== 'undefined')
                        cafeId = i;
                }
                if ($('#' + key + 'cafeId').length === 0) {
                    var elementJq = $('<input/>', {
                        value: cafeId,
                        class: 'item',
                        type: 'hidden',
                        id: key + 'cafeId',
                        name: '' + key + '[cafeId]'
                    });
                    $('#bx-soa-order-form').append(elementJq);
                } else {
                    $('#' + key + 'cafeId').val(cafeId);
                }
                if (parseInt(cafeId) === 0) {
                    if (city === 'msk') {
                        if (typeof result.searchInside(mkad).get(0) === 'undefined' && key !== 'cakes') {
                            $('#' + key + 'cafeId').remove();
                            disable = true;
                        }
                    } else {
                        $('#' + key + 'cafeId').remove();
                        disable = true;
                    }
                }

                $('.order__btn').data('disabled', false);
                $('.order__btn').removeClass('disabled');
                if (disable) {
                    $('.order__btn').data('disabled', true);
                    $('.order__btn').addClass('disabled');
                }
            }
            showCafe(collection);
            collection.add(myPlaceMark);
            map.geoObjects.add(collection);
            map.setCenter(clickCoords, 16);
        });
    }

    function calculate(coords, mkad, arPlacemarksRez) {
        window['mapDeliveryCake' + key].geoObjects.remove(window.route);
        ymaps.geocode(coords, {results: 1}, {results: 100}).then(function (res) {
            var result = ymaps.geoQuery(res.geoObjects.get(0));
            var geoObject = res.geoObjects.get(0);
            var name = res.geoObjects.get(0).properties.get('text');
            var objectsInsidePolygon = result.searchInside(mkad);
            if (typeof objectsInsidePolygon.get(0) === 'undefined') {
                setRoute(geoObject, name, '5000', arPlacemarksRez);
            } else {
                setRoute(geoObject, name, '2000', arPlacemarksRez);
            }

        });
    }

    function setRoute(geoObject, name, price, arPlacemarksRez) {
        var point = geoObject.geometry.getCoordinates();
        var closestObject = arPlacemarksRez.getClosestTo(point);
        window.route = ymaps.route([
            closestObject.geometry.getCoordinates(),
            point
        ]).then(function (router) {

            route = router;
            window['mapDeliveryCake' + key].geoObjects.add(route);
            var distance = Math.round(route.getLength() / 1000);

            if (parseInt(distance) > 40) {
                $('#delivery_price').val('-1');
                $('.order__btn').data('disabled', true);
                $('.order__btn').addClass('disabled');
                return false;
            }
            $('#delivery_price').val(price);
            $('#delivery_price_visual span').html(price + ' <span class="c-currency-symbol rub">руб</span>');
            $('.order__btn').removeClass('disabled');
            $('.order__btn').data('disabled', false);
            $('#delivery_price').data('price', price);
        });
    }
}

function excursionMap() {
    ymaps.ready(init);

    function init() {
        var excurMap = new ymaps.Map('excursion-contact__map', {
                center: [55.780026, 37.715920],
                zoom: 15,
                behaviors: ["drag", "dblClickZoom", "rightMouseButtonMagnifier", "multiTouch"],
            }, {
                searchControlProvider: 'yandex#search'
            }),
            excursionPlacemark = new ymaps.Placemark([55.780026, 37.715920], {
                hintContent: 'Фабрика счастья'
            }, {
                iconLayout: 'default#image',
                iconImageHref: site + '/img/icon-map-point.png',
                iconImageSize: [44, 53],
                iconImageOffset: [-5, -38]
            });

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

        // после вызова карты
        if (isMobile.any()) {
            excurMap.behaviors.disable('drag');
        }

        excurMap.geoObjects
            .add(excursionPlacemark);
    }
}

window.mkad_coord = [[[55.78000432402266, 37.84172564285271], [55.775874525970494, 37.8381207618713], [55.775626746008065, 37.83979446823122], [55.77446586811748, 37.84243326983639], [55.771974101091104, 37.84262672750849], [55.77114545193181, 37.84153238623039], [55.76722010265554, 37.841124690460184], [55.76654891107098, 37.84239076983644], [55.76258709833121, 37.842283558197025], [55.758073999993734, 37.8421759312134], [55.75381499999371, 37.84198330422974], [55.749277102484484, 37.8416827275085], [55.74794544108413, 37.84157576190186], [55.74525257875241, 37.83897929098507], [55.74404373042019, 37.83739676451868], [55.74298009816793, 37.838732481460525], [55.743060321833575, 37.841183997352545], [55.73938799999373, 37.84097476190185], [55.73570799999372, 37.84048155819702], [55.73228210777237, 37.840095812164286], [55.73080491981639, 37.83983814285274], [55.729799917464675, 37.83846476321406], [55.72919751082619, 37.83835745269769], [55.72859509486539, 37.838636380279524], [55.727705075632784, 37.8395161005249], [55.722727886185154, 37.83897964285276], [55.72034817326636, 37.83862557539366], [55.71944437307499, 37.83559735744853], [55.71831419154461, 37.835370708803126], [55.71765218986692, 37.83738169402022], [55.71691750159089, 37.83823396494291], [55.71547311301385, 37.838056931213345], [55.71221445615604, 37.836812846557606], [55.709331054395555, 37.83522525396725], [55.70953687463627, 37.83269301586908], [55.70903403789297, 37.829667367706236], [55.70552351822608, 37.83311126588435], [55.70041317726053, 37.83058993121339], [55.69883771404813, 37.82983872750851], [55.69718947487017, 37.82934501586913], [55.69504441658371, 37.828926414016685], [55.69287499999378, 37.82876530422971], [55.690759754047335, 37.82894754100031], [55.68951421135665, 37.827697554878185], [55.68965045405069, 37.82447346292115], [55.68322046195302, 37.83136543914793], [55.67814012759211, 37.833554015869154], [55.67295011628339, 37.83544184655761], [55.6672498719639, 37.837480388885474], [55.66316274139358, 37.838960677246064], [55.66046999999383, 37.83926093121332], [55.65869897264431, 37.839025050262435], [55.65794084879904, 37.83670784390257], [55.65694309303843, 37.835656529083245], [55.65689306460552, 37.83704060449217], [55.65550363526252, 37.83696819873806], [55.65487847246661, 37.83760389616388], [55.65356745541324, 37.83687972750851], [55.65155951234079, 37.83515216004943], [55.64979413590619, 37.83312418518067], [55.64640836412121, 37.82801726983639], [55.64164525405531, 37.820614174591], [55.6421883258084, 37.818908190475426], [55.64112490388471, 37.81717543386075], [55.63916106913107, 37.81690987037274], [55.637925371757085, 37.815099354492155], [55.633798276884455, 37.808769150787356], [55.62873670012244, 37.80100123544311], [55.62554336109055, 37.79598013491824], [55.62033499605651, 37.78634567724606], [55.618768681480326, 37.78334147619623], [55.619855533402706, 37.77746201055901], [55.61909966711279, 37.77527329626457], [55.618770300976294, 37.77801986242668], [55.617257701952106, 37.778212973541216], [55.61574504433011, 37.77784818518065], [55.61148576294007, 37.77016867724609], [55.60599579539028, 37.760191219573976], [55.60227892751446, 37.75338926983641], [55.59920577639331, 37.746329965606634], [55.59631430313617, 37.73939925396728], [55.5935318803559, 37.73273665739439], [55.59350760316188, 37.7299954450912], [55.59469840523759, 37.7268679946899], [55.59229549697373, 37.72626726983634], [55.59081598950582, 37.7262673598022], [55.5877595845419, 37.71897193121335], [55.58393177431724, 37.70871550793456], [55.580917323756644, 37.700497489410374], [55.57778089778455, 37.69204305026244], [55.57815154690915, 37.68544477378839], [55.57472945079756, 37.68391050793454], [55.57328235936491, 37.678803592590306], [55.57255251445782, 37.6743402539673], [55.57216388774464, 37.66813862698363], [55.57505691895805, 37.617927457672096], [55.5757737568051, 37.60443099999999], [55.57749105910326, 37.599683515869145], [55.57796291823627, 37.59754177842709], [55.57906686095235, 37.59625834786988], [55.57746616444403, 37.59501783265684], [55.57671634534502, 37.593090671936025], [55.577944600233785, 37.587018007904], [55.57982895000019, 37.578692203704804], [55.58116294118248, 37.57327546607398], [55.581550362779, 37.57385012109279], [55.5820107079112, 37.57399562266922], [55.58226289171689, 37.5735356072979], [55.582393529795155, 37.57290393054962], [55.581919415056234, 37.57037722355653], [55.584471614867844, 37.5592298306885], [55.58867650795186, 37.54189249206543], [55.59158133551745, 37.5297256269836], [55.59443656218868, 37.517837865081766], [55.59635625174229, 37.51200186508174], [55.59907823904434, 37.506808949737554], [55.6062944994944, 37.49820432275389], [55.60967103463367, 37.494406071441674], [55.61066689753365, 37.494760001358024], [55.61220931698269, 37.49397137107085], [55.613417718449064, 37.49016528606031], [55.61530616333343, 37.48773249206542], [55.622640129112334, 37.47921386508177], [55.62993723476164, 37.470652153442394], [55.6368075123157, 37.46273446298218], [55.64068225239439, 37.46350692265317], [55.640794546982576, 37.46050283203121], [55.64118904154646, 37.457627470916734], [55.64690488145138, 37.450718034393326], [55.65397824729769, 37.44239252645875], [55.66053543155961, 37.434587576721185], [55.661693766520735, 37.43582144975277], [55.662755031737014, 37.43576786245721], [55.664610641628116, 37.430982915344174], [55.66778515273695, 37.428547447097685], [55.668633314343566, 37.42945134592044], [55.66948145750025, 37.42859571562949], [55.670813882451405, 37.4262836402282], [55.6811141674414, 37.418709037048295], [55.68235377885389, 37.41922139651101], [55.68359335082235, 37.419218771842885], [55.684375235224735, 37.417196501327446], [55.68540557585352, 37.41607020370478], [55.68686637150793, 37.415640857147146], [55.68903015131686, 37.414632153442334], [55.690896881757396, 37.413344899475064], [55.69264232162232, 37.41171432275391], [55.69455101638112, 37.40948282275393], [55.69638690385348, 37.40703674603271], [55.70451821283731, 37.39607169577025], [55.70942491932811, 37.38952706878662], [55.71149057784176, 37.387778313491815], [55.71419814298992, 37.39049275399779], [55.7155489617061, 37.385557272491454], [55.71849856042102, 37.38388335714726], [55.7292763261685, 37.378368238098155], [55.730845879211614, 37.37763597123337], [55.73167906388319, 37.37890062088197], [55.734703664681774, 37.37750451918789], [55.734851959522246, 37.375610832015965], [55.74105626086403, 37.3723813571472], [55.746115620904355, 37.37014935714723], [55.750883999993725, 37.36944173016362], [55.76335905525834, 37.36975304365541], [55.76432079697595, 37.37244070571134], [55.76636979670426, 37.3724259757175], [55.76735417953104, 37.369922155757884], [55.76823419316575, 37.369892695770275], [55.782312184391266, 37.370214730163575], [55.78436801120489, 37.370493611114505], [55.78596427165359, 37.37120164550783], [55.7874378183096, 37.37284851456452], [55.7886695054807, 37.37608325135799], [55.78947647305964, 37.3764587460632], [55.79146512926804, 37.37530000265506], [55.79899647809345, 37.38235915344241], [55.80113596939471, 37.384344043655396], [55.80322699999366, 37.38594269577028], [55.804919036911976, 37.38711208598329], [55.806610999993666, 37.3880239841309], [55.81001864976979, 37.38928977249147], [55.81348641242801, 37.39038389947512], [55.81983538336746, 37.39235781481933], [55.82417822811877, 37.393709457672124], [55.82792275755836, 37.394685720901464], [55.830447148154136, 37.39557615344238], [55.83167107969975, 37.39844478226658], [55.83151823557964, 37.40019761214057], [55.83264967594742, 37.400398790382326], [55.83322180909622, 37.39659544313046], [55.83402792148566, 37.39667059524539], [55.83638877400216, 37.39682089947515], [55.83861656112751, 37.39643489154053], [55.84072348043264, 37.3955338994751], [55.84502158126453, 37.392680272491454], [55.84659117913199, 37.39241188227847], [55.84816071336481, 37.392529730163616], [55.85288092980303, 37.39486835714723], [55.859893456073635, 37.39873052645878], [55.86441833633205, 37.40272161111449], [55.867579567544375, 37.40697072750854], [55.868369880337, 37.410007082016016], [55.86920843741314, 37.4120992989502], [55.87055369615854, 37.412668021163924], [55.87170587948249, 37.41482461111453], [55.873183961039565, 37.41862266137694], [55.874879126654704, 37.42413732540892], [55.875614937236705, 37.4312182698669], [55.8762723478417, 37.43111093783558], [55.87706546369396, 37.43332105622856], [55.87790681284802, 37.43385747619623], [55.88027084462084, 37.441303050262405], [55.87942070143253, 37.44747234260555], [55.88072960917233, 37.44716141796871], [55.88121221323979, 37.44769797085568], [55.882080694420715, 37.45204320500181], [55.882346110794586, 37.45673176190186], [55.88252729504517, 37.463383999999984], [55.88294937719063, 37.46682797486874], [55.88361266759345, 37.470014457672086], [55.88546991372396, 37.47751410450743], [55.88534929207307, 37.47860317658232], [55.882563306475106, 37.48165826025772], [55.8815803226785, 37.48316434442331], [55.882427612793315, 37.483831555817645], [55.88372791409729, 37.483182967125686], [55.88495581062434, 37.483092277908824], [55.8875561994203, 37.4855716508179], [55.887827444039566, 37.486440636245746], [55.88897899871799, 37.49014203439328], [55.890208937135604, 37.493210285705544], [55.891342397444696, 37.497512451065035], [55.89174030252967, 37.49780744510645], [55.89239745507079, 37.49940333499519], [55.89339220941865, 37.50018383334346], [55.903869074155224, 37.52421672750851], [55.90564076517974, 37.52977457672118], [55.90661661218259, 37.53503220370484], [55.90714113744566, 37.54042858064267], [55.905645048442985, 37.54320461007303], [55.906608607018505, 37.545686966066306], [55.90788552162358, 37.54743976120755], [55.90901557907218, 37.55796999999999], [55.91059395704873, 37.572711542327866], [55.91073854155573, 37.57942799999998], [55.91009969268444, 37.58502865872187], [55.90794809960554, 37.58739968913264], [55.908713267595054, 37.59131567193598], [55.902866854295375, 37.612687423278814], [55.90041967242986, 37.62348079629517], [55.898141151686396, 37.635797880950896], [55.89639275532968, 37.649487626983664], [55.89572360207488, 37.65619302513125], [55.895295577183965, 37.66294133862307], [55.89505457604897, 37.66874564418033], [55.89254677027454, 37.67375601586915], [55.8947775867987, 37.67744661901856], [55.89450045676125, 37.688347], [55.89422926332761, 37.69480554232789], [55.89322256101114, 37.70107096560668], [55.891763491662616, 37.705962965606716], [55.889110234998974, 37.711885134918205], [55.886577568759876, 37.71682005026245], [55.88458159806678, 37.7199315476074], [55.882281005794134, 37.72234560316464], [55.8809452036196, 37.72364385977171], [55.8809722706006, 37.725371142837474], [55.88037213862385, 37.727870902099546], [55.877941504088696, 37.73394330422971], [55.87208120378722, 37.745339592590376], [55.86703807949492, 37.75525267724611], [55.859821640197474, 37.76919976190188], [55.82962968399116, 37.827835219574], [55.82575289922351, 37.83341438888553], [55.82188784027888, 37.83652584655761], [55.81612575504693, 37.83809213491821], [55.81460347077685, 37.83605359521481], [55.81276696067908, 37.83632178569025], [55.811486181656385, 37.838623105812026], [55.807329380532785, 37.83912198147584], [55.80510270463816, 37.839079078033414], [55.79940712529036, 37.83965844708251], [55.79131399999368, 37.840581150787344], [55.78000432402266, 37.84172564285271]]];