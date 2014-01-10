define([
    'controllers/BaseController',
    'views/item/WelcomeItemView',
    'views/layout/MainLayout',
    'juiBase',
    'jquery-mousewheel'
],
    function (BaseController, IndexView, Layout) {
        'use strict';

        return BaseController.extend({

            initialize: function (options) {
                this.layout = new Layout();
            },

            showView: function () {
                var self = this;
                require(['views/item/'
                    + this.getViewClassName()], function (View) {
                    var view = new View();
                    self.layout.mainColRegion.show(view);
                });
            },

            getViewClassName: function () {
                return strToCamelCase(this.options.requestParams.action)
                    + 'View';
            }

        });

    });
