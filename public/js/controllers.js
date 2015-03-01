var stControllers = angular.module('stControllers', []);

// Обертка (wrap)
stControllers.controller('WrapCtrl', ['$scope', 'Session', 'AuthService', 'serviceData',
    function ($scope, Session, AuthService, serviceData) {
        //объявляем функции, обращающиеся при вызове к AuthService
        $scope.isAuthenticated = function () {
            return AuthService.isAuthenticated(); //а попроще!?
        };

        $scope.logout = function () {
            return AuthService.logout();
        };
        //текущий пользователь берется из сервиса сессий
        $scope.currentUser = Session;
        //получаем список всех предметов через вызов к API
        serviceData.get('api/classes/all').then(function (data) {
            $scope.classes = (data.status && data.status == 1) ? data.classes : [];
        })
    }]);

stControllers.controller('HomeCtrl', ['$scope', function ($scope) {

}]);

stControllers.controller('LoginModalCtrl', ['$scope', 'AuthService', '$rootScope', 'AUTH_EVENTS', '$location',
    function ($scope, AuthService, $rootScope, AUTH_EVENTS, $location) {
        //todo: вывод ошибок
        $scope.login = function (credentials) {
            //отправляем сервису Авторизации необходимые данные
            AuthService.login(credentials).then(function (user) {
                $reply = user.status;
                console.log($reply); //DEBUG
                console.log(AUTH_EVENTS[$reply]); //DEBUG
                //оповещаем все нижестоящие контроллеры об ответе сервера
                $rootScope.$broadcast(AUTH_EVENTS[$reply]);
                //если ответ 200:OK
                if ($reply == 200) {
                    $scope.success = true;
                    if ($location.path != '/login') //TODO: исправить. И научиться писать комментарии. Что исправить то надо?!
                        $location.url('/news');
                }
                else {
                    $scope.loginFailed = true;
                    $scope.success = false;
                }
            });
        };
        // execute on initialization
        $scope.credentials = {
            username: '',
            pass: ''
        };
        $scope.success = false;
    }]);

stControllers.controller('ClassCtrl', ['$scope', '$routeParams', 'serviceData', function ($scope, $routeParams, serviceData) {
    //из параметров маршрута берем ID предмета
    $scope.classID = $routeParams.classID;
    //вызываем API, чтобы получить все лекции по предмету
    serviceData.get('api/classes/info', {id: $scope.classID}).then(function (data) {
        $scope.articles = (data.status && data.status == 1) ? data.lectures : [];
    })
}]);

stControllers.controller('HeaderCtrl', ['$scope', function ($scope) {

}]);

stControllers.controller('NewsCtrl', ['$scope', 'serviceData',
    function ($scope, serviceData) {

        $scope.news = [];
        $scope.length = 0;
        //возможно стоит ограничить количество получаемых новостей на серверной стороне
        //TODO: приведение даты к нормальному виду
        $scope.lastNews = function (k) {
            $scope.visNews = [];
            $scope.startPos = $scope.length - $scope.CurPage * k;
            var j = 0;
            for (var i = $scope.startPos; j < k; j++, i++) {
                $scope.visNews[j] = $scope.news[i];
            }
            return $scope.visNews.reverse();
        };

        $scope.prevPage = function () {
            if ($scope.CurPage < $scope.totalPages) {
                $scope.CurPage += 1;
            }
        };

        $scope.nextPage = function () {
            if ($scope.CurPage > 1) {
                $scope.CurPage -= 1;
            }
        };

        // execute on initialization
        serviceData.get('api/news/all').then(function (data) {
            $reply = data.status;
            console.log('News' + $reply); //DEBUG
            $scope.news = data.news;
            $scope.length = data.news.length;
            $scope.CurPage = 1;
            $scope.totalPages = Math.ceil($scope.length / 3);
        });

    }]);
