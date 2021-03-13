window.cytubeEnhanced.addModule('imageUpload', function (app, settings) {
  'use strict';
  const that = this;

  // TODO:
  // Abstract code. (use promises for ajax calls)
  // Add multiple file upload.
  // Move panel above the message buffer. (remove progress bar)
  // Image previews for image links in the chatline. (progress bar for each image upload)

  /**
   * Settings
   */
  const defaultSettings = {
    imgurAPIkey: atob("NzExYTdmYzc2YmQ2M2Yz"),
    imgbbAPIkey: atob("NzY4NzAxMDIxZWYyOTFlMDk1MzI2ZWM4YzI1YzVkM2Y="),
    imgPreviewTimeout: 5000,
    imgPreviewInterval: 150,
    fileTypes: [
      'image/jpeg',
      'image/jpg',
      'image/jfif',
      'image/pjpeg',
      'image/pjp',
      'image/png',
      'image/apng',
      'image/gif',
      'image/tif',
      'image/tiff',
    ],
    maxFileSize: 2e+7,
  };

  settings = $.extend({}, defaultSettings, settings);


  /**************/
  /*   LAYOUT   */
  /**************/


  if ($('#chat-panel').length === 0) {
    $('<div id="chat-panel" class="row">').insertAfter("#controlsrow");
  }

  if ($('#chat-controls').length === 0) {
      $('<div id="chat-controls" class="btn-group">').insertBefore('#newpollbtn');
  }

  /**
   * Create button toggle
   */
  if ($("#uploadbtn").length === 0)
  {
    this.$imgUploadBtn = $(`<button id="uploadbtn" class="btn btn-sm btn-default" title="${app.t('imageUpload[.]Upload a picture')}" />`)
      .html('<span class="glyphicon glyphicon-cloud-upload" />')
      .prependTo('#chat-controls')
      .click( (e) => {
        that.$imgUploadPanel.toggle();

        app.Helpers.toggleDefaultSuccess(e.currentTarget);
      });
  }

  /**
   * Create panel
   */
  this.$imgUploadPanel = $('<div class="col-lg-12 col-md-12 col-sm-12" id="imageUploadPanel" style="display: none;"></div>')
    .insertBefore( "#pollwrap" );

  this.$imgUploadPanelContent = $('<div class="well" id="imageUploadPanelContent"></div>')
    .appendTo(this.$imgUploadPanel);

  /**
   * From file
   */
  this.$imgUploadForm = $('<form action method="post">').appendTo(this.$imgUploadPanelContent);
  this.$imgUploadFormGroup = $('<div class="form-group file-area">').appendTo(this.$imgUploadForm);

  this.$imgUploadArea = $('<input type="file" name="images" id="imgUploadArea" required="required" multiple="multiple" accept="image/*"/>')
    .change(e => that.handleFileImgUpload($(e.currentTarget)[0].files[0]))
    .appendTo(this.$imgUploadFormGroup);

  /**
   * File Area
   */
  this.$imgUploadFileAreaResults = $(`
    <div class="file-dummy">
      <div class="uploadAreaText"><strong>${app.t('imageUpload[.]Ctrl + V / Drop / Choose an image')}</strong></div>
      <br>
    </div>
  `).appendTo(this.$imgUploadFormGroup);

  this.$imgPreview = $('<img src="" id="imgPreview" style="max-width:80%; max-height=60%;"/>')
    .appendTo(this.$imgUploadFileAreaResults);

  /**
   * Progress bar
   */
  this.$imgUploadProgressBar = $('<div id="imgProgressBar" class="progress"></div>')
   .appendTo(this.$imgUploadFormGroup);

  this.$imgUploadProgressBarUpload = $('<div id="imgProgressBarUpload" class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" />')
   .appendTo(this.$imgUploadProgressBar);
  this.$imgUploadProgressBarPreview = $('<div id="imgProgressBarPreview" class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" />')
   .appendTo(this.$imgUploadProgressBar);


  /***************/
  /*  FUNCTIONS  */
  /***************/


  /**
   * Image preview
   */
  this.setImgPreview = (img) => {
    that.$imgPreview.attr("src", img);
  };

  this.clearImgPreview = _ => {
    that.$imgPreview.attr('src', '');
  };
  
  /**
   * Progress Bar
   */
  this.resetProgressBars = _ => {
    that.$imgUploadProgressBarUpload.css('width', '0%');
    that.$imgUploadProgressBarPreview.css('width', '0%');
  };

  this.fillProgressBar = (e) => {
    $(e).css('width', '100%');
  };

  this.resetProgressBar = (e) => {
    $(e).css('width', '0%');
  };

  this.updateProgressBarXHR = (e) => {
    const xhr = new window.XMLHttpRequest();
    
    xhr.upload.addEventListener("progress", (evt) => {
      if (evt.lengthComputable) {
        $(e).css('width', `${(evt.loaded / evt.total) * 100}%`);
      }
    }, false);
    return xhr;
  };
  
  this.updateProgressBarTimer = (e, time) => {
    that.fillProgressBar(e);

    let tmpWidth = 100;
    const subTick = 100 / (time / settings.imgPreviewInterval);

    const previewInterval = window.setInterval(() => {
      tmpWidth -= subTick;
      if(tmpWidth > 0.0)
      {
        $(e).css('width', `${tmpWidth}%`);
      }
    }, settings.imgPreviewInterval);

    window.setTimeout(function () {
      clearInterval(previewInterval);
      that.clearImgPreview();
      that.resetProgressBar(e);
    }, time);

  };

  /**
   * Data validation
   */
  this.validFileType = file => {
    for(const fileType of settings.fileTypes)
    {
      if(file.type === fileType)
      {
        return true;
      }
    }
  
    return false;
  }

  this.validFileSize = file => file.size < settings.maxFileSize;

  /**
   * Upload area display
   */
  this.uploadAreaReset = _ => {
    if(that.$imgUploadFileAreaResults.hasClass('imgUploadSuccess'))
    { that.$imgUploadFileAreaResults.removeClass('imgUploadSuccess') }

    if(that.$imgUploadFileAreaResults.hasClass('imgUploadError'))
    { that.$imgUploadFileAreaResults.removeClass('imgUploadError') }
  }

  this.uploadAreaSuccess = _ => {
    if(!that.$imgUploadFileAreaResults.hasClass('imgUploadSuccess'))
    { that.$imgUploadFileAreaResults.addClass('imgUploadSuccess') }

    window.setTimeout(function () {
      that.uploadAreaReset();
    }, settings.imgPreviewTimeout);
  }

  this.uploadAreaError = _ => {
    if(!that.$imgUploadFileAreaResults.hasClass('imgUploadError'))
    { that.$imgUploadFileAreaResults.addClass('imgUploadError') }

    window.setTimeout(function () {
      that.uploadAreaReset();
    }, settings.imgPreviewTimeout);
  }

  this.retrieveImageFromClipboardAsBlob = (pasteEvent, callback) => {
    if(pasteEvent.clipboardData == false){
      if(typeof(callback) == "function"){
          callback(undefined);
      }
    };

    const clipboardData = pasteEvent.clipboardData;
    const items = clipboardData.items;

    if(items == undefined){
      if(typeof(callback) == "function"){
          callback(undefined);
      }
    };

    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") == -1) 
      {
        if(items[i].type.indexOf("plain") == -1)
        {
          continue;
        }
        
        const fileText = clipboardData.getData('Text');

        $(`<img id="testimg" src=${fileText} />`)
          .on('load', function() {
            const regexp = app.Helpers.getImageFilterRegex();
            if(!regexp.test(fileText))
            { that.handleLinkImgUpload(fileText) }

            $(this)[0].remove();
          })
          .on("error", function () {
            that.handleLinkImgUpload(fileText);
            $(this)[0].remove();
        });
        continue;

      }
      const blob = items[i].getAsFile();

      if(typeof(callback) == "function"){
        callback(blob);
      }
    }
  };


  /***************/
  /*   HANDLES   */
  /***************/


  /**
   * File upload from upload area
   */
  this.handleFileImgUpload = (imgFile) => {
    const reader = new FileReader();

    if(!that.validFileType(imgFile))
    {
      that.uploadAreaError();
      alert(app.t('imageUpload[.]Wrong file format!'));
      that.$imgUploadArea.val('');
      return; 
    }

    if(!that.validFileSize(imgFile))
    {
      that.uploadAreaError();
      alert(app.t('imageUpload[.]The file is too big!'));
      that.$imgUploadArea.val('');
      return;
    }

    reader.onload = function (e) {
      const data = app.Helpers.toBase64Raw(e.target.result);

      that.setImgPreview(e.target.result);

			$.ajax({
				xhr: () => { return that.updateProgressBarXHR(that.$imgUploadProgressBarUpload) },
				url: 'https://api.imgur.com/3/image',
				headers: {'Authorization': `Client-ID ${settings.imgurAPIkey}`},
				type: 'POST',
				data: {'image': data, 'type': 'base64'},
				beforeSend: function () {
          that.resetProgressBars();
					that.$imgUploadArea.css({'cursor': 'wait'});
				},
				success: function (res) {
          app.Helpers.addMessageToChatInput(` ${res.data.link.substring(0)} `, 'end');

          that.uploadAreaSuccess();

          that.resetProgressBar(that.$imgUploadProgressBarUpload);
          that.updateProgressBarTimer(that.$imgUploadProgressBarPreview, settings.imgPreviewTimeout);
          
          that.$imgUploadArea.val('');
          that.$imgUploadArea.css({'cursor': 'auto'});
				},
				error: function () {
          alert(app.t('imageUpload[.]Upload failed!'));
          that.$imgUploadArea.val('');
          that.$imgUploadArea.css({'cursor': 'auto'});
          that.clearImgPreview();
          that.resetProgressBars();
				}
			});
	  };

	  reader.readAsDataURL(imgFile);
  };

  /**
   * File upload from link input
   */
  this.handleLinkImgUpload = (imgLink) => {
    $.ajax({
      xhr: () => { return that.updateProgressBarXHR(that.$imgUploadProgressBarUpload) },
      url: `https://api.imgbb.com/1/upload?key=${settings.imgbbAPIkey}`,
      type: 'POST',
      data: {'image': `${imgLink}`},
      beforeSend: function () {
        that.resetProgressBars();
        that.$imgUploadArea.css({'cursor': 'wait'});
      },
      success: function (res) {
        const newImgLink = res.data.url.substring(0);
        that.setImgPreview(newImgLink);

        let cl = $('#chatline').val();
        cl = cl.replace(imgLink, '');
        $('#chatline').val(cl);

        app.Helpers.addMessageToChatInput(` ${newImgLink} `, 'end');

        that.uploadAreaSuccess();

        that.resetProgressBar(that.$imgUploadProgressBarUpload);
        that.updateProgressBarTimer(that.$imgUploadProgressBarPreview, settings.imgPreviewTimeout);
        
        that.$imgUploadArea.val('');
        that.$imgUploadArea.css({'cursor': 'auto'});
      },
      error: function () {
        that.$imgUploadArea.val('');
        that.$imgUploadArea.css({'cursor': 'auto'});
        that.clearImgPreview();
        that.resetProgressBars();
      }
    });
  };

  /**
   * File upload from clipboard
   */
  this.handleBufferImgUpload = _ => {
    window.addEventListener("paste", function(e){
      that.retrieveImageFromClipboardAsBlob(e, function(imageBlob){
        if(imageBlob){
          that.handleFileImgUpload(imageBlob);
        }
      });
    }, false);
  };
  this.handleBufferImgUpload();

});