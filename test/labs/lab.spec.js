describe('CalculatorController test', function () {
    //we'll use this scope in our tests
    var scope; 

    //mock Application to allow us to inject our own dependencies
    beforeEach(module('app'));
  
    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(inject(function($rootScope, $controller){
        //create an empty scope
        scope = $rootScope.$new();
        //declare the controller and inject our empty scope
        $controller('CalculatorController', {$scope: scope});
    }));
  
    // tests start here
    it('should have variable text = "Hello World!"', function(){
      expect(scope.text).toBeDefined();
      expect(scope.text).toBe('Hello World!');
    });
});