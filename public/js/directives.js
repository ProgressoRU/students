var stDirectives = angular.module('stDirectives', []);

stDirectives.directive('stHeader', function () {
    return {
        templateUrl: 'public/views/header.html'
    };
});

stDirectives.directive('loginDialog', function (AUTH_EVENTS) {
    return {
        restrict: 'A',
        templateUrl: 'public/views/login.html',
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
                $('#loginModal').modal('hide');
            };

            scope.visible = false;
            scope.$on(AUTH_EVENTS['403'], showDialog);
            scope.$on(AUTH_EVENTS['200'], hideDialog);
        }
    };
});
