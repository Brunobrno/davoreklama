var ProductsFilter = function(data) {
    if (!(this instanceof ProductsFilter)) {
        return new ProductsFilter(data);
    }

    if(typeof data.url == 'undefined')
        return;


    this.url = data.url;
    this.filterForms = typeof data.filterForms != 'undefined' ? data.filterForms : null;
    this.productsWrapp = typeof data.productsWrapp != 'undefined' ? data.productsWrapp : null;
    this.paramsList = typeof data.paramsList != 'undefined' ? data.paramsList : null;
    this.priceParamsList = typeof data.priceParamsList != 'undefined' ? data.priceParamsList : null;
    this.optionalProducts = typeof data.optionalProducts != 'undefined' ? data.optionalProducts : null;
    this.productParamsFilterModal = typeof data.productParamsFilterModal != 'undefined' ? data.productParamsFilterModal : null;

    this.init();
};
ProductsFilter.prototype = {

    init: function(){
        this.initFilters();
        this.initClone();
    },
    initClone: function(){

        var self = this;

        $(document).on('click','[data-action="clone"]', function(){

            var target = $($(this).attr('data-target'));
            var cloneItem = $(this).closest('.price-params-clone');

            var cloned = cloneItem.clone();
            cloned.removeAttr('id');
            cloned.find('input:not([type="hidden"])').val('');
            cloneItem.find('.hide-after-clone').hide();
            cloneItem.find('.show-after-clone').show();

            var lastClone = target.find('.price-params-clone').last();
            var lastIndex = lastClone.attr('data-index');
            var index = parseInt(lastIndex) + 1;
            cloned.attr('data-index',index);

            cloned.find('[name^=price_param]').each(function(){
                var name = $(this).attr('name');
                var newName = name.replace('price_param['+lastIndex+']','price_param['+index+']');
                $(this).attr('name',newName);
            });

            target.append(cloned);
            self.initFilters();

        });

        $(document).on('click','[data-action="remove-clone"]', function(e){
            $(this).closest('.price-params-clone').slideUp('fast', function(){
                $(this).remove();
            });
        });


    },
    initFilters: function(){
        var self = this;
        if(this.filterForms) {
            $(this.filterForms).each(function(){
                var form = $(this);
                var formId = form.attr('id');
                var rangeMin = 30;
                var rangeMax = 100 * 100;
                $('input[form="'+formId+'"],textarea[form="'+formId+'"],select[form="'+formId+'"]').off('change').on('change', function(){

                        if($(this).hasClass('range')) {
                            var inputMin = parseInt($(this).attr('data-min'));
                            if(typeof inputMin == 'undefined')
                                inputMin = rangeMin;
                            inputMin = parseInt(inputMin);
                            if($(this).val() < inputMin) {
                                $(this).val(inputMin);
                                $(this).prev('input').val(inputMin);
                            }
                            else if($(this).val() > rangeMax) {
                                $(this).val(rangeMax);
                                $(this).prev('input').val(rangeMax);
                            }


                        }
                        var rangesSum = 1;
                        $(this).closest('.price-param').find('input[form="'+formId+'"].range').each(function(){
                            var value = $(this).val();
                                value = value.replace(',','.');
                            rangesSum *= value / 100;
                        });
                    var rangesLength = $('input[form="'+formId+'"].range').length;

                    // if(rangesSum < 1) {
                    //         // alert('Minimální velikost je 5m2');
                    //         rangesSum = 1;
                    //
                    //         var rangeKey = 0;
                    //         var rangesSubSum = 1;
                    //         $('input[form="'+formId+'"].range').each(function() {
                    //             rangeKey++;
                    //             if(rangeKey == rangesLength) {
                    //                 var rangeVal = 1 / rangesSubSum * 100;
                    //                 $(this).val(rangeVal);
                    //                 $(this).prev('input').val(rangeVal);
                    //             }   else {
                    //                 rangesSubSum *= $(this).val() / 100;
                    //             }
                    //         });
                    //
                    //     }
                        $(this).closest('.price-param').find('.ranges-sum[data-form="'+formId+'"]').html(rangesSum.toFixed(2));


                        self.filterProducts(function (self, data) {
                            if (self.paramsList) {
                                $(self.paramsList).html(data.paramsList);
                                self.initFilters();
                            }
                            if (self.productsWrapp) {
                                $(self.productsWrapp).html(data.productsList);
                            }
                            initStyleSelect();
                        });
                        $(this).addClass('filter-initiated');
                });
            });
        }
    },
    initRanges: function(form){

        var formId = form.attr('id');

        $('input.range[form="'+formId+'"]:not(.range-initiated)').each(function(){
            var input = $(this);
            var nextInput = $('<input/>');
                nextInput.val(input.val()*100);
            input.hide().before(nextInput);
            nextInput.on('change', function(){
                var newVal = $(this).val()/100;
                input.val(newVal).trigger('change');
            });

            input.addClass('range-initiated');
        });
    },


    filterProducts: function(formSendCallback) {

        this.toggleProductParamsFiltertModal();

        var self = this;

        var filterData = $(this.filterForms).serialize();
        filterData = filterData.replace(/%5B/g,"[");
        filterData = filterData.replace(/%5D/g,"]");

        $.ajax({
            type: 'POST',
            url: self.url,
            data: filterData
        }).done(function (data) {
            if (data.status === 'success') {
                if(typeof formSendCallback == 'function')
                    formSendCallback(self,data);
            }
            self.toggleProductParamsFiltertModal();
        });


    },

    reloadProduct: function(productId) {

        var filterData = $(this.filterForms).serialize();
        filterData = filterData.replace(/%5B/g,"[");
        filterData = filterData.replace(/%5D/g,"]");

        filterData = filterData + '&product_ID='+productId;

        // handle optional products
        if(this.optionalProducts != null) {
            var optionalProductsSelector = this.optionalProducts;
                optionalProductsSelector = optionalProductsSelector.replace('PRODUCT_ID', productId);
            var optionalProducts = $(optionalProductsSelector);
            optionalProducts.each(function(){
               if($(this).is(':checked')){

                   filterData = filterData+'&optional_products[]='+$(this).val();

               }
            });
        }

        $.ajax({
            type: 'POST',
            url: this.url,
            data: filterData
        }).done(function (data) {
            if (data.status === 'success') {

                var product = $('#product_'+productId);
                    product.replaceWith($(data.productsList));

            }
        });


    },

    refreshProduct: function(productId) {

        this.reloadProduct(productId);

    },
    toggleProductParamsFiltertModal: function(){
        if(this.productParamsFilterModal) {
            Toggle('#' + $(this.productParamsFilterModal).attr('id'),'modal');

        }
    }
};

