var stCtrls = angular.module('stCtrls',[]);

stCtrls.controller('HomeCtrl',['$scope', function($scope){
}
    ]);

stCtrls.controller('ClassCtrl',['$scope', '$routeParams',   
    function($scope, $routeParams) {
    $scope.classID = $routeParams.classID;
    $scope.classDesc = $routeParams.txtShortDesc;
    }]);

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
            $scope.length = data.news.length;
            $scope.CurPage = 1;
            $scope.totalPages = Math.ceil($scope.length / 3);
            $scope.lastNews = function(k)
            {
                $scope.visNews = new Array();
                $scope.startPos = $scope.length - $scope.CurPage * k;
                j = 0;
                    for(i=$scope.startPos;j<k;j++,i++)
                    $scope.visNews[j] = data.news[i];
                return $scope.visNews.reverse();
            }
            $scope.prevPage = function()
            {
                if ($scope.CurPage < $scope.totalPages)
                $scope.CurPage+=1;
            }
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