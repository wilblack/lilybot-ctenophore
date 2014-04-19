'use strict';

/* Controllers */


angular.module('myApp.controllers', [])
  .controller('DashBoardCtrl', ['$scope', '$interval', 'ardyhWsFactory', function($scope, $interval, ardyhWs) {

    var NUM_LEDS = 64;
    var timer = undefined;
    var timer_dir = -1;
    $scope.app = {bots:['ctenophore']};  // Bots to control
    $scope.tentacle = {leds:[], active_index:0, mode:"passive"};
    $scope.dt = 1000;

    var ledBase = {index:0,
                   color:"#000000",
                   state:"on"};

    
    $scope.getWidth = function() {
        return window.outerWidth;
    };
    

    $scope.setMode = function(mode){
        if (angular.isDefined(timer)) $scope.cancelTimer(timer);
        
        var message = {command:"setMode", 
                       kwargs:{mode:mode}
                      };

        ardyhWs.send(message);
        if (mode === 'scan'){
            timer = $interval(function() {
                if( ($scope.tentacle.active_index === (NUM_LEDS-1)) || ($scope.tentacle.active_index === 0 )) {
                    timer_dir = ($scope.tentacle.active_index === 0)? 1 : -1;
                } 
                $scope.tentacle.active_index = ($scope.tentacle.active_index + timer_dir);
                $scope.tentacle.leds[$scope.tentacle.active_index].color = "#FF0000";
                $scope.tentacle.leds[$scope.tentacle.active_index-timer_dir].color = "#000000";
            }, $scope.dt);
        } else if (mode === 'passive'){
            timer = $interval(function() {
                var old_index = $scope.tentacle.active_index
                $scope.tentacle.active_index = Math.round(Math.random()*NUM_LEDS);
                
                $scope.tentacle.leds[$scope.tentacle.active_index].color = ("#"+(Math.random().toString(16) + '000000').slice(2, 8));
                $scope.tentacle.leds[old_index].color = "#000000";
            }, $scope.dt);
        } else if (mode === "off"){
            message = {command:"allOff"}
            ardyhWs.send(message);
        }
    };

    $scope.cancelTimer = function(timer){
        $interval.cancel(timer);
        timer = undefined;
        for (var i=0; i < NUM_LEDS; i++){
            $scope.tentacle.leds[i].color = '#000000';
        }
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
