(function () {
  'use strict';

  angular
    .module('app')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$scope', '$firebaseAuth', '$location', 'localStorageService'];

  function loginCtrl($scope, $firebaseAuth, $location, ls) {
    var vm = $scope;
    var ref = new Firebase('https://dazzling-fire-5094.firebaseio.com');

    // create an instance of the authentication service
    var auth = $firebaseAuth(ref);



    // login with Facebook
    vm.facebookLogin = function () {
      auth.$authWithOAuthPopup("facebook").then(onLogin).catch(onError);
    };

    vm.twitterLogin = function () {
      auth.$authWithOAuthPopup("twitter").then(onLogin).catch(onError);
    };

    function onLogin(authData) {
      ls.set('authData', authData);
      $location.path('/');
    }

    function onError(error) {
      console.log("Authentication failed:", error);
    }
  }
})(); 