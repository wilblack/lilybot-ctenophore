'use-strict';

if (typeof Object.create !== 'function'){
    Object.create = function(o){
        var F = function(){};
        F.protoype =o;
        return new F();
    };
}