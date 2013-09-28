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
            numPaddingItems: null,
            item: {
                isSelected: false,
                normalWidth: null,
                normalHeight: null,
                selectedWidth: null,
                selectedHeight: null,
                border: [3, 3, 3, 3]
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
                return 1024 / this.getItems().eq(0).width()
            }
        }
    },

    _create: function () {
        var plugin = this, ops = plugin.options,
            items = plugin.getItems();

        // Super
        plugin._super();

        // Animate items
        $.jui.animateItemsWithGsap.apply(this);

        // Calculate numbers
        plugin._calculateNumberOfPages();

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

            console.log(item.offset().left);
            scrollableContainer.animate({scrollLeft: (ops.items.numPaddingItems / 4 + Number(item.attr('data-index'))) * regularItemWidth}, 300);
        });

        // Prev and Next Btns
        plugin.getNextBtn().bind('click', function (e) {
//			var item = items.eq(plugin.getPointer());
//			items.removeClass('selected');
//			item.addClass('selected');
            plugin.nextPage();
            scrollableContainer.animate({scrollLeft: (plugin._getItemsPerPage() * regularItemWidth) * plugin.getPointer()}, 300);
        });

        plugin.getPrevBtn().bind('click', function (e) {
            var item = plugin._getSelectedItem();

            if (item.length > 0) {
                item.removeClass('selected');
            }


            plugin.prevPage();
            scrollableContainer.animate({scrollLeft: (plugin._getItemsPerPage() * regularItemWidth) * plugin.getPointer()}, 300);
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
            spacer = '<div class="'
                + ops.itemsSpacer.className
                + '">&nbsp;</div>',
            itemWidth = plugin._getItemsItemWidth();

        // Set num padding items
        ops.items.numPaddingItems = items.length;

        // Make some padding
        for (i = 0; i < ops.items.numPaddingItems / 2; i += 1) {
            itemsPadding += spacer;
        }

        // Resize items container
        itemsContainer.width((items.length * 2) * plugin._getItemsItemWidth());

        // Add padding to the container
        itemsContainer
            .prepend(itemsPadding)
            .append(itemsPadding);

        // Scroll
        this._getItemsContainerContainer().scrollLeft(items.length / 2 * itemWidth);
    },

    _getItemsContainerContainer: function () {
        return this._getElementFromConfigSection('itemsContainerContainer');
    },

    _getItemsPerPage: function () {
        var ops = this.options,
            retVal = isset(ops.items.perPage) ? ops.items.perPage : 1;
        if (typeof ops.items.perPage === 'function') {
            retVal = ops.items.perPage.apply(this);
        }
        return Math.ceil(retVal);
    },
    _getSelectedItem: function () {
        return $('.selected', this.getItems());
    },
    _getScrollAmountPerPage: function () {
        var ops = this.options,
            normalPageWidth = (ops.items.numPaddingItems / 2 + this._getItemsPerPage()) * this._getItemsItemWidth();
        return ops.items.isItemSelected ?
            normalPageWidth - this._getItemsSelectedItemWidth() : normalPageWidth;
    },

    _scrollToSelectedItem: function (selectedItem) {

    }


});
