/**
 * Created by ElyDeLaCruz on 1/21/14.
 */
(function () {

    function returnSetVars() {
        return argsToArray(arguments).filter(function (value) {
            return isset(value);
        });
    }

    $.widget('jui.juiDialog', $.jui.juiBase, {

        /**
         * Options hash.
         * @type {Object}
         * @property className {String}
         * @property animation {Object}
         * @property labelText {String}
         */
        options: {

            /**
             * Class name added to wrapper element.
             * @param {String} default: 'jui-select-picker';
             */
            className: '',

            /**
             * Animation options.
             * @type {Object}
             */
            animation: {
                duration: 0.30
            },

            status: null,

            statuses: {
                OPENED: 1,
                CLOSED: 0
            },

            /**
             * Ui Hash.
             * @type {Object}
             */
            ui: {
                pageOverlay: {
                    elm: null,
                    attribs: {
                        'class': 'jui-page-overlay'
                    },
                    appendTo: "body",
                    selector: '.jui-page-overlay',
                    html: '<div></div>',
                    create: true
                },
                wrapperElm: {
                    elm: null,
                    attribs: {
                        'class': 'jui-dialog'
                    },
                    appendTo: "body",
                    selector: '.jui-dialog',
                    html: '<div></div>',
                    create: true
                },
                headerElm: {
                    elm: null,
                    selector: '> header',
                    html: '<header></header>',
                    appendTo: 'wrapperElm',
                    create: true
                },
                titleElm: {
                    elm: null,
                    attribs: {
                        'class': 'title'
                    },
                    text: '',
                    selector: '> .title',
                    html: '<div></div>',
                    appendTo: 'headerElm',
                    create: true
                },
                closeButtonElm: {
                    elm: null,
                    attribs: {
                        'class': 'close button'
                    },
                    selector: '> .close.button',
                    html: '<div>X</div>',
                    appendTo: 'headerElm',
                    create: true
                },
                contentElm: {
                    elm: null,
                    attribs: {
                        'class': 'content'
                    },
                    selector: '> .content',
                    html: '<section></section>',
                    appendTo: 'wrapperElm',
                    create: true
                },
                footerElm: {
                    elm: null,
                    selector: '> footer',
                    html: '<footer></footer>',
                    appendTo: 'wrapperElm',
                    create: true
                }
            }
        },

        _instances: [],

        /**
         * Sets flag if touch device (used for disable plugin if options.disableOnTouchDevice
         * is true).
         * @private
         */
        _create: function () {
            var self = this,
                ops = self.options;

            // If using modernizr and is touch enabled device, set flag
            if ($('html').hasClass('touch') && ops.disableOnTouchDevice) {
                ops.isTouchDevice = true;
            }
            // Push instance
            self._instances.push(this);

            // destroy any existing instances as there shouldn't be
            // more than one all blocking dialog at a time
            self._destroyAllInstances();
        },

        _init: function () {
            var self = this,
                ops = self.options;

            // Timeline (animation object)
            ops.timeline = new TimelineLite({paused: true});

            // Populate ui elements on self (self.options.ui[elmKeyAlias])
            self._populateUiElementsFromOptions();

            // Set `class name` from options
            self._setClassNameFromOptions();

            // Set `title text` from options
            self._setTitleText();

            // Set inner content to content from this element
            self._setContentFromThisElement();

            // Listeners
            self._addEventListeners();

            self.open();
        },

        _setClassNameFromOptions: function () {
            var self = this,
                ops = self.options,
                className = self.getValueFromHash('className', ops),
                currentClassName =
                    self.getValueFromHash('ui.wrapperElm.attribs', ops)['class'];

            // Resolve class name
            if (!empty(className)) {
                if (!empty(currentClassName)
                    && typeof currentClassName === 'string') {
                    ops.ui.wrapperElm.attribs['class'] += ' ' + className;
                }
                else {
                    ops.ui.wrapperElm.attribs['class'] = className;
                }
            }

            // Set class name on wrapper
            self.getUiElement('wrapperElm').attr('class',
                ops.ui.wrapperElm.attribs['class'])
        },

        _setContentFromThisElement: function () {
            this._clearContentElmContent()
                .html(this.element.text());
        },

        _clearContentElmContent: function () {
            return this.getUiElement('contentElm').html('');
        },

        /**
         * Adds event listeners for:
         * - wrapper - mouseup;
         * - wrapper - a[data-value] click;
         * - select element - change;
         * @private
         */
        _addEventListeners: function () {
            var self = this,
                ops = self.options,
                wrapperElm = self.getUiElement('wrapperElm'),
                pageOverlay = self.getUiElement('pageOverlay'),
                closeBtnElm = self.getUiElement('closeButtonElm');

            // Overlay display none onclick
            pageOverlay.bind('click', function (e) {
                e.preventDefault();
                self.close();
            });

            closeBtnElm.bind('click', function (e) {
                e.preventDefault();
                self.close();
            });
        },

        _destroy: function () {
            this._removeCreatedElements();
        },

        _destroyAllInstances: function () {
            for (var i = 0; i < this._instances.length; i += 1) {
                this._instances[i].destroy();
            }
        },

        _setTitleText: function (value, typeKey) {
            typeKey = typeKey || 'text';
            var self = this,
                ops = self.options,
                text = returnSetVars(
                    value,
                    ops.titleText,
                    ops.ui.titleElm.text,
                    self.element.attr('title')
                )[0];

            // Set the text elements html
            self.getUiElement('titleElm')[typeKey](text);
        },

        setClassName: function (value) {
            this._namespace('titleText', value);
            this._setClassNameFromOptions();
        },

        setTitleText: function (value, typeKey) {
            this._setTitleText(value, typeKey);
            return this;
        },

        close: function () {
            var self = this,
                ops = self.options;
            self.getUiElement('pageOverlay').css({display: 'none'});
            self.getUiElement('wrapperElm').css({display: 'none'});
            ops.status = ops.statuses.CLOSED;
        },

        open: function () {
            var self = this,
                ops = self.options;
            self.getUiElement('pageOverlay').css({display: 'block'});
            self.getUiElement('wrapperElm').css({display: 'block'});
            ops.status = ops.statuses.OPENED;
        },

        /**
         * Destroys `this` instance.
         * - and calls _super's destroy method (to finish up the cleaning process);
         * @returns {void}
         */
        destroy: function () {
            this._destroy();
            this._super();
        },

        /**
         * Plays animation timeline (if disableOnTouchDevice is true and isTouchDevice, does nothing).
         * @return {void}
         */
        playAnimation: function () {
            var self = this,
                ops = self.options;
            ops.timeline.play();
        },

        /**
         * Reverses the animation timeline if not touch device.
         * @return {void}
         */
        reverseAnimation: function () {
            var self = this,
                ops = self.options;
            ops.timeline.reverse();
        }
    });

})();
