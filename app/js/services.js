'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var service = angular.module('myApp.services', []).
  value('version', '0.1');


// This example is taken from https://github.com/totaljs/examples/tree/master/angularjs-websocket
service.
    factory('ardyhWsFactory', ['$rootScope', '$timeout', '$http', function($rootScope, $timeout, $http) {
    // Broadcasts to main scope as 'websocket'
    var _ws;
    var bot_name = 'mm-client.solalla.ardyh';
    var messages = [];
    var users = [];

    var ip = '162.243.146.219';
    var url = 'ws://'+ip+':9093/ws?'+bot_name;
    var webUrl = 'http://ardyh.solalla.com:9093';
    var mmUrl = webUrl + '/magic-mushroom/';


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
        mmUrl : mmUrl,
        readyState: function(){
            return _ws.readyState;
        },

        login: function(username) {
            _ws = new WebSocket(url);
            _ws.onmessage = onMessage;
            
            var message = {'handshake':true,
                       'bot_name':bot_name,
                       'subscriptions':['rp2.solalla.ardyh']
            }
            $timeout(function() {
                _ws.send(JSON.stringify(message));
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
        },

        mmSetState: function(state, successCallback){
            var url = mmUrl + '/set-state/?state=' + state; 
            $http.get(url).success(successCallback);
        }

    };

}]);