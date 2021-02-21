window.cytubeEnhanced.addModule('additionalChatCommands', function (app, settings) {
    'use strict';
    var that = this;

    var defaultSettings = {
        permittedCommands: ['*']
    };
    settings = $.extend({}, defaultSettings, settings);
    settings.permittedCommands = _.isArray(settings.permittedCommands) ? settings.permittedCommands : [];
    settings.permittedCommands = _.map(settings.permittedCommands, function (value) { return _.toLower(value); });

    this.$chatline = $('#chatline');


    this.isCommandPermitted = function (commandName) {
        if (that.commandsList[commandName]) {
            if (that.commandsList[commandName].canBeOmitted) {
                return settings.permittedCommands.indexOf('*') !== -1 || settings.permittedCommands.indexOf(commandName) !== -1;
            } else {
                return true;
            }
        } else {
            return false;
        }
    };


    this.askAnswers = ["100%", app.t('qCommands[.]of course'), app.t('qCommands[.]yes'), app.t('qCommands[.]maybe'), app.t('qCommands[.]impossible'), app.t('qCommands[.]no way'), app.t('qCommands[.]don\'t think so'), app.t('qCommands[.]no'), "50/50", app.t('qCommands[.]cirno is busy'), app.t('qCommands[.]I regret to inform you')];


    /**
     * Quotes for !q command
     * @type {Array}
     */
    this.randomQuotes = [];


    /**
     *The list of commands
     *
     * Every command must have method value(message) which returns command's message.
     * Commands can also have description property for chatCommandsHelp module and isAvailable method which returns false if command is not permitted (by default returns true)
     *
     * @type {object}
     */
    this.commandsList = {
        '!pick': {
            description: app.t('chatCommands[.]random option from the list of options (!pick option1, option2, option3)'),
            value: function (msg) {
                var formattedMsg = _.trim(msg.replace('!pick', ''));

                if (formattedMsg === '') {
                    return app.t('chatCommands[.]Use !pick variant1, variant2');
                } else {
                    var variants = formattedMsg.split(',');
                    return _.trim(variants[Math.floor(Math.random() * variants.length)]);
                }
            },
            canBeOmitted: true
        },
        '!ask': {
            description: app.t('chatCommands[.]asking a question with yes/no/... type answer (e.g. <i>!ask Will i be rich?</i>)'),
            value: function () {
                return that.askAnswers[Math.floor(Math.random() * that.askAnswers.length)];
            },
            canBeOmitted: true
        },
        '!time': {
            description: app.t('chatCommands[.]show the current time'),
            value: function () {
                var h = new Date().getHours();
                if (h < 10) {
                    h = '0' + h;
                }

                var m = new Date().getMinutes();
                if (m < 10) {
                    m = '0' + m;
                }

                return app.t('chatCommands[.]current time') + ': ' + h + ':' + m;
            },
            canBeOmitted: true
        },
        '!dice': {
            description: app.t('chatCommands[.]throw a dice'),
            value: function () {
                return Math.floor(Math.random() * 5) + 1;
            },
            canBeOmitted: true
        },
        '!roll': {
            description: app.t('chatCommands[.]random number between 0 and 999'),
            value: function () {
                var randomNumber = Math.floor(Math.random() * 1000);

                if (randomNumber < 100) {
                    randomNumber = '0' + randomNumber;
                } else if (randomNumber < 10) {
                    randomNumber= '00' + randomNumber;
                }

                return randomNumber;
            },
            canBeOmitted: true
        },
        '!q': {
            description: app.t('chatCommands[.]show the random quote'),
            value: function (msg) {
                if (that.randomQuotes.length === 0) {
                    msg = app.t('chatCommands[.]there aren\'t any quotes.');
                } else {
                    msg = that.randomQuotes[Math.floor(Math.random() * (that.randomQuotes.length - 1))];
                }

                return msg;
            },
            canBeOmitted: true
        },
        '!skip': {
            description: app.t('chatCommands[.]vote for the video skip'),
            value: function (msg) {
                window.socket.emit("voteskip");
                msg = app.t('chatCommands[.]you have been voted for the video skip');

                return msg;
            },
            isAvailable: function () {
                return window.hasPermission('voteskip');
            },
            canBeOmitted: true
        },
        '!next': {
            description: app.t('chatCommands[.]play the next video'),
            value: function (msg) {
                window.socket.emit("playNext");
                msg = app.t('chatCommands[.]the next video is playing');

                return msg;
            },
            isAvailable: function () {
                return window.hasPermission('playlistjump');
            },
            canBeOmitted: true
        },
        '!bump': {
            description: app.t('chatCommands[.]bump the last video'),
            value: function (msg) {
                var $lastEntry = $('#queue').find('.queue_entry').last();
                var uid = $lastEntry.data("uid");
                var title = $lastEntry.find('.qe_title').html();

                window.socket.emit("moveMedia", {from: uid, after: window.PL_CURRENT});

                msg = app.t('chatCommands[.]the last video was bumped') + title;

                return msg;
            },
            isAvailable: function () {
                return window.hasPermission('playlistmove');
            },
            canBeOmitted: true
        },
        '!add': {
            description: app.t('chatCommands[.]adds the video to the end of the playlist (e.g. <i>!add https://www.youtube.com/watch?v=hh4gpgAZkc8</i>)'),
            value: function (msg) {
                var parsed = window.parseMediaLink(msg.split("!add ")[1]);

                if (parsed.id === null) {
                    msg = app.t('chatCommands[.]error: the wrong link');
                } else {
                    window.socket.emit("queue", {id: parsed.id, pos: "end", type: parsed.type});
                    msg = app.t('chatCommands[.]the video was added');
                }


                return msg;
            },
            isAvailable: function () {
                return window.hasPermission('playlistadd');
            },
            canBeOmitted: true
        },
        '!now': {
            description: app.t('chatCommands[.]show the current video\'s name'),
            value: function () {
                return app.t('chatCommands[.]now: ') + $(".queue_active a").html();
            },
            canBeOmitted: true
        },
        '!sm': {
            description: app.t('chatCommands[.]show the random emote'),
            value: function () {
                var smilesArray = window.CHANNEL.emotes.map(function (smile) {
                    return smile.name;
                });

                return smilesArray[Math.floor(Math.random() * smilesArray.length)] + ' ';
            },
            canBeOmitted: true
        },
        '!yoba': {
            description: app.t('chatCommands[.]the secret command'),
            value: function () {
                var IMBA = new Audio("https://dl.dropboxusercontent.com/s/olpmjho5dfvxho4/11%20Kobaryo%20-%20ヤンデレのハー_cut_192.mp3");
                IMBA.volume = 0.6;
                IMBA.play();

                return ' :dance: ';
            },
            canBeOmitted: true
        }
    };


    this.IS_COMMAND = false;
    this.prepareMessage = function (msg) {
        that.IS_COMMAND = false;

        for (var command in that.commandsList) {
            if (this.commandsList.hasOwnProperty(command) && _.toLower(_.trim(msg)).indexOf(command) === 0) {
                if (that.isCommandPermitted(command) && (that.commandsList[command].isAvailable ? that.commandsList[command].isAvailable() : true)) {
                    that.IS_COMMAND = true;

                    msg = that.commandsList[command].value(msg);
                }

                break;
            }
        }

        return msg;
    };


    this.sendUserChatMessage = function (e) {
        if(e.keyCode === 13) {
            if (window.CHATTHROTTLE) {
                return;
            }

            var msg = that.$chatline.val().trim();

            if(msg !== '') {
                var meta = {};

                if (window.USEROPTS.adminhat && window.CLIENT.rank >= 255) {
                    msg = "/a " + msg;
                } else if (window.USEROPTS.modhat && window.CLIENT.rank >= window.Rank.Moderator) {
                    meta.modflair = window.CLIENT.rank;
                }

                // The /m command no longer exists, so emulate it clientside
                if (window.CLIENT.rank >= 2 && msg.indexOf("/m ") === 0) {
                    meta.modflair = window.CLIENT.rank;
                    msg = msg.substring(3);
                }


                var msgForCommand = this.prepareMessage(msg);

                if (that.IS_COMMAND) {
                    window.socket.emit("chatMsg", {msg: msg, meta: meta});
                    window.socket.emit("chatMsg", {msg: 'Сырно: ' + msgForCommand});

                    that.IS_COMMAND = false;
                } else {
                    window.socket.emit("chatMsg", {msg: msg, meta: meta});
                }


                window.CHATHIST.push(that.$chatline.val());
                window.CHATHISTIDX = window.CHATHIST.length;
                that.$chatline.val('');
            }

            return;
        } else if(e.keyCode === 9) { // Tab completion
            try {
                window.chatTabComplete();
            } catch (error) {
                console.error(error);
            }
            e.preventDefault();
            return false;
        } else if(e.keyCode === 38) { // Up arrow (input history)
            if(window.CHATHISTIDX === window.CHATHIST.length) {
                window.CHATHIST.push(that.$chatline.val());
            }
            if(window.CHATHISTIDX > 0) {
                window.CHATHISTIDX--;
                that.$chatline.val(window.CHATHIST[window.CHATHISTIDX]);
            }

            e.preventDefault();
            return false;
        } else if(e.keyCode === 40) { // Down arrow (input history)
            if(window.CHATHISTIDX < window.CHATHIST.length - 1) {
                window.CHATHISTIDX++;
                that.$chatline.val(window.CHATHIST[window.CHATHISTIDX]);
            }

            e.preventDefault();
            return false;
        }
    };


    that.$chatline.off().on('keydown', function (e) {
        that.sendUserChatMessage(e);
    });

    $('#chatbtn').off().on('click', function (e) {
        that.sendUserChatMessage(e);
    });
});
