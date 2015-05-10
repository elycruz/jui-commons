/**
 * @class $.jui.juiSplitText
 * @requires jquery
 * @requires jquery.ui (jquery ui core)
 * @requires jquery.widget
 * @requires jquery.jui.juiBase
 * @description Jquery Plugin for toggling text between split text to spans -to- original text/html.
 * @triggers split-text:toggle
 * @triggers split-text:complete
 * @author ElyDeLaCruz
 * @created 2013/12
 */
    $.widget('jui.splitText', {

        /**
         * Options hash.
         * @type {object}
         */
        options:{

            /**
             * Used internally as a hash of possible states.
             * @type {object}
             */
            states: {
                unsplit: 'unsplit',
                split: 'split'
            },

            /**
             * Used internally to keep track of text state.
             * @type {string}
             */
            state: null,

            /**
             * The event's prefix name used when triggering event [complete,toggle]
             * @type {string}
             */
            eventsPrefix: 'split-text'
        },

        /**
         * Splits a string to a string of span elements.
         * @param str {string}
         * @returns {string}
         * @private
         */
        _splitStrToSpans: function (str) {
            var i = 0,
                output = '',
                val;

            while (i < str.length) {
                val = /\s/.test(str[i]) ? '&nbsp;' : str[i];
                output += '<span>' + val + '</span>';
                i += 1;
            }
            return output;
        },

        /**
         * Creates/Instantiates our plugin.
         * @return {void}
         * @private
         */
        _create:function () {
            var plugin = this,
                ops = plugin.options;

            // Set default state
            ops.state =
                ops.state || ops.states.unsplit;

            // Set original html/text
            ops.originalText = plugin.element.text()
                .replace(/\s{3,}/gim, '  ');

            // Split
            plugin.toggleSplitText();

            plugin.element.trigger(ops.eventsPrefix + ':complete');
        },

        /**
         * Toggles the elements split text state (between original text
         * and split text to spans text).
         * @param state {string} optional default null
         * @return void
         */
        toggleSplitText: function (state) {
            var plugin = this,
                ops = plugin.options;

                // Get state
                state = state || ops.state;

            // Toggle state
            if (state === ops.states.unsplit) {
                ops.state = ops.states.split;
                plugin.element.html(plugin._splitStrToSpans(ops.originalText));
            }
            else {
                ops.state = ops.states.unsplit;
                plugin.element.text(ops.originalText);
            }

            // Trigger toggle event
            this.element.trigger(ops.eventsPrefix + ':toggle',
                {states: ops.states, state: ops.state});
        },

        /**
         * Returns the original text of the element.
         * @returns {string}
         */
        getOriginalText: function () {
            return this.options.originalText;
        }

    });
    // End of plugin

