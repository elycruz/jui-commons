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

    _issetObjectKey: function (obj, key) {
        return obj.hasOwnProperty(key) && sjl.isset(obj[key]);
    },

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

    _isValid$Selection: function (item) {
        return item instanceof $ && item.length > 0;
    },

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

    _destroy: function () {
        this._removeCreatedElements();
        this._super();
    }

});

/**
 * Created by edelacruz on 2/3/14.
 */
/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 1:15 AM
 * To change this template use File | Settings | File Templates.
 */
$.widget('jui.juiMouse', {

    options: {
        mouseX: null,
        mouseY: null,
        relMouseX: null,
        relMouseY: null
    },

    mouseX: function () {
        return this.options.mouseX;
    },

    mouseY: function () {
        return this.options.mouseY;
    },

    relMouseX: function () {
        return this.options.relMouseX;
    },

    relMouseY: function () {
        return this.options.relMouseY;
    },

    hitTest: function (elm) {
        var self = this,
            offset = self.getBoundingBox(elm),
            retVal = false,
            ops = self.options;

        // Check if mouse is within bounds
        return (ops.mouseX >= offset.left
            && ops.mouseX <= offset.right
            && ops.mouseY >= offset.top
                && ops.mouseY <= offset.bottom);
    },

    getRelativeMouse: function (elm) {
        var self = this,
            offset = self.getBoundingBox(elm),
            ops = self.options;

        return {
            mouseX: ops.mouseX - offset.left,
            mouseY: ops.mouseY - offset.top
        };
    },

    getBoundingBox: function (elm) {
        var offset = elm.offset();

        offset = offset ? offset : {top: 0, left: 0};

        return {
            top: offset.top,
            right: offset.left + elm.outerWidth(),
            bottom: offset.top + elm.outerHeight(),
            left: offset.left
        };
    },

    _create: function () {},

    _init: function () {
        var self = this,
            ops = self.options;

        self.element.mousemove(function (e) {
            var relMouse = self.getRelativeMouse(self.element);
            ops.mouseX = e.clientX;
            ops.mouseY = e.clientY;
            ops.relMouseX = relMouse.mouseX;
            ops.relMouseY = relMouse.mouseY;
        });
    }

});
/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 12:49 AM
 * @description Base paginator class for pagination classes.  This plugin is meant to be extended not
 * used on it's own!
 * @triggers widgetName + ':gotoPageNum'
 */

$.widget('jui.juiAbstractPaginator', $.jui.juiBase, {

    options: {

        pages: {
            prev: 0,
            pointer: 0,
            next: 0,
            last: 0,
            length: 0,
            direction: 1
        },

        onGotoPageNum: null
    },

    _create: function () {
        var self = this;
        self._gotoPageNum(self.options.pages.pointer);
    },

    _nextPage: function () {
        var self = this,
            ops = self.options;

        // Set direction to next
        ops.pages.pointer_direction = 1;

        if (ops.pages.pointer < ops.pages.length - 1) {
            ops.pages.pointer += 1;
        }
        else {
            ops.pages.pointer = 0;
        }

        // Goto Page src number
        self._gotoPageNum(ops.pages.pointer);

        // Trigger event
        self.element.trigger(self.widgetName + ':nextPage',
            {pointer: ops.pages.pointer});
        
        return self;
    },

    _prevPage: function () {
        var self = this,
            ops = self.options;
        if (ops.pages.pointer > 0) {
            ops.pages.pointer -= 1;
        }
        else {
            ops.pages.pointer = ops.pages.length - 1;
        }

        // Set direction to previous
        ops.pages.pointer_direction = -1;

        // Goto Page src number
        self._gotoPageNum(ops.pages.pointer);

        // Trigger event
        self.element.trigger(self.widgetName + ':prevPage',
            {pointer: ops.pages.pointer});

        return self;
    },

    _gotoPageNum: function (num) {
        var self = this,
            ops = self.options;
        // Set prev and next
        ops.pages.prev = num - 1;

        ops.pages.next = num + 1;

        // Ensure less than pages length
        if (num > ops.pages.length - 1) {
            num = ops.pages.length - 1;
        }

        // Ensure positive number
        if (num < 0) {
            num = 0;
        }

        // Set pointer
        ops.pages.pointer = num;

        // If callback is set call it
        self.getValueFromOptions('onGotoPageNum');

        // Trigger gotoPageNum
        self.element.trigger(self.widgetName + ':gotoPageNum',
            {pointer: num});

        return self;
    },

    getPointer: function () {
        return this.options.pages.pointer;
    }
});

/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 12:49 AM
 * @description Base paginator class for pagination classes.  This plugin is meant to be extended not
 * used on it's own!
 * @triggers 'paginator:gotoPageNum', {pointer: Number}
 */

$.widget('jui.juiBasicPaginator', $.jui.juiAbstractPaginator, {
    options: {
        template: null,
        className: 'jui-basic-paginator',
        ui: {
            firstBtn: {
                elm: null,
                selector: '> .first-btn.btn',
                attribs: {
                    'class': 'first-btn btn',
                    'href': '#'
                },
                appendTo: 'this.element',
                enabled: true,
                html: '<a>&#124;&lt; First</a>',
                create: true
            },
            prevBtn: {
                elm: null,
                selector: '> .prev-btn.btn',
                attribs: {
                    'class': 'prev-btn btn',
                    'href': '#'
                },
                appendTo: 'this.element',
                enabled: true,
                html: '<a>&lt;&lt; Prev</a>',
                create: true
            },
            nextBtn: {
                elm: null,
                selector: '> .next-btn.btn',
                attribs: {
                    'class': 'next-btn btn',
                    'href': '#'
                },
                appendTo: 'this.element',
                enabled: true,
                html: '<a>Next &gt;&gt;</a>',
                create: true
            },
            lastBtn: {
                elm: null,
                selector: '> .last-btn.btn',
                attribs: {
                    'class': 'last-btn btn',
                    'href': '#'
                },
                appendTo: 'this.element',
                enabled: true,
                html: '<a>Last &gt;&#124;</a>',
                create: true
            },
            itemsContainer: {
                selector: '> .items'
            },
            items: {
                elm: null,
                selector: '> .items > .item',
                firstInRange: 0,
                lastInRange: 0,
                perPage: 0
            }
        },

        skipPagesCalculation: false
    },

    _create: function () {
        var self = this,
            ops = self.options;

        // Add class name
        if (typeof ops.className === 'string' && ops.className.length > 0) {
            self.element.addClass(ops.className);
        }

        // Append template if any
        if (typeof ops.template === 'string' && ops.template.length > 0) {
            self.element.append(ops.template);
        }

        self._autoPopulateUiElements(self, self.element, ops);
        self._addEventListeners();
        if (sjl.empty(ops.skipPagesCalculation)) {
            self._calculateNumberOfPages(ops);
        }
        self._super();
    },

    _addEventListeners: function () {
        var self = this,
            firstBtn = self.getFirstBtnElm(),
            nextBtn = self.getNextBtnElm(),
            prevBtn = self.getPrevBtnElm(),
            lastBtn = self.getLastBtnElm();

        // First Page Button
        if (sjl.isset(firstBtn) && firstBtn.length > 0) {
            firstBtn.on('click', function (e) {
                e.preventDefault();
                self.firstPage();
            });
        }

        // Previous Page button
        if (sjl.isset(prevBtn) && prevBtn.length > 0) {
            prevBtn.on('click', function (e) {
                e.preventDefault();
                self.prevPage();
            });
        }

        // Next Page button
        if (sjl.isset(nextBtn) && nextBtn.length > 0) {
            nextBtn.on('click', function (e) {
                e.preventDefault();
                self.nextPage();
            });
        }

        // Last Page button
        if (sjl.isset(lastBtn) && lastBtn.length > 0) {
            lastBtn.on('click', function (e) {
                e.preventDefault();
                self.lastPage();
            });
        }
    },

    _calculateNumberOfPages: function (options) {
        var ops = options || this.options,
            items = this.getItemsElm(),
            itemsPerPage;

        // If items per page is a function
        itemsPerPage = this.getValueFromHash('ui.items.perPage', ops);

        // Pages length
        ops.pages.length = Math.ceil(items.length / itemsPerPage);
        ops.pages.length = ops.pages.length !== NaN ? ops.pages.length : 0;

        // Trigger event
        this.element.trigger(this.widgetName + ':numbersCalculated',
            {pointer: ops.pages.pointer});
    },

    // Actions
    firstPage: function () {
        this._gotoPageNum(0);
        this.element.trigger(this.widgetName + ':firstPage');
    },
    prevPage: function () {
        this._prevPage();
        this.element.trigger(this.widgetName + ':prevPage',
            this.options.pages);
    },
    nextPage: function () {
        this._nextPage();
        this.element.trigger(this.widgetName + ':nextPage',
            this.options.pages);
    },
    lastPage: function () {
        this._gotoPageNum(this.options.pages.length - 1);
        this.element.trigger(this.widgetName + ':lastPage');
    },

    // Getters
    getFirstBtnElm: function () {
        return this.getUiElement('firstBtn');
    },
    getPrevBtnElm: function () {
        return this.getUiElement('prevBtn');
    },
    getNextBtnElm: function () {
        return this.getUiElement('nextBtn');
    },
    getLastBtnElm: function () {
        return this.getUiElement('lastBtn');
    },
    getItemsElm: function () {
        return this.getUiElement('items');
    }

});
/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 1:15 AM
 * To change this template use File | Settings | File Templates.
 */

