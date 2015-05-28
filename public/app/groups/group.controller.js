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
        vm.groupId = $routeParams.groupId;
        vm.group = null;
        vm.disciplines = null;
        vm.minDate = null;
        vm.opened = false;
        vm.expirationOn = false;

        vm.getAvailableDisciplines = getAvailableDisciplines;
        vm.getGroupDetails = getGroupDetails;
        vm.open = open;
        vm.toggleMin = toggleMin;
        vm.turnExpiration = turnExpiration;

        activate();

        ///////////////////////////////

        function activate()
        {
            getGroupDetails(vm.groupId);
            getAvailableDisciplines();
            toggleMin();
        }

        function getAvailableDisciplines()
        {
            DisciplineService.get().success(function(data) {
                vm.disciplines = data.disciplines;
            })
        }

        function getGroupDetails(groupId)
        {
            GroupService.getDetails(groupId).success(function(data){
                vm.group = data.group;
                if (vm.group.expire_date != null) {
                    var t = vm.group.expire_date.split(/[- :]/);
                    vm.group.expire_date = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
                    vm.expirationOn = true;
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

        function turnExpiration()
        {
            if (vm.expirationOn)
                vm.group.expire_date = new Date();
            else
                vm.group.expire_date = null;
        }

    }
})();
