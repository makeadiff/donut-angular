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
				method: 'GET',
				url: $rootScope.base_url + 'users/login?phone=' + loginCtrl.login.phone + "&password=" + loginCtrl.login.password,
				headers: $rootScope.request_headers,
				transformRequest: $rootScope.transformRequest
			}).then(function (response) {
				loginCtrl.is_processing = false;

				if(response.status >= 200 && response.status < 300) {
					var data = response.data;

					if(data.status != 'success') {
						User.unsetLoggedIn();
						loginCtrl.login_invalid = true;
						loginCtrl.error_message = data.join(",");
						loginCtrl.login = {};

					} else {
						User.setLoggedIn(data.data.user);

						// Update name at the top right corner
						$rootScope.user_name = User.getUserName();
						if(User.isPOC()) $rootScope.user_name += "(Coach)";
						if(User.isFC()) $rootScope.user_name += "(Finance Fellow)";

						var params = $location.search();

						if(params.path != null) {
							$location.path("/" + params.path);
						}else{
							$location.path('/');
						}
					}
				} else {
					User.unsetLoggedIn();
					loginCtrl.login_invalid = true;
					loginCtrl.error_message = data.join(",");
					loginCtrl.login = {};
				}
			}, function(response) {
				loginCtrl.is_processing = false;
				User.unsetLoggedIn();
				loginCtrl.login_invalid = true;
				loginCtrl.error_message = response.data.data.join(",");
				loginCtrl.login = {};
			});
		};
}]);
