(function () {
  'use-strict';

  angular
    .module('app')
    .run(["$rootScope", "$location", function ($rootScope, $location) {
      $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
          $location.path("/home");
        }
      });
    }])
    .config(['$routeProvider', '$firebaseAuth', routes]);

  function routes($routeProvider, $firebaseAuth) {
    $routeProvider.when('/', {
      templateUrl: 'home/home.html', controller: 'home.Home',
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        // $waitForSignIn returns a promise so the resolve waits for it to complete
        "currentAuth": ["$firebaseAuth", function ($firebaseAuth) {
          return $firebaseAuth.$requireSignIn();
        }]
      }
    })
      .when('/chat/:id', {
        templateUrl: 'home/chat.html', controller: 'home.Chat',
        resolve: {
          // $requireSignIn returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          "currentAuth": ["$firebaseAuth", function ($firebaseAuth) {
            return $firebaseAuth.$waitForSignIn();
          }]
        }
      })
      .when('/manage', {
        templateUrl: 'account/manage.html', controller: 'account.Manage',
        resolve: {
          "currentAuth": ["$firebaseAuth", function ($firebaseAuth) {
            return $firebaseAuth.$waitForSignIn();
          }]
        }
      })
      .when('/login', {
        templateUrl: 'account/login.html', controller: 'account.Login'
      })

      .otherwise('/login');
  }

})();


// , "currentAuth": ["Auth", function (Auth) {
//           return Auth.$waitForSignIn();
//         }]