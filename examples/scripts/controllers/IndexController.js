define([
    'communicator',
    'controllers/BaseController',
    'views/layout/MainLayout',
//    'stache!tmpl/item/effects-view',
//    'stache!tmpl/item/jui-basic-paginator-view',
//    'stache!tmpl/item/jui-floating-scroll-indicators-view',
//    'stache!tmpl/item/jui-scroll-pane-view',
//    'stache!tmpl/item/jui-scrollable-drop-down-view',
//    'stache!tmpl/item/jui-select-picker-view',
    'views/item/EffectsView',
    'views/item/JuiBasicPaginatorView',
    'views/item/JuiScrollableDropDownView',
    'views/item/JuiFloatingScrollIndicatorsView',
    'views/item/JuiScrollPaneView',
    'views/item/JuiSelectPickerView',
    'juiBase',
    'jquery-mousewheel'
],
    function (
        communicator,
        BaseController,
        Layout,
        EffectsView,
        JuiBasicPaginatorView,
        JuiScrollableDropDownView,
        JuiFloatingScrollIndicatorsView,
        JuiScrollPaneView,
        JuiSelectPickerView) {

        'use strict';

        return BaseController.extend({

            initialize: function () {
                var self = this;
                self.layout = new Layout();
                communicator.on('controllers/IndexController', function (data) {
                    if ($.isPlainObject(data) && !empty(data)) {
                        self.mergeRequestParams(data);
                    }
                    self.showView();
                });
            },

            showView: function () {
                var self = this,
                view = new eval(this.getViewClassName())( );
                self.layout.mainColRegion.show(view);
            },

            getViewClassName: function () {
                return strToCamelCase(
                    this.options.requestParams.action)
                    + 'View';
            }

        });

    });
