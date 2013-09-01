/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 1:15 AM
 * To change this template use File | Settings | File Templates.
 */
$.widget('edlc.paginatorWithTextField', $.edlc.paginator, {
    options: {
        pages: {
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
        }
    },
    _create: function () {
        // Determine number of pages
        this._super();
    },
    firstPage: function () {
        this._gotoPageNum(0);
        console.log('Page: ' + this.options.pages.pointer);
    },
    prevPage: function () {
        this._prevPage();
        console.log('Page: ' + this.options.pages.pointer);
    },
    nextPage: function () {
        this._nextPage();
        console.log('Page: ' + this.options.pages.pointer);
    },
    lastPage: function () {
        this._gotoPageNum(this.options.pages.length - 1);
        console.log('Page: ' + this.options.pages.pointer);
    }

});