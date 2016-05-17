(function () {
  'use strict';

  angular
    .module('app')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$scope', '$firebaseAuth'];

  function loginCtrl($scope, $firebaseAuth) {
    var vm = $scope;

    // create an instance of the authentication service
    var auth = $firebaseAuth(ref);

    // login with Facebook
    vm.facebookLogin = function () {
      auth.$authWithOAuthPopup("facebook").then(function (authData) {
        console.log("Logged in as:", authData.uid);
      }).catch(function (error) {
        console.log("Authentication failed:", error);
      });
    };
  }
})();