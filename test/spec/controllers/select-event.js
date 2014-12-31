'use strict';

describe('Controller: SelectEventCtrl', function () {

  // load the controller's module
  beforeEach(module('donutApp'));

  var SelectEventCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SelectEventCtrl = $controller('SelectEventCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
