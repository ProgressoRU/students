(function () {
    'use strict';

    angular
        .module('students', [
            //Dependencies:
            //angular modules
            'ngAnimate',
            'ngRoute',
            //app modules
            'alerts',
            'editor',
            //3rd party
            'angular-loading-bar',
            'ui.bootstrap',
            'ui.calendar'
        ])
        //роутинг
        .config(function ($routeProvider) {
            $routeProvider.
                when('/news',
                {
                    controller: 'NewsController',
                    templateUrl: 'public/app/news/news.html',
                    controllerAs: 'news'
                }).
                when('/login', {
                    controller: 'AuthController',
                    templateUrl: 'public/app/auth/auth.html',
                    controllerAs: 'auth'
                }).
                when('/class/:disciplineId', {
                    controller: 'DisciplineController',
                    templateUrl: 'public/app/disciplines/discipline.html',
                    controllerAs: 'vm'
                }).
                when('/class/edit/:disciplineId', {
                    controller: 'DisciplineEditController',
                    templateUrl: 'public/app/disciplines/disciplineEdit.html',
                    controllerAs: 'vm'
                }).
                when('/group/:groupId', {
                    controller: 'GroupController',
                    templateUrl: 'public/app/groups/group.html',
                    controllerAs: 'vm',
                    resolve: { //todo: рефакторинг
                        getDisciplines: function (DisciplineService) {
                            return DisciplineService.get();
                        },
                        getDetails: function (GroupService, $route) {
                            return GroupService.getDetails($route.current.params.groupId);
                        },
                        getGroupAccess: function (GroupService, $route) {
                            return GroupService.getGroupAccess($route.current.params.groupId);
                        },
                        getSubscribers: function (GroupService, $route) {
                            return GroupService.getSubscribers($route.current.params.groupId);
                        }
                    }
                }).
                when('/users', {
                    controller: 'UserRightsController',
                    templateUrl: 'public/app/userRights/userRights.html',
                    controllerAs: 'vm'
                }).
                otherwise({redirectTo: '/news'});
        })

        .run(function ($rootScope, AuthService) {
            AuthService.restoreSession();
            $rootScope.$on('$routeChangeStart', function (event, next) {
                //проверяем авторизацию при каждом переходе
                AuthService.checkAuth().error(function () {
                    event.preventDefault();
                })
            });
        });
})();