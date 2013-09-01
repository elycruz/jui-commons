/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 8/31/13
 * Time: 8:26 PM
 * @description Ticking Text Jquery Plugin.
 * @author elydelacruz
 */
(function () {

    /**
     * Generates a random Char Code
     * @param min
     * @param max
     * @return {Number}
     */
    function randomChar(min, max) {
        min = min || 40;
        max = max || 98;
        return Math.random() * (max - min) + min;
    }

    /**
     * Jquery Plugin for making Ticking Text
     * @triggers tickint-text:complete
     */
    $.widget('edlc.tickingText', $.edlc.splitText, {

        options:{
            minCharCode:40,
            maxCharCode:98,
            charChangeSpeed:20,
            delayPerChar:100,
            charChangeReps:20,
            fadeInSpeed: 1000,

            intervals:[],

            // Optional
            originalHtml: '',
            revertTextOnCompletion: true,
            revertTextInterval: 0,
            clearedIntervalsCount: 0
        },

        _create:function () {
            var plugin = this,
                i = 0, spans = '';

            // Hide this element
            plugin.element.css('visibility', 'hidden');

            // Call split text
            plugin._super();

            // Delay intervals
            var delayIntervals = [],
                timeoutSpeed = 0;

            // Revert Text Interval
            if (plugin.options.revertTextOnCompletion) {
                plugin.options.revertTextInterval = setInterval(function () {
                    if (plugin.options.clearedIntervalsCount > 0 &&
                        plugin.options.clearedIntervalsCount >= plugin.options.intervals.length) {
                        plugin.toggleSplitText();
                        clearInterval(plugin.options.revertTextInterval);
                        plugin.element.trigger('ticking-text:complete');
                    }
                });
            }
            // Animate text
            $('span', plugin.element).each(function (i) {
                var span = $(this);

                // Hide span
                span.fadeOut(0);

                // Delay spans animation
                (function () {
                    var interval = delayIntervals.length;
                    delayIntervals.push(setTimeout(function () {
                        plugin.animateSpansText(span, i);
                        clearTimeout(delayIntervals[interval]);
                    }, timeoutSpeed));
                })();

                // Increase timeout speed
                timeoutSpeed += plugin.options.delayPerChar;
            });

            // Show this element
            plugin.element.css('visibility', 'visible');
        },
        animateSpansText:function (span, index) {
            var plugin = this,
                intervals = plugin.options.intervals,
                intervalIndex = intervals.length,
                storedStr = span.text(),
                str = storedStr + '',
                i = 0;

            // Make Span Visible
            span.fadeTo(plugin.options.fadeInSpeed, 1);

            // Begin interval
            intervals.push(setInterval(function () {
                if (i === plugin.options.charChangeReps) {
                    span.text(storedStr);
                    clearInterval(intervals[intervalIndex]);

                    // Trigger complete event
                    if (intervalIndex === intervals.length - 1) {
                        plugin.element.trigger('ticking-text:complete');
                    }

                    plugin.options.clearedIntervalsCount += 1;
                    delete intervalIndex;
                    delete storedStr;
                    delete str;
                    delete i;
                    return;
                }

                // Generate and Set random character
                span.text(String.fromCharCode(
                    randomChar(plugin.options.minCharCode,
                        plugin.options.maxCharCode)));

                // Increment count
                i += 1;
            }, plugin.options.charChangeSpeed));
        }
    });
    // End of plugin

})();
// End of Dog Balls
