var app = angular.module('students', [])
    .config(function($routeProvider) {
    $routeProvider.
        when('/', {controller:HomeCtrl, templateUrl:'public/views/home.html'}).
        when('/login', {controller:LoginCtrl, templateUrl:'public/views/login.html'}).
        otherwise({redirectTo:'/'});
});

function HomeCtrl($scope, $http) {
$http({method: 'GET', url: 'api/courses/all'}).success(function(data) {
            $scope.courses = data;
            console.log($scope.courses);
        });
    };

function LoginCtrl($scope) {

}