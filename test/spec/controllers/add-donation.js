'use strict';

describe('Controller: AddDonationCtrl', function () {

  // load the controller's module
  beforeEach(module('donutApp'));

  var AddDonationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddDonationCtrl = $controller('AddDonationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
