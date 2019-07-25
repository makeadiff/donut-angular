(function() {
    'use strict';
    var myApp = angular.module('donutApp');

    // Taken from https://www.folio3.com/blog/angularjs-file-upload-example-tutorial/

    /*
     A directive to enable two way binding of file field
     */
    myApp.directive('fileUpload', function ($parse) {
        return {
            restrict: 'A', //the directive can be used as an attribute only

            /*
             link is a function that defines functionality of directive
             scope: scope associated with the element
             element: element on which this directive used
             attrs: key value pair of element attributes
             */
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileUpload),
                    modelSetter = model.assign; //define a setter for fileUpload

                //Bind change event on the element
                element.bind('change', function () {
                    //Call apply on scope, it checks for value changes and reflect them on UI
                    scope.$apply(function () {
                        //set the model value
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    });
})();