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
 */
$.widget('jui.juiBase',
    {

    /**
     * Options hash.
     * @type {Object}
     */
    options: {
        ui: {}
    },

    /**
     * Takes a namespace string and fetches that location out from an object.
     * If the namespace doesn't exists it is created then returned.
     * Example: _namespace('hello.world.how.are.you.doing') will create/fetch:
     * hello: { world: { how: { are: { you: { doing: {} } } } } }
     * @param ns_string {String} the namespace you wish to fetch
     * @param extendObj {Object} optional, default this.options
     * @returns {Object}
     */
    _namespace:  function(ns_string, extendObj) {
        var parts = ns_string.split('.'),
            parent = extendObj || this.options,
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
        var self = this;

        // Get options
        options = options || this.options.ui;

        // Set our ui collection
        if (!isset(self.ui)) {
            self.ui = {};
        }

        // Loop through options and populate elements
        Object.keys(options).forEach(function (key) {

            // If key is string
            if (typeof options[key] === 'string') {
                self.ui[key] = options[key] = $(options[key], self.element);
            }

            // If key is plain object
            if ($.isPlainObject(options[key])) {
                self.ui[key] = self._getElementFromOptions(options[key]);
            }

        });
        // /Loop through options
    },

    /**
     * Fetches an element from the option hash's `ui` namespace.
     * @param optionKey {Object|String}
     * @returns {null|jQuery} null or the jquery element selection
     */
    _getElementFromOptions:function (optionKey) {
        var self = this,
            ops = self.options,
            config = optionKey;

        // If config is a string
        if (typeof config === 'string') {
            config = self._namespace(config);
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
        if (config instanceof $) {
            return config
        }

        // If element is a jquery element
        if (isset(config.elm)
            && config.elm instanceof $
            && config.elm.length > 0) {
            return config.elm;
        }

        // If Selector
        if (isset(config.selector)
            && empty(config.create)
            && typeof config.selector === 'string') {
            config.elm = $(config.selector, self.element);
        }

        // Create element and `append to` config section if necessary
        if (empty(config.elm) && isset(config.html)
            && typeof config.html === 'string') {

            config.elm = this._createElementFromOptions(config);

            if (isset(config.appendTo)
                && typeof config.appendTo === 'string') {
                if (config.appendTo === 'this.element') {

                    config.elm =
                        this.element
                            .append(config.elm).find(config.selector);
                }
                else {
                    config.elm =
                        this._getElementFromOptions('ui.'
                                + config.appendTo)
                        .append(config.elm).find(config.selector);
                }

            }
        }

        // Return element
        return !empty(config.elm) ? config.elm : null;
    },

    /**
     * Create and Element from the options.ui hash and appends it to it's config.appendTo
     * section alias string.
     * @param config {Object} the options object from which to create and where to
     * populate the created element to.
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
        // @todo create explicit check for object
        if (config.html) {
            elm = $(config.html);
            if (config.attribs) {
                elm.attr(config.attribs);
            }
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
     * Gets a value from the options hash.  If that value is a function
     * calls the function and returns it's result unless raw is passed
     * in which case this function will return the function.
     * @param key {String}
     * @param args {Array} optional
     * @param raw {Boolean} optional
     * @returns {*}
     * 
     */
    getFromOptions: function (key, args, raw) {
        var retVal = null;
        if (typeof key === 'string') {
            retVal = this._namespace(key);
        }
        if (typeof retVal === 'function' && empty(raw)) {
            retVal = retVal.apply(this, args);
        }
        return retVal;
    },

    /**
     * Pulls a ui element from the options -> ui hash else uses
     * getElementFromOptions to create/fetch it.
     * @param {string} alias
     * @returns {*}
     * 
     */
    getUiElement: function (alias) {
        if (isset(this.ui[alias]) && this.ui[alias] instanceof $) {
            return this.ui[alias];
        }
        return this._getElementFromOptions('ui.' + alias);
    }

});