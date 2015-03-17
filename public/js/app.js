var app = angular.module('students', ['ngRoute', 'stServices', 'stControllers', 'stDirectives','stFilters', 'ui.bootstrap','ui.calendar'])
//роутинг
    .config(function ($routeProvider) {
        $routeProvider.
            when('/news',
            {
                controller: 'HomeCtrl',
                templateUrl: 'public/views/home.html'
            }).
            when('/login', {
                controller: 'LoginModalCtrl',
                templateUrl: 'public/views/login.html'
            }).
            when('/class/:disciplineID', {
                controller: 'DisciplineCtrl',
                templateUrl: 'public/views/discipline.html'
            }).
            otherwise({redirectTo: '/news'});

    })

    .run(function ($rootScope, AUTH_EVENTS, AuthService) {
        $rootScope.$on('$routeChangeStart', function (event, next) {
            //проверяем авторизацию при каждом переходе
            AuthService.login().then(function (user) {
                $reply = user.status;
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