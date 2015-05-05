var stControllers = angular.module('stControllers', []);

// Обертка (wrap)
stControllers.controller('WrapCtrl', ['$scope', 'Session', 'AuthService', 'serviceData', 'alertService', 'taOptions',
    function ($scope, Session, AuthService, serviceData, alertService, taOptions) {
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
            serviceData.get('api/disciplines/my').then(function (data) {
                $scope.disciplines = (data.status && data.status == 1) ? data.disciplines : [];
            })
        };
        $scope.clearDisciplineList = function () {
            $scope.disciplines = [];
        };
        //on init
        $scope.getDisciplines();
        taOptions.toolbar = [
            ['h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
            ['html', 'insertImage', 'insertLink', 'insertVideo', 'charcount']
        ];
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
        $scope.events = [];
        $scope.editable = null;
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
                $scope.discipline = data['discipline'] || [];
                $scope.isEditor = data['isEditor'] || false;
                for (var i = 0; i < $scope.lectures.length; i++) {
                    var event = {};
                    event = {
                        title: $scope.lectures[i].title,
                        start: $scope.lectures[i].date_dead_line,
                        allDay: true
                    };
                    $scope.events[i] = event;
                }
                if ($scope.currentUser.userRole == 'admin' || $scope.isEditor || $scope.discipline.creator_id == $scope.currentUser.userId)
                    $scope.canEdit = true;
                else $scope.canEdit = false;
                $scope.totalItems = data.lectures.length;
                $scope.editMode = false;
            }
            else alertService.add("danger", "Неизвестная ошибка. Обратитесь к администратору.")
        });
        //Тултипы
        $scope.eventRender = function (event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
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

        $scope.deletePost = function (id, jsonId) {
            serviceData.get('api/disciplines/delete_lesson', {id: id}).then(function (data) {
                if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
                //если пришел ответ с запретом
                else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен!");
                else if (data.status == 500) alertService.add("danger", "500: Сервер не смог выполнить запрос.");
                //Если доступ разрешен
                else if (data.status == 1) {
                    alertService.add("success", "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> Запись удалена!");
                    $scope.lectures.splice(jsonId, 1);
                }
            })
        };

        $scope.turnEditMode = function (idInDb, idInJson) {
            $scope.idInDB = idInDb;
            $scope.idInJSON = idInJson;
            $scope.editable = {
                news: $scope.lectures[idInJson].description,
                title: $scope.lectures[idInJson].title,
                deadline: $scope.lectures[idInJson].date_dead_line.replace(/(.+) (.+)/, "$1T$2Z"), //sring date format to 'date' format
                attachments: []
            };
            for (i = 0; i < $scope.attachments.length; i++)
                if ($scope.attachments[i].lecture_id == idInDb) {
                    $scope.editable.attachments.push($scope.attachments[i]);
                    $scope.editable.attachments[i].deleted = false;
                    $scope.editable.attachments[i].editing = false; //сейчас редактируется
                    $scope.editable.attachments[i].edited = false; //отредактировано
                    $scope.editable.attachments[i].new = false; //новый
                }
            $scope.editMode = true;
            $scope.postMode = false;
        };

        $scope.cancelEdit = function () {
            $scope.editMode = false;
            $scope.postMode = false;
            $scope.editable = null;
        };

        $scope.markAttachOnRemoval = function (idInDb, idInJson) {
            $scope.editable.attachments[idInJson].deleted = true;
        };

        $scope.restoreAttach = function (idInDb, idInJson) {
            $scope.editable.attachments[idInJson].deleted = false;
        };

        $scope.editAttach = function (idInDb, idInJson) {
            $scope.editable.attachments[idInJson].editing = true;
        };

        $scope.cancelAttachEdit = function (event, idInJson) {
            var item = event.currentTarget;
            $scope.editable.attachments[idInJson].title = item.getAttribute('data-title');
            $scope.editable.attachments[idInJson].description = item.getAttribute('data-description');
            $scope.editable.attachments[idInJson].url = item.getAttribute('data-url');
            $scope.editable.attachments[idInJson].editing = false;
            if ($scope.editable.attachments[idInJson].new == true) $scope.editable.attachments.splice(idInJson, 1);
        };

        $scope.saveAttach = function (idInJson) {
            var checks = true;
            if ($scope.editable.attachments[idInJson].title == '' ||
                $scope.editable.attachments[idInJson].description == '' ||
                $scope.editable.attachments[idInJson].url == '') {
                alertService.add("danger", 'Все поля должны быть заполнены');
                checks = false
            }
            if ($scope.editable.attachments[idInJson].title.length <= 3 || $scope.editable.attachments[idInJson].title.length > 100) {
                alertService.add("danger", 'Заголовок должен содержать более 3, но менее 100 символов');
                checks = false;
            }
            if ($scope.editable.attachments[idInJson].description.length <= 3 || $scope.editable.attachments[idInJson].description.length > 255) {
                alertService.add("danger", 'Описание должно содержать более 3, но менее 255 символов');
                checks = false;
            }
            if (checks) {
                if (!$scope.editable.attachments[idInJson].new) $scope.editable.attachments[idInJson].edited = true;
                $scope.editable.attachments[idInJson].editing = false;
            }
        };

        $scope.newAttach = function (lectureId) {
            $scope.editable.attachments.push({
                lecture_id: lectureId,
                title: "",
                url: "",
                description: "",
                editing: true,
                new: true
            });
        };

        $scope.performEdit = function () {
            if ($scope.editable.title == null || $scope.editable.news == null)
                alertService.add("danger", 'Материал должен содержать заголовок и текст!');
            else if ($scope.editable.title.length <= 3 || $scope.editable.title.length > 100)
                alertService.add("danger", 'Заголовок должен содержать более 3, но менее 100 символов');
            else {
                serviceData.get('api/disciplines/edit_lesson', {
                    id: $scope.idInDB,
                    title: $scope.editable.title,
                    description: $scope.editable.news,
                    deadline: $scope.editable.deadline,
                    attachments: $scope.editable.attachments
                }).then(function (data) {
                    if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
                    //если пришел ответ с запретом
                    else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен!");
                    else if (data.status == 500) alertService.add("danger", "500: Сервер не смог выполнить запрос.");
                    else if (data.status == 25) alertService.add("danger", "Новость должна содержать заголовок и текст!");
                    //Если доступ разрешен
                    else if (data.status == 200) {
                        alertService.add("success", "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> Материал сохранен!");
                        $scope.editMode = false;
                        $scope.postMode = false;
                        $scope.editable = null;
                        $scope.idInDB = null;
                        $scope.idInJSON = null;
                    }
                })
            }
        };
        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        $scope.today = function () {
            $scope.editable.deadline = new Date();
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datepicker = {'opened': true};
        };
    }])
