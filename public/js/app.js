var app = angular.module('students', ['ngRoute', 'stCtrls'])
    .config(function($routeProvider) {
    $routeProvider.
        when('/', {controller: 'HomeCtrl', templateUrl:'public/views/home.html'}).
        when('/login', {controller: 'LoginCtrl', templateUrl:'public/views/login.html'}).
        otherwise({redirectTo:'/'});
});
