(function () {
  'use-strict';

  angular.module('app', [
    'ngRoute',
    'firebase',
    'ui.bootstrap'
  ]);

  angular
    .module('app')
    .config([
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
    ])
    .config([
      '$httpProvider',
      function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptorService');
      }
    ])
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