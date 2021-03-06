window.cytubeEnhanced.addModule('customCss', function (app, settings) {
    'use strict';
    var that = this;

    var defaultSettings = {
        aceUrl: 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.3/ace.js'
    };
    settings = $.extend({}, defaultSettings, settings);

    var tab = app.Settings.getTab('custom-css', 'CSS', 200);
    var namespace = 'user-code';

    var userSettingsFromV1 = app.parseJSON(window.getOrDefault(window.CHANNEL.name + "_config-layout", undefined), {});
    app.Settings.storage.setDefault(namespace + '.css', (_.isPlainObject(userSettingsFromV1) && _.isString(userSettingsFromV1['user-css'])) ? userSettingsFromV1['user-css'] : '');

    var $editor = $('<textarea class="' + app.prefix + 'custom-editor-textarea"></textarea>').val(app.Settings.storage.get(namespace + '.css')).appendTo(tab.$content);
    var $aceEditor = $('<div class="' + app.prefix + 'custom-editor-ace" id="' + app.prefix + 'css-editor"></div>').text(app.Settings.storage.get(namespace + '.css'));
    var aceEditor;


    tab.onShow(function () {
        if (typeof aceEditor === 'undefined') {
            if (typeof window.ace === 'undefined') {
                if (!app.Settings.aceIsLoading && !app.Settings.aceLoadingFailed) {
                    app.Settings.aceIsLoading = true;

                    $.ajax({
                        url: settings.aceUrl,
                        dataType: "script",
                        timeout: 20000 //20 sec
                    }).done(function () {
                        that.initializeAceEditor();
                    }).always(function () {
                        app.Settings.aceIsLoading = false;
                        app.Settings.aceLoadingFailed = true;
                        tab.$content.toggleLoader('off');
                    });
                }

                if (app.Settings.aceIsLoading && !app.Settings.aceLoadingFailed) {
                    tab.$content.toggleLoader('on');
                }
            } else {
                that.initializeAceEditor();
            }
        }
    });


    this.applyUserCss = function (css) {
        $('#' + app.prefix + 'user-css').remove();
        $('head').append('<style id="' + app.prefix + 'user-css" type="text/css">' + css + '</style>');
    };


    this.initializeAceEditor = function () {
        $aceEditor.text($editor.val());
        $editor.replaceWith($aceEditor);

        aceEditor = window.ace.edit(app.prefix + 'css-editor');
        aceEditor.setTheme("ace/theme/tomorrow_night");
        aceEditor.getSession().setMode("ace/mode/css");
        aceEditor.getSession().setTabSize(4);
        aceEditor.getSession().setUseSoftTabs(true);
        aceEditor.getSession().setUseWrapMode(true);
        aceEditor.getSession().setWrapLimitRange();
        aceEditor.setOptions({
            minLines: 30,
            maxLines: 30,
            autoScrollEditorIntoView: true,
            highlightActiveLine: true
        });
    };


    /**
     * Saving and applying settings
     */
    app.Settings.onSave(function (settings) {
        if (aceEditor) {
            settings.set(namespace + '.css', aceEditor.getValue());
        } else {
            settings.set(namespace + '.css', $editor.val());
        }

        that.applyUserCss(settings.get(namespace + '.css'));
    });
    this.applyUserCss(app.Settings.storage.get(namespace + '.css'));
});
