(function () {
    'use strict';

    angular
        .module('students')
        .controller('WrapController', WrapController);

    WrapController.$inject = ['SessionService', 'AuthService', 'DataService', 'alertService', '$modal'];

    function WrapController(SessionService, AuthService, DataService, alertService, $modal) {

        /*jshint validthis: true */
        var vm = this;

        vm.alerts = alertService.get();
        vm.closeAlert = alertService.close;
        vm.currentUser = SessionService;
        vm.disciplines = [];
        vm.groups = [];

        vm.clearDisciplineList = clearDisciplineList;
        vm.clearGroupList = clearGroupList;
        vm.getDisciplines = getDisciplines;
        vm.getGroups = getGroups;
        vm.isAuthenticated = isAuthenticated;
        vm.logout = logout;
        vm.newGroupModal = newGroupModal;
        vm.newSubModal = newSubModal;

        activate();

        ////////////

        function activate() {
            getGroups(); //TODO: нужно выполнять только у админов и учителей
            getDisciplines();
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
            return DataService.send('api/disciplines/my').success(function (data) {
                vm.disciplines = data.disciplines;
            })
        }

        //получение списка групп
        function getGroups() {
            return DataService.send('api/groups/list').success(function (data) {
                vm.groups = data.groups;
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
        function newSubModal(size) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'public/app/groups/subscription.modal.html',
                controller: 'SubscriptionController as modal',
                size: size
            });
            modalInstance.result.then(function (success) {
                if (success) getDisciplines();
            });
        }

        //new group modal
        function newGroupModal(size) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'public/app/groups/newgroup.modal.html',
                controller: 'NewGroupController as modal',
                size: size
            });
            modalInstance.result.then(function (success) {
                if (success) getGroups();
            });
        }
    }
})();