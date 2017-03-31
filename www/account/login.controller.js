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


