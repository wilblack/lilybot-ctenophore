'use strict';


angular.module('myApp')
  .controller('DashBoardCtrl', ['$scope', '$interval', 'ardyhWsFactory', function($scope, $interval, ardyhWs) {

    var NUM_LEDS = 64;
    var timer = undefined;
    var timer_dir = -1;
    $scope.app = {bots:['ctenophore']};  // Bots to control
    $scope.tentacle = {leds:[], active_index:0, mode:"off"};
    $scope.dt = 400;

    var ledBase = {index:0,
                   color:"#000000",
                   state:"on"};

    
    $scope.getWidth = function() {
        return window.outerWidth;
    };
    

    $scope.setMode = function(mode){
        // Cancel any previous modes
        if (angular.isDefined(timer)) $scope.cancelTimer(timer);
        
        $scope.allOff();
        

        if (mode === 'scan'){
            var NTIMES = 2*NUM_LEDS;
            var count = 0;
            timer = $interval(function() {
                count++;
                if (count === NTIMES) {
                    $scope.tentacle.mode = 'passive';
                } else {
                    if( ($scope.tentacle.active_index === (NUM_LEDS-1)) || ($scope.tentacle.active_index === 0 )) {
                    timer_dir = ($scope.tentacle.active_index === 0)? 1 : -1;
                    } 
                    $scope.tentacle.active_index = ($scope.tentacle.active_index + timer_dir);
                    $scope.tentacle.leds[$scope.tentacle.active_index].color = "#FF0000";
                    $scope.tentacle.leds[$scope.tentacle.active_index-timer_dir].color = "#000000";
                }

            }, 0.5*$scope.dt, NTIMES);

            
        
        } else if (mode === 'passive'){
            timer = $interval(function() {
                var old_index = $scope.tentacle.active_index
                $scope.tentacle.active_index = Math.round(Math.random()*NUM_LEDS);
                
                $scope.tentacle.leds[$scope.tentacle.active_index].color = ("#"+(Math.random().toString(16) + '000000').slice(2, 8));
                $scope.tentacle.leds[old_index].color = "#000000";
            }, $scope.dt);

        } else if (mode === "target"){
            var width = 6;
            var dt = 0.2;
            var lefti, righti, message;
            var NTIMES = 25;
            var count = 0;            

            var i = width;

            timer = $interval(function(){
                count++;  
                if (count === NTIMES){ // If this is the last time through set the mode to scan.
                    $scope.tentacle.mode = 'scan';
                } else {
                    if (i < 0 ) i=width;
                
                    
                    $scope.allOff();

                    lefti = $scope.tentacle.active_index - i;
                    righti= $scope.tentacle.active_index + i;
                    
                    message =  {command:"setRGB"};
                    if (righti < NUM_LEDS-1){
                        message.kwargs = {
                            index:righti,
                            color : "#FF0000"
                        };
                        ardyhWs.send(message);
                        $scope.tentacle.leds[righti].color = "#FF0000";
                    }
                    
                    if (lefti > 0){
                        message.kwargs = {
                            index:lefti,
                            color : "#FF0000"
                        };
                        ardyhWs.send(message);
                        $scope.tentacle.leds[lefti].color = "#FF0000";
                    }

                    i--;
                }
                
            }, 0.5*$scope.dt, NTIMES);

        } else if (mode === "off"){
            $scope.allOff();
        }
    };

    $scope.cancelTimer = function(timer){
        $interval.cancel(timer);
        timer = undefined;
        for (var i=0; i < NUM_LEDS; i++){
            $scope.tentacle.leds[i].color = '#000000';
        }
    };

    $scope.allOff = function(){
        var message = {command:"allOff", kwargs:{} };
        ardyhWs.send(message);
        
        _.each($scope.tentacle.leds, function(led){
            led.color = "#000000";
        });
    };


    // Create the leds array
    for (var i=1;i<=NUM_LEDS;i++){
        var led = Object.create(ledBase);
        led.index=i;
        $scope.tentacle.leds.push(led);
    }
    
    // Register the ardyh websocket listener and connect to ardyh web socket server 
    $scope.$on('websocket', function(e, data){
        $scope.lastMessage = data;
    });
    ardyhWs.login(""); // Connect to ardyh

    // Watch for window resize
    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        $scope.window_width = newValue;
    });
    window.onresize = function(){
        $scope.$apply();
    }

    // Watch for LED changes and send via websocket
    $scope.$watch('tentacle.leds', function(newValue, oldValue){
        console.log("leds changed");
    }, true);

    // Watch for LED changes and send via websocket
    $scope.$watch('tentacle.mode', function(newValue, oldValue){
        console.log("setting mode "+newValue);
        $scope.setMode(newValue);
    }, true);


  }]);
