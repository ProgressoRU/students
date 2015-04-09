var stControllers = angular.module('stControllers', []);

// Обертка (wrap)
stControllers.controller('WrapCtrl', ['$scope', 'Session', 'AuthService', 'serviceData', 'alertService',
    function ($scope, Session, AuthService, serviceData, alertService) {
        //объявляем функции, обращающиеся при вызове к AuthService
        $scope.isAuthenticated = function () {
            return AuthService.isAuthenticated();
        };

        $scope.logout = function () {
            $scope.clearDisciplineList();
            return AuthService.logout();
        };
        $scope.closeAlert = alertService.closeAlert;
        //текущий пользователь берется из сервиса сессий
        $scope.currentUser = Session;
        //получение доступных предметов
        $scope.getDisciplines = function () {
            serviceData.get('api/disciplines/all').then(function (data) {
                $scope.disciplines = (data.status && data.status == 1) ? data.disciplines : [];
            })
        };
        $scope.clearDisciplineList = function()
        {
            $scope.disciplines = [];
        }
        //on init
        $scope.getDisciplines();
    }]);

stControllers.controller('HomeCtrl', ['$scope', function ($scope) {

}]);

stControllers.controller('LoginModalCtrl', ['$scope', 'AuthService', '$rootScope', 'AUTH_EVENTS', '$route', 'alertService',
    function ($scope, AuthService, $rootScope, AUTH_EVENTS, $route, alertService) {
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
                    alertService.add("success", "Вход выполнен");
                    $route.reload();
                    $scope.getDisciplines();
                }
                else {
                    alertService.add("danger", "Имя и/или пароль введены неверно.");
                }
            });
        };
        // execute on initialization
        $scope.credentials = {
            username: '',
            pass: ''
        };
    }]);

stControllers.controller('DisciplineCtrl', ['$scope', '$routeParams', 'serviceData', 'alertService', '$compile',
    function ($scope, $routeParams, serviceData, alertService, $compile) {
        //из параметров маршрута берем ID предмета
        $scope.disciplineID = $routeParams.disciplineID;
        for (var i = 0; i < $scope.$parent.disciplines.length; i++)
            if ($scope.$parent.disciplines[i].discipline_id == $scope.disciplineID) {
                //TODO: Temp fix. Not working with page refresh!
                $scope.disciplineTitle = $scope.$parent.disciplines[i].title;
                $scope.disciplineDescription = $scope.$parent.disciplines[i].description;
            }
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
        $scope.eventRender = function (event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };
        $scope.eventClick = function (date, jsEvent, view) {
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

stControllers.controller('NewsCtrl', ['$scope', 'serviceData', 'alertService',
    function ($scope, serviceData, alertService) {
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

        $scope.turnEditMode = function (id) {
            for (i = 0; i < $scope.length; i++)
                if ($scope.news[i].news_id == id) {
                    $scope.idInDB = $scope.news[i].news_id;
                    $scope.idInJSON = i;
                }
            $scope.editable = {
                news: $scope.news[$scope.idInJSON].news,
                title: $scope.news[$scope.idInJSON].title
            };
            $scope.editMode = true;
        };

        $scope.cancelEdit = function () {
            $scope.editMode = false;
            $scope.editable = null;
            $scope.idInDB = null;
            $scope.idInJSON = null;
        };

        $scope.performEdit = function () {
            //TODO: проверки на пустые переменные
            serviceData.get('api/news/edit', {
                id: $scope.idInDB,
                title: $scope.editable.title,
                news: $scope.editable.news
            }).then(function (data) {
                if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
                //если пришел ответ с запретом
                else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен!");
                //Если доступ разрешен
                else if (data.status == 200) {
                    alertService.add("success", "Новость изменена!");
                    $scope.editMode = false;
                    $scope.editable = null;
                    $scope.idInDB = null;
                    $scope.idInJSON = null;
                    $scope.getNews();
                }
            })
        };

        // execute on initialization
        $scope.getNews = function () {
            serviceData.get('api/news/all').then(function (data) {
                $reply = data.status;
                console.log('News' + $reply); //DEBUG
                $scope.news = data.news;
                $scope.length = data.news.length;
                $scope.CurPage = 1;
                $scope.totalPages = Math.ceil($scope.length / 3);
                $scope.editMode = false;
            });
        };
        $scope.getNews();
        $scope.editable = null;

    }]);
