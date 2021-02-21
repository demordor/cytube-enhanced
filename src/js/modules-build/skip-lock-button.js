window.cytubeEnhanced.addModule('skipLockButton', function (app, settings) {
  'use strict';
  
  if (CLIENT.rank >= 2 && $("#skipLockButton").length == 0)
  {
    let slState = CHANNEL.opts.allow_voteskip ? "success" : "danger";
    
    $('<button>')
      .addClass('btn')
      .addClass('btn-sm')
      .addClass(`btn-${slState}`)
      .attr('id','skipLockButton')
      .attr('title','Вкл / Выкл скиплок')
      .html(`<span class="glyphicon glyphicon-step-forward" />`)
      .prependTo($('#videocontrols'))
      .click(_ => { $('#cs-allow_voteskip')[0].click() })

    window.socket.on("channelOpts", function(opts){
      let skipLockState = !opts.allow_voteskip;

      var skipLockBtn = $("#skipLockButton");

      if (skipLockState) {
        if(skipLockBtn.hasClass('btn-success'))
          skipLockBtn.removeClass('btn-success');

        if(!skipLockBtn.hasClass('btn-danger'))
          skipLockBtn.addClass('btn-danger');
      }
      else {
        if(skipLockBtn.hasClass('btn-danger'))
          skipLockBtn.removeClass('btn-danger');

        if(!skipLockBtn.hasClass('btn-success'))
          skipLockBtn.addClass('btn-success');
      }
    });
  }

});