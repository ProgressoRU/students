var app = angular.module('students', ['ngRoute','stServices', 'stControllers', 'stDirectives','ui.bootstrap'])

    .config(function($routeProvider) {
    $routeProvider.
        when('/news',
        {
            controller: 'HomeCtrl',
            templateUrl:'public/views/home.html'
        }).
        when('/login', {
            controller: 'LoginModalCtrl',
            templateUrl:'public/views/login.html'
        }).
        when('/class/:classID', {
            controller : 'ClassCtrl',
            templateUrl : 'public/views/class.html',
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
});