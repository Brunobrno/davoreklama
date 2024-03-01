/**
 *
 * pausable timeout...
 *
 * @param func
 * @param millisec
 * @constructor
 */
var PausableTimeout = function (func, millisec) {

    if (!(this instanceof PausableTimeout)) {
        return new PausableTimeout(func, millisec);
    }

    this.func = func;
    this.stTime = new Date().valueOf();
    this.timeout = setTimeout(func, millisec);
    this.timeLeft = millisec;
    this.pause = function () {
        clearTimeout(this.timeout);
        var timeRan = new Date().valueOf() - this.stTime;
        this.timeLeft -= timeRan;
    };
    this.continue = function () {
        this.timeout = setTimeout(this.func, this.timeLeft);
        this.stTime = new Date().valueOf();
    };
};

var parseFileUploadHtml = function (html, file) {
    //var canvas = file.preview;
    //var dataURL = canvas.toDataURL();
    //html = html.replace(/%FILE_PATH%/g, dataURL);
    html = html.replace(/%FILE_NAME%/g, file.name);
    //html = html.replace(/%FILE_THUMBNAIL_PATH%/g, dataURL);
    return html;
};


var guid = function(){
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};


var getCsrfToken = function () {
    return $('meta[name="csrf-token"]').attr('content');
};

var initStyleSelect = function() {
    $('select.style-select').styleSelect();
};


$(document).ready(function () {



    $(document).tooltip({
        items: '.tooltip',
        content: function () {
            return (typeof $(this).attr('data-tooltip') !== 'undefined' ? $(this).attr('data-tooltip') : $(this).attr('title'));
        },
        show: null, // show immediately
        open: function(event, ui)
        {
            if (typeof(event.originalEvent) === 'undefined')
            {
                return false;
            }
            var $id = $(ui.tooltip).attr('id');
            $('div.ui-tooltip').not('#' + $id).remove();
        },
        close: function(event, ui)
        {
            ui.tooltip.hover(function()
                {
                    $(this).stop(true).fadeTo(400, 1);
                },
                function()
                {
                    $(this).fadeOut('400', function()
                    {
                        $(this).remove();
                    });
                });
        }
    });

    var slider = new Swiper ('#slider .swiper-container', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        // If we need pagination
        pagination: '#slider .swiper-pagination',
        paginationClickable: true,
        autoplay: 4000

    });

    var categorySlider = new Swiper('#category-thumbnails', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 'auto'
    });
    
    var categoryLightboxSelector = 'a[data-lightbox="category-lightbox"]';
    var categoryLightbox = $(categoryLightboxSelector).imageLightbox(
        {
            allowedTypes: 'png|jpg|jpeg|gif', // string;
            animationSpeed: 250, // integer;
            onStart: function() {
                overlayOn();
                closeButtonOn(categoryLightbox);
                arrowsOn(categoryLightbox, categoryLightboxSelector);
            },
            onEnd: function() {
                overlayOff();
                captionOff();
                closeButtonOff();
                arrowsOff();
                activityIndicatorOff();
            },
            onLoadStart: function() {
                captionOff();
                activityIndicatorOn();
            },
            onLoadEnd: function() {
                captionOn();
                activityIndicatorOff();
                $('.imagelightbox-arrow').css('display', 'block');
            }
        });

    
     var lightbox = $('a.image-lightbox').imageLightbox(
        {
            allowedTypes: 'png|jpg|jpeg|gif', // string;
            animationSpeed: 250, // integer;
            onStart: function() {
                overlayOn();
                closeButtonOn(lightbox);
            },
            onEnd: function() {
                overlayOff();
                captionOff();
                closeButtonOff();
                arrowsOff();
                activityIndicatorOff();
            },
            onLoadStart: function() {
                captionOff();
                activityIndicatorOn();
            },
            onLoadEnd: function() {
                captionOn();
                activityIndicatorOff();
                $('.imagelightbox-arrow').css('display', 'block');
            }
        });

    cookieAgreement();
    enableClone();
    initStyleSelect();
    initCalculation();
    initAsideClients();
    // initFixedFooter();
    // headerBg();
    initMenuOpener();

});

var initFixedFooter = function() {

    fixedFooter();
    $(window).resize(function(){
        fixedFooter();
    });

    $('.customer-orders-wrapp .tab-opener, [data-toggle="collapse"][data-target="#different_shipping_wrapp"]').on('click', function(){
    	setTimeout(function(){
    		$(window).resize();
    	}, 50);
    });

};

var headerBg = function() {
	var header = $('header#main-header');
	var bgHeaderClass = 'bg';
	var scrollOffset = 0;
	$(window).on('scroll', function() {
		if ($(window).scrollTop() > scrollOffset) {
			header.addClass(bgHeaderClass);
		} else {
			header.removeClass(bgHeaderClass);
		}
	});
};

var fixedFooter = function() {

    var footer = $('footer#main-footer');
    var site = $('body .site');
    site.css({'height': 'auto'});

    var viewportHeight = $(window).height();  

    setTimeout(function() {

    	var siteHeight = site.height();
	   	if(viewportHeight > siteHeight) {
	        site.height(viewportHeight);
	        footer.addClass('fixed');
	    }
	    else {
	        site.css({'height': 'auto'});
	        footer.removeClass('fixed');
	    }


    },50);


};


