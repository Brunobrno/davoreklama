/* -------------------------------------------------------------------------
 *      jquery validator
 ------------------------------------------------------------------------ */

$.validator.setDefaults({
    errorClass: "invalid",
    validClass: "valid",
    errorElement: "span",
    displayErrors: true,
    ignore: [], // stop ignoring hidden form elements
    highlight: function (element, errorClass, validClass) {
        var $element = $(element);
        $element.addClass(errorClass).removeClass(validClass);
        $element.closest('.input').addClass(errorClass).removeClass(validClass);

        if($element.attr('name') == 'payment_ID')
            $('.payment-label').addClass(errorClass).removeClass(validClass);
        if($element.attr('name') == 'shipping_ID')
            $('.shipping-label').addClass(errorClass).removeClass(validClass);

    },
    unhighlight: function (element, errorClass, validClass) {
        var $element = $(element);
        // if ($(element).val() !== "" && $(element).val() !== null) {
            $element.removeClass(errorClass).addClass(validClass);
            $element.closest('.input').removeClass(errorClass).addClass(validClass);

            if($element.attr('name') == 'payment_ID')
                $('.payment-label').removeClass(errorClass).addClass(validClass);
            if($element.attr('name') == 'shipping_ID')
                $('.shipping-label').removeClass(errorClass).addClass(validClass);

        // }
    },
    //errorPlacement: function () {
    //    return true;
    //},
    invalidHandler: function (form, validator) {
        if (!validator.numberOfInvalids())
           return;
       var label_for = $(validator.errorList[0].element).attr('name');
        var scroll_to_el = $();

        if(label_for == 'payment_ID')
            scroll_to_el = $('.payment-label').first();
        else if(label_for == 'shipping_ID')
            scroll_to_el = $('.shipping-label').first();
        else {
            scroll_to_el = $('body').find('label[for="' + label_for + '"]');
        }
        
       if (!(scroll_to_el.length > 0)) {
           scroll_to_el = $('body').find('label[data-for="' + label_for + '"]');
           if (!(scroll_to_el.length > 0)) {
               scroll_to_el = $(validator.errorList[0].element);
           }
       }
       var scroll_to = scroll_to_el.offset().top - 50;
       $('html, body').animate({
           scrollTop: scroll_to
       }, 200);
    }
});
$.validator.addMethod("phoneCZ", function (phone_number, element) {
    if (phone_number.length === 0) {
        $(element).removeClass("invalid").removeClass("valid");
        $('label[for=' + $(element).attr('id') + ']').removeClass("invalid").removeClass("valid");
        return true;
    }
    phone_number = phone_number.replace(/\s+/g, "");

    if (!phone_number.match(/^((\+420)|(\+421))??[0-9]{3}?[0-9]{3}?[0-9]{3}$/)) {
        return (phone_number.length < 1);
    } else {
        return (phone_number.length >= 9);
    }
}, "Neplatné telefonnní číslo");


$.validator.addMethod("phoneOrEmail", function (value, element) {

    value = value.replace(/\s+/g, "");

    isPhone = value.match(/^((\+420)|(\+421))??[0-9]{3}?[0-9]{3}?[0-9]{3}$/) && value.length >= 9;
    isEmail = value.match(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/);

    return isPhone || isEmail || this.optional(element);

}, "Neplatné telefonnní číslo nebo e-mail");


$('form[data-name="customer-login"]').each(function(){
    $(this).validate({
        rules: {
            'email': {
                required: true,
                email: true
            },
            'password': {
                required: true
            }
        }
    });
});


$('form[data-name="newsletter-subscriber-form"]').each(function(){
    $(this).validate({
        rules: {
            'email': {
                required: true,
                email: true
            }
        }
    });
});


$('form[data-name="contact-form"]').each(function(){
    $(this).validate({
        rules: {
            'name': {
                required: true
            },
            'email': {
                required: true,
                email: true
            },
            'message': {
                required: true
            }
        }
    });
});

