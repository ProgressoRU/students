var stDirectives = angular.module('stDirectives', []);

stDirectives.directive('stHeader', function () {
    return {
        templateUrl: 'public/views/header.html'
    };
});

stDirectives.directive('loginDialog', function (AUTH_EVENTS) {
    return {
        restrict: 'A',
        template: '<div data-ng-if="visible" data-ng-include="\'public/views/login.html\'">',
        link: function (scope) {
            var showDialog = function () {
                scope.visible = true;
            };

            scope.visible = false;
            scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
            scope.$on(AUTH_EVENTS.sessionTimeout, showDialog)
        }
    };
});
