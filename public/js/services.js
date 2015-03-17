var stServices = angular.module('stServices', []);
//обертка для всех запросов
stServices.service('serviceData', ['$http', '$q', function ($http, $q) {
    return {
        get: function (url, param) {
            return $http.post(url, param)
                .then(function (response) {
                    //console.log(response);
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function (response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        }
    }

}]);

stServices.factory('AuthService', ['serviceData', '$location', 'Session', function (serviceData, $location, Session) {

    var authService = {};

    authService.login = function (credentials) {
        return serviceData
            .get('api/user/auth', credentials)
            .then(function (data) {
                //создаем сессии, если ответ от сервера положительный
                if (data.status == 200) {
                    Session.create(data.user[0].user_id, data.user[0].username, data.user[0].surname, data.user[0].name,
                        data.user[0].patronymic, data.user[0].group_id, data.user[0].role, data.user[0].course_id);
                    //console.log(Session);
                    return data;
                }
                else return data;
            })
    };

    authService.isAuthenticated = function () {
        //приводим Session.UserId к bool, чтобы проверить существует ли сессия
        return !!Session.userId;
    };

    authService.logout = function () {
        return serviceData
            .get('api/user/logout')
            .then(function (data) {
                //console.log(data);
                if (data.status == true) {
                    Session.destroy();
                    //console.log('Session' + Session);
                }
            });
    };

    return authService;
}]);

stServices.factory('alertService', function($rootScope) {
    var alertService = {};

    // create an array of alerts available globally
    $rootScope.alerts = [];

    alertService.add = function(type, msg) {
        $rootScope.alerts.push({'type': type, 'msg': msg});
    };

    alertService.closeAlert = function(index) {
        $rootScope.alerts.splice(index, 1);
    };

    return alertService;
});

stServices.service('Session', [function () {
    //создание сессии
    this.create = function (userId, userName, surname, name, patronymic, group, userRole, course) {
        this.userId = userId;
        this.userName = userName;
        this.surname = surname;
        this.name = name;
        this.patronymic = patronymic;
        this.group = group;
        this.userRole = userRole;
        this.course = course;
    };
    //уничтожение сессии
    this.destroy = function () {
        this.userId = null;
        this.userName = null;
        this.surname = null;
        this.name = name;
        this.patronymic = null;
        this.group = null;
        this.userRole = null;
        this.course = null;
    };
    return this;
}]);

stServices.constant('AUTH_EVENTS', {
    //возможные события авторищации
    200: 'OK',
    401: 'Unauthorized',
    403: 'Forbidden'
});
