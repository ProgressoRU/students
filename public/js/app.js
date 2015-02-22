var app = angular.module('students', ['ngRoute','stServices', 'stControllers', 'stDirectives','ui.bootstrap'])

    .config(function($routeProvider, USER_ROLES) {
    $routeProvider.
        when('/news',
        {
            controller: 'HomeCtrl',
            templateUrl:'public/views/home.html',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.student]
                }
        }).
        when('/login', {
            controller: 'LoginModalCtrl',
            templateUrl:'public/views/login.html',
            data:
            {
                authorizedRoles: []
            }
        }).
        when('/class/:classID', {
            controller : 'ClassCtrl',
            templateUrl : 'public/views/class.html',
            data: {
              authorizedRoles: [USER_ROLES.admin, USER_ROLES.student]
            },
            resolve: {
                courses: ['serviceData', '$route', function(serviceData, $route) {
                    return serviceData.get('api/classes/info', { id : $route.current.params.classID }) //classesAPI call
                        .then(function(data) {
                            return data.status == 1 ? data.lectures : [];
                        });
                }]
            }
        }).
        otherwise({redirectTo:'/news'});
})

.config(function ($httpProvider) {
    $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
            return $injector.get('AuthInterceptor');
        }
    ]);
})

    .run(function ($rootScope, AUTH_EVENTS, AuthService) {
        $rootScope.$on('$routeChangeStart', function (event, next) {
            var authorizedRoles = next.data.authorizedRoles;
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                if (AuthService.isAuthenticated()) {
                    // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
        });
    })

    .factory('AuthInterceptor', function ($rootScope, $q,
                                          AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized,
                    419: AUTH_EVENTS.sessionTimeout,
                    440: AUTH_EVENTS.sessionTimeout
                }[response.status], response);
                return $q.reject(response);
            }
        };
    });