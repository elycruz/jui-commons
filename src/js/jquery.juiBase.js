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
         * Default Gsap Timeline Constructor Options
         * @type {Object}
         */
        defaultGsapTimelineConstructorOptions: {
            paused: true
        },

        /**
         * Default Timeline Class
         * @property gsapTimelineConstructor
         * @type {String}
         */
        gsapTimelineConstructor: TimelineLite,

        /**
         * Gsap Timeline object
         * @property timeline
         * @type {Timeline}
         */
        gsapTimeline: null,

        /**
         * Ui hash for ui element
         * @property ui
         * @type {Object}
         */
        ui: {}

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
     * @method _autoPopulateUiElements
     * @param ops {Object|String} Optional. Default `this.options`.
     * @return {$.jui.juiBase}
     */
    _autoPopulateUiElements: function (self, $selfElm, ops) {
        self = self || this;
        $selfElm = $selfElm || self.element;
        ops = ops || self.options || {};

        var item,
            classOfItem,
            key;

        // Set our ui collection
        if (!ops.hasOwnProperty('ui') || !sjl.isset(ops.ui)) {
            ops.ui = {};
        }

        // Loop through ops and populate elements
        for (key in ops.ui) {

            // Get item
            item = ops.ui[key];
            classOfItem = sjl.classOf(item);

            // If key is string (class selector)
            if (classOfItem === 'String') {
                ops.ui[key] = $(item, self.element);
            }

            // If element is a valid jquery selection skip it
            else if (self._isValid$Selection(ops.ui[key])) {
                continue;
            }

            // If item is plain object
            else if (classOfItem === 'Object') {

                // If element is a valid jquery selection skip it
                if (!self._isEmptyObjectKey(item, 'elm') && self._isValid$Selection(item.elm)) {
                    continue;
                }
                // Get element from options
                item.elm = self._getElementFromOptions(item, self, $selfElm, ops);
            }

            else if (classOfItem === 'Function') {
                item.elm = self._getElementFromOptions(item.apply(self, {}), self, $selfElm, ops);
            }

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
    _getElementFromOptions: function (config, self, $selfElm, ops) {
        var retVal = null,
            configHasHtml = !self._isEmptyObjectKey(config, 'html'),
            configCreate = !self._isEmptyObjectKey(config, 'create', 'Boolean') && config.create,
            configHasSelector = !self._isEmptyObjectKey(config, 'selector', 'String'),
            configHasAppendTo = !self._isEmptyObjectKey(config, 'appendTo', 'String'),
            validJquerySelection,
            $findIn = $selfElm,
            retVal = null;

        if (configHasAppendTo) {
            $findIn = self._getAppendToElement($selfElm, config);
        }

        // If config has a `selector`
        if (configHasSelector) {
            retVal = $(config.selector, $findIn);
        }

        // Check if element was selected
        validJquerySelection = self._isValid$Selection(retVal);

        // If element wasn't selected create it
        if (!validJquerySelection && configCreate && configHasHtml && configHasSelector) {
            retVal = self._createElementFromOptions(config);
            if (configHasAppendTo) {
                self._appendByAppendToString(config.appendTo, retVal, $findIn, $selfElm);
            }
            retVal = $(config.selector, $findIn)
        }

        // Return element
        return retVal;
    },

    /**
     * Appends an element from it's hash config object
     * @method _appendByAppendToString
     * @param {Object} config
     * @protected
     */
    _appendByAppendToString: function (appendToStr, $elm, $appendToElm, $selfElm) {
        if (appendToStr === 'body') {
            $appendToElm.append($elm);
        }
        else if (appendToStr === 'this.element') {
            $selfElm.append($elm);
        }
        else if (appendToStr === 'after this.element') {
            $selfElm.after($elm);
        }
        else if (appendToStr === 'before this.element') {
            $selfElm.before($elm);
        }
        else if (appendToStr === 'prepend to this.element') {
            $selfElm.prepend($elm);
        }
        else {
            $appendToElm.append($elm);
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
        var elm = $(config.html);
        if (sjl.isset(config.attribs)
            && $.isPlainObject(config.attribs)) {
            elm.attr(config.attribs);
        }
        config.create = false;
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
            if (!self._isValid$Selection(ops.ui[key])
                && !self._isEmptyObjectKey(ops.ui[key], 'elm')
                && ops.ui[key].hasOwnProperty('create')) {
                ops.ui[key].elm.remove();
            }
        }
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

        timeline = !sjl.isset(timeline) ? this.gsapTimeline() : timeline;
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
    _removeDisabledElements: function (uiHash) {
        // Set our ui collection
        if (!sjl.isset(uiHash)) {
            return;
        }
        // Loop through ops and remove disabled elements
        Object.keys(uiHash).forEach(function (key) {
            var item = uiHash[key];
            // If key is plain object
            if ($.isPlainObject(item)) {
                // If element is populated and disabled remove it
                if (!item.enabled && sjl.isset(uiHash[key].elm) && uiHash[key].elm.length > 0) {
                    uiHash[key].elm.remove();
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
        if (!self._isValid$Selection(elm) && !self._isEmptyObjectKey(elm, 'elm')) {
            elm = elm.elm;
        }
        else if (sjl.classOfIs(elm, 'Object')) {
            elm = self._getElementFromOptions(elm, self, self.element, ops);
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
     * @method gsapTimeline
     * @returns {TimelineMax|TimelineLite}
     * @todo move this out of here.
     */
    gsapTimeline: function (timeline) {
        var retVal = this,
            ops = this.options,
            issetTimeline = sjl.isset(timeline);

        // If getter call and timeline is not set, create it
        if (!issetTimeline) {
            retVal =
                ops.gsapTimeline =
                    new ops.gsapTimelineConstructor(ops.defaultGsapTimelineConstructorOptions);
        }

        // If setter call and timeline matches one of the allowed timeline classes, set it
        else if (issetTimeline && (timeline instanceof TimelineMax || timeline instanceof TimelineLite)) {
            ops.gsapTimeline = timeline;
        }

        // Else if setter call but timeline doesn't match one of the allowed timeline classes, throw an error
        else if (issetTimeline) {
            throw new Error(this.widgetFullName + '.gsapTimeline expects timeline to be of types: ' +
                'undefined, TimelineLite, or TimelineMax.  Type recieved: ' + sjl.classOf(timeline));
        }

        // Return return value
        return retVal;
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
    setValueOnHash: sjl.namespace,

    /**
     * Returns whether and object's key isset and whether it even has the key as it's own property.
     * @param obj {Object} - Object to search on.
     * @param key {String} - Key to search for on obj.
     * @returns {Boolean}
     * @private
     */
    _issetObjectKey: function (obj, key) {
        return obj.hasOwnProperty(key) && sjl.isset(obj[key]);
    },

    /**
     * Returns whether a object key's value is not set or empty (empty jquery selection or empty string, object, array etc)
     * or not of given type for `type` string param.
     * @param obj {Object|$|*} - Object to search for key on.
     * @param key {String} - Key to search for on object.
     * @param type {String} - Optional type to ensure obj[key] is of.  E.g., sjl.classOfIs(obj[key], type) .
     * @returns {Boolean} - Whether the object passed in is empty or not.
     * @private
     */
    _isEmptyObjectKey: function (obj, key, type) {
        var isOfType = true,
            issetObjKey = this._issetObjectKey(obj, key),
            is$Selection = issetObjKey && this._isValid$Selection(obj[key]),
            isEmpty = !issetObjKey || !is$Selection ? sjl.empty(obj[key]) : true;
        if (typeof type !== 'undefined' && sjl.classOfIs(type, 'String')) {
            isOfType = sjl.classOfIs(obj[key], type);
        }
        return isEmpty || !isOfType;
    },

    /**
     * Returns true if a non empty jquery selection is passed in.
     * @param item {$} - JQuery selection.
     * @returns {boolean} - Whether selection is non empty (length > 0 and is jquery selection).
     * @private
     */
    _isValid$Selection: function (item) {
        return item instanceof $ && item.length > 0;
    },

    /**
     * Gets the element to append to based on `config.appendTo` string
     * @param $appendToElm {$}
     * @param config {Object}
     * @returns {$} - Selection determined to be attached/append to based config.appendTo value
     * @private
     */
    _getAppendToElement: function ($appendToElm, config) {
        if (!this._isEmptyObjectKey(config, 'appendTo')) {
            switch (config.appendTo) {
                case 'body':
                    $appendToElm = $('body').eq(0);
                    break;
                case 'after':
                case 'after this.element':
                case 'after self.element':
                case 'before':
                case 'before this.element':
                case 'before self.element':
                    $appendToElm = $appendToElm.parent();
                    break;
                case 'self' :
                case 'this' :
                case 'prepend' :
                case 'this.element':
                case 'self.element': // Assume that $appendToElm default is self.element
                    break;
                default:
                    $appendToElm = this.getUiElement(config.appendTo);
                    break;
            }
        }
        return $appendToElm;
    },

    /**
     * Destroys this plugin instance and removes all self created elements from this.elements dom tree.
     * @return {void}
     * @private
     */
    _destroy: function () {
        this._removeCreatedElements();
        this._super();
    }

});
