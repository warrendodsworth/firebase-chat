/// <reference path="../../typings/index.d.ts" />

describe('calculator', function () {
  beforeEach(module('calculatorApp'));

  var $controller;

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
  }));

  describe('defaults', function () {
    it('should have default value of zero', function () {
      var $scope = {};
      var controller = $controller('CalculatorController', { $scope: $scope });
      expect($scope.z).toBe(0);
    });
  });

  describe('sum', function () {
    it('1 + 1 should equal 2', function () {
      var $scope = {};
      var controller = $controller('CalculatorController', { $scope: $scope });
      $scope.sum(1, 2);
      expect($scope.z).toBe(3);
    });
  });

});