(function () {
    'use strict';

    angular
        .module('students')
        .controller('GroupController', GroupController);

    GroupController.$inject = ['$routeParams', 'GroupService', 'DisciplineService', '$location'];

    function GroupController($routeParams, GroupService, DisciplineService, $location) {
        /*jshint validthis: true */
        var vm = this;

        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        vm.accessData = GroupService.access;
        vm.groupId = $routeParams.groupId;
        vm.group = GroupService.details;
        vm.disciplines = DisciplineService.disciplines;
        vm.minDate = null;
        vm.opened = false;
        vm.expirationOn = false;
        vm.subscribers = GroupService.subscribers;
        vm.changed = false;
        vm.addList = [];
        vm.deleteList = [];

        vm.deleteGroup = deleteGroup;
        vm.prepareData = prepareData;
        vm.open = open;
        vm.saveAccessData = saveAccessData;
        vm.saveGroup = saveGroup;
        vm.setAccess = setAccess;
        vm.toggleMin = toggleMin;
        vm.turnExpiration = turnExpiration;
        vm.unsubscribeUser = unsubscribeUser;

        activate();

        ///////////////////////////////

        function activate() {
            prepareData();
            toggleMin();
        }

        function deleteGroup() {
            GroupService.deleteGroup(vm.groupId).success(function () {
                GroupService.get(true);
                $location.url('/news');
            })
        }

        function prepareData() {
            vm.addList = [];
            vm.deleteList = [];
            if (vm.group.expire_date != null) {
                var t = vm.group.expire_date.split(/[- :]/);
                vm.group.expire_date = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
                vm.expirationOn = true;
            }
            vm.disciplines.forEach(function (disicipline) {
                disicipline.access = false;
                var currentDiscipline = disicipline.discipline_id;
                for (var i = 0; i < vm.accessData.length; i++) {
                    if (currentDiscipline == vm.accessData[i].discipline_id) {
                        disicipline.access = true;
                    }
                }
            });
        }

        function saveAccessData() {
            GroupService.saveAccessData(vm.addList, vm.deleteList, vm.groupId).success(function () {
                vm.changed = false;
                GroupService.getGroupAccess(vm.groupId).then(function()
                {
                    vm.accessData = GroupService.access;
                    prepareData();
                })
            })
        }

        function saveGroup() {
        }

        function setAccess(idInDb, idInJson) {
            vm.disciplines[idInJson].access = !vm.disciplines[idInJson].access;
            vm.changed = true;
            if (vm.disciplines[idInJson].access) {
                if (vm.deleteList != null)
                    for (var i = 0; i < vm.deleteList.length; i++)
                        if (vm.deleteList[i] == idInDb)
                            vm.deleteList.splice(i, 1);
                var exist = false;
                for (i = 0; i < vm.accessData.length; i++)
                    if (vm.accessData[i].discipline_id == idInDb)
                        exist = true;
                if (!exist)
                    vm.addList.push(idInDb);
            }
            else {
                if (vm.addList != null)
                    for (i = 0; i < vm.addList.length; i++)
                        if (vm.addList[i] == idInDb)
                            vm.addList.splice(i, 1);
                exist = false;
                for (i = 0; i < vm.accessData.length; i++)
                    if (vm.accessData[i].discipline_id == idInDb)
                        exist = true;
                if (exist)
                    vm.deleteList.push(idInDb);
            }

            if (vm.addList.length == 0 && vm.deleteList.length == 0)
                vm.changed = false;
        }

        function open($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.opened = true;
        }

        function toggleMin() {
            vm.minDate = vm.minDate ? null : new Date();
        }

        function turnExpiration() {
            if (vm.expirationOn)
                vm.group.expire_date = new Date();
            else
                vm.group.expire_date = null;
        }

        function unsubscribeUser(userId, index){
            GroupService.unsubscribe(userId, vm.groupId).success(function(){
                vm.subscribers.splice(index,1)
            })
        }

    }
})
();
