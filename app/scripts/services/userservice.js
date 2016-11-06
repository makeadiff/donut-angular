'use strict';

/**
 * @ngdoc service
 * @name donutApp.UserService
 * @description
 * # UserService
 * Factory in the donutApp.
 */
angular.module('donutApp')
  .factory('UserService', ['$localStorage',function ($localStorage) {
		var user = {};

		user.setLoggedIn = function(user_data){
			$localStorage.user_id = user_data.id;
			$localStorage.user = user_data;
			$localStorage.loggedIn = true;
		};

		user.checkLoggedIn = function(){
			return $localStorage.loggedIn;
		};

		user.getUserId = function(){
			return $localStorage.user_id;
		};

		user.getUserName = function(){
			if(typeof $localStorage.user == "undefined") return false;
			return $localStorage.user.name;
		};

		user.isPOC = function() {
			for(var role in $localStorage.user.roles) {
				if(role == 9) {return true;}
			}

			return false;
		};

		user.isFC = function() {
			for(var role in $localStorage.user.roles) {
				if(role == 8) {return true;}
			}

			return false;
		};

		user.unsetLoggedIn = function(){
			$localStorage.user_id = 0;
			$localStorage.user = {};
			$localStorage.loggedIn = false;
			return true;
		};

		return user;
  }]);
