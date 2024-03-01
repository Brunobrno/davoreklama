$('html').click(function (e) {
    // dch = document click hide
    var target = e.target;

    if (
        !$(target).parents('[data-toggle].active').length &&
        !$(target).parents('.toggle-el.dch').length &&
        !$(target).parents('.cs-wrapp').length
    ) {
        $('.toggle-el.active.dch,.dropdown.active.dch').each(function () {
            if (!($(this) === e.target) && !$(e.target).closest('.dropdown.active.dch').length) {
                Toggle('#' + $(this).attr('id')).hide();
            }
        });
    }
});

$(document).on('click', '.modal-close:not([data-toggle="modal"])', function (e) {
    e.preventDefault();
    var modal = $(this).closest('.modal');
    Toggle('#' + $(modal).attr('id')).hide('modal');
});

$(document).on('click', '[data-toggle]', function (e) {
    //e.preventDefault();
    //e.stopPropagation();

    if($(e.target).hasClass('disabled'))
        return;

    var targetSelector = $(this).attr('data-target');
    if(typeof targetSelector == 'undefined')
        targetSelector = $(this).attr('href');

    var toggleType = $(this).attr('data-toggle');
    Toggle(targetSelector, toggleType, $(this));
});
$(document).on('change', '[data-toggle=selectContent]', function (e) {
    //e.preventDefault();
    var targetSelector = $(this).attr('data-target');
    var toggleType = $(this).attr('data-toggle');
    Toggle(targetSelector, toggleType, $(this));
});


var Toggle = function (targetSelector, toggleType, clickedEl) {
    if (!(this instanceof Toggle)) {
        return new Toggle(targetSelector, toggleType, clickedEl);
    }
    this.openedClass = 'active';
    this.wrapOpenedClass = 'opened';
    this.targetSelector = targetSelector;
    this.target = $(this.targetSelector);
    this.toggleType = toggleType;
    this.clickedEl = clickedEl;
    if(typeof this.clickedEl == 'undefined') {
        this.clickedEl = $('[data-toggle][data-target="'+this.targetSelector+'"]').first();
    }

    this.animate = false;
    if (typeof this.target !== 'undefined') {
        this.init();
    }
};


