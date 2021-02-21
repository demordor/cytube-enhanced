window.cytubeEnhanced.addModule('chatControls', function (app, settings) {
    'use strict';
    var that = this;

    var defaultSettings = {
        afkButton: true,
        clearChatButton: true
    };
    settings = $.extend({}, defaultSettings, settings);



    this.handleAfkBtn = function () {
        window.socket.emit('chatMsg', {msg: '/afk'});
    };
    this.$afkBtn = $('<span id="afk-btn" class="label label-default pull-right pointer">')
        .text(app.t('AFK'))
        .appendTo('#chatheader')
        .on('click', function () {
            that.handleAfkBtn();
        });



    this.handleAfk = function (data) {
        if (data.name === window.CLIENT.name) {
            if (data.afk) {
                that.$afkBtn.removeClass('label-default');
                that.$afkBtn.addClass('label-success');
            } else {
                that.$afkBtn.addClass('label-default');
                that.$afkBtn.removeClass('label-success');
            }
        }
    };

    if (settings.afkButton) {
        window.socket.on('setAFK', function (data) {
            that.handleAfk(data);
        });
    } else {
        this.$afkBtn.hide();
    }




    this.handleClearBtn = function () {
        if (window.confirm(app.t('Are you sure, that you want to clear the chat?'))) {
            window.socket.emit("chatMsg", {msg: '/clear'});
        }
    };
    this.$clearChatBtn = $('<span id="clear-chat-btn" class="label label-default pull-right pointer">')
        .text(app.t('Clear'))
        .insertAfter(this.$afkBtn)
        .on('click', function () {
            that.handleClearBtn();
        });

    if (!window.hasPermission("chatclear")) {
        this.$clearChatBtn.hide();
    }


    this.handleChatClear = function () {
        if (window.hasPermission("chatclear") && settings.clearChatButton) {
            that.$clearChatBtn.show();
        } else {
            that.$clearChatBtn.hide();
        }
    };

    window.socket.on('setUserRank', function () {
        that.handleChatClear();
    });
});
