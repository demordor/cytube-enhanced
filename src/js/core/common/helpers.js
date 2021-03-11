window.CytubeEnhancedHelpers = function (app) {
    var that = this;

    /**
     * Returns viewport size
     * @returns {{width: number, height: number}}
     */
    this.getViewportSize = function () {
        var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        return {
            width: width,
            height: height
        };
    };

    /**
     * Adds the text to chat input
     * @param message The text to add.
     * @param position The position of the adding. It can be 'begin' or 'end'.
     */
    this.addMessageToChatInput = function (message, position) {
        var $chatline = $(chatline);
        position = position || 'end';

        if (position === 'begin') {
            message = message + $chatline.val();
        } else {
            message = $chatline.val() + message;
        }

        $chatline.val(message).focus();
    };

    /**
     * Toggles element between default and succes class
     * @param element to toggle.
     */
     this.toggleDefaultSuccess = function (e) {
        if ($(e).hasClass('btn-default')) {
            $(e).removeClass('btn-default');
            $(e).addClass('btn-success');
        } else {
            $(e).removeClass('btn-success');
            $(e).addClass('btn-default');
        }
    };
};