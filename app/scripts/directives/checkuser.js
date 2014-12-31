'use strict';

/**
 * @ngdoc directive
 * @name donutApp.directive:checkUser
 * @description
 * # checkUser
 */
angular.module('donutApp')
  .directive('checkUser', ['$rootScope','$location','UserService',function($root,$location,User){
        return {

            link : function(scope,elem,attrs,ctrl) {
                $root.$on('$routeChangeStart',function(event, next, current){



                    if (next.restricted && !User.checkLoggedIn()) {



                        $location.path('/login');

                    }
                });
            }

        };
}]);
