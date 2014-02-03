/**
 * Created by edelacruz on 2/3/14.
 * @todo add destory and remove event listeners  methods/functions.
 */
$.widget('jui.juiScalableBtn', $.jui.juiBase, {

    options: {
        duration: 0.116
    },

    _create: function () {
    },

    _init: function () {
        if (!isset(this.options._eventListenersHaveBeenAdded)) {
            this._addEventListeners();
            this.options._eventListenersHaveBeenAdded = true;
        }
    },

    _addEventListeners: function () {
        var self = this,
            ops = self.options,
            elm = self.element,
            duration = ops.duration;

        elm.mouseover(function (e) {
            TweenLite.to(elm, duration, {scale: 1.16, ease: Linear.easeNone});
        })
            .mousedown(function (e) {
                TweenLite.to(elm, duration, {scale: 0.9, ease: Linear.easeNone});
            })
            .mouseup(function (e) {
                TweenLite.to(elm, duration, {scale: 1.16, ease: Linear.easeNone});
            })
            .mouseout(function (e) {
                TweenLite.to(elm, duration, {scale: 1, ease: Linear.easeNone});
            });
    }

});
