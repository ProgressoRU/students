var app = angular.module('students', ['ngRoute','stSrvc', 'stCtrls', 'stDrctv'])
    .config(function($routeProvider) {
    $routeProvider.
        when('/', {controller: 'HomeCtrl', templateUrl:'public/views/home.html'}).
        when('/login', {controller: 'LoginCtrl', templateUrl:'public/views/login.html'}).
        when('/class/:classID',{controller: 'ClassCtrl',templateUrl:'public/views/class.html'}).
        otherwise({redirectTo:'/'});
});
