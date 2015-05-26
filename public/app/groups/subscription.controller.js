(function () {
    'use strict';

    angular
        .module('students')
        .controller('SubscriptionController', SubscriptionController);

    SubscriptionController.$inject = ['$modalInstance', 'DataService'];

    function SubscriptionController($modalInstance, DataService) {
        /*jshint validthis: true */
        var vm = this;

        vm.passcode = '';

        vm.cancel = cancel;
        vm.ok = ok;
        ///////////////////////////////
        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function ok() {
            DataService.send('api/groups/subscribe', {
                passcode: vm.passcode
            }).success(function (/*data, status, headers, config*/) {
                $modalInstance.close(true);
            })
        }
    }
})();