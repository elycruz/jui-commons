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
                elm: null,
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
                elm: null,
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
                elm: null,
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
                elm: null,
                selector: '> .last-btn.btn',
                attribs: {
                    'class': 'last-btn btn',
                    'href': '#'
                },
                appendTo: 'this.element',
                enabled: true,
                html: '<a>Last &gt;&#124;</a>',
                create: true
            }
        }
    },

    /**
     * Goes to page 1 which fires jquery-jui-paginator:gotoPageNum event.
     * @type Function
     */
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

        self._populateUiElementsFromOptions(ops);
        self._addEventListeners();
        if (empty(ops.skipPagesCalculation)) {
            self._calculateNumberOfPages(ops);
        }
        self._super();
    },

    _addEventListeners: function () {
        var self = this;

        // First Page Button
        self.getFirstBtnElm().on('click', function (e) {
            e.preventDefault();
            self.firstPage();
        });

        // Next Page button
        self.getNextBtnElm().on('click', function (e) {
            e.preventDefault();
            self.nextPage();
        });

        // Previous Page button
        self.getPrevBtnElm().on('click', function (e) {
            e.preventDefault();
            self.prevPage();
        });

        // Last Page button
        self.getLastBtnElm().on('click', function (e) {
            e.preventDefault();
            self.lastPage();
        });
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
    }

});