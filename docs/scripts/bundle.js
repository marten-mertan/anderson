/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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


/***/ })
/******/ ]);