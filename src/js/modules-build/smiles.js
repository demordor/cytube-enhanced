window.cytubeEnhanced.addModule('smiles', function (app) {
    'use strict';
    var that = this;

    
    $('#emotelistbtn').hide();


    if ($('#chat-panel').length === 0) {
        $('<div id="chat-panel" class="row">').insertAfter("#main");
    }
    
    if ($('#chat-controls').length === 0) {
        $('<div id="chat-controls" class="btn-group">').insertBefore('#newpollbtn');
    }


    if($('#smiles-btn').length === 0) {
        this.$smilesBtn = $(`<button id="smiles-btn" class="btn btn-sm btn-default" title="${app.t('emotes[.]Show emotes')}">`)
            .html('<i class="glyphicon glyphicon-picture"></i>')
            .prependTo('#chat-controls');
    }


    if($('#smiles-panel-secondary').length === 0) {
        this.$smilesPanelSecondary = $('<div id="smiles-panel-secondary" class="col-sm-12 col-md-12 col-lg-12 well">')
            .prependTo('#chat-panel')
            .hide();
    }

    if($('#smiles-panel-primary').length === 0) {
        this.$smilesPanelPrimary = $('<div id="smiles-panel-primary" class="col-sm-12 col-md-12 col-lg-12 well">')
            .prependTo('#chat-panel')
            .hide();
    }
    

    this.renderSmiles = function () {
        var smiles = window.CHANNEL.emotes;

        for (var smileIndex = 0, smilesLen = smiles.length; smileIndex < smilesLen; smileIndex++) {
            $('<img class="panelemote">')
                .attr({src: smiles[smileIndex].image})
                .attr({title: smiles[smileIndex].name})
                .appendTo(this.$smilesPanel);
        }
    };


    this.renderPrimarySmiles = function () {
        var smiles = window.CHANNEL.emotes;

        for (var smileIndex = 0, smilesLen = 276; smileIndex < smilesLen; smileIndex++) {
            $('<img class="panelemote">')
                .attr({src: smiles[smileIndex].image})
                .attr({title: smiles[smileIndex].name})
                .appendTo(this.$smilesPanelPrimary);
        }
    };

    this.renderSecondarySmiles = function () {
        var smiles = window.CHANNEL.emotes;

        for (var smileIndex = 276, smilesLen = smiles.length; smileIndex < smilesLen; smileIndex++) {
            $('<img class="panelemote">')
                .attr({src: smiles[smileIndex].image})
                .attr({title: smiles[smileIndex].name})
                .appendTo(this.$smilesPanelSecondary);
        }
    };


    this.insertSmile = function (smileName) {
        app.Helpers.addMessageToChatInput(` ${smileName} `, 'end');
    };
    
    $(document.body).on('click', '.panelemote', function () {
        that.insertSmile($(this).attr('title'));
    });


    $(window).on('resize', function () {
        if (app.Helpers.getViewportSize().width < 992) {
            $('#chat-panel').addClass('chat-panel-mobile').detach().insertAfter("#userlist");
        }
        else {
            $('#chat-panel').removeClass('chat-panel-mobile').detach().insertAfter("#main");
        }
    });


    this.showSmilesPanelPrimary = function () {
        if (app.Helpers.getViewportSize().width < 992) {
            $('#chat-panel').addClass('chat-panel-mobile').detach().insertAfter("#userlist");
        }

        if (that.$smilesPanelPrimary.html() === '') {
            that.renderPrimarySmiles();
        }

        var smilesAndPicturesTogether = this.smilesAndPicturesTogether || false; //setted up by userConfig module

        if ($('#favourite-pictures-panel').length !== 0 && !smilesAndPicturesTogether) {
            $('#favourite-pictures-panel').hide();
        }

        that.$smilesPanelPrimary.toggle();

        if (!smilesAndPicturesTogether) {
            if (that.$smilesBtn.hasClass('btn-default')) {
                if ($('#favourite-pictures-btn').length !== 0 && $('#favourite-pictures-btn').hasClass('btn-success')) {
                    $('#favourite-pictures-btn').removeClass('btn-success').addClass('btn-default');
                }

                that.$smilesBtn.removeClass('btn-default');
                that.$smilesBtn.addClass('btn-success');
            } else {
                that.$smilesBtn.removeClass('btn-success');
                that.$smilesBtn.addClass('btn-default');
            }
        }
    };

    this.showSmilesPanelSecondary = function () {
        if (app.Helpers.getViewportSize().width < 992) {
            $('#chat-panel').addClass('chat-panel-mobile').detach().insertAfter("#userlist");
        }

        if (that.$smilesPanelSecondary.html() === '') {
            that.renderSecondarySmiles();
        }

        var smilesAndPicturesTogether = this.smilesAndPicturesTogether || false; //setted up by userConfig module

        if ($('#favourite-pictures-panel').length !== 0 && !smilesAndPicturesTogether) {
            $('#favourite-pictures-panel').hide();
        }

        that.$smilesPanelSecondary.toggle();
    };


    this.$smilesBtn.bind('click', function() {
        return false;
    });

    this.$smilesBtn.bind('contextmenu', function() {
        return false;
    });


    this.$smilesBtn.on('click', function() {
        that.showSmilesPanelPrimary();
    });

    this.$smilesBtn.on('contextmenu', function() {
        that.showSmilesPanelSecondary();
    });


    this.makeSmilesAndPicturesTogether = function () {
        that.smilesAndPicturesTogether = true;
        that.$smilesBtn.hide();
        that.$smilesPanel.hide();
    };
});
