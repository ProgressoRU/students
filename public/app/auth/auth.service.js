(function () {
    'use strict';

    angular
        .module('students')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['DataService', 'SessionService', '$route'];

    function AuthService(DataService, SessionService, $route) {
        var service = {
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout
        };

        return service;
        /////////////////////
        function login(credentials) {
            return DataService
                .send('api/user/auth', credentials)
                .success(function (data) {
                    //создаем сессии, если ответ от сервера положительный
                    SessionService.create(data.user[0].user_id, data.user[0].username, data.user[0].surname, data.user[0].name,
                        data.user[0].patronymic, data.user[0].group, data.user[0].role);
                    //console.log('Session'+SessionService);
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
                    //console.log(data);
                    SessionService.destroy();
                    //$location.path('/'); //old
                    $route.reload();
                    //console.log('Session' + SessionService);
                });
        }
    }
})();