/**
 * Created by ElyDeLaCruz on 1/21/14.
 */
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

        template: '<div class="jui-dialog">' +
            '<header><div class="title"></div></header>' +
            '<section class="content"></section>' +
            '<footer></footer>' +
            '</div>',

        useTemplate: false,

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

    /**
     * Sets flag if touch device (used for disable plugin if options.disableOnTouchDevice
     * is true).
     * @private
     */
    _create: function () {
        var ops = this.options;
        // If using modernizr and is touch enabled device, set flag
        if ($('html').hasClass('touch') && ops.disableOnTouchDevice) {
            ops.isTouchDevice = true;
        }
    },

    _init: function () {
        var self = this,
            ops = self.options;

        // Timeline (animation object)
        ops.timeline = new TimelineMax({paused: true});

        // Populate ui elements on self (self.options.ui[elmKeyAlias])
        self._populateUiElementsFromOptions();

        // Set `class name` from options
        self._setClassNameFromOptions();

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

    _setTitleText: function () {

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
            pageOverlay = self.getUiElement('pageOverlay');

        // Overlay display none onclick
        pageOverlay.bind('click', function (e) {
            e.preventDefault();
            self.close();
        });
    },

    close: function () {
        this.getUiElement('pageOverlay').css({display: 'none'});
        this.getUiElement('wrapperElm').css({display: 'none'});
    },

    open: function () {
        this.getUiElement('pageOverlay').css({display: 'block'});
        this.getUiElement('wrapperElm').css({display: 'block'});
    },


    /**
     * Destroys `this` instance.
     * - and calls _super's destroy method (to finish up the cleaning process);
     * @returns {void}
     */
    destroy: function () {
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
