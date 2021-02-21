window.cytubeEnhanced.addModule('favouritePictures', function (app) {
    'use strict';
    var that = this;

    var favouritePicturesFromV1 = app.parseJSON(window.localStorage.getItem('favouritePictures'), []);
    app.storage.setDefault('favouritePictures', _.isArray(favouritePicturesFromV1) ? favouritePicturesFromV1 : []);

    if ($('#chat-panel').length === 0) {
        $('<div id="chat-panel" class="row">').insertAfter("#main");
    }

    if ($('#chat-controls').length === 0) {
        $('<div id="chat-controls" class="btn-group">').appendTo("#chatwrap");
    }


    this.$toggleFavouritePicturesPanelBtn = $('<button id="favourite-pictures-btn" class="btn btn-sm btn-default" title="' + app.t('favPics[.]Show your favorite images') + '">')
        .html('<i class="glyphicon glyphicon-th"></i>');
    if ($('#smiles-btn').length !== 0) {
        this.$toggleFavouritePicturesPanelBtn.insertAfter('#smiles-btn');
    } else {
        this.$toggleFavouritePicturesPanelBtn.prependTo('#chat-controls');
    }





    this.$favouritePicturesPanel = $('<div id="favourite-pictures-panel">')
        .appendTo('#chat-panel')
        .hide();
    this.$favouritePicturesPanelRow = $('<div class="favourite-pictures-panel-row">')
        .appendTo(this.$favouritePicturesPanel);


    this.$favouritePicturesTrash = $('<div id="pictures-trash" title="' + app.t('favPics[.]Drop the picture here to remove it') + '">')
        .append('<i class="pictures-trash-icon glyphicon glyphicon-trash">')
        .appendTo(this.$favouritePicturesPanelRow);


    this.$favouritePicturesBodyPanel = $('<div id="pictures-body-panel">')
        .appendTo(this.$favouritePicturesPanelRow);



    this.$favouritePicturesControlPanel = $('<div id="pictures-control-panel" class="row">')
        .appendTo(this.$favouritePicturesPanel);

    this.$favouritePicturesControlPanelForm = $('<div class="col-md-12">')
        .html('<div class="input-group">' +
            '<span class="input-group-btn">' +
                '<button id="help-pictures-btn" class="btn btn-sm btn-default" style="border-radius:0;" type="button">?</button>' +
            '</span>' +
            '<span class="input-group-btn">' +
                '<button id="export-pictures" class="btn btn-sm btn-default" style="border-radius:0;" type="button">' + app.t('favPics[.]Export pictures') + '</button>' +
            '</span>' +
             '<span class="input-group-btn">' +
                '<label for="import-pictures" class="btn btn-sm btn-default" style="border-radius:0;">' + app.t('favPics[.]Import pictures') + '</label>' +
                '<input type="file" style="display:none;" id="import-pictures" name="pictures-import">' +
            '</span>' +
            '<input type="text" id="picture-address" class="form-control input-sm" placeholder="' + app.t('favPics[.]Picture url') + '">' +
            '<span class="input-group-btn">' +
                '<button id="add-picture-btn" class="btn btn-sm btn-default" style="border-radius:0;" type="button">' + app.t('favPics[.]Add') + '</button>' +
            '</span>' +
        '</div>')
        .appendTo(this.$favouritePicturesControlPanel);



    this.makeSmilesAndPicturesTogether = function () {
        that.smilesAndPicturesTogether = true;
        that.$toggleFavouritePicturesPanelBtn.hide();
        that.$favouritePicturesPanel.hide();
    };



    this.entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;'
    };
    this.replaceUnsafeSymbol = function (symbol) {
        return that.entityMap[symbol];
    };
    this.renderFavouritePictures = function () {
        var favouritePictures = app.storage.get('favouritePictures') || [];

        this.$favouritePicturesBodyPanel.empty();

        for (var n = 0, favouritePicturesLen = favouritePictures.length; n < favouritePicturesLen; n++) {
            var escapedAddress = favouritePictures[n].replace(/[&<>"']/g, this.replaceUnsafeSymbol);

            $('<img class="favourite-picture-on-panel">').attr({src: escapedAddress}).appendTo(this.$favouritePicturesBodyPanel);
        }
    };


    this.insertFavouritePicture = function (address) {
        app.Helpers.addMessageToChatInput(' ' + address + ' ', 'end');
    };
    $(document.body).on('click', '.favourite-picture-on-panel', function () {
        that.insertFavouritePicture($(this).attr('src'));
    });


    this.handleFavouritePicturesPanel = function ($toggleFavouritePicturesPanelBtn) {
        var smilesAndPicturesTogether = this.smilesAndPicturesTogether || false;

        if ($('#smiles-panel').length !== 0 && !smilesAndPicturesTogether) {
            $('#smiles-panel').hide();
        }

        this.$favouritePicturesPanel.toggle();


        if (!smilesAndPicturesTogether) {
            if ($toggleFavouritePicturesPanelBtn.hasClass('btn-default')) {
                if ($('#smiles-btn').length !== 0 && $('#smiles-btn').hasClass('btn-success')) {
                    $('#smiles-btn').removeClass('btn-success');
                    $('#smiles-btn').addClass('btn-default');
                }

                $toggleFavouritePicturesPanelBtn.removeClass('btn-default');
                $toggleFavouritePicturesPanelBtn.addClass('btn-success');
            } else {
                $toggleFavouritePicturesPanelBtn.removeClass('btn-success');
                $toggleFavouritePicturesPanelBtn.addClass('btn-default');
            }
        }
    };
    this.$toggleFavouritePicturesPanelBtn.on('click', function() {
        that.handleFavouritePicturesPanel($(this));
    });


    this.addFavouritePicture = function (imageUrl) {
        imageUrl = _.trim(imageUrl);
        if (imageUrl !== '') {
            var favouritePictures = app.storage.get('favouritePictures') || [];

            if (favouritePictures.indexOf(imageUrl) === -1) {
                if (imageUrl !== '') {
                    favouritePictures.push(imageUrl);
                }
            } else {
                window.makeAlert(app.t('favPics[.]The image already exists')).prependTo(this.$favouritePicturesBodyPanel);
                $('#picture-address').val('');

                return false;
            }
            $('#picture-address').val('');

            app.storage.set('favouritePictures', favouritePictures);

            this.renderFavouritePictures();
        }
    };
    $('#add-picture-btn').on('click', function (e) {
        e.preventDefault();

        that.addFavouritePicture($('#picture-address').val().trim());
    });
    $('#picture-address').on('keypress', function (e) {
        if (e.which == 13) {
            that.addFavouritePicture($('#picture-address').val().trim());
        }
    });


    this.showHelp = function () {
        var $header = $('<div class="modal-header__inner">');
        $header.append($('<h3 class="modal-title">').text(app.t('Help')));

        var $wrapper = $('<div class="help-pictures-content">');
        $wrapper.append($('<p>' + app.t('favPics[.]<p>Favourite pictures feature if for saving favourite pictures like browser bookmarks.</p><p>Features:<ul><li><strong>Only links to images can be saved</strong>, so if image from link was removed, it also removes from your panel.</li><li>Images links are storing in browser. There are export and import buttons to share them between browsers.</li><li>Images are the same for site channels, but <strong>they are different for http:// and https://</strong></li></ul></p>') + '</p>'));


        var $exitPicturesHelpBtn = $('<button type="button" id="help-pictures-exit-btn" class="btn btn-info" data-dismiss="modal">' + app.t('favPics[.]Exit') + '</button>');
        var $footer = $('<div class="help-pictures-footer">');
        $footer.append($exitPicturesHelpBtn);


        return app.UI.createModalWindow('chat-history', $header, $wrapper, $footer);
    };
    $('#help-pictures-btn').on('click', function (e) {
        e.preventDefault();

        that.showHelp();
    });


    this.exportPictures = function () {
        var $downloadLink = $('<a>')
            .attr({
                href: 'data:text/plain;charset=utf-8,' + encodeURIComponent(app.toJSON(app.storage.get('favouritePictures') || [])),
                download: 'cytube_enhanced_favourite_images.txt'
            })
            .hide()
            .appendTo($(document.body));

        $downloadLink[0].click();

        $downloadLink.remove();
    };
    $('#export-pictures').on('click', function () {
        that.exportPictures();
    });


    this.importPictures = function (importFile) {
        var favouritePicturesAddressesReader = new FileReader();

        favouritePicturesAddressesReader.addEventListener('load', function(e) {
            var pictures = app.parseJSON(e.target.result);
            if (_.isArray(pictures)) {
                app.storage.set('favouritePictures', app.parseJSON(e.target.result));
                that.renderFavouritePictures();
            } else {
                app.UI.createAlertWindow(app.t('favPics[.]Can\'t detect any pictures in this file.'));
            }
        });
        favouritePicturesAddressesReader.readAsText(importFile);
    };
    $('#import-pictures').on('change', function () {
        var file = $(this)[0].files[0];
        app.UI.createConfirmWindow(app.t('favPics[.]Your old pictures will be removed and replaced with the images from uploaded file (file must correspond to format of the file from export button of this panel).<br>Are you sure you want to continue?'), function (isConfirmed) {
            if (isConfirmed && file) {
                that.importPictures(file);
            }
        });
    });


    this.renderFavouritePictures();



    this.$favouritePicturesBodyPanel.sortable({
        containment: this.$favouritePicturesPanelRow,
        revert: true,
        update: function(event, ui) {
            var imageUrl = $(ui.item).attr('src');
            var nextImageUrl = $(ui.item).next().attr('src');
            var favouritePictures = app.storage.get('favouritePictures');

            var imagePosition;
            if ((imagePosition = favouritePictures.indexOf(imageUrl)) !== -1) {
                favouritePictures.splice(imagePosition, 1);
            } else {
                return;
            }

            if (typeof nextImageUrl !== 'undefined') {
                var nextImagePosition;
                if ((nextImagePosition = favouritePictures.indexOf(nextImageUrl)) !== -1) {
                    favouritePictures.splice(nextImagePosition, 0, imageUrl);
                }
            } else {
                favouritePictures.push(imageUrl);
            }

            app.storage.set('favouritePictures', favouritePictures);
        }
    });


    this.$favouritePicturesTrash.droppable({
        accept: ".favourite-picture-on-panel",
        hoverClass: "favourite-picture-drop-hover",
        drop: function (event, ui) {
            var imageUrl = ui.draggable.attr('src');
            var favouritePictures = app.storage.get('favouritePictures');

            var imagePosition;
            if ((imagePosition = favouritePictures.indexOf(imageUrl)) !== -1) {
                favouritePictures.splice(imagePosition, 1);
                app.storage.set('favouritePictures', favouritePictures);
            }

            ui.draggable.remove();
        }
    });
});
