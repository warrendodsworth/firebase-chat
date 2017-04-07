(function () {
  'use strict';

  angular
    .module('app')
    .directive('navbar', navbarDirective)
    .controller('navbarController', navbarController);

  function navbarDirective() {
    return {
      restrict: 'E',
      controller: navbarController,
      templateUrl: '/www/shared/navbar.html',
    };
  }

  navbarController.$inject = ['$scope', '$location', '_account'];

  function navbarController($scope, $location, _account) {
    var vm = $scope;
    vm.navCollapse = true;
    vm.auth = _account.auth;

    vm.logout = function () {
      vm.auth = _account.logout();
      $location.path('/');
    };
  }

})();