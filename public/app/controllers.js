var stControllers = angular.module('stControllers', []);

stControllers.controller('newGroupCtrl', ['$scope', '$modalInstance', 'DataService', 'alertService', function ($scope, $modalInstance, DataService, alertService) {
    $scope.turnExpiration = 0;
    $scope.group = {
        title: '',
        passcode: '',
        expiration: new Date()
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        if ($scope.group.title == null) alertService.add("danger", 'Введите название группы');
        else if ($scope.group.passcode == null || $scope.group.passcode.length < 3)
            alertService.add("danger", 'Кодовое слово должно содержать не менее 3 символов и быть уникальным.');
        else DataService.get('api/groups/new', {
                title: $scope.group.title,
                passcode: $scope.group.passcode,
                expirationFlag: $scope.turnExpiration,
                expiration: $scope.group.expiration
            }).then(function (data) {
                if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
                //обработка ошибок
                else if (data.status == 21) alertService.add("danger", "Не заполнены ключевые поля.");
                else if (data.status == 22) alertService.add("danger", "Кодовое слово уже используется. Попробуйте изменить его.");
                else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен");
                else if (data.status == 500) alertService.add("danger", "Произошла ощибка. Обратитесь к администратору");
                else if (data.status == 200) {
                    alertService.add("success", "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> Группа создана!");
                    var success = true;
                    $modalInstance.close(success);
                }
            })
    };

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.weekAhead = function () {
        $scope.group.expiration.setDate($scope.group.expiration.getDate() + 14);
    };
    $scope.weekAhead();

}]);

stControllers.controller('SubscribeCtrl', ['$scope', '$modalInstance', 'DataService', 'alertService', function ($scope, $modalInstance, DataService, alertService) {
    $scope.passcode = '';

    $scope.ok = function () {
        DataService.get('api/groups/subscribe', {
            passcode: $scope.passcode
        }).then(function (data) {
            if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
            //обработка ошибок
            else if (data.status == 21) alertService.add("danger", "Ключевое слово не получено сервером.");
            else if (data.status == 22) alertService.add("danger", "Ключевое слово не подходит.");
            else if (data.status == 23) alertService.add("danger", "Ключевое слово устарело. Обратитесь за новым к преподавателю.");
            else if (data.status == 24) alertService.add("danger", "Возникла ошибка при выполнении запроса. Обратитесь к администратору!");
            else if (data.status == 25) alertService.add("danger", "Вы не можете подписаться на группу, изучающую предметы на которые вы уже подписаны.");
            else if (data.status == 26) alertService.add("danger", "Вы уже подписаны на эту группу.");
            else if (data.status == 200) {
                alertService.add("success", "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> Подписка оформлена!");
                var success = true;
                $modalInstance.close(success);
            }
        })
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

stControllers.controller('HomeCtrl', ['$scope', function ($scope) {

}]);

stControllers.controller('LoginModalCtrl', ['$scope', 'AuthService', '$rootScope', 'AUTH_EVENTS', '$route', 'alertService', 'DataService',
    function ($scope, AuthService, $rootScope, AUTH_EVENTS, $route, alertService, DataService) {
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
                    $scope.wrap.getDisciplines();
                    $scope.wrap.getGroups();
                }
                else {
                    alertService.add("danger", "Имя и/или пароль введены неверно.");
                }
            });
        };

        $scope.regUser = function (regData) {
            if (regData.username.length <= 3 || regData.username.length >= 16)
                alertService.add("danger", 'Имя пользователя должно содержать более 3, но менее 16 символов');
            else if (regData.pass.length <= 6)
                alertService.add("danger", 'Пароль должен содержать более 6 символов');
            else {
                DataService.get('api/user/reg', {
                    username: regData.username,
                    pass: regData.pass,
                    passcode: regData.passcode,
                    group: regData.group,
                    surname: regData.surname,
                    name: regData.name
                }).then(function (data) {
                    if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
                    //обработка ошибок
                    else if (data.status == 21) alertService.add("danger", "Имя пользователя должно содержать более 3, но менее 16 символов");
                    else if (data.status == 22) alertService.add("danger", "Пароль должен содержать более 6 символов.");
                    else if (data.status == 23) alertService.add("danger", "Не указано кодовое слово");
                    else if (data.status == 24) alertService.add("danger", "Не указана группа");
                    else if (data.status == 25) alertService.add("danger", "Срок действия кодового слова истек. Обратитесь к учителю");
                    else if (data.status == 26) alertService.add("danger", "Кодовое слово не подходит.");
                    else if (data.status == 27) alertService.add("danger", "Имя уже занято");
                    else if (data.status == 28) alertService.add("danger", "Возникла ошибка. Обратитесь к администратору.");
                    else if (data.status == 29) alertService.add("danger", "Укажите имя и фамилию");
                    else if (data.status == 200) {
                        alertService.add("success", "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> Регистрация завершена");
                        $scope.toAuth();
                    }

                })
            }
        };

        $scope.toReg = function () {
            $scope.auth = false;
            $scope.reg = true;
            $scope.regData = null;
        };

        $scope.toAuth = function () {
            $scope.auth = true;
            $scope.reg = false;
            $scope.credentials = null;
        };

        // execute on initialization
        $scope.reg = false;
        $scope.auth = true;
        $scope.credentials = {
            username: '',
            pass: '',
            rememberMe: false
        };
        $scope.regData =
        {
            username: '',
            pass: '',
            passcode: '',
            group: '',
            name: '',
            surname: ''
        }
    }]);

