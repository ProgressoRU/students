(function () {
    'use strict';

    angular
        .module('students')
        .directive('loginDialog', loginDialog);

    loginDialog.$inject = ['AUTH_EVENTS'];

    function loginDialog(AUTH_EVENTS) {
        return {
            restrict: 'A',
            templateUrl: 'public/app/auth/auth.html',
            controller: 'AuthController',
            controllerAs: 'auth',
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
        }
    }
})();