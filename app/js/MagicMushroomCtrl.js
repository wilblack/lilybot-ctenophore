'use strict';


angular.module('myApp')
.controller('MagicMushroomCtrl', ['$scope', 'ardyhWsFactory', function($scope, ardyhWs) {

    $scope.mm = {};
    $scope.mm.state = 'FFFFFF';
    
    $scope.$watch('mm.state', function(newValue){
        console.log(newValue);
        ardyhWs.mmSetState(newValue, function(rs){
            console.log("in mmsetState success callback");
        });
        
    });

}]);