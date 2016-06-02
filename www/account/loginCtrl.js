(function () {
  'use strict';

  angular
    .module('app')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$scope', '$firebaseAuth', '$location', 'localStorageService'];

  function loginCtrl($scope, $firebaseAuth, $location, ls) {
    var ref = new Firebase('https://dazzling-fire-5094.firebaseio.com');
    var vm = $scope;
    var isNewUser = true;

    vm.facebookLogin = function () {
      ref.authWithOAuthPopup('facebook', function (authData) {
        if (authData) {
          console.log("User " + authData.uid + " is logged in with " + authData.provider);
          $location.path('/');
        } else {
          console.log("User is logged out");
        }
      });
    };  
    
    ref.onAuth(function (authData) {
      console.log(authData);
      if (authData && isNewUser) {
        // save the user's profile into the database so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        ref.child("users").child(authData.uid).set({
          provider: authData.provider,
          name: getName(authData)
        });
      }
    });

    //Helper
    function getName(authData) {
      switch (authData.provider) {
        case 'password':
          return authData.password.email.replace(/@.*/, '');
        case 'twitter':
          return authData.twitter.displayName;
        case 'facebook':
          return authData.facebook.displayName;
      }
    }

  }
})();

// https://www.firebase.com/docs/web/libraries/angular/guide/intro-to-angularfire.html#section-angularfire-intro
// var auth = $firebaseAuth(ref);
// var authData = ls.get('authData');
// if (authData) {
//   $location.path('/');
// }
// login with Facebook
// vm.facebookLogin = function () {
//   auth.$authWithOAuthPopup("facebook")
//     .then(function (authData) {
//       ls.set('authData', authData);
//       $location.path('/');
//     })
//     .catch(function (error) {
//       console.log("Authentication failed:", error);
//     });
// };