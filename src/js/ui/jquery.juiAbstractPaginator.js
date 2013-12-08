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
        this._gotoPageNum(this.options.pages.pointer);
    },

    _nextPage: function () {
        var ops = this.options;

        // Set direction to next
        ops.pages.pointer_direction = 1;

        if (ops.pages.pointer < ops.pages.length - 1) {
            ops.pages.pointer += 1;
        }
        else {
            ops.pages.pointer = 0;
        }

        // Goto Page src number
        this._gotoPageNum(ops.pages.pointer);

        // Trigger event
        this.element.trigger(this.widgetName + ':nextPage',
            {pointer: ops.pages.pointer});
    },

    _prevPage: function () {
        var ops = this.options;
        if (ops.pages.pointer > 0) {
            ops.pages.pointer -= 1;
        }
        else {
            ops.pages.pointer = ops.pages.length - 1;
        }

        // Set direction to previous
        ops.pages.pointer_direction = -1;

        // Goto Page src number
        this._gotoPageNum(ops.pages.pointer);

        // Trigger event
        this.element.trigger(this.widgetName + ':prevPage',
            {pointer: ops.pages.pointer});
    },

    _gotoPageNum: function (num) {
        var ops = this.options;
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
        this.getValueFromOptions('onGotoPageNum');

        // Trigger gotoPageNum
        this.element.trigger(this.widgetName + ':gotoPageNum',
            {pointer: num});
    },

    getPointer: function () {
        return this.options.pages.pointer;
    }
});