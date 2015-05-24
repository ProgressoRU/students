(function () {
    'use strict';

    angular
        .module('students')
        .controller('WrapController', WrapController);

    WrapController.$inject = ['Session', 'AuthService', 'DataService', 'alertService', 'taOptions', '$modal'];

    function WrapController(Session, AuthService, DataService, alertService, taOptions, $modal) {

        /*jshint validthis: true */
        var vm = this;

        vm.closeAlert = alertService.closeAlert;
        vm.currentUser = Session;
        vm.disciplines = [];
        vm.groups = [];

        vm.isAuthenticated = isAuthenticated;
        vm.clearDisciplineList = clearDisciplineList;
        vm.clearGroupList = clearGroupList;
        vm.getDisciplines = getDisciplines;
        vm.getGroups = getGroups;
        vm.logout = logout;
        vm.newGroup = newGroup;
        vm.openSubs = openSubs;

        activate();

        ////////////

        function activate() {
            getGroups(); //TODO: нужно выполнять только у админов и учителей
            getDisciplines();
            taOptions.toolbar = [ //перенести куда-нибудь
                ['h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                ['html', 'insertImage', 'insertLink', 'insertVideo', 'charcount']
            ];
        }

        //локальная проверка авторизации
        function isAuthenticated() {
            return AuthService.isAuthenticated();
        }

        //выход из системы
        function logout() {
            clearDisciplineList();
            clearGroupList();
            return AuthService.logout();
        }

        //получение доступных предметов
        function getDisciplines() {
            DataService.get('api/disciplines/my').then(function (data) {
                vm.disciplines = (data.status && data.status == 1) ? data.disciplines : [];
            })
        }

        //получение списка групп
        function getGroups() {
            DataService.get('api/groups/list').then(function (data) {
                vm.groups = (data.status && data.status == 1) ? data.groups : [];
            })
        }

        //очистка списка предметов
        function clearDisciplineList() {
            vm.disciplines = [];
        }

        //очистка списка групп
        function clearGroupList() {
            vm.groups = [];
        }

        //subscription modal
        function openSubs(size) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'subscribeModal.html',
                controller: 'SubscribeCtrl',
                size: size
            });
            modalInstance.result.then(function (success) {
                if (success) getDisciplines();
            });
        }

        //new group modal
        function newGroup(size) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newGroupModal.html',
                controller: 'newGroupCtrl',
                size: size
            });
            modalInstance.result.then(function (success) {
                if (success) getGroups();
            });
        }
    }
})();