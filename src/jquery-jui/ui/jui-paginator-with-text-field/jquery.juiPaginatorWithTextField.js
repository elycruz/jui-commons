/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 1:15 AM
 * To change this template use File | Settings | File Templates.
 */
$.widget('jui.paginatorWithTextField', $.jui.paginator, {
    options: {
        pages: {
            selector: null,
            length: 100
        },
        items: {
            elm: null,
            selector: '> .items > .item',
            perPage: 1
        },
        firstBtn: {
            elm: null,
            selector: '> .controls > .first-btn',
            enabled: true,
            html: ''
        },
        prevBtn: {
            elm: null,
            selector: '> .controls > .prev-btn',
            enabled: true,
            html: ''
        },
        textField: {
            elm: null,
            selector: '> .controls > .text-field',
            enabled: true,
            html: ''
        },
        nextBtn: {
            elm: null,
            selector: '> .controls > .next-btn',
            enabled: true,
            html: ''
        },
        lastBtn: {
            elm: null,
            selector: '> .controls > .last-btn',
            enabled: true,
            html: ''
        },
        eventsPrefix: 'jui.paginatorWithTextField'
    },
    _create: function () {
        // Determine number of pages
        this._super();
    },

    // Actions
    firstPage: function () {
        this._gotoPageNum(0);
        console.log('Page: ' + this.getPointer());
    },
    prevPage: function () {
        this._prevPage();
        console.log('Page: ' + this.getPointer());
    },
    nextPage: function () {
        this._nextPage();
        console.log('Page: ' + this.getPointer());
    },
    lastPage: function () {
        this._gotoPageNum(this.options.pages.length - 1);
        console.log('Page: ' + this.getPointer());
    },

    // ========================================================
    // Getters and Setters
    // ========================================================
    getFirstBtn: function () {
        return this._getElementFromOptions('firstBtn');
    },
    getPrevBtn: function () {
        return this._getElementFromOptions('prevBtn');
    },
    getNextBtn: function () {
        return this._getElementFromOptions('nextBtn');
    },
    getLastBtn: function () {
        return this._getElementFromOptions('lastBtn');
    },
    getTextField: function () {
        return this._getElementFromOptions('textField');
    }

});