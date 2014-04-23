/**
 * Created by Ely on 4/12/2014.
 */
(function () {
    /**
     * Media Time Helper
     * @description Helps with rendering media (audio/video)  object time to
     * human friendly versions.
     * @return void
     */
    function MediaTime() {
        /**
         * Returns an object containing the hours, minutes and seconds of the secs
         * value.
         * @param secs number
         * @return object default {hours: 0, minutes: 0, seconds: 0}
         */
        this.resolveFromSecs = function (secs) {
            var output = {
                hours: 0,
                minutes: 0,
                seconds: 0
            };
            output.minutes = secs >= 60 ? Math.floor(secs / 60)  : 0;
            output.seconds = secs >= 60 ? Math.floor(secs % 60)  : Math.floor(secs);
            output.hours = output.minutes >= 60 ? Math.floor(output.minutes / 60) : 0;
            return output;
        };

        /**
         * Appends a zero to single digit numbers.
         * @param num Number
         * @return String default '00'
         */
        this.leadingZero = function (num) {
            if (num < 10) {
                num =  '0' + num;
            }
            return num;
        };

        /**
         * Pretty print the time
         * @param obj object expected {hours: number,
     *   minutes: number, seconds: number}
         * @optional-param boolean flag for printing the hours place
         * @return string default '00:00'
         */
        this.prettyPrint = function (obj) {
            var output = (!sjl.empty(arguments[1])  ? this.leadingZero(obj.hours)  +
                ':' : '')  + this.leadingZero(obj.minutes)  + ':' +
                this.leadingZero(obj.seconds);
            return output;
        };

        /**
         * Pretty prints the time passed in the secs variable.
         * @param secs Number
         * @optional-param boolean optional flag for printing the hours place
         * @return string default '00:00'
         */
        this.prettyPrintFromSecs = function (secs) {
            if (!sjl.empty(arguments[1]) ) {
                return this.prettyPrint(this.resolveFromSecs(secs) , arguments[1]);
            }
            return this.prettyPrint(this.resolveFromSecs(secs) );
        };
    }

    $.widget( "jui.juiAudioPlayer", $.jui.juiBase, {
        // default options
        options: {

            template:
                '<a class="ap-btn prev-btn"><span class="ui-icon ui-icon-seek-prev"></span></a>' +
                '<a class="ap-btn stop-btn"><span class="ui-icon ui-icon-stop"></span></a>' +
                '<a class="ap-btn play-btn"><span class="ui-icon ui-icon-play"></span></a>' +
                '<a class="ap-btn next-btn"><span class="ui-icon ui-icon-seek-next"></span></a>' +
                '<div class="lcd-screen"><div class="song-info"></div></div>' +
                '<div class="volume-panel">' +
                    '<a class="ap-btn volume-btn"><span class="ui-icon ui-icon-volume-on"></span></a>' +
                    '<div class="slider-holder cb fl"><span class="ui-icon ui-icon-plus"></span>' +
                        '<div class="slider"></div><span class="ui-icon ui-icon-minus"></span></div>' +
                        '<br class="cb" />' +
                '</div><!--/.volume-panel-->' +
                '<div class="progress-bars">' +
                    '<div class="load-progress-bar progress-bar"></div>' +
                    '<div class="play-progress-bar progress-bar"></div>' +
                '</div><br class="cb" />',

            width: 550,
            height: 36,
            animation: {
                speed: 300
            },
            audio: {
                autoplay: true,
                preload: false,
                volume: .6,
                lastVolume: .6,
                obj: null,
                pointer: 0,
                pointer_direction: 1,
                xmlList: null,
                timeHelper: null,
                playing: false
            },
            ui: {
                firstBtn: {
                    elm: null,
                    selector: '.first-btn.btn',
                    enabled: true
                },
                prevBtn: {
                    elm: null,
                    selector: '.prev-btn.btn',
                    enabled: true
                },
                stopBtn: {
                    elm: null,
                    selector: '.stop-btn.btn',
                    enabled: true
                },
                playBtn: {
                    elm: null,
                    selector: '.play-btn.btn',
                    onIconCssClass: 'ui-icon-play',
                    offIconCssClass: 'ui-icon-pause',
                    enabled: true
                },
                nextBtn: {
                    elm: null,
                    selector: '.next-btn.btn',
                    enabled: true
                },
                lastBtn: {
                    elm: null,
                    selector: '.last-btn.btn',
                    enabled: true
                },

                // Toggles volume, and optionally displays a
                // volume slider
                volumeBtn: {
                    elm: null,
                    selector: '.volume-btn.btn',
                    onIconCssClass: 'ui-icon-volume-on',
                    offIconCssClass: 'ui-icon-volume-off',
                    enabled: true
                },
                volumeSlider: {
                    elm: null,
                    selector: '.volume-slider',
                    enabled: true
                },
                audioPlayProgressBar: {
                    elm: null,
                    selector: '.play-progress-bar',
                    enabled: true
                },
                audioLoadProgressBar: {
                    elm: null,
                    selector: '.load-progress-bar',
                    enabled: true
                },
                audioTitleElm: {
                    elm: null,
                    selector: '.audio-title',
                    loadingText: 'Loading...',
                    enabled: true
                },
                audioTotalTimeElm: {
                    elm: null,
                    selector: '.audio-total-time',
                    enabled: true
                },
                audioCurrentTimeElm: {
                    elm: null,
                    selector: '.audio-current-time',
                    enabled: true
                }
            },
            playlist: null,
            debug_output: '',
            debug: true
        },

        // the constructor
        _create: function () {

            var self = this,
                ops = self.options;

            // Audio object support check
            if (typeof Audio != 'function') {
                alert('Html 5 Audio not supported by this browser.');
            }

            // @todo validate template here
            this.element.html(this.options.template);

            // Initialize Audio Object
            var audio_ns = this.options.audio;
            audio_ns.obj = audio_ns.obj || new Audio();
            audio_ns.obj.volume = audio_ns.volume;
            audio_ns.obj.autoplay = audio_ns.autoplay;
            audio_ns.obj.preload = audio_ns.preload;

            // Set audio time helper for now
            // @todo decide what to do with the media time helper class
            if (sjl.empty(audio_ns.timeHelper) ) {
                audio_ns.timeHelper = new MediaTime();
            }

            // Add listeners to our controls
            this._addControlListeners();

            // Add listeners to our audio object
            this._addAudioObjectListeners();

            // Set initial loading text
            this.setAudioTitleElmText('Loading...');

            // Start the playing audio
            this.gotoAudioSrcNum(0);

            // Set volume
            this.changeVolume(audio_ns.obj.volume);

            // Set volume slider if necessary
            if (this.options.controls.volumeSlider.enabled) {
                this.options.controls.volumeSlider.elm.slider('value',
                        audio_ns.obj.volume * 100);
            }
        },

        nextAudio: function () {
            this.options.audio.playing = false;

            // Goto audio src number
            this.gotoAudioSrcNum(this.options.audio.pointer);
        },

        prevAudio: function () {
            this.options.audio.playing = false;

            // Goto audio src number
            this.gotoAudioSrcNum(this.options.audio.pointer);
        },

        playAudio: function () {
            var audio_ns = this.options.audio, offClass, onClass;
            if (audio_ns.playing === false) {
                this.options.audio.playing = true;
                this.options.audio.obj.play();
                onClass = this.options.controls.playBtn.offIconCssClass;
                offClass = this.options.controls.playBtn.onIconCssClass;
            }
            else {
                this.options.audio.playing = false;
                this.options.audio.obj.pause();
                onClass = this.options.controls.playBtn.onIconCssClass;
                offClass = this.options.controls.playBtn.offIconCssClass;
            }

            // Set icon class
            $('span', this.options.controls.playBtn.elm) .
                switchClass(offClass, onClass);
        },

        stopAudio: function () {
            this.options.audio.obj.pause();
            this.options.audio.obj.currentTime = 0;
        },

        seekAudio: function (posInSecs) {
            posInSecs = posInSecs;
            if (posInSecs < this.options.audio.obj.duration
                && posInSecs > -1) {
                this.options.audio.obj.currentTime = posInSecs;
                return;
            }
            alert('Range Exception: Jquery Simple Audio Player Widget says: ' +
                'Cannot not seek audio to position: ' + posInSecs +
                'Position out of range.');
        },

        volumeToggle: function () {
            var audio_ns = this.options.audio, app = this,
                volume;
            if (audio_ns.obj.volume > 0) {
                audio_ns.lastVolume = audio_ns.obj.volume;
                volume = 0;
            }
            else {
                volume = audio_ns.lastVolume || audio_ns.volume;
            }

            // Set volume
            this.changeVolume(volume);

            // Set volume slider
            app.options.controls.volumeSlider.elm.slider({
                value: audio_ns.obj.volume * 100});
        },

        changeVolume: function (value) {
            var app = this,
                offClass, onClass;

            if (value > 1) {
                value = 1;
            }

            if (value <= 1 && value > 0) {
                onClass = app.options.controls.volumeBtn.onIconCssClass;
                offClass = app.options.controls.volumeBtn.offIconCssClass;
            }

            if (value < 0) {
                value = 0;
            }

            if (value === 0) {
                onClass = app.options.controls.volumeBtn.offIconCssClass;
                offClass = app.options.controls.volumeBtn.onIconCssClass;
            }

            // Set icon
            $('span', app.options.controls.volumeBtn.elm) .
                switchClass(offClass, onClass);

            // Set volume
            this.options.audio.obj.volume = value;
        },

        gotoAudioSrcNum: function (srcNum)
        {
            // Get audio source number
            var srcElm = this.getAudioSrcElement(srcNum);

            // Set audio src
            this.options.audio.obj.src = $('directory',
                this.options.playlist.xml) .eq(0) .attr('name')
                + '/' + srcElm.attr('name');

            $('span', this.options.controls.playBtn.elm) .switchClass(
                this.options.controls.playBtn.onIconCssClass,
                this.options.controls.playBtn.offIconCssClass,
                'slow'
            );

            // Keep playing flag for ease of use
            this.options.audio.playing = true;

            // Set lcd-screen text
            this.setAudioTitleElmText(srcElm.attr('name') );
        },

        setAudioTitleElmText: function (value) {
            var app = this,
                elm = this.options.controls.audioTitleElm.elm;
            elm.fadeOut(
                app.options.animation.speed, function () {
                    $(this) .text(decodeURI(value) ) .fadeIn(
                        app.options.animation.speed);
                });
        },

        getAudioTitleElmText: function () {
            return this.options.audioTitleElm.text();
        },

        getAudioSrcElement: function (srcNum) {
            srcNum = srcNum;
            if (srcNum <= this.options.audio.xmlList.length &&
                srcNum >= 0) {
                return this.options.audio.xmlList.eq(srcNum);
            }
            alert('Range Exception: Jquery Edlc Audio Player Widget ' +
                'says: "Cannot get Audio Source Element Index`' +
                srcNum + '`.  Index out of range"');
            return 0;
        },

        _addControlListeners: function () {
            var ctrls = this.options.controls,
                app = this;

            // Previous button
            if (ctrls.prevBtn.enabled) {
                ctrls.prevBtn.elm.bind('click', function (e) {
                    app.prevAudio();
                });
            }

            // Next button
            if (ctrls.nextBtn.enabled) {
                ctrls.nextBtn.elm.bind('click', function (e) {
                    app.nextAudio();
                });
            }

            // Play button
            if (ctrls.playBtn.enabled) {
                ctrls.playBtn.elm.bind('click', function (e) {
                    app.playAudio();
                });
            }

            // Stop button
            if (ctrls.stopBtn.enabled) {
                ctrls.stopBtn.elm.bind('click', function (e) {
                    app.stopAudio();
                });
            }

            // Volume button
            if (ctrls.volumeBtn.enabled) {
                ctrls.volumeBtn.elm.bind('click', function (e) {
                    app.volumeToggle();
                });
            }

            // Volume Slider
            if (ctrls.volumeSlider.enabled) {
                ctrls.volumeSlider.elm.bind('slide', function (e, ui) {
                    app.changeVolume(ui.value * 0.01);
                });
            }

            // Play Progress Bar
            if (ctrls.audioPlayProgressBar.enabled) {
                ctrls.audioPlayProgressBar.elm.bind('click', function (e) {
                    var o = $(this) ,
                        clickPercent = 0.01 *
                            ((e.pageX - o.offset() .left)  / o.width()  * 100);
                    o.progressbar('value', clickPercent);
                    app.seekAudio(clickPercent *
                        app.options.audio.obj.duration);
                });
            }

            // The following elements don't need or have their listeners
            // handled else where
            // Load Progress Bar
            // Audio Current Time
            // Audio Total Time

        },

        _addAudioObjectListeners: function () {
            var audio_ns = this.options.audio,
                app = this;

            // On Playing
            $(audio_ns.obj) .bind('playing', function () {
                if (audio_ns.obj.readyState === audio_ns.obj.HAVE_ENOUGH_DATA) {
                    app.options.controls.audioLoadProgressBar.elm.
                        progressbar('value', 100);
                }
            });

            $(audio_ns.obj) .bind('ended', function () {
                app.nextAudio();
            });

            // On Load Metadata
            $(audio_ns.obj) .bind('loadedmetadata', function () {
                app.options.controls.audioPlayProgressBar.elm.
                    progressbar('value', 0);
                if (app.options.controls.audioCurrentTimeElm.enabled) {
                    var time = audio_ns.timeHelper.
                        prettyPrintFromSecs(audio_ns.obj.duration);
                    // Set the current time element text
                    app.options.controls.audioTotalTimeElm.elm.text(time);
                }
            });

            // On Load Progress
            $(audio_ns.obj) .bind('progress', function () {
                var progress =
                        audio_ns.obj.buffered.end(0)  / audio_ns.obj.duration * 100,
                    loadProgressBar = app.options.controls.audioLoadProgressBar.elm;

                // Set load progress bar
                loadProgressBar.progressbar('value', progress);
            });

            // On Time update
            $(audio_ns.obj) .bind('timeupdate', function (e) {
                var progress =
                        audio_ns.obj.currentTime / audio_ns.obj.duration * 100,
                    playProgressBar = app.options.controls.
                        audioPlayProgressBar.elm;

                if (app.options.controls.audioCurrentTimeElm.enabled) {
                    var time = audio_ns.timeHelper.
                        prettyPrintFromSecs(audio_ns.obj.currentTime);
                    // Set the current time element text
                    app.options.controls.audioCurrentTimeElm.elm.text(time);
                }

                // Set the play progress bar
                playProgressBar.progressbar('value', progress);
            });
        }



    });

})();