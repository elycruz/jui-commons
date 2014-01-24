define(['backbone.marionette'], function(Marionette) {
    'use strict';

    return Marionette.Controller.extend({
        defaultRequestParams: {},
        requestParams: {},
        viewClassSuffix: 'View',
        setRequestParams: function(requestParams) {
            this.requestParams = requestParams;
            return this;
        },
        mergeRequestParams: function(requestParams) {
            $.extend(true, this.requestParams, requestParams);
            return this;
        },
        getRequestParams: function() {
            return this.requestParams;
        },
        getViewClassName: function () {
            return strToCamelCase(this.requestParams.action
                + this.viewClassSuffix);
        },

        dispatch: function (actionName) {
            if (isset(this[actionName]) && typeof this[actionName] === 'function') {
                this[actionName]();
            }
            if (isset(this.showView) && typeof this.showView === 'function') {
                this.showView();
            }
        }

    });

});