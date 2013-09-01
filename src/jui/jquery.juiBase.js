/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 4:27 AM
 * To change this template use File | Settings | File Templates.
 */
$.widget('jui.juiBase', {
    _getElementFromConfigSection:function (configSection) {
        var plugin = this,
            ops = plugin.options,
            config = configSection;

        // If config is a string
        if (typeof config === 'string') {
            config = ops[config];
        }

        // If config is a function
        if (typeof config === 'function') {
            config = config();
        }

        // If config is empty return
        if (empty(config)) {
            return null;
        }

        // If element is a jquery element
        if (!empty(config.elm) && config.elm instanceof $ && config.elm.length > 0) {
            return config.elm;
        }

        // If Selector
        if (!empty(config.selector) && typeof config.selector === 'string') {
            config.elm = $(config.selector, plugin.element);
        }

        // @todo include creation option here

        // Return element
        return !empty(config.elm) ? config.elm : null;
    }
});