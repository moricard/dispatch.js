if (typeof define !== 'function') { 
    var define = require('amdefine')(module); 
}

define (
    ['backbone'
    ,'underscore'
    ],    
    function ( Backbone, _ ) {

        var Dispatch = Backbone.Dispatch = _.extend({}, Backbone.Events);

        // Linking the Models
        // ------------------
        
        // We make a safe copy of the trigger function, allowing us to override
        // it and automatically forward events to the global dispatcher.
        Backbone.Model.prototype._trigger = Backbone.Model.prototype.trigger;

        // We make a safe copy of the original Backbone.Model constructor in
        // order to reuse it.
        var constructor = Backbone.Model;

        // Here we get fancy and override the original Model constructor to make
        // sure every model is bound to the global Dispatch object upon construction.
        Backbone.Model = Backbone.Model.extend({
            constructor : function( attributes, options ) {
                Dispatch.link( this );
                constructor.call( this, attributes, options );
            }
        });

        // We make a safe copy of the original destroy method to override it.
        var destroy = Backbone.Model.prototype.destroy;

        _.extend( Backbone.Model.prototype, {

            // Bind every model to the global dispatcher.
            dispatcher : Dispatch

            // Overrinding the trigger function to forward every event to the
            // bound dispatcher.
            , trigger : function() {
                this._trigger.apply( this,  arguments );
                if ( this.dispatcher )
                    this.dispatcher.trigger.apply( this, arguments );
            }            
            // Upon destruction, we remove the reference to this object
            // from the dispatcher.
            , destroy : function() {
                if ( this.dispatcher )
                    this.dispatcher.unlink( this );
                destroy.apply( this, arguments );
            }
            // Unlinking the model from the dispatcher's channel, all messages
            // become local.
            , unlink : function() {
                this.dispatcher.unlink( this );
                this.dispatcher = null;
            }
        });

        _.extend( Dispatch, {

            // Array containing all objects that can publish to the dispatcher's
            // channel.
            publishers : []

            // Add an object to the dispatcher's channel
            , link : function( object ) {
                this.publishers = _.union( this.publishers,  [object] );                
            }
            
            // Remove an object from the list of publishers
            , unlink : function( object ) {
                this.publishers = _.without( this.publishers, object );
                //object.dispatcher = null;
            }

        });

        module.exports = Dispatch;

        return Dispatch;
    }
);
