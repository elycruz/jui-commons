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
            item: {
                isSelected: false,
                normalWidth: 64,
                normalHeight: null,
                selectedWidth: 960,
                selectedHeight: null
            },
            animation: {
                from: function (item, i) {
                    var width = 6 + item.width();
                    return {
                        duration: 0.0538,
                        options: {
                            opacity: 0,
//                            rotationX: 45 * (i % 2 ? -1 : 1),
                            left: width
                        },
                        easing: null
                    };
                }
            },
            perPage: function () {
                return Math.ceil(this.element.width()
                    / this.getItems()
                    .not('.selected, .spacer').eq(0).width());
            }
        }
    },

    nextItem: function () {

    },

    prevItem: function () {

    },

    scrollToItemPointer: function () {

    },

    _create: function () {
        var plugin = this, ops = plugin.options,
            items = plugin.getItems();

        // Super
        plugin._super();

        // Animate items
        $.jui.animateItemsWithGsap.apply(this);

        // Add padding at beginning and end
        plugin._addEmptyItems();

        // Add event listeners
        plugin._addEventListeners();
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
            var item = $(this);
            ops.items.pointer = Number(item.attr('data-index'));
            scrollableContainer.animate({
                scrollLeft: item[0].offsetLeft - regularItemWidth}, 300);
        });

        // Size Items Container to num items
//        plugin._sizeItemsContainerToItems();

        // Prev and Next Btns
        plugin.getNextBtn().bind('click', function (e) {
//            if (ops.items.item.isSelected) {
//                plugin.nextItem();
//                plugin._scrollToItemPointer();
//            }
//            else {
                plugin.nextPage();
                plugin._scrollToPointerPosition();
//            }
        });

        plugin.getPrevBtn().bind('click', function (e) {
//            if (ops.items.item.isSelected) {
//                plugin.prevItem();
//                plugin._scrollToItemPointer();
//            }
//            else {
                plugin.prevPage();
                plugin._scrollToPointerPosition();
//            }
        });
    },

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
            item = itemStateClass ? $('>' + itemStateClass, items).eq(0) : items.eq(0);
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
            itemsPadding += '<div class="'
                + ops.itemsSpacer.className
                + '">&nbsp;' + (i + 1) + '</div>';
        }

        // Resize items container
        this._sizeItemsContainerToItems((items.length * 2)
            * plugin._getItemsItemWidth());

        // Add padding to the container
        itemsContainer.prepend(itemsPadding);
        itemsContainer.append(itemsPadding);

        // Recalculate number of pages
        this._reCalculateNumPages();

        // Scroll
        ops.pages.pointer = 0;
        this._scrollToPointerPosition();
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
        if (item.length > 0) {
            item.removeClass('selected');
        }
        scrollableContainer.animate({scrollLeft: scrollTo}, 300);
    },

    _reCalculateNumPages: function () {
        this.options.pages.length = Math.ceil(this.getItems().length /
            this._getItemsPerPage());
    },

    // ================================================================

    _getItemsContainerContainer: function () {
        return this._getElementFromConfigSection('itemsContainerContainer');
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
        return $('.selected', this.getItems());
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
    }

});
