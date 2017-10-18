'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
    .controller('HomeCtrl', ['UserService','$location', function (User, $location) {
		var vm = this;

		if(!User.checkLoggedIn()) {
			$location.path('/login');
		}

		vm.is_poc = User.isPOC();
		vm.is_fc = User.isFC();
		vm.manager = 'Coach';
		if(vm.is_fc) vm.manager = 'National Account';
		else if(vm.is_poc) vm.manager = 'Finance Fellow';

		vm.approve = true;
		// var params = $location.search();
		// if(params.approve != null) {
		// 	vm.approve = params.approve;
		// }

    }]);
