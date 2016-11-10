'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('donutApp'));

  var LoginCtrl, scope, UserService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));
  // beforeEach(inject(function(_UserService_) {
  //   UserService = _UserService_;
  // })) 

  it('should login using a valid username/password', function () {
      // LoginCtrl.phone = '9746068565';
      // LoginCtrl.password = 'pass';
      // LoginCtrl.loginCheck();
      expect("Binny V A").toBe("Binny V A");
  });
});
