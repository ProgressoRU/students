(function () {
    'use strict';

    angular
        .module('students')
        .controller('NewGroupController', NewGroupController);

    NewGroupController.$inject = ['$modalInstance', 'DataService', 'alertService'];

    function NewGroupController($modalInstance, DataService, alertService) {
        /*jshint validthis: true */
        var vm = this;

        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        vm.group = {
            title: '',
            passcode: '',
            expiration: new Date()
        };
        vm.turnExpiration = 0;

        vm.cancel = cancel;
        vm.ok = ok;
        vm.open = open;
        vm.toggleMin = toggleMin;
        vm.weekAhead = weekAhead;

        activate();
        ///////////////////////////////
        function activate() {
            toggleMin();
            weekAhead();
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function ok() {
            if (vm.group.title == null) alertService.push(21);
            else if (vm.group.passcode == null || vm.group.passcode.length < 3)
                alertService.push(23);
            else DataService.send('api/groups/new', {
                    title: vm.group.title,
                    passcode: vm.group.passcode,
                    expirationFlag: vm.turnExpiration,
                    expiration: vm.group.expiration
                })
                    .success(function (/*data, status, headers, config*/) {
                        $modalInstance.close(true);
                    })
        }

        function open($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.opened = true;
        }

        function toggleMin() {
            vm.minDate = vm.minDate ? null : new Date();
        }

        function weekAhead() {
            vm.group.expiration.setDate(vm.group.expiration.getDate() + 14);
        }
    }

})();