(function () {
  'use-strict';
  angular.module('app', [
    'ngRoute',
    'firebase',
    'ui.bootstrap'
  ]);
  angular.module('app').config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'home/home.html',
        controller: 'homeCtrl'
      }).when('/chat/:id', {
        templateUrl: 'home/chat.html',
        controller: 'chatCtrl'
      }).when('/manage', {
        templateUrl: 'account/manage.html',
        controller: 'manageCtrl'
      }).when('/login', {
        templateUrl: 'account/login.html',
        controller: 'loginCtrl'
      }).otherwise('/login');
    }
  ]).config([
    '$httpProvider',
    function ($httpProvider) {
      $httpProvider.interceptors.push('httpInterceptorService');
    }
  ]);
  // angular.module('app').constant('globals', {});
} ());