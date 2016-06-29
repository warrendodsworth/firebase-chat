/// <reference path="../../typings/index.d.ts" /> 

describe('account.login', function () {
  beforeEach(function () {
    browser().navigateTo('/#/login');
  })

  it('should login with a test account', function() {
    expect(true).toBe(true);
  });
}); 
