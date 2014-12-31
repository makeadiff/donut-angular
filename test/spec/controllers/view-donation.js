'use strict';

describe('Controller: ViewDonationCtrl', function () {

  // load the controller's module
  beforeEach(module('donutApp'));

  var ViewDonationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewDonationCtrl = $controller('ViewDonationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
