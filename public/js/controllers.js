var stCtrls = angular.module('stCtrls',[]);

stCtrls.controller('HomeCtrl',['$scope', function($scope){
}
    ]);

stCtrls.controller('HeaderCtrl',['$scope','$http',
    function($scope,$http) {
        $http.get('api/courses/all').success(function(data){
            $scope.courses=data.courses;
        })
             $http.get('api/classes/all').success(function(data){
            $scope.classes=data.classes;
        })   
    }]);

stCtrls.controller('NewsCtrl',['$scope','$http',
    function($scope,$http) {
        $http.get('api/news/all').success(function(data){
            $scope.news=data.news;
        })  
    }]);


/*
function HomeCtrl($scope, $http) {
$http({method: 'GET', url: 'api/courses/all'}).success(function(data) {
            $scope.courses = data.courses;
            console.log($scope.courses);
        })};
    
$http({method: 'GET', url: 'api/classes/all'}).success(function(data) {
            $scope.classes = data.classes;
            console.log($scope.classes);
        });
    }

function LoginCtrl($scope) {

} */