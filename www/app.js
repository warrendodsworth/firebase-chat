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
    .config([
      '$routeProvider',
      function ($routeProvider) {
        $routeProvider.when('/', {
          templateUrl: 'home/home.html', controller: 'home.Home',
          resolve: {
            // controller will not be loaded until $waitForSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth", function (Auth) {
              // $waitForSignIn returns a promise so the resolve waits for it to complete
              return Auth.$requireSignIn();
            }]
          }
        })
          .when('/chat/:id', {
            templateUrl: 'home/chat.html', controller: 'home.Chat',
            resolve: {
              // controller will not be loaded until $requireSignIn resolves
              // Auth refers to our $firebaseAuth wrapper in the example above
              "currentAuth": ["Auth", function (Auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireSignIn();
              }]
            }
          })
          .when('/manage', { templateUrl: 'account/manage.html', controller: 'account.Manage' })
          .when('/login', { templateUrl: 'account/login.html', controller: 'account.Login' })

          .otherwise('/login');
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
    .config(['$httpProvider', function (httpProvider) {
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