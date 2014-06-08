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
        //scope : true,
        scope : {
            tentacle : "=",
            led : "=",
            index : "="
        },
        templateUrl: 'partials/ledcolor.html',
        link : function(scope, element, attrs){
            var W = window.outerWidth;
            var H = window.outerHeight;
            var nleds = scope.tentacle.leds.length;
            var width = W / nleds;
            var height = 3*(H / nleds);
            var A = 0.9*W/2;


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

            
            scope.cellStyle = function(index){
                var offset = A * Math.sin( (index * 2*Math.PI) / nleds ) + W/2;
                

                return {margin:'0 0 0 '+offset+'px',
                        width:width+"%",
                        height:height+"px",
                        };
            };

            scope.innerCellStyle = function(index){
                //"width:{{window_width / tentacle.leds.length}}px; background-color:{{led.color}}; box-shadow:0 0 15px 5px {{led.color}}; border:1px solid {{led.color}}; background-image: -webkit-radial-gradient(8px 8px, circle cover, {{ led.color === '#000' ? '#000':'white' }}, {{led.color}});"

                var fadeColor = scope.led.color === '#000000' ? '#000000':'#FFFFFF';
                
                var out = {
                    'background-color':scope.led.color,
                    'box-shadow':'0 0 15px 5px '+scope.led.color,
                    'border':'1px solid '+scope.led.color,
                    'background-image': '-webkit-radial-gradient(8px 8px, circle cover, ' + fadeColor + ', ' + scope.led.color + ')'
                };
                return out;
            };
        }



    };
}]);

app.directive('mmcontrols', function(){
    return {
        restrict: 'A',
        templateUrl: 'partials/mm-controls.html'
    }
});

