(function () {
  'use strict';

  angular
    .module('app')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$scope', '$firebaseAuth', '$location', 'accountService'];

  function loginCtrl($scope, $firebaseAuth, $location, accountService) {
    var ref = new Firebase('https://dazzling-fire-5094.firebaseio.com');
    var vm = $scope;

    vm.facebookLogin = function () {
      ref.authWithOAuthPopup('facebook', function (error, authData) {
        if (authData) {
          console.log("User " + authData.uid + " is logged in with " + authData.provider);
          $scope.$apply(function () {
            $location.path('/');
          });  
        } else {
          console.log("User is logged out");
        }
      }, {
          remember: "default", //sessionOnly
          scope: "email,user_likes"
        });
    };
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