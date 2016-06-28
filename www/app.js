(function () {
  'use-strict';

  angular.module('app', [
    'ngRoute',
    'ngAnimate',
    'firebase',
    'ui.bootstrap',
  ]);

  angular
    .module('app')
    .factory("Auth", ["$firebaseAuth",
      function ($firebaseAuth) {
        return $firebaseAuth();
      }
    ])

    .run(['$rootScope', 'Auth', function ($rootScope, Auth) {
      // track status of authentication
      // Auth.$onAuth(function (user) {
      //   $rootScope.identity.auth = !!user;
      // });
    }])

    .config(['$httpProvider', function ($httpProvider) {
      var config = {
        apiKey: 'AIzaSyC9xO8omc7TxZZ0n4SOQW3bpE-uRryaVD4',
        authDomain: 'dazzling-fire-5094.firebaseapp.com',
        databaseURL: 'https://dazzling-fire-5094.firebaseio.com/',
        storageBucket: 'gs://dazzling-fire-5094.appspot.com'
      };
      firebase.initializeApp(config);
    }]);

} ());