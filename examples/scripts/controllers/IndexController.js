define([
	'controllers/BaseController',
    'views/item/WelcomeItemView',
    'views/layout/MainLayout',
    'views/item/jui-scroll-pane-view',
    'views/item/jui-scrollable-drop-down-view',
    'views/item/jui-select-picker-view'
],
function( BaseController, IndexView, Layout ) {
    'use strict';

	return BaseController.extend({

		initialize: function( options ) {
            this.layout = new Layout();
			console.log("initialize a Indexcontroller Controller");

		},
        indexAction: function () {
            console.log('index action');
            this.layout.mainColRegion.show(new IndexView());
        },
        juiScrollPaneExampleAction: function () {
            //$('.content-pane').juiScrollPane();
        },
        juiSelectPickerExampleAction: function () {

        },
        juiScrollableDropDownExampleAction: function () {

        }
	});

});
