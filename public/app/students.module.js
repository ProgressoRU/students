(function () {
    'use strict';

    angular
        .module('students', [
            //angular modules
            'ngAnimate',
            'ngRoute',
            //app modules
            'stControllers',
            'stDirectives',
            'stFilters',
            //3rd party
            'angular-loading-bar',
            'textAngular',
            'ui.bootstrap',
            'ui.calendar'
        ])
          //роутинг
        .config(function ($routeProvider) {
            $routeProvider.
                when('/news',
                {
                    controller: 'HomeCtrl',
                    templateUrl: 'public/app/layout/home.html'
                }).
                when('/login', {
                    controller: 'LoginModalCtrl',
                    templateUrl: 'public/views/login.html'
                }).
                when('/class/:disciplineID', {
                    controller: 'DisciplineCtrl',
                    templateUrl: 'public/views/discipline.html'
                }).
                when('/class/edit/:disciplineID', {
                    controller: 'DisciplineEditCtrl',
                    templateUrl: 'public/views/disciplineEdit.html'
                }).
                when('/group/:groupID', {
                    controller: 'GroupCtrl',
                    templateUrl: 'public/views/group.html'
                }).
                when('/users', {
                    controller: 'UserAccessCtrl',
                    templateUrl: 'public/views/userAccess.html'
                }).
                otherwise({redirectTo: '/news'});
        })

        .run(function ($rootScope, AUTH_EVENTS, AuthService) {
            $rootScope.$on('$routeChangeStart', function (event, next) {
                //проверяем авторизацию при каждом переходе
                AuthService.login().then(function (user) {
                    var $reply = user.status;
                    //console.log('Run: ' + $reply); //DEBUG
                    //console.log('Run: ' + AUTH_EVENTS[$reply]); //DEBUG
                    //отправляем оповещение
                    $rootScope.$broadcast(AUTH_EVENTS[$reply]);
                    //если полномочия не подтверждены, делаем принудительный выход
                    if ($reply != 200) {
                        AuthService.logout();
                    }
                });
            });
        });
})();