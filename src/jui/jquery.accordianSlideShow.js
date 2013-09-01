/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 4:19 AM
 * To change this template use File | Settings | File Templates.
 */
$.widget('jui.accordianSlideShow', $.jui.paginatorWithTextField, {
    options: {},
    _create: function () {
        var plugin = this, ops = plugin.options,
            items = plugin.getItems();


        plugin.element.rotateItemsIntoPlace();
    }
});
