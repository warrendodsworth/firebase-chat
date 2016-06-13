(function () {
  'use-strict';

  angular.module('app', [
    'ngRoute',
    'firebase',
    'ui.bootstrap',
  ]);

  angular
    .module('app')
    .config([
      '$routeProvider',
      function ($routeProvider) {
        $routeProvider.when('/', { templateUrl: 'home/home.html', controller: 'home.Home' })
          .when('/chat/:id', { templateUrl: 'home/chat.html', controller: 'home.Chat' })
          .when('/manage', { templateUrl: 'account/manage.html', controller: 'account.Manage' })
          .when('/login', { templateUrl: 'account/login.html', controller: 'account.Login' })

          .otherwise('/login');
      }
    ])
    .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('HttpInterceptorService');
    }])
    .config(function () {
      var config = {
        apiKey: 'AIzaSyC9xO8omc7TxZZ0n4SOQW3bpE-uRryaVD4',
        authDomain: 'dazzling-fire-5094.firebaseapp.com',
        databaseURL: 'https://dazzling-fire-5094.firebaseio.com/',
        storageBucket: 'gs://dazzling-fire-5094.appspot.com'
      };
      firebase.initializeApp(config);

      // Get a reference to the database service
      var database = firebase.database();

    });
} ());