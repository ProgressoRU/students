var app = angular.module('students', ['ngRoute', 'stServices', 'stControllers', 'stDirectives', 'ui.bootstrap'])

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
            when('/class/:classID', {
                controller: 'ClassCtrl',
                templateUrl: 'public/views/class.html'
            }).
            otherwise({redirectTo: '/news'});

    })

    .run(function ($rootScope, AUTH_EVENTS, AuthService) {
        $rootScope.$on('$routeChangeStart', function (event, next) {
            AuthService.login().then(function (user) {
                $reply = user.status;
                console.log('Run: ' + $reply); //DEBUG
                console.log('Run: ' + AUTH_EVENTS[$reply]); //DEBUG
                $rootScope.$broadcast(AUTH_EVENTS[$reply]);
                if ($reply != 200)
                {
                   AuthService.logout();
                }
            });
        });
    });