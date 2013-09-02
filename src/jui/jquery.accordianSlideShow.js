/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 4:19 AM
 * To change this template use File | Settings | File Templates.
 */
$.widget('jui.accordianSlideShow', $.jui.paginatorWithTextField, {
    options:{
        items:{
            animation:{
                from: function (item, i) {
                    var width = 3 * 2 + item.width();
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
            }
        }
    },
    _create:function () {
        var plugin = this, ops = plugin.options,
            items = plugin.getItems();

        // Animate items
        $.jui.animateItemsWithGsap.apply(this);
        plugin._addEmptyItems();
    },

    _addEmptyItems: function () {
        var plugin = this;
        plugin.getItems();
    }
});
