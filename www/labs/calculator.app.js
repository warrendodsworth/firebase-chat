(function () {
  angular.module('calculatorApp', [])
    .controller('CalculatorController', function CalculatorController($scope) {
      $scope.z = 0;

      $scope.sum = function (a, b) {
        $scope.z = a + b;
      };
      
    });
})();