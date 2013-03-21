var dispatch = require(__dirname + '/../dispatch')
,   _        = require('underscore');

describe("Dispatcher", function() {
    describe("Exists", function() {
        it("is defined", function() {
            expect( dispatch ).toBeDefined();
        });
    });
});
