var stControllers = angular.module('stControllers', []);

// Wrap controller
stControllers.controller('WrapCtrl', ['$scope', 'serviceData', 'AuthService', 'USER_ROLES',
    function ($scope, serviceData, AuthService, USER_ROLES) {

    serviceData.get('api/classes/all').then(function(data) {
        $scope.classes = (data.status && data.status == 1) ? data.classes : [];
    });

    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;

    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
        console.log($scope.currentUser);
    };

}]);

stControllers.controller('HomeCtrl', ['$scope', function($scope) {

}]);

stControllers.controller('LoginModalCtrl', ['$scope','AuthService', '$rootScope', 'AUTH_EVENTS',
    function ($scope, AuthService, $rootScope, AUTH_EVENTS) {

        $scope.login = function (credentials) {
            AuthService.login(credentials).then(function (user) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $scope.setCurrentUser(user);
            }, function () {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        };
    // execute on initialization
        $scope.credentials = {
            username: '',
            pass: ''
        };
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
        var j = 0;
        for (var i = $scope.startPos; j < k; j++, i++) {
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
