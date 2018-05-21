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

    var user = firebase.auth().currentUser;
    if (!user) {
      $location.path('/login');
      console.log('navbar: not logged in');
    }

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        vm.user = Profile();
        $scope.$apply();
      }
      else {
        $location.path('/login');
        console.log('navbar: not logged in');
      }
    });

    vm.$on('login', function (e, a) {
      vm.auth = _account.auth;
    });

    vm.logout = function () {
      vm.auth = _account.logout();
      $location.path('/');
    };
  }

})();