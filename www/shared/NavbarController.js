(function () {
  'use strict';

  angular
    .module('app')
    .controller('navbarController', ['$scope', '$location', 'accountService', navbarController]);

  function navbarController($scope, $location, accountService) {
    var ref = new Firebase('https://dazzling-fire-5094.firebaseio.com');
    var vm = $scope;

    ref.onAuth(function (authData) {
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