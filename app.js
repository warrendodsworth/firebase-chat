(function () {
  'use-strict';

  angular.module('app', ['ngRoute', 'firebase', 'LocalStorageModule']);


  angular.module('app')
    .config(['$routeProvider', function ($routeProvider) {

      $routeProvider
        .when('/', { templateUrl: 'home/home.html', controller: 'homeCtrl' })
        .when('/chat/:id', { templateUrl: 'home/chat.html', controller: 'chatCtrl' })

        .when('/login', { templateUrl: 'account/login.html', controller: 'loginCtrl' })
        .otherwise('/');

    }])

    .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('HttpInterceptorService');
    }]);

})(); 