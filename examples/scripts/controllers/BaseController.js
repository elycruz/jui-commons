define(['backbone.marionette'], function(Marionette) {

    return Marionette.Controller.extend({
        defaultRequestParams: {},
        requestParams: {},
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
        }

    });

});