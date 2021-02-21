window.cytubeEnhanced.addModule('videoRewindButton', function (app, settings) {
  'use strict';

  var that = this;

  var defaultSettings = {
    rewindRate: 10
  };

  settings = $.extend({}, defaultSettings, settings);

  this.playerRewind = function (rewindTime) {

    if (typeof rewindTime !== 'number')
      return;

    PLAYER.getTime(function(c) { 
      let currentSeconds = c;

      let rewindedTime = currentSeconds + rewindTime;

      USEROPTS.synch = false;

      PLAYER.seekTo(rewindedTime);

      $('#videoRewindButton').attr("disabled", true);

      let newTime = currentSeconds + Math.abs(rewindTime);
      
      setTimeout(_ => {
          PLAYER.seekTo(newTime);
          USEROPTS.synch = true;
          $('#videoRewindButton').attr("disabled", false);
      }, Math.abs(rewindTime) * 1000);
    });
  };

  this.setup = function () {
    if ($("#videoRewindButton").length == 0)
    {
      $('<button>')
        .addClass('btn')
        .addClass('btn-sm')
        .addClass('btn-default')
        .attr('id','videoRewindButton')
        .attr('title',`Отмотать на ${settings.rewindRate} секунд`)
        .attr("disabled", false)
        .html(`<span class="glyphicon glyphicon-backward"><strong> ${settings.rewindRate}</strong></span>`)
        .prependTo($('#videocontrols'))
        .click(_ => { that.playerRewind(-(settings.rewindRate)) })
    }    
  };
  
  this.setup();
});