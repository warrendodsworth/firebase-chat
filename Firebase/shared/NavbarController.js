(function () {
  'use strict';

  angular
    .module('app')
    .controller('NavbarController', ['$scope', '$firebaseAuth', NavbarController]);

  function NavbarController($scope, $firebaseAuth) {
    var vm = $scope;

    var ref = new Firebase('https://dazzling-fire-5094.firebaseio.com');
    var auth = $firebaseAuth(ref);

    //Set navbar user account if logged in
  }
})();