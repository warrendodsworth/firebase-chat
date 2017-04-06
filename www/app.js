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
      templateUrl: '_home/home.html', controller: 'home',
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        // $waitForSignIn returns a promise so the resolve waits for it to complete
        "currentAuth": ['$firebaseAuth', function ($firebaseAuth) {
          return $firebaseAuth().$requireSignIn();
        }]
      }
    })
      .when('/chat/:id', {
        templateUrl: '_home/chat.html', controller: 'chat',
        resolve: {
          // Auth refers to our $firebaseAuth wrapper in the example above
          // $requireSignIn returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          "currentAuth": ['$firebaseAuth', function ($firebaseAuth) {
            return $firebaseAuth().$waitForSignIn();
          }]
        }
      })
      .when('/manage', {
        templateUrl: '_account/manage.html', controller: 'account.manage',
        resolve: {
          "currentAuth": ['$firebaseAuth', function ($firebaseAuth) {
            return $firebaseAuth().$waitForSignIn();
          }]
        }
      })
      .when('/login', {
        templateUrl: '_account/login.html', controller: 'account.login'
      })

      .otherwise('/login');
  }

})();


(function () {
  'use strict';

  angular
    .module('app')
    .controller('account.login', loginController);

  loginController.$inject = ['$scope', '$location', '$firebaseAuth', '_account'];

  function loginController($scope, $location, $firebaseAuth, _account) {
    var vm = $scope;
    var auth = firebase.auth();
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email,user_likes');

    vm.facebookLogin = function () {
      $firebaseAuth().$signInWithRedirect(provider);
    };
  }
})();



angular
  .module('app')

  .factory('_profile', ['$firebaseObject', '$firebaseAuth',
    function ($firebaseObject, $firebaseAuth) {
      // a factory to create a re-usable Profile object
      return function (uid) {
        var profileRef = firebase.database().ref('users/' + uid);
        return $firebaseObject(profileRef);
      };
    }
  ])

  .controller('account.manage', ['$scope', '$routeParams', '_profile', 'currentAuth',
    function ($scope, $routeParams, Profile, currentAuth) {
      var user = firebase.auth().currentUser;
      // create a three-way binding to our Profile as $scope.profile
      _profile(user.uid).$bindTo($scope, 'profile');
    }
  ]);



(function () {
  'use strict';

  angular
    .module('app')
    .factory('_account', accountService);

  accountService.$inject = ['$location', '$rootScope', '$firebaseAuth'];

  function accountService($location, $rootScope, $firebaseAuth) {
    var service = {};
    var auth = firebase.auth();
    var db = firebase.database();
    var amOnline = db.ref('.info/connected');
    service.auth = {};

    //Init auth watcher    
    $firebaseAuth().$onAuthStateChanged(function (user) {
      if (user) {

        var userRef = db.ref('users/' + user.uid);
        
        userRef.once('value', function (userSnap) {
          var isNewUser = !userSnap.exists();
          if (isNewUser) {
            user.providerData.forEach(function (profile) {
              if (profile.providerId == 'facebook.com') {
                userRef.set({
                  name: profile.displayName,
                  email: profile.email,
                  photoURL: profile.photoURL
                });
                service.auth.name = profile.displayName;
                service.auth.email = profile.email;
                service.auth.photoURL = profile.photoURL;
              }
            });
          } else {
            //So that we load the users saved changes when they login, and not overwrite them with provider values
            var profile = userSnap.val();
            service.auth.name = profile.name;
            service.auth.email = profile.email; 
            service.auth.photoURL = profile.photoURL;
          }
        });

        var presenceRef = db.ref('presence/' + user.uid);
        amOnline.on('value', function (snapshot) {
          if (snapshot.val()) {
            presenceRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            presenceRef.set(true); 
          }
        });

        console.log('svc: user logged in');
        $location.path('/');
      } else {
        console.log('svc: not logged in');
        $location.path('/login');
      }
    });

    //Logout    
    service.logout = function () {
      $firebaseAuth().$signOut();
      service.auth = {};
      return service.auth;
    };

    return service;
  }

})();









// auth.getRedirectResult().then(function (result) {
//   if (result.credential) {
//     var token = result.credential.accessToken; //Facebook Access token
//   }
// }).catch(function (error) {
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   var email = error.email;
//   var credential = error.credential;    // The firebase.auth.AuthCredential type that was used.
// });


