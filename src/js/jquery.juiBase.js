/**
 * JUI Plugins Base.
 * @class $.jui.juiBase
 * @extends jQuery.Widget
 * @requires jQuery, jQuery.ui, jquery.widget
 *
 * @created with JetBrains WebStorm.
 * @user: ElyDeLaCruz
 * @date: 9/1/13
 * @time: 4:27 AM
 *
 * @todo -- issue solved -- make sure all classes that need a timeline object
 * implement their own `getTimeline` method.
 * ~~~deprecated~~~
 * Resolve issue with non-unique timeline object -
 * Timeline object seems to be only one instance not new instances on
 * new calls of the extending plugins.
 *
 * @todo start using $.each instead of Object.keys (gets rid of one more dependancy)
 *
 */
$.widget('jui.juiBase', {

    /**
     * Options hash.
     * @property options
     * @type {Object}
     */
    options: {
        /**
         * Flag for disabling plugins on touch devices (and using devices default).
         * @property disableOnTouchDevice
         * @type {Boolean}
         */
        disableOnTouchDevice: true,

        /**
         * Is touch device
         * @property isTouchDevice
         * @type {Boolean}
         */
        isTouchDevice: false,

        /**
         * Less than ie9
         * @property isLessThanIE9
         * @type {Boolean}
         */
        isLessThanIE9: false,

        /**
         * Default Timeline Class
         * @property defaultTimelineClass
         * @type {String}
         */
        defaultTimelineClass: 'TimelineLite',

        /**
         * Gsap Timeline object
         * @property timeline
         * @type {Timeline}
         */
        timeline: null,

        /**
         * Ui hash for ui element
         * @property ui
         * @type {Object}
         */
        ui: {},

        uiElmPropagateOrder: ['selector', 'creation']
    },


    /**
     * Sets flag if touch device (used for disable plugin if options.disableOnTouchDevice
     * is true) and also tracks browsers less than ie9.
     * @method _create
     * @protected
     */
    _create: function () {
        var ops = this.options;
        // If using modernizr and is touch enabled device, set flag
        if ($('html').hasClass('touch') && ops.disableOnTouchDevice) {
            ops.isTouchDevice = true;
        }

        // Track browsers less than ie9
        if ($('html').hasClass('lt-ie9')) {
            ops.isLessThanIE9 = true;
        }
    },

    /**
     * Takes a namespace string and fetches that location out from
     * an object.  If the namespace doesn't exists it is created then
     * returned.
     * @example _namespace('hello.world.how.are.you.doing') // will create/fetch:
     * @example {hello: { world: { how: { are: { you: { doing: {} } } } } } }
     * @method _namespace
     * @param ns_string {String} the namespace you wish to fetch
     * @param extendObj {Object} optional, default this.options
     * @param valueToSet {Object} optional, a value to set on the key (last key if key string (a.b.c.d = value))
     * @returns {Object}
     */
    _namespace: sjl.namespace,

    /**
     * Populates this.ui with element collections from this.options.
     * @method _populateUiElementsFromOptions
     * @param ops {Object|String} Optional. Default `this.options`.
     * @return {void}
     */
    _populateUiElementsFromOptions: function (ops) {
        var self = this,
            item,
            classOfItem,
            key;

        // Get options
        ops = !sjl.isset(ops) ? self.options : ops;

        // Set our ui collection
        if (!ops.hasOwnProperty('ui') || !sjl.isset(ops.ui)) {
            ops.ui = {};
        }

        // Loop through ops and populate elements
        for (key in ops.ui) {

            // If `ops` has key
            if (ops.ui.hasOwnProperty(key)) {

                // Get item
                item = ops.ui[key];
                classOfItem = sjl.classOf(item);

                // If key is string (class selector)
                if (classOfItem === 'String') {
                    ops.ui[key] = $(item, self.element);
                }

                // If element is a valid jquery selection skip it
                else if (self._isValid$selection(item)) {
                    continue;
                }

                // If item is plain object
                else if (classOfItem === 'Object') {
                    // If element already is populated, skip it
                    if (self._notEmptyObjectKey(item, 'elm')) {
                        continue;
                    }
                    // Else Create/fetch element
                    else {
                        item.elm = self._getElementFromOptions(item, self, ops);
                    }
                }

                else if (classOfItem === 'Function') {
                    item = self._getElementFromOptions(item.apply(self, {}), self, ops);
                }

            } // has own property

        } // loop

        return self;
    },

    /**
     * Fetches an element from the option hash's `ui` namespace.
     * @method _getElementFromOptions
     * @param config {Object}
     * @protected
     * @returns {null|jQuery} null or the jquery element selection
     */
    _getElementFromOptions: function (config, self, ops) {
        var retVal = null,
            configHasHtml = self._notEmptyObjectKey(config, 'html'),
            configCreate = self._notEmptyObjectKey(config, 'create', 'Boolean'),
            configHasSelector = self._notEmptyObjectKey(config, 'selector', 'String'),
            configHasAppendTo = self._notEmptyObjectKey(config, 'appendTo', 'String'),
            retVal = null;

        // Create element and `append to` config section if necessary
        if (configCreate && configHasHtml && configHasSelector) {
            config.elm = this._createElementFromOptions(config);
            if (configHasAppendTo) {
                self._appendElementFromOptions(config);
            }
            retVal = config.elm = $(config.selector, self.element);
        }

        // If config has a `selector`
        else if (configHasSelector) {
            config.elm = $(config.selector, self.element);
            retVal = config.elm;
        }

        // Return element
        return retVal;
    },

    /**
     * Appends an element from it's hash config object
     * @method _appendElementFromOptions
     * @param {Object} config
     * @protected
     */
    _appendElementFromOptions: function (config) {
        var self = this,
            parent = this.element.parent();
        if (config.appendTo === 'body') {
            config.elm = $('body').eq(0)
                .append(config.elm).find(config.selector);
        }
        else if (config.appendTo === 'this.element') {
            config.elm = this.element
                .append(config.elm).find(config.selector);
        }
        else if (config.appendTo === 'after this.element') {
            this.element.after(config.elm);
            config.elm = parent.find(
                this.element.get(0).nodeName
                    + ' ~ ' + config.selector);
        }
        else if (config.appendTo === 'before this.element') {
            this.element.before(config.elm);
            config.elm = parent.find(config.selector
                + ' ~ ' + this.element.get(0).nodeName);
        }
        else if (config.appendTo === 'prepend to this.element') {
            this.element.prepend(config.elm);
            config.elm = this.element.children().first();
        }
        else {
            config.elm = this.getUiElement(config.appendTo)
                .append(config.elm).find(config.selector);
        }
    },

    /**
     * Create and Element from the options.ui hash and appends it to
     * it's config.appendTo section alias string.
     * @method _createElementFromOptions
     * @param config {Object} the options object from which to create
     *  and where to populate the created element to.
     * @protected
     * @returns {null|jQuery}
     */
    _createElementFromOptions: function (config) {
        var elm = null;

        // If config is string look it up in our options hash
        if (sjl.isset(config) && typeof config === 'string') {
            config = this._namespace(config);
        }

        // If config is empty
        if (sjl.empty(config)) {
            return null;
        }

        // Assume config is an object
        if (config.html) {
            elm = $(config.html);
            if (sjl.isset(config.attribs)
                && $.isPlainObject(config.attribs)) {
                elm.attr(config.attribs);
            }
        }
        return elm;
    },

    /**
     * Remove created elements from the options.ui hash plugin.
     * @method _removeCreatedElements
     * @returns {void}
     * @protected
     */
    _removeCreatedElements: function () {
        var self = this, ops = self.options;
        for (var key in ops.ui) {
            if (ops.ui[key].elm instanceof $ && ops.ui[key].create) {
                ops.ui[key].elm.remove();
            }
        };
    },

    /**
     * @method _setOption
     * @param key
     * @param value
     * @return void
     * @protected
     */
    _setOption: function (key, value) {
        this._namespace(key, this.options, value);
    },

    /**
     * @method _setOptions
     * @param options
     * @returns {*}
     * @protected
     */
    _setOptions: function (options) {
        var self = this;
        if (!sjl.isset(options)) {
            return;
        }
        $.each(options, function (key, value) {
            self._callSetterForKey(key, value);
        });
        return self;
    },

    /**
     * @method _callSetterForKey
     * @param key
     * @param value
     * @protected
     * @return {void}
     */
    _callSetterForKey: function (key, value) {
        var setterFunc = 'set' + sjl.camelCase(key, true),
            self = this;
        if (sjl.isset(self[setterFunc])) {
            self[setterFunc](value);
        }
        else {
            self._setOption(key, value);
        }
    },

    /**
     * Adds animations to our animation timeline.
     * @param timeline {TimelineLite|TimelineMax} optional
     * @param animations {array} optional animations array
     * @param options {object] optional options hash to search on
     * @returns default
     * @protected
     */
    _initAnimationTimeline: function (timeline, animations, options) {
        var self = this,
            ops,
            i, config, elm, dur, props,
            _animations;

        timeline = !sjl.isset(timeline) ? this.getAnimationTimeline() : timeline;
        options = options || self.options;
        animations = animations || null;

        ops = options;

        // If default animations, use them
        if (sjl.isset(ops.defaultAnimations)
            && ops.defaultAnimations instanceof Array) {
            _animations = ops.defaultAnimations;
        }

        // If animations, use them (also override defaults if any)
        if (sjl.isset(ops.animations)
            && ops.animations instanceof Array && sjl.isset(_animations)) {
            _animations = sjl.isset(animations)
                ? $.extend(true, _animations, ops.animations) : ops.animations;
        }

        // Set animations variable
        if (sjl.isset(animations) && sjl.isset(_animations)) {
            animations = $.extend(true, _animations, animations);
        }
        else if (sjl.isset(_animations)) {
            animations = _animations;
        }
        // If no animations, bail
        else {
            return;
        }

        // Add animations to timeline
        for (i = 0; i < animations.length; i += 1) {
            config = animations[i];
            elm = self.getUiElement(config.elmAlias);
            dur = config.duration;
            props = config.props;

            // Pre init function
            if (sjl.isset(config.preInit) && typeof config.preInit === 'function') {
                config.preInit.apply(this);
            }

            // Init timeline
            timeline[config.type](elm, dur, props);

            // Post init function
            if (sjl.isset(config.postInit) && typeof config.postInit === 'function') {
                config.postInit.apply(this);
            }
        }
    },

    /**
     * @method _removeDisabledElements
     * @param options
     * @protected
     */
    _removeDisabledElements: function (options) {
        // Get options
        ops = !sjl.isset(options) ? this.options : options;

        // Set our ui collection
        if (!sjl.isset(ops.ui)) {
            ops.ui = {};
        }

        // Ui ops
        ops = ops.ui;

        // Loop through ops and remove disabled elements
        Object.keys(ops).forEach(function (key) {
            // If key is plain object
            if ($.isPlainObject(ops[key])) {
                // If element is populated and disabled remove it
                if (!ops.enabled && sjl.isset(ops[key].elm) && ops[key].elm.length > 0) {
                    ops[key].elm.remove();
                }
            }
        });
    },

    /**
     * Pulls a ui element from the options -> ui hash else uses
     * getElementFromOptions to create/fetch it.
     * @method getUiElement
     * @param {string} alias
     * @returns {*}
     */
    getUiElement: function (alias) {
        var self = this,
            ops = self.options,
            elm = sjl.namespace('ui.' + alias, ops);
        if (!self._isValid$selection(elm) && self._notEmptyObjectKey(elm, 'elm')) {
            elm = elm.elm;
        }
        else if (sjl.classOfIs(elm, 'Object')) {
            elm = self._getElementFromOptions(elm, self, ops);
        }
        return elm;
    },

    /**
     * Sets css on element if it exist.
     * @method setCssOnUiElement
     * @tentative
     * @param alias {string} Element alias
     * @param cssHash {object}
     */
    setCssOnUiElement: function (alias, cssHash) {
        var elm = this.getUiElement(alias);
        if (elm) {
            elm.css(cssHash);
        }
    },

    /**
     * Lazy initializes a Timeline Lite or
     * Timeline Max animation timeline.
     * @method getAnimationTimeline
     * @returns {TimelineMax|TimelineLite}
     * @todo move this out of here.
     */
    getAnimationTimeline: function () {
        var timeline = this.options.timeline;
        if (sjl.empty(timeline)) {
            timeline =
                this.options.timeline =
                    new window[this.options.defaultTimelineClass];
        }
        return timeline;
    },

    /**
     * Gets an option value from the options hash.  This function is a
     * proxy for `getValueFromHash` and it just sets the hash to `this.options`.
     * @method getValueFromOptions
     * @see getValueFromHash
     * @param key
     * @returns {Object}
     */
    getValueFromOptions: function (key, args, raw) {
        return this.getValueFromHash(key, this.options, args, raw);
    },

    /**
     * Searches hash for key and returns it's value.  If value is a function
     * calls function, with optional `args`, and returns it's return value.
     * If `raw` is true returns the actual function if value is a function.
     * @method getValueFromHash
     * @param key {string} The hash key to search for
     * @param hash {object} optional, the hash to search within
     * @param args {array} optional the arrays to pass to value if it is a function
     * @param raw {boolean} optional whether to return value even if it is a function
     * @returns {*}
     */
    getValueFromHash: function (key, hash, args, raw) {
        args = args || null;
        raw = raw || false;
        var retVal = null;
        if (typeof key === 'string' && $.isPlainObject(hash)) {
            retVal = this._namespace(key, hash);
            if (typeof retVal === 'function' && sjl.empty(raw)) {
                retVal = args ? retVal.apply(this, args) : retVal.apply(this);
            }
        }
        return retVal;
    },

    /**
     * @method setValueOnHash
     * @param key
     * @param value
     * @param hash
     */
    setValueOnHash: function (key, value, hash) {
        this._namespace(key, hash, value);
    },

    /**
     * Returns the timeline classname to use for the instance of the plugin
     * extending juibase.
     * @method getTimelineClassName
     * @returns {*} default defaultTimelineClassName = 'TimelineLite'
     */
    getTimelineClassName: function () {
        var ops = this.options;
        return sjl.isset(ops.timelineClassName) ? ops.timelineClassName :
            ops.defaultTimelineClassName;
    },

    _issetObjectKey: function (obj, key) {
        return obj.hasOwnProperty(key) && sjl.isset(obj[key]);
    },

    _notEmptyObjectKey: function (obj, key, type) {
        var isOfType = true,
            isJQuerySelection = obj instanceof $;
        if (typeof type !== 'undefined' && sjl.classOfIs(type, 'String')) {
            isOfType = sjl.classOfIs(obj[key], type);
        }
        return this._issetObjectKey(obj, key, type) && isOfType && !sjl.empty(obj[key]);
    },

    _isValid$selection: function (item) {
        item instanceof $ && item.length > 0;
    }

});