stControllers.controller('DisciplineCtrl', ['$scope', '$routeParams', 'DataService', 'alertService', '$compile',
    function ($scope, $routeParams, DataService, alertService, $compile) {
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
                                start: $scope.lectures[i].date_deadline,
                                allDay: true
                            });
                    callback(events);
                }
            }];
        //вызываем API, чтобы получить все лекции по предмету
        DataService.get('api/disciplines/info', {id: $scope.disciplineID}).then(function (data) {
            //если ответ не пришел
            if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
            //если пришел ответ с запретом
            else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен!");
            //Если доступ разрешен
            else if (data.status == 1) {
                //пытаемся передать в lectures, полученные данные
                $scope.lectures = data['lectures'] || [];
                $scope.attachments = data['attachments'] || [];
                $scope.discipline = data['discipline'] || [];
                $scope.isEditor = data['isEditor'] || false;
                $scope.perm = data['perm'] || null;
                for (var i = 0; i < $scope.lectures.length; i++) {
                    var event = {};
                    event = {
                        title: $scope.lectures[i].title,
                        start: $scope.lectures[i].date_deadline,
                        allDay: true
                    };
                    $scope.events[i] = event;
                }
                if ($scope.wrap.currentUser.userRole == 'admin' || $scope.isEditor || $scope.wrap.disciplines.creator_id == $scope.wrap.currentUser.userId)
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
            DataService.get('api/disciplines/delete_lesson', {id: id}).then(function (data) {
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

        $scope.newPost = function () {
            $scope.postMode = true;
            $scope.editMode = false;
            $scope.editable = {
                news: '',
                title: '',
                attachments: []
            };
            $scope.idInDB = 0;
            $scope.idInJSON = null;
            $scope.today();
        };

        $scope.turnEditMode = function (idInDb, idInJson) {
            $scope.idInDB = idInDb;
            $scope.idInJSON = idInJson;
            $scope.editable = {
                news: $scope.lectures[idInJson].description,
                title: $scope.lectures[idInJson].title,
                attachments: []
            };
            for (i = 0; i < $scope.attachments.length; i++)
                if ($scope.attachments[i].lecture_id == idInDb) {
                    $scope.editable.attachments.push($scope.attachments[i]);
                    var last = $scope.editable.attachments.length - 1;
                    $scope.editable.attachments[last].deleted = false;
                    $scope.editable.attachments[last].editing = false; //сейчас редактируется
                    $scope.editable.attachments[last].edited = false; //отредактировано
                    $scope.editable.attachments[last].new = false; //новый
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
                new: true,
                deleted: false
            });
        };

        $scope.performEdit = function () {
            if ($scope.editable.title == null || $scope.editable.news == null)
                alertService.add("danger", 'Материал должен содержать заголовок и текст!');
            else if ($scope.editable.title.length <= 3 || $scope.editable.title.length > 100)
                alertService.add("danger", 'Заголовок должен содержать более 3, но менее 100 символов');
            else {
                DataService.get('api/disciplines/edit_lesson', {
                    id: $scope.idInDB,
                    disciplineId: $scope.disciplineID,
                    title: $scope.editable.title,
                    description: $scope.editable.news,
                    attachments: $scope.editable.attachments
                }).then(function (data) {
                    if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
                    //если пришел ответ с запретом
                    else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен!");
                    else if (data.status == 500) alertService.add("danger", "500: Сервер не смог выполнить запрос.");
                    else if (data.status == 25) alertService.add("warning", "Материал сохранен, но возникла проблема при сохранении вложений");
                    else if (data.status == 26) alertService.add("danger", "Материал должен содержать заголовок и текст!");
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
    }]);

stControllers.controller('HeaderCtrl', ['$scope', function ($scope) {

}]);

stControllers.controller('NewsCtrl', ['$scope', 'DataService', 'alertService',
    function ($scope, DataService, alertService) {
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
                DataService.get('api/news/edit', {
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
            DataService.get('api/news/delete', {id: id}).then(function (data) {
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
            DataService.get('api/news/all').then(function (data) {
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

stControllers.controller('DisciplineEditCtrl', ['$scope', function ($scope) {

}]);

stControllers.controller('GroupCtrl', ['$scope', function ($scope) {

}]);

stControllers.controller('UserAccessCtrl', ['$scope', 'DataService', 'alertService', function ($scope, DataService, alertService) {
    $scope.roles = [
        {name: 'Студент', data: 'student'},
        {name: 'Учитель', data: 'teacher'},
        {name: 'Админ', data: 'admin'}];
    $scope.emptyRegData = function () {
        $scope.regData =
        {
            username: '',
            pass: '',
            name: '',
            surname: '',
            role: ''
        };
    }
    $scope.emptyRegData();

    $scope.getTeachersAndAdmins = function () {
        DataService.get('api/user/userList').then(function (data) {
            //если ответ не пришел
            if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
            //если пришел ответ с запретом
            else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен или произошла ошибка");
            //Если доступ разрешен
            else if (data.status == 200) {
                $scope.userList = data.userList;
            }
        })
    };

    $scope.getTeachersAndAdmins();

    $scope.regData.role = $scope.roles[0];

    $scope.regUser = function (regData) {
        if (regData.username.length <= 3 || regData.username.length >= 16)
            alertService.add("danger", 'Имя пользователя должно содержать более 3, но менее 16 символов');
        else if (regData.pass.length <= 6)
            alertService.add("danger", 'Пароль должен содержать более 6 символов');
        else {
            DataService.get('api/user/reg', {
                username: regData.username,
                pass: regData.pass,
                surname: regData.surname,
                name: regData.name,
                role: regData.role.data
            }).then(function (data) {
                if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
                //обработка ошибок
                else if (data.status == 21) alertService.add("danger", "Имя пользователя должно содержать более 3, но менее 16 символов");
                else if (data.status == 22) alertService.add("danger", "Пароль должен содержать более 6 символов.");
                else if (data.status == 23) alertService.add("danger", "Не указано кодовое слово");
                else if (data.status == 24) alertService.add("danger", "Не указана группа");
                else if (data.status == 25) alertService.add("danger", "Срок действия кодового слова истек. Обратитесь к учителю");
                else if (data.status == 26) alertService.add("danger", "Кодовое слово не подходит.");
                else if (data.status == 27) alertService.add("danger", "Имя уже занято");
                else if (data.status == 28) alertService.add("danger", "Возникла ошибка. Обратитесь к администратору.");
                else if (data.status == 29) alertService.add("danger", "Укажите имя и фамилию");
                else if (data.status == 30) alertService.add("danger", "Недостаточно прав");
                else if (data.status == 31) alertService.add("danger", "Куки недостоверны");
                else if (data.status == 200) {
                    alertService.add("success", "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> Пользователь добавлен");
                    $scope.emptyRegData();
                    $scope.regData.role = $scope.roles[0];
                    $scope.getTeachersAndAdmins();
                }

            })
        }
    };

    $scope.promote = function (uId) {
        DataService.get('api/user/rights', {
            uId: uId,
            rights: 'admin'
        }).then(function (data) {
            if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
            //обработка ошибок
            else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен или произошла ошибка");
            else if (data.status == 20) alertService.add("danger", "Невозможно выполнить эту администрацию с администратором");
            else if (data.status == 21) alertService.add("danger", "Попытка установить неизвестный уровень прав");
            else if (data.status == 22) alertService.add("danger", "Недостаточно прав");
            //Если доступ разрешен
            else if (data.status == 200) {
                alertService.add("success", "Пользователь повышен");
                $scope.getTeachersAndAdmins();
            }
        })
    };

    $scope.demote = function (uId) {
        DataService.get('api/user/rights', {
            uId: uId,
            rights: 'student'
        }).then(function (data) {
            if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
            //обработка ошибок
            else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен или произошла ошибка");
            else if (data.status == 20) alertService.add("danger", "Невозможно выполнить эту администрацию с администратором");
            else if (data.status == 21) alertService.add("danger", "Попытка установить неизвестный уровень прав");
            else if (data.status == 22) alertService.add("danger", "Недостаточно прав");
            //Если доступ разрешен
            else if (data.status == 200) {
                alertService.add("success", "Пользователь понижен");
                $scope.getTeachersAndAdmins();
            }
        })
    };
}]);

