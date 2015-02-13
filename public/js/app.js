var app = angular.module('students', [])
    .config(function($routeProvider) {
    $routeProvider.
        when('/', {controller:HomeCtrl, templateUrl:'public/views/home.html'}).
        when('/login', {controller:LoginCtrl, templateUrl:'public/views/login.html'}).
        otherwise({redirectTo:'/'});
});

function HomeCtrl($scope) {

}

function LoginCtrl($scope) {

}