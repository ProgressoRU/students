var stDirectives = angular.module('stDirectives', []);

stDirectives.directive('stHeader', function () {
    return {
        templateUrl: 'public/views/header.html'
    };
});

stDirectives.directive('loginDialog', function (AUTH_EVENTS) {
    return {
        restrict: 'A',
        template: '<div data-ng-class="{show: visible, hide:!visible}" class="modal" data-ng-if="visible" data-ng-include="\'public/views/login.html\'">',
        link: function (scope) {
            var showDialog = function () {
                scope.visible = true;
            };
            var hideDialog = function () {
                scope.visible = false;
            };

            scope.visible = false;
            scope.$on(AUTH_EVENTS['403'], showDialog);
            scope.$on(AUTH_EVENTS['200'], hideDialog);
        }
    };
});
