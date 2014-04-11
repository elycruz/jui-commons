require([
	'backbone',
	'application',
	'regionManager',
    'jquery',
    'jquery-ui',
    'TweenMax',
    'jui-commons'
],
function ( Backbone, App ) {
    'use strict';
//    var pushState = !!(window.history && window.history.pushState),
//        settings = {
//            pushState: pushState,
//            silent: true,
//            hashChange: !pushState ? true : false
//        };
    Backbone.history.start();
	App.start();
});
