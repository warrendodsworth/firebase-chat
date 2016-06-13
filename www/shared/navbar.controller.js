(function () {
  'use strict';

  angular
    .module('app')
    .controller('shared.Navbar', NavbarController);

  NavbarController.$inject = ['$scope', '$location', 'AccountService'];

  function NavbarController($scope, $location, AccountService) {
    var ref = firebase.auth();
    var vm = $scope;

    ref.onAuthStateChanged(function (authData) {
      if (authData)
        $location.path('/');
      else
        $location.path('/login');
    });

    vm.logout = function () {
      AccountService.logout();
      $location.path('/');
    };

  }
})();