var initAsideClients = function() {

    $('aside .aside-clients-logo').each(function() {

        var asideClientsWrap = $(this).find('.clients-logo-wrap');

        var clientsLogoCount = asideClientsWrap.find('.client-logo').length;

        if(clientsLogoCount == 0 || clientsLogoCount == 1)
            return;

        setInterval(function(){

            var activeClient = asideClientsWrap.find('.client-logo.active');

            var nextActiveClient = activeClient.next('.client-logo');
            if(!nextActiveClient.length)
                nextActiveClient = asideClientsWrap.find('.client-logo').first();


            activeClient.animate({
                opacity: 0
            }, 1000, function(){
                activeClient.hide();
                activeClient.removeClass('active');
                nextActiveClient.addClass('active');
                nextActiveClient.css({opacity: 0}).show().animate({
                    opacity: 1
                }, 1000);
            });

        }, 5000);

    });
};



var initCalculation = function() {
    
    var calcTable = $('#calc-table');
    if(!calcTable.length)
        return;


    var width = calcTable.find('input[name="width"]');
    var height = calcTable.find('input[name="height"]');
    var weight = calcTable.find('input[name="weight"]');
    var count = calcTable.find('input[name="count"]');

    
    var resultValue = calcTable.find('.calc-table-row-result-value');

    countCalculation(width,height,weight,count,resultValue);

    calcTable.find('input').on('change', function() {
        countCalculation(width,height,weight,count,resultValue);
    });

    calcTable.find('.count-button').on('click', function() {
        countCalculation(width,height,weight,count,resultValue);
    });




    calcTable.find('.size-button').on('click', function(){

        var widthVal = $(this).attr('data-width');
        var heightVal = $(this).attr('data-height');

        width.val(widthVal);
        height.val(heightVal);
        width.change();

    });



    calcTable.find('.weight-button').on('click', function(){

        var weightVal = $(this).attr('data-weight');

        weight.val(weightVal);
        weight.change();

    });


};

var countCalculation = function(width,height,weight,count,resultValue) {

    var inputs = [width,height,weight,count];
    $.each(inputs,function(key, input){

        var inputMin = $(input).attr('data-min');
        if(typeof inputMin == 'undefined')
            inputMin = 0;
        inputMin = parseInt(inputMin);


        var inputMax = $(input).attr('data-max');
        if(typeof inputMax == 'undefined')
            inputMax = 999999999999999999;
        inputMax = parseInt(inputMax);

        if(input.val() < inputMin)
            input.val(inputMin);
        else if(input.val() > inputMax)
            input.val(inputMax);

    });


    
    var size = width.val() * height.val() / 1000000;
    var weight = weight.val() / 1000;
    var count = count.val();

    var result = size * weight * count;
    resultValue.html(result.toFixed(3));

};




var enableClone = function() {

    //$(document).on('click','[data-action="clone"]', function(){
    //
    //    var target = $($(this).attr('data-target'));
    //    var cloneItem = $(this).closest('.price-params-clone');
    //
    //    var cloned = cloneItem.clone();
    //        cloned.removeAttr('id');
    //        cloned.find('input:not([type="hidden"])').val('');
    //    cloneItem.find('.hide-after-clone').hide();
    //    cloneItem.find('.show-after-clone').show();
    //
    //    var lastClone = target.find('.price-params-clone').last();
    //    var lastIndex = lastClone.attr('data-index');
    //    var index = parseInt(lastIndex) + 1;
    //    cloned.attr('data-index',index);
    //
    //        cloned.find('[name^=price_param]').each(function(){
    //            var name = $(this).attr('name');
    //            var newName = name.replace('price_param['+lastIndex+']','price_param['+index+']');
    //            $(this).attr('name',newName);
    //        });
    //
    //    target.append(cloned);
    //
    //});
    //
    //$(document).on('click','[data-action="remove-clone"]', function(e){
    //    $(this).closest('.price-params-clone').slideUp('fast', function(){
    //        $(this).remove();
    //    });
    //});


};

var cookieAgreement = function(){
    var cookieWrapp = $('#cookie-info');
    cookieWrapp.find('[data-action="cookie-agree"]').on('click', function(){
        var name = 'davo1_cookie';
        var value = 'true';
        var days = 365;
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
        document.cookie = name+"="+value+expires+"; path=/";
        cookieWrapp.slideUp('fast', function(){
            $(this).remove();
        });
    });
};


var initMenuOpener = function() {

	var menuOpener = $('#menu-opener');
	var menu = $('#menu');
	var header = $('#main-header');

 	menuOpener.on('click', function(e) {
			if(menu.hasClass('opened')) {
				menu.slideUp('fast');
				menu.removeClass('opened');
				menuOpener.removeClass('opened');
				header.removeClass('opened-menu');
			} else {
				menu.slideDown('fast');
				menu.addClass('opened');
				menuOpener.addClass('opened')
				header.addClass('opened-menu');
			}
	});

};