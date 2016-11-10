'use strict';

/**
 * @ngdoc function
 * @name donutApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the donutApp
 */
angular.module('donutApp')
  .controller('LoginCtrl', ['$http','$scope','$rootScope','$mdToast','UserService','$location',function($http,$scope,$rootScope,$mdToast,User, $location){
		var loginCtrl = this;

		loginCtrl.login = {};
		loginCtrl.login_invalid = false;
		loginCtrl.error_message = "";
		loginCtrl.is_processing = false;

		loginCtrl.loginCheck = function() {
			loginCtrl.is_processing = true;

			$http({
				method: 'POST',
				url: $rootScope.base_url + 'user/login',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: $rootScope.transformRequest,
				data: {phone: loginCtrl.login.phone, password: loginCtrl.login.password, format: 'xml'}
			}).success(function (data) {
				if(data.error) {
					loginCtrl.is_processing = false;
					User.unsetLoggedIn();
					loginCtrl.login_invalid = true;
					loginCtrl.error_message = data.error;
					loginCtrl.login = {};

				} else {
					loginCtrl.is_processing = false;
					User.setLoggedIn(data.user);

					$location.path('/');
				}

			}).error(function(data){
				User.unsetLoggedIn();
			});
		};
}]);
