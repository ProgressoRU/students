var stDirectives = angular.module('stDirectives', []);

stDirectives.directive('stHeader', function () {
    return {
        templateUrl: 'public/views/header.html'
    };
});

stDirectives.directive('loginDialog', function (AUTH_EVENTS) {
    return {
        restrict: 'A',
        template: '<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginLabel" aria-hidden="true" data-ng-if="visible" data-ng-include="\'public/views/login.html\'">',
        controller: 'LoginModalCtrl',
        link: function (scope) {
            var showDialog = function () {
                scope.visible = true;
                $('#loginModal').modal({
                    backdrop: 'static',
                    keyboard: false,
                    show: true
                });
            };
            var hideDialog = function () {
                scope.visible = false;
                $('loginModal').hide();
            };

            scope.visible = false;
            scope.$on(AUTH_EVENTS['403'], showDialog);
            scope.$on(AUTH_EVENTS['200'], hideDialog);
        }
    };
});
