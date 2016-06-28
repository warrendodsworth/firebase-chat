(function () {
  'use strict';

  angular
    .module('app')
    .controller('account.Login', LoginController);

  LoginController.$inject = ['$scope', '$location', '$firebaseAuth', 'AccountService'];

  function LoginController($scope, $location, $firebaseAuth, AccountService) {
    var vm = $scope;
    var auth = firebase.auth();
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email,user_likes');

    vm.facebookLogin = function () {
      $firebaseAuth().$signInWithRedirect(provider);
    };
  }
})();


