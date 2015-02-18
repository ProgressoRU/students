var stCtrls = angular.module('stCtrls',[]);
//Wrap controller
stCtrls.controller('WrapCtrl', ['$scope', 'srvcData', function ($scope, srvcData) {
        srvcData.get('api/classes/all')
        .then(function(data) {
            if (data.status == 1)
                $scope.classes = data.classes;
            //плохой случай
        })
}])

stCtrls.controller('HomeCtrl',['$scope', function($scope){
}
]);

stCtrls.controller('LoginCtrl', ['$scope','$modal', function ($scope,$modal) {
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
}])

stCtrls.controller('LoginModalCtrl', ['$scope', function ($scope) {
    $scope.user={};
    $scope.tryLogin = function() {
        console.log($scope.user.pass);

    }
}])

stCtrls.controller('ClassCtrl',['$scope', '$routeParams', 'srvcData', function($scope, $routeParams,srvcData){
    $scope.classID = $routeParams.classID;
    srvcData.get('api/classes/'+$scope.classID) //classesAPI call
        .then(function(data) {
            if (data.status == 1)
                $scope.lectures = data.lectures;
        console.log($scope.lectures);
            //плохой случай
})
}]);

stCtrls.controller('HeaderCtrl', ['$scope','srvcData', function ($scope, srvcData) {
    srvcData.get('api/courses/all')
        .then(function(data) {
            if (data.status == 1)
                $scope.courses  = data.courses;
        //добавить херовый случай
        })
}])

stCtrls.controller('NewsCtrl',['$scope','$http', 'srvcData',
    function($scope,$http, srvcData) {
            srvcData.get('api/news/all')
        .then(function(data) {
            if (data.status == 1)
                $scope.news=data.news;
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
