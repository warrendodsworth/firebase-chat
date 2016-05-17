(function () {
  'use-strict';

  angular.module('app', ['firebase']);


  angular.module('app')
    .config(function ($routeProvider) {
      $routeProvider

        .when('/', { templateUrl: 'home/home.html', controller: 'homeCtrl' })
        .when('/chat/:id', { templateUrl: 'home/chat.html', controller: 'chatCtrl' })

        .when('/login', { templateUrl: 'account/login.html', controller: 'loginCtrl' })
        .otherwise('/');
    });
  
})();