/**
 * Created by edelacruz on 2/3/14.
 * @todo add destory and remove event listeners  methods/functions.
 */
$.widget('jui.juiScalableBtn', $.jui.juiBase, {

    options: {
        duration: null,

        defaultDurationsVal: 0.116,

        onHoverOptions: {
            duration: null,
            props: {scale: 1.16, ease: Linear.easeNone}
        },

        onMousedownOptions: {
            duration: null,
            props: {scale: 0.9, ease: Linear.easeNone}
        },

        onMouseupOptions: {
            duration: null,
            props: {scale: 1.16, ease: Linear.easeNone}
        },

        onMouseoutOptions: {
            duration: null,
            props: {scale: 1, ease: Linear.easeNone}
        }
    },

    _create: function () {
    },

    _init: function () {
        if (!sjl.isset(this.options._eventListenersHaveBeenAdded)) {
            this._addEventListeners();
            this.options._eventListenersHaveBeenAdded = true;
        }
    },

    _addEventListeners: function () {
        var self = this,
            ops = self.options,
            elm = self.element,
            defaultDuration = self._getOverridingDuration() || ops.defaultDurationsVal,
            hoverOps = ops.onHoverOptions,
            mousedownOps = ops.onMousedownOptions,
            mouseupOps = ops.onMouseupOptions,
            mouseoutOps = ops.onMouseoutOptions
            ;

        elm.bind('mouseover', function () {
            TweenLite.to(elm, hoverOps.duration || defaultDuration, hoverOps.props);
        })
            .bind('mousedown', function () {
                TweenLite.to(elm, mousedownOps.duration || defaultDuration, mousedownOps.props);
            })
            .bind('mouseup', function () {
                TweenLite.to(elm,  mouseupOps.duration || defaultDuration, mouseupOps.props);
            })
            .bind('mouseout', function () {
                TweenLite.to(elm, mouseoutOps.duration || defaultDuration, mouseoutOps.props);
            });
    },

    _getOverridingDuration: function () {
        var ops = this.options,
            retVal = null;
        if (!sjl.isset(ops.duration)) {
            retVal = ops.duration;
        }
        else {
            retVal = ops.defaultDurationsVal;
        }
        return retVal;
    },

    _removeEventListeners: function () {
        this.element.unbind();
    },

    _destroy: function () {
        this._removeEventListeners();
    }

});
