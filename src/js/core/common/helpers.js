window.CytubeEnhancedHelpers = function (app) {
    var that = this;

    /**
     * Resize window on load to fix chat height
     */
    $(window).trigger('resize'); 

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

    /**
     * Check for min rank
     * @param min rank.
     */
    this.checkMinRank = function (rank) {
        return window.CLIENT.rank < rank;
    };

    /**
     * Remove Data-URL declaration from base64
     * @param base64 string.
     * @returns base64 raw string.
     */
     this.toBase64Raw = function (base64Dirty) {
        return base64Dirty.substr(base64Dirty.indexOf(",") + 1, base64Dirty.length);
    };

    /**
     * Get regex for image files.
     * @returns regex expression for image extensions.
     */
     this.getImageFilterRegex = function () {
        return  /((?:http|https):\/\/[^?#]+?[.](?:jpg|jpeg|png|apng|bmp|svg|gif|webp)[^ ]*)/g;
    };
};