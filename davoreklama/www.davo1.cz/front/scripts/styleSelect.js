;
(function ($) {

    $.fn.styleSelect = function (callback) {

        $(this).each(function () {
            StyleSelect($(this));
        });

    };

})(window.jQuery || window.Zepto);


var StyleSelect = function (select) {
    if (!(this instanceof StyleSelect)) {
        return new StyleSelect(select);
    }

    this.select = select;
    this.multiple = $(this.select).prop('multiple');
    this.readonly = typeof $(this.select).attr('readonly') !== 'undefined' && $(this.select).attr('readonly') == 'readonly' ? true : false;

    if($(this.select).hasClass('style-select-initiated'))
        return;

    $(this.select).addClass('style-select-initiated');

    this.selectName = $(this.select).attr('name');
    this.selectId = $(this.select).attr('id');
    if(typeof this.selectId == 'undefined') {
        this.selectId = this.guid();
        $(this.select).attr('id',this.selectId);
    }
    this.selectSelector = '#'+this.selectId;

    this.styledSelectId = this.guid();
    this.styledSelectSelector = '#'+this.styledSelectId;
    this.styledSelectResultsId = 'cs-results-'+this.styledSelectId;

    this.idPrefix = 'cs-';
    this.selectedClass = 'checked';
    this.openedClass = 'active';

    this.updatedScrollbar = false;
    this.applySearch = typeof $(this.select).attr('data-style-select-search') != 'undefined' && $(this.select).attr('data-style-select-search') == 'true' ? true : false;

    this.init();


};


