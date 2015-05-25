(function () {
    'use strict';

    angular
        .module('students')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['DataService', '$location', 'SessionService'];

    function AuthService(DataService, $location, SessionService) {
        var service = {
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout
        };

        return service;
        /////////////////////
        function login(credentials) {
            return DataService
                .get('api/user/auth', credentials)
                .then(function (data) {
                    //создаем сессии, если ответ от сервера положительный
                    if (data.status == 200) {
                        SessionService.create(data.user[0].user_id, data.user[0].username, data.user[0].surname, data.user[0].name,
                            data.user[0].patronymic, data.user[0].group, data.user[0].role);
                        //console.log('Session'+SessionService);
                        return data;
                    }
                    else return data;
                })
        }

        function isAuthenticated() {
            //приводим Session.UserId к bool, чтобы проверить существует ли сессия
            return !!SessionService.userId;
        }

        function logout() {
            return DataService
                .get('api/user/logout')
                .then(function (data) {
                    //console.log(data);
                    if (data.status == true) {
                        SessionService.destroy();
                        $location.path('/');
                        //console.log('Session' + SessionService);
                    }
                });
        }
    }
})();