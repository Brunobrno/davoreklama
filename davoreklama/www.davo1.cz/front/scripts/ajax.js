var getCsrfToken = function () {
    return $('meta[name="csrf-token"]').attr('content');
};

(function ($) {
    var _ajax = $.ajax,
        A = $.ajax = function(options) {
            if (typeof options.data == 'object') {
                $.extend( options.data, A.data );
            } else if (typeof options.data == 'string' && options.data.length > 0) {
                for (var key in A.data) {
                    options.data += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(A.data[key]);
                }
            } else {
                options.data = A.data;
            }
            return _ajax(options);
        };
})(jQuery);
$.ajax.data = { _token: getCsrfToken() };




$(document).on('click','[data-ajx="delete"]', function(e){
    var itemId = $(this).attr('data-id');
    var url = $(this).attr('data-url');

    var item = $(this).closest('.item');

    $.ajax({
        type: 'POST',
        url: url,
        data: {
            item_ID: itemId,
            _token: getCsrfToken()
        }
    }).done(function (data) {
        if (data.status === 'success') {
            item.remove();

        }
        showNotification(data.message);
    });
});


$(document).ready(function(){

    $('form[data-name="contact-form"]').each(function(){



        $(this).on('submit', function(e){

            e.preventDefault();
            if(!$(this).valid())
                return;

            var data = $(this).serialize();
            data = data.replace(/%5B/g,"[");
            data = data.replace(/%5D/g,"]");

            var url = $(this).attr('action');
            var form = $(this);

            $.ajax({
                type: 'POST',
                url: url,
                data: data

            }).done(function (data) {
                if (data.status === 'success') {
                    form.closest('.form').find('input,textarea').val('');
                }
                form.append($('<div/>', {
                	'class': 'message '+data.status,
                	'html': data.message.title
                }));
                // showNotification(data.message);
            });

        });

    });


    $('form[data-name="newsletter-subscriber-form"]').each(function(){

        $(this).on('submit', function(e){

            e.preventDefault();
            if(!$(this).valid())
                return;

            var data = $(this).serialize();
            data = data.replace(/%5B/g,"[");
            data = data.replace(/%5D/g,"]");

            var url = $(this).attr('action');
            var form = $(this);
            var formId = $(this).attr('id');

            $.ajax({
                type: 'POST',
                url: url,
                data: data

            }).done(function (data) {

                var formWrapp = $('.form[data-form="'+formId+'"]');
                var messageWrapp = formWrapp.find('.message');
                var successMessage = messageWrapp.find('.success');
                var errorMessage = messageWrapp.find('.error');

                if (data.status === 'success') {
                    formWrapp.find('input,textarea').val('');
                    successMessage.html(data.message.title).show().off('click').on('click', function(){
                        $(this).slideUp();
                    });
                }
                else {
                    errorMessage.html(data.message.title).show().off('click').on('click', function(){
                        $(this).slideUp();
                    });
                }
            });

        });

    });



});