/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 12:49 AM
 * @description Base paginator class for pagination classes.  This plugin is meant to be extended not
 * used on it's own!
 * @triggers 'paginator:gotoPageNum', {pointer: Number}
 */

$.widget('jui.juiBasicPaginator', $.jui.juiAbstractPaginator, {
    options: {
        template: null,
        className: 'jui-basic-paginator',
        ui: {
            firstBtn: {
                selector: '> .first-btn.btn',
                attribs: {
                    'class': 'first-btn btn',
                    'href': '#'
                },
                appendTo: 'this.element',
                enabled: true,
                html: '<a>&#124;&lt; First</a>',
                create: true
            },
            prevBtn: {
                selector: '> .prev-btn.btn',
                attribs: {
                    'class': 'prev-btn btn',
                    'href': '#'
                },
                appendTo: 'this.element',
                enabled: true,
                html: '<a>&lt;&lt; Prev</a>',
                create: true
            },
            nextBtn: {
                selector: '> .next-btn.btn',
                attribs: {
                    'class': 'next-btn btn',
                    'href': '#'
                },
                appendTo: 'this.element',
                enabled: true,
                html: '<a>Next &gt;&gt;</a>',
                create: true
            },
            lastBtn: {
                selector: '> .last-btn.btn',
                attribs: {
                    'class': 'last-btn btn',
                    'href': '#'
                },
                appendTo: 'this.element',
                enabled: true,
                html: '<a>Last &gt;&#124;</a>',
                create: true
            },
            itemsContainer: {
                selector: '> .content-pane > .items'
            },
            items: {
                selector: '> .content-pane > .items > .item',
                firstInRange: 0,
                lastInRange: 0,
                perPage: 0
            }
        },

        skipPagesCalculation: false
    },

    _create: function () {
        var self = this,
            ops = self.options;

        // Add class name
        if (typeof ops.className === 'string' && ops.className.length > 0) {
            self.element.addClass(ops.className);
        }

        // Append template if any
        if (typeof ops.template === 'string' && ops.template.length > 0) {
            self.element.append(ops.template);
        }

        self._autoPopulateUiElements(self, self.element, ops);
        self._addEventListeners();
        if (sjl.empty(ops.skipPagesCalculation)) {
            self._calculateNumberOfPages(ops);
        }
        self._super();
    },

    _addEventListeners: function () {
        var self = this,
            firstBtn = self.getFirstBtnElm(),
            nextBtn = self.getNextBtnElm(),
            prevBtn = self.getPrevBtnElm(),
            lastBtn = self.getLastBtnElm();

        // First Page Button
        if (sjl.isset(firstBtn) && firstBtn.length > 0) {
            firstBtn.on('click', function (e) {
                e.preventDefault();
                self.firstPage();
            });
        }

        // Previous Page button
        if (sjl.isset(prevBtn) && prevBtn.length > 0) {
            prevBtn.on('click', function (e) {
                e.preventDefault();
                self.prevPage();
            });
        }

        // Next Page button
        if (sjl.isset(nextBtn) && nextBtn.length > 0) {
            nextBtn.on('click', function (e) {
                e.preventDefault();
                self.nextPage();
            });
        }

        // Last Page button
        if (sjl.isset(lastBtn) && lastBtn.length > 0) {
            lastBtn.on('click', function (e) {
                e.preventDefault();
                self.lastPage();
            });
        }
    },

    _calculateNumberOfPages: function (options) {
        var ops = options || this.options,
            items = this.getItemsElm(),
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

    // Actions
    firstPage: function () {
        this._gotoPageNum(0);
        this.element.trigger(this.widgetName + ':firstPage');
    },
    prevPage: function () {
        this._prevPage();
        this.element.trigger(this.widgetName + ':prevPage',
            this.options.pages);
    },
    nextPage: function () {
        this._nextPage();
        this.element.trigger(this.widgetName + ':nextPage',
            this.options.pages);
    },
    lastPage: function () {
        this._gotoPageNum(this.options.pages.length - 1);
        this.element.trigger(this.widgetName + ':lastPage');
    },

    // Getters
    getFirstBtnElm: function () {
        return this.getUiElement('firstBtn');
    },
    getPrevBtnElm: function () {
        return this.getUiElement('prevBtn');
    },
    getNextBtnElm: function () {
        return this.getUiElement('nextBtn');
    },
    getLastBtnElm: function () {
        return this.getUiElement('lastBtn');
    },
    getItemsElm: function () {
        return this.getUiElement('items');
    }

});