(function () {
  'use strict';

  angular
    .module('app')
    .controller('account.Login', LoginController);

  LoginController.$inject = ['$scope', '$location', 'AccountService'];

  function LoginController($scope, $location, AccountService) {

    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email,user_likes');
    var auth = firebase.auth();
    var vm = $scope;

    vm.facebookLogin = function () {
      auth.signInWithRedirect(provider);

      auth.getRedirectResult().then(function (result) {
        if (result.credential) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
        }
       
        var user = result.user;
        console.log(user);

        $scope.$apply(function () {
          $location.path('/');
        });
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
    };

  }
})();