(function () {
  'use-strict';

  angular
    .module('app', [
      'ngRoute',
      'ngAnimate',
      'firebase',
      'ui.bootstrap',
    ]);

  angular
    .module('app')

    .run(['$rootScope', '$firebaseAuth', function ($rootScope, $firebaseAuth) {
      // $firebaseAuth().$onAuth(function (user) {
      //   $rootScope.auth = !!user;
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

}());