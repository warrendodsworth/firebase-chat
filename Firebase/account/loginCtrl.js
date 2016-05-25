(function () {
  'use strict';

  angular
    .module('app')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$scope', '$firebaseAuth', '$location', 'localStorageService'];

  function loginCtrl($scope, $firebaseAuth, $location, ls) {
    var vm = $scope;
    var ref = new Firebase('https://dazzling-fire-5094.firebaseio.com');
    var auth = $firebaseAuth(ref);

    var authData = ls.get('authData');
    if (authData) {
      $location.path('/');
    }
    
    // login with Facebook
    vm.facebookLogin = function () {
      auth.$authWithOAuthPopup("facebook")
        .then(function (authData) {
           ls.set('authData', authData);
           $location.path('/');
         })
        .catch(function (error) {
          console.log("Authentication failed:", error);
        });
    };
  }
})();