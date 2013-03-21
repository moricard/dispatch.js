if (typeof define !== 'function') { 
    var define = require('amdefine')(module); 
}

define (
    ['underscore'
    ],    
    function ( _ ) {

        var Dispatch = {};

        module.exports = Dispatch;

        return Dispatch;
    }
);
