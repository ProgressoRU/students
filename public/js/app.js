var app = angular.module('students', ['ngRoute','stSrvc', 'stCtrls', 'stDrctv'])
    .config(function($routeProvider) {
    $routeProvider.
        when('/', {controller: 'HomeCtrl', templateUrl:'public/views/home.html'}).
        when('/login', {controller: 'LoginCtrl', templateUrl:'public/views/login.html'}).
        when('/class/:classID', {
            controller : 'ClassCtrl',
            templateUrl : 'public/views/class.html',
            resolve: {
                courses: ['srvcData', '$route', function(srvcData, $route) {
                    return srvcData.get('api/classes/info', { id : $route.current.params.classID }) //classesAPI call
                        .then(function(data) {
                            return data.status == 1 ? data.lectures : [];
                        });
                }]
            }
        }).
        otherwise({redirectTo:'/'});
});
