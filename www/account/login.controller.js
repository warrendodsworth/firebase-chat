(function () {
  'use strict';

  angular
    .module('app')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$scope', '$location', 'accountService'];

  function loginCtrl($scope, $location, accountService) {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email,user_likes');
    var vm = $scope;

    vm.facebookLogin = function () {
      firebase.auth().signInWithRedirect(provider);

      firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          
          $scope.$apply(function () {
            $location.path('/');
          });
        }
        // The signed-in user info.
        var user = result.user;
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    };
  }
})();