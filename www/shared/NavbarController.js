(function () {
  'use strict';

  angular
    .module('app')
    .controller('NavbarController', ['$scope', '$location', 'accountService', NavbarController]);

  function NavbarController($scope, $location, accountService) {
    var vm = $scope;

    vm.logout = function () {
      accountService.logout();
      $location.path('/');
    };

  }
})();