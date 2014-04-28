'use strict';

/* Directives */


var app = angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
}]);


app.directive('ledcolor', ['ardyhWsFactory', function(ardyhWs){
    

    function ledClickCallback(event){
        console.log("clicked led");
        console.log(event);

        // Set target algorithm here
    }

    return {
        restruct:'A',
        scope : true,
        templateUrl: 'partials/ledcolor.html',
        link : function(scope, element, attrs){

            scope.$watch('led.color', function(newValue){
                // Make command, color shold be a HEX color string (with the hash)
                var message = {command:"setRGB", 
                               kwargs:{color:scope.led.color, index:scope.led.index}
                              }

                ardyhWs.send(message);
            });

            element.on('click', function(event){
                console.log("LED clicked index " + scope.led.index);
                scope.tentacle.active_index = scope.led.index;
                scope.tentacle.mode = 'target';
            });
        }



    };
}]);

