if (typeof define !== 'function') { 
    var define = require('amdefine')(module); 
}

define (
    ['backbone'
    ,'underscore'
    ],    
    function ( Backbone, _ ) {

        var dispatch = _.extend({}, Backbone.Events);


        // Linking the Models
        // ------------------
        
        // We make a safe copy of the trigger function, allowing us to override
        // it and automatically forward events to the global dispatcher.
        Backbone.Model.prototype._trigger = Backbone.Model.prototype.trigger;


        _.extend(Backbone.Model.prototype, {

            // Bind every model to the global dispatcher.
            dispatcher : dispatch

            // Overrinding the trigger function to forward every event to the
            // bound dispatcher.
            , trigger : function() {
                this._trigger.apply(this,  arguments );
                this.dispatcher.trigger.apply(this, arguments );
            }
        });


        module.exports = dispatch;

        return dispatch;
    }
);
