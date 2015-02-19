var stControllers = angular.module('stControllers',[]);

//Wrap controller
stControllers.controller('WrapCtrl', ['$scope', 'serviceData','$location', function ($scope, serviceData, $location) {
$scope.$watch(function() { return $location.path(); }, function(newValue, oldValue){
    console.log($scope.loggedIn);
    if ($scope.loggedIn == false && newValue != '/login'){
            $location.path('/login');
    }
});
        serviceData.get('api/classes/all')
        .then(function(data) {
            if (data.status == 1)
                $scope.classes = data.classes;
            //плохой случай
        })
}]);

stControllers.controller('HomeCtrl',['$scope', function($scope){
}
]);

stControllers.controller('LoginCtrl', ['$scope','$modal', function ($scope,$modal) {
    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'public/views/login.html',
            controller: 'LoginModalCtrl',
            size: size,
            resolve: {
                /*items: function () {
                 return $scope.items;
                 }*/
            }
        });
    }
}]);

stControllers.controller('LoginModalCtrl', ['$scope', 'serviceData','$location', function ($scope, serviceData,$location) {
        console.log($scope.$parent);
    $scope.user={};
    $scope.tryLogin = function() {
    serviceData.get('api/user/auth', { login : $scope.user.login, pass : $scope.user.pass}).
    then(function(data) {
        return data.status == 1 ? $scope.loggedIn=true : $scope.loggedIn=false;
    })
    if ($scope.loggedIn == true) $location.path('/news');
    }
    }]);

stControllers.controller('ClassCtrl',['$scope', '$routeParams', 'courses', function($scope, $routeParams, courses){
        console.log(courses.data);
    $scope.classID = $routeParams.classID;
    $scope.courses = courses;
}]);

stControllers.controller('HeaderCtrl', ['$scope','serviceData', function ($scope, serviceData) {
    serviceData.get('api/courses/all')
        .then(function(data) {
            if (data.status == 1)
                $scope.courses  = data.courses;
        //добавить херовый случай
        })
}]);

stControllers.controller('NewsCtrl',['$scope','$http', 'serviceData',
    function($scope,$http, serviceData) {
            serviceData.get('api/news/all')
        .then(function(data) {
            if (data.status == 1)
                $scope.news=data.news;
                $scope.length = data.news.length;
            $scope.CurPage = 1;
            $scope.totalPages = Math.ceil($scope.length / 3);
            $scope.lastNews = function(k)
            {
                $scope.visNews = [];
                $scope.startPos = $scope.length - $scope.CurPage * k;
                j = 0;
                    for(i=$scope.startPos;j<k;j++,i++)
                    $scope.visNews[j] = data.news[i];
                return $scope.visNews.reverse();
            };
            $scope.prevPage = function()
            {
                if ($scope.CurPage < $scope.totalPages)
                $scope.CurPage+=1;
            };
            $scope.nextPage = function()
            {
                if ($scope.CurPage > 1)
                    $scope.CurPage-=1;
            }
        })
        }]);
/*
function LoginCtrl($scope) {

} */