/**
 *
 * order object
 *
 * @returns {Order}
 * @constructor
 */

var Order = function (data) {
    if (!(this instanceof Order)) {
        return new Order(data);
    }

    this.url = data.url;

    this.form = data.form;
    var formId = $(this.form).attr('id');

    this.formWrapp = data.formWrapp;

    this.sendOrderButton = data.sendOrderButton;

    this.orderItemsWrapps = typeof data.orderItemsWrapps != 'undefined' ? data.orderItemsWrapps : null;
    this.orderAmounts = typeof data.orderAmounts != 'undefined' ? data.orderAmounts : null;
    this.orderItemsQty = typeof data.orderItemsQty != 'undefined' ? data.orderItemsQty : null;

    this.productAddToCartModal = typeof data.productAddToCartModal != 'undefined' ? data.productAddToCartModal : null;
    this.optionalProductsSelector = typeof data.optionalProducts != 'undefined' ? data.optionalProducts : null;
    this.cartOptionalProducts = typeof data.cartOptionalProducts != 'undefined' ? data.cartOptionalProducts : null;

    this.shippingItemSelector = typeof data.shipping != 'undefined' ? data.shipping+'[form="'+formId+'"]' : null;
    this.paymentItemSelector = typeof data.paymentItem != 'undefined' ? data.paymentItem+'[form="'+formId+'"]' : null;

    this.ajaxProcessOrder = typeof data.ajaxProcessOrder != 'undefined' ? data.ajaxProcessOrder : true;
    this.discountCode = typeof data.discountCode != 'undefined' ? data.discountCode : null;

    this.optionalProducts = [];

    this.init(data);
};
Order.prototype = {
    init: function (data) {
        this.loadData(data);
        this.initTriggers();
    },
    loadData: function (data) {
        // if (typeof data != 'undefined')
        //     console.log('data not undefined');
        // else
        //     console.log('data undefined');
    },
    addItem: function (data, callback) {
        this.orderItemRequest(data, 'add', function (self, data) {
            self.requestDoneChange(data);
            self.showProductAddToCartModal();
            if(typeof callback == 'function')
                callback();
        });
    },
    changeItemQty: function (data) {
        this.orderItemRequest(data, 'change_qty', function (self, data) {
            self.requestDoneChange(data);
            location.reload();
        });
    },
    removeItem: function (data) {
        this.orderItemRequest(data, 'remove', function (self, data) {
            self.requestDoneChange(data);
            location.reload();
        });
    },
    changePayment: function (data) {
        this.orderItemRequest(data, 'changePayment', function (self, data) {
            self.requestDoneChange(data);
        });
    },
    setOptionalProducts: function (data) {
        this.orderItemRequest(data, 'setOptionalProducts', function (self, data) {
            self.requestDoneChange(data);
        });
    },
    checkDiscountCode: function(code) {
        var data = {
            'discount_code' : code
        };
        var self = this;
        this.orderItemRequest(data, 'checkDiscountCode', function (self, data) {
            var messageWrapp = $(self.discountCode).closest('.input').next('.discount-code-message');
            var message = data.message.title;
            messageWrapp.html(data.message.title);
            self.changeAmounts(data);
        });
    },
    getDiscountCode: function() {
        return $(this.form).find('[name="discount_code"]').val();
    },
    shipping: function(){

        if(this.shippingItemSelector) {
            //var shipping = $(this.shippingItemSelector+':checked');
            var shipping = $(this.shippingItemSelector);
            return shipping.val();
        }

        return null;

    },
    payment: function(){

        if(this.paymentItemSelector) {
            //var shipping = $(this.shippingItemSelector+':checked');
            var payment = $(this.paymentItemSelector+':checked');
            return payment.val();
        }

        return null;

    },
    reload: function(callback) {
        this.orderItemRequest(null, 'reload', function (self, data) {
            self.requestDoneChange(data, callback);
        });
    },
    initTriggers: function () {
        var self = this;

        if(this.ajaxProcessOrder || true) {
            $(this.form).on('submit', function (e) {
                e.preventDefault();

                if($(this).valid()) {
                    var button = $('button[name="save"][form="' + $(this).attr('id') + '"]');
                    self.loadingButton(button);
                    self.processForm();
                }

            });
        }


        $(document).on('click', '.add-to-cart', function (e) {
            var itemId = $(this).attr('data-id');
            var itemType = $(this).attr('data-type');

            var button = $(this);
            self.loadingButton(button);

            var qty = 1;
            var qtyInput = $('input[name="add-to-cart-qty"]');
            if(qtyInput.length)
                qty = qtyInput.val();

            var optionalProductsArr = [];
            if(self.optionalProductsSelector != null) {
                var optionalProductsSelector = self.optionalProductsSelector;
                    optionalProductsSelector = optionalProductsSelector.replace('PRODUCT_ID', itemId);
                var optionalProducts = $(optionalProductsSelector);
                    optionalProducts.each(function(){
                        if($(this).is(':checked')) {
                            optionalProductsArr.push($(this).val());
                        }
                    });
            }

            var orderItemData = {
                item_ID: itemId,
                item_type: itemType,
                optional_products: optionalProductsArr,
                item_qty: qty
            };

            self.addItem(orderItemData, function() {
                self.hideLoadingButton(button);
            });
        });
        $(document).on('click', '.change-item-qty', function (e) {
            var itemHash = $(this).attr('data-hash');
            var itemQtyChange = $(this).attr('data-qty-change');

            var orderItemData = {
                item_hash: itemHash,
                item_qty: itemQtyChange
            };

            self.changeItemQty(orderItemData);
        });
        $(document).on('click', '.remove-item', function (e) {
            var itemHash = $(this).attr('data-hash');

            var orderItemData = {
                item_hash: itemHash,
                item_qty: 0
            };

            self.removeItem(orderItemData);
        });

        if(this.cartOptionalProducts !== null) {
            $(this.cartOptionalProducts).on('click', function(){
                var orderData = {
                    payment_ID: self.payment()
                };
                self.changePayment(orderData);
            });
        }




        // $(document).on('change', $(this.paymentItemSelector), function (e) {
        //     var orderData = {
        //         payment_ID: self.payment()
        //     };
        //     self.changePayment(orderData);
        // });
              $(this.paymentItemSelector).on('change', function (e) {
            var orderData = {
                payment_ID: self.payment()
            };
            self.changePayment(orderData);
        });

        if(this.discountCode != null) {
            $(this.discountCode).on('change', function(){
                self.checkDiscountCode($(this).val());
            });
        }






    },
    orderItemRequest: function (orderItemData, action, callback) {
        orderItemData.action = action;
        this.processRequest(orderItemData, this.url, callback);
    },
    clearForm: function() {

        if(this.orderItemsWrapp != null)
            $(this.orderItemsWrapp).html('');
        if(this.orderTotalPrice != null)
            $(this.orderTotalPrice).html('');



        var formId = $(this.form).attr('id');
        $('input[type="radio"][form="'+formId+'"]:checked').each(function(){
            $(this).prop('checked',false);
        });
        $(this.formWrapp).find('input,textarea').each(function(){
           $(this).val('').trigger('change');
        });
    },
    processForm: function() {
        var formData = $(this.form).serialize();
        var url = $(this.form).attr('action');
        this.processRequest(formData, url, function(self, data){
            if(data.status == 'success') {
                if(typeof data.redirectTo != 'undefined')
                    window.location.replace(data.redirectTo);
            }

            showNotification(data.message);
        });
    },
    processRequest: function (data, processUrl, callback) {

        var self = this;
        self.optionalProducts = [];
        $(self.cartOptionalProducts).each(function () {
            if ($(this).is(':checked'))
                self.optionalProducts.push($(this).val());
        });


        data['optional_products'] = this.optionalProducts;
        data['shipping'] = this.shipping();
        data['discount_code'] = this.getDiscountCode();

        if($('form#pff1').length) {
            var pff1Data = $('form#pff1').serialize();
            pff1Data = pff1Data.replace(/%5B/g,"[");
            pff1Data = pff1Data.replace(/%5D/g,"]");
            data['params'] = pff1Data;
        }


        var self = this;
        $.ajax({
            type: 'POST',
            url: processUrl,
            data: data
        }).done(function (data) {
            if (typeof callback === 'function')
                callback(self, data);
        });
    },
    requestDoneChange: function (data) {
        this.loadOrderData(data);
    },
    loadOrderData: function(data) {

        // order items
        if(this.orderItemsWrapps != null) {

            $(this.orderItemsWrapps).each(function(){
                var type = $(this).attr('data-type');

                // load order item
                var orderItem = data.orderItem;
                var orderItemHTML = '';
                if(typeof orderItem != 'undefined') {
                    orderItemHTML = orderItem.html[type];
                    if (typeof orderItemHTML == 'undefined')
                        orderItemHTML = '';
                }

                // load order items
                var orderItems = data.orderItems;
                var orderItemsHTML = '';
                if(typeof orderItems != 'undefined') {
                    orderItemsHTML = orderItems.html[type];
                    if (typeof orderItemsHTML == 'undefined')
                        orderItemsHTML = '';
                }


                // process order item
                if(typeof orderItem != 'undefined') {
                    console.log(orderItem);
                    var orderItemEl = $(this).find('.order-item[data-hash="' + orderItem.hash + '"]');
                    // if order item exists
                    if ($(orderItemEl).length) {
                        if (orderItemHTML == '') {
                            orderItemEl.slideUp('fast', function () {
                                $(this).remove();
                            });
                        }

                        else
                            orderItemEl.replaceWith(orderItemHTML);

                    }
                    // if order item doesn't exists
                    else {
                        $(this).append(orderItemHTML);
                    }

                }

                // process order items
                else if(typeof orderItems != 'undefined') {
                    $(this).html(orderItemsHTML);
                }


            });

        }

        // order items qty
        if(typeof data.orderItemsQty != null) {
            $(this.orderItemsQty).each(function(){
                $(this).html(data.orderItemsQty);
                // if(data.orderItemsQty == 0 || typeof data.orderItemsQty == 'undefined')
                //     $(this).hide();
                // else
                //     $(this).show();

            });
        }

        this.changeAmounts(data);

    },
    changeAmounts: function(data) {

        // order amount
        if(this.orderAmounts && typeof data.orderAmount != 'undefined' && typeof data.fAmount !== 'undefined') {
            $(this.orderAmounts).each(function(){

                var amountVat = $(this).find('.amount-vat');
                var amount = $(this).find('.amount');
                var vat = $(this).find('.vat');

                amountVat.html(data.fAmount.amount_vat);
                amount.html(data.fAmount.amount);
                vat.html(data.fAmount.vat);


                // if($(this).hasClass('products-amount')){
                //     amountVat.html(data.orderAmount.formated.amount_vat_products);
                //     amount.html(data.orderAmount.formated.amount_products);
                //     vat.html(data.orderAmount.formated.vat_products);
                // }
                // else {
                //     amountVat.html(data.orderAmount.formated.amount_vat);
                //     amount.html(data.orderAmount.formated.amount);
                //     vat.html(data.orderAmount.formated.vat);
                // }

            });
        }


        if(typeof data.amounts != 'undefined') {

            $.each(data.amounts, function(hash,amounts){
                $('.order-item[data-hash="'+hash+'"]').find('.order-item-price-no-vat').html(amounts.amount);
                $('.order-item[data-hash="'+hash+'"]').find('.order-item-price-vat').html(amounts.amount_vat);
            });


        }
    },
    showProductAddToCartModal: function(){
        if(this.productAddToCartModal) {
            Toggle('#' + $(this.productAddToCartModal).attr('id'),'modal');

        }
    },
    loadingButton: function(button) {
        if(typeof button !== 'undefined') {
            var btnWidth = button.outerWidth();
            var btnHeight = button.outerHeight();
            button.css({'width': btnWidth, 'height': btnHeight}).addClass('loading');
        }
    },
    hideLoadingButton: function(button) {
        if(typeof button !== 'undefined') {
            button.removeAttr('style').removeClass('loading');
        }
    }
};