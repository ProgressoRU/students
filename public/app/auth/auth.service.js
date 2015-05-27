(function () {
    'use strict';

    angular
        .module('students')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['DataService', 'SessionService', '$rootScope'];

    function AuthService(DataService, SessionService, $rootScope) {
        var service = {
            checkAuth: checkAuth,
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout,
            restoreSession: restoreSession
        };

        return service;
        //////////////////////////////////////////////////
        function checkAuth() {
            return DataService
                .send('api/user/checkAuth')
                .error(function () {
                    $rootScope.$broadcast('authFailure');
                    logout();
                })
        }

        function restoreSession() {
            return DataService
                .send('api/user/restore')
                .success(function (data) {
                    SessionService.create(data.user[0].user_id, data.user[0].username, data.user[0].surname, data.user[0].name,
                        data.user[0].patronymic, data.user[0].group, data.user[0].role);
                    return data
                })
                .error(function () {
                    $rootScope.$broadcast('authFailure');
                })

        }

        function login(credentials) {
            return DataService
                .send('api/user/auth', credentials)
                .success(function (data) {
                    //создаем сессии, если ответ от сервера положительный
                    SessionService.create(data.user[0].user_id, data.user[0].username, data.user[0].surname, data.user[0].name,
                        data.user[0].patronymic, data.user[0].group, data.user[0].role);
                    //console.log('Session'+SessionService);
                    $rootScope.$broadcast('authSuccess');
                    return data;
                })
        }

        function isAuthenticated() {
            //приводим Session.UserId к bool, чтобы проверить существует ли сессия
            return !!SessionService.userId;
        }

        function logout() {
            return DataService
                .send('api/user/logout')
                .success(function () {
                    SessionService.destroy();
                    $rootScope.$broadcast('authFailure');
                });
        }
    }
})();