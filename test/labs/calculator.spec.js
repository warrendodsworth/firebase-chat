/// <reference path="../../typings/index.d.ts" />

xdescribe('calculator', function () {
  beforeEach(module('app'));
 
  var $controller;
  var service;
  beforeEach(inject(function (_$controller_, CalculateService) {
    $controller = _$controller_;

    service = CalculateService;
  }));

  describe('defaults', function () {
    it('should have default value of zero', function () {
      var $scope = {};
      var controller = $controller('CalculatorController', { $scope: $scope });
      expect($scope.z).toBe(0);
    });
  });

  describe('operations', function () {
    it('1 + 1 should equal 2', function () {
      var $scope = {};
      var controller = $controller('CalculatorController', { $scope: $scope });
      $scope.sum(1, 2);
      expect($scope.z).toBe(3);
    });

    //test service
    it('1 * 1 should equal 1', function () {
      var result = service.multiply(2, 4);
      expect(result).toBe(8);
    });
  });

});


// Get the service from the injector - short used above
// angular.mock.inject(function GetDependencies(CalculateService) {
//   service = CalculateService;
// });