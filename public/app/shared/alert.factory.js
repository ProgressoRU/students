(function () {
    'use strict';

    angular
        .module('students')
        .factory('alertService', alertService);

    alertService.$inject = ['$timeout'];

    function alertService($timeout) {
        var alerts = [];
        var service = {
            add: add,
            closeAlert: closeAlert,
            getAlerts: getAlerts
        };
        return service;
        //////////////////////////
        function add(type, msg) {
            alerts.push({'type': type, 'msg': msg});
            $timeout(function () {
                alerts.splice(0, 1);
            }, 6000);
        }

        function closeAlert(index) {
            alerts.splice(index, 1);
        }

        function getAlerts()
        {
            return alerts;
        }
    }
})();