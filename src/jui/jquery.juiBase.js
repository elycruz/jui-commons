/**
 * Static jui base fetch modes
 */
$.widget('jui.juiBaseFetchModes', {
	options: {
		createMode: 'create-mode',
		fetchMode: 'fetch-mode'
	}
});

/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 4:27 AM
 * To change this template use File | Settings | File Templates.
 */
$.widget('jui.juiBase', {
	/**
	 * Fetches an Element using a config hash section
	 * @param config Config section from the options hash
	 * @return mixed null || jquery
	 * @throws Error
	 */
//	_getInternalElement: function (config) {
//		var ops = this.options,
//			appendToSection,
//			elm = this.element;
//
//		// Element already exists
//		// Return Element
//		if (!empty(config.elm) && !empty(config.elm.length)) {
//			return config.elm;
//		}
//
//		// Selecte element
//		if (typeof config.selector === 'string' && config.fetch) {
//			config.elm = $(config.selector, elm);
//		}
//
//		// Create element
//		if (typeof config.html === 'string' && config.create) {
//			config.elm = $(config.html);
//			if (!empty(config.attribs)) {
//				config.elm.attr(config.attribs);
//			}
//			config.createdInternally = true;
//			if (config.appendToConfigSection) {
//				appendToSection = ops[config.appendToConfigSection] || null;
//				if (appendToSection.elm.length) {
//					appendToSection.elm.append(config.elm);
//				}
//				else {
//					throw new Error('Unable to append created element ' +
//						'in "saks.scrollbar->getInternalElement"');
//				}
//			}
//			else {
//				this.element.append(config.elm);
//			}
//		}
//		else if (config.elm !== null && !config.elm.length) {
//			throw new Error('Unable to fetch an element for config: ' +
//				config + 'in "saks.scrollbar->getInternalElement"');
//		}
//
//		// If we made it out of the jungle successfully
//		// Return the Element
//		return config.elm;
//	},


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
            config = config.apply(plugin);
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