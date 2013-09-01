/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 12:49 AM
 * @description Base paginator class for pagination classes.  This plugin is meant to be extended not
 * used on it's own!
 * @triggers 'paginator:gotoPageNum', {pointer: Number}
 */

$.widget('jui.paginator', $.jui.juiBase, {
    options: {
        items: {
            elm: null,
            selector: '> .items > .item',
            firstInRange: 0,
            lastInRange: 0,
            perPage: 0
        },
        pages: {
            prev: 0,
            pointer: 0,
            next: 0,
            last: 0,
            length: 0,
            direction: 1
        },
        eventsPrefix: 'jui.paginator',
        onGotoPageNum: null,
        debug_output: '',
        debug: true
    },

    /**
     * Goes to page 1 which fires paginator:gotoPageNum event.
     * @type Function
     */
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
    },

    _gotoPageNum: function (num) {
        var ops = this.options;
        // Set prev and next
        ops.pages.prev = num - 1;

        ops.pages.next = num + 1;

        // Set pointer
        ops.pages.pointer = num;

        // Trigger
        this.element.trigger(ops.eventsPrefix + ':gotoPageNum', {pointer: num});

        // If callback is set
        if (ops.onGotoPageNum !== null && typeof ops.onGotoPageNum === 'function') {
            ops.onGotoPageNum.call(this, {pointer: num});
        }
    },

    _calculateNumbers: function () {
        var ops = this.options,
            items = this.getItems(),
            itemsPerPage;

        // If items per page is a function
        itemsPerPage = typeof ops.items.perPage === 'function' ?
            itemsPerPage = ops.items.perPage() : ops.itemsPerPage;

        // Pages length
        ops.pages.length = items.length / itemsPerPage;
        ops.pages.length = ops.pages.length !== NaN ? ops.pages.length : 0;
    },

    refresh: function () {
        this._calculateNumbers();
    },

    getItems: function () {
        this._getElementFromConfigSection('items');
    },
    getPointer: function () {
        return this.options.pages.pointer;
    }

});