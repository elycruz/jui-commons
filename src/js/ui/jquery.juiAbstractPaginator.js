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
        ui: {
            itemsContainer: {
                selector: '> .items'
            },
            items: {
                elm: null,
                selector: '> .items > .item',
                firstInRange: 0,
                lastInRange: 0,
                perPage: 0
            }
        },
        pages: {
            prev: 0,
            pointer: 0,
            next: 0,
            last: 0,
            length: 0,
            direction: 1
        },
        onGotoPageNum: null,
        skipPagesCalculation: false,
        debug_output: '',
        debug: true
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
        if (ops.onGotoPageNum !== null
            && typeof ops.onGotoPageNum === 'function') {
            ops.onGotoPageNum.apply(this);
        }

        // Trigger gotoPageNum
        this.element.trigger(this.widgetName + ':gotoPageNum',
            {pointer: num});
    },

    _calculateNumberOfPages: function (options) {
        var ops = options || this.options,
            items = this.getItems(),
            itemsPerPage;

        // If items per page is a function
        itemsPerPage = this.getValueFromHash('ui.items.perPage', ops);

        // Pages length
        ops.pages.length = Math.ceil(items.length / itemsPerPage);
        ops.pages.length = ops.pages.length !== NaN ? ops.pages.length : 0;

        // Trigger event
        this.element.trigger(this.widgetName + ':numbersCalculated',
            {pointer: ops.pages.pointer});
    },

    getItems: function () {
        return this.getUiElement('items');
    },

    getItemsContainer: function () {
        return this.getUiElement('itemsContainer');
    },

    getPointer: function () {
        return this.options.pages.pointer;
    }
});