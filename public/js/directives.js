var stDirectives = angular.module('stDirectives', []);

//шапка
stDirectives.directive('stHeader', function () {
    return {
        templateUrl: 'public/views/header.html'
    };
});

//модальное окно авторизации
stDirectives.directive('loginDialog', function (AUTH_EVENTS) {
    return {
        restrict: 'A',
        templateUrl: 'public/views/login.html',
        controller: 'LoginModalCtrl',
        link: function (scope) {
            //показать модальное окно
            var showDialog = function () {
                scope.visible = true;
                $('#loginModal').modal({
                    backdrop: 'static',
                    keyboard: false,
                    show: true
                });
            };
            //скрыть модальное окно
            var hideDialog = function () {
                scope.visible = false;
                $('#loginModal').modal('hide');
            };
            scope.visible = false;
            //Действия при получении оповещений
            scope.$on(AUTH_EVENTS['403'], showDialog);
            scope.$on(AUTH_EVENTS['200'], hideDialog);
        }
    };
});
