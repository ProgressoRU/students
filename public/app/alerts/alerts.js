(function () {
    'use strict';

    angular
        .module('alerts')
        .factory('alertService', alertService);

    alertService.$inject = ['$timeout', 'events'];

    function alertService($timeout, events) {
        var alerts = [];
        var service = {
            close: close,
            get: get,
            push: push
        };
        return service;
        //////////////////////////

        function push(code) {
            if (events[code])
                alerts.push({'type': events[code][0], 'msg': events[code][1]});
            else {
                alerts.push({'type': 'danger', 'msg': 'Возникла неизвестная ошибка. Обратитесь к администратору'});
            }
            $timeout(function () {
                alerts.splice(0, 1);
            }, 6000);
        }

        function close(index) {
            alerts.splice(index, 1);
        }

        function get() {
            return alerts;
        }
    }
})();