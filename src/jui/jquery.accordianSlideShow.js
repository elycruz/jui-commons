/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 4:19 AM
 * To change this template use File | Settings | File Templates.
 */
$.widget('jui.accordianSlideShow', $.jui.paginatorWithTextField, {
    options:{
        itemsSpacer:{
            tagName:'div',
            className:'spacer',
            selector:'.spacer'
        },
        itemsContainer: {
            elm: null,
            selector: '> .items'
        },
        items:{
            animation:{
                from:function (item, i) {
                    var width = 3 * 2 + item.width();
                    return {
                        duration:0.0538,
                        options:{
                            opacity:0,
//                            rotationX: 45 * (i % 2 ? -1 : 1),
                            left:width
                        },
                        easing:null
                    };
                }
            }
        }
    },

    _create:function () {
        var plugin = this, ops = plugin.options,
            items = plugin.getItems();

        // Super
        plugin._super();

        // Animate items
        $.jui.animateItemsWithGsap.apply(this);
        plugin._addEmptyItems();
    },

    _addEmptyItems:function () {
        var plugin = this,
            ops = plugin.options,
            items = plugin.getItems(),
            i, itemsPadding = '',
            itemsContainer = plugin.getItemsContainer(),
            spacer = '<div class="'
                + ops.itemsSpacer.className
                + '">&nbsp;</div>';

        // Make some padding
        for (i = 0; i < items.length / 2; i += 1) {
            itemsPadding += spacer;
        }

        // Resize items container
        itemsContainer.width((items.length * 2) * items.eq(0).width());

        // Add padding to the container
        itemsContainer
            .prepend(itemsPadding)
            .append(itemsPadding);

        // Scroll
        this.element.scrollLeft(items.length / 2 * (items.eq(0).width() + 6));
    }
});
