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

  navbarController.$inject = ['$scope', '$rootScope', '$location', '_account'];

  function navbarController($scope, $rootScope, $location, _account) {
    var vm = $scope;
    vm.isNavCollapsed = true;

    vm.$on('login', function (e, a) {
      vm.auth = _account.auth;
    })

    vm.logout = function () {
      vm.auth = _account.logout();
      $location.path('/');
    };
  }

})();