$('form[data-name="customer-form"]').each(function(){
    var form = $(this);
    form.find('input').on('change', function(){
        form.find('input.invalid').keyup();
    });
    $(this).validate({
        displayErrors: true,
        rules: {
            'company_name': {
                required: function(element) {
                    var formId = $(element).attr('form');
                    return $("[name='name'][form='"+formId+"']").val() == '';
                }
            },
            'name': {
                required: function(element) {
                    var formId = $(element).attr('form');
                    return $("[name='company_name'][form='"+formId+"']").val() == '';
                }
            },
            // 'surname': {
            //     required: function(element) {
            //         var formId = $(element).attr('form');
            //         return $("[name='company_name'][form='"+formId+"']").val() == '';
            //     }
            // },
            'phone': {
                required: true
            },
            'email': {
                required: true,
                email: true
            },
            'street': {
                required: true
            },
            'city': {
                required: true
            },
            'zipcode': {
                required: true
            },
            'password': {
                required: function(element) {
                    return $("#change_password").is(':checked');
                }
            },
            'agree': {
                required: true
            },
            'password_conf': {
                required: function(element) {
                    return $("#change_password").is(':checked');
                },
                equalTo: '#customer_form_password'
            },
            'shipping_company_name': {
                required: function(element) {
                    var formId = $(element).attr('form');
                    return $("[name='shipping_name'][form='"+formId+"']").val() == ''  && $("#different_shipping_1").is(':checked');
                }
            },
            'shipping_name': {
                required: function(element) {
                    var formId = $(element).attr('form');
                    return $("[name='shipping_company_name'][form='"+formId+"']").val() == '' && $("#different_shipping_1").is(':checked');
                }
            },
            // 'shipping_surname': {
            //     required: function(element) {
            //         var formId = $(element).attr('form');
            //         return $("[name='shipping_company_name'][form='"+formId+"']").val() == '' && $("#different_shipping_1").is(':checked');
            //     }
            // },
            'shipping_phone': {
                required: function(element) {
                    return $("#different_shipping_1").is(':checked');
                }
            },
            'shipping_email': {
                required: function(element) {
                    return $("#different_shipping_1").is(':checked');
                },
                email: true
            },
            'shipping_street': {
                required: function(element) {
                    return $("#different_shipping_1").is(':checked');
                }
            },
            'shipping_city': {
                required: function(element) {
                    return $("#different_shipping_1").is(':checked');
                }
            },
            'shipping_zipcode': {
                required: function(element) {
                    return $("#different_shipping_1").is(':checked');
                }
            }

        }
    });
});

$('form[data-name="order-form"]').each(function(){
    var form = $(this);
    form.find('input').on('change', function(){
        form.find('input.invalid').keyup();
    });
        $(this).validate({
            displayErrors: true,
            rules: {
                'company_name': {
                    required: function(element) {
                        var formId = $(element).attr('form');
                        return $("[name='name'][form='"+formId+"']").val() == '';
                    }
                },
                'name': {
                    required: function(element) {
                        var formId = $(element).attr('form');
                        return $("[name='company_name'][form='"+formId+"']").val() == '';
                    }
                },
                // 'surname': {
                //     required: function(element) {
                //         var formId = $(element).attr('form');
                //         return $("[name='company_name'][form='"+formId+"']").val() == '';
                //     }
                // },
            'phone': {
                required: true
            },
            'email': {
                required: true,
                email: true
            },
            'street': {
                required: true
            },
            'city': {
                required: true
            },
            'zipcode': {
                required: true
            },
            'agree': {
                required: true
            },
                'shipping_company_name': {
                    required: function(element) {
                        var formId = $(element).attr('form');
                        return $("[name='shipping_name'][form='"+formId+"']").val() == '' && $("#different_shipping_1").is(':checked');
                    }
                },
                'shipping_name': {
                    required: function(element) {
                        var formId = $(element).attr('form');
                        return $("[name='shipping_company_name'][form='"+formId+"']").val() == '' && $("#different_shipping_1").is(':checked');
                    }
                },
                // 'shipping_surname': {
                //     required: function(element) {
                //         var formId = $(element).attr('form');
                //         return $("[name='shipping_company_name'][form='"+formId+"']").val() == '' && $("#different_shipping_1").is(':checked');
                //     }
                // },
            'shipping_phone': {
                required: function(element) {
                    return $("#different_shipping_1").is(':checked');
                }
            },
            'shipping_email': {
                required: function(element) {
                    return $("#different_shipping_1").is(':checked');
                },
                email: true
            },
            'shipping_street': {
                required: function(element) {
                    return $("#different_shipping_1").is(':checked');
                }
            },
            'shipping_city': {
                required: function(element) {
                    return $("#different_shipping_1").is(':checked');
                }
            },
            'shipping_zipcode': {
                required: function(element) {
                    return $("#different_shipping_1").is(':checked');
                }
            },
            'payment_ID': {
                required: true
            },
            'shipping_ID': {
                required: true
            }
        }
    });
});