StyleSelect.prototype = {

    init: function() {
        this.createStyleSelect();
        this.initHandlers();
    },
    createStyleSelect: function() {

        // new select active element
        this.activeOption = $('<div/>', {
            class: 'cs-active-option'
        });
        $(this.activeOption).attr('data-select-target', this.selectSelector);
        $(this.activeOption).attr('data-target', this.styledSelectSelector);
        this.activeSelectTitle();
        $(this.select).hide();
        $(this.select).after($(this.activeOption));

        this.styledSelect = $('<div/>',{
             'class': 'cs-wrapp',
            'id': this.styledSelectId
        });
        this.styleSelectContent = $('<div/>', {
            'class': 'cs-content'
        });
        this.styleSelectList = $('<ul/>', {
            'class': 'cs-results',
            'id': this.styledSelectResultsId
        });

        var self = this;


        $(this.select).find('option').each(function(){

            var newSelectOptionHtml = $(this).attr('data-html');
            if (typeof newSelectOptionHtml === 'undefined') {
                newSelectOptionHtml = $(this).html();
            }

            var selectOptionWrapp = $('<li/>', {
                class: 'cs-option',
                'data-filter-val': newSelectOptionHtml
            });

            if(typeof $(this).attr('disabled') !== 'undefined')
                selectOptionWrapp.addClass('disabled');

            var newSelectOptionLabel = $('<span/>', {'class': 'label'});
            newSelectOptionLabel.attr('data-val', $(this).val());
            newSelectOptionLabel.html(newSelectOptionHtml);


            if ($(this).prop('selected')) {
                newSelectOptionLabel.addClass(self.selectedClass);
            }

            selectOptionWrapp.append(newSelectOptionLabel);

            $(self.styleSelectList).append(selectOptionWrapp);

        });


        $(this.styleSelectContent).append($(this.styleSelectList));
        $(this.styledSelect).append($(this.styleSelectContent));
        $(this.styledSelect).hide();
        $('body').append($(this.styledSelect));



        // $(this.styleSelectList).perfectScrollbar({
        //     height: '',
        //     railOpacity: 0.9
        // });
        // $(this.styleSelectList).css({'overflow': 'hidden'});
        this.styleSelectSearch();

    },
    styleSelectSearch: function(){
        if(!this.applySearch)
            return;


        var self = this;
        var searchInput = $('<input/>', {
            'placeholder': 'Hledej...'
        });
        var searchWrapp = $('<div/>', {
            'class' : 'cs-filter'
        });
            searchWrapp.append(searchInput);

        $(this.styleSelectContent).find('.cs-results').before(searchWrapp);

        searchInput.on('change keyup', function(){
            var regex = new RegExp($(this).val(), 'g');
            var tmpOptions = $('#'+self.styledSelectResultsId+'');
            var matched = tmpOptions.find('.cs-option').filter(function(){
                return $(this).attr('data-filter-val').match(regex);
            });
            matched.addClass('new-found-cs-result').removeClass('cs-hidden-result');
            tmpOptions.find('.cs-option:not(.new-found-cs-result)').addClass('cs-hidden-result');
            tmpOptions.find('.new-found-cs-result').removeClass('new-found-cs-result');
        });

    },
    activeSelectTitle: function() {
        var activeTitleStr = '';
        $(this.select).find('option:selected').each(function () {
            var append = typeof $(this).attr('data-html') !== 'undefined' && $(this).attr('data-html') !== '' ? $(this).attr('data-html') : $(this).html();
            activeTitleStr += activeTitleStr == '' ? '' : ', ';
            activeTitleStr += append.trim().replace(/&nbsp;/gi, '');
        });
        $(this.activeOption).html(activeTitleStr);
    },
    toggleStyledSelect: function() {

        if($(this.styledSelect).hasClass(this.openedClass))
            this.hideSelect();
        else
            this.showSelect();

    },
    hideSelect: function(exceptThis) {
        var self = this;

        if($(this.styledSelect).is($(exceptThis)))
            return;

        // $(this.styleSelectList).css({'overflow': 'hidden'});
        $(this.activeOption).removeClass(this.openedClass);       
        $(this.styledSelect).slideUp('fast', function(){
            $(this).removeClass(self.openedClass);
        });
    },
    showSelect: function() {
        var self = this;
        this.setPosition();
        $(this.activeOption).addClass(this.openedClass);       
        $(this.styledSelect).slideDown('fast', function(){
            $(this).addClass(self.openedClass);
            if(!self.updatedScrollbar)
                $(self.styleSelectList).perfectScrollbar('update');
            self.updatedScrollbar = true;
            // $(self.styleSelectList).css({'overflow': 'auto'});
        });
    },
    selectOption: function(clickedLabel) {

        var optionVal = $(clickedLabel).attr('data-val');

        if(!$(this.select).prop('multiple')){
            this.hideSelect();
            if($(this.select).find('option:selected').val() == optionVal)
                return;
            else {
                $(this.select).find('option:selected').prop("selected", false);
                $(this.styledSelect).find('.label.'+this.selectedClass).removeClass(this.selectedClass);
                $(this.select).val('');
            }
        }

        var option = $(this.select).find('option[value="' + optionVal + '"]');
        if (option.is(':selected')) {
            option.prop("selected", false);
            clickedLabel.removeClass(this.selectedClass);
        }
        else {
            option.prop("selected", true);
            clickedLabel.addClass(this.selectedClass);
        }

        $(this.select).trigger('change');
        this.activeSelectTitle();
    },

    initHandlers: function() {
        var self = this;

        $(document).on('click', function(e){
            if(!$(e.target).parents('.cs-wrapp').length && !$(e.target).parents('.cs-active-option').length && !$(e.target).hasClass('cs-active-option')) {
                self.hideSelect();
            }
        });

        $(this.activeOption).on('click', function(){
            var selectTarget = $(this).attr('data-select-target');
            $(document).find('.cs-active-option.active:not([selectTarget="'+selectTarget+'"])').trigger('close');
            if(!self.readonly) {
                self.toggleStyledSelect();
            }
        });


        $(this.activeOption).on('close', function(){
            if(!self.readonly) {
                self.toggleStyledSelect();
            }
        });


        $(this.styledSelect).find('.label').on('click', function(){

            if($(this).closest('.cs-option').hasClass('disabled'))
                return;

            self.selectOption($(this));
        });


        $(document).on('ps-scroll-x, ps-scroll-y', function(e){
            self.hideSelect($(e.target).closest('.cs-wrapp'));
        });

    },

    setPosition: function() {

        var anchor = $(this.activeOption);

        var width = parseInt($(anchor).outerWidth());
        var top = parseInt($(anchor).offset().top) + parseInt($(anchor).outerHeight());
        var left = parseInt($(anchor).offset().left);
        var bottom = 'auto';
        
        var doc = document.documentElement;
//        var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        var docScrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

        var scrollTop = parseInt($(anchor).offset().top) + parseInt($(anchor).outerHeight()) - docScrollTop; // position relative to top of window
        var windowHeight = parseInt($(window).height());
        var maxHeight = windowHeight - scrollTop;



        var minHeight = 200;
        if(maxHeight < minHeight) {
            maxHeight = scrollTop - parseInt($(anchor).outerHeight());
            top = 'auto';
            bottom = windowHeight - parseInt($(anchor).offset().top);
        }



        $(this.styledSelect).css({
            'position': 'absolute',
            'width': width,
            'top': top,
            'bottom': bottom,
            'left': left,
            'max-height': maxHeight
        });
        $(this.styleSelectList).css({
            'max-height': maxHeight
        });


    },


    guid: function(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

};