$.widget('jui.juiPaginatorWithTextField', $.jui.juiBasicPaginator, {

    // Options
    options: {
        template:
            '<a href="#" class="first-btn btn">&#124;&lt; First</a>' +
            '<a href="#" class="prev-btn btn">&lt; Prev</a>' +
            '<input type="text" size="4" class="text-field btn" />' +
            '<a href="#" class="next-btn btn">Next &gt;</a>' +
            '<a href="#" class="last-btn btn">Last &gt;&#124;</a>',

        className: 'jui-paginator-with-text-field jui-basic-paginator',

        ui: {
            items: {
                elm: null,
                selector: '> .items > .item',
                perPage: 12,
                create: false
            },
            textField: {
                elm: null,
                selector: '> .text-field',
                enabled: true,
                create: false
            },
            firstBtn: {
                create: false
            },
            prevBtn: {
                create: false
            },
            nextBtn: {
                create: false
            },
            lastBtn: {
                create: false
            }
        }
    },

    // Creation
    _create: function () {
        var self = this,
            ops = self.options;
        self.element.addClass(self.options.className);
        // Call parent class' _create method
        self._super();
    },

    // ========================================================
    // Private
    // ========================================================
    _addEventListeners: function () {
        var self = this,
            ops = self.options,
            textFieldElm = self.getUiElement('textField');

        // Listen to calls on gotoPageNum and set the text
        self.element.on('juiPaginatorWithTextField:gotoPageNum', function (e, data) {
            if (parseInt(textFieldElm.val(), 10)
                !== parseInt(data.pointer, 10) + 1) {
                    textFieldElm.val(data.pointer + 1);
            }
        });

        // Text Field Element
        self.getTextFieldElm().bind('keyup', function (e) {
            var o = $(this), outgoing = {};

            // If the enter key was not pressed bail
            if (e.keyCode != 13) {
                return;
            }

            // Prelims
            var field = $(this), value = field.val();

            if (/\d+/.test(value)) {
                // goto page number
                if ((value - 1) > ops.pages.length) {
//                    throw new Error ('Range Exception: Paginator value entered is ' +
//                        'out of range.  Value entered: ' + value + '\n\n' +
//                        'proceeding to last page.');

                    // Proceed to greates page number
                    self._gotoPageNum(ops.pages.length);
                }
                else if ((value - 1) < 0) {
//                    throw new Error ('Range Exception: Paginator value entered is ' +
//                        'out of range.  Value entered: ' + value + '\n\n' +
//                        'Proceeding to first page.');

                    // Proceed to first page
                    self._gotoPageNum(0);
                }

                // Proceed to passed in page number
                self._gotoPageNum(value - 1);
            }
            else {
                outgoing.messages = ['Only numbers are allowed in the ' +
                    'paginator textfield.'];
            }

            if (typeof ops.ui.textField.callback === 'function') {
                // Set up some outgoing data for callbacks
                outgoing.items = ops.ui.items;
                outgoing.pages = ops.pages;
                ops.ui.textField.callback(outgoing);
            }
        });

        // Call the super classes add event listener method
        self._super();
    },

    // ========================================================
    // Getters and Setters
    // ========================================================
    getTextFieldElm: function () {
        return this.getUiElement('textField');
    }

});
/**
 * Makes a content area scrollable with custom
 * scrollbars whose elements are fetched or created depending on the
 * flags passed in/or-not-passed in by the user.
 *
 * @class $.jui.juiScrollPane
 *
 * @requires jquery.mousewheel (for crossbrowser mousewheel functionality)
 * @requires jquery
 * @requires jquery.ui (jquery ui core)
 * @requires jquery.ui.widget
 * @requires jquery.juiBase
 * @requires TweenMax
 * @returns jquery selection
 *
 * @author ElyDeLaCruz
 * @created 09/28/2013
 * @todo move event listeners out of the create function (for consistency)
 * @todo use the listeners added to window and contentHolder in the unbind function (to ensure we don't remove anyone elses listeners)
 * @todo solve browser scrollbar mimicking
 */
