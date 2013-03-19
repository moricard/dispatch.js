var dispatch = require(__dirname + '/../dispatch')
,   _        = require('underscore')
,   Backbone = require('backbone');


describe("Dispatcher", function() {

    it("should not be undefined", function() {
        expect( dispatch ).not.toBe( undefined );
    });

    it("properly extends Backbone.Events", function() {
        _.each( Backbone.Events, function( func, name ) {
            expect( dispatch[name] ).toBeDefined();
        });        
    });

    it("should know about it's subscribers", function() {
        var publisher = new Backbone.Model();
        expect( dispatch.publishers.length ).toBe(1);
        publisher.destroy();
        expect( dispatch.publishers.length ).toBe(0);
    });
});

describe("Models", function() {

    var model;

    beforeEach( function() {
        model = new Backbone.Model();
    });

    it("should copy manually triggered events to the Dispatcher", function() {
        spyOn( dispatch, 'trigger' );
        spyOn( model, '_trigger' );
        model.trigger('test');
        expect( dispatch.trigger ).toHaveBeenCalledWith('test');
        expect( model._trigger ).toHaveBeenCalledWith('test');
    });

    it("should forward 'change' events when being updated", function() {
        spyOn( dispatch, 'trigger' );
        
        model.set('value', "new value");
        expect( dispatch.trigger ).toHaveBeenCalledWith('change:value', model, 'new value', {});
    });

    it("should forward 'destroy' events when deleted", function() {
        spyOn( dispatch, 'trigger' );

        model.destroy();
        expect( dispatch.trigger ).toHaveBeenCalled();
        expect( dispatch.trigger.mostRecentCall.args[0] ).toBe('destroy');
        expect( dispatch.trigger.mostRecentCall.args[1] ).toBe( model );
    });

    it("should forward 'add' events when added to a collection", function() {
        spyOn( dispatch, 'trigger' );

        var collection = new Backbone.Collection();

        collection.add( model );

        expect( dispatch.trigger ).toHaveBeenCalled();
        expect( dispatch.trigger.mostRecentCall.args[0] ).toBe('add');
        expect( dispatch.trigger.mostRecentCall.args[1] ).toBe( model );
    });

    it("should share it's dispatcher with every other model", function() {
        var model2 = new Backbone.Model();
        expect( model.dispatcher ).toBe( model2.dispatcher );
        model2.destroy();
    });

    it("can add itself to the Dispatcher upon construction", function() {
        expect( dispatch.publishers.length ).toBe( 1 );
    });

    afterEach( function() {
        model.destroy();
    });    
});
