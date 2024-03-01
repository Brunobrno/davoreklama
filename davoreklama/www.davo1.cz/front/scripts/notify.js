var showNotification = function (message) {
    if (typeof message !== 'undefined') {
        var messageTitle = typeof message.title !== 'undefined' ? message.title : '';
        var messageText = typeof message.text !== 'undefined' ? message.text : '';
        var status = typeof message.status !== 'undefined' ? message.status : 'info';
        switch (status) {
            case 'success':
                Notify(messageTitle, messageText).success();
                break;
            case 'error':
                Notify(messageTitle, messageText).error();
                break;
            case 'warning':
                Notify(messageTitle, messageText).warning();
                break;
            case 'info':
                Notify(messageTitle, messageText).info();
                break;
            case 'browser':
                Notify(messageTitle, messageText).browser();
                break;
        }
    }
}

var Notify = function (title, text) {

    if (!(this instanceof Notify)) {
        return new Notify(title, text);
    }

    this.title = title;
    this.text = text;
    this.showAnimation = 'slideInLeft';
    this.hideAnimation = 'slideOutLeft';
    this.hideTimeout = 5000;
    this.notificationsWrappId = 'notifications-wrapp';
    this.notificationsWrappClass = 'notifications-wrapp';



    this.notificationsWrapp = $('<div/>', {
        'id': this.notificationsWrappId,
        'class': this.notificationsWrappClass
    });

    this.notificationWrapp = $('<div/>', {
        'class': 'notification animated ' + this.showAnimation
    });
    this.notificationContent = $('<div/>', {
        'class': 'content'
    });
    this.notificationTitle = $('<div/>', {
        'class': 'title'
    });
    this.notificationText = $('<div/>', {
        'class': 'text'
    });
    this.notificationCloser = $('<span/>', {
        'class': 'close',
        'html': '<i class="ico close"></i>'
    });


    this.show = function (type) {

        if (typeof this.notificationTitle !== 'undefined') {

            this.notification = this.notificationWrapp.clone();
            this.notification.addClass(type);
            var notificationContent = this.notificationContent.clone();


            var notificationTitle = this.notificationTitle.clone();
            notificationTitle.html(this.title);
            notificationContent.append(notificationTitle);

            if (typeof this.text !== 'undefined') {
                var notificationText = this.notificationText.clone();
                notificationText.html(this.text);
                notificationContent.append(notificationText);
            }

            var notificationCloser = this.notificationCloser.clone();
            notificationContent.append(notificationCloser);

            this.notification.append(notificationContent);

            if (!$('#' + this.notificationsWrappId).length) {
                $('body').append(this.notificationsWrapp);
            }

            var notificationsWrapp = $('#' + this.notificationsWrappId).first();
            notificationsWrapp.append(this.notification);

            this.closeTrigger();

        }

    };

    this.success = function () {
        this.show('success');
    };
    this.error = function () {
        this.show('error');
    };
    this.warning = function () {
        this.show('warning');
    };
    this.info = function () {
        this.show('info');
    };

    this.close = function () {
        var self = this;
        this.notification.removeClass(this.showAnimation).addClass(this.hideAnimation);
        setTimeout(function () {
            self.notification.hide('fast', function () {
                self.notification.remove();
            });
        }, 500)
    };
    this.closeTrigger = function () {
        var self = this;
        var notificationTimeout = PausableTimeout(function () {
            self.close();
        }, this.hideTimeout);
        this.notification.find('.close').on('click', function (e) {
            e.preventDefault();
            self.close();
        });
        this.notification.on('click', function(){
            self.close();
        });
        this.notification.on('mouseover', function () {
            notificationTimeout.pause();
        });
        this.notification.on('mouseout', function () {
            notificationTimeout.continue();
        });
    };

    // browser notification
    this.browser = function() {
        // If the browser version is unsupported, remain silent.
        if (!'Notification' in window) {
            return;
        }


        var permissions = false;
        if (Notification.permission === 'default')
            if (Notification.requestPermission())
                permissions = true;




            // If the user has granted permission for this domain to send notifications...
            if (Notification.permission === 'granted' || permissions) {
                var n = new Notification(
                    this.title,
                    {
                        'body': typeof this.text != 'undefined' ? this.text : '',
                        'tag': guid()
                    }
                ).onclick = function () {
                    this.close();
                };
            }

    };




};