$.widget('jui.juiScrollPane', $.jui.juiBase, {
    /**
     * Options Hash.
     * @type {Object}
     */
    options: {

        scrollSpeed: function () {
            var retVal = 0;
            retVal = this.getUiElement('contentHolder').height() / 3 / 3 * 2;
            return sjl.classOfIs(retVal, 'Number') ? retVal : 0;
        },

        // Left, up, right, down arrow keys and their direction values
        // to multiply the scrollspeed by
        keyPressHash: {
            '37': -1,
            '38': -1,
            '39': 1,
            '40': 1
        },

        // Continue scroll outer element after content holder has
        // reached it's scroll end (either directions)
        mimickBrowser: false,

        ui: {
            contentHolder: {
                elm: null,
                selector: '>.content',
                html: '<div></div>',
                attribs: {
                    'class': 'content'
                }
            },
            vertScrollbar: {
                elm: null,
                selector: '> .vertical.scrollbar',
                html: '<div></div>',
                appendTo: 'this.element',
                attribs: {
                    'class': 'vertical scrollbar'
                },
                create: true
            },
            vertHandle: {
                elm: null,
                selector: '> .handle',
                html: '<div></div>',
                appendTo: 'vertScrollbar',
                attribs: {
                    'class': 'handle'
                },
                create: true
            },
            horizScrollbar: {
                elm: null,
                selector: '> .horizontal.scrollbar',
                html: '<div></div>',
                appendTo: 'this.element',
                attribs: {
                    'class': 'horizontal scrollbar'
                },
                create: true
            },
            horizHandle: {
                elm: null,
                selector: '> .handle',
                html: '<div></div>',
                appendTo: 'horizScrollbar',
                attribs: {
                    'class': 'handle'
                },
                create: true
            }
        },

        pluginClassName: 'jui-scroll-pane',

        scrollbarOriented: {
            VERTICALLY: 'vertical',
            HORIZONTALLY: 'horizontal'
        },

        autoHide: false,

        originalOverflow: null,

        debug: false
    },

    _create: function () {
        this._autoPopulateUiElements(this, this.element, this.options);
        var ops = this.options,
            contentHolder = this.getUiElement('contentHolder'),
            self = this;

        // Conetnt Holder
        if (contentHolder.css('overflow') !== 'hidden') {
            ops.originalOverflow = contentHolder.css('overflow');
            contentHolder.css('overflow', 'hidden');
        }

        // Add plugin class
        self.element.addClass(ops.pluginClassName);

        // Determine whether we need a horizontal and/or vertical scrollbar.
        self.initScrollbars();

        // ----------------------------------------------------------
        // Move to an add event listener function (for consistency)
        // ----------------------------------------------------------
        // Bind mousewheel event
        contentHolder.bind('mousewheel', function (e, delta, deltaX, deltaY) {
//            console.log('delta: ', delta, 'x: ', deltaX, 'y: ', deltaY);

            var mimickBrowser = self.getValueFromOptions('mimickBrowser'),
                scrollSpeed, incrementer;

            // If not mimick browser scrollbars stop propagation and
            // prevent default behaviour
            if (!mimickBrowser) {
                // Scroll this element individually
                e.preventDefault();

                // Stop propagation for nested scroll panes
                e.stopPropagation();
            }

            delta = sjl.isset(delta) ? delta :
                (sjl.isset(deltaX)? deltaX : deltaY);

            // Prelims
            scrollSpeed = self.getValueFromOptions('scrollSpeed');
            incrementer = delta < 1 ?  scrollSpeed : -scrollSpeed;

            // Scroll horizontally
            if (deltaX !== 0 && deltaY === 0) {
                self.scrollHorizontally(contentHolder.scrollLeft() + incrementer);
                if (mimickBrowser
                    && contentHolder.scrollLeft() !== 0
                    && contentHolder.scrollLeft() !== contentHolder.get(0).scrollWidth) {
                    // Scroll this element individually
                    e.preventDefault();

                    // Stop propagation for nested scroll panes
                    e.stopPropagation();
                }
            }
            // Assume vertical scrolling action
            else if (deltaX === 0 && deltaY !== 0) {
                self.scrollVertically(contentHolder.scrollTop() + incrementer);
                if (mimickBrowser
                    &&contentHolder.scrollTop() !== 0
                    && contentHolder.scrollTop() !== contentHolder.get(0).scrollHeight - 1) {
                    // Scroll this element individually
                    e.preventDefault();
                    // Stop propagation for nested scroll panes
                    e.stopPropagation();
                }
            }
        });

        // Get mouse position tracker
        ops.mousePos = $(window).juiMouse();

        // Listen for arrow keys
        $(window).bind('keydown', function (e) {

            var incrementer,
                keyCode = e.keyCode + '';

            // If not arrow key pressed
            if (!ops.keyPressHash.hasOwnProperty(keyCode)) {
                return;
            }

            // If mouse not within scrollpane elm, bail
            if (!ops.mousePos.juiMouse('hitTest', contentHolder)) {
                return;
            }

            // Set focus on scrollpane
            contentHolder.focus();

            // Stop outer elemnt from scrolling
            e.preventDefault();

            incrementer = self.getValueFromOptions('scrollSpeed') *
                ops.keyPressHash[keyCode];

            // Get mouse position
            switch (keyCode) {
                // Left
                case '37':
                    self.scrollHorizontally(incrementer + contentHolder.scrollLeft());
                    break;
                case '38':
                    self.scrollVertically(incrementer + contentHolder.scrollTop());
                    break;
                case '39':
                    self.scrollHorizontally(incrementer + contentHolder.scrollLeft());
                    break;
                case '40':
                    self.scrollVertically(incrementer + contentHolder.scrollTop());
                break;
            }
        });
        // ----------------------------------------------------------
        // End of move to add event listener function
        // ----------------------------------------------------------
    },

    _scrollByOrientation: function (value, orientation) {
        var ops = this.options,
            contentHolder = this.getUiElement('contentHolder'),
            layout = orientation,
            vars = this.getScrollDirVars(layout),
            scrollTotal = vars.scrollAmountTotal,
            handle = this.getScrollbarHandleByOrientation(layout),
            scrollbar = this.getScrollbarByOrientation(layout),
            scrollPercent,
            dir = vars.cssCalcDir,
            dimProp = 'outer' + sjl.ucaseFirst(vars.scrollbarDimProp);

        // If not scrollable bail
        if (contentHolder[vars.scrollbarDimProp]() >= scrollTotal) {
            return;
        }

        if (value <= scrollTotal && value >= 0) {
            contentHolder['scroll' + sjl.ucaseFirst(dir)](value);
            scrollPercent = value / scrollTotal;
            handle.css(dir, scrollbar[dimProp]() * scrollPercent);
        }
        else if (value > scrollTotal) {
            handle.css(dir, scrollbar[dimProp]() - handle[dimProp]());
        }
        else if (value < 0) {
            handle.css(dir, 0);
        }
        this.scrollContentHolder(layout);
        this.constrainHandle(layout);
    },

    scrollContentHolder: function (oriented) {
        // Calculate percent of scroll action
        var handle = this.getScrollbarHandleByOrientation(oriented),
            scrollbar = this.getScrollbarByOrientation(oriented),
            contentHolder = this.getUiElement('contentHolder'),

        // Scroll vars
            scrollVars = this.getScrollDirVars(oriented),
            scrollAmountTotal = scrollVars.scrollAmountTotal,
            dir = scrollVars.cssCalcDir,
            dimProp = scrollVars.scrollbarDimProp,

        // Math
            percentScroll = handle.position()[dir] / scrollbar[dimProp](),
            scrollPos = percentScroll * scrollAmountTotal,
            contentHolderScrollFunc = 'scroll' + sjl.ucaseFirst(dir);

        // Scroll only if limits haven't been reached
        if (scrollPos >= 0 && scrollPos <= scrollAmountTotal) {
            contentHolder[contentHolderScrollFunc]
                (percentScroll * scrollAmountTotal);
        }

        // Constrain scroll limits
        else if (scrollPos < 0) {
            contentHolder[contentHolderScrollFunc](0);
        }
        else if (scrollPos > scrollAmountTotal) {
            contentHolder[contentHolderScrollFunc]
                (scrollAmountTotal);
        }
    },

    constrainHandle: function (oriented) {
        var handle = this.getScrollbarHandleByOrientation(oriented),
            scrollbar = this.getScrollbarByOrientation(oriented),
            vars = this.getScrollDirVars(oriented),
            dimProp = vars.scrollbarDimProp,
            dir = vars.cssCalcDir;

        // Limit handle position within scroll bar
        if (handle.position()[dir] < 0) {
            handle.css(dir, 0);
        }
        else if (handle.position()[dir]
            + handle[dimProp]() > scrollbar[dimProp]()) {
            handle.css(dir, scrollbar[dimProp]() - handle[dimProp]());
        }
    },

    initScrollbars: function () {
        var self = this,
            ops = self.options,
            contentHolder = self.getUiElement('contentHolder'),
            contentScrollWidth = contentHolder.get(0).scrollWidth,
            contentScrollHeight = contentHolder.get(0).scrollHeight;

        // Init vertical scrollbar
        if (contentScrollHeight > contentHolder.height()) {
            self.initScrollbar(ops.scrollbarOriented.VERTICALLY);
        }
        else {
            self.getUiElement('vertScrollbar').css('display', 'none');
        }

        // Init horizontal scrollbar or hide it
        if (contentScrollWidth > contentHolder.width()) {
            self.initScrollbar(ops.scrollbarOriented.HORIZONTALLY);
        }
        else {
            self.getUiElement('horizScrollbar').css('display', 'none');
        }
    },

    initScrollbar: function (oriented) {
        var self = this,
            scrollbar = self.getScrollbarByOrientation(oriented),
            handle = self.getScrollbarHandleByOrientation(oriented),
            contentHolder = self.getUiElement('contentHolder'),
            plugin = self,

        // Resolve scrollbar direction variables
            scrollVars = plugin.getScrollDirVars(oriented),
            dragAxis = scrollVars.dragAxis,
            dir = scrollVars.cssCalcDir,
            dimProp = scrollVars.scrollbarDimProp;

        // Resize handle
        plugin.initScrollbarHandle(oriented);

        // Make draggable handle on scrollbar
        handle = handle.draggable({
            containment: 'parent',
            cursor: 's-resize',
            axis: dragAxis,
            drag: function (e, ui) {
                var percentScroll =
                    ui.position[dir] / scrollbar[dimProp]();

                contentHolder['scroll' + sjl.ucaseFirst(dir)]
                    (percentScroll * scrollVars.scrollAmountTotal);
            }
        });

        // On Scroll bar click
        scrollbar.bind('click', function (e) {
            e.stopPropagation();
            handle.css(dir, e['offset' + dragAxis.toUpperCase()]
                - handle[dimProp]() / 2);

            plugin.constrainHandle(oriented);
            plugin.scrollContentHolder(oriented);
        });

        // Save the draggable handle for later (for calling destroy on it for reinitialization
        self.saveDraggableHandleForLater(handle, oriented);
    },

    initScrollbarHandle: function (oriented) {
        var contentHolder = this.getUiElement('contentHolder'),
            scrollBar = this.getScrollbarByOrientation(oriented),
            handle = this.getScrollbarHandleByOrientation(oriented),
            vars = this.getScrollDirVars(oriented),
            dimProp = vars.scrollbarDimProp,
            contentDimVal = contentHolder[dimProp](),
            scrollTotal = contentHolder.get(0)['scroll'
                + sjl.ucaseFirst(dimProp)],
            scrollbarDimVal = scrollBar[dimProp]();
        handle[dimProp]
            ((contentDimVal * scrollbarDimVal) / scrollTotal);
    },

    getScrollDirVars: function (oriented) {
        var plugin = this,
            ops = plugin.options,
            contentHolder = this.getUiElement('contentHolder'),
            retVal;

        // Resolve scrollbar direction variables
        if (oriented === plugin.options.scrollbarOriented.VERTICALLY) {
            retVal = {
                dragAxis: 'y',
                cssCalcDir: 'top',
                scrollbarDimProp: 'height',
                scrollAmountTotal: contentHolder.get(0).scrollHeight
            }
        }
        else {
            retVal = {
                dragAxis: 'x',
                cssCalcDir: 'left',
                scrollbarDimProp: 'width',
                scrollAmountTotal: contentHolder.get(0).scrollWidth
            }
        }

        return retVal;
    },

    getScrollbarByOrientation: function (oriented) {
        var ops = this.options;
        return oriented === ops.scrollbarOriented.VERTICALLY ?
            this.getUiElement('vertScrollbar') : this.getUiElement('horizScrollbar');
    },

    getScrollbarHandleByOrientation: function (oriented) {
        var ops = this.options;
        return oriented === ops.scrollbarOriented.VERTICALLY ?
            this.getUiElement('vertHandle') : this.getUiElement('horizHandle');
    },

    scrollVertically: function (value) {
        this._scrollByOrientation(value,
            this.options.scrollbarOriented.VERTICALLY);
    },

    scrollHorizontally: function (value) {
        this._scrollByOrientation(value,
            this.options.scrollbarOriented.HORIZONTALLY);
    },

    saveDraggableHandleForLater: function (handle, oriented) {
        var self = this,
            ops = self.options;
        if (oriented === ops.scrollbarOriented.VERTICALLY) {
            ops.draggableVertHandle = handle;
        }
        else {
            ops.draggableHorizHandle = handle;
        }
    },

    refresh: function () {
        var self = this,
            ops = self.options,
            vertHandle = ops.draggableVertHandle,
            horizHandle = ops.draggableHorizHandle;

        try {

            // Destroy draggable on handle
            if (!sjl.empty(vertHandle) && vertHandle instanceof $) {
                vertHandle.draggable('destroy');
            }

            // Destroy draggable on handle
            if (!sjl.empty(horizHandle) && horizHandle instanceof $) {
                horizHandle.draggable('destroy');
            }

        }
        catch (e) { }

        // Re-initialize scrollbars (recalc heights, widths,
        // and make draggable and constrainable etc.
        self.initScrollbars();
    },

    _destroy: function () {
        var self = this,
            ops = self.options;

        // Undo original element manipulations
        self.element.attr('overflow', ops.originalOverflow);

        // Unbind keydown event
        $(window).unbind('keydown');

        // Remove created elements
        self._removeCreatedElements();

        // Remove plugin class name
        self.element.removeClass(ops.pluginClassName);

        // Unbind mousewheel event and scroll (left, right) to position 0
        self.getUiElement('contentHolder').unbind('mousewheel')
            .scrollLeft(0).scrollTop(0);

        // Call jquery.ui.widget's _destroy method
        this._super();
    }

});


