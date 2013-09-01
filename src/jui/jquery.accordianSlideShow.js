/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 4:19 AM
 * To change this template use File | Settings | File Templates.
 */
$.widget('jui.accordianSlideShow', $.jui.paginatorWithTextField, {
    options: {
        items: {
            animation: {
                from: function (item, i) {
                    var width = item.css('border-width').match(/\d+/)[0] * 2 + item.width();
                    return {
                        duration: 1, //0.0538,
                        options: {
                            opacity: 0,
                            rotationX: 45 * (i % 2 ? -1 : 1),
                            left: width * i + width,
                            top: item.height() * (i % 2 ? -1 : 1)
                        },
                        easing: null
                    };
                }
            }
        }
    },
    _create: function () {
        var plugin = this, ops = plugin.options,
            items = plugin.getItems();

        // Animate items
        plugin.element.rotateItemsIntoPlace({animation: ops.items.animation});
    }
});
