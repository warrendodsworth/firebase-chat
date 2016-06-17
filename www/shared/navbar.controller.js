(function () {
  'use strict';

  angular
    .module('app')
    .controller('shared.Navbar', NavbarController);

  NavbarController.$inject = ['$scope', '$location', 'AccountService'];

  function NavbarController($scope, $location, AccountService) {
    var auth = firebase.auth();
    var vm = $scope;
    
    vm.navCollapse = true;

    vm.identity = AccountService.identity;

    vm.logout = function () {
      vm.identity = AccountService.logout(); 
      $location.path('/');
    };
  }
})();