Toggle.prototype = {

    init: function () {
        this.getAction();
        this.toggle();
    },
    toggle: function () {

        switch (this.toggleType) {
            case 'cssToggle':
                this.cssToggle();
                this.clickedElClass();
                break;
            case 'collapse':
                this.collapse();
                this.clickedElClass();
                break;
            case 'tab':
                this.tab();
                break;
            case 'show':
                this.show();
                break;
            case 'dropdown':
                this.dropdown();
                this.clickedElClass();
                break;
            case 'modal':
                this.modal();
                //this.clickedElClass();
                break;
            case 'ajaxModal':
                this.ajaxModal();
                //this.clickedElClass();
                break;
            case 'selectContent':
                this.selectContent();
                break;
        }

    },

    dropdown: function () {
        var self = this;
        var toggleWrapp = this.target.closest('.toggle-wrapp');
        if (this.action === 'show') {
            if($(this.target).hasClass('dynamic-position'))
                this.countDropdownPosition();

            this.target.show(0, function () {
                self.target.addClass(self.openedClass);
            });
            if(typeof toggleWrapp !== 'undefined')
                toggleWrapp.addClass(self.wrapOpenedClass);
        }
        else {
            this.target.hide(0, function () {
                self.target.removeClass(self.openedClass);
            });
            if(typeof toggleWrapp !== 'undefined')
                toggleWrapp.removeClass(self.wrapOpenedClass);
        }
    },
    show: function () {
        if (!this.clickedEl.hasClass(this.openedClass)) {
            var group = this.target.attr('data-group');
            var self = this;
            $(document).find('[data-group="' + group + '"].toggle-show-el').each(function () {
                $(this).hide(0, function () {
                    $(this).removeClass(self.openedClass);
                });
                var id = $(this).attr('id');
                $('[data-toggle=show][data-target="#' + id + '"]').removeClass(self.openedClass);
                $('[data-toggle=show][href="#' + id + '"]').removeClass(self.openedClass);
            });
            this.target.show(0, function () {
                $(this).addClass(self.openedClass);
            });
            this.clickedElClass();
        }

    },
    selectContent: function() {
        var selectName = this.clickedEl.attr('name');
        var value = this.clickedEl.val();

        var groupName = "select-"+selectName;
        var targetId = selectName+'-'+value;

        $('[data-group='+groupName+']').each(function(){
           $(this).hide();
        });

        $('#'+targetId+'[data-group='+groupName+']').show();
    },
    tab: function () {
        if (!this.clickedEl.hasClass(this.openedClass)) {
            var tabsWrapp = this.target.closest('.tabs');
            var self = this;
            tabsWrapp.find('.tab.active').each(function () {
                if (self.animate) {
                    $(this).slideUp('fast', function () {
                        $(this).removeClass('active');
                    });
                }
                else {
                    $(this).hide(0, function () {
                        $(this).removeClass('active');
                    });
                }
                var id = $(this).attr('id');
                $('[data-toggle=tab][data-target="#' + id + '"]').removeClass('active');
            });
            if (this.animate) {
                this.target.slideDown('fast', function () {
                    $(this).addClass('active');
                });
            }
            else {
                this.target.show(0, function () {
                    $(this).addClass('active');
                });
            }
            this.clickedElClass();
        }
    },
    collapse: function () {
        var self = this;
        var toggleWrapp = this.target.closest('.toggle-wrapp');
        if (this.action === 'show') {
            this.target.slideDown('fast', function () {
                self.target.addClass(self.openedClass);
                if(typeof toggleWrapp !== 'undefined')
                    toggleWrapp.addClass(self.wrapOpenedClass);
            });
        }
        else {
            this.target.slideUp('fast', function () {
                self.target.removeClass(self.openedClass);
                if(typeof toggleWrapp !== 'undefined')
                    toggleWrapp.removeClass(self.wrapOpenedClass);
            });
        }
    },
    cssToggle: function () {
        if (this.action === 'show')
            this.target.addClass(this.openedClass);
        else
            this.target.removeClass(this.openedClass);
    },
    modal: function () {

        var modalWrapp = $(this.target).closest('.modals');
        if (this.action === 'show') {
            if (modalWrapp.css('display') === 'none') {
                this.showModalWrapp(modalWrapp);
                this.showModal(this.target);
            }
            else {
                this.showModal(this.target);
            }
            $(document).trigger('modal.open');
        }
        else {
           this.hideModal();
        }
    },

    showModal: function(modal) {
        var self = this;
        this.hideModalGroupContents(modal);
        modal.removeClass('animated');


        if(modal.find('.modal-animate-content').length) {
            modal.show(0, function () {
                var modalAnimateContent = $(this).find('.modal-animate-content');
                modal.addClass(self.openedClass);
                modalAnimateContent.addClass('animated').addClass('zoomInDown');
            });
        }
        else
            modal.show(0, function () {
                modal.addClass(self.openedClass);
                modal.addClass('zoomInDown').addClass('animated').removeClass('animate');
            });
    },
    hideModalGroupContents: function(modal) {
        var group = modal.attr('data-group');
        var self = this;
        if(typeof group !== 'undefined') {
            $('.modal[data-group="'+group+'"]').each(function(){
                self.hideModal($(this));
            });
        }
    },
    showModalWrapp: function (modalWrapp) {
        modalWrapp.fadeIn(200, function () {
            modalWrapp.addClass('active');
        });
    },
    hideModal: function(modal) {

        if(typeof modal === 'undefined')
            modal = this.target;

        var modalWrapp = $(this.target).closest('.modals');

        var self = this;

        console.log('hide modal');

        if(modalWrapp.find('.modal.'+self.openedClass).length <= 1) {
            modalWrapp.fadeOut(200);
        }

        if(modal.find('.modal-animate-content').length) {
            var modalAnimateContent = modal.find('.modal-animate-content');
            modalAnimateContent.addClass('animated').addClass('zoomOutUp');
            setTimeout(function(){
                modal.hide().removeClass(self.openedClass);
                if(modal.hasClass('cloned'))
                    modal.remove();

            },200);
        }
        else
            modal.hide(0, function () {
                modal.removeClass(self.openedClass);
                modal.addClass('fadeOutUp').addClass('animated');

            });




        $(document).trigger('modal.hide');
    },
    showModalLoader: function (modal) {
        var modalContent = modal.find('.modal-content-main-wrapp');
        var modalLoader = $('<div>')
            .addClass('modal-loader')
            .html('<div class="loader absolute"><div class="loader-circle"></div></div>');
        modalContent.find('.ajax-wrapp').html(modalLoader);
    },
    hideModalLoader: function (modal) {
        modal.find('.modal-loader').fadeOut('fast', function () {
            $(this).remove();
        });
        modal.addClass('loaded');
    },
    ajaxModal: function () {
        if (this.action === 'show') {
            this.cloneModal();
            this.modal();
            this.showModalLoader(this.target);
            $(document).trigger('modal.opening');
            var self = this;
            this.ajaxLoadModalContent(this.target, function () {
                self.hideModalLoader(self.target);
                formInit();
                modalInit(self.target);
                $(document).trigger('modal.loaded');
            });
        }
    },
    ajaxLoadModalContent: function (modal, callback) {
        var modalAjaxContent = modal.find('.ajax-wrapp');
        var loadUrl = $(this.clickedEl).attr('data-url');
        var itemId = $(this.clickedEl).attr('data-id');

        $.ajax({
            url: loadUrl,
            type: 'POST',
            data: {
                _token: getCsrfToken(),
                item_ID: itemId
            }
        }).done(function (data) {
            var content = data.content;
            modalAjaxContent.html(content);
            if (typeof callback === 'function') {
                callback();
            }
        });
    },
    cloneModal: function() {
        var newTargetId = $(this.target).attr('id')+'-'+$.now();
        var newAjaxModal = $(this.target).clone();
            newAjaxModal.attr('id', newTargetId);
            newAjaxModal.addClass('cloned');

        this.targetSelector = '#'+newTargetId;
        var insertAfterModal = $(this.target).closest('.modals-wrapp').find('.modal.cloned').last();
        if(!insertAfterModal.length)
            insertAfterModal = this.target;

            insertAfterModal.after(newAjaxModal);
            this.target = $(this.targetSelector);
    },
    getAction: function () {
        this.action = 'show';
        if (this.target.hasClass(this.openedClass)) {
            this.action = 'hide';
        }
    },
    clickedElClass: function () {
        if (typeof this.clickedEl !== 'undefined') {

            if (this.action == 'show')
                this.clickedEl.addClass(this.openedClass);
            else
                this.clickedEl.removeClass(this.openedClass);
        }
    },
    hide: function (toggleType) {
        this.target = $(this.targetSelector);
        this.action = 'hide';
        var self = this;

        if(typeof toggleType == 'undefined')
            this.toggleType = $(this.clickedEl).attr('data-toggle');
        else
            this.toggleType = toggleType;


        var togglers = $('[data-toggle][data-target="' + this.targetSelector + '"]');
        if(togglers.length)
            togglers.each(function () {
                self.clickedEl = $(this);
                self.clickedElClass();
            });
        else {
            this.clickedEl = $('[data-toggle="' + this.toggleType + '"]');
            this.clickedElClass();
        }


        this.toggle();
    },
    countDropdownPosition: function(){
        var dropdown = $(this.target);
        var toggleWrapp = dropdown.closest('.toggle-wrapp');

        var dropdownHeight = dropdown.outerHeight();
        var dropdownWidth = dropdown.outerWidth();


    }

    //hideModals: function () {
    //    this.hideModalsWrapps();
    //    this.hideModalsContents();
    //    $(document).trigger('modal.close');
    //},
    //
    //showModalContent: function (modal, modalWrapp) {
    //    var self = this;
    //    this.hideModalGroupContents(modal);
    //    modal.removeClass('animated').addClass('animate');
    //    modal.show(0, function () {
    //        modal.addClass(self.openedClass);
    //        modal.addClass('slideInUp').addClass('animated').removeClass('animate');
    //    });
    //},
    //hideModalsContents: function (modalWrapp) {
    //    var self = this;
    //    searchEl = modalWrapp;
    //    if (typeof modalWrapp === 'undefined') {
    //        searchEl = $(document);
    //    }
    //
    //    searchEl.find('.modal'+this.openedClass).each(function () {
    //        $(this).hide(0, function () {
    //            $(this).removeClass(self.openedClass);
    //        });
    //    });
    //},
    //
    //hideModalGroupContents: function(modal) {
    //    var group = modal.attr('data-group');
    //    var self = this;
    //    if(typeof group !== 'undefined') {
    //        $('.modal[data-group="'+group+'"]').each(function(){
    //           self.hideModal($(this));
    //        });
    //    }
    //},
    //showModalWrapp: function (modalWrapp) {
    //    modalWrapp.show(0, function () {
    //        $(this).addClass('visible');
    //    });
    //},
    //hideModalsWrapps: function () {
    //    $(document).find('.modals-wrapp.visible').each(function () {
    //        $(this).hide(0, function () {
    //            $(this).removeClass('visible');
    //        });
    //    });
    //},

};