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
    .config(['$routeProvider', '$locationProvider', routes]);

  function routes($routeProvider, $locationProvider) {

    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });

    $routeProvider
      .when('/', {
        templateUrl: 'home/home.html', controller: 'home',
        resolve: {
          "auth": ['$firebaseAuth', function ($firebaseAuth) {
            return $firebaseAuth().$requireSignIn();
          }]
        }
      })
      .when('/chat/:id', {
        templateUrl: 'home/chat.html', controller: 'chat',
        resolve: {
          "auth": ['$firebaseAuth', function ($firebaseAuth) {
            return $firebaseAuth().$waitForSignIn();
          }]
        }
      })
      .when('/manage', {
        templateUrl: 'account/manage.html', controller: 'account.manage',
        resolve: {
          "auth": ['$firebaseAuth', function ($firebaseAuth) {
            return $firebaseAuth().$waitForSignIn();
          }]
        }
      })
      .when('/lab', {
        templateUrl: 'home/lab.html', controller: 'lab',
      })
      .when('/login', {
        templateUrl: 'account/login.html', controller: 'account.login'
      })

      .otherwise('/login');
  }

})();


// Auth refers to our $firebaseAuth wrapper in the example above
// $requireSignIn returns a promise so the resolve waits for it to complete
// If the promise is rejected, it will throw a $stateChangeError (see above)

// controller will not be loaded until $waitForSignIn resolves
// $waitForSignIn returns a promise so the resolve waits for it to complete