// save the user's profile into the database so we can list users,
// use them in Security and Firebase Rules, and show profiles
// function getName(user) {
//   switch (user.provider) {
//     case 'password':
//       return user.password.email.replace(/@.*/, '');
//     case 'twitter':
//       return user.twitter.displayName;
//     case 'facebook':
//       return user.facebook.displayName;
//   }
// }

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9hcHAuanMiLCJfYXBwLnJvdXRlcy5qcyIsImxvZ2luLmNvbnRyb2xsZXIuanMiLCJtYW5hZ2UuY29udHJvbGxlci5qcyIsIl9hY2NvdW50LnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xyXG4gICd1c2Utc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwJywgW1xyXG4gICAgICAnbmdSb3V0ZScsXHJcbiAgICAgICduZ0FuaW1hdGUnLFxyXG4gICAgICAnZmlyZWJhc2UnLFxyXG4gICAgICAndWkuYm9vdHN0cmFwJyxcclxuICAgIF0pO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAnKVxyXG5cclxuICAgIC5ydW4oWyckcm9vdFNjb3BlJywgJyRmaXJlYmFzZUF1dGgnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJGZpcmViYXNlQXV0aCkge1xyXG4gICAgICAvLyAkZmlyZWJhc2VBdXRoKCkuJG9uQXV0aChmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAvLyAgICRyb290U2NvcGUuYXV0aCA9ICEhdXNlcjtcclxuICAgICAgLy8gfSk7XHJcbiAgICB9XSlcclxuXHJcbiAgICAuY29uZmlnKFsnJGh0dHBQcm92aWRlcicsIGZ1bmN0aW9uICgkaHR0cFByb3ZpZGVyKSB7XHJcbiAgICAgIHZhciBjb25maWcgPSB7XHJcbiAgICAgICAgYXBpS2V5OiAnQUl6YVN5Qzl4TzhvbWM3VHhaWjBuNFNPUVczYnBFLXVScnlhVkQ0JyxcclxuICAgICAgICBhdXRoRG9tYWluOiAnZGF6emxpbmctZmlyZS01MDk0LmZpcmViYXNlYXBwLmNvbScsXHJcbiAgICAgICAgZGF0YWJhc2VVUkw6ICdodHRwczovL2RhenpsaW5nLWZpcmUtNTA5NC5maXJlYmFzZWlvLmNvbS8nLFxyXG4gICAgICAgIHN0b3JhZ2VCdWNrZXQ6ICdnczovL2RhenpsaW5nLWZpcmUtNTA5NC5hcHBzcG90LmNvbSdcclxuICAgICAgfTtcclxuICAgICAgZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChjb25maWcpO1xyXG4gICAgfV0pO1xyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICd1c2Utc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwJylcclxuICAgIC5ydW4oW1wiJHJvb3RTY29wZVwiLCBcIiRsb2NhdGlvblwiLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJGxvY2F0aW9uKSB7XHJcbiAgICAgICRyb290U2NvcGUuJG9uKFwiJHJvdXRlQ2hhbmdlRXJyb3JcIiwgZnVuY3Rpb24gKGV2ZW50LCBuZXh0LCBwcmV2aW91cywgZXJyb3IpIHtcclxuICAgICAgICAvLyBXZSBjYW4gY2F0Y2ggdGhlIGVycm9yIHRocm93biB3aGVuIHRoZSAkcmVxdWlyZVNpZ25JbiBwcm9taXNlIGlzIHJlamVjdGVkXHJcbiAgICAgICAgLy8gYW5kIHJlZGlyZWN0IHRoZSB1c2VyIGJhY2sgdG8gdGhlIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChlcnJvciA9PT0gXCJBVVRIX1JFUVVJUkVEXCIpIHtcclxuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL2hvbWVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1dKVxyXG4gICAgLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgcm91dGVzXSk7XHJcblxyXG4gIGZ1bmN0aW9uIHJvdXRlcygkcm91dGVQcm92aWRlcikge1xyXG4gICAgJHJvdXRlUHJvdmlkZXIud2hlbignLycsIHtcclxuICAgICAgdGVtcGxhdGVVcmw6ICdfaG9tZS9ob21lLmh0bWwnLCBjb250cm9sbGVyOiAnaG9tZScsXHJcbiAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAvLyBjb250cm9sbGVyIHdpbGwgbm90IGJlIGxvYWRlZCB1bnRpbCAkd2FpdEZvclNpZ25JbiByZXNvbHZlc1xyXG4gICAgICAgIC8vICR3YWl0Rm9yU2lnbkluIHJldHVybnMgYSBwcm9taXNlIHNvIHRoZSByZXNvbHZlIHdhaXRzIGZvciBpdCB0byBjb21wbGV0ZVxyXG4gICAgICAgIFwiY3VycmVudEF1dGhcIjogWyckZmlyZWJhc2VBdXRoJywgZnVuY3Rpb24gKCRmaXJlYmFzZUF1dGgpIHtcclxuICAgICAgICAgIHJldHVybiAkZmlyZWJhc2VBdXRoKCkuJHJlcXVpcmVTaWduSW4oKTtcclxuICAgICAgICB9XVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgICAud2hlbignL2NoYXQvOmlkJywge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnX2hvbWUvY2hhdC5odG1sJywgY29udHJvbGxlcjogJ2NoYXQnLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIC8vIEF1dGggcmVmZXJzIHRvIG91ciAkZmlyZWJhc2VBdXRoIHdyYXBwZXIgaW4gdGhlIGV4YW1wbGUgYWJvdmVcclxuICAgICAgICAgIC8vICRyZXF1aXJlU2lnbkluIHJldHVybnMgYSBwcm9taXNlIHNvIHRoZSByZXNvbHZlIHdhaXRzIGZvciBpdCB0byBjb21wbGV0ZVxyXG4gICAgICAgICAgLy8gSWYgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQsIGl0IHdpbGwgdGhyb3cgYSAkc3RhdGVDaGFuZ2VFcnJvciAoc2VlIGFib3ZlKVxyXG4gICAgICAgICAgXCJjdXJyZW50QXV0aFwiOiBbJyRmaXJlYmFzZUF1dGgnLCBmdW5jdGlvbiAoJGZpcmViYXNlQXV0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGZpcmViYXNlQXV0aCgpLiR3YWl0Rm9yU2lnbkluKCk7XHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLndoZW4oJy9tYW5hZ2UnLCB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdfYWNjb3VudC9tYW5hZ2UuaHRtbCcsIGNvbnRyb2xsZXI6ICdhY2NvdW50Lm1hbmFnZScsXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgXCJjdXJyZW50QXV0aFwiOiBbJyRmaXJlYmFzZUF1dGgnLCBmdW5jdGlvbiAoJGZpcmViYXNlQXV0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGZpcmViYXNlQXV0aCgpLiR3YWl0Rm9yU2lnbkluKCk7XHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLndoZW4oJy9sb2dpbicsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ19hY2NvdW50L2xvZ2luLmh0bWwnLCBjb250cm9sbGVyOiAnYWNjb3VudC5sb2dpbidcclxuICAgICAgfSlcclxuXHJcbiAgICAgIC5vdGhlcndpc2UoJy9sb2dpbicpO1xyXG4gIH1cclxuXHJcbn0pKCk7XHJcblxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwJylcclxuICAgIC5jb250cm9sbGVyKCdhY2NvdW50LmxvZ2luJywgbG9naW5Db250cm9sbGVyKTtcclxuXHJcbiAgbG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnJGZpcmViYXNlQXV0aCcsICdfYWNjb3VudCddO1xyXG5cclxuICBmdW5jdGlvbiBsb2dpbkNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sICRmaXJlYmFzZUF1dGgsIF9hY2NvdW50KSB7XHJcbiAgICB2YXIgdm0gPSAkc2NvcGU7XHJcbiAgICB2YXIgYXV0aCA9IGZpcmViYXNlLmF1dGgoKTtcclxuICAgIHZhciBwcm92aWRlciA9IG5ldyBmaXJlYmFzZS5hdXRoLkZhY2Vib29rQXV0aFByb3ZpZGVyKCk7XHJcbiAgICBwcm92aWRlci5hZGRTY29wZSgnZW1haWwsdXNlcl9saWtlcycpO1xyXG5cclxuICAgIHZtLmZhY2Vib29rTG9naW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRmaXJlYmFzZUF1dGgoKS4kc2lnbkluV2l0aFJlZGlyZWN0KHByb3ZpZGVyKTtcclxuICAgIH07XHJcbiAgfVxyXG59KSgpO1xyXG5cclxuXHJcbiIsImFuZ3VsYXJcclxuICAubW9kdWxlKCdhcHAnKVxyXG5cclxuICAuZmFjdG9yeSgnX3Byb2ZpbGUnLCBbJyRmaXJlYmFzZU9iamVjdCcsICckZmlyZWJhc2VBdXRoJyxcclxuICAgIGZ1bmN0aW9uICgkZmlyZWJhc2VPYmplY3QsICRmaXJlYmFzZUF1dGgpIHtcclxuICAgICAgLy8gYSBmYWN0b3J5IHRvIGNyZWF0ZSBhIHJlLXVzYWJsZSBQcm9maWxlIG9iamVjdFxyXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHVpZCkge1xyXG4gICAgICAgIHZhciBwcm9maWxlUmVmID0gZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoJ3VzZXJzLycgKyB1aWQpO1xyXG4gICAgICAgIHJldHVybiAkZmlyZWJhc2VPYmplY3QocHJvZmlsZVJlZik7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgXSlcclxuXHJcbiAgLmNvbnRyb2xsZXIoJ2FjY291bnQubWFuYWdlJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ19wcm9maWxlJywgJ2N1cnJlbnRBdXRoJyxcclxuICAgIGZ1bmN0aW9uICgkc2NvcGUsICRyb3V0ZVBhcmFtcywgUHJvZmlsZSwgY3VycmVudEF1dGgpIHtcclxuICAgICAgdmFyIHVzZXIgPSBmaXJlYmFzZS5hdXRoKCkuY3VycmVudFVzZXI7XHJcbiAgICAgIC8vIGNyZWF0ZSBhIHRocmVlLXdheSBiaW5kaW5nIHRvIG91ciBQcm9maWxlIGFzICRzY29wZS5wcm9maWxlXHJcbiAgICAgIF9wcm9maWxlKHVzZXIudWlkKS4kYmluZFRvKCRzY29wZSwgJ3Byb2ZpbGUnKTtcclxuICAgIH1cclxuICBdKTtcclxuXHJcblxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwJylcclxuICAgIC5mYWN0b3J5KCdfYWNjb3VudCcsIGFjY291bnRTZXJ2aWNlKTtcclxuXHJcbiAgYWNjb3VudFNlcnZpY2UuJGluamVjdCA9IFsnJGxvY2F0aW9uJywgJyRyb290U2NvcGUnLCAnJGZpcmViYXNlQXV0aCddO1xyXG5cclxuICBmdW5jdGlvbiBhY2NvdW50U2VydmljZSgkbG9jYXRpb24sICRyb290U2NvcGUsICRmaXJlYmFzZUF1dGgpIHtcclxuICAgIHZhciBzZXJ2aWNlID0ge307XHJcbiAgICB2YXIgYXV0aCA9IGZpcmViYXNlLmF1dGgoKTtcclxuICAgIHZhciBkYiA9IGZpcmViYXNlLmRhdGFiYXNlKCk7XHJcbiAgICB2YXIgYW1PbmxpbmUgPSBkYi5yZWYoJy5pbmZvL2Nvbm5lY3RlZCcpO1xyXG4gICAgc2VydmljZS5hdXRoID0ge307XHJcblxyXG4gICAgLy9Jbml0IGF1dGggd2F0Y2hlciAgICBcclxuICAgICRmaXJlYmFzZUF1dGgoKS4kb25BdXRoU3RhdGVDaGFuZ2VkKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgIGlmICh1c2VyKSB7XHJcblxyXG4gICAgICAgIHZhciB1c2VyUmVmID0gZGIucmVmKCd1c2Vycy8nICsgdXNlci51aWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHVzZXJSZWYub25jZSgndmFsdWUnLCBmdW5jdGlvbiAodXNlclNuYXApIHtcclxuICAgICAgICAgIHZhciBpc05ld1VzZXIgPSAhdXNlclNuYXAuZXhpc3RzKCk7XHJcbiAgICAgICAgICBpZiAoaXNOZXdVc2VyKSB7XHJcbiAgICAgICAgICAgIHVzZXIucHJvdmlkZXJEYXRhLmZvckVhY2goZnVuY3Rpb24gKHByb2ZpbGUpIHtcclxuICAgICAgICAgICAgICBpZiAocHJvZmlsZS5wcm92aWRlcklkID09ICdmYWNlYm9vay5jb20nKSB7XHJcbiAgICAgICAgICAgICAgICB1c2VyUmVmLnNldCh7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHByb2ZpbGUuZGlzcGxheU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgIGVtYWlsOiBwcm9maWxlLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICBwaG90b1VSTDogcHJvZmlsZS5waG90b1VSTFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmF1dGgubmFtZSA9IHByb2ZpbGUuZGlzcGxheU5hbWU7XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmF1dGguZW1haWwgPSBwcm9maWxlLmVtYWlsO1xyXG4gICAgICAgICAgICAgICAgc2VydmljZS5hdXRoLnBob3RvVVJMID0gcHJvZmlsZS5waG90b1VSTDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9TbyB0aGF0IHdlIGxvYWQgdGhlIHVzZXJzIHNhdmVkIGNoYW5nZXMgd2hlbiB0aGV5IGxvZ2luLCBhbmQgbm90IG92ZXJ3cml0ZSB0aGVtIHdpdGggcHJvdmlkZXIgdmFsdWVzXHJcbiAgICAgICAgICAgIHZhciBwcm9maWxlID0gdXNlclNuYXAudmFsKCk7XHJcbiAgICAgICAgICAgIHNlcnZpY2UuYXV0aC5uYW1lID0gcHJvZmlsZS5uYW1lO1xyXG4gICAgICAgICAgICBzZXJ2aWNlLmF1dGguZW1haWwgPSBwcm9maWxlLmVtYWlsOyBcclxuICAgICAgICAgICAgc2VydmljZS5hdXRoLnBob3RvVVJMID0gcHJvZmlsZS5waG90b1VSTDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIHByZXNlbmNlUmVmID0gZGIucmVmKCdwcmVzZW5jZS8nICsgdXNlci51aWQpO1xyXG4gICAgICAgIGFtT25saW5lLm9uKCd2YWx1ZScsIGZ1bmN0aW9uIChzbmFwc2hvdCkge1xyXG4gICAgICAgICAgaWYgKHNuYXBzaG90LnZhbCgpKSB7XHJcbiAgICAgICAgICAgIHByZXNlbmNlUmVmLm9uRGlzY29ubmVjdCgpLnNldChmaXJlYmFzZS5kYXRhYmFzZS5TZXJ2ZXJWYWx1ZS5USU1FU1RBTVApO1xyXG4gICAgICAgICAgICBwcmVzZW5jZVJlZi5zZXQodHJ1ZSk7IFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnc3ZjOiB1c2VyIGxvZ2dlZCBpbicpO1xyXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3N2Yzogbm90IGxvZ2dlZCBpbicpO1xyXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy9Mb2dvdXQgICAgXHJcbiAgICBzZXJ2aWNlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJGZpcmViYXNlQXV0aCgpLiRzaWduT3V0KCk7XHJcbiAgICAgIHNlcnZpY2UuYXV0aCA9IHt9O1xyXG4gICAgICByZXR1cm4gc2VydmljZS5hdXRoO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxuICB9XHJcblxyXG59KSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyBhdXRoLmdldFJlZGlyZWN0UmVzdWx0KCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbi8vICAgaWYgKHJlc3VsdC5jcmVkZW50aWFsKSB7XHJcbi8vICAgICB2YXIgdG9rZW4gPSByZXN1bHQuY3JlZGVudGlhbC5hY2Nlc3NUb2tlbjsgLy9GYWNlYm9vayBBY2Nlc3MgdG9rZW5cclxuLy8gICB9XHJcbi8vIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4vLyAgIHZhciBlcnJvckNvZGUgPSBlcnJvci5jb2RlO1xyXG4vLyAgIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xyXG4vLyAgIHZhciBlbWFpbCA9IGVycm9yLmVtYWlsO1xyXG4vLyAgIHZhciBjcmVkZW50aWFsID0gZXJyb3IuY3JlZGVudGlhbDsgICAgLy8gVGhlIGZpcmViYXNlLmF1dGguQXV0aENyZWRlbnRpYWwgdHlwZSB0aGF0IHdhcyB1c2VkLlxyXG4vLyB9KTtcclxuXHJcblxyXG4vLyBzYXZlIHRoZSB1c2VyJ3MgcHJvZmlsZSBpbnRvIHRoZSBkYXRhYmFzZSBzbyB3ZSBjYW4gbGlzdCB1c2VycyxcclxuLy8gdXNlIHRoZW0gaW4gU2VjdXJpdHkgYW5kIEZpcmViYXNlIFJ1bGVzLCBhbmQgc2hvdyBwcm9maWxlc1xyXG4vLyBmdW5jdGlvbiBnZXROYW1lKHVzZXIpIHtcclxuLy8gICBzd2l0Y2ggKHVzZXIucHJvdmlkZXIpIHtcclxuLy8gICAgIGNhc2UgJ3Bhc3N3b3JkJzpcclxuLy8gICAgICAgcmV0dXJuIHVzZXIucGFzc3dvcmQuZW1haWwucmVwbGFjZSgvQC4qLywgJycpO1xyXG4vLyAgICAgY2FzZSAndHdpdHRlcic6XHJcbi8vICAgICAgIHJldHVybiB1c2VyLnR3aXR0ZXIuZGlzcGxheU5hbWU7XHJcbi8vICAgICBjYXNlICdmYWNlYm9vayc6XHJcbi8vICAgICAgIHJldHVybiB1c2VyLmZhY2Vib29rLmRpc3BsYXlOYW1lO1xyXG4vLyAgIH1cclxuLy8gfVxyXG4iXX0=
