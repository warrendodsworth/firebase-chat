(function () {
  'use strict';

  angular
    .module('app')
    .controller('shared.Navbar', navbarController);

  navbarController.$inject = ['$scope', '$location', '_account'];

  function navbarController($scope, $location, _account) {
    var vm = $scope;
    vm.navCollapse = true;
    vm.auth = _account.auth;

    vm.logout = function () {
      vm.auth = AccountService.logout();
      $location.path('/');
    };    
  }
})();

