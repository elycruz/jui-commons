/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 8/31/13
 * Time: 9:04 PM
 * To change this template use File | Settings | File Templates.
 * @description Jquery Plugin for toggling text between split text to
 * spans -to- original text/html.
 * @author elydelacruz
 */

    /**
     * Jquery Plugin for making Ticking Text
     * @triggers tickint-text:complete
     */
    $.widget('jui.splitText', {
        options:{
            states: {
                unsplit: 'unsplit',
                split: 'split'
            },
            state: null,
            eventsPrefix: 'split-text'
        },
        _splitStrToSpans: function (str) {
            var i = 0,
                output = '',
                val;
            while (i < str.length) {
                val = str[i] === '' || /\s/.test(str[i]) ? '&nbsp;' : str[i];
                output += '<span>' + val + '</span>';
                i += 1;
            }
            return output;
        },
        _create:function () {
            var plugin = this,
                ops = plugin.options;

            // Set default state
            ops.state =
                ops.state || ops.states.unsplit;

            // Set original html/text
            ops.originalHtml = plugin.element.text();

            // Split
            plugin.toggleSplitText();

            // Create a span per char and append spans
            plugin.element.trigger(ops.eventsPrefix + ':complete');
        },
        toggleSplitText: function (state) {
            var plugin = this,
                ops = plugin.options;

                // Get state
                state = state || ops.state;

            // Toggle state
            if (state === ops.states.unsplit) {
                ops.state = ops.states.split;
                plugin.element.html(plugin._splitStrToSpans(ops.originalHtml));
            }
            else {
                ops.state = ops.states.unsplit;
                plugin.element.text(ops.originalHtml);
            }

            // Trigger toggle event
            this.element.trigger(ops.eventsPrefix + ':toggle',
                {states: ops.states, state: ops.state});
        },
        getOriginalHtml: function () {
            return this.options.originalHtml;
        }

    });
    // End of plugin

