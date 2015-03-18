var stControllers = angular.module('stControllers', []);

// Обертка (wrap)
stControllers.controller('WrapCtrl', ['$scope', 'Session', 'AuthService', 'serviceData', 'alertService',
    function ($scope, Session, AuthService, serviceData, alertService) {
        //объявляем функции, обращающиеся при вызове к AuthService
        $scope.isAuthenticated = function () {
            return AuthService.isAuthenticated(); //а попроще!?
        };

        $scope.logout = function () {
            return AuthService.logout();
        };
        $scope.closeAlert = alertService.closeAlert;
        //текущий пользователь берется из сервиса сессий
        $scope.currentUser = Session;
        //получаем список всех предметов через вызов к API
        serviceData.get('api/disciplines/all').then(function (data) {
            $scope.disciplines = (data.status && data.status == 1) ? data.disciplines : [];
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
                //console.log($reply); //DEBUG
                //console.log(AUTH_EVENTS[$reply]); //DEBUG
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

stControllers.controller('DisciplineCtrl', ['$scope', '$routeParams', 'serviceData', 'alertService', '$compile',
    function ($scope, $routeParams, serviceData, alertService, $compile) {
        //из параметров маршрута берем ID предмета
        $scope.disciplineID = $routeParams.disciplineID;
        $scope.events = [];
        //eventSources — массив объектов, используемый плагином FullCalendar как источник событий
        $scope.eventSources = [{
                events: $scope.events //первый источник — массив, инициализируемый при инициализации скоупа.
                                      //будет использоваться при первичной отрисовке календаря
            },
            {
                events: function (start, end, timezone, callback) { //второй источник — массив, генерируемый функцией, при переходе на другой месяц
                    var events = [];
                    if ($scope.lectures) //убедимся, что массив лекций уже существует
                        for (var i = 0; i < $scope.lectures.length; i++)
                            events.push({
                                title: $scope.lectures[i].title,
                                start: $scope.lectures[i].date_dead_line,
                                allDay: true
                            });
                    callback(events);
                }
            }];
        //вызываем API, чтобы получить все лекции по предмету
        serviceData.get('api/disciplines/info', {id: $scope.disciplineID}).then(function (data) {
            //если ответ не пришел
            if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
            //если пришел ответ с запретом
            else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен!");
            //Если доступ разрешен
            else if (data.status == 1) {
                //пытаемся передать в lectures, полученные данные
                $scope.lectures = data['lectures'] || [];
                $scope.attachments = data['attachments'] || [];
                $scope.results = data['results'] || [];
                for (var i = 0; i < $scope.lectures.length; i++) {
                    var event = {};
                    event = {
                        title: $scope.lectures[i].title,
                        start: $scope.lectures[i].date_dead_line,
                        allDay: true
                    };
                    $scope.events[i] = event;
                }
            }
            else alertService.add("danger", "Неизвестная ощибка. Обратитесь к администратору.")
        });
        //Тултипы
        $scope.eventRender = function( event, element, view ) {
            element.attr({'tooltip': event.title,
                'tooltip-append-to-body': true});
            $compile(element)($scope);
        };
        $scope.eventClick = function( date, jsEvent, view){
            $scope.alertMessage = (date.title + ' was clicked ');
        };

        $scope.oneAtATime = true;
        //настройки плагина FullCalendar
        $scope.uiConfig = {
            calendar: {
                editable: false,
                height: "auto",
                firstDay: 1,
                header: {
                    right: 'today prev,next'
                },
                monthNames: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль',
                    'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
                titleFormat: 'Задания на MMMM',
                eventRender: $scope.eventRender,
                eventClick: $scope.eventClick
            }
        };
    }]);

stControllers.controller('calendarCtrl', ['$scope'],
    function ($scope) {

    });

stControllers.controller('HeaderCtrl', ['$scope', function ($scope) {

}]);

stControllers.controller('NewsCtrl', ['$scope', 'serviceData',
    function ($scope, serviceData) {

        $scope.news = [];
        $scope.length = 0;
        //возможно стоит ограничить количество получаемых новостей на серверной стороне
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
