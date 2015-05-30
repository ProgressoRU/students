(function () {
    'use strict';

    angular
        .module('students')
        .controller('NewDisciplineController', NewDisciplineController);

    NewDisciplineController.$inject = ['$modalInstance', 'DataService', 'alertService'];

    function NewDisciplineController($modalInstance, DataService, alertService) {
        /*jshint validthis: true */
        var vm = this;

        vm.title = '';
        vm.description = '';

        vm.cancel = cancel;
        vm.ok = ok;
        ///////////////////////////////
        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function ok() {
            if (vm.title.length < 3 || vm.title.length > 64)
                alertService.push(51);
            else if (vm.description > 144)
                alertService.push(52);
            else
                DataService.send('api/disciplines/new', {
                    title: vm.title,
                    description: vm.description
                })
                    .success(function (/*data, status, headers, config*/) {
                        $modalInstance.close(true);
                    })
        }
    }
})();