(function () {
  'use strict';

  angular
    .module('app')
    .controller('shared.Navbar', NavbarController);

  NavbarController.$inject = ['$scope', '$location', 'AccountService'];

  function NavbarController($scope, $location, AccountService) {
    var vm = $scope;
    vm.navShow = false;
    vm.auth = AccountService.auth;

    vm.logout = function () {
      vm.auth = AccountService.logout();
      $location.path('/');
    };

    
  }
})();

