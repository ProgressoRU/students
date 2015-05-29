(function () {
    'use strict';

    angular
        .module('students')
        .controller('GroupController', GroupController);

    GroupController.$inject = ['$routeParams', 'GroupService', 'DisciplineService'];

    function GroupController($routeParams, GroupService, DisciplineService) {
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

        vm.prepareData = prepareData;
        vm.open = open;
        vm.toggleMin = toggleMin;
        vm.turnExpiration = turnExpiration;

        activate();

        ///////////////////////////////

        function activate() {
            prepareData();
            // getAvailableDisciplines();
            // getSubscribers(vm.groupId);
            // getGroupAccessData(vm.groupId);
            toggleMin();
        }

        function prepareData() {
           // console.log(vm.accessData[1].discipline_id);
            if (vm.group.expire_date != null) {
                var t = vm.group.expire_date.split(/[- :]/);
                vm.group.expire_date = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
                vm.expirationOn = true;
            }
            vm.disciplines.forEach(function (disicipline) {
                disicipline.access = false;;
                var currentDiscipline = disicipline.discipline_id;
                for (var i = 0; i < vm.accessData.length; i++) {
                    if (currentDiscipline == vm.accessData[i].discipline_id) {
                        disicipline.access = true;
                    }
                }
            });
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

    }
})();
