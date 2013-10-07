/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 4:19 AM
 * To change this template use File | Settings | File Templates.
 */
$.widget('jui.accordianSlideShow', $.jui.paginatorWithTextField, {
    options: {
        nextBtn: {
            selector: '.next-btn'
        },
        prevBtn: {
            selector: '.prev-btn'
        },
        itemsSpacer: {
            tagName: 'div',
            className: 'spacer',
            selector: '.spacer'
        },
        itemsContainerContainer: {
            elm: null,
            selector: '> .items-container'
        },
        itemsContainer: {
            elm: null,
            selector: '> .items-container > .items'
        },
        items: {
            pointer: 0,
            numPaddingItems: null,
            delayIntervals: [],
            selector: '.items-container > .items > .item',
            item: {
                isSelected: false,
                normalWidth: 64,
                normalHeight: null,
                selectedWidth: 964,
                selectedHeight: null
            },
            perPage: function () {
                return Math.ceil(this.element.width()
                    /  this.options.items.item.normalWidth);
            }
        },
        eventsPrefix: 'jui.accordianSlideShow'
    },

    nextItem: function () {
        this._nextItem();
        this._gotoItemAtItemPointer();
    },

    prevItem: function () {
        this._prevItem();
        this._gotoItemAtItemPointer();
    },

    gotoItemAtIndex: function (num) {
        this._gotoItemAtItemPointer(num);
    },

    _nextItem: function () {
        var ops = this.options;

        // Set direction to next
        ops.items.pointer_direction = 1;

        if (ops.items.pointer < ops.items.length - 1) {
            ops.items.pointer += 1;
        }
        else {
            ops.items.pointer = 0;
        }

    },

    _prevItem: function () {
        var ops = this.options;
        if (ops.items.pointer > 0) {
            ops.items.pointer -= 1;
        }
        else {
            ops.items.pointer = ops.items.length - 1;
        }

        // Set direction to previous
        ops.items.pointer_direction = -1;
    },

    _gotoItemAtItemPointer: function (index) {
        var ops = this.options,
            item;

        // Set pointer if necessary
        if (isset(index) && /\d+/.test(index)) {
            ops.items.pointer = +index;
        }

        // Get item to selected
        item = this.getItems().eq(ops.items.pointer);

        // Set prev and next
        ops.items.prev = ops.items.pointer - 1;
        ops.items.next = ops.items.pointer + 1;

        // Set selected item flag
        ops.items.item.isSelected = true;

        // Deselected selected items, except passed in index
        this._deselectSelectedItems(ops.items.pointer);

        // Select item
        this._selectItem(item);

        // Scroll to selected item
        this._delayedScrollToSelectedItem(item, 380);
    },

    _create: function () {
        var plugin = this, ops = plugin.options,
            items = plugin.getItems();

        // Super
        plugin._super();

        // Add padding at beginning and end
        plugin._addEmptyItems();

        // Calculate number of pages
        plugin._reCalculateNumberOfItems();

        // Recalculate number of pages
        plugin._reCalculateNumberOfPages();

        // Add event listeners
        plugin._addEventListeners();

        // Scroll to pointer position
        plugin._scrollToPointerPosition();

    },

    _addEventListeners: function () {
        var plugin = this,
            ops = plugin.options,
            scrollableContainer = plugin._getItemsContainerContainer(),
            items = plugin.getItems(),
            regularItemWidth = plugin._getItemsItemWidth(),
            expandedItemWidth = plugin._getItemsSelectedItemWidth();

        // Item Click
        items.bind('click', function (e) {
            plugin.gotoItemAtIndex(Number($(this).attr('data-index')));
        });

        // Size Items Container to num items
        $(window).on('debouncedresize', function () {
            plugin._reCalculateNumberOfPages();
            plugin._addEmptyItems();
        });

        // Prev and Next Btns
        plugin.getNextBtn().bind('click', function (e) {
            if (ops.items.item.isSelected) {
                plugin.nextItem();
            }
            else {
                plugin.nextPage();
                plugin._scrollToPointerPosition();
            }
        });

        plugin.getPrevBtn().bind('click', function (e) {
            if (ops.items.item.isSelected) {
                plugin.prevItem();
            }
            else {
                plugin.prevPage();
                plugin._scrollToPointerPosition();
            }
        });
    },

    _removeEventListeners: function () { },

    _getItemsItemWidth: function () {
        return this._getItemsItemDimProp('width', 'normal');
    },

    _getItemsItemHeight: function () {
        return this._getItemsItemDimProp('height', 'normal');
    },

    _getItemsSelectedItemWidth: function () {
        return this._getItemsItemDimProp('width', 'selected', '.selected');
    },

    _getItemsSelectedItemHeight: function () {
        return this._getItemsItemDimProp('height', 'selected', '.selected');
    },

    _getItemsItemDimProp: function (dimPropName, dimPropPrefix, itemStateClass) {

        // If empty bail
        if (empty(dimPropName)) {
            return null;
        }

        var ops = this.options, item,
            items = this.getItems(),
            key = dimPropPrefix + ucaseFirst(dimPropName),
            value = ops.items.item[key];

        // Get prop key value
        if (!isset(value)) {
            item = itemStateClass ? $('> ' + itemStateClass, items).eq(0) : items.eq(0);
            value = this.options.items.item[key] = item[dimPropName]() + 6;
        }

        return value;
    },

    _addEmptyItems: function () {
        var plugin = this,
            ops = plugin.options,
            items = plugin.getItems(),
            i, itemsPadding = '',
            itemsContainer = plugin.getItemsContainer(),
            itemWidth = plugin._getItemsItemWidth(),
            itemsPerPage = plugin._getItemsPerPage();

        // Set num padding items
        ops.items.numPaddingItems = itemsPerPage;

        // Make some padding
        for (i = 0; i < ops.items.numPaddingItems; i += 1) {
            itemsPadding += '<' + ops.itemsSpacer.tagName + ' class="'
                + ops.itemsSpacer.className
                + '">&nbsp;' + (i + 1)
                + '</' + ops.itemsSpacer.tagName + '>';
        }

        // Resize items container
        this._sizeItemsContainerToItems((items.length * 2)
            * plugin._getItemsItemWidth() + plugin._getItemsSelectedItemWidth());

        // Remove older spacers and add new ones
        // Fade items out;  Add spacers;
        // Scroll to selected item if necessary; Fade items in
        TweenLite.to(items, 0.16, {css: {opacity: 0}, onComplete: function () {
            // Remove any current spacers
            $(ops.itemsSpacer.selector, itemsContainer).remove();

            // Add padding to the container
            itemsContainer.prepend(itemsPadding);
            itemsContainer.append(itemsPadding);

            // If selected Item scroll to it
            if (ops.items.item.isSelected) {
                plugin._scrollToSelectedItem();
            }

            // Fade element(s) back in
            TweenLite.to(items, 0.16, {css: {opacity: 1}});
        }});
    },

    _sizeItemsContainerToItems: function (width, height) {
        width = width || this.getItems().length
            * this._getItemsItemWidth();
        this.getItemsContainer().width(width);
        if (height) {
            this.getItemsContainer().height(height);
        }
    },

    _scrollToPointerPosition: function () {
        var plugin = this,
            item = plugin._getSelectedItem(),
            pointer = plugin.getPointer() + 1,
            scrollableContainer = plugin._getItemsContainerContainer(),
            scrollTo = pointer * plugin._getScrollAmountPerPage();
        TweenMax.to(scrollableContainer, 0.38, {scrollLeft: scrollTo, ease: Power3.easeOut});
    },

    _scrollToSelectedItem: function (selectedItem) {
        selectedItem = selectedItem || this._getSelectedItem();
        var plugin = this,
            ops = plugin.options,
            expandedItemWidth = plugin._getItemsSelectedItemWidth(),
            regularItemWidth = plugin._getItemsItemWidth(),
            scrollableContainer = plugin._getItemsContainerContainer(),
            item = selectedItem,
            leftOffset = (plugin.element.width() - expandedItemWidth + regularItemWidth);

        // Clear delay intervals
        plugin._clearItemDelayIntervals();

        leftOffset = /^\d/.test(leftOffset) ? leftOffset / 2 : 0;
        TweenMax.to(scrollableContainer, 0.38, {
            scrollLeft: item[0].offsetLeft - leftOffset,
            ease: Power3.easeOut});
    },

    _reCalculateNumberOfPages: function () {
        this.options.pages.length = Math.ceil(this.getItems().length /
            this._getItemsPerPage());
    },

    _reCalculateNumberOfItems: function () {
        this.options.items.length = this.getItems().length;
    },

    _getItemsContainerContainer: function () {
        return this._getElementFromOptions('itemsContainerContainer');
    },

    _getItemsPerPage: function () {
        var ops = this.options,
            retVal = isset(ops.items.perPage) ? ops.items.perPage : 1;
        if (typeof ops.items.perPage === 'function') {
            retVal = ops.items.perPage.apply(this);
        }
        return Math.floor(retVal);
    },

    _getSelectedItem: function () {
        return $(this.options.items.selector + '.selected');
    },

    _selectItem: function (item) {
        if (!item.hasClass('selected')) {
            item.addClass('selected');
        }
    },

    _deselectSelectedItems: function (exceptIndex) {
        if (exceptIndex) {
            $(this.options.items.selector
                + '[data-index!="' + exceptIndex + '"]',
                this.element).removeClass('selected');
        }
        else {
            this.getItems().removeClass('selected');
        }
    },

    _getScrollAmountPerPage: function () {
        var ops = this.options,
            normalPageWidth = this._getItemsPerPage()
                * this._getItemsItemWidth(),
            itemPadding = ops.items.numPaddingItems;

//        return ops.items.isItemSelected ?
//            (itemPadding / 2) + normalPageWidth
//                - this._getItemsSelectedItemWidth() :  normalPageWidth;
        return normalPageWidth;
    },

    _clearItemDelayIntervals: function () {
        this.options.items.delayIntervals.forEach(function (x, i, a) {
            clearTimeout(x);
            a.splice(i, 1);
        });
    },

    _delayedScrollToSelectedItem: function (item, delay) {
        var plugin = this;
        plugin.options.items.delayIntervals.push(setTimeout(function () {
            plugin._scrollToSelectedItem(item);
        }, delay));

    },

    destroy: function () { }

});
