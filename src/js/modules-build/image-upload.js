window.cytubeEnhanced.addModule('imageUpload', function (app, settings) {
  'use strict';
  var that = this;


  /**
   * Settings
   */
  var defaultSettings = {
    imgurAPIkey:  '711a7fc76bd63f3',
    imgbbAPIkey:  '768701021ef291e095326ec8c25c5d3f'
  };

  settings = $.extend({}, defaultSettings, settings);


  if ($('#chat-panel').length === 0) {
    $('<div id="chat-panel" class="row">').insertAfter("#controlsrow");
  }

  if ($('#chat-controls').length === 0) {
      $('<div id="chat-controls" class="btn-group">').insertBefore('#newpollbtn');
  }


  /**
   * Create button toggle
   */
  if ($("#uploadbtn").length == 0)
  {
  this.$imgUploadBtn = $(`<button id="uploadbtn" class="btn btn-sm btn-default" title="${app.t('imageUpload[.]Upload a picture')}" />`)
    .html('<span class="glyphicon glyphicon-cloud-upload" />')
    .prependTo('#chat-controls')
    .on('click', function () {
      that.renderImgUploadArea();
    });
  }


  /**
   * Create img upload from link form
   */
  this.$imgUploadPanel = $('<div class="col-lg-12 col-md-12 col-sm-12 closePanel" id="imageUploadPanel" style="display: none;"></div>')
    .insertBefore( "#pollwrap" );

  this.$imgUploadPanelContent = $('<div class="well" id="imageUploadPanelContent"></div>')
    .append(`<div class="text-center"><strong>${app.t('imageUpload[.]Upload a picture')}</strong></div>`)
    .append('<br>')
    .append('<strong>Загрузить картинку по ссылке</strong>')
    .append('<p>Если не удается запостить картинку в чат, загрузите её с помощью этой формы</p>')
    .appendTo(this.$imgUploadPanel);
  

  /**
   * From link
   */
  this.$imgUploadFromLinkInput = $(`<input class="form-control img-upload-link-input not-contained" type="text" id="imgUploadLink" placeholder="${app.t('imageUpload[.]Image address')}">`);
  
  this.$imgUploadFromLinkBtn = $(`<div class="c-wrap"><span class="btn btn-sm btn-info img-upload-link-btn" title="${app.t('imageUpload[.]Upload a picture from the link')}"><span class="glyphicon glyphicon-open-file" /></span></div>`);

  this.$imgUploadPanelContent.append(this.$imgUploadFromLinkInput);
  this.$imgUploadPanelContent.append(this.$imgUploadFromLinkBtn);
  this.$imgUploadPanelContent.append('<br>');

  /**
   * From file
   */
  this.$imgUploadPanelContent.append('<strong>Загрузить картинку с компьютера</strong>');

  this.$imgUploadForm = $('<form action method="post">').appendTo(this.$imgUploadPanelContent);
  this.$imgUploadFormGroup = $('<div class="form-group file-area">').appendTo(this.$imgUploadForm);

  this.$imgUploadArea = $('<input type="file" name="images" id="imgUploadArea" required="required" multiple="multiple"/>')
    .appendTo(this.$imgUploadFormGroup);
  this.$imgUploadProgressBar = $('<div id="imgProgress"><div id="imgProgressBar"></div></div>')
    .appendTo(this.$imgUploadFormGroup);

  this.$imgUploadFileAreaResults = $(`
    <div class="file-dummy">
      <div class="success"><strong>Картинка загружена!</strong></div>
      <div class="default"><strong>Выберите картинку.</strong></div>
      <br>
      <img src="" id="imgPreview" style="max-width:80%; max-height=60%;"/>
    </div>
  `).appendTo(this.$imgUploadFormGroup);



  this.renderImgUploadArea = function () {
    var $imageUploadPanel = $("#imageUploadPanel");

    if ( $imageUploadPanel.hasClass('openPanel') ) {
      $imageUploadPanel.hide();


      $imageUploadPanel.removeClass('openPanel')	
      $imageUploadPanel.addClass('closePanel')	
    } else {
      $imageUploadPanel.show();
      

      $imageUploadPanel.removeClass('closePanel')	
      $imageUploadPanel.addClass('openPanel')	
    }
  };
 

});