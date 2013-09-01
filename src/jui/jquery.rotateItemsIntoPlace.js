/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 5:50 AM
 * To change this template use File | Settings | File Templates.
 */
$.widget('jui.rotateItemsIntoPlace', $.jui.juiBase, {
    options: {
        animation: {
            duration: 0.16,
            from: {
                rotation: -120,
                opacity: 0,
                left: -20
            }
        },
        timeline: {
            timeline: null,
            options: {
                // Timeline options
                // @see
            }
        },
        items: {
            elm: null,
            selector: '> .items > .item'
        }
    },
    _create: function () {
        var plugin = this,
            ops = plugin.options,
        items = plugin.getItems(),
            timeline = plugin.getTimeline();

        // If no items do nothing
        if (empty(items.length)) {
            return;
        }

        // Apply animation to items
        items.each(function (i) {
            var item = $(this);
            for (prop in ops.animation) {
                if (prop === 'from' || prop === 'to') {
                    timeline[prop](item, ops.animation.duration, ops.animation[prop]);
                }
            }
        });

    },
    getItems: function () {
        return this._getElementFromConfigSection('items');
    },
    getTimeline: function () {
        var ops = this.options;
        if (empty(ops.timeline.timeline)) {
            ops.timeline.timeline = new TimelineLite(ops.timeline.options);
        }
        return ops.timeline.timeline;
    }
});