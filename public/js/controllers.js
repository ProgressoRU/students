var stControllers = angular.module('stControllers', []);

// Wrap controller
stControllers.controller('WrapCtrl', ['$scope', 'serviceData','$location', function ($scope, serviceData, $location) {

    $scope.$watch(function() { return $location.path(); }, function(newValue/*, oldValue*/){
        console.log($scope.loggedIn);
        if ($scope.loggedIn == false && newValue != '/login'){
            $location.path('/login');
        }
    });

    serviceData.get('api/classes/all').then(function(data) {
        $scope.classes = (data.status && data.status == 1) ? data.classes : [];
    });

}]);

stControllers.controller('HomeCtrl', ['$scope', function($scope) {

}]);

stControllers.controller('LoginModalCtrl', ['$scope', 'serviceData','$location', function ($scope, serviceData, $location) {

    $scope.user = {};

    $scope.tryLogin = function() {
        serviceData.get('api/user/auth', { login : $scope.user.login, pass : $scope.user.pass}).then(function(data) {
            $scope.loggedIn = data.status == 1;
            if ($scope.loggedIn) {
                $location.path('/news');
            }
        })
    };

    // execute on initialization
    console.log($scope.$parent);
}]);

stControllers.controller('ClassCtrl',['$scope', '$routeParams', 'courses', function($scope, $routeParams, courses){
    $scope.classID = $routeParams.classID;
    $scope.courses = courses;
}]);

stControllers.controller('HeaderCtrl', ['$scope','serviceData', function ($scope, serviceData) {
    $scope.courses = [];

    serviceData.get('api/courses/all').then(function(data) {
        $scope.courses  = (data.status && data.status == 1) ? data.courses : [];
    })
}]);

stControllers.controller('NewsCtrl', ['$scope','$http', 'serviceData', function($scope, $http, serviceData) {

    $scope.news = [];
    $scope.length = 0;

    $scope.lastNews = function(k) {
        $scope.visNews = [];
        $scope.startPos = $scope.length - $scope.CurPage * k;
        j = 0;
        for (i = $scope.startPos; j < k; j++, i++) {
            $scope.visNews[j] = $scope.news[i];
        }
        return $scope.visNews.reverse();
    };

    $scope.prevPage = function() {
        if ($scope.CurPage < $scope.totalPages) {
            $scope.CurPage += 1;
        }
    };

    $scope.nextPage = function() {
        if ($scope.CurPage > 1) {
            $scope.CurPage -= 1;
        }
    };

    // execute on initialization
    serviceData.get('api/news/all').then(function(data) {
        if (data.status == 1) {
            $scope.news = data.news;
            $scope.length = data.news.length;
        } else {
            $scope.news = [];
            $scope.length = 0;
        }

        $scope.CurPage = 1;
        $scope.totalPages = Math.ceil($scope.length / 3);
    });

}]);
