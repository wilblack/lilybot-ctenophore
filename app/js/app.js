'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  //'DashBoardCtrl',
  //'LandingCtrl',
  // 'myApp.DashBoardCtrl'

]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/landing.html', controller: 'LandingCtrl'});
  $routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.html', controller: 'DashBoardCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