;

stControllers.controller('HeaderCtrl', ['$scope', function ($scope) {

}]);

stControllers.controller('NewsCtrl', ['$scope', 'serviceData', 'alertService',
    function ($scope, serviceData, alertService) {
        $scope.currentPageNews = function (k) {
            $scope.visibleNews = [];
            startPosition = $scope.totalItems - $scope.currentPage * k;
            var j = 0;
            for (var i = startPosition; j < k; j++, i++) {
                $scope.visibleNews[j] = $scope.news[i];
            }
            return $scope.visibleNews.reverse();
        };

        $scope.newPost = function () {
            $scope.postMode = true;
            $scope.editMode = false;
            $scope.editable = {
                news: '',
                title: '',
                label: 0
            };
            $scope.idInDB = 0;
            $scope.idInJSON = null;
        };

        $scope.turnEditMode = function (id) {
            for (i = 0; i < $scope.totalItems; i++)
                if ($scope.news[i].news_id == id) {
                    $scope.idInDB = $scope.news[i].news_id;
                    $scope.idInJSON = i;
                }
            $scope.editable = {
                news: $scope.news[$scope.idInJSON].news,
                title: $scope.news[$scope.idInJSON].title,
                label: $scope.news[$scope.idInJSON].importance
            };
            $scope.editMode = true;
            $scope.postMode = false;
        };

        $scope.cancelEdit = function () {
            $scope.editMode = false;
            $scope.postMode = false;
            $scope.editable = null;
            $scope.idInDB = null;
            $scope.idInJSON = null;
        };

        $scope.performEdit = function () {
            if ($scope.editable.title == null || $scope.editable.news == null)
                alertService.add("danger", 'Новость должна содержать заголовок и текст!');
            else if ($scope.editable.title.length <= 3 || $scope.editable.title.length > 100)
                alertService.add("danger", 'Заголовок должен содержать более 3, но менее 100 символов');
            else {
                serviceData.get('api/news/edit', {
                    id: $scope.idInDB,
                    title: $scope.editable.title,
                    news: $scope.editable.news,
                    label: $scope.editable.label
                }).then(function (data) {
                    if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
                    //если пришел ответ с запретом
                    else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен!");
                    else if (data.status == 500) alertService.add("danger", "500: Сервер не смог выполнить запрос.");
                    else if (data.status == 25) alertService.add("danger", "Новость должна содержать заголовок и текст!");
                    //Если доступ разрешен
                    else if (data.status == 200) {
                        alertService.add("success", "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> Новость сохранена!");
                        $scope.editMode = false;
                        $scope.postMode = false;
                        $scope.editable = null;
                        $scope.idInDB = null;
                        $scope.idInJSON = null;
                        $scope.getNews();
                    }
                })
            }
        };

        $scope.deleteNews = function (id) {
            serviceData.get('api/news/delete', {id: id}).then(function (data) {
                if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
                //если пришел ответ с запретом
                else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен!");
                else if (data.status == 500) alertService.add("danger", "500: Сервер не смог выполнить запрос.");
                //Если доступ разрешен
                else if (data.status == 1) {
                    alertService.add("success", "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> Новость удалена!");
                    $scope.getNews();
                }
            })
        };

        $scope.getNews = function () {
            serviceData.get('api/news/all').then(function (data) {
                //если ответ не пришел
                if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
                //если пришел ответ с запретом
                else if (data.status == 500) alertService.add("danger", "400: Произошла ошибка");
                //Если доступ разрешен
                else if (data.status == 1) {
                    //console.log('News' + $reply); //DEBUG
                    $scope.news = data.news;
                    $scope.currentPage = 1;
                    $scope.totalItems = data.news.length;
                    $scope.editMode = false;
                }
            });
        };
        // execute on initialization
        $scope.news = [];
        $scope.getNews();
        $scope.editable = null;
    }
]);
