'use strict';

/**
 * @ngdoc service
 * @name donutApp.UserService
 * @description
 * # UserService
 * Factory in the donutApp.
 */
angular.module('donutApp')
  .factory('UserService', ['$localStorage','$rootScope',function ($localStorage, $rootScope) {
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

		user.getUserCityId = function(){
			return $localStorage.user.city_id;
		};

		user.getUserName = function(){
			if(typeof $localStorage.user == "undefined") return false;
			return $localStorage.user.name;
		};

		user.isPOC = function() {
			for(var i in $localStorage.user.groups) {
				if($localStorage.user.groups[i].id == $rootScope.coach_group_id 
						|| $localStorage.user.groups[i].id == $rootScope.fr_fellow_group_id) {
					return true;
				}
			}

			return false;
		};

		user.isFC = function() {
			for(var i in $localStorage.user.groups) {
				if($localStorage.user.groups[i].id == $rootScope.finance_fellow_group_id) {return true;}
			}

			return false;
		};

		user.unsetLoggedIn = function(){
			$localStorage.user_id = 0;
			$localStorage.user = {};
			$localStorage.loggedIn = false;
			$rootScope.user_name = '';
			return true;
		};

		return user;
  }]);
