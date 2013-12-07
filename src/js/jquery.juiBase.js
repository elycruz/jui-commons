/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 4:27 AM
 * @module jQuery.jui.juiBase
 * @desc JUI Plugins Base.
 * @extends jQuery.Widget - JQuery Ui Widget Factory Constructor.
 * @requires jQuery
 * @requires jQuery.ui - JQuery Ui Core.
 * @requires jquery.widget - JQuery Ui Widget Factory.
 * @todo Resolve issue with non-unique timeline object -
 * Timeline object seems to be only one instance not new instances on
 * new calls of the extending plugins.
 */
$.widget('jui.juiBase', {

    /**
     * Options hash.
     * @type {Object}
     */
    options: {
        defaultTimelineClass: 'TimelineLite',
        timeline: null,
        ui: {}
    },

    /**
     * Takes a namespace string and fetches that location out from
     * an object.  If the namespace doesn't exists it is created then
     * returned.
     * Example: _namespace('hello.world.how.are.you.doing') will
     * create/fetch:
     * hello: { world: { how: { are: { you: { doing: {} } } } } }
     * @param ns_string {String} the namespace you wish to fetch
     * @param extendObj {Object} optional, default this.options
     * @returns {Object}
     */
    _namespace: function (ns_string, extendObj) {
        var parts = ns_string.split('.'),
            parent = isset(extendObj) ? extendObj : this.options,
            i;

        for (i = 0; i < parts.length; i += 1) {
            if (typeof parent[parts[i]] === 'undefined') {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }

        return parent;
    },

    /**
     * Populates this.ui with element collections from this.options.
     * @param config {Object|String} optional, default this.options
     * @return {void}
     */
    _populateUiElementsFromOptions: function (options) {
        var self = this,

        // Get options
            ops = !isset(options) ? this.options : options;

        // Set our ui collection
        if (!isset(ops.ui)) {
            ops.ui = {};
        }

        // Ui ops
        ops = ops.ui;

        // Loop through ops and populate elements
        Object.keys(ops).forEach(function (key) {

            // If key is string
            if (typeof ops[key] === 'string') {
                ops[key] = ops[key] = $(ops[key], self.element);
            }

            // If key is plain object
            if ($.isPlainObject(ops[key])) {
                ops[key].elm = self._getElementFromOptions(ops[key]);
            }

        });
    },

    /**
     * Fetches an element from the option hash's `ui` namespace.
     * @param optionKey {Object|String}
     * @returns {null|jQuery} null or the jquery element selection
     */

    _getElementFromOptions: function (optionKey) {
        var self = this,
            ops = self.options,
            config = optionKey,
            parent;

        // If config is a string
        if (typeof config === 'string') {
            config = self._namespace(config, ops);
        }

        // If config is a function
        if (typeof config === 'function') {
            config = config();
        }

        // If config is empty return
        if (empty(config)) {
            return null;
        }

        // If config is jquery selection return it
        if (config instanceof $ && config.length > 0) {
            return config;
        }
        else if (isset(config.elm)
            && config.elm instanceof $ && config.length > 0) {
            return config.elm
        }

        // If Selector
        if (isset(config.selector)
            && empty(config.create)
            && typeof config.selector === 'string') {
            if (typeof config.appendTo === 'string'
                && config.appendTo.length > 0
                && config.appendTo.indexOf('this') === -1) {
                config.elm = $(config.selector,
                    self.getUiElement(config.appendTo));
            }
            else {
                config.elm = $(config.selector, self.element);
            }
        }

        // Create element and `append to` config section if necessary
        if (!empty(config.html) && config.create
            && typeof config.html === 'string') {

            // Create element
            config.elm = this._createElementFromOptions(config);

            if (isset(config.appendTo)
                && typeof config.appendTo === 'string') {
                parent = this.element.parent();
                if (config.appendTo === 'this.element') {
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
            }

            delete config.create;
        }

        // Return element
        return !empty(config.elm) ? config.elm : null;
    },

    /**
     * Create and Element from the options.ui hash and appends it to
     * it's config.appendTo section alias string.
     * @param config {Object} the options object from which to create
     *  and where to populate the created element to.
     * @returns {null|jQuery}
     */
    _createElementFromOptions: function (config) {
        var elm = null;

        // If config is string look it up in our options hash
        if (isset(config) && typeof config === 'string') {
            config = this._namespace(config);
        }

        // If config is empty
        if (empty(config)) {
            return null;
        }

        // Assume config is an object
        if (config.html) {
            elm = $(config.html);
            if (isset(config.attribs)
                && $.isPlainObject(config.attribs)) {
                elm.attr(config.attribs);
            }
            delete config.create;
        }
        return elm;
    },

    /**
     * Remove created elements from the options.ui hash plugin.
     * @returns {void}
     */
    _removeCreatedElements: function () {
        var self = this, ops = self.options;
        ops.ui.keys.forEach(function (x) {
            if (ops.ui[key].elm instanceof $ && ops.ui[key].create) {
                ops.ui[key].elm.remove();
            }
        });
    },

    /**
     * Pulls a ui element from the options -> ui hash else uses
     * getElementFromOptions to create/fetch it.
     * @param {string} alias
     * @returns {*}
     */
    getUiElement: function (alias) {
        var ops = this.options;
        if (isset(ops.ui[alias])) {
            alias = ops.ui[alias].elm;
            if (alias instanceof $ && alias.length > 0) {
                return alias;
            }
        }
        return this._getElementFromOptions('ui.' + alias);
    },

    /**
     * Sets css on element if it exist.
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
     * @returns {TimelineMax|TimelineLite}
     */
    getAnimationTimeline: function () {
        var timeline = this.options.timeline;
        if (empty(timeline)) {
            timeline =
                this.options.timeline =
                    new window[this.options.defaultTimelineClass];
        }
        return timeline;
    },

    /**
     * Adds animations to our animation timeline.
     * @param timeline {TimelineLite|TimelineMax} optional
     * @param animations {array} optional animations array
     * @param options {object] optional options hash to search on
     * @returns default
     */
    _initAnimationTimeline: function (timeline, animations, options) {
        var self = this,
            ops,
            i, config, elm, dur, props,
            _animations;

        timeline = !isset(timeline) ? this.getAnimationTimeline() : timeline;
        options = options  || self.options;
        animations = animations || null;

        ops = options;

        // If default animations, use them
        if (isset(ops.defaultAnimations)
            && ops.defaultAnimations instanceof Array) {
            _animations = ops.defaultAnimations;
        }

        // If animations, use them (also override defaults if any)
        if (isset(ops.animations)
            && ops.animations instanceof Array && isset(_animations)) {
            _animations = isset(animations)
                ? $.extend(true, _animations, ops.animations) : ops.animations;
        }

        // Set animations variable
        if (isset(animations) && isset(_animations)) {
            animations = $.extend(true, _animations, animations);
        }
        else if (isset(_animations)) {
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
            if (isset(config.preInit) && typeof config.preInit === 'function') {
                config.preInit.apply(this);
            }

            // Init timeline
            timeline[config.type](elm, dur, props);

            // Post init function
            if (isset(config.postInit) && typeof config.postInit === 'function') {
                config.postInit.apply(this);
            }
        }
    },

    /**
     * Gets an option value from the options hash.  This function is a
     * proxy for `getValueFromHash` and it just sets the hash to `this.options`.
     * @see getValueFromHash
     * @param key
     * @returns {Object}
     */
    getValueFromOptions: function (key, args, raw) {
        return this.getValueFromHash (key, this.options, args, raw);
    },

    /**
     * Searches hash for key and returns it's value.  If value is a function
     * calls function, with optional `args`, and returns it's return value.
     * If `raw` is true returns the actual function if value is a function.
     * @param key {string} The hash key to search for
     * @param hash {object} optional, the hash to search within
     * @param args {array} optional the arrays to pass to value if it is a function
     * @param raw {boolean} optional whether to return value even if it is a function
     * @returns {*}
     */
    getValueFromHash: function (key, hash, args, raw) {
        var retVal = null;
        if (typeof key === 'string' && $.isPlainObject(hash)) {
            retVal = this._namespace(key, hash);
            if (typeof retVal === 'function' && empty(raw)) {
                retVal = retVal.apply(this, args);
            }
        }
        return retVal;
    }

});
