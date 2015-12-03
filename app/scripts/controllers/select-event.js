'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:SelectEventCtrl
 * @description
 * # SelectEventCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('SelectEventCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
