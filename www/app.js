(function () {
  'use-strict';

  angular.module('app', [
    'ngRoute',
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

    .run(["$rootScope", "$location", function ($rootScope, $location) {
      $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
          $location.path("/home");
        }
      });
    }])
    
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

      //standard app http interceptor      
      $httpProvider.interceptors.push('HttpInterceptorService');
    }]);

} ());