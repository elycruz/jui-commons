/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 4:27 AM
 * @module jui.juiBase
 * @desc JUI Plugins Base.
 * @extends $.Widget
 * @requires $
 * @requires $.ui
 * @requires $.widget
 */
$.widget('jui.juiBase', {

    /**
     * Options hash
     * @type Object
     */
    options: {
        ui: {}
    },

    /**
     * Takes a namespace string and fetches that location out from an object.
     * If the namespace doesn't exists it is created then returned.
     * Example: _namespace('hello.world.how.are.you.doing') will create/fetch:
     * hello: { world: { how: { are: { you: { doing: {} } } } } }
     * @param ns_string the namespace you wish to fetch
     * @param extendObj Object Optional default this.options
     * @returns {*|Object}
     * @private
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
     * Populates config | options.ui with element collections.
     * @param config Object
     * @private
     * @return jui.juiBase
     */
    _fetchUiElements: function (config) {
        var self = this;
        config = config || this.ui;
        Object.keys(config).forEach(function (key) {
            var val = config[key];
            config[key] = $(config[key], self.element);
        });
    },

    /**
     *
     * @param configSection
     * @returns {*}
     * @private
     */
    _getElementFromConfigSection:function (configSection) {
        var self = this,
            ops = self.options,
            config = configSection;

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
        if (!empty(config.elm) && config.elm instanceof $ && config.elm.length > 0) {
            return config.elm;
        }

        // If Selector
        if (!empty(config.selector) && typeof config.selector === 'string') {
            config.elm = $(config.selector, self.element);
        }

        // @todo include creation option here

        // Return element
        return !empty(config.elm) ? config.elm : null;
    }
});