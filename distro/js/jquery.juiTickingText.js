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
    $.widget('jui.tickingText', $.jui.splitText, {

        options: {
            minCharCode: 40,
            maxCharCode: 98,
            charChangeSpeed: 20,
            delayPerChar: 100,
            charChangeReps: 20,
            fadeInSpeed: 1000,

            intervals: [],

            // Optional
            originalHtml: '',
            revertTextOnCompletion: true,
            revertTextInterval: 0,
            clearedIntervalsCount: 0
        },

        _create: function () {
            var self = this;

            // Hide this element
            self.element.css('visibility', 'hidden');

            // Call split text
            self._super();

            // Delay intervals
            var delayIntervals = [],
                timeoutSpeed = 0;

            // Revert Text Interval
            if (self.options.revertTextOnCompletion) {
                self.options.revertTextInterval = setInterval(function () {
                    if (self.options.clearedIntervalsCount > 0 &&
                        self.options.clearedIntervalsCount >= self.options.intervals.length) {
                        self.toggleSplitText();
                        clearInterval(self.options.revertTextInterval);
                        self.element.trigger('ticking-text:complete');
                    }
                });
            }
            // Animate text
            $('span', self.element).each(function () {
                var span = $(this);

                // Hide span
                span.fadeOut(0);

                // Delay spans animation
                (function () {
                    var interval = delayIntervals.length;
                    delayIntervals.push(setTimeout(function () {
                        self.animateSpansText(span);
                        clearTimeout(delayIntervals[interval]);
                    }, timeoutSpeed));
                }());

                // Increase timeout speed
                timeoutSpeed += self.options.delayPerChar;
            });

            // Show this element
            self.element.css('visibility', 'visible');
        },

        animateSpansText: function (span) {
            var self = this,
                intervals = self.options.intervals,
                intervalIndex = intervals.length,
                storedStr = span.text(),
                str = storedStr + '',
                i = 0;

            // Make Span Visible
            span.fadeTo(self.options.fadeInSpeed, 1);

            // Begin interval
            intervals.push(setInterval(function () {
                if (i === self.options.charChangeReps) {
                    span.text(storedStr);
                    clearInterval(intervals[intervalIndex]);

                    // Trigger complete event
                    if (intervalIndex === intervals.length - 1) {
                        self.element.trigger('ticking-text:complete');
                    }

                    self.options.clearedIntervalsCount += 1;
                    delete intervalIndex;
                    delete storedStr;
                    delete str;
                    delete i;
                    return;
                }

                // Generate and Set random character
                span.text(String.fromCharCode(
                    randomChar(self.options.minCharCode,
                        self.options.maxCharCode)));

                // Increment count
                i += 1;
            }, self.options.charChangeSpeed));
        }
    });
    // End of plugin

}());
