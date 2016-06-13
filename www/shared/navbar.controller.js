(function () {
  'use strict';

  angular
    .module('app')
    .controller('navbarController', ['$scope', '$location', 'accountService', navbarController]);

  function navbarController($scope, $location, accountService) {
    var ref = firebase.auth();
    var vm = $scope;

    ref.onAuthStateChanged(function (authData) {
      if (authData)
        $location.path('/');
      else
        $location.path('/login');
    });

    vm.logout = function () {
      accountService.logout();
      $location.path('/');
    };

  }
})();