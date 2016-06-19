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
    .config(['$routeProvider', routes]);

  function routes($routeProvider) {
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
      .when('/manage', {
        templateUrl: 'account/manage.html', controller: 'account.Manage',
        resolve: {
          "currentAuth": ["Auth", function (Auth) {
            return Auth.$requireSignIn();
          }]
        }
      })
      .when('/login', { templateUrl: 'account/login.html', controller: 'account.Login' })

      .otherwise('/login');
  }

})();