/**
 * Created by ElyDeLaCruz on 1/21/14.
 */
(function () {

    function returnSetVars() {
        return sjl.argsToArray(arguments).filter(function (value) {
            return sjl.isset(value);
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
            self._autoPopulateUiElements(self, self.element, ops);

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
            if (!sjl.empty(className)) {
                if (!sjl.empty(currentClassName)
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
            this._namespace('titleText', this.options, value);
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

/**
 * Created by edelacruz on 2/3/14.
 * @todo add destory and remove event listeners  methods/functions.
 */
$.widget('jui.juiScalableBtn', $.jui.juiBase, {

    options: {
        duration: null,

        defaultDurationsVal: 0.116,

        onHoverOptions: {
            duration: null,
            props: {scale: 1.16, ease: Linear.easeNone}
        },

        onMousedownOptions: {
            duration: null,
            props: {scale: 0.9, ease: Linear.easeNone}
        },

        onMouseupOptions: {
            duration: null,
            props: {scale: 1.16, ease: Linear.easeNone}
        },

        onMouseoutOptions: {
            duration: null,
            props: {scale: 1, ease: Linear.easeNone}
        }
    },

    _create: function () {
    },

    _init: function () {
        if (!sjl.isset(this.options._eventListenersHaveBeenAdded)) {
            this._addEventListeners();
            this.options._eventListenersHaveBeenAdded = true;
        }
    },

    _addEventListeners: function () {
        var self = this,
            ops = self.options,
            elm = self.element,
            defaultDuration = self._getOverridingDuration() || ops.defaultDurationsVal,
            hoverOps = ops.onHoverOptions,
            mousedownOps = ops.onMousedownOptions,
            mouseupOps = ops.onMouseupOptions,
            mouseoutOps = ops.onMouseoutOptions
            ;

        elm.bind('mouseover', function (e) {
            TweenLite.to(elm, hoverOps.duration || defaultDuration, hoverOps.props);
        })
            .bind('mousedown', function (e) {
                TweenLite.to(elm, mousedownOps.duration || defaultDuration, mousedownOps.props);
            })
            .bind('mouseup', function (e) {
                TweenLite.to(elm,  mouseupOps.duration || defaultDuration, mouseupOps.props);
            })
            .bind('mouseout', function (e) {
                TweenLite.to(elm, mouseoutOps.duration || defaultDuration, mouseoutOps.props);
            });
    },

    _getOverridingDuration: function () {
        var ops = this.options,
            retVal = null;
        if (!sjl.isset(ops.duration)) {
            retVal = ops.duration;
        }
        else {
            retVal = ops.defaultDurationsVal;
        }
        return retVal;
    },

    _removeEventListeners: function () {
        this.element.unbind();
    },

    _destroy: function () {
        this._removeEventListeners();
    }

});

/**
 * Created by ElyDeLaCruz on 10/1/13.
 * A scrollable drop down.
 *
 * @class $.jui.juiScrollableDropdown
 *
 * @requires jquery
 * @requires jquery.ui.core
 * @requires jquery.ui.widget
 * @requires jquery.ui.draggable
 * @requires TweenMax
 * @requires jquery.juiBase
 * @requires jquery.juiScrollPane
 *
 * @triggers expand
 * @triggers collapse
 */
$.widget('jui.juiScrollableDropDown', $.jui.juiBase, {

    options: {
        className: 'jui-scrollable-drop-down',

        ui: {
            contentElm: {
                elm: null,
                selector: '> .content'
            }
        },

        // Example animations hash
        defaultAnimations: [{
                type: 'from',
                duration: 0.34,
                elmAlias: 'contentElm',
                props: {css: {height: 0, autoAlpha: 0}}
            }
        //    {
        //        type: 'to',
        //        duration: 0.34,
        //        elmAlias: 'scrollbar',
        //        props: {css: {autoAlpha: 1},
        //            delay: -0.13}
        //}
        ],

        // Expand select-picker on event
        expandOn: 'click',
        expandOnClassNamePrefix: 'expands-on',
        expandClassName: 'expanded',

        // Collapse select-picker on event
        collapseOn: 'click',
        collapseOnClassNamePrefix: 'collapses-on',
        collapseClassName: 'collapsed',

        // States
        states: {
            COLLAPSED: 'collapsed',
            EXPANDED: 'expanded'
        },

        // State
        state: null
    },

    _create: function () {
        var self = this,
            ops = self.options,
            contentElm,
            timeline = this.gsapTimeline();

        self._super();

        // Add event class names
        self.element
            .addClass(ops.className)
            .addClass(self._getExpandOnClassName())
            .addClass(self._getCollapseOnClassName())
            .addClass('collapsed');

        // Populate ui elements on self (self.ui[elmKeyAlias])
        self._autoPopulateUiElements(self, self.element, ops);

        // Get content element
        contentElm = self.getUiElement('contentElm');

        if (ops.isLessThanIE9) {
            contentElm.css('display', 'block');
        }

        // Save original css `display` and `visibility` values
        self._namespace('ui.contentElm.originalCss',
            ops, {
                display: contentElm.css('display'),
                visibility: contentElm.css('visibility')
            });
    },

    _init: function () {
        var ops = this.options;

        // Add event listeners
        this._addEventListeners();

        // Set collapsed state
        ops.state = ops.state || ops.states.COLLAPSED;

        // Ensure animation functionality
        this.ensureAnimationFunctionality();

        if (!ops.isTouchDevice) {
            // Start initial animation
            ops.state === ops.states.COLLAPSED ? this.reverseAnimation() :
                this.playAnimation();
        }
    },

    _getExpandOnClassName: function () {
        var ops = this.options;
        return ops.expandOnClassNamePrefix
            + ops.expandOn;
    },

    _getExpandOnEventStringName: function () {
        return this.options.expandOn;
    },

    _getCollapseOnClassName: function () {
        var ops = this.options;
        return ops.collapseOnClassNamePrefix
            + ops.collapseOn;
    },

    _getCollapseOnEventStringName: function () {
        return this.options.collapseOn;
    },

    _addEventListeners: function () {
        var self = this,
            states = self.options.states,
            ops = self.options,
            collapseOnMouseEvent = self._getCollapseOnEventStringName(),
            expandOnMouseEvent = self._getExpandOnEventStringName();

        // If expand and collapse events are the same (use toggle pattern)
        if (expandOnMouseEvent === collapseOnMouseEvent) {
            self.element.on(expandOnMouseEvent, function (e) {
                if (self.options.state === states.COLLAPSED) {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.EXPANDED;
                    self.element.removeClass(ops.collapseClassName)
                        .addClass(ops.expandClassName)
                        .trigger('expand', e);
                    self.playAnimation();
                }
                else {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.COLLAPSED;
                    self.element
                        .removeClass(ops.expandClassName)
                        .addClass(ops.collapseClassName)
                        .trigger('collapse', e);
                    self.reverseAnimation();
                }
            });
        }
        else {
            // On expand event
            self.element.on(expandOnMouseEvent, function (e) {
                self.ensureAnimationFunctionality();
                self.options.state = states.EXPANDED;
                self.element.removeClass(ops.collapseClassName);
                self.element.addClass(ops.expandClassName);
                self.element.trigger('expand', e);
                self.playAnimation();
            })
                // On collapse event
                .on(collapseOnMouseEvent, function (e) {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.COLLAPSED;
                    self.element.removeClass(ops.expandClassName);
                    self.element.addClass(ops.collapseClassName);
                    self.element.trigger('collapse', e);
                    self.reverseAnimation();
                });
        }

        // When clicking outside of drop down close it
        $(window).on('click', function (e) {
            if ($.contains(self.element.get(0), e.target) === false
                && ops.gsapTimeline.progress() === 1) {
                if (self.options.state === states.EXPANDED) {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.COLLAPSED;
                    self.element.removeClass(ops.expandClassName);
                    self.element.addClass(ops.collapseClassName);
                    self.element.trigger('collapse', e);
                    self.reverseAnimation();
                }
            }
        });

    },

    _removeEventListeners: function () {
        this.element
            .off(this._getCollapseOnEventStringName())
            .off(this._getExpandOnEventStringName());
    },

    _initScrollbar: function () {
        var ops = this.options,
            scrollbar = this._namespace('ui.scrollbar', ops);

        if (!sjl.empty(scrollbar.elm) && scrollbar.elm.length > 0) {
            return;
        }

        this.options.juiScrollPaneElm = this.element.juiScrollPane({
            ui: {
                contentHolder: {
                    elm: this.getUiElement('contentElm'),
                    selector: ops.ui.contentElm.selector + ''
                }
            }
        });

        scrollbar.elm = $('.vertical.scrollbar', this.element);
    },

    initAnimationTimeline: function () {
        this._initAnimationTimeline();
    },

    _initTimeline: function () {
        if (sjl.empty(this.options.gsapTimeline)) {
            this.initAnimationTimeline()
        }
    },

    setStateTo: function (state) {
        this.options.state = typeof state !== 'undefined'
            && state === 'expanded' ? this.options.states.EXPANDED
            : this.options.states.COLLAPSED;
    },

    ensureAnimationFunctionality: function () {
        if (this.options.isLessThanIE9) {
            return;
        }
        this._initScrollbar();
        this._initTimeline();
    },

    /**
     * Plays animation timeline (if disableOnTouchDevice is true and isTouchDevice, does nothing).
     * @return {void}
     */
    playAnimation: function () {
        var self = this,
            ops = self.options;
        // Bail if device/browser not supported
        if ((ops.disableOnTouchDevice && ops.isTouchDevice) || (ops.isLessThanIE9)) {
            return;
        }
        ops.gsapTimeline.play();
    },

    /**
     * Reverses the animation timeline if not touch device.
     * @return {void}
     */
    reverseAnimation: function () {
        var self = this,
            ops = self.options;
        // Bail if device/browser not supported
        if ((ops.disableOnTouchDevice && ops.isTouchDevice) || (ops.isLessThanIE9)) {
            return;
        }
        ops.gsapTimeline.reverse();
    },

    destroy: function () {
        this._removeCreatedElements();
        this._removeEventListeners();
        this._super();
    },

    refresh: function () {
        this.element.juiScrollPane('refresh');
    },

    getState: function () {
        return this.options.state;
    }

});

/**
 * Created by ElyDeLaCruz on 10/1/13.
 *
 * Hides a Select Element and Replaces it with a scrollable Select Picker element
 * which is fully stylable.
 *
 * @class jquery.juiSelectPicker
 *
 * @requires jquery
 * @requires jquery.ui (core)
 * @requires jquery.ui.widget
 * @requires jquery.juiScrollableDropdown
 *
 * @todo convert all inline option docs to options doclet using the @ property tag
 *
 */
$.widget('jui.juiSelectPicker', $.jui.juiBase, {

    /**
     * Options hash.
     * @type {Object}
     * @property className {String}
     * @property animation {Object}
     * @property labelText {String}
     */
    options: {

        /**
         * Collapse on event
         * @type {String}
         */
        collapseOn: 'click',

        /**
         * Expand on event
         * @type {String}
         */
        expandOn: 'click',

        /**
         * Class name added to wrapper element.
         * @param {String} default: 'jui-select-picker';
         */
        className: 'jui-select-picker',

        /**
         * Animation options.
         * @type {Object}
         */
        animation: {
            duration: 0.30
        },

        /**
         * Label text.
         * @type {String}
         */
        labelText: '',

        /**
         * Selected Value Label Prefix.
         * @type {String}
         */
        selectedLabelPrefix: '',

        /**
         * Selected Value Label Suffix.
         * @type {String}
         */
        selectedLabelSuffix: '',

        /**
         * Flag for using selected value label suffix and prefix.
         * @type {String}
         */
        useSelectedLabelPrefixAndSuffix: false,

        /**
         * Skip the first option from the select element in rendering to wrapper.
         * @type {Boolean}
         */
        skipFirstOptionItem: false,

        /**
         * Selected Value.
         * @type {mixed|null}
         */
        selectedValue: null,

        /**
         * The attribute to get the value from on the select element's option element.
         * @type {String} - default 'value'
         */
        valueAttribName: 'value',

        /**
         * Where to get the label string for the option from (if 'html', or
         * 'text uses jquery to pull the 'html'/'text' from the select element's
         * option element).
         * @type {String} - default 'html'
         */
        labelAttribName: null,

        /**
         * Ui Hash.
         * @type {Object}
         */
        ui: {
            wrapperElm: {
                elm: null,
                attribs: {
                    'class': 'jui-select-picker'
                },
                appendTo: "after this.element",
                selector: '.jui-select-picker',
                html: '<div></div>',
                create: true,
                timeline: new TimelineLite(),
                suggestedExpandHeight: null
            },
            buttonElm: {
                elm: null,
                attribs: {
                    'class': 'button'
                },
                selector: '> .button',
                html: '<div></div>',
                appendTo: 'wrapperElm',
                create: true
            },
            buttonArrowElm: {
                elm: null,
                attribs: {
                    'class': 'arrow'
                },
                selector: '> .arrow',
                html: '<div></div>',
                appendTo: 'buttonElm',
                create: true
            },
            labelElm: {
                elm: null,
                attribs: {
                    'class': 'label'
                },
                text: '',
                selector: '> .label',
                html: '<span></span>',
                appendTo: 'buttonElm',
                create: true
            },
            selectedItemLabelElm: {
                elm: null,
                attribs: {
                    'class': 'selected-item-label selected'
                },
                prefixText: 'You\'ve chosen "',
                suffixText: '"',
                selector: '> .selected-item-label',
                html: '<span></span>',
                appendTo: 'buttonElm',
                create: true
            },
            bodyElm: {
                elm: null,
                attribs: {
                    'class': 'body'
                },
                selector: '> .body',
                html: '<div></div>',
                appendTo: 'wrapperElm',
                create: true
            },
            optionsElm: {
                elm: null,
                attribs: {
                    'class': 'options'
                },
                selector: '.options',
                html: '<div></div>',
                appendTo: 'bodyElm',
                create: true,
                optionSelectedClassName: 'selected',
                suggestedExpandHeight: null
            }
        }
    },

    /**
     * Sets flag if touch device (used for disable plugin if options.disableOnTouchDevice
     * is true).
     * @private
     */
    _create: function () {
        this._super();
    },

    /**
     * Initializes the select picker:
     * - Hides select element plugin was called on;
     * - Adds css classes for wrapper;
     * - Sets initial label text;
     * - Draws options within wrapper;
     * - Initializes scrollable drop down on wrapper;
     * - and Adds event listeners;
     * @private
     */
    _init: function () {
        var self = this,
            ops = this.options,
            className = self.getValueFromHash('className', ops),
            currentClassName =
                self.getValueFromHash('ui.wrapperElm.attribs', ops)['class'];

        if (ops.disableOnTouchDevice && ops.isTouchDevice) {
            return;
        }

        // Resolve class name
        if (!sjl.empty(className)) {
            if (!sjl.empty(currentClassName)
                && typeof currentClassName === 'string') {
                ops.ui.wrapperElm.attribs['class'] += ' ' + className;
            }
            else {
                ops.ui.wrapperElm.attribs['class'] = className;
            }
        }

        // Hide this element and append new markup beside where it used
        // to be
        this.element.attr('hidden', 'hidden').css('display', 'none');

        // Populate ui elements on this (this.options.ui[elmKeyAlias])
        this._autoPopulateUiElements(this, this.element, this.options);

        // Set button text/label
        this.setLabelText();

        // Draw select options from this element onto our element
        this._drawSelectOptions();

        // Scrollable Drop Down
        this._initScrollableDropDown();

        // Listeners
        this._addEventListeners();
    },

    /**
     * Draws select element's options into wrapper.
     * @private
     */
    _drawSelectOptions: function () {
        var self = this,
            optionsElm = self.getUiElement('optionsElm'),
            options = self.element.find('option'),
            ul = $('<ul></ul>'),
            ops = self.options,
            suggestedExpandHeight = 0;

        // Loop through option elements and copy them over to our
        // options container
        options.each(function (i, option) {
            // From dom element to jquery element
            option = $(option);

            // If button label is using first option from options list
            // Don't redraw this first option
            if (i === 0 && ops.skipFirstOptionItem) {
                return;
            }

            var value = self.getValueFromOptionElm(option),
                label = self.getLabelFromOptionElm(option),
                classValue = option.attr('class'),
                liClassValue = '';

            // Preselect item if necessary
            if (sjl.isset(ops.selectedValue) &&
                (ops.selectedValue === value)) {
                if (!sjl.empty(liClassValue)) {
                    if (liClassValue.length > 0) {
                        liClassValue += ' ';
                    }
                    liClassValue += ops.ui.optionsElm.optionSelectedClassName;
                }
                else {
                    liClassValue = ops.ui.optionsElm.optionSelectedClassName;
                }

                liClassValue = ' class="' + liClassValue + '"';
            }

            // Resolve class attribute and data-value attribute
            classValue = !sjl.empty(classValue) ? 'class="' + classValue + '" ' : '';
            value = ' data-value="' + value + '" ';

            // Build list element
            var li = $('<li' + liClassValue + '><a ' + classValue + 'href="javascript: void(0);"'
                + value + '>' + label + '</a></li>');

            // Add first class
            if (i === 0 && !sjl.empty(ops.ui.buttonElm.text)) {
                li.addClass('first');
            }
            else if (i === 1 && sjl.empty(ops.ui.buttonElm.text)) {
                li.addClass('first');
            }

            // Add last class
            if (i === options.length - 1) {
                li.addClass('last');
            }

            // Append option to unoredered list element
            ul.append(li);
        });

        // Append unordered list element
        optionsElm.append(ul);

        // Get height of first ul > li element
        options = $('li', optionsElm);

        // Get suggested expand height
        options.each(function () {
            var elm = $(this),
            padding = parseInt(elm.css('padding'));
            padding = padding === 0 ? parseInt(elm.css('paddingTop'), 10) : 0;
            padding = padding === 0 ? parseInt(elm.css('paddingBottom'), 10) : 0;
            suggestedExpandHeight += elm.height() + (padding * 2);
        });

        // Set suggested expand height
        ops.ui.optionsElm.suggestedExpandHeight = suggestedExpandHeight;
    },

    /**
     * Adds event listeners for:
     * - wrapper - mouseup;
     * - wrapper - a[data-value] click;
     * @private
     */
    _addEventListeners: function () {
        var self = this,
            ops = self.options,
            wrapperElm = self.getUiElement('wrapperElm');

        // Option/A-Tag click
        wrapperElm.on('mouseup', 'a[data-value]', function (e) {
            var elm = $(e.currentTarget);
            self.clearSelected();
            self.setSelected(elm);
            // If mouseleave event force the select picker to collapse
            // via scrollable dropdown
            if (ops.collapseOn === 'mouseleave') {
                wrapperElm.trigger(ops.collapseOn);
            }
        });
    },

    /**
     * Removes created options.
     * @private
     */
    _removeCreatedOptions: function () {
        this.getUiElement('optionsElm').find('ul').remove();
    },

    /**
     * Makes wrapper's content scrollable.
     * - Calls jui.scrollableDropDown on wrapper;
     * @private
     */
    _initScrollableDropDown: function () {
        var self = this,
            ops = self.options,
            wrapperElm = self.getUiElement('wrapperElm'),
            contentElm = self.getUiElement('optionsElm'),
            duration = ops.animation.duration,
            scrollbarElm,
            timeline,
            dropDown,
            dropDownOptions,
            tween,
            tweens;

        // Scrollable drop down options
        dropDownOptions = {
            state: 'collapsed',
            ui: {
                contentElm: {
                    elm: this.getUiElement('optionsElm'),
                    attribs: ops.ui.optionsElm.attribs,
                    selector: ops.ui.optionsElm.selector + ''
                }
            }};

        // Set expands on event value
        if (sjl.isset(ops.expandOn)) {
            dropDownOptions.expandOn = ops.expandOn;
        }

        // Set collapses on event value
        if (sjl.isset(ops.collapseOn)) {
            dropDownOptions.collapseOn = ops.collapseOn;
        }

        // Apply scrollable drop down on wrapper element
        dropDown = wrapperElm.juiScrollableDropDown(dropDownOptions);

        // If less than ie 9 bail
        if (ops.isLessThanIE9) {
            return;
        }

        // Get the dropdowns timeline
        timeline = dropDown.juiScrollableDropDown('gsapTimeline');
        timeline.pause(0);
        timeline.clear();

        // Get scrollbar element
        scrollbarElm = $('.vertical.scrollbar', wrapperElm);

        // Add custom tweens for select picker animation
        tweens = [
            TweenLite.to(wrapperElm, duration, {height: self.getSuggestedWrapperExpandHeight()}),
            TweenLite.to(contentElm, duration, {height: self.getSuggestedContentExpandHeight(), autoAlpha: 1, delay: -0.34}),
            TweenLite.to(scrollbarElm, duration, {opacity: 1, delay: -0.21})
        ];

        // Supply new tweens
        for (tween = 0; tween < tweens.length; tween += 1) {
            timeline.add(tweens[tween]);
        }

        // Set drop down on self for access later
        self.options.dropDownElm = dropDown;
    },

    /**
     * Destroys `this` instance.
     * - Shows hidden select element;
     * - Removes created options;
     * - and calls _super's destroy method (to finish up the cleaning process);
     * @returns {void}
     */
    destroy: function () {
        this.element.removeAttr('hidden');
        this._removeCreatedOptions();
        this._super();
    },

    /**
     * Refreshes the currently drawn options.
     * - Sets selected value;
     * - removes options;
     * - recreates options;
     * - sets label text;
     * @returns {void}
     */
    refreshOptions: function () {
        this.options.selectedValue = this.getSelectedOwnOptionElmValue();
        this._removeCreatedOptions();
        this._drawSelectOptions();
        this.setLabelText();
        this.refreshScrollbar();
    },

    refresh: function () {
       this.refreshOptions();
    },

    /**
     * @todo remove this function and use external components refresh method instead
     */
    refreshScrollbar: function () {
        this.options.dropDownElm.juiScrollableDropDown('refresh');
    },

    getSuggestedWrapperExpandHeight: function () {
        var self = this,
            wrapperElm = self.getUiElement('wrapperElm'),
            maxHeight = self.getMaxHeightFromElm(wrapperElm) || 220,
            wrapperPaddingTopBottomSum = self.getWrapperElmPaddingTopBottomSum(),
            suggestedExpandHeight = self.getSuggestedContentExpandHeight()
            + (wrapperPaddingTopBottomSum <= -1 ? 0 : wrapperPaddingTopBottomSum);

        // Return suggested height
        return suggestedExpandHeight > maxHeight ? maxHeight : suggestedExpandHeight;
    },

    getSuggestedContentExpandHeight: function () {
        var self = this,
            optionsElm = self.getUiElement('optionsElm'),
            optionsMaxHeight = self.getMaxHeightFromElm(optionsElm),
            suggestedOptionsHeight = self.options.ui.optionsElm.suggestedExpandHeight;

        return suggestedOptionsHeight > optionsMaxHeight ? optionsMaxHeight : suggestedOptionsHeight;
    },

    getWrapperElmPaddingTopBottomSum: function () {
        var self = this,
            wrapperElm = self.getUiElement('wrapperElm'),
            optionsElm = self.getUiElement('optionsElm'),
            optionsElmMaxHeight = self.getMaxHeightFromElm(optionsElm) || 180,
            wrapperElmMaxHeight = self.getMaxHeightFromElm(wrapperElm) || 220;

        return wrapperElmMaxHeight - optionsElmMaxHeight;
    },

    getMaxHeightFromElm: function (elm) {
        var maxHeight = elm.css('max-height');
        return sjl.classOfIs(maxHeight, 'String') ?
            parseInt(maxHeight) : maxHeight;
    },

    /**
     * Sets the select picker's `selected item label`.
     * @param text {string} value to set to label; default ''
     * @param textType {string} (html|text) (proxy jquery's text() and/or html() methods to set text).  Default 'text'
     * @param usePrefixAndSuffix {boolean} Whether to use prefix and suffix for label text. Default false
     * @returns {void}
     */
    setSelectedItemLabelText: function (text, textType, usePrefixAndSuffix) {
        var ops = this.options,
            config = ops.ui.selectedItemLabelElm,
            elm = this.getUiElement('selectedItemLabelElm').eq(0),
            prefixText, suffixText;

        text = text || '';
        textType = textType || 'text';
        usePrefixAndSuffix = sjl.isset(usePrefixAndSuffix)
            ? usePrefixAndSuffix : ops.useSelectedLabelPrefixAndSuffix;

        if (usePrefixAndSuffix) {
            prefixText = ops.selectedLabelPrefix || config.prefixText || '';
            suffixText = ops.selectedLabelSuffix || config.suffixText || '';
            text = prefixText + text + suffixText;
        }

        // @todo move this declaration to the add event listeners
        // function and optimize it
        TweenMax.to(elm, 0.16, {
            autoAlpha: 0,
            onCompleteParams: [text, textType, elm],
            onComplete: function () {
                var args = arguments,
                    text = args[0],
                    textType = args[1],
                    elm = args[2];
                elm[textType](text);
                TweenMax.to(elm, 0.16, {autoAlpha: 1});
            }});
    },

    /**
     * Sets the select picker's label.
     * @param text {string} value to set on label;
     * @param textType {string} proxy key for jquery for setting text. Default 'text'
     * @return {void}
     */
    setLabelText: function (text, textType) {
        textType = textType || 'text';
        text = text || (!sjl.empty(this.options.ui.buttonElm.text)
            ? this.options.ui.buttonElm.text
            : (!sjl.empty(this.options.labelText) ? this.options.labelText :
            this.element.find('option').eq(0).text()));
        this.getUiElement('labelElm').eq(0)[textType](text);
    },

    /**
     * Sets the selected element in the wrapper's drawn options.
     * - Triggers a change event on this.element (select element);
     * @param elm {jquery} The actual element that should be selected.
     * @return {void}
     */
    setSelected: function (elm) {
        if (elm.length === 0) {
            return;
        }
        elm.parent().addClass(this.options.ui.optionsElm.optionSelectedClassName);
        this.options.selectedValue = elm.attr('data-value');
        this.element.val(elm.attr('data-value')).trigger('change');
        this.setSelectedItemLabelText(this.options.selectedValue);
    },

    /**
     * Clears the currently selected element.
     * @returns {void}
     */
    clearSelected: function () {
        this.getUiElement('optionsElm')
            .find('> ul > li').removeClass(
                this.options.ui.optionsElm.optionSelectedClassName);
        this.options.selectedValue = null;
    },

    /**
     * Plays animation timeline (if disableOnTouchDevice is true and isTouchDevice, does nothing).
     * @return {void}
     */
    playAnimation: function () {
        var self = this,
            ops = self.options;
        if ((ops.disableOnTouchDevice && ops.isTouchDevice)
        || (ops.isLessThanIE9)) {
            return;
        }
        ops.gsapTimeline.play();
    },

    /**
     * Reverses the animation timeline if not touch device.
     * @return {void}
     */
    reverseAnimation: function () {
        var self = this,
            ops = self.options;
        if ((ops.disableOnTouchDevice && ops.isTouchDevice)
            || (ops.isLessThanIE9)) {
            return;
        }
        ops.gsapTimeline.reverse();
    },

    /**
     * Gets a drawn option element (from within wrapper) by value.
     * @param value
     */
    getOwnOptionElmByValue: function (value) {
        this.getUiElement('optionsElm')
            .find('[data-value="' + value +'"]');
    },

    /**
     * Gets the selected option's value (from within wrapper).
     * @returns {*}
     */
    getSelectedOwnOptionElmValue: function () {
        return this.getUiElement('optionsElm')
            .find('.' + this.options.ui.optionsElm.optionSelectedClassName)
            .find('a').attr('data-value');
    },

    /**
     * Get's an option element's value.
     * @param option
     * @returns {*} - null or option's value
     */
    getValueFromOptionElm: function (option) {
        var ops = this.options,
            value;

        // If no selection
        if (sjl.empty(option)) {
            return null;
        }

        // If we have a value attribute name, get value by attribute name
        if (sjl.isset(ops.valueAttribName)) {
            value = option.attr(ops.valueAttribName);
        }

        // Else use the option elements text
        return !sjl.isset(value) ? option.text() : value;
    },
    
    /**
     * Get's an option element's label.
     * @param option
     * @returns {*} - null or option's label
     */
    getLabelFromOptionElm: function (option) {
        var ops = this.options,
            label;

        // If no selection
        if (sjl.empty(option)) {
            return null;
        }

        // If we have a label attribute name, get label by attribute name
        if (sjl.isset(ops.labelAttribName)) {
            label = option.attr(ops.labelAttribName);
        }

        // Else use the option elements text
        return !sjl.isset(label) ? option.text() : label;
    }

});
