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


        user.setLoggedIn = function(user_id){
            $localStorage.user_id = user_id;
            $localStorage.loggedIn = true;
        }

        user.checkLoggedIn = function(){
            return $localStorage.loggedIn;
        }

        user.getUserId = function(){
            return $localStorage.user_id;
        }

        user.unsetLoggedIn = function(){
            $localStorage.user_id = 0;
            $localStorage.loggedIn = false;
        }


        return user;
  }]);
