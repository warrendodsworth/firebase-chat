(function () {
  angular
    .module('app')
    .service('CalculateService', function CalculateService() {
      var service = {};

      service.multiply = function (a, b) {
        return a * b;
      };

      return service;
    })
    .controller('CalculatorController', function CalculatorController($scope) {
      $scope.text = 'Hello World!';
      $scope.z = 0;

      $scope.sum = function (a, b) {
        $scope.z = a + b;
      };

    });
})();