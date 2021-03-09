window.cytubeEnhanced.addModule('favouritePictures', function (app) {
    'use strict';
    var that = this;

    
    /**********/
    /* LAYOUT */
    /**********/


    /**
     * Load pictures from local Storage
     */
    var favouritePicturesFromV1 = app.parseJSON(window.localStorage.getItem('favouritePictures'), []);
    app.storage.setDefault('favouritePictures', _.isArray(favouritePicturesFromV1) ? favouritePicturesFromV1 : []);

    /**
     * Check if chat-panel and chat-controls initialized
     */
    if ($('#chat-panel').length === 0) {
        $('<div id="chat-panel" class="row">').insertAfter("#controlsrow");
    }

    if ($('#chat-controls').length === 0) {
        $('<div id="chat-controls" class="btn-group">').insertBefore('#newpollbtn');
    }


    /**
     * Create toggle button
     */
    if($('#favourite-pictures-btn').length === 0)
    {
        this.$toggleFavouritePicturesPanelBtn = $(`<button id="favourite-pictures-btn" class="btn btn-sm btn-default" title="${app.t('favPics[.]Show your favorite images')}">`)
            .html('<i class="glyphicon glyphicon-folder-open"></i>');
    }

    /**
     * Check if smiles button initialized
     */
    if ($('#smiles-btn').length !== 0) {
        this.$toggleFavouritePicturesPanelBtn.insertAfter('#smiles-btn');
    } else {
        this.$toggleFavouritePicturesPanelBtn.prependTo('#chat-controls');
    }


    /**
     * Create panel
     */
    if($('#favourite-pictures-panel').length === 0)
    {
         this.$favouritePicturesPanel = $('<div id="favourite-pictures-panel">')
             .appendTo('#chat-panel')
             .hide();

        if($('#smiles-panel-primary').length !== 0) {
            this.$favouritePicturesPanel.insertBefore($('#smiles-panel-primary'));
        }
    }

    

	/**
	 * Create row
	 */
    if($('#favourite-pictures-panel-row').length === 0)
    {
        this.$favouritePicturesPanelRow = $('<div class="favourite-pictures-panel-row">')
            .appendTo(this.$favouritePicturesPanel);
    }

	/**
	 * Create trash icon
	 */
    if($('#pictures-trash').length === 0)
    {
        this.$favouritePicturesTrash = $(`<div id="pictures-trash" title="$app.t('favPics[.]Drop the picture here to remove it')">`)
            .append('<i class="pictures-trash-icon glyphicon glyphicon-trash">')
            .appendTo(this.$favouritePicturesPanelRow);
    }

	/**
	 * Create panel body
	 */
    if($('#pictures-body-panel').length === 0)
    {
        this.$favouritePicturesBodyPanel = $('<div id="pictures-body-panel">')
            .appendTo(this.$favouritePicturesPanelRow);
    }


	/**
	 * Create controls area
	 */
    if($('#pictures-control-panel').length === 0)
    {
        this.$favouritePicturesControlPanel = $('<div id="pictures-control-panel" class="row">')
            .appendTo(this.$favouritePicturesPanel);
    }

    if($('#picture-address').length === 0)
    {
        this.$favouritePicturesControlPanelForm = $('<div class="row">')
        .html(`<div class="input-group">
            <span class="input-group-btn">
                <button id="help-pictures-btn" class="btn btn-sm btn-default" style="border-radius:0;" type="button">?</button>
            </span>
            <span class="input-group-btn">
                <button id="export-pictures" class="btn btn-sm btn-default" style="border-radius:0;" type="button"><span title="${app.t('favPics[.]Export pictures')}"><i class="glyphicon glyphicon-floppy-save"></i></span></button>
            </span>
             <span class="input-group-btn">
                <label for="import-pictures" class="btn btn-sm btn-default" style="border-radius:0;"><span title="${app.t('favPics[.]Import pictures')}"><i class="glyphicon glyphicon-floppy-open"></i></span></label>
                <input type="file" style="display:none;" id="import-pictures" name="pictures-import">
            </span>
            <input type="text" id="picture-address" class="form-control input-sm" placeholder="${app.t('favPics[.]Picture url')}">
            <span class="input-group-btn">
                <button id="add-picture-btn" class="btn btn-sm btn-default" style="border-radius:0;" type="button">${app.t('favPics[.]Add')}</button>
            </span>
        </div>`)
        .appendTo(this.$favouritePicturesControlPanel);
    }
    

    /*************/
    /* FUNCTIONS */
    /*************/


	/**
	 * Smiles and Pictures
	 */
    this.makeSmilesAndPicturesTogether = function () {
        that.smilesAndPicturesTogether = true;
        that.$toggleFavouritePicturesPanelBtn.hide();
        that.$favouritePicturesPanel.hide();
    };



	/**
	 * Unsafe symbols
	 */
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



	/**
	 * Refresh images in the panel
	 */
    this.renderFavouritePictures = function () {
        /**
         * Get images from storage
         */
        var favouritePictures = app.storage.get('favouritePictures') || [];

        /**
         * Clear container
         */
        this.$favouritePicturesBodyPanel.empty();

        /**
         * Populate container with loaded images
         */
        for (var n = 0, favouritePicturesLen = favouritePictures.length; n < favouritePicturesLen; n++) {
            var escapedAddress = favouritePictures[n].replace(/[&<>"']/g, this.replaceUnsafeSymbol);

            var regexImg = /((?:http|https):\/\/[^?#]+?[.](?:jpg|jpeg|png|apng|bmp|svg|gif|webp)[^ ]*)/g;
            var regexVideo = /((?:http|https):\/\/[^?#]+?[.](?:mp4|webm))[^ ]*/g;

            if(regexImg.test(escapedAddress)){
                $('<img class="favourite-picture-on-panel">')
                    .attr({src: escapedAddress})
                    .appendTo(this.$favouritePicturesBodyPanel);
            }

            if(regexVideo.test(escapedAddress)){
                let video = $('<video>')
                    .addClass('favourite-video-on-panel')
                    .attr('preload', 'metadata')
                    .attr('title', escapedAddress)
                    .on('click', function () {
                        that.insertFavouritePicture($(this).attr('title'));
                    })
                    .appendTo(this.$favouritePicturesBodyPanel);
                
                $('<source>')
                    .attr('src', `${escapedAddress}#t=1.5`)
                    .attr('type', 'video/mp4')
                    .appendTo(video);
            }
        }
    };


	/**
	 * Insert image into the chatline on click
	 */
    this.insertFavouritePicture = function (address) {
        app.Helpers.addMessageToChatInput(` ${address} `, 'end');
    };
    $(document.body).on('click', '.favourite-picture-on-panel', function () {
        that.insertFavouritePicture($(this).attr('src'));
    });


	
	/**
	 * Favourite Pictures panel toggle
	 */
    this.handleFavouritePicturesPanel = function ($toggleFavouritePicturesPanelBtn) {
        var smilesAndPicturesTogether = this.smilesAndPicturesTogether || false;

        if ($('#smiles-panel').length !== 0 && !smilesAndPicturesTogether) {
            $('#smiles-panel').hide();
        }

		/* Hide or show panel */
        this.$favouritePicturesPanel.toggle();

		/* Handle class on the button */
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



	/**
	 * Add picture
	 */
    this.addFavouritePicture = function (imageUrl) {

        // Add check for an image

        // Ad check for a video

        imageUrl = _.trim(imageUrl);
        if (imageUrl !== '') {
            var favouritePictures = app.storage.get('favouritePictures') || [];

            if (favouritePictures.indexOf(imageUrl) === -1) {
				favouritePictures.push(imageUrl);
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



	/**
	 * Help description
	 */
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


	/**
	 * Export
	 */
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



	/**
	 * Import
	 */
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


	/**
	 * Load pictures
	 */
    this.renderFavouritePictures();


    ///////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * (drag & drop)
	 */
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
