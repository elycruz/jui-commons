/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 12:49 AM
 * @description Base paginator class for pagination classes.  This plugin is meant to be extended not
 * used on it's own!
 * @triggers widgetName + ':gotoPageNum'
 */

$.widget('jui.juiAbstractPaginator', $.jui.juiBase, {

    options: {

        pages: {
            prev: 0,
            pointer: 0,
            next: 0,
            last: 0,
            length: 0,
            direction: 1
        },

        onGotoPageNum: null
    },

    _create: function () {
        var self = this;
        self._gotoPageNum(self.options.pages.pointer);
    },

    _nextPage: function () {
        var self = this,
            ops = self.options;

        // Set direction to next
        ops.pages.pointerDirection = 1;

        if (ops.pages.pointer < ops.pages.length - 1) {
            ops.pages.pointer += 1;
        }
        else {
            ops.pages.pointer = 0;
        }

        // Goto Page src number
        self._gotoPageNum(ops.pages.pointer);

        // Trigger event
        self.element.trigger(self.widgetName + ':nextPage',
            {pointer: ops.pages.pointer});
        
        return self;
    },

    _prevPage: function () {
        var self = this,
            ops = self.options;
        if (ops.pages.pointer > 0) {
            ops.pages.pointer -= 1;
        }
        else {
            ops.pages.pointer = ops.pages.length - 1;
        }

        // Set direction to previous
        ops.pages.pointerDirection = -1;

        // Goto Page src number
        self._gotoPageNum(ops.pages.pointer);

        // Trigger event
        self.element.trigger(self.widgetName + ':prevPage',
            {pointer: ops.pages.pointer});

        return self;
    },

    _gotoPageNum: function (num) {
        var self = this,
            ops = self.options;
        // Set prev and next
        ops.pages.prev = num - 1;

        ops.pages.next = num + 1;

        // Ensure less than pages length
        if (num > ops.pages.length - 1) {
            num = ops.pages.length - 1;
        }

        // Ensure positive number
        if (num < 0) {
            num = 0;
        }

        // Set pointer
        ops.pages.pointer = num;

        // If callback is set call it
        self.getValueFromOptions('onGotoPageNum');

        // Trigger gotoPageNum
        self.element.trigger(self.widgetName + ':gotoPageNum',
            {pointer: num});

        return self;
    },

    getPointer: function () {
        return this.options.pages.pointer;
    }
});
