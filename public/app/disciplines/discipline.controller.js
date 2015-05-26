(function () {
    'use strict';

    angular
        .module('students')
        .controller('DisciplineController', DisciplineController);

    DisciplineController.$inject = ['$routeParams', 'DataService', 'alertService', '$compile', 'SessionService'];

    function DisciplineController($routeParams, DataService, alertService, $compile, SessionService) {
        /*jshint validthis: true */
        var vm = this;

        vm.disciplineId = $routeParams.disciplineId; //id предмета из маршрута
        vm.user = SessionService;
        vm.events = [];
        vm.lectures = [];
        vm.attachments = [];
        vm.discipline = [];
        vm.isEditor = false;
        vm.perm = null;
        vm.editable = null;
        vm.canEdit = false;
        vm.totalItems = 0;
        vm.oneAtATime = true;
        vm.eventSources = [];
        //настройки плагина FullCalendar
        vm.uiConfig = {
            calendar: {
                editable: false,
                height: "auto",
                firstDay: 1,
                header: {
                    right: 'today prev,next'
                },
                monthNames: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль',
                    'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
                titleFormat: 'Задания на MMMM'
            }
        };

        vm.cancelAttachEdit = cancelAttachEdit;
        vm.cancelEdit = cancelEdit;
        vm.deletePost = deletePost;
        vm.editAttach = editAttach;
        vm.getData = getData;
        vm.getEvents = getEvents;
        vm.markAttachOnRemoval = markAttachOnRemoval;
        vm.newAttach = newAttach;
        vm.newPost = newPost;
        vm.performEdit = performEdit;
        vm.restoreAttach = restoreAttach;
        vm.saveAttach = saveAttach;
        vm.turnEditMode = turnEditMode;

        activate();

        //////////////////////////
        function activate() {
            getData();
            getEvents();
        }

        function getData() {
            //вызываем API, чтобы получить все лекции по предмету
            DataService.send('api/disciplines/info', {id: vm.disciplineId}).success(function (data) {
                //пытаемся передать в lectures, полученные данные
                vm.lectures = data['lectures'] || [];
                vm.attachments = data['attachments'] || [];
                vm.discipline = data['discipline'] || [];
                vm.isEditor = data['isEditor'] || false;
                vm.perm = data['perm'] || null;
                for (var i = 0; i < vm.lectures.length; i++) {
                    var event = {};
                    event = {
                        title: vm.lectures[i].title,
                        start: vm.lectures[i].date_deadline,
                        allDay: true
                    };
                    vm.events[i] = event;
                }
                if (vm.user.userRole == 'admin' || vm.isEditor || vm.discipline.creator_id == vm.user.userId)
                    vm.canEdit = true;
                vm.totalItems = data.lectures.length;
                vm.editMode = false;
            });
        }

        function getEvents() {
            vm.eventSources = [
                { //источник событий для FullCalendar
                    events: vm.events //первый источник — массив, инициализируемый при инициализации скоупа.
                    //будет использоваться при первичной отрисовке календаря
                },
                {
                    events: function (start, end, timezone, callback) { //второй источник — массив, генерируемый функцией, при переходе на другой месяц
                        var events = [];
                        if (vm.lectures) //убедимся, что массив лекций уже существует
                            for (var i = 0; i < vm.lectures.length; i++)
                                events.push({
                                    title: vm.lectures[i].title,
                                    start: vm.lectures[i].date_deadline,
                                    allDay: true
                                });
                        callback(events);
                    }
                }]
        }

        function deletePost(id, jsonId) {
            DataService.send('api/disciplines/delete_lesson', {id: id}).success(function () {
                vm.lectures.splice(jsonId, 1);
            })
        }

        function newPost() {
            vm.postMode = true;
            vm.editMode = false;
            vm.editable = {
                body: '',
                title: '',
                attachments: []
            };
            vm.idInDb = 0;
            vm.idInJson = null;
        }

        function turnEditMode(idInDb, idInJson) {
            vm.idInDb = idInDb;
            vm.idInJson = idInJson;
            vm.editable = {
                body: vm.lectures[idInJson].description,
                title: vm.lectures[idInJson].title,
                attachments: []
            };
            for (var i = 0; i < vm.attachments.length; i++)
                if (vm.attachments[i].lecture_id == idInDb) {
                    vm.editable.attachments.push(vm.attachments[i]);
                    var last = vm.editable.attachments.length - 1;
                    vm.editable.attachments[last].deleted = false;
                    vm.editable.attachments[last].editing = false; //сейчас редактируется
                    vm.editable.attachments[last].edited = false; //отредактировано
                    vm.editable.attachments[last].new = false; //новый
                }
            vm.editMode = true;
            vm.postMode = false;
        }

        function cancelEdit() {
            vm.editMode = false;
            vm.postMode = false;
            vm.editable = null;
        }

        function markAttachOnRemoval(idInDb, idInJson) {
            vm.editable.attachments[idInJson].deleted = true
        }

        function restoreAttach(idInDb, idInJson) {
            vm.editable.attachments[idInJson].deleted = false;
        }

        function editAttach(idInDb, idInJson) {
            vm.editable.attachments[idInJson].editing = true;
        }

        function cancelAttachEdit(event, idInJson) {
            var item = event.currentTarget;
            vm.editable.attachments[idInJson].title = item.getAttribute('data-title');
            vm.editable.attachments[idInJson].description = item.getAttribute('data-description');
            vm.editable.attachments[idInJson].url = item.getAttribute('data-url');
            vm.editable.attachments[idInJson].editing = false;
            if (vm.editable.attachments[idInJson].new == true) vm.editable.attachments.splice(idInJson, 1);
        }

        function saveAttach(idInJson) {
            var checks = true;
            if (vm.editable.attachments[idInJson].title == '' ||
                vm.editable.attachments[idInJson].description == '' ||
                vm.editable.attachments[idInJson].url == '') {
                alertService.push(14);
                checks = false
            }
            if (vm.editable.attachments[idInJson].title.length <= 3 || vm.editable.attachments[idInJson].title.length > 100) {
                alertService.push(12);
                checks = false;
            }
            if (vm.editable.attachments[idInJson].description.length <= 3 || vm.editable.attachments[idInJson].description.length > 255) {
                alertService.push(15);
                checks = false;
            }
            if (checks) {
                if (!vm.editable.attachments[idInJson].new) vm.editable.attachments[idInJson].edited = true;
                vm.editable.attachments[idInJson].editing = false;
            }
        }

        function newAttach(lectureId) {
            vm.editable.attachments.push({
                lecture_id: lectureId,
                title: "",
                url: "",
                description: "",
                editing: true,
                new: true,
                deleted: false
            });
        }

        function performEdit() {
            if (vm.editable.title == null || vm.editable.body == null)
                alertService.push(11);
            else if (vm.editable.title.length <= 3 || vm.editable.title.length > 100)
                alertService.push(12);
            else {
                DataService.send('api/disciplines/edit_lesson', {
                    id: vm.idInDb,
                    disciplineId: vm.disciplineId,
                    title: vm.editable.title,
                    description: vm.editable.body,
                    attachments: vm.editable.attachments
                }).success(function () {
                    vm.editMode = false;
                    vm.postMode = false;
                    vm.editable = null;
                    vm.idInDb = null;
                    vm.idInJson = null;
                    getData();
                })
            }
        }
    }
})();