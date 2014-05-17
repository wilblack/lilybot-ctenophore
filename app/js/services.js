'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var service = angular.module('myApp.services', []).
  value('version', '0.1');


// This example is taken from https://github.com/totaljs/examples/tree/master/angularjs-websocket
service.
    factory('ardyhWsFactory', ['$rootScope', '$timeout', function($rootScope, $timeout) {
    // Broadcasts to main scope as 'websocket'
    var _ws;
    var _username = '';
    var messages = [];
    var users = [];
    var url = 'ws://173.255.213.55:9093/ws';


    function onMessage(e) {
        var data;
        if (typeof(e) === 'object'){
            data = e.data;    
        } else {
            data = JSON.parse(decodeURIComponent(e.data));
        }
        
        $rootScope.$apply(function() {
            $rootScope.$broadcast('websocket', data);
        });
    }

    return {
        readyState: function(){
            return _ws.readyState;
        },

        login: function(username) {
            _ws = new WebSocket(url);
            _ws.onmessage = onMessage;
            _username = username;
            $timeout(function() {
                _ws.send(JSON.stringify({ type: 'change', message: _username }));
            }, 500);
        },

        logoff: function() {
            _ws.close();
            _ws = null;
            _username = '';
            users = [];
            $rootScope.$broadcast('websocket', 'users', users);
        },

        send: function(messageObj) {
            if (_ws.readyState === 1){
                _ws.send(JSON.stringify( messageObj));
            } else {
                console.log("Could not send message, ready state = "+_ws.readyState);
                if (_ws.readyState === 3){
                    // Web socket is closed so try to re-establish connection
                    this.login();
                }
            }
            
        }
    };

}]);